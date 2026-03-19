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
  <script>
    function copyText(text, btn) {
      navigator.clipboard.writeText(text).then(() => {
        const orig = btn.textContent;
        btn.textContent = 'Gekopieerd!';
        btn.classList.add('btn-ok');
        setTimeout(() => { btn.textContent = orig; btn.classList.remove('btn-ok'); }, 1500);
      });
    }
  </script>
</body>
</html>`;
}

export function renderTenantList(tenants: TenantConfig[], baseDomain: string, message?: string): string {
  const msg = message ? `<div class="message">${escapeHtml(message)}</div>` : "";

  if (tenants.length === 0) {
    return `${msg}<p>Geen tenants geconfigureerd. <a href="/admin/tenants/new">Voeg er een toe</a>.</p>`;
  }

  const rows = tenants.map(t => {
    const mcpUrl = `${baseDomain}/${t.slug}`;
    return `
    <tr>
      <td><span class="status-dot ${t.is_active ? "active" : "inactive"}"></span></td>
      <td><strong>${escapeHtml(t.name)}</strong></td>
      <td><code>${escapeHtml(t.slug)}</code></td>
      <td>
        <a href="/admin/tenants/${t.id}/edit" class="btn btn-sm">Bewerk</a>
        <button class="btn btn-sm btn-test" onclick="testConnection(${t.id}, this)">Test</button>
      </td>
    </tr>
    <tr class="details-row">
      <td></td>
      <td colspan="3">
        <div class="credential-grid">
          <span class="cred-label">MCP URL</span>
          <code class="cred-value">${escapeHtml(mcpUrl)}</code>
          <button class="btn btn-sm btn-copy" onclick="copyText('${escapeHtml(mcpUrl)}', this)">Kopieer</button>

          <span class="cred-label">Client ID</span>
          <code class="cred-value">${escapeHtml(t.client_id)}</code>
          <button class="btn btn-sm btn-copy" onclick="copyText('${escapeHtml(t.client_id)}', this)">Kopieer</button>

          <span class="cred-label">Client Secret</span>
          <code class="cred-value secret">${escapeHtml(t.client_secret)}</code>
          <button class="btn btn-sm btn-copy" onclick="copyText('${escapeHtml(t.client_secret)}', this)">Kopieer</button>
        </div>
      </td>
    </tr>`;
  }).join("");

  return `${msg}
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Naam</th>
          <th>Slug</th>
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
  const action = isEdit ? `/admin/tenants/${tenant!.id}` : "/admin/tenants";
  const err = errorMessage ? `<div class="error">${escapeHtml(errorMessage)}</div>` : "";
  const guidsJson = tenant ? JSON.stringify(tenant.action_guids, null, 2) : "{}";

  const credentialsBlock = isEdit ? `
    <div class="credentials-box">
      <h3>OAuth Credentials</h3>
      <div class="credential-grid">
        <span class="cred-label">Client ID</span>
        <code class="cred-value">${escapeHtml(tenant!.client_id)}</code>
        <button type="button" class="btn btn-sm btn-copy" onclick="copyText('${escapeHtml(tenant!.client_id)}', this)">Kopieer</button>

        <span class="cred-label">Client Secret</span>
        <code class="cred-value secret">${escapeHtml(tenant!.client_secret)}</code>
        <button type="button" class="btn btn-sm btn-copy" onclick="copyText('${escapeHtml(tenant!.client_secret)}', this)">Kopieer</button>
      </div>
      <form method="POST" action="/admin/tenants/${tenant!.id}/regenerate" style="margin-top:8px"
        onsubmit="return confirm('Weet je het zeker? De oude credentials werken dan niet meer.')">
        <button type="submit" class="btn btn-sm btn-danger">Credentials opnieuw genereren</button>
      </form>
    </div>
  ` : "";

  return `${err}
    ${credentialsBlock}
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
