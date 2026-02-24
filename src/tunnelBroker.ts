import { createTunnel, createDnsRecord } from "./cloudflareApi";

interface TunnelRecord {
  tunnelToken: string;
  publicUrl: string;
  nodeId: string;
  displayName: string;
}

export async function createTunnelForNode(
  nodeId: string,
  displayName: string,
  env: any
): Promise<TunnelRecord> {
  const kvKey = `tunnel:${nodeId}`;
  const existing = await env.TUNNELS_KV.get(kvKey, "json");

  if (existing) {
    return existing as TunnelRecord;
  }

  const tunnelName = `node-${nodeId}`;
  const hostname = `${tunnelName}.${env.DOMAIN}`;

  const tunnel = await createTunnel(env, tunnelName);
  const tunnelId = tunnel.id;
  const tunnelToken = tunnel.tunnel_token;

  await createDnsRecord(env, hostname, `${tunnelId}.cfargotunnel.com`);

  const publicUrl = `https://${hostname}`;

  const result: TunnelRecord = {
    tunnelToken,
    publicUrl,
    nodeId,
    displayName
  };

  await env.TUNNELS_KV.put(kvKey, JSON.stringify(result));

  return result;
}