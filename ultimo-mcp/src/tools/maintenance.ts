import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getObjects, getObject, createObject, patchObject, getObjectComposite, patchObjectComposite } from "../client.js";
import { oDataParams, buildOData, success, error } from "../types.js";

export function registerMaintenanceTools(server: McpServer) {
  // Preventive Maintenance Work Orders
  server.tool(
    "get_pm_work_orders",
    `Haal preventieve onderhoudswerkorders (PM Work Orders) op. Een PM Work Order is een sjabloon
voor periodiek terugkerend onderhoud, gekoppeld aan een frequentie of trigger. Het genereert
automatisch jobs op basis van het onderhoudsschema. Filter op equipment, frequentie, of status.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("PmWorkOrder", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_pm_work_order",
    `Haal één specifieke PM werkorder op. Expand met PmJobs voor de onderliggende taken.`,
    {
      id: z.string().describe("Het PmWorkOrder ID"),
      select: z.string().optional(),
      expand: z.string().optional(),
    },
    async (input) => {
      try {
        const result = await getObject("PmWorkOrder", input.id, { select: input.select, expand: input.expand });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "create_pm_work_order",
    `Maak een nieuw preventief onderhoudsschema (PM Work Order) aan. Definieer het equipment,
de frequentie, en de uit te voeren taken.`,
    {
      data: z.record(z.unknown()).describe("JSON object met PM werkorder-eigenschappen"),
    },
    async (input) => {
      try {
        const result = await createObject("PmWorkOrder", input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "update_pm_work_order",
    `Werk een bestaand PM onderhoudsschema bij.`,
    {
      id: z.string().describe("Het PmWorkOrder ID"),
      data: z.record(z.unknown()).describe("JSON object met te wijzigen eigenschappen"),
    },
    async (input) => {
      try {
        const result = await patchObject("PmWorkOrder", input.id, input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // PM Jobs (lines within a PM Work Order)
  server.tool(
    "get_pm_jobs",
    `Haal PM jobs op — dit zijn de individuele taken binnen een preventief onderhoudsschema.
Elke PM job definieert een specifieke taak die bij elke onderhoudsbeurt uitgevoerd moet worden.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("PmJob", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Inspection Plans
  server.tool(
    "get_inspection_plans",
    `Haal inspectieplannen op. Een inspectieplan definieert een set van inspectiecriteria/checklijsten
die bij een inspectie doorlopen moeten worden. Wordt gebruikt bij NEN 2767, conditiemetingen, en rondgangen.
Expand met Lines voor de individuele inspectieregels.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("InspectionPlan", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_inspection_plan",
    `Haal één specifiek inspectieplan op. Expand met Lines voor alle inspectieregels.`,
    {
      id: z.string().describe("Het InspectionPlan ID"),
      select: z.string().optional(),
      expand: z.string().optional(),
    },
    async (input) => {
      try {
        const result = await getObject("InspectionPlan", input.id, { select: input.select, expand: input.expand });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Inspection Lines (results)
  server.tool(
    "get_inspection_lines",
    `Haal inspectieregels (resultaten) op. Dit zijn de daadwerkelijke ingevulde inspectieresultaten,
gekoppeld aan een job of equipment. Filter op Job, Equipment, of InspectionPlan.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("InspectionLine", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "create_inspection_line",
    `Registreer een nieuw inspectieresultaat.`,
    {
      data: z.record(z.unknown()).describe("JSON object met inspectieregel-gegevens"),
    },
    async (input) => {
      try {
        const result = await createObject("InspectionLine", input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Frequencies
  server.tool(
    "get_frequencies",
    `Haal frequenties op. Frequenties bepalen het interval van preventief onderhoud,
bijv. wekelijks, maandelijks, per 1000 draaiuren. Worden gekoppeld aan PM werkorders.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Frequency", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Maintenance Classifications & States
  server.tool(
    "get_maintenance_classifications",
    `Haal onderhoudsclassificaties op (bijv. correctief, preventief, modificatie).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("MaintenanceClassification", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_maintenance_states",
    `Haal onderhoudsstaten op — de conditiestatus van assets (bijv. goed, matig, slecht).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("MaintenanceState", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );
}
