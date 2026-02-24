export async function createTunnel(env: any, tunnelName: string) {
  const url = `${env.CF_API_BASE}/accounts/${env.CF_ACCOUNT_ID}/cfd_tunnel`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CF-Access-Client-Id": env.CF_API_CLIENT_ID,
      "CF-Access-Client-Secret": env.CF_API_CLIENT_SECRET
    },
    body: JSON.stringify({ name: tunnelName })
  });

  const json = await res.json();
  if (!json.success) throw new Error("Failed to create tunnel");

  return json.result;
}

export async function createDnsRecord(env: any, hostname: string, target: string) {
  const url = `${env.CF_API_BASE}/zones/${env.CF_ZONE_ID}/dns_records`;

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "CF-Access-Client-Id": env.CF_API_CLIENT_ID,
      "CF-Access-Client-Secret": env.CF_API_CLIENT_SECRET
    },
    body: JSON.stringify({
      type: "CNAME",
      name: hostname,
      content: target,
      ttl: 1,
      proxied: true
    })
  });

  const json = await res.json();
  if (!json.success) throw new Error("Failed to create DNS record");

  return json.result;
}