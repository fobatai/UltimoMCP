import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getObjects, getObject } from "../client.js";
import { oDataParams, buildOData, success, error } from "../types.js";

export function registerConditionTools(server: McpServer) {
  server.tool(
    "get_condition_measurements",
    `Haal conditiemetingen op. Conditiemetingen registreren de staat van assets volgens
een normering (bijv. NEN 2767). Elke meting resulteert in een conditiescore.
Wordt veel gebruikt in vastgoedbeheer en infrastructuur.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ConditionMeasurement", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_condition_flaws",
    `Haal conditiegebreken op. Gebreken zijn specifieke tekortkomingen die tijdens een
conditiemeting zijn geconstateerd (bijv. scheuren, corrosie, lekkage).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ConditionFlaw", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_condition_flaw_types",
    `Haal gebrektypen op (bijv. Scheur, Corrosie, Lekkage, Vervorming).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ConditionFlawType", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_condition_risks",
    `Haal conditierisico's op. Risico's worden beoordeeld op basis van conditiescores
en bepalen de urgentie van onderhoud.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ConditionRisk", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_condition_risk_scores",
    `Haal risicoscores op. Scores kwantificeren het risico op basis van kans en impact.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ConditionRiskScore", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_object_risk_analyses",
    `Haal risico-analyses op voor objecten. Een risico-analyse combineert meerdere risicofactoren
tot een totaalscore voor een asset.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ObjectRiskAnalysis", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_risk_factors",
    `Haal risicofactoren op (bijv. Veiligheid, Milieu, Productie, Kosten).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("RiskFactor", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_condition_interests",
    `Haal conditie-interesses op. Een interest definieert het belang van een element
vanuit verschillende perspectieven (technisch, financieel, functioneel).`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await getObjects("ConditionInterest", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );
}
