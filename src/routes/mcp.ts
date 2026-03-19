/**
 * MCP endpoint router: /:tenant
 * Handles Streamable HTTP MCP transport per tenant.
 */
import { Router, Request, Response } from "express";
import { randomUUID } from "crypto";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import { TenantStore } from "../tenant-store.js";
import { SessionManager } from "../session-manager.js";
import { createMcpForTenant } from "../mcp-factory.js";

const RESERVED_PATHS = new Set(["health", "tenants", "style.css"]);

export function createMcpRouter(tenantStore: TenantStore, sessionManager: SessionManager): Router {
  const router = Router();

  // Tenant lookup middleware — skip reserved paths
  router.use("/:tenant", (req: Request, res: Response, next) => {
    const slug = Array.isArray(req.params.tenant) ? req.params.tenant[0] : req.params.tenant;
    if (RESERVED_PATHS.has(slug)) { next("route"); return; }
    const tenant = tenantStore.getBySlug(slug);
    if (!tenant || !tenant.is_active) {
      res.status(404).json({ error: `Tenant '${slug}' not found or inactive` });
      return;
    }
    (req as any).tenantConfig = tenant;
    next();
  });

  // POST: Initialize new session or send message to existing session
  router.post("/:tenant", async (req: Request, res: Response) => {
    const tenantConfig = (req as any).tenantConfig;
    const sessionId = req.headers["mcp-session-id"] as string | undefined;

    if (sessionId) {
      // Continue existing session
      const session = sessionManager.get(sessionId);
      if (!session) {
        res.status(404).json({ error: "Session not found or expired" });
        return;
      }
      await session.transport.handleRequest(req, res, req.body);
      return;
    }

    // New session — create server + transport, connect, then handle
    const server = createMcpForTenant(tenantConfig);
    const transport = new StreamableHTTPServerTransport({
      sessionIdGenerator: () => randomUUID(),
      onsessioninitialized: (newSessionId: string) => {
        console.log(`New MCP session ${newSessionId} for tenant ${tenantConfig.slug}`);
        sessionManager.set(newSessionId, {
          server,
          transport,
          tenantSlug: tenantConfig.slug,
          createdAt: Date.now(),
          lastActivity: Date.now(),
        });
      },
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  });

  // GET: SSE stream for existing session
  router.get("/:tenant", async (req: Request, res: Response) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (!sessionId) {
      res.status(400).json({ error: "Missing mcp-session-id header" });
      return;
    }
    const session = sessionManager.get(sessionId);
    if (!session) {
      res.status(404).json({ error: "Session not found or expired" });
      return;
    }
    await session.transport.handleRequest(req, res);
  });

  // DELETE: Close session
  router.delete("/:tenant", async (req: Request, res: Response) => {
    const sessionId = req.headers["mcp-session-id"] as string | undefined;
    if (!sessionId) {
      res.status(400).json({ error: "Missing mcp-session-id header" });
      return;
    }
    const session = sessionManager.get(sessionId);
    if (session) {
      await session.transport.handleRequest(req, res);
      sessionManager.delete(sessionId);
    } else {
      res.status(404).json({ error: "Session not found" });
    }
  });

  return router;
}
