import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getObjects, getObject, createObject, patchObject } from "../client.js";
import { oDataParams, buildOData, success, error } from "../types.js";

export function registerMasterDataTools(server: McpServer) {
  server.tool(
    "get_priorities",
    `Haal prioriteiten op. Prioriteiten bepalen de urgentie van jobs (bijv. Nood, Hoog, Normaal, Laag).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Priority", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_urgencies",
    `Haal urgentiegraden op. Vergelijkbaar met prioriteiten maar vanuit een ander perspectief.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Urgency", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_progress_statuses",
    `Haal voortgangsstatussen op. Dit zijn de mogelijke statussen voor jobs
(bijv. Aangevraagd, Actief, Voltooid, Gesloten). Belangrijk om te weten welke statuswaarden geldig zijn.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ProgressStatus", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_work_order_types",
    `Haal werkordertypen op (bijv. Correctief, Preventief, Modificatie, Project).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("WorkOrderType", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_features",
    `Haal kenmerken op. Features zijn eigenschappen die aan objecten gekoppeld worden,
bijv. Kleur, Gewicht, Vermogen. Worden gedefinieerd per EquipmentType.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Feature", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_object_features",
    `Haal objectkenmerkwaarden op — de daadwerkelijke waarden van features voor specifieke objecten.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ObjectFeature", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_customers",
    `Haal klanten op. Klanten zijn de opdrachtgevers voor onderhoudswerkzaamheden,
relevant bij servicebedrijven die voor meerdere klanten werken.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Customer", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_product_dossiers",
    `Haal productdossiers op. Een productdossier bundelt alle informatie over een producttype
(specificaties, tekeningen, certificaten).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ProductDossier", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_physical_quantities",
    `Haal fysieke grootheden op (bijv. Temperatuur, Druk, Snelheid, Stroom).
Worden gebruikt bij meetpunten.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("PhysicalQuantity", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_units",
    `Haal eenheden op (bijv. stuks, meter, liter, uur, kg).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Unit", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Shift Logs
  server.tool(
    "get_shift_logs",
    `Haal dagboekregistraties op. Shift logs registreren gebeurtenissen tijdens een dienst,
bijv. storingen, waarnemingen, overdrachten. Worden gebruikt bij procesoperators.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ShiftLog", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_shift_logbooks",
    `Haal dienstlogboeken op. Een logboek groepeert shift logs per dienst/dag.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ShiftLogbook", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Lendable Objects & Tools
  server.tool(
    "get_lendable_objects",
    `Haal uitleenbare objecten op. Dit zijn assets die uitgeleend worden aan medewerkers,
bijv. meetinstrumenten, gereedschap, of laptops.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("LendableObject", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_tools",
    `Haal gereedschap op. Tools zijn specifieke gereedschappen die bij jobs ingezet worden
en getrackt worden op gebruik en kosten.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Tool", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Customer Satisfaction
  server.tool(
    "get_customer_satisfaction",
    `Haal klanttevredenheidsmetingen op. Registreert feedback van klanten over uitgevoerd onderhoud.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("CustomerSatisfaction", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Fleet-related
  server.tool(
    "get_fleet_data",
    `Haal vlootgerelateerde stamgegevens op. Kies het type: Bodywork (carrosserieën),
Fuel (brandstoftypen), Gearing (transmissietypen), of Finishing (afwerkingen).
Wordt gebruikt bij wagenparkbeheer.`,
    {
      type: z.enum(["Bodywork", "Fuel", "Gearing", "Finishing"]).describe("Het type vlootgegevens"),
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects(input.type, buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Generic object access
  server.tool(
    "get_ultimo_objects",
    `Generieke tool om elk willekeurig Ultimo objecttype op te halen. Gebruik dit als er geen
specifieke tool beschikbaar is voor het gewenste objecttype. Je kunt elk objecttype opgeven dat
in de Ultimo swagger/API documentatie staat. Voorbeelden: Consideration, CommunicationMedium,
TariffGroup, Vat, ContractLineType, RiskClass, etc.`,
    {
      object_type: z.string().describe("Het Ultimo objecttype (exact zoals in de API), bijv. 'Consideration', 'TariffGroup'"),
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects(input.object_type, buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_ultimo_object",
    `Generieke tool om één specifiek Ultimo object op te halen aan de hand van type en ID.
Gebruik dit als fallback wanneer er geen specifieke tool is.`,
    {
      object_type: z.string().describe("Het Ultimo objecttype"),
      id: z.string().describe("Het object ID"),
      select: z.string().optional(),
      expand: z.string().optional(),
    },
    async (input) => {
      try {
        const result = await getObject(input.object_type, input.id, { select: input.select, expand: input.expand });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "create_ultimo_object",
    `Generieke tool om een nieuw Ultimo object aan te maken. Gebruik dit als fallback
wanneer er geen specifieke tool is. Vereist bevestiging voor destructieve objecttypen.`,
    {
      object_type: z.string().describe("Het Ultimo objecttype"),
      data: z.record(z.unknown()).describe("JSON object met de eigenschappen"),
    },
    async (input) => {
      try {
        const result = await createObject(input.object_type, input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "update_ultimo_object",
    `Generieke tool om een bestaand Ultimo object bij te werken (PATCH). Gebruik dit als fallback.`,
    {
      object_type: z.string().describe("Het Ultimo objecttype"),
      id: z.string().describe("Het object ID"),
      data: z.record(z.unknown()).describe("JSON object met te wijzigen eigenschappen"),
    },
    async (input) => {
      try {
        const result = await patchObject(input.object_type, input.id, input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );
}
