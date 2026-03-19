import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { UltimoClient } from "../client.js";
import { oDataParams, buildOData, success, error } from "../types.js";

export function registerDocumentTools(server: McpServer, client: UltimoClient) {
  server.tool(
    "get_documents",
    `Haal documenten op uit Ultimo. Documenten zijn bestanden (tekeningen, handleidingen, foto's, etc.)
die gekoppeld zijn aan equipment, jobs, of andere objecten. Filter op DocumentType, naam, of gekoppeld object.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await client.getObjects("Document", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_document",
    `Haal één specifiek document op.`,
    {
      id: z.string().describe("Het Document ID"),
      select: z.string().optional(),
      expand: z.string().optional(),
    },
    async (input) => {
      try {
        const result = await client.getObject("Document", input.id, { select: input.select, expand: input.expand });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "create_document",
    `Maak een nieuw document aan in Ultimo (metadata, niet het bestand zelf).`,
    {
      data: z.record(z.unknown()).describe("JSON object met document-eigenschappen"),
    },
    async (input) => {
      try {
        const result = await client.createObject("Document", input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_document_types",
    `Haal documenttypen op (bijv. Tekening, Handleiding, Foto, Certificaat).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await client.getObjects("DocumentType", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_object_documents",
    `Haal object-document koppelingen op. Toont welke documenten aan welke objecten
(equipment, jobs, etc.) gekoppeld zijn.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await client.getObjects("ObjectDocument", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "attach_image_to_job",
    `Koppel een afbeelding aan een job via de REST_AttachImageToJob actie.
Gebruik dit om foto's (bijv. van storingen) aan een job te koppelen via de API.`,
    {
      data: z.record(z.unknown()).describe("JSON object met de afbeeldingsgegevens en job-referentie"),
    },
    async (input) => {
      try {
        const result = await client.executeAction("REST_AttachImageToJob", input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );
}
