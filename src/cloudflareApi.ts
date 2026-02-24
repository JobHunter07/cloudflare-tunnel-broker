async function callCloudflare(
  env: any,
  url: string,
  method: string,
  body?: any
): Promise<any> {
  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${env.CF_API_TOKEN}`
    },
    body: body ? JSON.stringify(body) : undefined
  });

  const json = (await res.json().catch(() => ({}))) as any;

  if (!res.ok || !json.success) {
    console.log("Cloudflare API error:", {
      status: res.status,
      url,
      body,
      response: json
    });
    throw new Error(
      `Cloudflare API error (${res.status}): ` +
        JSON.stringify(json.errors ?? json)
    );
  }

  return json.result;
}

export async function createTunnel(env: any, tunnelName: string): Promise<any> {
  const url = `${env.CF_API_BASE}/accounts/${env.CF_ACCOUNT_ID}/cfd_tunnel`;

  const body = { name: tunnelName };

  return await callCloudflare(env, url, "POST", body);
}

export async function createDnsRecord(
  env: any,
  hostname: string,
  target: string
): Promise<any> {
  const url = `${env.CF_API_BASE}/zones/${env.CF_ZONE_ID}/dns_records`;

  const body = {
    type: "CNAME",
    name: hostname,
    content: target,
    ttl: 1,
    proxied: true
  };

  return await callCloudflare(env, url, "POST", body);
}