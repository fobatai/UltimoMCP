/**
 * MCP session lifecycle manager.
 * Tracks active sessions and cleans up expired ones.
 */
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";

export interface Session {
  server: McpServer;
  transport: StreamableHTTPServerTransport;
  tenantSlug: string;
  createdAt: number;
  lastActivity: number;
}

const SESSION_TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export class SessionManager {
  private sessions = new Map<string, Session>();
  private cleanupInterval: ReturnType<typeof setInterval>;

  constructor() {
    this.cleanupInterval = setInterval(() => this.cleanup(), 60_000);
  }

  set(sessionId: string, session: Session) {
    this.sessions.set(sessionId, session);
  }

  get(sessionId: string): Session | undefined {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.lastActivity = Date.now();
    }
    return session;
  }

  delete(sessionId: string) {
    const session = this.sessions.get(sessionId);
    if (session) {
      void session.transport.close();
      this.sessions.delete(sessionId);
    }
  }

  private cleanup() {
    const now = Date.now();
    for (const [id, session] of this.sessions) {
      if (now - session.lastActivity > SESSION_TIMEOUT_MS) {
        console.log(`Session ${id} expired (tenant: ${session.tenantSlug})`);
        void session.transport.close();
        this.sessions.delete(id);
      }
    }
  }

  destroy() {
    clearInterval(this.cleanupInterval);
    for (const [id, session] of this.sessions) {
      void session.transport.close();
      this.sessions.delete(id);
    }
  }
}
