import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { UltimoClient } from "../client.js";
import { oDataParams, buildOData, success, error } from "../types.js";

export function registerCostTools(server: McpServer, client: UltimoClient) {
  server.tool(
    "get_costs",
    `Haal kosten op uit Ultimo. Kosten worden geregistreerd per job, equipment, of project.
Elke kostenregel heeft een bedrag, kostensoort (CostType), en kostenplaats (CostCenter).
Filter op Job, Equipment, CostType, of periode (RecordCreateDate).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await client.getObjects("Cost", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "create_cost",
    `Registreer een nieuwe kostenregel.`,
    {
      data: z.record(z.unknown()).describe("JSON object met kosten-gegevens (Amount, CostType, Job, etc.)"),
    },
    async (input) => {
      try {
        const result = await client.createObject("Cost", input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_cost_centers",
    `Haal kostenplaatsen op. Kostenplaatsen worden gebruikt voor financiële toerekening van
onderhoudskosten aan afdelingen of projecten.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await client.getObjects("CostCenter", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_cost_types",
    `Haal kostensoorten op (bijv. Arbeid, Materiaal, Uitbesteding, Gereedschap).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await client.getObjects("CostType", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Projects
  server.tool(
    "get_projects",
    `Haal projecten op. Projecten groeperen meerdere jobs en kosten onder een overkoepelend project,
bijv. een renovatie of grote revisie. Handig voor budgetbewaking.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await client.getObjects("Project", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Accounts
  server.tool(
    "get_accounts",
    `Haal grootboekrekeningen (accounts) op. Worden gebruikt voor financiële integratie.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await client.getObjects("Account", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );
}
