import { createTunnelForNode } from "./tunnelBroker";

export interface RegisterRequest {
  nodeId: string;
  displayName: string;
}

export interface RegisterResponse {
  tunnelToken: string;
  publicUrl: string;
  nodeId: string;
  displayName: string;
}

export default {
  async fetch(request: Request, env: any): Promise<Response> {
    try {
      const url = new URL(request.url);

      if (url.pathname === "/register" && request.method === "POST") {
        const body = (await request.json()) as RegisterRequest;

        if (!body.nodeId) {
          return new Response("Missing nodeId", { status: 400 });
        }

        const result = await createTunnelForNode(body.nodeId, body.displayName ?? "", env);

        return new Response(JSON.stringify(result), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      }

      return new Response("Not found", { status: 404 });
    } catch (err: any) {
      console.log("Worker error:", err?.message ?? err);
      return new Response("Error: " + (err?.message ?? "unknown"), { status: 500 });
    }
  }
};