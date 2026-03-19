import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getObjects, getObject, createObject, patchObject, getObjectComposite, patchObjectComposite, deleteObjectComposite } from "../client.js";
import { oDataParams, buildOData, success, error } from "../types.js";

export function registerInventoryTools(server: McpServer) {
  // Articles
  server.tool(
    "get_articles",
    `Haal artikelen (onderdelen/materialen) op uit het Ultimo magazijn. Artikelen zijn de basis van
voorraadbeheer — elk artikel heeft een uniek ID, beschrijving, en kan gekoppeld zijn aan meerdere
magazijnen, leveranciers en equipment (als reserveonderdeel). Filter op ArticleGroup, naam, etc.
Contexten: 1=Standaard, 2=Catering, 4=Menu, 8=IT, 16=Tankbeurten, 32=Inventarisartikel.
StockStatusCode (berekend): B=onder bestelpunt+onvoldoende besteld, F=onder+voldoende besteld,
E=boven maar onvoldoende, V=voldoende. Expand met ArticleWarehouses, Vendors, EquipmentSpareParts.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Article", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_article",
    `Haal één specifiek artikel op. Expand met ArticleWarehouses, ArticleVendors, etc.`,
    {
      id: z.string().describe("Het Article ID"),
      select: z.string().optional(),
      expand: z.string().optional(),
    },
    async (input) => {
      try {
        const result = await getObject("Article", input.id, { select: input.select, expand: input.expand });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "create_article",
    `Maak een nieuw artikel aan in de artikelstamgegevens.`,
    {
      data: z.record(z.unknown()).describe("JSON object met artikel-eigenschappen. Minimaal 'Id' verplicht."),
    },
    async (input) => {
      try {
        const result = await createObject("Article", input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "update_article",
    `Werk een bestaand artikel bij.`,
    {
      id: z.string().describe("Het Article ID"),
      data: z.record(z.unknown()).describe("Te wijzigen eigenschappen"),
    },
    async (input) => {
      try {
        const result = await patchObject("Article", input.id, input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Article Groups
  server.tool(
    "get_article_groups",
    `Haal artikelgroepen op. Artikelgroepen categoriseren artikelen (bijv. Elektrisch, Mechanisch, Smeermiddelen).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ArticleGroup", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Article-Warehouse (stock levels)
  server.tool(
    "get_article_warehouse_stock",
    `Haal voorraadniveaus op per artikel per magazijn. Toont actuele voorraad, minimumvoorraad,
en bestelpunt. Essentieel voor voorraadbeheer en inkoopplanning.
Filter op specifiek artikel: $filter=Article eq 'ART-001'.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ArticleWarehouse", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Article-Vendor (supplier info)
  server.tool(
    "get_article_vendors",
    `Haal artikel-leverancier koppelingen op. Toont welke leveranciers een artikel leveren,
inclusief leverancier-artikelnummer, prijs, en levertijd.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ArticleVendor", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Warehouses
  server.tool(
    "get_warehouses",
    `Haal magazijnen op. Een magazijn is een fysieke opslaglocatie voor artikelen.
Elk magazijn heeft locaties (WarehouseLocations) waar artikelen liggen opgeslagen.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Warehouse", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_warehouse_locations",
    `Haal magazijnlocaties op (stellingen, vakken, etc. binnen een magazijn).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("WarehouseLocation", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Materials (issued materials for jobs)
  server.tool(
    "get_materials",
    `Haal materiaaluitgiften op. Een Material record registreert het gebruik van een artikel
voor een job — de daadwerkelijke materiaaluitgifte vanuit het magazijn.
Filter op Job of Article.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Material", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "create_material",
    `Registreer een materiaaluitgifte (artikel uitgeven voor een job vanuit het magazijn).`,
    {
      data: z.record(z.unknown()).describe("JSON object met materiaaluitgifte-gegevens (Article, Job, Quantity, etc.)"),
    },
    async (input) => {
      try {
        const result = await createObject("Material", input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Reservations
  server.tool(
    "get_reservations",
    `Haal voorraadreserveringen op. Een reservering legt een artikel vast voor een specifieke job,
zodat het niet voor andere doeleinden uitgegeven wordt.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Reservation", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "create_reservation",
    `Maak een voorraadreservering aan voor een artikel/job combinatie.`,
    {
      data: z.record(z.unknown()).describe("JSON object met reservering-gegevens"),
    },
    async (input) => {
      try {
        const result = await createObject("Reservation", input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );
}
