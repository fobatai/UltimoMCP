import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { executeAction } from "../client.js";
import { success, error } from "../types.js";

/**
 * ApplicationElementId GUIDs per actie — omgevingsspecifiek!
 * Deze GUIDs komen uit de swagger/AET van de specifieke Ultimo-omgeving.
 * Op andere omgevingen moeten deze GUIDs opnieuw worden opgezocht.
 */
const ACTION_GUIDS: Record<string, string> = {
  // Demo-omgeving GUIDs (025105.ultimo-demo.net)
  "REST_ReportJob": "1BA90CC1B7F2452D8825101AD7E7A682",
  "REST_AttachImageToJob": "D1FB01D577C248DFB95A2ADA578578DF",
  "_send_document_batch": "1024F551B4404703C3578C3F613227BD",
  "_send_document_batch_v2": "780633B8112D4880E942675D76C8B7C9",
};

function getActionHeaders(actionName: string, customGuid?: string): Record<string, string> {
  const guid = customGuid || ACTION_GUIDS[actionName] || process.env[`ULTIMO_GUID_${actionName.toUpperCase()}`];
  if (guid) {
    return { "ApplicationElementId": guid };
  }
  return {};
}

export function registerRestActionTools(server: McpServer) {
  // ==================== MEASUREMENT POINTS ====================
  server.tool(
    "create_equipment_measurement_point",
    `Maak een nieuw meetpunt aan voor een equipment-item via de REST_CreateEquipmentMeasurementPoint actie.
Een meetpunt registreert metingen zoals temperatuur, druk, trillingen, draaiuren, etc.
Vereist: Description, EquipmentId, MeasurementPointId. Geen ApplicationElementId nodig.`,
    {
      equipment_id: z.string().describe("Equipment ID waaraan het meetpunt wordt gekoppeld"),
      measurement_point_id: z.string().describe("Nieuw uniek ID voor het meetpunt"),
      description: z.string().describe("Omschrijving van het meetpunt"),
    },
    async (input) => {
      try {
        const result = await executeAction("REST_CreateEquipmentMeasurementPoint", {
          EquipmentId: input.equipment_id,
          MeasurementPointId: input.measurement_point_id,
          Description: input.description,
        }, getActionHeaders("REST_CreateEquipmentMeasurementPoint"));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "create_process_function_measurement_point",
    `Maak een nieuw meetpunt aan voor een procesfunctie via REST_CreateProcessFunctionMeasurementPoint.
Vergelijkbaar met equipment-meetpunten maar gekoppeld aan een ProcessFunction.`,
    {
      process_function_id: z.string().describe("ProcessFunction ID"),
      measurement_point_id: z.string().describe("Nieuw uniek ID voor het meetpunt"),
      description: z.string().describe("Omschrijving van het meetpunt"),
    },
    async (input) => {
      try {
        const result = await executeAction("REST_CreateProcessFunctionMeasurementPoint", {
          ProcessFunctionId: input.process_function_id,
          MeasurementPointId: input.measurement_point_id,
          Description: input.description,
        }, getActionHeaders("REST_CreateProcessFunctionMeasurementPoint"));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // ==================== RESERVATIONS ====================
  server.tool(
    "create_reservation_via_action",
    `Maak een ruimtereservering aan via de REST_CreateReservation actie. Dit is de officiële manier
om reserveringen aan te maken via de API (in plaats van direct een Reservation object te POST-en).
Geeft het aangemaakte UltimoId terug. Vereist: ApplicantId, Description, SpaceId, StartTime, EndTime, ExternalId.`,
    {
      applicant_id: z.string().describe("Employee ID van de aanvrager"),
      description: z.string().describe("Doel/omschrijving van de reservering"),
      space_id: z.string().describe("Space/ruimte ID"),
      start_time: z.string().describe("Starttijd (DateTimeOffset, bijv. '2024-06-15T09:00:00Z')"),
      end_time: z.string().describe("Eindtijd (DateTimeOffset, bijv. '2024-06-15T10:00:00Z')"),
      external_id: z.string().describe("Extern referentienummer (verplicht, voor integratie)"),
    },
    async (input) => {
      try {
        const result = await executeAction("REST_CreateReservation", {
          ApplicantId: input.applicant_id,
          Description: input.description,
          SpaceId: input.space_id,
          StartTime: input.start_time,
          EndTime: input.end_time,
          ExternalId: input.external_id,
        }, getActionHeaders("REST_CreateReservation"));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "update_reservation_via_action",
    `Werk een bestaande reservering bij via REST_UpdateReservation. Wijzig start- en/of eindtijd.`,
    {
      ultimo_id: z.string().describe("ReservationLine ID in Ultimo"),
      start_time: z.string().optional().describe("Nieuwe starttijd (DateTimeOffset)"),
      end_time: z.string().optional().describe("Nieuwe eindtijd (DateTimeOffset)"),
    },
    async (input) => {
      try {
        const data: Record<string, unknown> = { UltimoId: input.ultimo_id };
        if (input.start_time) data.StartTime = input.start_time;
        if (input.end_time) data.EndTime = input.end_time;
        const result = await executeAction("REST_UpdateReservation", data, getActionHeaders("REST_UpdateReservation"));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "cancel_reservation_via_action",
    `Annuleer een reservering via REST_CancelReservation.`,
    {
      ultimo_id: z.string().describe("ReservationLine ID in Ultimo"),
    },
    async (input) => {
      try {
        const result = await executeAction("REST_CancelReservation", {
          UltimoId: input.ultimo_id,
        }, getActionHeaders("REST_CancelReservation"));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_reservations_for_space",
    `Haal reserveringen op voor een specifieke ruimte in een tijdsperiode via REST_GetReservationsForSpace.
Retourneert max 100 resultaten als JSON. Dit is een actie, geen reguliere GET — het gebruikt een workflow.`,
    {
      space_id: z.string().describe("Space ID"),
      from: z.string().describe("Vanaf (DateTimeOffset, bijv. '2024-06-01T00:00:00Z')"),
      till: z.string().describe("Tot (DateTimeOffset, bijv. '2024-06-30T23:59:59Z')"),
    },
    async (input) => {
      try {
        const result = await executeAction("REST_GetReservationsForSpace", {
          SpaceId: input.space_id,
          From: input.from,
          Till: input.till,
        }, getActionHeaders("REST_GetReservationsForSpace"));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // ==================== ENTITY DESCRIPTION LOOKUP ====================
  server.tool(
    "get_entity_description",
    `Haal de omschrijving op van elk willekeurig Ultimo object via REST_GetDescription.
Geef het entitytype en ID op, en je krijgt de omschrijving terug. Handig als je alleen
de beschrijving nodig hebt zonder alle velden op te halen.`,
    {
      type: z.string().describe("Entitytype, bijv. 'Job', 'Equipment', 'Vendor'"),
      id: z.string().describe("Object ID"),
    },
    async (input) => {
      try {
        const result = await executeAction("REST_GetDescription", {
          Type: input.type,
          Id: input.id,
        }, getActionHeaders("REST_GetDescription"));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // ==================== ARTICLE IMPORT ====================
  server.tool(
    "import_article",
    `Importeer of upsert een artikel via REST_Article_Import. Dit is een dedicated import-workflow
die meer velden ondersteunt dan een directe POST/PUT op het Article object.
Alle velden zijn optioneel — geef alleen de velden mee die je wilt instellen.`,
    {
      data: z.record(z.unknown()).describe("Artikel-gegevens. Beschikbare velden: Id, ExternalId, Description, ArticleGroupId, ManufacturerId, MaximumStock, Purchase (bool), PurchaseLevel, PurchasePrice, PurchaseText, RegisterStock (bool), ShowInWebShop (bool), SiteId, Text, VatId, DataProvider"),
    },
    async (input) => {
      try {
        const result = await executeAction("REST_Article_Import", input.data, getActionHeaders("REST_Article_Import"));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "import_article_vendor",
    `Importeer of upsert een artikel-leverancier koppeling via REST_ArticleVendor_Import.
Koppelt een leverancier aan een artikel met prijsinformatie, levertijden, en bestelgegevens.`,
    {
      data: z.record(z.unknown()).describe("Beschikbare velden: ArticleId, VendorId, ArticleUnitPrice, Discount, ExternalId, LeadTime, MinimumPurchaseQuantity, Preference, PurchaseCode, DataProvider"),
    },
    async (input) => {
      try {
        const result = await executeAction("REST_ArticleVendor_Import", input.data, getActionHeaders("REST_ArticleVendor_Import"));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // ==================== DOCUMENT RETRIEVAL ====================
  server.tool(
    "get_documents_as_base64",
    `Haal documenten op als base64-encoded data via de _REST_DOCUMENT actie.
Geef een Equipment, ProcessFunction, of Article ID op om alle bijbehorende documenten
als base64 terug te krijgen. Handig voor het ophalen van tekeningen, handleidingen, etc.
LET OP: deze custom workflow is niet op alle omgevingen beschikbaar.`,
    {
      equipment: z.string().optional().describe("Equipment ID"),
      process_function: z.string().optional().describe("ProcessFunction ID"),
      article: z.string().optional().describe("Article ID"),
    },
    async (input) => {
      try {
        const data: Record<string, unknown> = {};
        if (input.equipment) data.Equipment = input.equipment;
        if (input.process_function) data.ProcessFunction = input.process_function;
        if (input.article) data.Article = input.article;
        const result = await executeAction("_REST_DOCUMENT", data, getActionHeaders("_REST_DOCUMENT"));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // ==================== DOCUMENT UPLOAD ====================
  server.tool(
    "upload_document_to_job",
    `Upload een document (als base64) en koppel het aan een job via _REST_UPLOADJOBDOC.
Het document wordt opgeslagen in het Ultimo bestandssysteem en gekoppeld als ObjectDocument.
LET OP: custom workflow, niet op alle omgevingen beschikbaar.`,
    {
      job_id: z.string().describe("Job ID"),
      document_data: z.string().describe("Base64-encoded bestandsdata"),
      document_name: z.string().describe("Bestandsnaam incl. extensie, bijv. 'rapport.pdf'"),
      description: z.string().optional().describe("Documentomschrijving"),
      document_type: z.string().optional().describe("DocumentType code"),
    },
    async (input) => {
      try {
        const data: Record<string, unknown> = {
          Job: input.job_id,
          DocumentData: input.document_data,
          DocumentName: input.document_name,
        };
        if (input.description) data.DocumentOmschrijving = input.description;
        if (input.document_type) data.DocumentType = input.document_type;
        const result = await executeAction("_REST_UPLOADJOBDOC", data, getActionHeaders("_REST_UPLOADJOBDOC"));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "upload_document_to_process_function",
    `Upload een document (als base64) en koppel het aan een procesfunctie via _REST_UPLOADPRFDOC.
LET OP: custom workflow, niet op alle omgevingen beschikbaar.`,
    {
      process_function_id: z.string().describe("ProcessFunction ID"),
      document_data: z.string().describe("Base64-encoded bestandsdata"),
      document_name: z.string().describe("Bestandsnaam incl. extensie"),
      description: z.string().optional().describe("Documentomschrijving"),
      document_type: z.string().optional().describe("DocumentType code"),
    },
    async (input) => {
      try {
        const result = await executeAction("_REST_UPLOADPRFDOC", {
          ProcesFunction: input.process_function_id,
          DocumentData: input.document_data,
          DocumentName: input.document_name,
          ...(input.description ? { DocumentOmschrijving: input.description } : {}),
          ...(input.document_type ? { DocumentType: input.document_type } : {}),
        }, getActionHeaders("_REST_UPLOADPRFDOC"));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // ==================== OVERVIEW OF ALL REST ACTIONS ====================
  server.tool(
    "get_rest_actions_overview",
    `Geeft een overzicht van alle bekende REST-callable workflow acties in Ultimo.
Dit zijn workflows die via POST /api/v1/action/{naam} aangeroepen kunnen worden.
Bevat zowel standaard als custom workflows.`,
    {},
    async () => {
      return success({
        standard_actions: {
          "REST_ReportJob": "Meld een nieuwe job aan (Description, ReportText, EquipmentId, etc.)",
          "REST_AttachImageToJob": "Koppel afbeeldingen aan een job (max 4, file of base64)",
          "REST_CreateEquipmentMeasurementPoint": "Maak een meetpunt aan voor equipment",
          "REST_CreateProcessFunctionMeasurementPoint": "Maak een meetpunt aan voor een procesfunctie",
          "REST_CreateReservation": "Maak een ruimtereservering aan",
          "REST_UpdateReservation": "Werk reserveringstijden bij",
          "REST_CancelReservation": "Annuleer een reservering",
          "REST_GetReservationsForSpace": "Haal reserveringen op voor een ruimte (max 100)",
          "REST_GetDescription": "Haal omschrijving op van elk objecttype",
          "REST_Article_Import": "Importeer/upsert artikelen",
          "REST_ArticleVendor_Import": "Importeer/upsert artikel-leverancier koppelingen",
          "REST_Equipment_UpdateTrackAndTraceLocation": "Werk asset-locatie bij (Track & Trace)",
        },
        custom_actions: {
          "_REST_DOCUMENT": "Haal documenten op als base64 (Equipment/ProcessFunction/Article)",
          "_REST_UPLOADJOBDOC": "Upload document (base64) en koppel aan job",
          "_REST_UPLOADPRFDOC": "Upload document (base64) en koppel aan procesfunctie",
          "_rest_uploaddocument": "Upload document (base64) naar map op bestandssysteem",
          "_REST_JOBS": "Haal job-historie op per equipment/procesfunctie/datumbereik",
          "_REST_EQUIPMENT": "Haal alle equipment of procesfunctie-info op",
          "_send_document_batch": "Batch document verwerking",
          "_send_document_batch_v2": "Batch document verwerking v2",
        },
        note: "Standaard acties zijn beschikbaar op alle Ultimo-omgevingen. Custom acties (_REST_*) zijn klantspecifiek en niet op alle omgevingen beschikbaar. Alle acties vereisen de ApiKey header. Sommige custom acties vereisen ook een ApplicationElementId header.",
      });
    }
  );
}
