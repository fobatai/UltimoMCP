\# Ultimo MCP Generator — Curiosity-Driven Discovery Loop



\## Doel



Bouw een autonome agent die een volledige, productieklare MCP (Model Context Protocol) server genereert voor de Ultimo EAM/CMMS REST API. De agent werkt \*\*niet\*\* top-down vanuit aannames over wat Ultimo doet, maar \*\*ontdekt\*\* iteratief wat Ultimo kan via een curiosity loop: bouwen → reflecteren → gaten detecteren → kennisbank doorzoeken → verder bouwen → stoppen wanneer niets nieuws meer gevonden wordt.



Het eindresultaat is een MCP server in TypeScript (of Python) die alle relevante Ultimo functionaliteit afdekt en direct inzetbaar is via Claude Desktop of Claude Code.



\---



\## Architectuur van de loop



```

\[START]

&#x20;  ↓

\[BOUW] — genereer MCP tools op basis van huidige kennis

&#x20;  ↓

\[REFLECTEER] — wat heb ik gebouwd? wat mis ik mogelijk?

&#x20;  ↓                          ↓

\[KENNISBANK]            \[SWAGGER CHECK]

zoek aangrenzende       zijn er endpoints

concepten op            zonder tool coverage?

&#x20;  ↓                          ↓

\[GAP DETECTIE] — combineer beide bronnen → nieuwe gaps

&#x20;  ↓

\[NIEUW?] — zit dit al in de MCP? nee → bouw, ja → skip

&#x20;  ↓

\[CONVERGENTIE CHECK] — stop als geen nieuwe gaps meer

&#x20;  ↓

\[KLAAR] — schrijf finale MCP server weg

```



\### Stopconditie (convergentie)



Stop de loop als aan \*\*beide\*\* voorwaarden is voldaan:

1\. De reflectiestap genereert geen concepten die niet al gedekt zijn door bestaande tools (overlap > 90%)

2\. De swagger check vindt geen endpoint-categorie zonder bijbehorende MCP tool



Hard fallback: stop na maximaal \*\*20 iteraties\*\* ongeacht convergentie.



\---



\## Beschikbare bronnen



\### 1. Kennisbank MCP server

\- \*\*URL:\*\* `https://mcp.pontifexxpaddock.com/mcp`

\- \*\*Gebruik:\*\* zoek op Ultimo-concepten, functies, workflows, valkuilen

\- Beschikbare tools: `search\_knowledge`, `deep\_search`, `list\_items`, `get\_item`

\- Dit is de primaire bron voor "wat weet het team al over Ultimo"

\- De kennisbank is opgebouwd door Ultimo-consultants — vertrouw de inhoud



\### 2. Ultimo Swagger / OpenAPI docs

\- \*\*Swagger JSON (OpenAPI 3.0.4):\*\* `https://025105.ultimo-demo.net/api/v1/docs/0001`

\- \*\*Begin elke sessie\*\* met het ophalen van deze URL — dit is je volledige kaart van de oplossingsruimte

\- De swagger is leidend bij twijfel over endpoint-namen, parameters en response-structuren



\### 3. Ultimo REST API basisprincipes

\- \*\*Base URL:\*\* `https://025105.ultimo-demo.net/api/v1`

\- \*\*Authenticatie:\*\* header `AppKey: 8CD270BF724E406FB843B1BB3FB90816`

\- Objecten ophalen (lijst): `GET /object/{ObjectType}` — bijv. `/object/Job`, `/object/Equipment`

\- Enkel object: `GET /object/{ObjectType}('{Id}')` — bijv. `/object/Job('WO-001')`

\- Aanmaken of volledig updaten: `PUT /object/{ObjectType}('{Id}')`

\- Partieel updaten: `PATCH /object/{ObjectType}('{Id}')`

\- Acties uitvoeren: `POST /action/{ActionName}`

\- Query parameters: `$top`, `$skip`, `$filter`, `$orderby`, `select`, `expand`, `count`

