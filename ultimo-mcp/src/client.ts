/**
 * Ultimo REST API Client
 * Handles authentication, requests, error handling, and OData query building.
 *
 * API docs: https://devdocs.ultimo.net
 * Query params follow OData v4 standard.
 * Rate limits: 10.000 requests/dag, 100/10sec, max 1MB payload.
 */

const BASE_URL = process.env.ULTIMO_BASE_URL || "https://025105.ultimo-demo.net";
const API_KEY = process.env.ULTIMO_API_KEY || "";

export interface UltimoListResponse<T = Record<string, unknown>> {
  count: number | null;
  nextPageLink: string | null;
  items: T[];
}

export interface ODataParams {
  $top?: number;
  $skip?: number;
  $filter?: string;
  $orderby?: string;
  select?: string;
  expand?: string;
  count?: boolean;
}

export interface RequestOptions {
  language?: string;       // Accept-Language header (e.g. "NL", "en-US")
  stripHtml?: boolean;     // Add Prefer: strip-html header
  company?: string;        // Ultimo-Company header for multi-company setups
}

function buildQueryString(params: ODataParams): string {
  const parts: string[] = [];
  // Ultimo API accepts params both with and without $ prefix.
  // The swagger spec uses names without $, the docs show both.
  if (params.$top !== undefined) parts.push(`top=${params.$top}`);
  if (params.$skip !== undefined) parts.push(`skip=${params.$skip}`);
  if (params.$filter) parts.push(`filter=${encodeURIComponent(params.$filter)}`);
  if (params.$orderby) parts.push(`orderby=${encodeURIComponent(params.$orderby)}`);
  if (params.select) parts.push(`select=${encodeURIComponent(params.select)}`);
  if (params.expand) parts.push(`expand=${encodeURIComponent(params.expand)}`);
  if (params.count) parts.push(`count=true`);
  return parts.length > 0 ? "?" + parts.join("&") : "";
}

async function request(
  path: string,
  options: RequestInit = {},
  reqOptions: RequestOptions = {}
): Promise<unknown> {
  if (!API_KEY) {
    throw new Error("ULTIMO_API_KEY is niet geconfigureerd. Stel deze in via de .env file.");
  }

  const url = `${BASE_URL}/api/v1${path}`;
  const headers: Record<string, string> = {
    "ApiKey": API_KEY,
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> || {}),
  };

  if (reqOptions.language) {
    headers["Accept-Language"] = reqOptions.language;
  }
  if (reqOptions.stripHtml) {
    headers["Prefer"] = "strip-html";
  }
  if (reqOptions.company) {
    headers["Ultimo-Company"] = reqOptions.company;
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const body = await response.text();
    const status = response.status;
    if (status === 401) {
      throw new Error(`Ultimo returned 401 Unauthorized — controleer ULTIMO_API_KEY. Response: ${body}`);
    }
    if (status === 404) {
      throw new Error(`Ultimo returned 404 Not Found — het object of endpoint bestaat niet. URL: ${url}. Response: ${body}`);
    }
    if (status === 429) {
      throw new Error(`Ultimo returned 429 Too Many Requests — rate limit bereikt. Limiet: 10.000 requests/dag, 100 per 10 seconden. Probeer het later opnieuw. Response: ${body}`);
    }
    if (status === 413) {
      throw new Error(`Ultimo returned 413 Payload Too Large — maximale payload is 1MB per request. Response: ${body}`);
    }
    throw new Error(`Ultimo API fout (HTTP ${status}): ${body}`);
  }

  const text = await response.text();
  if (!text) return null;
  return JSON.parse(text);
}

/** GET a list of objects with OData query parameters */
export async function getObjects<T = Record<string, unknown>>(
  objectType: string,
  params: ODataParams = {},
  reqOptions: RequestOptions = {}
): Promise<UltimoListResponse<T>> {
  const qs = buildQueryString(params);
  const result = await request(`/object/${objectType}${qs}`, {}, reqOptions);
  return result as UltimoListResponse<T>;
}

/** GET a single object by ID */
export async function getObject<T = Record<string, unknown>>(
  objectType: string,
  id: string,
  params: Pick<ODataParams, "select" | "expand"> = {},
  reqOptions: RequestOptions = {}
): Promise<T> {
  const qs = buildQueryString(params);
  const result = await request(`/object/${objectType}('${encodeURIComponent(id)}')${qs}`, {}, reqOptions);
  return result as T;
}

/** GET a single object by ExternalId */
export async function getObjectByExternalId<T = Record<string, unknown>>(
  objectType: string,
  externalId: string,
  dataProvider?: string,
  params: Pick<ODataParams, "select" | "expand"> = {}
): Promise<T> {
  const qs = buildQueryString(params);
  const keyPart = dataProvider
    ? `ExternalId='${encodeURIComponent(externalId)}',DataProvider='${encodeURIComponent(dataProvider)}'`
    : `ExternalId='${encodeURIComponent(externalId)}'`;
  const result = await request(`/object/${objectType}(${keyPart})${qs}`);
  return result as T;
}

