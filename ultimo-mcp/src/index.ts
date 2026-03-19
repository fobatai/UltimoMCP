#!/usr/bin/env node
/**
 * Ultimo MCP Server
 *
 * MCP server voor de Ultimo EAM/CMMS REST API.
 * Biedt tools voor het beheren van jobs, equipment, preventief onderhoud,
 * inkoop, voorraadbeheer, personeel, documenten, contracten, en meer.
 */

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Load .env file manually (no dotenv dependency)
import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

function loadEnv() {
  try {
    const envPath = resolve(__dirname, "..", ".env");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env file is optional
  }
}

loadEnv();

// Import tool registrars
import { registerJobTools } from "./tools/jobs.js";
import { registerEquipmentTools } from "./tools/equipment.js";
import { registerMaintenanceTools } from "./tools/maintenance.js";
import { registerPurchasingTools } from "./tools/purchasing.js";
import { registerInventoryTools } from "./tools/inventory.js";
import { registerPersonnelTools } from "./tools/personnel.js";
import { registerLocationTools } from "./tools/locations.js";
import { registerCostTools } from "./tools/costs.js";
import { registerDocumentTools } from "./tools/documents.js";
import { registerContractTools } from "./tools/contracts.js";
import { registerIncidentTools } from "./tools/incidents.js";
import { registerConditionTools } from "./tools/condition.js";
import { registerMasterDataTools } from "./tools/masterdata.js";
import { registerCompositeTools } from "./tools/composite.js";
import { registerAdvancedTools } from "./tools/advanced.js";
import { registerConvenienceTools } from "./tools/convenience.js";
import { registerModuleTools } from "./tools/modules.js";
import { registerRestActionTools } from "./tools/rest-actions.js";
import { registerItsmTools } from "./tools/itsm.js";

const server = new McpServer({
  name: "ultimo-mcp",
  version: "1.0.0",
});

// Register all tool domains
registerJobTools(server);
registerEquipmentTools(server);
registerMaintenanceTools(server);
registerPurchasingTools(server);
registerInventoryTools(server);
registerPersonnelTools(server);
registerLocationTools(server);
registerCostTools(server);
registerDocumentTools(server);
registerContractTools(server);
registerIncidentTools(server);
registerConditionTools(server);
registerMasterDataTools(server);
registerCompositeTools(server);
registerAdvancedTools(server);
registerConvenienceTools(server);
registerModuleTools(server);
registerRestActionTools(server);
registerItsmTools(server);

// Start the server
async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Ultimo MCP server gestart");
}

main().catch((err) => {
  console.error("Fatale fout bij het starten van de Ultimo MCP server:", err);
  process.exit(1);
});