\- \*\*Response formaat lijst:\*\* `{ "count": int|null, "nextPageLink": string|null, "items": \[...] }`

\- \*\*Response formaat enkel object:\*\* direct het object als JSON (geen wrapper)

\- \*\*Relaties navigeren:\*\* via `expand` — bijv. `?expand=Costs,Purchases`

\- \*\*Let op:\*\* objectnamen komen exact uit de swagger — bijv. `Job` (niet `WorkOrder`), `Aoc`, `Article`. Verifieer altijd via de swagger, neem nooit aan.



\---



\## Werkwijze per iteratie



\### Stap 1 — Bouw

Genereer of update MCP tools. Elke tool moet bevatten:

\- Duidelijke `name` (snake\_case, bijv. `get\_work\_orders`)

\- Uitgebreide `description` — dit is wat de LLM leest om te beslissen of hij de tool gebruikt. Wees specifiek: wanneer gebruik je deze tool, wat geeft hij terug, wat zijn typische use cases.

\- Goed getypeerde `inputSchema` met alle relevante parameters inclusief optionele OData-filters

\- Implementatie die daadwerkelijk de Ultimo REST API aanroept

\- Foutafhandeling: HTTP errors, lege resultaten, authenticatiefouten



\### Stap 2 — Reflecteer

Stel jezelf na elke bouwstap expliciet deze vragen:

1\. "Welke Ultimo-modules heb ik nu afgedekt?" (maak een lijst)

2\. "Welke Ultimo-modules bestaan er die ik \*nog niet\* heb afgedekt?"

3\. "Wat zou een Ultimo-consultant dagelijks doen dat ik nu nog niet kan ondersteunen?"

4\. "Zijn er relaties tussen objecten die ik nog niet kan navigeren?"

5\. "Zijn er statusovergangen of workflows die ik nog niet kan triggeren?"



Schrijf de antwoorden op als gestructureerde lijst — dit is de input voor de gap detectie.



\### Stap 3 — Kennisbank exploratie

Zoek voor elk concept uit de reflectie in de kennisbank:

\- Gebruik `deep\_search` voor brede verkenning van een nieuw concept

\- Gebruik `search\_knowledge` voor gerichte zoekopdrachten

\- Let specifiek op: valkuilen, afwijkend gedrag, niet-voor-de-hand-liggende endpoints

\- Noteer wat je vindt én wat je \*niet\* vindt (absence of evidence is ook informatie)



\### Stap 4 — Swagger check

Categoriseer alle endpoints uit de swagger per domein:

\- Equipment / Assets

\- Work Orders (aanmaken, muteren, statussen, regels)

