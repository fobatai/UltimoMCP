import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { UltimoClient } from "../client.js";
import { success, error } from "../types.js";

export function registerCompositeTools(server: McpServer, client: UltimoClient) {
  server.tool(
    "get_job_full_detail",
    `Haal een job op met alle relevante gerelateerde informatie in één keer. Dit combineert de job
met equipment, medewerker, materialen, kosten, en statusgeschiedenis. Handig als je een volledig
beeld wilt van een werkorder zonder meerdere losse calls te doen.`,
    {
      id: z.string().describe("Het Job ID"),
    },
    async (input) => {
      try {
        const job = await client.getObject("Job", input.id, {
          expand: "Equipment,Employee,Priority,ProgressStatus,WorkOrderType,Vendor,Department,Site,PurchaseLines,Permits,ProgressStatusHistories",
        });
        return success(job);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_equipment_full_detail",
    `Haal een equipment-object op met alle relevante gerelateerde informatie: type, locatie,
meetpunten, reserveonderdelen, storingstypen. Geeft een compleet beeld van een asset.`,
    {
      id: z.string().describe("Het Equipment ID"),
    },
    async (input) => {
      try {
        const eq = await client.getObject("Equipment", input.id, {
          expand: "EquipmentType,Location,Site,MeasurementPoints,SpareParts,FailTypes",
        });
        return success(eq);
      } catch (e: any) {
        // Sommige expands zijn mogelijk niet beschikbaar, probeer met minder
        try {
          const eq = await client.getObject("Equipment", input.id, {
            expand: "EquipmentType",
          });
          return success(eq);
        } catch (e2: any) {
          return error(e.message);
        }
      }
    }
  );

  server.tool(
    "get_open_jobs_summary",
    `Haal een overzicht op van alle open/actieve jobs. Geeft een beknopte lijst met de belangrijkste
velden: ID, beschrijving, equipment, medewerker, prioriteit, en status. Ideaal voor een dagelijks
overzicht of planningsbord.`,
    {
      site: z.string().optional().describe("Filter op Site ID"),
      employee: z.string().optional().describe("Filter op Employee ID"),
      equipment: z.string().optional().describe("Filter op Equipment ID"),
      top: z.number().optional().describe("Maximum aantal (standaard 50)"),
    },
    async (input) => {
      try {
        const filters: string[] = [];
        // Status 'A' = Active in many Ultimo configs, but could vary
        // We filter on common active statuses
        if (input.site) filters.push(`Site eq '${input.site}'`);
        if (input.employee) filters.push(`Employee eq '${input.employee}'`);
        if (input.equipment) filters.push(`Equipment eq '${input.equipment}'`);

        const result = await client.getObjects("Job", {
          $top: input.top ?? 50,
          $filter: filters.length > 0 ? filters.join(" and ") : undefined,
          select: "Id,Description,Status,Equipment,Employee,Priority,ScheduledStartDate,TargetDate,PercentageComplete,WorkOrderType",
          $orderby: "ScheduledStartDate",
          count: true,
        });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_equipment_jobs",
    `Haal alle jobs op die gekoppeld zijn aan een specifiek equipment-item. Handig om de
onderhoudsgeschiedenis van een asset te bekijken of om te zien welke werkzaamheden gepland staan.`,
    {
      equipment_id: z.string().describe("Het Equipment ID"),
      include_closed: z.boolean().optional().describe("Ook afgesloten jobs tonen (standaard: false)"),
      top: z.number().optional().describe("Maximum aantal (standaard 50)"),
    },
    async (input) => {
      try {
        let filter = `Equipment eq '${input.equipment_id}'`;
        const result = await client.getObjects("Job", {
          $top: input.top ?? 50,
          $filter: filter,
          select: "Id,Description,Status,Employee,Priority,ScheduledStartDate,StatusCompletedDate,TotalCost",
          $orderby: "RecordCreateDate desc",
          count: true,
        });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_stock_overview",
    `Haal een voorraadoverzicht op voor een specifiek artikel of magazijn. Combineert
artikelgegevens met voorraadniveaus per magazijn. Handig voor inkoopplanning.`,
    {
      article_id: z.string().optional().describe("Filter op Article ID"),
      warehouse_id: z.string().optional().describe("Filter op Warehouse ID"),
      top: z.number().optional().describe("Maximum aantal (standaard 50)"),
    },
    async (input) => {
      try {
        const filters: string[] = [];
        if (input.article_id) filters.push(`Article eq '${input.article_id}'`);
        if (input.warehouse_id) filters.push(`Warehouse eq '${input.warehouse_id}'`);

        const result = await client.getObjects("ArticleWarehouse", {
          $top: input.top ?? 50,
          $filter: filters.length > 0 ? filters.join(" and ") : undefined,
          count: true,
        });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "search_ultimo",
    `Zoek over meerdere Ultimo objecttypen tegelijk. Voert parallel zoekopdrachten uit op de
opgegeven objecttypen met een gemeenschappelijk filter. Handig als je niet precies weet in welk
objecttype de informatie staat die je zoekt.`,
    {
      object_types: z.array(z.string()).describe("Lijst van objecttypen om te doorzoeken, bijv. ['Job', 'Equipment', 'Incident']"),
      filter: z.string().optional().describe("OData filter om toe te passen (moet geldig zijn voor alle objecttypen)"),
      select: z.string().optional().describe("Velden om terug te geven"),
      top: z.number().optional().describe("Max resultaten per type (standaard 10)"),
    },
    async (input) => {
      try {
        const results: Record<string, unknown> = {};
        const promises = input.object_types.map(async (type) => {
          try {
            const data = await client.getObjects(type, {
              $top: input.top ?? 10,
              $filter: input.filter,
              select: input.select,
              count: true,
            });
            results[type] = data;
          } catch (e: any) {
            results[type] = { error: e.message };
          }
        });
        await Promise.all(promises);
        return success(results);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_api_object_types",
    `Geeft een lijst van alle beschikbare Ultimo objecttypen in de API. Gebruik dit om te ontdekken
welke objecttypen je kunt opvragen. Retourneert alle 116 objecttypen gegroepeerd per domein.`,
    {},
    async () => {
      const objectTypes = {
        "Jobs & Work Orders": ["Job", "JobPlan", "JobPlanInspectionLine", "JobProgressStatusHistory", "JobSchedulePart", "JobWeekLabour", "WorkOrder", "WorkOrderType"],
        "Equipment & Assets": ["Equipment", "EquipmentType", "EquipmentFailType", "EquipmentMeasurementPoint", "EquipmentMeasurementPointValue", "EquipmentSparePart", "Aoc"],
        "Preventief Onderhoud": ["PmWorkOrder", "PmJob", "PmJobInspectionLine"],
        "Inspecties": ["InspectionPlan", "InspectionPlanLine", "InspectionLine", "ObjectInspectionLine"],
        "Inkoop": ["Purchase", "PurchaseLine", "PurchaseRequest", "PurchaseRequestLine", "Receipt", "ReceiptLine"],
        "Voorraadbeheer": ["Article", "ArticleGroup", "ArticleSite", "ArticleSiteVendor", "ArticleVendor", "ArticleWarehouse", "ArticleWarehouseLocation", "Warehouse", "WarehouseLocation", "Material", "Reservation"],
        "Leveranciers": ["Vendor", "VendorType"],
        "Personeel": ["Employee", "EmployeeLabour", "EmployeeLabourLine", "Craftsman", "Department", "SkillCategory", "TariffGroup"],
        "Locaties": ["Location", "Site", "Space", "Building", "BuildingFloor", "BuildingPart", "ProcessFunction"],
        "Kosten & Financieel": ["Cost", "CostCenter", "CostType", "Account", "Vat", "Project"],
        "Documenten": ["Document", "DocumentType", "ObjectDocument"],
        "Service Contracten": ["ServiceContract", "ServiceContractForm", "ServiceContractLine", "ServiceContractType", "ContractLineType"],
        "Incidenten & Veiligheid": ["Incident", "IncidentCause", "IncidentType", "SafetyIncident", "SafetyIncidentFailType", "Permit"],
        "Conditie & Risico": ["ConditionFlaw", "ConditionFlawBook", "ConditionFlawBookLine", "ConditionFlawMaterial", "ConditionFlawPresent", "ConditionFlawType", "ConditionInterest", "ConditionMeasurement", "ConditionRisk", "ConditionRiskPresent", "ConditionRiskScore", "ObjectRiskAnalysis", "RiskClass", "RiskFactor", "RiskFactorScore"],
        "Stamdata": ["Priority", "Urgency", "ProgressStatus", "FailType", "Feature", "ObjectFeature", "Frequency", "MaintenanceClassification", "MaintenanceState", "PhysicalQuantity", "PhysicalQuantityUnit", "Unit", "Consideration", "CommunicationMedium", "Customer", "CustomerSatisfaction", "ProductDossier"],
        "Overig": ["ObjectDowntime", "LendableObject", "Tool", "ShiftLog", "ShiftLogbook", "Bodywork", "Fuel", "Gearing", "Finishing"],
        "API Acties": ["REST_ReportJob", "REST_AttachImageToJob", "_send_document_batch", "_send_document_batch_v2"],
      };
      return success(objectTypes);
    }
  );
}
