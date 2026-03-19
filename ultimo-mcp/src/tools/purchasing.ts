import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getObjects, getObject, createObject, patchObject, getObjectComposite, patchObjectComposite } from "../client.js";
import { oDataParams, buildOData, success, error } from "../types.js";

export function registerPurchasingTools(server: McpServer) {
  // Purchases
  server.tool(
    "get_purchases",
    `Haal inkooporders (bestellingen) op uit Ultimo. Een Purchase is een bestelling bij een leverancier,
met één of meer bestelregels (PurchaseLines). Filter op Vendor, Status, Site, of datum.
Statuswaarden: 1=Open, 2=Goedgekeurd, 4=Actief(besteld), 32=Gesloten, 64=Deels ontvangen,
128=Concept, 256=Ontvangen, 512=Vervallen, 1024=Aanvraag.
Expand met PurchaseLines, Receipts, InvoiceLines, Vendor voor meer context.
Inkoopflow: PurchaseRequest → Purchase → Receipt → Invoice → Cost.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Purchase", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_purchase",
    `Haal één specifieke inkooporder op. Expand met Lines, Vendor voor alle details.`,
    {
      id: z.string().describe("Het Purchase ID"),
      select: z.string().optional(),
      expand: z.string().optional(),
    },
    async (input) => {
      try {
        const result = await getObject("Purchase", input.id, { select: input.select, expand: input.expand });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "create_purchase",
    `Maak een nieuwe inkooporder aan.`,
    {
      data: z.record(z.unknown()).describe("JSON object met inkooporder-eigenschappen"),
    },
    async (input) => {
      try {
        const result = await createObject("Purchase", input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "update_purchase",
    `Werk een bestaande inkooporder bij.`,
    {
      id: z.string().describe("Het Purchase ID"),
      data: z.record(z.unknown()).describe("Te wijzigen eigenschappen"),
    },
    async (input) => {
      try {
        const result = await patchObject("Purchase", input.id, input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Purchase Lines
  server.tool(
    "get_purchase_lines",
    `Haal bestelregels op. Elke regel bevat een artikel, aantal, prijs, en eventueel een gekoppelde job.
Filter op Purchase om regels van een specifieke bestelling te zien.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("PurchaseLine", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Purchase Requests
  server.tool(
    "get_purchase_requests",
    `Haal inkoopaanvragen op. Een PurchaseRequest is een intern verzoek tot inkoop dat nog
goedgekeurd moet worden voordat het een daadwerkelijke bestelling (Purchase) wordt.
Statuswaarden: 1=Aangemaakt, 2=Aanvraag, 4=Concept, 8=Goedgekeurd, 16=Bestelling aangemaakt,
32=Afgewezen, 64=Actief, 128=Gesloten, 256=Deels geleverd, 512=Geleverd, 2048=Besteladvies.
Contexten: 1=Bestelaanvraag, 2=Offertetraject, 4=OrderRequest. Expand met Lines.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("PurchaseRequest", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "create_purchase_request",
    `Maak een nieuwe inkoopaanvraag aan.`,
    {
      data: z.record(z.unknown()).describe("JSON object met inkoopaanvraag-eigenschappen"),
    },
    async (input) => {
      try {
        const result = await createObject("PurchaseRequest", input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Receipts
  server.tool(
    "get_receipts",
    `Haal goederenontvangsten op. Een Receipt registreert de ontvangst van bestelde goederen.
Statuswaarden: 1=Open, 2=Voorlopig goedgekeurd, 4=Goedgekeurd, 16=Retour open, 32=Retour goedgekeurd.
Expand met Lines, Purchase, Vendor, InvoiceLines voor meer context.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Receipt", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "create_receipt",
    `Registreer een goederenontvangst.`,
    {
      data: z.record(z.unknown()).describe("JSON object met ontvangst-gegevens"),
    },
    async (input) => {
      try {
        const result = await createObject("Receipt", input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Vendors
  server.tool(
    "get_vendors",
    `Haal leveranciers op uit Ultimo. Leveranciers zijn gekoppeld aan inkooporders, artikelen,
en servicecontracten. Filter op VendorType, naam, of andere eigenschappen.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Vendor", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_vendor",
    `Haal één specifieke leverancier op.`,
    {
      id: z.string().describe("Het Vendor ID"),
      select: z.string().optional(),
      expand: z.string().optional(),
    },
    async (input) => {
      try {
        const result = await getObject("Vendor", input.id, { select: input.select, expand: input.expand });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "create_vendor",
    `Maak een nieuwe leverancier aan.`,
    {
      data: z.record(z.unknown()).describe("JSON object met leverancier-eigenschappen"),
    },
    async (input) => {
      try {
        const result = await createObject("Vendor", input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );
}