\- Preventief onderhoud (PM-schema's, triggers)

\- Inkoop (bestellingen, leveranciers, facturen)

\- Voorraadbeheer (magazijn, mutaties, reserveringen)

\- Personeel / Resources

\- Locaties / Installaties

\- Documenten / Bijlagen

\- Rapportage / KPIs

\- Configuratie / Stamdata



Vergelijk per categorie: heb ik hier tools voor? Zo nee → gap.



\### Stap 5 — Convergentie check

Na elke iteratie: tel het aantal nieuwe tools dat is toegevoegd.

\- ≥ 1 nieuwe tool → doorgaan

\- 0 nieuwe tools EN swagger check levert geen nieuwe categorieën → stoppen



\---



\## Output specificaties



\### MCP server structuur

Genereer een werkende MCP server met de volgende bestanden:



```

ultimo-mcp/

├── package.json          (of pyproject.toml)

├── src/

│   ├── index.ts          hoofdentrypoint, registreert alle tools

│   ├── client.ts         Ultimo API client (authenticatie, basis-requests, error handling)

│   ├── tools/

│   │   ├── work-orders.ts

│   │   ├── equipment.ts

│   │   ├── maintenance.ts

│   │   ├── purchasing.ts

│   │   ├── inventory.ts

│   │   └── ... (een bestand per domein)

│   └── types.ts          gedeelde TypeScript types voor Ultimo responses

└── .env.example          ULTIMO\_BASE\_URL, ULTIMO\_API\_KEY

```



Gebruik deze waarden in je `.env`:

```

ULTIMO\_BASE\_URL=https://025105.ultimo-demo.net

ULTIMO\_API\_KEY=8CD270BF724E406FB843B1BB3FB90816

```



\### Tool kwaliteitseisen

Elke tool voldoet aan:

\- \*\*Description is rijkelijk:\*\* minimaal 3 zinnen, inclusief voorbeeldgebruik

\- \*\*Parameters zijn compleet:\*\* alle relevante OData opties blootgesteld als optionele parameters

\- \*\*Response is bruikbaar:\*\* geef niet de ruwe OData wrapper terug, maar een opgeschoonde JSON

\- \*\*Errors zijn informatief:\*\* "Ultimo returned 401 - check ULTIMO\_API\_KEY" niet "Request failed"



\### Kennisbank items (bijproduct)

Voor elk nieuw ontdekt concept dat nog niet in de kennisbank staat: schrijf een kennisbank item weg via de kennisbank MCP (`manage\_knowledge`). Format:

```json

{

&#x20; "type": "Ultimo API",

&#x20; "name": "...",

&#x20; "content": "...",

&#x20; "tags": \["api", "mcp", "ontdekt-door-agent"]

}

```



\---



\## Reflectieprompt (gebruik deze letterlijk in elke iteratiecyclus)



```

Je bent een Ultimo EAM/CMMS expert die een MCP server bouwt.



Tot nu toe heb je de volgende MCP tools gebouwd:

{LIJST\_VAN\_HUIDIGE\_TOOLS}



Beantwoord nu de volgende vragen:



1\. Welke Ultimo-functionaliteit gebruik je dagelijks als consultant die NIET wordt afgedekt door bovenstaande tools? Noem minimaal 5 concrete voorbeelden.



2\. Welke Ultimo-objecttypen ken je die NIET terugkomen in de bovenstaande tools?



3\. Welke statusovergangen of workflow-acties in Ultimo zijn cruciaal maar ontbreken?



4\. Als een gebruiker vraagt "help me met \[X in Ultimo]", voor welke X zou jij nu geen tool hebben?



5\. Welke combinaties van meerdere API-calls zijn zo gebruikelijk dat ze een eigen tool verdienen?



Geef je antwoord als een genummerde lijst van ontbrekende functionaliteit.

```



\---



\## Constraints en guardrails



\- \*\*Geen aannames over endpoints:\*\* als je niet zeker bent of een endpoint bestaat, check de swagger eerst

\- \*\*Geen destructieve acties zonder bevestiging:\*\* delete- en bulk-update tools krijgen een `confirm: boolean` parameter die `true` moet zijn

\- \*\*Credentials via .env:\*\* zie bovenstaande `.env` sectie

\- \*\*Kennisbank is leading:\*\* als de kennisbank zegt dat iets werkt op manier X, bouw het zo — ook al suggereert de swagger iets anders

\- \*\*Taal:\*\* tool names en code in Engels, descriptions in Nederlands (dit is een NL-gericht team)

\- \*\*Ultimo versie:\*\* ga uit van Ultimo 22+ tenzij de kennisbank anders aangeeft



\---



\## Kickoff instructie



Begin met:



1\. Haal de swagger spec op en categoriseer alle endpoints (geef een overzicht per domein)

2\. Doorzoek de kennisbank op "Ultimo REST API" en "Ultimo MCP" voor bestaande kennis

3\. Bouw een eerste versie met de meest gebruikte functionaliteit (work orders, equipment, PM)

4\. Start de curiosity loop



Rapporteer na elke iteratie:

\- Wat heb je gebouwd (tool namen)

\- Wat heb je ontdekt (gaps)

\- Convergentiestatus (X nieuwe tools, doorgaan of stoppen)

