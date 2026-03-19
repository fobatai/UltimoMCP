/**
 * Server-side HTML templates for the admin UI.
 */
import { TenantConfig } from "../tenant-store.js";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function renderLayout(title: string, body: string): string {
  return `<!DOCTYPE html>
<html lang="nl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(title)} — Ultimo MCP Admin</title>
  <link rel="stylesheet" href="/style.css">
</head>
<body>
  <nav>
    <a href="/admin" class="logo">Ultimo MCP</a>
    <span class="nav-sep">|</span>
    <a href="/admin">Tenants</a>
    <a href="/admin/tenants/new">+ Nieuwe Tenant</a>
  </nav>
  <main>
    <h1>${escapeHtml(title)}</h1>
    ${body}
  </main>
</body>
</html>`;
}

export function renderTenantList(tenants: TenantConfig[], message?: string): string {
  const msg = message ? `<div class="message">${escapeHtml(message)}</div>` : "";

  if (tenants.length === 0) {
    return `${msg}<p>Geen tenants geconfigureerd. <a href="/admin/tenants/new">Voeg er een toe</a>.</p>`;
  }

  const rows = tenants.map(t => `
    <tr>
      <td><span class="status-dot ${t.is_active ? "active" : "inactive"}"></span></td>
      <td><strong>${escapeHtml(t.name)}</strong></td>
      <td><code>${escapeHtml(t.slug)}</code></td>
      <td><code>${escapeHtml(t.base_url)}</code></td>
      <td><code>/${escapeHtml(t.slug)}</code></td>
      <td>
        <a href="/admin/tenants/${t.id}/edit" class="btn btn-sm">Bewerk</a>
        <button class="btn btn-sm btn-test" onclick="testConnection(${t.id}, this)">Test</button>
      </td>
    </tr>
  `).join("");

  return `${msg}
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Naam</th>
          <th>Slug</th>
          <th>Base URL</th>
          <th>MCP Endpoint</th>
          <th>Acties</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
    <script>
      async function testConnection(id, btn) {
        btn.textContent = '...';
        try {
          const res = await fetch('/admin/tenants/' + id + '/test');
          const data = await res.json();
          btn.textContent = data.success ? 'OK' : 'Fout';
          btn.title = data.success ? data.message : data.error;
          btn.classList.toggle('btn-ok', data.success);
          btn.classList.toggle('btn-error', !data.success);
        } catch(e) {
          btn.textContent = 'Fout';
          btn.title = e.message;
          btn.classList.add('btn-error');
        }
      }
    </script>`;
}

export function renderTenantForm(tenant?: TenantConfig, errorMessage?: string): string {
  const isEdit = !!tenant;
  const action = isEdit ? `/tenants/${tenant!.id}` : "/tenants";
  const err = errorMessage ? `<div class="error">${escapeHtml(errorMessage)}</div>` : "";
  const guidsJson = tenant ? JSON.stringify(tenant.action_guids, null, 2) : "{}";

  return `${err}
    <form method="POST" action="${action}">
      <div class="field">
        <label for="slug">Slug <small>(URL-pad, alleen a-z, 0-9, -)</small></label>
        <input type="text" id="slug" name="slug" required pattern="[a-z0-9-]+"
          value="${escapeHtml(tenant?.slug || "")}" placeholder="bijv. acme">
      </div>

      <div class="field">
        <label for="name">Naam</label>
        <input type="text" id="name" name="name" required
          value="${escapeHtml(tenant?.name || "")}" placeholder="bijv. ACME B.V.">
      </div>

      <div class="field">
        <label for="base_url">Ultimo Base URL</label>
        <input type="url" id="base_url" name="base_url" required
          value="${escapeHtml(tenant?.base_url || "")}" placeholder="https://xxxxxx.ultimo.net">
      </div>

      <div class="field">
        <label for="api_key">API Key</label>
        <input type="text" id="api_key" name="api_key" required
          value="${escapeHtml(tenant?.api_key || "")}" placeholder="API key uit Ultimo">
      </div>

      <div class="field">
        <label for="action_guids">Action GUIDs <small>(JSON, optioneel)</small></label>
        <textarea id="action_guids" name="action_guids" rows="5"
          placeholder='{"REST_ReportJob": "GUID..."}'>${escapeHtml(guidsJson)}</textarea>
      </div>

      <div class="field checkbox">
        <label>
          <input type="checkbox" name="is_active" ${(tenant?.is_active ?? true) ? "checked" : ""}>
          Actief
        </label>
      </div>

      <div class="actions">
        <button type="submit" class="btn btn-primary">${isEdit ? "Opslaan" : "Aanmaken"}</button>
        <a href="/admin" class="btn">Annuleren</a>
        ${isEdit ? `
          <form method="POST" action="/admin/tenants/${tenant!.id}/delete" style="display:inline"
            onsubmit="return confirm('Weet je het zeker?')">
            <button type="submit" class="btn btn-danger">Verwijderen</button>
          </form>
        ` : ""}
      </div>
    </form>`;
}
