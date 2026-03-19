/**
 * SQLite-based tenant configuration store.
 */
import Database from "better-sqlite3";
import { resolve } from "path";
import { mkdirSync } from "fs";

export interface TenantConfig {
  id: number;
  slug: string;
  name: string;
  base_url: string;
  api_key: string;
  action_guids: Record<string, string>;
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
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS tenants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL,
        base_url TEXT NOT NULL,
        api_key TEXT NOT NULL,
        action_guids TEXT DEFAULT '{}',
        is_active INTEGER DEFAULT 1,
        created_at TEXT DEFAULT (datetime('now')),
        updated_at TEXT DEFAULT (datetime('now'))
      );
    `);
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

  create(input: TenantInput): TenantConfig {
    const stmt = this.db.prepare(`
      INSERT INTO tenants (slug, name, base_url, api_key, action_guids, is_active)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(
      input.slug,
      input.name,
      input.base_url,
      input.api_key,
      JSON.stringify(input.action_guids || {}),
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
