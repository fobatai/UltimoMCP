/**
 * Ultimo REST API Client
 * Handles authentication, requests, error handling, and OData query building.
 *
 * API docs: https://devdocs.ultimo.net
 * Query params follow OData v4 standard.
 * Rate limits: 10.000 requests/dag, 100/10sec, max 1MB payload.
 */

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

export interface BatchRequest {
  id: string;
  method: "PUT" | "POST" | "PATCH" | "DELETE";
  url: string;
  body?: Record<string, unknown> | null;
  atomicityGroup?: string;
  dependsOn?: string[];
}

export class UltimoClient {
  private baseUrl: string;
  private apiKey: string;
  private actionGuids: Record<string, string>;

  constructor(baseUrl: string, apiKey: string, actionGuids: Record<string, string> = {}) {
    this.baseUrl = baseUrl;
    this.apiKey = apiKey;
    this.actionGuids = actionGuids;
  }

  private buildQueryString(params: ODataParams): string {
    const parts: string[] = [];
    if (params.$top !== undefined) parts.push(`top=${params.$top}`);
    if (params.$skip !== undefined) parts.push(`skip=${params.$skip}`);
    if (params.$filter) parts.push(`filter=${encodeURIComponent(params.$filter)}`);
    if (params.$orderby) parts.push(`orderby=${encodeURIComponent(params.$orderby)}`);
    if (params.select) parts.push(`select=${encodeURIComponent(params.select)}`);
    if (params.expand) parts.push(`expand=${encodeURIComponent(params.expand)}`);
    if (params.count) parts.push(`count=true`);
    return parts.length > 0 ? "?" + parts.join("&") : "";
  }

