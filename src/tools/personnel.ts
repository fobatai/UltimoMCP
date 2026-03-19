import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { UltimoClient } from "../client.js";
import { oDataParams, buildOData, success, error } from "../types.js";

export function registerPersonnelTools(server: McpServer, client: UltimoClient) {
  // Employees
  server.tool(
    "get_employees",
    `Haal medewerkers op uit Ultimo. Medewerkers worden toegewezen aan jobs en hebben arbeidsregistraties.
Filter op Department, Site, of naam. Expand met EmployeeLabours voor urenregistratie.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await client.getObjects("Employee", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_employee",
    `Haal één specifieke medewerker op aan de hand van het ID.`,
    {
      id: z.string().describe("Het Employee ID"),
      select: z.string().optional(),
      expand: z.string().optional(),
    },
    async (input) => {
      try {
        const result = await client.getObject("Employee", input.id, { select: input.select, expand: input.expand });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "create_employee",
    `Maak een nieuwe medewerker aan in Ultimo.`,
    {
      data: z.record(z.unknown()).describe("JSON object met medewerker-eigenschappen"),
    },
    async (input) => {
      try {
        const result = await client.createObject("Employee", input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "update_employee",
    `Werk een bestaande medewerker bij.`,
    {
      id: z.string().describe("Het Employee ID"),
      data: z.record(z.unknown()).describe("Te wijzigen eigenschappen"),
    },
    async (input) => {
      try {
        const result = await client.patchObject("Employee", input.id, input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Employee Labour (time registration)
  server.tool(
    "get_employee_labour",
    `Haal urenregistraties (arbeidsuren) op voor medewerkers. Toont per week hoeveel uren
een medewerker op welke jobs heeft gewerkt. Essentieel voor urenbeheer en kostentoerekening.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await client.getObjects("EmployeeLabour", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "get_employee_labour_lines",
    `Haal individuele urenregistratie-regels op. Elke regel bevat de gewerkte uren op een
specifieke job op een specifieke dag. Filter op Employee of Job.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await client.getObjects("EmployeeLabourLine", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Craftsmen
  server.tool(
    "get_craftsmen",
    `Haal vakmannen/vaklieden op. Een Craftsman is een specialisatie-categorie
(bijv. Elektricien, Monteur, Lasser) die aan medewerkers en jobs gekoppeld wordt.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await client.getObjects("Craftsman", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Departments
  server.tool(
    "get_departments",
    `Haal afdelingen op. Afdelingen groeperen medewerkers en kunnen gekoppeld zijn aan jobs en kosten.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await client.getObjects("Department", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Skill Categories
  server.tool(
    "get_skill_categories",
    `Haal competentiecategorieën op. Skills worden aan medewerkers gekoppeld om
de juiste persoon voor de juiste job te plannen.`,
    {
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await client.getObjects("SkillCategory", buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );
}
