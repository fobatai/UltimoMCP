import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getObjects, getObject, createObject, patchObject, executeAction, getObjectComposite, postNested } from "../client.js";
import { oDataParams, buildOData, success, error } from "../types.js";

export function registerJobTools(server: McpServer) {
  server.tool(
    "get_jobs",
    `Haal een lijst van jobs (werkorders/taken) op uit Ultimo. Jobs zijn de kern van het onderhoudsbeheer —
ze vertegenwoordigen uit te voeren werkzaamheden aan equipment of locaties. Gebruik deze tool om jobs te zoeken,
filteren en sorteren. Veelgebruikte filters: Status, Equipment, Employee, Priority, ScheduledStartDate, Context.
Statuswaarden: 1=Open, 2=Goedgekeurd, 4=Actief, 16=Gereed, 32=Gesloten, 64=Aangevraagd.
Filtervoorbeelden: "Status in (1, 2, 4)" voor open jobs, "Description like '%pomp%'" voor patroonzoeken,
"Department/Id eq '01'" voor filteren op relatie. Expand met Equipment, Employee, PurchaseLines voor meer context.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Job", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_job",
    `Haal één specifieke job op aan de hand van het Job ID. Geeft alle details terug inclusief beschrijving,
status, geplande data, kosten, en gekoppeld equipment. Gebruik 'expand' om gerelateerde objecten mee te laden,
bijv. expand=Equipment,Employee,PurchaseLines,Permits,ProgressStatusHistories.
Gebruik 'select' om alleen specifieke velden op te halen.`,
    {
      id: z.string().describe("Het unieke Job ID, bijv. 'JOB-001'"),
      select: z.string().optional().describe("Komma-gescheiden velden"),
      expand: z.string().optional().describe("Komma-gescheiden relaties. Beschikbaar: Equipment,Employee,Priority,ProgressStatus,WorkOrderType,Vendor,Department,Site,CostCenter,CostType,Craftsman,Customer,Document,EquipmentType,FailType,Incident,JobPlan,ParentJob,ChildJobs,SubJobs,PmWorkOrder,PmJob,ProcessFunction,ProductDossier,Project,PurchaseLines,PurchaseRequestLines,Permits,ProgressStatusHistories,ScheduleParts,ServiceContract,Space,Urgency,WeekLabs"),
    },
    async (input) => {
      try {
        const result = await getObject("Job", input.id, { select: input.select, expand: input.expand });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "create_job",
    `Maak een nieuwe job (werkorder/taak) aan in Ultimo via POST. VERPLICHTE velden: Context, Status, EN Site.
Live gevalideerd: zonder Site geeft de API een fout. Context bepaalt het type job (1=TD, 4=ServiceDesk,
16384=Fleet, etc. — bitmask). Status bepaalt de beginstatus (1=Open, 64=Aangevraagd).
Context kan NA aanmaak NIET meer gewijzigd worden. Id wordt automatisch gegenereerd (autokey).
Extra klantspecifieke velden: Extra1-12, RemarkChar1-7, RemarkDate1-2, RemarkInt1-5, RemarkText1-2.`,
    {
      data: z.record(z.unknown()).describe("JSON object met de job-eigenschappen. Minimaal 'Id' is verplicht. Veelgebruikt: Id, Description, Equipment, Employee, Priority, ScheduledStartDate, WorkOrderType, Site, ReportText"),
    },
    async (input) => {
      try {
        const result = await createObject("Job", input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "update_job",
    `Werk een bestaande job bij (partiële update via PATCH). Alleen de meegegeven velden worden gewijzigd.
Gebruik dit om status te wijzigen, datums aan te passen, medewerkers toe te wijzen, etc.
Voorbeeld: { "Status": "C", "PercentageComplete": 100 } om een job af te melden.`,
    {
      id: z.string().describe("Het Job ID om bij te werken"),
      data: z.record(z.unknown()).describe("JSON object met de te wijzigen eigenschappen"),
    },
    async (input) => {
      try {
        const result = await patchObject("Job", input.id, input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "report_job",
    `Meld een job aan via de REST_ReportJob actie. Dit is de standaard manier om een storing of werkverzoek
te rapporteren via de API. De actie maakt een nieuwe job aan, stelt afdeling/kostenplaats in op basis
van het equipment, en berekent SLA-planningsdatums automatisch.
LET OP: vereist een ApplicationElementId header (GUID uit de Application Element Tree in de UCT).
Als je die niet hebt, gebruik dan create_job of create_service_desk_report als alternatief.
Parameters: Description (verplicht), ReportText (verplicht), Context (optioneel, default=TD/1),
EquipmentId, ProcessFunctionId, SiteId, SpaceId, WorkOrderTypeId, ReportDate,
ImageFile/ImageFileBase64 (tot 4 afbeeldingen).`,
    {
      description: z.string().describe("Jobomschrijving (verplicht)"),
      report_text: z.string().describe("Uitgebreide meldingstekst (verplicht)"),
      equipment_id: z.string().optional().describe("Equipment ID"),
      site_id: z.string().optional().describe("Site/vestiging ID"),
      space_id: z.string().optional().describe("Space/ruimte ID"),
      process_function_id: z.string().optional().describe("ProcessFunction ID"),
      work_order_type_id: z.string().optional().describe("WorkOrderType/jobsoort ID"),
      context: z.number().optional().describe("Job context (1=TD, 4=ServiceDesk, 16384=Fleet, etc.). Standaard: 1"),
      image_base64: z.string().optional().describe("Base64-encoded afbeelding (optioneel)"),
      extra_data: z.record(z.unknown()).optional().describe("Extra parameters (ReportDate, ImageFile2-4, etc.)"),
    },
    async (input) => {
      try {
        const data: Record<string, unknown> = {
          Description: input.description,
          ReportText: input.report_text,
        };
        if (input.equipment_id) data.EquipmentId = input.equipment_id;
        if (input.site_id) data.SiteId = input.site_id;
        if (input.space_id) data.SpaceId = input.space_id;
        if (input.process_function_id) data.ProcessFunctionId = input.process_function_id;
        if (input.work_order_type_id) data.WorkOrderTypeId = input.work_order_type_id;
        if (input.context) data.Context = input.context;
        if (input.image_base64) data.ImageFileBase64 = input.image_base64;
        if (input.extra_data) Object.assign(data, input.extra_data);

        const headers: Record<string, string> = {};
        // ApplicationElementId GUID voor REST_ReportJob op demo-omgeving
        const guid = process.env.ULTIMO_GUID_REST_REPORTJOB || "1BA90CC1B7F2452D8825101AD7E7A682";
        if (guid) headers["ApplicationElementId"] = guid;
        const result = await executeAction("REST_ReportJob", data, headers);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_job_progress_history",
    `Haal de statusgeschiedenis van een job op. Toont alle statusovergangen met datum en tijd.
Handig om te zien wanneer een job is aangemaakt, geactiveerd, voltooid, etc.`,
    {
      job_id: z.string().optional().describe("Filter op specifiek Job ID"),
      ...oDataParams,
    },
    async (input) => {
      try {
        const params = buildOData(input);
        if (input.job_id) {
          params.$filter = params.$filter
            ? `Job eq '${input.job_id}' and (${params.$filter})`
            : `Job eq '${input.job_id}'`;
        }
        const result = await getObjects("JobProgressStatusHistory", params);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_job_plans",
    `Haal jobplannen op. Een jobplan is een template/sjabloon voor terugkerende werkzaamheden.
Het bevat standaard instructies, benodigde materialen en inspectieregels die bij het aanmaken van een job worden overgenomen.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("JobPlan", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_job_schedule_parts",
    `Haal de planningonderdelen (schedule parts) van jobs op. Dit zijn de geplande tijdblokken
voor de uitvoering van een job, gekoppeld aan medewerkers en periodes.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("JobSchedulePart", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Work Orders
  server.tool(
    "get_work_orders",
    `Haal werkorders op uit Ultimo. Een werkorder groepeert meerdere jobs onder één overkoepelend werkpakket.
Gebruik filters om te zoeken op type, status, of gerelateerd equipment.
Let op: in Ultimo is 'Job' het daadwerkelijke werkitem, 'WorkOrder' is de bovenliggende groepering.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("WorkOrder", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_work_order",
    `Haal één specifieke werkorder op aan de hand van het ID. Expand met gerelateerde objecten voor meer context.`,
    {
      id: z.string().describe("Het WorkOrder ID"),
      select: z.string().optional(),
      expand: z.string().optional(),
    },
    async (input) => {
      try {
        const result = await getObject("WorkOrder", input.id, { select: input.select, expand: input.expand });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "create_work_order",
    `Maak een nieuwe werkorder aan in Ultimo.`,
    {
      data: z.record(z.unknown()).describe("JSON object met werkorder-eigenschappen"),
    },
    async (input) => {
      try {
        const result = await createObject("WorkOrder", input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "update_work_order",
    `Werk een bestaande werkorder bij (partiële update).`,
    {
      id: z.string().describe("Het WorkOrder ID"),
      data: z.record(z.unknown()).describe("JSON object met te wijzigen eigenschappen"),
    },
    async (input) => {
      try {
        const result = await patchObject("WorkOrder", input.id, input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );
}
