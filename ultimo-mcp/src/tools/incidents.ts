import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getObjects, getObject, createObject, patchObject } from "../client.js";
import { oDataParams, buildOData, success, error } from "../types.js";

export function registerIncidentTools(server: McpServer) {
  // Incidents
  server.tool(
    "get_incidents",
    `Haal incidenten op uit Ultimo. De Incident-entiteit registreert fleet-schade (voertuigschade) en HSE-incidenten —
NIET ITIL IT-incidenten. LET OP: voor ITIL IT-incidenten gebruik get_it_incidents (Job Context=128).
Een incident is een ongewenst voorval dat een of meer jobs kan triggeren.
Incidents hebben een eigen levenscyclus met status en oorzaakanalyse.
Filter op IncidentType, Status, Equipment, of datum.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Incident", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_incident",
    `Haal één specifiek incident op.`,
    {
      id: z.string().describe("Het Incident ID"),
      select: z.string().optional(),
      expand: z.string().optional(),
    },
    async (input) => {
      try {
        const result = await getObject("Incident", input.id, { select: input.select, expand: input.expand });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "create_incident",
    `Registreer een nieuw incident.`,
    {
      data: z.record(z.unknown()).describe("JSON object met incident-gegevens"),
    },
    async (input) => {
      try {
        const result = await createObject("Incident", input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "update_incident",
    `Werk een bestaand incident bij.`,
    {
      id: z.string().describe("Het Incident ID"),
      data: z.record(z.unknown()).describe("Te wijzigen eigenschappen"),
    },
    async (input) => {
      try {
        const result = await patchObject("Incident", input.id, input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_incident_types",
    `Haal incidenttypen op (bijv. Storing, Klacht, Verzoek).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("IncidentType", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_incident_causes",
    `Haal incidentoorzaken op. Oorzaken worden na analyse aan een incident gekoppeld voor
root cause analysis en trendrapportages.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("IncidentCause", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Safety Incidents
  server.tool(
    "get_safety_incidents",
    `Haal veiligheidsincidenten op. Dit zijn incidenten met een veiligheidsaspect,
bijv. bijna-ongevallen, letsel, of gevaarlijke situaties. Vaak verplicht te registreren.
Bevat body-part tracking velden (getroffen lichaamsdelen) voor letselregistratie.
Statussen: 1=Aangemaakt, 2=Gemeld, 4=In behandeling, 8=Te evalueren, 16=Gereed, 32=Gesloten, 64=Vervallen.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("SafetyIncident", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Permits
  server.tool(
    "get_permits",
    `Haal werkvergunningen op. Permits regelen de veiligheidstoestemming voor het uitvoeren
van werkzaamheden, bijv. een vuurwerkvergunning of LOTO-procedure.
Worden gekoppeld aan Jobs, Equipment, Space, en LOTO-aanvragen.
Statussen: 1=Aangemaakt, 2=Aangevraagd, 4=Voorbereid, 8=Actief, 16=Gesloten,
32=Te verlengen, 64=Template aangemaakt, 128=Template goedgekeurd.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("Permit", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );
}