/** GET a single object with composite key */
export async function getObjectComposite<T = Record<string, unknown>>(
  objectType: string,
  keys: Record<string, string | number>,
  params: Pick<ODataParams, "select" | "expand"> = {}
): Promise<T> {
  const keyParts = Object.entries(keys)
    .map(([k, v]) => typeof v === "number" ? `${k}=${v}` : `${k}='${encodeURIComponent(String(v))}'`)
    .join(",");
  const qs = buildQueryString(params);
  const result = await request(`/object/${objectType}(${keyParts})${qs}`);
  return result as T;
}

/** Navigate to a related collection (e.g. /object/Department('01')/Jobs) */
export async function getNavigationCollection<T = Record<string, unknown>>(
  path: string,
  params: ODataParams = {}
): Promise<UltimoListResponse<T>> {
  const qs = buildQueryString(params);
  const result = await request(`/object/${path}${qs}`);
  return result as UltimoListResponse<T>;
}

/** Navigate to a single related object (e.g. /object/Equipment('001')/Department) */
export async function getNavigationSingle<T = Record<string, unknown>>(
  path: string,
  params: Pick<ODataParams, "select" | "expand"> = {}
): Promise<T> {
  const qs = buildQueryString(params);
  const result = await request(`/object/${path}${qs}`);
  return result as T;
}

/** POST to create a new object */
export async function createObject<T = Record<string, unknown>>(
  objectType: string,
  data: Record<string, unknown>
): Promise<T> {
  const result = await request(`/object/${objectType}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return result as T;
}

/** PUT to create or fully update an object */
export async function putObject<T = Record<string, unknown>>(
  objectType: string,
  id: string,
  data: Record<string, unknown>
): Promise<T> {
  const result = await request(`/object/${objectType}('${encodeURIComponent(id)}')`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
  return result as T;
}

/** PATCH to partially update an object */
export async function patchObject<T = Record<string, unknown>>(
  objectType: string,
  id: string,
  data: Record<string, unknown>
): Promise<T> {
  const result = await request(`/object/${objectType}('${encodeURIComponent(id)}')`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return result as T;
}

/** PATCH with composite key */
export async function patchObjectComposite<T = Record<string, unknown>>(
  objectType: string,
  keys: Record<string, string | number>,
  data: Record<string, unknown>
): Promise<T> {
  const keyParts = Object.entries(keys)
    .map(([k, v]) => typeof v === "number" ? `${k}=${v}` : `${k}='${encodeURIComponent(String(v))}'`)
    .join(",");
  const result = await request(`/object/${objectType}(${keyParts})`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return result as T;
}

/** DELETE an object (composite key) */
export async function deleteObjectComposite(
  objectType: string,
  keys: Record<string, string | number>
): Promise<void> {
  const keyParts = Object.entries(keys)
    .map(([k, v]) => typeof v === "number" ? `${k}=${v}` : `${k}='${encodeURIComponent(String(v))}'`)
    .join(",");
  await request(`/object/${objectType}(${keyParts})`, { method: "DELETE" });
}

/** POST an action */
export async function executeAction<T = Record<string, unknown>>(
  actionName: string,
  data: Record<string, unknown> = {},
  extraHeaders: Record<string, string> = {}
): Promise<T> {
  const result = await request(`/action/${actionName}`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: extraHeaders,
  });
  return result as T;
}

/** POST to a nested collection (e.g. /object/Job('{Id}')/ScheduleParts) */
export async function postNested<T = Record<string, unknown>>(
  path: string,
  data: Record<string, unknown>
): Promise<T> {
  const result = await request(`/object/${path}`, {
    method: "POST",
    body: JSON.stringify(data),
  });
  return result as T;
}

/** Execute a batch of operations (max 100 per request) */
export interface BatchRequest {
  id: string;
  method: "PUT" | "POST" | "PATCH" | "DELETE";
  url: string;
  body?: Record<string, unknown> | null;
  atomicityGroup?: string;
  dependsOn?: string[];
}

export async function executeBatch(
  requests: BatchRequest[]
): Promise<unknown> {
  if (requests.length > 100) {
    throw new Error("Batch mag maximaal 100 records bevatten per request.");
  }
  const result = await request("/batch", {
    method: "POST",
    body: JSON.stringify({ requests }),
  });
  return result;
}

/** Follow a nextPageLink to get the next page of results */
export async function getNextPage<T = Record<string, unknown>>(
  nextPageLink: string
): Promise<UltimoListResponse<T>> {
  // nextPageLink is a full URL, extract the path
  const url = new URL(nextPageLink);
  const path = url.pathname.replace(/^\/api\/v1/, "") + url.search;
  const result = await request(path);
  return result as UltimoListResponse<T>;
}
