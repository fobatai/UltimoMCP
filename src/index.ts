#!/usr/bin/env node
/**
 * Ultimo MCP Server — Multi-tenant HTTP edition.
 *
 * Each tenant gets a dedicated MCP endpoint at /:tenant/mcp.
 * Admin UI at /admin for tenant CRUD management.
 */

import express from "express";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";
import { TenantStore } from "./tenant-store.js";
import { SessionManager } from "./session-manager.js";
import { createMcpRouter } from "./routes/mcp.js";
import { createAdminRouter } from "./routes/admin.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load .env file manually (no dotenv dependency)
import { readFileSync } from "fs";

function loadEnv() {
  try {
    const envPath = resolve(__dirname, "..", ".env");
    const content = readFileSync(envPath, "utf-8");
    for (const line of content.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith("#")) continue;
      const eqIdx = trimmed.indexOf("=");
      if (eqIdx === -1) continue;
      const key = trimmed.slice(0, eqIdx).trim();
      const value = trimmed.slice(eqIdx + 1).trim();
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  } catch {
    // .env file is optional
  }
}

loadEnv();

const PORT = parseInt(process.env.PORT || "3000", 10);
const DATA_DIR = process.env.DATA_DIR || resolve(__dirname, "..", "data");

const app = express();

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files
app.use(express.static(resolve(__dirname, "..", "public")));

// Initialize stores
const tenantStore = new TenantStore(DATA_DIR);
const sessionManager = new SessionManager();

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "ok", tenants: tenantStore.getAll().length });
});

// Admin UI at /admin (behind basic auth)
app.use("/admin", createAdminRouter(tenantStore));

// Root redirects to admin
app.get("/", (_req, res) => res.redirect("/admin"));

// MCP endpoints — /:tenant (no auth, open for MCP clients)
app.use("/", createMcpRouter(tenantStore, sessionManager));

// Start server
app.listen(PORT, () => {
  console.log(`Ultimo MCP server running on port ${PORT}`);
  console.log(`Admin UI: http://localhost:${PORT}/`);
  console.log(`MCP endpoints: http://localhost:${PORT}/{tenant}`);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("Shutting down...");
  sessionManager.destroy();
  tenantStore.close();
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("Shutting down...");
  sessionManager.destroy();
  tenantStore.close();
  process.exit(0);
});
