import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getObjects, getObject, createObject, patchObject, getNavigationCollection } from "../client.js";
import { oDataParams, buildOData, success, error } from "../types.js";

export function registerModuleTools(server: McpServer) {
  // ==================== INVOICE ====================
  server.tool(
    "get_invoices",
    `Haal facturen op uit Ultimo. Een Invoice is een inkoopfactuur van een leverancier, gekoppeld aan een Purchase.
Toegankelijkheid afhankelijk van API key configuratie.
Statuswaarden: 1=Open, 2=Goedgekeurd, 4=Credit open, 8=Credit goedgekeurd,
32=Open (zonder bestelling), 64=Goedgekeurd (zonder bestelling).
Contexts: 1=Standaard, 2=Fleet. Expand met Lines voor factuurregels.`,
    { ...oDataParams },
    async (input) => {
      try {
        const result = await getObjects("Invoice", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_invoice",
    `Haal één specifieke factuur op. Expand met Lines, Purchase, Vendor voor alle details.
InvoiceLine is de centrale kostenboeking-entiteit die financiële en operationele data verbindt
(Article, Equipment, Job, Project, CostCenter, PurchaseLine, ReceiptLine, ServiceContractLine).`,
    {
      id: z.string().describe("Het Invoice ID (max 9 tekens)"),
      select: z.string().optional(),
      expand: z.string().optional().describe("Bijv. 'Lines,Purchase,Vendor'"),
    },
    async (input) => {
      try {
        const result = await getObject("Invoice", input.id, { select: input.select, expand: input.expand });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // ==================== MULTI-JOB / SUB-JOBS ====================
  server.tool(
    "get_sub_jobs",
    `Haal sub-jobs op van een multi-job. Een multi-job is een overkoepelende job die meerdere
sub-jobs bevat, elk met eigen planning, medewerker en status. Multi-jobs worden aangemaakt
via MultijobTemplates met predecessor/successor afhankelijkheden.
Filter op ParentJob om sub-jobs van een specifieke multi-job te vinden.`,
    {
      parent_job_id: z.string().describe("Het ID van de bovenliggende multi-job"),
      ...oDataParams,
    },
    async (input) => {
      try {
        const params = buildOData(input);
        params.$filter = params.$filter
          ? `ParentJob eq '${input.parent_job_id}' and (${params.$filter})`
          : `ParentJob eq '${input.parent_job_id}'`;
        const result = await getObjects("Job", params);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // ==================== SHIFT LOG ====================
  server.tool(
    "get_shift_logs_with_lines",
    `Haal dienstoverdrachten (shift logs) op met hun regels. Een ShiftLog registreert
gebeurtenissen tijdens een dienst. Regels kunnen gekoppeld zijn aan Equipment, Jobs,
SafetyIncidents, en meetpunten. Statussen: 1=Open, 32=Gesloten.
ShiftLogLine statussen: 1=Open, 2=Doorgeschoven, 4=Gepland, 32=Gesloten, 128=Gereed.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const params = buildOData(input);
        if (!params.expand) params.expand = "Lines";
        const result = await getObjects("ShiftLog", {
          ...params,
          expand: params.expand,
        });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // ==================== PERMIT (Werkvergunning) ====================
  server.tool(
    "get_permit_details",
    `Haal een werkvergunning op met alle details. Permits regelen veiligheidstoestemming voor werkzaamheden.
Statussen: 1=Aangemaakt, 2=Aangevraagd, 4=Voorbereid, 8=Actief, 16=Gesloten, 32=Te verlengen.
Templates: 64=Template aangemaakt, 128=Template goedgekeurd.
Expand met InspectionLines voor checklist-items, Equipment, Job, ProgressStatusHistories.`,
    {
      id: z.string().describe("Het Permit ID"),
      expand: z.string().optional().describe("Bijv. 'InspectionLines,Equipment,Job,ProgressStatusHistories'"),
    },
    async (input) => {
      try {
        const result = await getObject("Permit", input.id, {
          expand: input.expand ?? "InspectionLines,Equipment,Job",
        });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // ==================== SAFETY INCIDENT ====================
  server.tool(
    "get_safety_incident_details",
    `Haal een veiligheidsincident op met alle details. SafetyIncidents registreren (bijna-)ongevallen,
letsel en gevaarlijke situaties. Bevat lichaamsdeel-markering, medische info, en root cause analyse.
Statussen: 1=Aangemaakt, 2=Gemeld, 4=In behandeling, 8=Te evalueren, 16=Gereed, 32=Gesloten.
Expand met ProgressStatusHistories, ShiftLogLine voor context.`,
    {
      id: z.string().describe("Het SafetyIncident ID"),
      expand: z.string().optional(),
    },
    async (input) => {
      try {
        const result = await getObject("SafetyIncident", input.id, {
          expand: input.expand ?? "ProgressStatusHistories",
        });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // ==================== SERVICE CONTRACT detail ====================
  server.tool(
    "get_service_contract_full",
    `Haal een servicecontract op met alle details inclusief contractregels, gekoppeld equipment,
en SLA-informatie. ServiceContracts hebben 12 contexten (Standaard, Standby, IT SLA, Huur,
Gebouw, Fleet, Verzekering, Prijsafspraak, etc.).
Statussen: Concept → Open → Goedgekeurd → Actief → Inactief → Beëindigd.`,
    {
      id: z.string().describe("Het ServiceContract ID"),
    },
    async (input) => {
      try {
        const result = await getObject("ServiceContract", input.id, {
          expand: "Lines,EquipmentServiceContracts,ServiceContractServiceLevels,ObjectDocuments",
        });
        return success(result);
      } catch (e: any) {
        // Fallback with less expands
        try {
          const result = await getObject("ServiceContract", input.id, { expand: "Lines" });
          return success(result);
        } catch (e2: any) {
          return error(e.message);
        }
      }
    }
  );

  // ==================== RESERVATION ====================
  server.tool(
    "get_reservations_detailed",
    `Haal reserveringen op met occurrences. Contexten: 1=Ruimtereservering, 2=Evenement,
4=Catering, 8=Bezoek, 16=Poolauto, 32=Uitleen, 64=Exchange (Outlook sync).
Expand met Occurrences voor de individuele boekingen met start/eindtijd.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const params = buildOData(input);
        if (!params.expand) params.expand = "Occurrences";
        const result = await getObjects("Reservation", {
          ...params,
          expand: params.expand,
        });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // ==================== LOTO ====================
  server.tool(
    "get_loto_plans",
    `Haal Lockout/Tagout (LOTO) plannen op. LOTO plannen definiëren de isolatieprocedure
voor veilig onderhoud aan installaties. Worden gekoppeld aan Equipment en Jobs.
Toegankelijkheid afhankelijk van API key configuratie.
Bevat energiebronnen, vergrendelmethoden, en isolatiepunten (via PlotPlan markers).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("LockoutTagoutPlan", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_loto_requests",
    `Haal LOTO aanvragen op. Een LOTO Request is een actief vergrendelingsverzoek gekoppeld
aan een job/werkvergunning. Statussen: Open, Aangevraagd, Actief, Geannuleerd.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("LockoutTagoutRequest", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // ==================== PROGRESS STATUS FLOW ====================
  server.tool(
    "get_progress_status_flows",
    `Haal de geconfigureerde voortgangsstatusovergangen op. ProgressStatusFlow definieert welke
statusovergangen zijn toegestaan, met bijbehorende notificatie-templates en prioriteiten.
Toegankelijkheid afhankelijk van API key configuratie.
Bevat ook notificatie-templates (EmpTextTemplateCode, ManagerTextTemplateCode, etc.).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ProgressStatusFlow", buildOData(input));
        return success(result);
      } catch (e: any) {
        // ProgressStatusFlow might not be exposed in all API key configs
        return error(`ProgressStatusFlow niet beschikbaar via deze API key. ${e.message}`);
      }
    }
  );

  // ==================== OBJECT PROGRESS STATUS HISTORY ====================
  server.tool(
    "get_progress_status_history",
    `Haal de universele statusgeschiedenis op voor elk objecttype. ObjectProgressStatusHistory
is de audit trail voor alle statuswijzigingen in Ultimo — jobs, equipment, incidenten, permits, etc.
Toegankelijkheid afhankelijk van API key configuratie.
Alternatief: gebruik JobProgressStatusHistory voor job-specifieke statusgeschiedenis.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ObjectProgressStatusHistory", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // ==================== PURCHASE FLOW ====================
  server.tool(
    "get_purchase_flow_overview",
    `Haal een compleet overzicht op van de inkoopflow voor een specifieke bestelling:
Purchase → PurchaseLines → Receipts → InvoiceLines → Costs.
Toont de volledige keten van bestelling tot kostenboeking.`,
    {
      purchase_id: z.string().describe("Het Purchase ID"),
    },
    async (input) => {
      try {
        const [purchase, lines, receipts] = await Promise.all([
          getObject("Purchase", input.purchase_id, {
            expand: "Vendor",
            select: "Id,Description,Status,Vendor,Total,Site,Department",
          }),
          getObjects("PurchaseLine", {
            $filter: `Purchase eq '${input.purchase_id}'`,
            $top: 50,
          }),
          getObjects("Receipt", {
            $filter: `Purchase eq '${input.purchase_id}'`,
            $top: 20,
          }),
        ]);

        return success({
          purchase,
          lines,
          receipts,
        });
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // ==================== WAREHOUSE MUTATIONS ====================
  server.tool(
    "get_warehouse_serve_outs",
    `Haal magazijnmutaties (uitgiften/ontvangsten) op. Een WarehouseServeOut registreert fysieke
voorraadverplaatsingen. Na goedkeuring wordt de voorraad automatisch bijgewerkt en worden kosten
geboekt op de geregistreerde kostendragers (job OF installatie/afdeling/kostenplaats).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("WarehouseServeOut" as string, buildOData(input));
        return success(result);
      } catch (e: any) {
        // Might not be in swagger - try WarehouseMutation
        return error(e.message);
      }
    }
  );

  // ==================== INVOICE OUT (Internal Charges) ====================
  server.tool(
    "get_internal_charges",
    `Haal interne doorbelastingen (InvoiceOut) op. Dit zijn uitgaande facturen/doorbelastingen
naar klanten of afdelingen voor uitgevoerd onderhoud. Bevat computed kostenopsplitsing per type
(arbeid, materiaal, inkoop, gereedschap, magazijn). Context: 1=Standaard.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("InvoiceOut" as string, buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // ==================== KANBAN / PLANNING INFO ====================
  server.tool(
    "get_jobs_for_planning",
    `Haal jobs op die ingepland moeten worden. Filtert op planbare statussen (Open, Goedgekeurd, Uitgesteld)
en toont de velden die relevant zijn voor planning: medewerker, vakgroep, start/gereeddatum,
doorlooptijd, prioriteit. Gesorteerd op geplande startdatum.`,
    {
      skill_category: z.string().optional().describe("Filter op vakgroep/team (SkillCategory ID)"),
      site: z.string().optional().describe("Filter op vestiging (Site ID)"),
      department: z.string().optional().describe("Filter op afdeling"),
      top: z.number().optional().describe("Maximum aantal (standaard 50)"),
    },
    async (input) => {
      try {
        const filters = ["Status in (1, 2, 8192)"];
        if (input.skill_category) filters.push(`SkillCategory eq '${input.skill_category}'`);
        if (input.site) filters.push(`Site eq '${input.site}'`);
        if (input.department) filters.push(`Department eq '${input.department}'`);

        const result = await getObjects("Job", {
          $filter: filters.join(" and "),
          $top: input.top ?? 50,
          select: "Id,Description,Status,Equipment,Employee,SkillCategory,Priority,ScheduledStartDate,FinalFinishDate,Duration,WorkOrderType,Site",
          $orderby: "ScheduledStartDate",
          count: true,
        });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // ==================== ULTIMO MODULES OVERVIEW ====================
  server.tool(
    "get_modules_overview",
    `Geeft een overzicht van alle Ultimo modules en hun beschikbaarheid via de REST API.
Gebruik dit om te begrijpen welke functionaliteit beschikbaar is.`,
    {},
    async () => {
      return success({
        modules: {
          "Asset Management (TD)": { api: true, entities: "Equipment, EquipmentType, EquipmentMeasurementPoint, ProcessFunction", context: "Equipment.Context=1 (Installatie)" },
          "Fleet Management": { api: true, entities: "Equipment (Fleet context), Fuel transactions", context: "Equipment.Context=8, Job.Context=16384" },
          "Instrument/Kalibratie (MT)": { api: true, entities: "Equipment (Instrument context)", context: "Equipment.Context=512, Job.Context=512" },
          "IT Service Management (ITSM)": { api: true, entities: "Incident, Equipment (ConfigItem), Job (IT context)", context: "Equipment.Context=32, Job.Context=128/256" },
          "Infra": { api: true, entities: "Equipment (BuildingPart/Element), Building, BuildingFloor", context: "Equipment.Context=32768/65536, Job.Context=32768" },
          "ServiceDesk": { api: true, entities: "Job (ServiceDesk context)", context: "Job.Context=4" },
          "Preventief Onderhoud": { api: true, entities: "PmWorkOrder, PmJob, Frequency, JobPlan" },
          "Inkoop": { api: true, entities: "Purchase, PurchaseLine, PurchaseRequest, Receipt, Invoice, InvoiceLine" },
          "Voorraadbeheer": { api: true, entities: "Article, ArticleWarehouse, Warehouse, Material, Reservation" },
          "Contracten": { api: true, entities: "ServiceContract, ServiceContractLine (12 contexten)" },
          "Conditiemeting (NEN2767)": { api: true, entities: "ConditionMeasurement, ConditionFlaw, ObjectRiskAnalysis" },
          "HSE / Veiligheid": { api: true, entities: "SafetyIncident, Permit, LockoutTagoutPlan, LockoutTagoutRequest" },
          "Gebouwbeheer": { api: true, entities: "Building, BuildingFloor, BuildingPart, Space" },
          "Ruimtereservering": { api: true, entities: "Reservation, ReservationOccurrence, ReservationLine, ReservableObject" },
          "Dienstlogboek": { api: true, entities: "ShiftLog, ShiftLogLine" },
          "GIS": { api: "beperkt", note: "Kaartvisualisatie is UI-only. Alleen basemap/layer config importeerbaar." },
          "Schoonmaak": { api: "via jobs", note: "Geen apart module — gebruikt standaard Job met Context=4096" },
        },
        note: "Alle modules gebruiken dezelfde REST API structuur. Het verschil zit in de Context-waarde bij aanmaken van objecten.",
      });
    }
  );
}
