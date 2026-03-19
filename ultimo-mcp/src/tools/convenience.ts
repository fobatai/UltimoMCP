import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getObjects, getObject, createObject, patchObject, executeAction, getNavigationCollection } from "../client.js";
import { oDataParams, buildOData, success, error } from "../types.js";

export function registerConvenienceTools(server: McpServer) {
  // Servicedesk melding aanmaken
  server.tool(
    "create_service_desk_report",
    `Maak snel een servicedeskmelding (storing/verzoek) aan via POST. Vereist autokey op de Job entiteit
(standaard ingeschakeld). Het ID wordt automatisch gegenereerd. VERPLICHT: Context, Status, Site.
Context 4 = ServiceDesk, Context 131072 = ServiceRequest (zelfservice).
Status 64 = Aangevraagd (standaard voor nieuwe meldingen).
De response bevat ALLE velden die de API key mag zien (niet alleen de meegegeven velden).`,
    {
      description: z.string().describe("Omschrijving van de melding/storing"),
      report_text: z.string().optional().describe("Uitgebreide meldingstekst"),
      equipment: z.string().optional().describe("Equipment ID waarop de melding betrekking heeft"),
      site: z.string().describe("Site/vestiging ID (VERPLICHT)"),
      priority: z.string().optional().describe("Prioriteit ID"),
      employee: z.string().optional().describe("Medewerker ID (uitvoerder)"),
      reporter: z.string().optional().describe("Melder (persoon die de melding doet)"),
      department: z.string().optional().describe("Afdeling ID"),
      context: z.number().optional().describe("Context (4=ServiceDesk, 131072=ServiceRequest). Standaard: 4"),
      extra_fields: z.record(z.unknown()).optional().describe("Extra velden (Extra1-12, RemarkChar1-7, etc.)"),
    },
    async (input) => {
      try {
        const data: Record<string, unknown> = {
          Context: input.context ?? 4,
          Status: 64, // Requested
          Description: input.description,
        };
        if (input.report_text) data.ReportText = input.report_text;
        if (input.equipment) data.Equipment = input.equipment;
        data.Site = input.site;
        if (input.priority) data.Priority = input.priority;
        if (input.employee) data.Employee = input.employee;
        if (input.reporter) data.Reporter = input.reporter;
        if (input.department) data.Department = input.department;
        if (input.extra_fields) Object.assign(data, input.extra_fields);

        const result = await createObject("Job", data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Job status bijwerken
  server.tool(
    "change_job_status",
    `Wijzig de status van een job. Veelgebruikte statuswaarden:
1=Open/Aangemaakt, 2=Goedgekeurd, 4=Actief, 16=Gereed, 32=Gesloten,
64=Aangevraagd, 4096=Voltooid, 8192=Uitgesteld.
Let op: niet alle overgangen zijn toegestaan — de StatusMatrix in Ultimo bepaalt welke
overgangen geldig zijn. Bij een ongeldige overgang geeft de API een foutmelding.`,
    {
      id: z.string().describe("Het Job ID"),
      status: z.number().describe("Nieuwe statuswaarde (1=Open, 2=Goedgekeurd, 4=Actief, 16=Gereed, 32=Gesloten, 64=Aangevraagd, 4096=Voltooid, 8192=Uitgesteld)"),
      progress_status: z.string().optional().describe("Optioneel: ProgressStatus code (configureerbaar per implementatie)"),
      feedback_text: z.string().optional().describe("Optioneel: feedbacktekst bij statuswijziging"),
      percentage_complete: z.number().optional().describe("Percentage voltooid (0-100)"),
    },
    async (input) => {
      try {
        const data: Record<string, unknown> = { Status: input.status };
        if (input.progress_status) data.ProgressStatus = input.progress_status;
        if (input.feedback_text) data.FeedbackText = input.feedback_text;
        if (input.percentage_complete !== undefined) data.PercentageComplete = input.percentage_complete;

        const result = await patchObject("Job", input.id, data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Uren boeken op job
  server.tool(
    "book_hours_on_job",
    `Registreer gewerkte uren op een job. Dit maakt een EmployeeLabourLine aan die de uren
van een medewerker op een specifieke job registreert. Essentieel voor kostentoerekening
en urenverantwoording.`,
    {
      data: z.record(z.unknown()).describe("JSON object met minimaal: Employee, Job, en uren-gegevens. Raadpleeg de EmployeeLabourLine entiteit voor beschikbare velden."),
    },
    async (input) => {
      try {
        const result = await createObject("EmployeeLabourLine", input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Materiaal uitgeven voor job
  server.tool(
    "issue_material_for_job",
    `Geef materiaal uit vanuit het magazijn voor een job. Maakt een Material record aan
dat de uitgifte registreert. Verlaagt automatisch de voorraad in het magazijn.`,
    {
      job: z.string().describe("Job ID"),
      article: z.string().describe("Article ID"),
      quantity: z.number().describe("Aantal uit te geven"),
      warehouse: z.string().optional().describe("Magazijn ID (optioneel als er maar één is)"),
      extra_fields: z.record(z.unknown()).optional().describe("Extra velden"),
    },
    async (input) => {
      try {
        const data: Record<string, unknown> = {
          Job: input.job,
          Article: input.article,
          Quantity: input.quantity,
        };
        if (input.warehouse) data.Warehouse = input.warehouse;
        if (input.extra_fields) Object.assign(data, input.extra_fields);

        const result = await createObject("Material", data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Overzicht open jobs per medewerker
  server.tool(
    "get_open_jobs_by_employee",
    `Haal alle open/actieve jobs op voor een specifieke medewerker. Toont een overzicht
van werk dat nog uitgevoerd moet worden. Filtert op actieve statussen (1, 2, 4 = Open, Goedgekeurd, Actief).`,
    {
      employee_id: z.string().describe("Employee ID"),
      include_requested: z.boolean().optional().describe("Ook aangevraagde jobs tonen (status 64)? Standaard: false"),
      top: z.number().optional().describe("Maximum aantal (standaard 50)"),
    },
    async (input) => {
      try {
        const statuses = input.include_requested
          ? "Status in (1, 2, 4, 64)"
          : "Status in (1, 2, 4)";
        const result = await getObjects("Job", {
          $top: input.top ?? 50,
          $filter: `Employee eq '${input.employee_id}' and ${statuses}`,
          select: "Id,Description,Status,Equipment,Priority,ScheduledStartDate,TargetDate,PercentageComplete,WorkOrderType",
          $orderby: "ScheduledStartDate",
          count: true,
        });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Achterstallig onderhoud
  server.tool(
    "get_overdue_jobs",
    `Haal jobs op die over hun streefdatum (TargetDate) heen zijn maar nog niet afgerond.
Essentieel voor onderhoudsbeheer en compliance. Toont achterstallige jobs gesorteerd op urgentie.`,
    {
      site: z.string().optional().describe("Filter op Site ID"),
      department: z.string().optional().describe("Filter op Department ID"),
      top: z.number().optional().describe("Maximum aantal (standaard 50)"),
    },
    async (input) => {
      try {
        const today = new Date().toISOString();
        const filters = [
          `TargetDate lt ${today}`,
          "Status in (1, 2, 4)",
        ];
        if (input.site) filters.push(`Site eq '${input.site}'`);
        if (input.department) filters.push(`Department eq '${input.department}'`);

        const result = await getObjects("Job", {
          $top: input.top ?? 50,
          $filter: filters.join(" and "),
          select: "Id,Description,Status,Equipment,Employee,Priority,ScheduledStartDate,TargetDate,WorkOrderType,Site",
          $orderby: "TargetDate",
          count: true,
        });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Dashboard samenvatting
  server.tool(
    "get_dashboard_summary",
    `Haal een samenvatting op voor een dashboard-achtig overzicht. Haalt parallel informatie op over:
open jobs, achterstallige jobs, recente incidenten, en voorraadwaarschuwingen.
Geeft een beknopt overzicht dat een consultant dagelijks nodig heeft.`,
    {
      site: z.string().optional().describe("Filter op Site ID (optioneel)"),
      department: z.string().optional().describe("Filter op Department ID (optioneel)"),
    },
    async (input) => {
      try {
        const today = new Date().toISOString();
        const baseFilter: string[] = [];
        if (input.site) baseFilter.push(`Site eq '${input.site}'`);
        if (input.department) baseFilter.push(`Department eq '${input.department}'`);
        const siteFilter = baseFilter.length > 0 ? " and " + baseFilter.join(" and ") : "";

        const [openJobs, recentIncidents] = await Promise.all([
          getObjects("Job", {
            $filter: `Status in (1, 2, 4)${siteFilter}`,
            count: true,
            $top: 1,
            select: "Id",
          }),
          getObjects("Incident", {
            $filter: `Status in (1, 4)`,
            count: true,
            $top: 1,
            select: "Id",
          }),
        ]);

        return success({
          open_jobs: openJobs.count ?? openJobs.items.length,
          open_incidents: recentIncidents.count ?? recentIncidents.items.length,
          generated_at: new Date().toISOString(),
          tip: "Gebruik get_overdue_jobs voor achterstallige jobs (vereist TargetDate filter met DateTimeOffset formaat).",
        });
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Equipment onderhoudsgeschiedenis
  server.tool(
    "get_equipment_maintenance_history",
    `Haal de volledige onderhoudsgeschiedenis op voor een asset: alle jobs (open en gesloten),
kosten, en recente meetwaarden. Geeft een compleet beeld voor onderhoudsbeslissingen.`,
    {
      equipment_id: z.string().describe("Equipment ID"),
      include_costs: z.boolean().optional().describe("Ook kosten ophalen? (standaard: true)"),
      top: z.number().optional().describe("Max aantal jobs (standaard 20)"),
    },
    async (input) => {
      try {
        const [jobs, measurements] = await Promise.all([
          getObjects("Job", {
            $filter: `Equipment eq '${input.equipment_id}'`,
            $top: input.top ?? 20,
            select: "Id,Description,Status,ScheduledStartDate,StatusCompletedDate,TotalCost,WorkOrderType,FailType,Employee",
            $orderby: "RecordCreateDate desc",
            count: true,
          }),
          getObjects("EquipmentMeasurementPointValue", {
            $filter: `Equipment eq '${input.equipment_id}'`,
            $top: 10,
            $orderby: "RecordCreateDate desc",
          }),
        ]);

        const result: Record<string, unknown> = {
          equipment_id: input.equipment_id,
          jobs: jobs,
          recent_measurements: measurements,
        };

        if (input.include_costs !== false) {
          try {
            const costs = await getObjects("Cost", {
              $filter: `Equipment eq '${input.equipment_id}'`,
              $top: 20,
              $orderby: "RecordCreateDate desc",
              count: true,
            });
            result.costs = costs;
          } catch {
            result.costs = { error: "Kosten konden niet opgehaald worden" };
          }
        }

        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Bestelling aanmaken vanuit job
  server.tool(
    "create_purchase_for_job",
    `Maak een nieuwe inkooporder aan die direct gekoppeld is aan een job.
Verplichte velden bij aanmaken: Context en Status. Standaard: Context=1, Status=1 (Open).`,
    {
      vendor: z.string().describe("Vendor/leverancier ID"),
      job: z.string().optional().describe("Job ID om aan te koppelen"),
      description: z.string().optional().describe("Omschrijving van de bestelling"),
      context: z.number().optional().describe("Context (standaard 1)"),
      extra_fields: z.record(z.unknown()).optional().describe("Extra velden"),
    },
    async (input) => {
      try {
        const data: Record<string, unknown> = {
          Context: input.context ?? 1,
          Status: 1,
          Vendor: input.vendor,
        };
        if (input.description) data.Description = input.description;
        if (input.job) data.Job = input.job;
        if (input.extra_fields) Object.assign(data, input.extra_fields);

        const result = await createObject("Purchase", data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Status referentie
  server.tool(
    "get_status_reference",
    `Geeft een overzicht van alle statuswaarden en contextwaarden voor de belangrijkste Ultimo entiteiten.
Gebruik dit als je niet weet welke statuscode je moet gebruiken bij het aanmaken of bijwerken van objecten.`,
    {},
    async () => {
      return success({
        job_statuses: {
          "-1": "Trash (verwijderd)", "0": "None", "1": "Open/Aangemaakt", "2": "Goedgekeurd",
          "4": "Actief", "16": "Gereed", "32": "Gesloten", "64": "Aangevraagd",
          "4096": "Voltooid", "8192": "Uitgesteld",
        },
        job_contexts: {
          "1": "TD (Technische Dienst)", "4": "ServiceDesk", "128": "IT Incident",
          "256": "IT Problem", "512": "Instrument", "2048": "Gebouw", "4096": "Schoonmaak",
          "8192": "Verhuizing", "16384": "Fleet", "32768": "Infra",
          "131072": "ServiceRequest", "262144": "ITIL Change", "524288": "SelfService",
        },
        equipment_statuses: {
          "1": "Op te voeren", "2": "Operationeel", "4": "Uitgeleend", "8": "Vermist",
          "16": "Af te voeren", "32": "Te verplaatsen", "64": "Afgevoerd",
          "256": "Inzetbaar (exchange)", "512": "Operationeel (exchange)", "1024": "Defect (exchange)",
        },
        equipment_contexts: {
          "1": "Installatie", "2": "Inventaris", "4": "Gebouw", "8": "Fleet",
          "32": "ConfigurationItem (IT)", "512": "Instrument", "1024": "Resource",
          "32768": "BuildingPart (Infra)", "65536": "Element (Infra)", "131072": "EnergyMeter",
        },
        purchase_statuses: {
          "1": "Open", "2": "Goedgekeurd", "4": "Actief (besteld)", "32": "Gesloten",
          "64": "Deels ontvangen", "128": "Concept", "256": "Ontvangen",
          "512": "Vervallen", "1024": "Aanvraag",
        },
        purchase_request_statuses: {
          "1": "Aangemaakt", "2": "Aanvraag", "4": "Concept", "8": "Goedgekeurd",
          "16": "Bestelling aangemaakt", "32": "Afgewezen", "64": "Actief",
          "128": "Gesloten", "256": "Deels geleverd", "512": "Geleverd", "2048": "Besteladvies",
        },
        invoice_statuses: {
          "1": "Open", "2": "Goedgekeurd", "4": "Credit open", "8": "Credit goedgekeurd",
          "32": "Open (zonder bestelling)", "64": "Goedgekeurd (zonder bestelling)",
        },
        incident_statuses: { "1": "Aangemaakt", "4": "Actief", "16": "Gereed" },
        pm_work_order_statuses: { "1": "Aangemaakt", "2": "Goedgekeurd" },
        field_width_constraints: {
          "JobId": "max 12 tekens", "EqmId": "max 24 tekens", "PchId": "max 10 tekens",
          "InvId": "max 9 tekens", "EmpId": "max 9 tekens", "VdrId": "max 6 tekens",
          "Description": "max 200 tekens", "ExternalId": "max 50 tekens",
        },
        custom_fields: {
          "Job": "Extra1-12, RemarkChar1-7, RemarkDate1-2, RemarkInt1-5, RemarkText1-2",
          "Equipment": "Tech1-10, Extra1-12",
          "WorkOrder": "Extra1-12",
        },
        note: "Context en Status zijn VERPLICHT bij PUT/POST. Context kan na aanmaak NIET meer gewijzigd worden. Context is een bitmask (bigint). ProgressStatus is een apart configureerbaar systeem bovenop de basis Status. Kostvelden zijn decimal(21,5). Tekstvelden kunnen HTML bevatten — gebruik Prefer: strip-html header.",
      });
    }
  );

  // Equipment hiërarchie
  server.tool(
    "get_equipment_hierarchy",
    `Haal de hiërarchie (ouder-kind relatie) op voor een equipment-item. Toont het bovenliggende
equipment (PartOfEquipment) en alle onderliggende items. Essentieel voor het begrijpen
van de installatiestructuur.`,
    {
      equipment_id: z.string().describe("Equipment ID"),
      top: z.number().optional().describe("Max aantal onderliggende items (standaard 50)"),
    },
    async (input) => {
      try {
        // Get the equipment itself with parent info
        const equipment = await getObject("Equipment", input.equipment_id, {
          select: "Id,Description,PartOfEquipment,TopOfEquipment,EquipmentType,Status,Location,Site",
        });

        // Get children
        const children = await getObjects("Equipment", {
          $filter: `PartOfEquipment eq '${input.equipment_id}'`,
          $top: input.top ?? 50,
          select: "Id,Description,EquipmentType,Status",
          count: true,
        });

        return success({
          equipment,
          children: children,
        });
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Zoek op beschrijving (like filter)
  server.tool(
    "search_by_description",
    `Zoek Ultimo objecten op beschrijving met een patroonzoekopdracht (like filter).
Gebruik % als wildcard voor meerdere tekens en _ voor één teken.
Bijv: '%pomp%' vindt alles met 'pomp' in de beschrijving.`,
    {
      object_type: z.string().describe("Het objecttype, bijv. 'Equipment', 'Job', 'Article'"),
      search_term: z.string().describe("Zoekterm met wildcards, bijv. '%pomp%' of 'Hef%'"),
      field: z.string().optional().describe("Veld om in te zoeken (standaard: Description)"),
      ...oDataParams,
    },
    async (input) => {
      try {
        const field = input.field ?? "Description";
        const params = buildOData(input);
        const existingFilter = params.$filter;
        const likeFilter = `${field} like '${input.search_term}'`;
        params.$filter = existingFilter
          ? `(${existingFilter}) and ${likeFilter}`
          : likeFilter;

        const result = await getObjects(input.object_type, params);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Jobs met kosten overzicht
  server.tool(
    "get_job_cost_breakdown",
    `Haal een kostenopsplitsing op voor een job. Toont arbeidskosten, materiaalkosten,
inkoopkosten, gereedschapskosten en totaalkosten. Deze velden zijn berekend (read-only)
en worden automatisch bijgewerkt door Ultimo.`,
    {
      id: z.string().describe("Het Job ID"),
    },
    async (input) => {
      try {
        const result = await getObject("Job", input.id, {
          select: "Id,Description,Status,LabourRealCost,MaterialsRealCost,PurchaseRealCost,ToolsRealCost,TotalCost,Hours,HoursPlanned,HoursCalculated,MaterialsCalculated,PercentageComplete",
        });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Recent gewijzigde objecten
  server.tool(
    "get_recently_changed",
    `Haal recent gewijzigde objecten op van een bepaald type. Filtert op RecordChangeDate.
Handig om te zien wat er recent is gewijzigd in het systeem, of voor synchronisatie-doeleinden.`,
    {
      object_type: z.string().describe("Het objecttype, bijv. 'Job', 'Equipment'"),
      since: z.string().describe("Wijzigingen sinds dit tijdstip (DateTimeOffset formaat, bijv. '2024-01-15T00:00:00Z')"),
      select: z.string().optional().describe("Velden om terug te geven"),
      top: z.number().optional().describe("Maximum aantal (standaard 50)"),
    },
    async (input) => {
      try {
        const result = await getObjects(input.object_type, {
          $filter: `RecordChangeDate ge ${input.since}`,
          $top: input.top ?? 50,
          select: input.select,
          $orderby: "RecordChangeDate desc",
          count: true,
        });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // PM models per equipment
  server.tool(
    "get_pm_models_for_equipment",
    `Haal alle preventieve onderhoudsmodellen (PM Work Orders) op die gekoppeld zijn aan een
specifiek equipment-item. Toont welke periodieke onderhoudstaken voor deze asset zijn ingepland.`,
    {
      equipment_id: z.string().describe("Equipment ID"),
      top: z.number().optional().describe("Maximum aantal (standaard 50)"),
    },
    async (input) => {
      try {
        const result = await getObjects("PmWorkOrder", {
          $filter: `Equipment eq '${input.equipment_id}'`,
          $top: input.top ?? 50,
          count: true,
        });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Spare parts voor equipment
  server.tool(
    "get_spare_parts_for_equipment",
    `Haal de stuklijst (spare parts / reserveonderdelen) op voor een specifiek equipment-item.
Toont welke artikelen als onderdeel bij deze asset horen, inclusief aantallen.
Essentieel voor onderhoudsvoorbereiding en inkoopplanning.`,
    {
      equipment_id: z.string().describe("Equipment ID"),
    },
    async (input) => {
      try {
        const result = await getObjects("EquipmentSparePart", {
          $filter: `Equipment eq '${input.equipment_id}'`,
          $top: 100,
          count: true,
        });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Jobs ophalen per werkorder
  server.tool(
    "get_jobs_by_work_order",
    `Haal alle jobs op die bij een specifieke werkorder (WorkOrder) horen.
Toont de jobs gesorteerd op geplande startdatum. Handig om snel alle taken
binnen een werkorder te overzien.`,
    {
      work_order_id: z.string().describe("WorkOrder ID"),
      top: z.number().optional().describe("Maximum aantal (standaard 50)"),
    },
    async (input) => {
      try {
        const result = await getObjects("Job", {
          $filter: `WorkOrder eq '${input.work_order_id}'`,
          $top: input.top ?? 50,
          select: "Id,Description,Status,Equipment,Employee,ScheduledStartDate,TargetDate,PercentageComplete,Priority,WorkOrderType,Site,Department",
          $orderby: "ScheduledStartDate",
          count: true,
        });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Equipment met preventief onderhoud
  server.tool(
    "get_equipment_with_pm",
    `Haal een equipment-item op samen met de bijbehorende preventieve onderhoudsmodellen (PM Work Orders).
Toont de PM-status (goedgekeurd of niet) en de volgende onderhoudsdatum.
Handig om snel te zien of een asset onder preventief onderhoud valt.`,
    {
      equipment_id: z.string().describe("Equipment ID"),
      top: z.number().optional().describe("Maximum aantal PM-modellen (standaard 20)"),
    },
    async (input) => {
      try {
        const [equipment, pmWorkOrders] = await Promise.all([
          getObject("Equipment", input.equipment_id, {
            select: "Id,Description,Status,EquipmentType,Site,Location,PartOfEquipment",
          }),
          getObjects("PmWorkOrder", {
            $filter: `Equipment eq '${input.equipment_id}'`,
            $top: input.top ?? 20,
            select: "Id,Description,Status,Equipment,NextMaintenanceDate,Interval,IntervalUnit,WorkOrderType",
            $orderby: "NextMaintenanceDate",
            count: true,
          }),
        ]);

        const pmSummary = pmWorkOrders.items.map((pm: Record<string, unknown>) => ({
          id: pm.Id,
          description: pm.Description,
          approved: pm.Status === 2,
          status: pm.Status,
          next_maintenance_date: pm.NextMaintenanceDate,
          interval: pm.Interval,
          interval_unit: pm.IntervalUnit,
          work_order_type: pm.WorkOrderType,
        }));

        return success({
          equipment,
          has_preventive_maintenance: pmWorkOrders.items.length > 0,
          pm_count: pmWorkOrders.count ?? pmWorkOrders.items.length,
          pm_models: pmSummary,
        });
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Jobs per datumbereik
  server.tool(
    "get_jobs_by_date_range",
    `Haal jobs op die gepland zijn binnen een bepaald datumbereik.
Filtert op ScheduledStartDate. Optioneel te filteren op site, afdeling of medewerker.
Handig voor planningsoverzichten en werkvoorbereiding.
Datums in DateTimeOffset formaat, bijv. '2024-06-01T00:00:00Z'.`,
    {
      start_date: z.string().describe("Startdatum (DateTimeOffset formaat, bijv. '2024-06-01T00:00:00Z')"),
      end_date: z.string().describe("Einddatum (DateTimeOffset formaat, bijv. '2024-06-30T23:59:59Z')"),
      site: z.string().optional().describe("Filter op Site ID"),
      department: z.string().optional().describe("Filter op Department ID"),
      employee: z.string().optional().describe("Filter op Employee ID"),
      top: z.number().optional().describe("Maximum aantal (standaard 100)"),
    },
    async (input) => {
      try {
        const filters = [
          `ScheduledStartDate ge ${input.start_date}`,
          `ScheduledStartDate le ${input.end_date}`,
        ];
        if (input.site) filters.push(`Site eq '${input.site}'`);
        if (input.department) filters.push(`Department eq '${input.department}'`);
        if (input.employee) filters.push(`Employee eq '${input.employee}'`);

        const result = await getObjects("Job", {
          $filter: filters.join(" and "),
          $top: input.top ?? 100,
          select: "Id,Description,Status,Equipment,Employee,ScheduledStartDate,TargetDate,Priority,WorkOrderType,Site,Department,PercentageComplete",
          $orderby: "ScheduledStartDate",
          count: true,
        });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Kostenoverzicht per equipment
  server.tool(
    "get_cost_summary_by_equipment",
    `Haal een geaggregeerd kostenoverzicht op voor een equipment-item.
Haalt alle kostenregels op en groepeert ze conceptueel per kostentype (arbeid, materiaal, inkoop, gereedschap).
Geeft totaalbedragen per categorie en een eindtotaal.`,
    {
      equipment_id: z.string().describe("Equipment ID"),
      top: z.number().optional().describe("Maximum aantal kostenregels (standaard 200)"),
    },
    async (input) => {
      try {
        const costs = await getObjects("Cost", {
          $filter: `Equipment eq '${input.equipment_id}'`,
          $top: input.top ?? 200,
          count: true,
        });

        let totalLabour = 0;
        let totalMaterial = 0;
        let totalPurchase = 0;
        let totalTools = 0;
        let totalOther = 0;

        for (const cost of costs.items as Record<string, unknown>[]) {
          const amount = Number(cost.Amount) || 0;
          const context = cost.Context as number | undefined;
          // Cost contexts: 1=Labour, 2=Material, 4=Purchase, 8=Tools
          switch (context) {
            case 1: totalLabour += amount; break;
            case 2: totalMaterial += amount; break;
            case 4: totalPurchase += amount; break;
            case 8: totalTools += amount; break;
            default: totalOther += amount; break;
          }
        }

        return success({
          equipment_id: input.equipment_id,
          cost_count: costs.count ?? costs.items.length,
          labour_cost: totalLabour,
          material_cost: totalMaterial,
          purchase_cost: totalPurchase,
          tools_cost: totalTools,
          other_cost: totalOther,
          total_cost: totalLabour + totalMaterial + totalPurchase + totalTools + totalOther,
          cost_records: costs.items,
        });
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Vervolgjob aanmaken
  server.tool(
    "create_follow_up_job",
    `Maak een vervolgjob aan die gekoppeld is aan een bestaande job.
Kopieert automatisch Equipment, Site en Department van de originele job.
Stelt ParentJob in op de originele job. Handig voor vervolgwerkzaamheden,
herbezoeken of escalaties. Ultimo heeft ook een interne workflow Job_CreateContinuationJob
die meer velden kopieert (custom columns, SLA herberekening) — die wordt via de UI getriggered.`,
    {
      original_job_id: z.string().describe("Het ID van de originele job waarvan een vervolg moet worden aangemaakt"),
      description: z.string().describe("Omschrijving van de vervolgjob"),
      context: z.number().optional().describe("Context (standaard: overgenomen van originele job)"),
      priority: z.string().optional().describe("Prioriteit ID"),
      employee: z.string().optional().describe("Medewerker ID (uitvoerder)"),
      report_text: z.string().optional().describe("Uitgebreide meldingstekst"),
      extra_fields: z.record(z.unknown()).optional().describe("Extra velden (Extra1-12, RemarkChar1-7, etc.)"),
    },
    async (input) => {
      try {
        // Haal de originele job op om velden over te nemen
        const original = await getObject("Job", input.original_job_id, {
          select: "Id,Equipment,Site,Department,Context,WorkOrderType",
        }) as Record<string, unknown>;

        const data: Record<string, unknown> = {
          Context: input.context ?? (original.Context as number) ?? 4,
          Status: 64, // Aangevraagd
          Description: input.description,
          ParentJob: input.original_job_id,
        };
        if (original.Equipment) data.Equipment = original.Equipment;
        if (original.Site) data.Site = original.Site;
        if (original.Department) data.Department = original.Department;
        if (input.priority) data.Priority = input.priority;
        if (input.employee) data.Employee = input.employee;
        if (input.report_text) data.ReportText = input.report_text;
        if (input.extra_fields) Object.assign(data, input.extra_fields);

        const result = await createObject("Job", data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );
}
