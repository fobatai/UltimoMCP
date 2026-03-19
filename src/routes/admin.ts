/**
 * Admin UI routes for tenant management.
 * Protected by Basic Auth.
 */
import { Router, Request, Response } from "express";
import { TenantStore, TenantInput } from "../tenant-store.js";
import { renderLayout, renderTenantList, renderTenantForm } from "../views/templates.js";

export function createAdminRouter(tenantStore: TenantStore): Router {
  const router = Router();

  // Basic Auth middleware
  router.use((req: Request, res: Response, next) => {
    const adminUser = process.env.ADMIN_USER || "admin";
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      res.status(500).send("ADMIN_PASSWORD environment variable is not set");
      return;
    }

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Basic ")) {
      res.setHeader("WWW-Authenticate", 'Basic realm="Ultimo MCP Admin"');
      res.status(401).send("Authentication required");
      return;
    }

    const credentials = Buffer.from(authHeader.slice(6), "base64").toString();
    const [user, pass] = credentials.split(":");

    if (user !== adminUser || pass !== adminPassword) {
      res.setHeader("WWW-Authenticate", 'Basic realm="Ultimo MCP Admin"');
      res.status(401).send("Invalid credentials");
      return;
    }

    next();
  });

  // GET /admin — tenant list
  router.get("/", (req: Request, res: Response) => {
    const tenants = tenantStore.getAll();
    const message = req.query.message as string | undefined;
    res.send(renderLayout("Tenants", renderTenantList(tenants, message)));
  });

  // GET /tenants/new — new tenant form
  router.get("/tenants/new", (_req: Request, res: Response) => {
    res.send(renderLayout("Nieuwe Tenant", renderTenantForm()));
  });

  // POST /tenants — create tenant
  router.post("/tenants", (req: Request, res: Response) => {
    try {
      const input: TenantInput = {
        slug: req.body.slug?.trim(),
        name: req.body.name?.trim(),
        base_url: req.body.base_url?.trim().replace(/\/$/, ""),
        api_key: req.body.api_key?.trim(),
        action_guids: parseGuids(req.body.action_guids),
        is_active: req.body.is_active === "on",
      };

      if (!input.slug || !input.name || !input.base_url || !input.api_key) {
        res.send(renderLayout("Nieuwe Tenant", renderTenantForm(undefined, "Alle verplichte velden moeten ingevuld zijn.")));
        return;
      }

      if (!/^[a-z0-9-]+$/.test(input.slug)) {
        res.send(renderLayout("Nieuwe Tenant", renderTenantForm(undefined, "Slug mag alleen kleine letters, cijfers en streepjes bevatten.")));
        return;
      }

      tenantStore.create(input);
      res.redirect("/admin?message=Tenant aangemaakt");
    } catch (e: any) {
      const msg = e.message.includes("UNIQUE") ? "Slug is al in gebruik." : e.message;
      res.send(renderLayout("Nieuwe Tenant", renderTenantForm(undefined, msg)));
    }
  });

  // GET /tenants/:id/edit — edit tenant form
  router.get("/tenants/:id/edit", (req: Request, res: Response) => {
    const tenant = tenantStore.getById(Number(req.params.id));
    if (!tenant) {
      res.redirect("/admin?message=Tenant niet gevonden");
      return;
    }
    res.send(renderLayout(`Bewerk: ${tenant.name}`, renderTenantForm(tenant)));
  });

  // POST /tenants/:id — update tenant
  router.post("/tenants/:id", (req: Request, res: Response) => {
    const id = Number(req.params.id);
    try {
      const input: Partial<TenantInput> = {
        slug: req.body.slug?.trim(),
        name: req.body.name?.trim(),
        base_url: req.body.base_url?.trim().replace(/\/$/, ""),
        api_key: req.body.api_key?.trim(),
        action_guids: parseGuids(req.body.action_guids),
        is_active: req.body.is_active === "on",
      };

      const updated = tenantStore.update(id, input);
      if (!updated) {
        res.redirect("/admin?message=Tenant niet gevonden");
        return;
      }
      res.redirect("/admin?message=Tenant bijgewerkt");
    } catch (e: any) {
      const tenant = tenantStore.getById(id);
      const msg = e.message.includes("UNIQUE") ? "Slug is al in gebruik." : e.message;
      res.send(renderLayout("Bewerk Tenant", renderTenantForm(tenant || undefined, msg)));
    }
  });

  // POST /tenants/:id/delete — delete tenant
  router.post("/tenants/:id/delete", (req: Request, res: Response) => {
    tenantStore.delete(Number(req.params.id));
    res.redirect("/admin?message=Tenant verwijderd");
  });

  // GET /tenants/:id/test — test API connection
  router.get("/tenants/:id/test", async (req: Request, res: Response) => {
    const tenant = tenantStore.getById(Number(req.params.id));
    if (!tenant) {
      res.json({ success: false, error: "Tenant niet gevonden" });
      return;
    }

    try {
      const url = `${tenant.base_url}/api/v1/object/Department?top=1`;
      const response = await fetch(url, {
        headers: {
          "ApiKey": tenant.api_key,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        res.json({ success: true, message: `Verbinding OK (HTTP ${response.status})` });
      } else {
        const body = await response.text();
        res.json({ success: false, error: `HTTP ${response.status}: ${body.slice(0, 200)}` });
      }
    } catch (e: any) {
      res.json({ success: false, error: e.message });
    }
  });

  return router;
}

function parseGuids(raw: string | undefined): Record<string, string> {
  if (!raw || !raw.trim()) return {};
  try {
    return JSON.parse(raw);
  } catch {
    return {};
  }
}
