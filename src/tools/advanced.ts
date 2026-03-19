import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { UltimoClient } from "../client.js";
import { oDataParams, buildOData, success, error } from "../types.js";

export function registerAdvancedTools(server: McpServer, client: UltimoClient) {
  // Batch operations
  server.tool(
    "execute_batch",
    `Voer meerdere Ultimo API operaties uit in één batch request. Maximaal 100 operaties per batch.
Elke operatie bevat een id, method (PUT/POST/PATCH/DELETE), url (relatief pad), en optioneel een body.
Gebruik atomicityGroup om operaties in een transactie te groeperen. Gebruik dependsOn om volgorde af te dwingen.
LET OP: batch ondersteunt ALLEEN schrijfoperaties (PUT/POST/PATCH/DELETE), GEEN GET.
URL in batch ZONDER leading slash: "object/Equipment('001')" (niet "/object/...").
Voorbeeld: [{"id":"1","method":"PATCH","url":"object/Equipment('001')","body":{"Description":"Nieuw"}}]`,
    {
      requests: z.array(z.object({
        id: z.string().describe("Uniek ID voor deze operatie"),
        method: z.enum(["PUT", "POST", "PATCH", "DELETE"]),
        url: z.string().describe("Relatief pad, bijv. /object/Equipment('001')"),
        body: z.record(z.unknown()).optional().describe("Request body (JSON)"),
        atomicityGroup: z.string().optional().describe("Groepeer operaties in één transactie"),
        dependsOn: z.array(z.string()).optional().describe("IDs van operaties die eerst af moeten zijn"),
      })).describe("Lijst van batch operaties (max 100)"),
    },
    async (input) => {
      try {
        const result = await client.executeBatch(input.requests);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Navigation property queries
  server.tool(
    "navigate_collection",
    `Navigeer via een relatie naar een collectie van gerelateerde objecten. Max 3 niveaus diep.
LET OP: navigatie-support verschilt per entiteit! Department('01')/Jobs werkt, maar Equipment('001')/Jobs
geeft een 404. Gebruik bij twijfel altijd een filter als alternatief (bijv. Job?filter=Equipment eq '001').
Werkende paden: "Department('01')/Jobs", "Building('0001')/BuildingParts('001')/BuildingFloors".
Niet-werkend: "Equipment('001')/Jobs" — gebruik filter in plaats daarvan.`,
    {
      path: z.string().describe("Het navigatiepad, bijv. \"Department('01')/Jobs\" of \"Equipment('001')/MeasurementPoints\""),
      ...oDataParams,
    },
    async (input) => {
      try {
        const result = await client.getNavigationCollection(input.path, buildOData(input));
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  server.tool(
    "navigate_single",
    `Navigeer naar een enkel gerelateerd object via een relatie-pad. Bijv. Equipment('001')/Department
om de afdeling van een equipment op te halen. Kan niet gebruikt worden voor collecties.`,
    {
      path: z.string().describe("Het navigatiepad, bijv. \"Equipment('001')/Department\""),
      select: z.string().optional(),
      expand: z.string().optional(),
    },
    async (input) => {
      try {
        const result = await client.getNavigationSingle(input.path, { select: input.select, expand: input.expand });
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // ExternalId lookups
  server.tool(
    "get_object_by_external_id",
    `Haal een Ultimo object op via zijn ExternalId (extern referentienummer). Wordt gebruikt bij integraties
met externe systemen (SAP, ERP, etc.) waar objecten een eigen ID hebben naast het Ultimo ID.
De combinatie ExternalId + DataProvider is uniek. DataProvider default naar 'Rest'.`,
    {
      object_type: z.string().describe("Het objecttype, bijv. 'Equipment', 'Job'"),
      external_id: z.string().describe("Het externe ID"),
      data_provider: z.string().optional().describe("De databron (default: 'Rest'), bijv. 'SAP', 'ERP'"),
      select: z.string().optional(),
      expand: z.string().optional(),
    },
    async (input) => {
      try {
        const result = await client.getObjectByExternalId(
          input.object_type,
          input.external_id,
          input.data_provider,
          { select: input.select, expand: input.expand }
        );
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Pagination - follow nextPageLink
  server.tool(
    "get_next_page",
    `Haal de volgende pagina op van een eerder resultaat. Wanneer een GET-verzoek meer resultaten heeft
dan de opgegeven limiet, bevat het antwoord een 'nextPageLink'. Geef die link hier op om de
volgende pagina op te halen. Blijf dit herhalen totdat nextPageLink null is.`,
    {
      next_page_link: z.string().describe("De volledige nextPageLink URL uit een eerder resultaat"),
    },
    async (input) => {
      try {
        const result = await client.getNextPage(input.next_page_link);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Track & Trace
  server.tool(
    "update_equipment_location",
    `Werk de locatie van een asset bij via de Track & Trace functie. Stuurt een locatie-update
naar Ultimo voor een specifiek equipment-item. De asset moet 'Enable track and trace' aan hebben staan.
Let op: niet geschikt voor ruwe sensordata — gebruik gefilterde data van een tussenplatform.`,
    {
      data: z.record(z.unknown()).describe("JSON object met Equipment ID en Space/locatie informatie"),
    },
    async (input) => {
      try {
        const result = await client.executeAction(
          "REST_Equipment_UpdateTrackAndTraceLocation",
          input.data,
          { "ApplicationElementId": "32909ddd-068d-4a76-9f31-ba69bf7cf3ec" }
        );
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Get all pages helper
  server.tool(
    "get_all_objects",
    `Haal ALLE objecten van een type op door automatisch te pagineren. Let op: dit kan veel API calls
kosten en lang duren bij grote datasets. Gebruik bij voorkeur filters om het resultaat te beperken.
Maximum 10 pagina's worden opgehaald (veiligheidsgrens).`,
    {
      object_type: z.string().describe("Het objecttype, bijv. 'Equipment', 'Job'"),
      filter: z.string().optional().describe("OData filter expressie"),
      select: z.string().optional().describe("Velden om terug te geven"),
      orderby: z.string().optional().describe("Sortering"),
      max_pages: z.number().optional().describe("Maximum aantal pagina's (standaard 10, max 20)"),
    },
    async (input) => {
      try {
        const maxPages = Math.min(input.max_pages ?? 10, 20);
        let allItems: unknown[] = [];
        let page = 0;

        let result = await client.getObjects(input.object_type, {
          $filter: input.filter,
          select: input.select,
          $orderby: input.orderby,
          count: true,
        });

        allItems.push(...result.items);
        page++;

        while (result.nextPageLink && page < maxPages) {
          result = await client.getNextPage(result.nextPageLink);
          allItems.push(...result.items);
          page++;
        }

        return success({
          totalRetrieved: allItems.length,
          totalCount: result.count,
          pagesRetrieved: page,
          hasMore: !!result.nextPageLink,
          items: allItems,
        });
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Filter help
  server.tool(
    "get_filter_help",
    `Toont de beschikbare OData filter operators en voorbeelden voor de Ultimo REST API.
Gebruik dit als je niet zeker weet hoe je een filter moet opbouwen.`,
    {},
    async () => {
      return success({
        operators: {
          "eq": "Gelijk aan — filter=Status eq 2",
          "ne": "Niet gelijk — filter=Status ne 0",
          "gt": "Groter dan — filter=Id gt '100'",
          "ge": "Groter of gelijk — filter=Id ge '100'",
          "lt": "Kleiner dan — filter=Id lt '200'",
          "le": "Kleiner of gelijk — filter=Id le '200'",
          "like": "Patroon (% = wildcard, _ = één teken) — filter=Description like '%pomp%'",
          "in": "In lijst — filter=Status in (1, 2, 3)",
          "and": "Logisch EN — filter=Status eq 2 and Context eq 1",
          "or": "Logisch OF — filter=Status eq 2 or Status eq 3",
          "not": "Logisch NIET — filter=not (Status eq 0)",
          "()": "Groepering — filter=(Status eq 2 or Status eq 3) and Context eq 1",
        },
        relation_filter: "Filter op relatie via /Id — filter=Department/Id eq '01'",
        data_types: "Null, Boolean (true/false), Integer, Decimal, String (met quotes), Date (YYYY-MM-DD), DateTimeOffset (2024-01-15T10:30:00Z), TimeOfDay",
        special_chars: "Enkele quotes verdubbelen: Description eq 'single''quote'. Forward slashes in IDs: gebruik filter ipv pad.",
        verplichte_velden_bij_insert: "Context en Status zijn VERPLICHT bij PUT/POST. Context kan na aanmaak NIET meer gewijzigd worden.",
        datum_format: "UltimoDateTime velden verwachten DateTimeOffset formaat: 2024-01-15T00:00:00Z. Geen gewone date strings gebruiken in filters.",
        belangrijk_200_ok: "Een 200 OK response betekent alleen dat het verzoek ONTVANGEN is, niet dat het succesvol VERWERKT is. Controleer altijd de response body.",
        put_vs_patch: "PUT is DESTRUCTIEF: wist ALLE velden die niet meegegeven worden! Live bevestigd: PUT op Equipment zonder EquipmentType/Site/Manufacturer wist die velden. Gebruik ALTIJD PATCH voor updates tenzij je bewust een volledig object wilt vervangen.",
        delete: "DELETE werkt op entiteiten die het ondersteunen (bijv. ArticleVendor). Retourneert 404 voor niet-bestaande records.",
        multi_orderby: "Multi-field orderby werkt: orderby=Status,RecordCreateDate desc. Default richting is ascending.",
        multi_select: "Select ondersteunt zowel komma-gescheiden (select=Id,Description) als herhaalde params (select=Id&select=Description).",
        expand_max: "Expand ondersteunt ALLEEN single-level. Nested expand ($expand inside $expand) werkt NIET. Voor diepere relaties: maak meerdere calls.",
        like_case: "De like operator is case-insensitive: '%heftruck%' vindt ook 'Heftruck'.",
        expand_null: "Expand op een null-relatie wordt silently genegeerd (geen error, veld gewoon niet in response).",
        expand_select: "BELANGRIJK: als je select gebruikt, moet het expand-veld OOK in select staan, anders wordt de expand genegeerd! Bijv: select=Id,Description,Equipment&expand=Equipment.",
        expand_types: "Single-valued navigatie (Equipment, Vendor) → inline object. Collection navigatie (PurchaseLines, PmJobs, SpareParts) → JSON array van objecten.",
        expand_composite_keys: "Collection expand items met composite keys retourneren Id als nested object: {Purchase:'00001', LineId:'01'}. BEPERKING: entiteiten met composite keys (PurchaseLine, PmJob, etc.) KUNNEN GEEN collection-type expands doen — alleen single-entity expands werken.",
        orderby_beperking: "Orderby werkt alleen voor scalaire velden (Id, RecordCreateDate, Status). Relatie-velden (Priority, Equipment) KUNNEN NIET gesorteerd worden.",
        batch_geen_get: "Batch endpoint ondersteunt ALLEEN schrijfoperaties (PUT/POST/PATCH/DELETE). Geen GET in batch. URL zonder leading slash.",
        autokey: "POST zonder ID werkt alleen als autokey is ingeschakeld voor de entiteit. Anders moet PUT met expliciet ID gebruikt worden.",
        null_vs_empty: "Lege string '' matcht NIET null. Equipment eq '' geeft 0 resultaten. Gebruik 'ne null' om te filteren op gevulde velden.",
        string_vergelijking: "String ID-velden ondersteunen gt/lt/ge/le voor lexicografische vergelijking: Id gt '00010' werkt.",
        locking: "Vergrendelde records blokkeren API writes. DomainObject_SetLockedState bepaalt of een record gelocked is.",
        fda_audit: "FDA-gereguleerde equipment (FDARegulated=true) vereist SignReason en e-signature bij wijzigingen. Moeilijk via API.",
        reservering_conflict: "Reserveringsconflicten geven harde validation errors via API (MessageCode 1015). Geen interactieve conflict-oplossing.",
        accept_language: "Accept-Language header (NL, EN, de-DE) wordt geëchoeerd in Content-Language response header. Data moet wel vertaald zijn in Ultimo — anders krijg je altijd de standaardtaal.",
        strip_html_bevestigd: "Prefer: strip-html verwijdert HTML-opmaak EN newlines uit tekstvelden. Intern zijn Text velden opgeslagen als HTML.",
        nested_get: "Nested GET paden werken impliciet: Equipment('00001')/SpareParts is een alternatief voor expand=SpareParts. Entity-level autorisatie geldt ook voor nested paden.",
        count_only: "Gebruik top=0 met count=true voor een count-only query zonder data.",
        error_codes: "ResourceNotFound (404), EntityNotFound (404), FilterSyntaxError (400). Lege resultaten geven 200 met leeg items array.",
      });
    }
  );

  // Count-only query
  server.tool(
    "count_objects",
    `Tel het aantal objecten van een type zonder data op te halen. Gebruik top=0 met count=true
voor een efficiënte count-only query. Handig voor dashboards en statistieken.`,
    {
      object_type: z.string().describe("Het objecttype, bijv. 'Job', 'Equipment'"),
      filter: z.string().optional().describe("OData filter expressie"),
    },
    async (input) => {
      try {
        const result = await client.getObjects(input.object_type, {
          $top: 0,
          $filter: input.filter,
          count: true,
        });
        return success({ object_type: input.object_type, filter: input.filter ?? "(geen)", count: result.count });
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Nested POST paths
  server.tool(
    "create_nested_record",
    `Maak een record aan via een nested POST pad. Dit is nodig voor child-entiteiten die alleen
aangemaakt kunnen worden binnen de context van hun parent, bijv. InspectionPlanLines, ServiceContractLines.
Beschikbare paden:
- InspectionPlan('{id}')/Lines — InspectionPlanLine
- ServiceContract('{id}')/Lines — ServiceContractLine
- JobPlan('{id}')/InspectionLines — JobPlanInspectionLine
- Equipment('{eq}')/EquipmentMeasurementPoints('{mp}')/Values — meetwaarde
- Employee('{emp}')/LabourWeeks({week})/Lines — urenregel
- Job('{job}')/Weeks({week})/Labours — jobweekarbeid
- PmWorkOrder('{pm}')/PmJobs('{pj}')/InspectionLines — PM inspectieregel
Nested GET werkt ook: Equipment('00001')/SpareParts als alternatief voor expand.`,
    {
      path: z.string().describe("Het nested pad, bijv. \"InspectionPlan('0001')/Lines\""),
      data: z.record(z.unknown()).describe("JSON object met de eigenschappen van het aan te maken record"),
    },
    async (input) => {
      try {
        const result = await client.postNested(input.path, input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // Custom workflow execution
  server.tool(
    "execute_workflow",
    `Voer een custom Ultimo workflow uit via de REST API. Workflows worden aangeroepen via
POST /api/v1/action/{WorkflowName}. De workflow moet AllowUserInteraction="False" hebben
en geconfigureerd zijn in de API key (via AET + API Manager).
Veelgebruikte patronen: _REST_UploadFile, _REST_UPLOADJOBDOC, REST_ReportJob.
Custom workflows beginnen meestal met '_REST_' of '_' prefix.
De ApplicationElementId header is vaak vereist (een GUID uit de Application Element Tree).`,
    {
      workflow_name: z.string().describe("Naam van de workflow, bijv. '_REST_UploadFile' of 'REST_ReportJob'"),
      data: z.record(z.unknown()).optional().describe("JSON payload met workflow parameters"),
      application_element_id: z.string().optional().describe("ApplicationElementId GUID (vaak vereist voor custom workflows)"),
    },
    async (input) => {
      try {
        const headers: Record<string, string> = {};
        if (input.application_element_id) {
          headers["ApplicationElementId"] = input.application_element_id;
        }
        const result = await client.executeAction(input.workflow_name, input.data ?? {}, headers);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // PUT (upsert) object
  server.tool(
    "put_ultimo_object",
    `Maak een object aan of vervang het volledig via PUT. Anders dan PATCH (partieel) vervangt PUT
het hele object — niet-opgegeven velden krijgen hun defaultwaarde of null.
VERPLICHT: Context en Status in de body. Context kan na aanmaak NIET meer gewijzigd worden.
Gebruik PUT voor idempotente upserts (insert-or-update) — ideaal voor integraties.`,
    {
      object_type: z.string().describe("Het objecttype, bijv. 'Equipment', 'Job'"),
      id: z.string().describe("Het object ID"),
      data: z.record(z.unknown()).describe("Volledige set eigenschappen (Context en Status verplicht)"),
    },
    async (input) => {
      try {
        const result = await client.putObject(input.object_type, input.id, input.data);
        return success(result);
      } catch (e: any) {
        return error(e.message);
      }
    }
  );

  // ExternalId upsert
  server.tool(
    "upsert_by_external_id",
    `Maak een object aan of update het via ExternalId. Dit is het standaard integratie-patroon
voor koppelingen met externe systemen (SAP, ERP, etc.). De combinatie ExternalId + DataProvider
is uniek. DataProvider default naar 'Rest'. Gebruikt PUT voor idempotente upserts.`,
    {
      object_type: z.string().describe("Het objecttype"),
      external_id: z.string().describe("Het externe ID (max 50 tekens)"),
      data_provider: z.string().optional().describe("Databron (default: 'Rest')"),
      data: z.record(z.unknown()).describe("Object eigenschappen (Context en Status verplicht bij insert)"),
    },
    async (input) => {
      try {
        const result = await client.putByExternalId(
          input.object_type,
          input.external_id,
          input.data,
          input.data_provider
        );
        return success(result ?? { success: true });
      } catch (e: any) {
        return error(e.message);
      }
    }
  );
}
