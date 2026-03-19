/**
 * SQLite-backed OAuth 2.1 provider for MCP authentication.
 * Clients are pre-registered per tenant — no dynamic registration.
 * Each tenant has a unique client_id + client_secret.
 */
import { randomUUID, randomBytes } from "crypto";
import type { Response } from "express";
import type { OAuthServerProvider } from "@modelcontextprotocol/sdk/server/auth/provider.js";
import type { OAuthRegisteredClientsStore } from "@modelcontextprotocol/sdk/server/auth/clients.js";
import type { AuthInfo } from "@modelcontextprotocol/sdk/server/auth/types.js";
import type { OAuthClientInformationFull, OAuthTokens } from "@modelcontextprotocol/sdk/shared/auth.js";
import type Database from "better-sqlite3";
import type { TenantStore } from "./tenant-store.js";

type AuthorizationParams = {
  state?: string;
  scopes?: string[];
  codeChallenge: string;
  redirectUri: string;
  resource?: URL;
};

// ── Client Store — reads from tenants table ───────────────────

export class TenantClientsStore implements OAuthRegisteredClientsStore {
  constructor(private tenantStore: TenantStore) {}

  async getClient(clientId: string): Promise<OAuthClientInformationFull | undefined> {
    const tenant = this.tenantStore.getByClientId(clientId);
    if (!tenant) return undefined;

    return {
      client_id: tenant.client_id,
      client_secret: tenant.client_secret,
      redirect_uris: [],  // Claude handles redirect URIs dynamically
      grant_types: ["authorization_code"],
      response_types: ["code"],
      token_endpoint_auth_method: "client_secret_post",
      client_name: tenant.name,
      client_id_issued_at: Math.floor(new Date(tenant.created_at).getTime() / 1000),
    } as OAuthClientInformationFull;
  }

  // No dynamic registration — clients are created via admin panel
  // registerClient is intentionally not implemented
}

// ── Auth Provider ─────────────────────────────────────────────

export class UltimoAuthProvider implements OAuthServerProvider {
  public readonly clientsStore: TenantClientsStore;
  private db: Database.Database;
  private tenantStore: TenantStore;

  constructor(db: Database.Database, tenantStore: TenantStore) {
    this.db = db;
    this.tenantStore = tenantStore;
    this.clientsStore = new TenantClientsStore(tenantStore);

    this.db.exec(`
      CREATE TABLE IF NOT EXISTS oauth_codes (
        code TEXT PRIMARY KEY,
        client_id TEXT NOT NULL,
        code_challenge TEXT NOT NULL,
        redirect_uri TEXT NOT NULL,
        scopes TEXT DEFAULT '',
        resource TEXT,
        created_at INTEGER NOT NULL
      );

      CREATE TABLE IF NOT EXISTS oauth_tokens (
        token TEXT PRIMARY KEY,
        client_id TEXT NOT NULL,
        scopes TEXT DEFAULT '',
        resource TEXT,
        expires_at INTEGER NOT NULL
      );
    `);
  }

  async authorize(
    client: OAuthClientInformationFull,
    params: AuthorizationParams,
    res: Response
  ): Promise<void> {
    // Auto-approve: the client already authenticated with client_id/secret
    const code = randomUUID();

    this.db.prepare(`
      INSERT INTO oauth_codes (code, client_id, code_challenge, redirect_uri, scopes, resource, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      code,
      client.client_id,
      params.codeChallenge,
      params.redirectUri,
      (params.scopes || []).join(" "),
      params.resource?.toString() || null,
      Date.now()
    );

    const targetUrl = new URL(params.redirectUri);
    targetUrl.searchParams.set("code", code);
    if (params.state) targetUrl.searchParams.set("state", params.state);
    res.redirect(targetUrl.toString());
  }

  async challengeForAuthorizationCode(
    _client: OAuthClientInformationFull,
    authorizationCode: string
  ): Promise<string> {
    const row = this.db.prepare("SELECT code_challenge FROM oauth_codes WHERE code = ?")
      .get(authorizationCode) as { code_challenge: string } | undefined;
    if (!row) throw new Error("Invalid authorization code");
    return row.code_challenge;
  }

  async exchangeAuthorizationCode(
    client: OAuthClientInformationFull,
    authorizationCode: string,
    _codeVerifier?: string,
    _redirectUri?: string,
    _resource?: URL
  ): Promise<OAuthTokens> {
    const row = this.db.prepare("SELECT * FROM oauth_codes WHERE code = ?")
      .get(authorizationCode) as any;
    if (!row) throw new Error("Invalid authorization code");
    if (row.client_id !== client.client_id) throw new Error("Code not issued to this client");

    this.db.prepare("DELETE FROM oauth_codes WHERE code = ?").run(authorizationCode);

    const token = randomBytes(32).toString("hex");
    const expiresAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    this.db.prepare(`
      INSERT INTO oauth_tokens (token, client_id, scopes, resource, expires_at)
      VALUES (?, ?, ?, ?, ?)
    `).run(token, client.client_id, row.scopes, row.resource, expiresAt);

    return {
      access_token: token,
      token_type: "bearer",
      expires_in: 86400,
      scope: row.scopes,
    };
  }

  async exchangeRefreshToken(
    _client: OAuthClientInformationFull,
    _refreshToken: string,
    _scopes?: string[],
    _resource?: URL
  ): Promise<OAuthTokens> {
    throw new Error("Refresh tokens not supported");
  }

  async verifyAccessToken(token: string): Promise<AuthInfo> {
    const row = this.db.prepare("SELECT * FROM oauth_tokens WHERE token = ?")
      .get(token) as any;
    if (!row || row.expires_at < Date.now()) {
      throw new Error("Invalid or expired token");
    }
    return {
      token,
      clientId: row.client_id,
      scopes: row.scopes ? row.scopes.split(" ") : [],
      expiresAt: Math.floor(row.expires_at / 1000),
    };
  }

  /** Check if a client_id is allowed to access a specific tenant */
  isClientAllowedForTenant(clientId: string, tenantSlug: string): boolean {
    const tenant = this.tenantStore.getBySlug(tenantSlug);
    return tenant !== undefined && tenant.client_id === clientId;
  }
}