  private async request(
    path: string,
    options: RequestInit = {},
    reqOptions: RequestOptions = {}
  ): Promise<unknown> {
    if (!this.apiKey) {
      throw new Error("ULTIMO_API_KEY is niet geconfigureerd.");
    }

    const url = `${this.baseUrl}/api/v1${path}`;
    const headers: Record<string, string> = {
      "ApiKey": this.apiKey,
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
        throw new Error(`Ultimo returned 429 Too Many Requests — rate limit bereikt. Probeer het later opnieuw. Response: ${body}`);
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
  async getObjects<T = Record<string, unknown>>(
    objectType: string,
    params: ODataParams = {},
    reqOptions: RequestOptions = {}
  ): Promise<UltimoListResponse<T>> {
    const qs = this.buildQueryString(params);
    const result = await this.request(`/object/${objectType}${qs}`, {}, reqOptions);
    return result as UltimoListResponse<T>;
  }

  /** GET a single object by ID */
  async getObject<T = Record<string, unknown>>(
    objectType: string,
    id: string,
    params: Pick<ODataParams, "select" | "expand"> = {},
    reqOptions: RequestOptions = {}
  ): Promise<T> {
    const qs = this.buildQueryString(params);
    const result = await this.request(`/object/${objectType}('${encodeURIComponent(id)}')${qs}`, {}, reqOptions);
    return result as T;
  }

  /** GET a single object by ExternalId */
  async getObjectByExternalId<T = Record<string, unknown>>(
    objectType: string,
    externalId: string,
    dataProvider?: string,
    params: Pick<ODataParams, "select" | "expand"> = {}
  ): Promise<T> {
    const qs = this.buildQueryString(params);
    const keyPart = dataProvider
      ? `ExternalId='${encodeURIComponent(externalId)}',DataProvider='${encodeURIComponent(dataProvider)}'`
      : `ExternalId='${encodeURIComponent(externalId)}'`;
    const result = await this.request(`/object/${objectType}(${keyPart})${qs}`);
    return result as T;
  }

  /** GET a single object with composite key */
  async getObjectComposite<T = Record<string, unknown>>(
    objectType: string,
    keys: Record<string, string | number>,
    params: Pick<ODataParams, "select" | "expand"> = {}
  ): Promise<T> {
    const keyParts = Object.entries(keys)
      .map(([k, v]) => typeof v === "number" ? `${k}=${v}` : `${k}='${encodeURIComponent(String(v))}'`)
      .join(",");
    const qs = this.buildQueryString(params);
    const result = await this.request(`/object/${objectType}(${keyParts})${qs}`);
    return result as T;
  }

  /** Navigate to a related collection */
  async getNavigationCollection<T = Record<string, unknown>>(
    path: string,
    params: ODataParams = {}
  ): Promise<UltimoListResponse<T>> {
    const qs = this.buildQueryString(params);
    const result = await this.request(`/object/${path}${qs}`);
    return result as UltimoListResponse<T>;
  }

  /** Navigate to a single related object */
  async getNavigationSingle<T = Record<string, unknown>>(
    path: string,
    params: Pick<ODataParams, "select" | "expand"> = {}
  ): Promise<T> {
    const qs = this.buildQueryString(params);
    const result = await this.request(`/object/${path}${qs}`);
    return result as T;
  }

  /** POST to create a new object */
  async createObject<T = Record<string, unknown>>(
    objectType: string,
    data: Record<string, unknown>
  ): Promise<T> {
    const result = await this.request(`/object/${objectType}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return result as T;
  }

  /** PUT to create or fully update an object */
  async putObject<T = Record<string, unknown>>(
    objectType: string,
    id: string,
    data: Record<string, unknown>
  ): Promise<T> {
    const result = await this.request(`/object/${objectType}('${encodeURIComponent(id)}')`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return result as T;
  }

  /** PATCH to partially update an object */
  async patchObject<T = Record<string, unknown>>(
    objectType: string,
    id: string,
    data: Record<string, unknown>
  ): Promise<T> {
    const result = await this.request(`/object/${objectType}('${encodeURIComponent(id)}')`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return result as T;
  }

  /** PATCH with composite key */
  async patchObjectComposite<T = Record<string, unknown>>(
    objectType: string,
    keys: Record<string, string | number>,
    data: Record<string, unknown>
  ): Promise<T> {
    const keyParts = Object.entries(keys)
      .map(([k, v]) => typeof v === "number" ? `${k}=${v}` : `${k}='${encodeURIComponent(String(v))}'`)
      .join(",");
    const result = await this.request(`/object/${objectType}(${keyParts})`, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
    return result as T;
  }

  /** DELETE an object (composite key) */
  async deleteObjectComposite(
    objectType: string,
    keys: Record<string, string | number>
  ): Promise<void> {
    const keyParts = Object.entries(keys)
      .map(([k, v]) => typeof v === "number" ? `${k}=${v}` : `${k}='${encodeURIComponent(String(v))}'`)
      .join(",");
    await this.request(`/object/${objectType}(${keyParts})`, { method: "DELETE" });
  }

  /** POST an action */
  async executeAction<T = Record<string, unknown>>(
    actionName: string,
    data: Record<string, unknown> = {},
    extraHeaders: Record<string, string> = {}
  ): Promise<T> {
    const result = await this.request(`/action/${actionName}`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: extraHeaders,
    });
    return result as T;
  }

  /** POST to a nested collection */
  async postNested<T = Record<string, unknown>>(
    path: string,
    data: Record<string, unknown>
  ): Promise<T> {
    const result = await this.request(`/object/${path}`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return result as T;
  }

  /** Execute a batch of operations (max 100 per request) */
  async executeBatch(requests: BatchRequest[]): Promise<unknown> {
    if (requests.length > 100) {
      throw new Error("Batch mag maximaal 100 records bevatten per request.");
    }
    const result = await this.request("/batch", {
      method: "POST",
      body: JSON.stringify({ requests }),
    });
    return result;
  }

  /** Follow a nextPageLink to get the next page of results */
  async getNextPage<T = Record<string, unknown>>(
    nextPageLink: string
  ): Promise<UltimoListResponse<T>> {
    const url = new URL(nextPageLink);
    const path = url.pathname.replace(/^\/api\/v1/, "") + url.search;
    const result = await this.request(path);
    return result as UltimoListResponse<T>;
  }

  /** PUT by ExternalId (for upsert integrations) */
  async putByExternalId<T = Record<string, unknown>>(
    objectType: string,
    externalId: string,
    data: Record<string, unknown>,
    dataProvider?: string
  ): Promise<T> {
    const dpPart = dataProvider
      ? `ExternalId='${encodeURIComponent(externalId)}',DataProvider='${encodeURIComponent(dataProvider)}'`
      : `ExternalId='${encodeURIComponent(externalId)}'`;
    const result = await this.request(`/object/${objectType}(${dpPart})`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return result as T;
  }

  /** Get action headers for a given action name */
  getActionHeaders(actionName: string, customGuid?: string): Record<string, string> {
    const guid = customGuid || this.actionGuids[actionName];
    if (guid) {
      return { "ApplicationElementId": guid };
    }
    return {};
  }
}
