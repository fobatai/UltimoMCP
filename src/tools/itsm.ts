import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { UltimoClient } from "../client.js";
import { oDataParams, buildOData, success, error } from "../types.js";

/**
 * ITSM/ITIL tools voor Ultimo.
 *
 * BELANGRIJK: In Ultimo zijn ITIL-processen gemodelleerd als Job records met verschillende context-waarden:
 * - IT Incident = Job met Context 128
 * - IT Problem = Job met Context 256
 * - Known Error = Job met Context 64
 * - ITIL Change Job = Job met Context 32
 * - Service Request = Job met Context 131072
 *
 * De "Incident" entiteit in Ultimo is voor Fleet/HSE schade, NIET voor ITIL incidents!
 * De "Change" entiteit is WEL een dedicated entiteit voor ITIL Change Management.
 */
export function registerItsmTools(server: McpServer, client: UltimoClient) {
  server.tool(
    "get_it_incidents",
    `Haal IT-incidenten op. LET OP: ITIL-incidenten zijn Job records met Context=128 (ITIncident),
NIET de "Incident" entiteit (die is voor Fleet-schade). Filter op SupportLine (1=eerstelijn, 2=tweedelijn).
SLA-velden: ServiceContractTargetResponseDate, ServiceContractTargetFinishedDate,
ServiceContractResponsePercentage, ServiceContractFinishPercentage.
Priority wordt automatisch berekend via de PriorityMatrix (Impact x Urgency).`,
    {
      support_line: z.number().optional().describe("1=Eerstelijn, 2=Tweedelijn (optioneel)"),
      status: z.string().optional().describe("Status filter, bijv. 'Status in (1, 2, 4)' voor open"),
      site: z.string().optional().describe("Site ID"),
      top: z.number().optional().describe("Maximum (standaard 50)"),
    },
    async (input) => {
      try {
        const filters = ["Context eq 128"];
        if (input.support_line) filters.push(`SupportLine eq ${input.support_line}`);
        if (input.status) filters.push(`(${input.status})`);
        if (input.site) filters.push(`Site eq '${input.site}'`);

        const result = await client.getObjects("Job", {
          $filter: filters.join(" and "),
          $top: input.top ?? 50,
          select: "Id,Description,Status,Equipment,Employee,Priority,Impact,Urgency,SupportLine,ProgressStatus,ServiceContractTargetResponseDate,ServiceContractTargetFinishedDate,ServiceContractResponsePercentage,ServiceContractFinishPercentage,SkillCategory,RecordCreateDate",
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
    "get_it_problems",
    `Haal IT-problemen op. ITIL Problems zijn Job records met Context=256 (ITProblem).
Known Errors zijn Jobs met Context=64 (ITKnownError).`,
    {
      include_known_errors: z.boolean().optional().describe("Ook Known Errors (Context=64) meenemen? Standaard: false"),
      top: z.number().optional().describe("Maximum (standaard 50)"),
    },
    async (input) => {
      try {
        const contextFilter = input.include_known_errors
          ? "Context in (64, 256)"
          : "Context eq 256";
        const result = await client.getObjects("Job", {
          $filter: contextFilter,
          $top: input.top ?? 50,
          select: "Id,Description,Status,Context,Equipment,Employee,Priority,ProgressStatus,RecordCreateDate",
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
    "get_it_changes",
    `Haal ITIL Changes op. Changes zijn een dedicated entiteit (niet Job).
LET OP: de Change entiteit is niet op alle API keys beschikbaar (kan 403 geven).
Statussen: 1=Aangemaakt, 2=Aangevraagd, 4=In voorbereiding, 16=Ter beoordeling,
32=Uitgesteld, 64=Goedgekeurd, 128=In uitvoering, 256=Operationeel, 512=Ter evaluatie,
1024=Gesloten, 2048=Afgewezen, 8=Vervallen.
Bevat 3-fase risicoanalyse: InitialObjectRiskAnalysis, ExpectedObjectRiskAnalysis, RealObjectRiskAnalysis.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await client.getObjects("Change", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_configuration_items",
    `Haal IT Configuration Items (CI's) op uit de CMDB. CI's zijn Equipment records met
Context=32 (ConfigurationItem). Software: Context=64, Netwerk: Context=128, Telefonie: Context=256.
Expand met EquipmentType voor het CI-type (monitor, laptop, printer, etc.).`,
    {
      ci_type: z.enum(["all", "hardware", "software", "network", "telephony"]).optional()
        .describe("Type CI (standaard: all). hardware=32, software=64, network=128, telephony=256"),
      top: z.number().optional().describe("Maximum (standaard 50)"),
      filter: z.string().optional().describe("Extra filter"),
    },
    async (input) => {
      try {
        const contextMap: Record<string, string> = {
          all: "Context in (32, 64, 128, 256)",
          hardware: "Context eq 32",
          software: "Context eq 64",
          network: "Context eq 128",
          telephony: "Context eq 256",
        };
        const filters = [contextMap[input.ci_type ?? "all"]];
        if (input.filter) filters.push(`(${input.filter})`);

        const result = await client.getObjects("Equipment", {
          $filter: filters.join(" and "),
          $top: input.top ?? 50,
          select: "Id,Description,Status,Context,EquipmentType,SerialNumber,Site,Department,Vendor,ServiceContract",
          $orderby: "Id",
          count: true,
        });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_sla_compliance",
    `Haal SLA-compliance informatie op voor IT-incidenten. Toont responstijd- en oplostijd-percentages
ten opzichte van de SLA-targets. Percentage >100% = SLA overschreden.
Filtert op actieve/recente IT-incidenten met SLA-gegevens.`,
    {
      site: z.string().optional().describe("Filter op Site"),
      exceeded_only: z.boolean().optional().describe("Alleen SLA-overschrijdingen tonen? (standaard: false)"),
      top: z.number().optional().describe("Maximum (standaard 50)"),
    },
    async (input) => {
      try {
        const filters = ["Context eq 128"];
        if (input.site) filters.push(`Site eq '${input.site}'`);
        if (input.exceeded_only) {
          filters.push("(ServiceContractResponsePercentage gt 100 or ServiceContractFinishPercentage gt 100)");
        }

        const result = await client.getObjects("Job", {
          $filter: filters.join(" and "),
          $top: input.top ?? 50,
          select: "Id,Description,Status,Priority,ServiceContractTargetResponseDate,ServiceContractTargetFinishedDate,ServiceContractResponseDate,ServiceContractFinishedDate,ServiceContractResponsePercentage,ServiceContractFinishPercentage,Employee,Equipment,RecordCreateDate",
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
    "get_itsm_context_reference",
    `Geeft een overzicht van alle ITSM-gerelateerde context-waarden en hoe ITIL-processen
in Ultimo zijn gemodelleerd. Essentieel om te begrijpen dat ITIL Incidents = Jobs, niet Incidents.`,
    {},
    async () => {
      return success({
        belangrijk: "In Ultimo zijn ITIL-processen gemodelleerd als Job records met verschillende context-waarden. De 'Incident' entiteit is voor Fleet/HSE schade, NIET voor ITIL incidents!",
        itil_job_contexts: {
          "64": "ITKnownError (Known Error)",
          "128": "ITIncident (ITIL Incident)",
          "256": "ITProblem (ITIL Problem)",
          "32": "ItilChangeJob (Change-gerelateerde job)",
          "131072": "ServiceRequest",
          "262144": "ItilChange (ITIL Change als job)",
          "524288": "SelfService",
        },
        dedicated_entities: {
          "Change": "Dedicated entiteit voor ITIL Change Management (RFC). 12 statussen, 31 workflows.",
          "Incident": "NIET voor ITIL! Dit is Fleet/HSE schade-registratie (Context=1=Schade).",
        },
        equipment_ci_contexts: {
          "32": "ConfigurationItem (hardware CI)",
          "64": "Software",
          "128": "Network",
          "256": "Telephony",
        },
        sla_velden_op_job: {
          "ServiceContractTargetResponseDate": "SLA target responstijd",
          "ServiceContractTargetFinishedDate": "SLA target oplostijd",
          "ServiceContractResponsePercentage": "% responstijd verbruikt (>100 = overschreden)",
          "ServiceContractFinishPercentage": "% oplostijd verbruikt (>100 = overschreden)",
        },
        priority_matrix: "Priority = f(Impact, Urgency) via PriorityMatrix lookup tabel. Wijziging triggert herberekening planningsdatums.",
        support_lines: "SupportLine=1 (Eerstelijn), SupportLine=2 (Tweedelijn). Escalatie via 'Naar tweedelijn' knop.",
        master_incident: "IsMaster=true voor grootschalige storingen. Gekoppelde incidenten worden uitgesloten van SLA-tracking.",
      });
    }
  );
}
