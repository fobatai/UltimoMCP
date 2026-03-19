/**
 * SQLite-based tenant configuration store.
 */
import Database from "better-sqlite3";
import { randomBytes, randomUUID } from "crypto";
import { resolve } from "path";
import { mkdirSync } from "fs";

export interface TenantConfig {
  id: number;
  slug: string;
  name: string;
  base_url: string;
  api_key: string;
  action_guids: Record<string, string>;
  client_id: string;
  client_secret: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TenantInput {
  slug: string;
  name: string;
  base_url: string;
  api_key: string;
  action_guids?: Record<string, string>;
  is_active?: boolean;
}

interface TenantRow {
  id: number;
  slug: string;
  name: string;
  base_url: string;
  api_key: string;
  action_guids: string;
  client_id: string;
  client_secret: string;
  is_active: number;
  created_at: string;
  updated_at: string;
}

function rowToConfig(row: TenantRow): TenantConfig {
  return {
    ...row,
    action_guids: JSON.parse(row.action_guids || "{}"),
    is_active: row.is_active === 1,
  };
}

function generateClientId(): string {
  return `ultimo_${randomUUID().replace(/-/g, "")}`;
}

function generateClientSecret(): string {
  return randomBytes(32).toString("hex");
}

export class TenantStore {
  private db: Database.Database;

  constructor(dataDir: string) {
    mkdirSync(dataDir, { recursive: true });
    const dbPath = resolve(dataDir, "tenants.db");
    this.db = new Database(dbPath);
    this.db.pragma("journal_mode = WAL");
    this.migrate();
  }

  private migrate() {
    // Check if table exists
    const tableExists = this.db.prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='tenants'"
    ).get();

    if (!tableExists) {
      this.db.exec(`
        CREATE TABLE tenants (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          slug TEXT UNIQUE NOT NULL,
          name TEXT NOT NULL,
          base_url TEXT NOT NULL,
          api_key TEXT NOT NULL,
          action_guids TEXT DEFAULT '{}',
          client_id TEXT UNIQUE NOT NULL,
          client_secret TEXT NOT NULL,
          is_active INTEGER DEFAULT 1,
          created_at TEXT DEFAULT (datetime('now')),
          updated_at TEXT DEFAULT (datetime('now'))
        );
      `);
      return;
    }

    // Upgrade existing table: add columns if missing
    const cols = this.db.prepare("PRAGMA table_info(tenants)").all() as { name: string }[];
    const colNames = new Set(cols.map(c => c.name));

    if (!colNames.has("client_id")) {
      this.db.exec("ALTER TABLE tenants ADD COLUMN client_id TEXT");
    }
    if (!colNames.has("client_secret")) {
      this.db.exec("ALTER TABLE tenants ADD COLUMN client_secret TEXT");
    }
    // Backfill any rows missing credentials
    const missing = this.db.prepare("SELECT id FROM tenants WHERE client_id IS NULL OR client_secret IS NULL").all() as { id: number }[];
    for (const row of missing) {
      this.db.prepare("UPDATE tenants SET client_id = ?, client_secret = ? WHERE id = ?")
        .run(generateClientId(), generateClientSecret(), row.id);
    }
    this.db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_tenants_client_id ON tenants(client_id)");
  }

  getAll(): TenantConfig[] {
    const rows = this.db.prepare("SELECT * FROM tenants ORDER BY name").all() as TenantRow[];
    return rows.map(rowToConfig);
  }

  getBySlug(slug: string): TenantConfig | undefined {
    const row = this.db.prepare("SELECT * FROM tenants WHERE slug = ?").get(slug) as TenantRow | undefined;
    return row ? rowToConfig(row) : undefined;
  }

  getById(id: number): TenantConfig | undefined {
    const row = this.db.prepare("SELECT * FROM tenants WHERE id = ?").get(id) as TenantRow | undefined;
    return row ? rowToConfig(row) : undefined;
  }

  getByClientId(clientId: string): TenantConfig | undefined {
    const row = this.db.prepare("SELECT * FROM tenants WHERE client_id = ?").get(clientId) as TenantRow | undefined;
    return row ? rowToConfig(row) : undefined;
  }

  create(input: TenantInput): TenantConfig {
    const stmt = this.db.prepare(`
      INSERT INTO tenants (slug, name, base_url, api_key, action_guids, client_id, client_secret, is_active)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      input.slug,
      input.name,
      input.base_url,
      input.api_key,
      JSON.stringify(input.action_guids || {}),
      generateClientId(),
      generateClientSecret(),
      input.is_active !== false ? 1 : 0
    );
    return this.getById(result.lastInsertRowid as number)!;
  }

  update(id: number, input: Partial<TenantInput>): TenantConfig | undefined {
    const existing = this.getById(id);
    if (!existing) return undefined;

    const stmt = this.db.prepare(`
      UPDATE tenants SET
        slug = ?, name = ?, base_url = ?, api_key = ?,
        action_guids = ?, is_active = ?, updated_at = datetime('now')
      WHERE id = ?
    `);
    stmt.run(
      input.slug ?? existing.slug,
      input.name ?? existing.name,
      input.base_url ?? existing.base_url,
      input.api_key ?? existing.api_key,
      JSON.stringify(input.action_guids ?? existing.action_guids),
      (input.is_active ?? existing.is_active) ? 1 : 0,
      id
    );
    return this.getById(id);
  }

  /** Regenerate client credentials for a tenant */
  regenerateCredentials(id: number): TenantConfig | undefined {
    const existing = this.getById(id);
    if (!existing) return undefined;
    this.db.prepare("UPDATE tenants SET client_id = ?, client_secret = ?, updated_at = datetime('now') WHERE id = ?")
      .run(generateClientId(), generateClientSecret(), id);
    return this.getById(id);
  }

  delete(id: number): boolean {
    const result = this.db.prepare("DELETE FROM tenants WHERE id = ?").run(id);
    return result.changes > 0;
  }

  getDb(): Database.Database {
    return this.db;
  }

  close() {
    this.db.close();
  }
}
