import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getObjects, getObject, createObject, patchObject, getObjectComposite, patchObjectComposite } from "../client.js";
import { oDataParams, buildOData, success, error } from "../types.js";

export function registerEquipmentTools(server: McpServer) {
  server.tool(
    "get_equipment",
    `Haal een lijst van equipment (objecten/assets) op uit Ultimo. Equipment is het centrale object in asset management —
het vertegenwoordigt machines, installaties, voertuigen, gebouwonderdelen, etc. Gebruik filters om te zoeken op type,
locatie, status, of andere eigenschappen. Expand met FailTypes, MeasurementPoints, SpareParts voor meer detail.
Voorbeeld filter: $filter=EquipmentType eq 'PUMP' or Location eq 'PLANT-A'.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Equipment", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_equipment_by_id",
    `Haal één specifiek equipment-object op aan de hand van het ID. Geeft alle eigenschappen terug
inclusief technische specificaties, locatie, en onderhoudsinformatie. Gebruik expand voor gerelateerde data
zoals MeasurementPoints, SpareParts, FailTypes, Jobs.`,
    {
      id: z.string().describe("Het unieke Equipment ID, bijv. 'EQ-001'"),
      select: z.string().optional(),
      expand: z.string().optional(),
    },
    async (input) => {
      try {
        const result = await getObject("Equipment", input.id, { select: input.select, expand: input.expand });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "create_equipment",
    `Maak een nieuw equipment-object aan in Ultimo. VERPLICHTE velden: Context en Status.
Context (bitmask): 1=Installatie, 2=Inventaris, 4=Gebouw, 8=Fleet, 32=ConfigItem(IT), 512=Instrument.
Status: 1=Aangemaakt, 2=Actief. Context kan NA aanmaak NIET meer gewijzigd worden.
Optioneel: Id, Description, Location, Site, EquipmentType, PartOfEquipment, Tech1-10 (klantspecifiek).`,
    {
      data: z.record(z.unknown()).describe("JSON object met equipment-eigenschappen. Minimaal 'Id' verplicht."),
    },
    async (input) => {
      try {
        const result = await createObject("Equipment", input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "update_equipment",
    `Werk een bestaand equipment-object bij (partiële update).
Gebruik dit om eigenschappen te wijzigen zoals locatie, status, of technische specificaties.`,
    {
      id: z.string().describe("Het Equipment ID"),
      data: z.record(z.unknown()).describe("JSON object met te wijzigen eigenschappen"),
    },
    async (input) => {
      try {
        const result = await patchObject("Equipment", input.id, input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Equipment Types
  server.tool(
    "get_equipment_types",
    `Haal alle equipment-typen op. Equipment-typen categoriseren assets (bijv. Pomp, Motor, Gebouw, Voertuig).
Gebruik dit om te weten welke typen beschikbaar zijn bij het aanmaken van nieuw equipment.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("EquipmentType", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Measurement Points
  server.tool(
    "get_equipment_measurement_points",
    `Haal meetpunten op voor equipment. Meetpunten registreren metingen zoals temperatuur,
druk, trillingen, draaiuren, etc. Gebruik dit om te zien welke metingen bij een asset horen.
Filter op specifiek equipment met $filter=Equipment eq 'EQ-001'.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("EquipmentMeasurementPoint", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_measurement_values",
    `Haal meetwaarden op voor equipment-meetpunten. Dit zijn de daadwerkelijke geregistreerde metingen
over tijd. Gebruik dit voor trendanalyse en conditiemonitoring.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("EquipmentMeasurementPointValue", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Spare Parts
  server.tool(
    "get_equipment_spare_parts",
    `Haal de reserveonderdelenlijst (spare parts) op voor equipment. Toont welke artikelen als
onderdeel bij een asset horen, inclusief aantallen. Handig voor onderhoudsvoorbereiding.
Filter op specifiek equipment: $filter=Equipment eq 'EQ-001'.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("EquipmentSparePart", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Aoc (Asset of Concern)
  server.tool(
    "get_aocs",
    `Haal Assets of Concern (Aoc) op. Een Aoc is een overkoepelend object dat meerdere equipment-items
kan groeperen, vaak gebruikt voor complexe installaties of systemen.
In sommige Ultimo-configuraties is Aoc het primaire asset-object.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Aoc", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_aoc",
    `Haal één specifieke Asset of Concern op aan de hand van het ID.`,
    {
      id: z.string().describe("Het Aoc ID"),
      select: z.string().optional(),
      expand: z.string().optional(),
    },
    async (input) => {
      try {
        const result = await getObject("Aoc", input.id, { select: input.select, expand: input.expand });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Process Functions
  server.tool(
    "get_process_functions_detailed",
    `Haal procesfuncties op met uitgebreide informatie. ProcessFunction is het centrale asset-object
in veel Ultimo-configuraties — het vertegenwoordigt een functionele eenheid in een proceshiërarchie.
Contexten: 1=ProcessFunction, 2=Configuration, 4=Fleet(vlootnummer), 32768=Object, 65536=Complex, 131072=Route.
Heeft 3-level hiërarchie: PartOfProcessFunction > TopOfProcessFunction > TopOfProcessFunctionWithinSameContext.
152 properties incl. financieel, afschrijving, risico/criticality, GIS, en 10 Tech-velden.
Expand met Jobs, Equipments, PmWorkOrders, SpareParts, MeasurementPoints.`,
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

  // Object Downtime
  server.tool(
    "get_object_downtime",
    `Haal stilstandregistraties op voor equipment/objecten. Toont wanneer een asset niet beschikbaar was,
inclusief begin- en eindtijd en reden. Belangrijk voor OEE-berekeningen en beschikbaarheidsanalyse.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ObjectDowntime", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Fail Types
  server.tool(
    "get_fail_types",
    `Haal faaltypen (storingstypen) op. Faaltypen categoriseren de oorzaak van storingen,
bijv. Mechanisch, Elektrisch, Lekkage. Worden gekoppeld aan jobs en equipment.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("FailType", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );
}
