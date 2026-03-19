/**
 * Shared types and helper for MCP tool registration.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

/** Standard OData parameters reusable across tools */
export const oDataParams = {
  top: z.number().optional().describe("Maximum aantal resultaten (standaard: 50)"),
  skip: z.number().optional().describe("Aantal resultaten overslaan voor paginering"),
  filter: z.string().optional().describe("OData $filter expressie, bijv. \"Status eq 'Active'\""),
  orderby: z.string().optional().describe("OData $orderby expressie, bijv. \"RecordCreateDate desc\""),
  select: z.string().optional().describe("Komma-gescheiden lijst van velden om terug te geven, bijv. \"Id,Description,Status\""),
  expand: z.string().optional().describe("Komma-gescheiden lijst van relaties om uit te breiden, bijv. \"Equipment,Employee\""),
  count: z.boolean().optional().describe("Geef het totaal aantal resultaten terug (true/false)"),
};

/** Build OData params object from tool input */
export function buildOData(input: {
  top?: number;
  skip?: number;
  filter?: string;
  orderby?: string;
  select?: string;
  expand?: string;
  count?: boolean;
}) {
  return {
    $top: input.top ?? 50,
    $skip: input.skip,
    $filter: input.filter,
    $orderby: input.orderby,
    select: input.select,
    expand: input.expand,
    count: input.count,
  };
}

/** Format a successful MCP tool response */
export function success(data: unknown) {
  return { content: [{ type: "text" as const, text: JSON.stringify(data, null, 2) }] };
}

/** Format an error MCP tool response */
export function error(message: string) {
  return { content: [{ type: "text" as const, text: `Fout: ${message}` }], isError: true };
}

export type ToolRegistrar = (server: McpServer) => void;
