import { createTunnel, createDnsRecord } from "./cloudflareApi";

export async function createTunnelForNode(
  nodeId: string,
  displayName: string,
  env: any
) {
  const kvKey = `tunnel:${nodeId}`;
  const existing = await env.TUNNELS_KV.get(kvKey, "json");

  if (existing) {
    return existing;
  }

  const tunnelName = `node-${nodeId}`;
  const hostname = `${tunnelName}.${env.DOMAIN}`;

  const tunnel = await createTunnel(env, tunnelName);
  const tunnelId = tunnel.id;
  const tunnelToken = tunnel.tunnel_token;

  await createDnsRecord(env, hostname, `${tunnelId}.cfargotunnel.com`);

  const publicUrl = `https://${hostname}`;

  const result = {
    tunnelToken,
    publicUrl,
    nodeId,
    displayName
  };

  await env.TUNNELS_KV.put(kvKey, JSON.stringify(result));

  return result;
}