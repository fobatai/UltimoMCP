/**
 * Factory for creating per-tenant MCP server instances.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { UltimoClient } from "./client.js";
import { TenantConfig } from "./tenant-store.js";

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

export function createMcpForTenant(config: TenantConfig): McpServer {
  const client = new UltimoClient(config.base_url, config.api_key, config.action_guids);

  const server = new McpServer({
    name: `ultimo-mcp-${config.slug}`,
    version: "1.0.0",
  });

  registerJobTools(server, client);
  registerEquipmentTools(server, client);
  registerMaintenanceTools(server, client);
  registerPurchasingTools(server, client);
  registerInventoryTools(server, client);
  registerPersonnelTools(server, client);
  registerLocationTools(server, client);
  registerCostTools(server, client);
  registerDocumentTools(server, client);
  registerContractTools(server, client);
  registerIncidentTools(server, client);
  registerConditionTools(server, client);
  registerMasterDataTools(server, client);
  registerCompositeTools(server, client);
  registerAdvancedTools(server, client);
  registerConvenienceTools(server, client);
  registerModuleTools(server, client);
  registerRestActionTools(server, client);
  registerItsmTools(server, client);

  return server;
}
