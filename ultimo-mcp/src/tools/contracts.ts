import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getObjects, getObject, createObject, patchObject } from "../client.js";
import { oDataParams, buildOData, success, error } from "../types.js";

export function registerContractTools(server: McpServer) {
  server.tool(
    "get_service_contracts",
    `Haal servicecontracten op uit Ultimo. Een servicecontract regelt de afspraken met een
leverancier of klant over te leveren onderhoudsdiensten, inclusief SLA's, prijzen, en scope.
Filter op Vendor, ContractType, Status, of verloopsdatum.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ServiceContract", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_service_contract",
    `Haal één specifiek servicecontract op. Expand met Lines voor de contractregels.`,
    {
      id: z.string().describe("Het ServiceContract ID"),
      select: z.string().optional(),
      expand: z.string().optional(),
    },
    async (input) => {
      try {
        const result = await getObject("ServiceContract", input.id, { select: input.select, expand: input.expand });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "create_service_contract",
    `Maak een nieuw servicecontract aan.`,
    {
      data: z.record(z.unknown()).describe("JSON object met contract-eigenschappen"),
    },
    async (input) => {
      try {
        const result = await createObject("ServiceContract", input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "update_service_contract",
    `Werk een bestaand servicecontract bij.`,
    {
      id: z.string().describe("Het ServiceContract ID"),
      data: z.record(z.unknown()).describe("Te wijzigen eigenschappen"),
    },
    async (input) => {
      try {
        const result = await patchObject("ServiceContract", input.id, input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_service_contract_lines",
    `Haal contractregels op. Elke regel definieert een specifiek equipment-item of dienst
binnen het contract, inclusief afspraken en tarieven.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ServiceContractLine", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_service_contract_types",
    `Haal contracttypen op (bijv. Onderhoudscontract, SLA, Garantie).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ServiceContractType", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_service_contract_forms",
    `Haal contractvormen op.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ServiceContractForm", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );
}
