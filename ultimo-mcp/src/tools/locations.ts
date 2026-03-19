import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getObjects, getObject, patchObject } from "../client.js";
import { oDataParams, buildOData, success, error } from "../types.js";

export function registerLocationTools(server: McpServer) {
  // Locations
  server.tool(
    "get_locations",
    `Haal locaties op uit Ultimo. Locaties zijn fysieke plekken waar equipment zich bevindt,
bijv. een gebouw, hal, verdieping. Locaties vormen vaak een hiërarchie.
Equipment wordt aan locaties gekoppeld voor ruimtelijk beheer.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Location", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_location",
    `Haal één specifieke locatie op.`,
    {
      id: z.string().describe("Het Location ID"),
      select: z.string().optional(),
      expand: z.string().optional(),
    },
    async (input) => {
      try {
        const result = await getObject("Location", input.id, { select: input.select, expand: input.expand });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Sites
  server.tool(
    "get_sites",
    `Haal sites (vestigingen) op. Een Site is het hoogste niveau in de locatiehiërarchie —
een fysieke vestiging of complex. Alle equipment, locaties, en magazijnen vallen onder een site.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Site", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Spaces
  server.tool(
    "get_spaces",
    `Haal ruimtes op. Een Space is het laagste niveau in de gebouwhiërarchie (binnen een bouwlaag).
Contexten: 1=Ruimte, 2=Verhuurbare eenheid, 4=Parkeerplaats. Kan reserveerbaar zijn met capaciteit,
opstellingen, en voorbereidings-/opruimtijden. Expand met BuildingFloor, Employees, Equipments, ObjectFeatures.
Wordt ook gebruikt voor sleutelbeheer (welke cilinders/sleutels horen bij deze ruimte).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Space", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Buildings
  server.tool(
    "get_buildings",
    `Haal gebouwen op uit Ultimo. Gebouwen zijn onderdeel van de hiërarchie: Complex > Gebouw > Bouwdeel > Bouwlaag > Ruimte.
Contexten: 1=Standaard, 2=Complex. Expand met BuildingParts, ChildBuildings, PartOfBuilding, ObjectFeatures, CostCenter, Site.
Bevat adresgegevens, oppervlakten, vervangingswaarde, en Google Maps integratie (GeocodeX/Y).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Building", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_building_floors",
    `Haal verdiepingen van gebouwen op.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("BuildingFloor", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_building_parts",
    `Haal gebouwonderdelen op (bijv. dak, gevel, fundering). Wordt gebruikt bij conditiemetingen (NEN 2767).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("BuildingPart", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Process Functions
  server.tool(
    "get_process_functions",
    `Haal procesfuncties op. Een procesfunctie beschrijft de rol van een asset binnen een proces,
bijv. 'Koeling', 'Transport', 'Energievoorziening'. Wordt gekoppeld aan equipment.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ProcessFunction", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );
}
