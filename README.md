# Cloudflare Tunnel Broker (jobhunter07.com)

This Worker provisions Cloudflare Tunnels for decentralized CRM nodes.

Each node calls `POST /register` with a `nodeId`.  
The Worker:

1. Creates a Cloudflare Tunnel
2. Creates a DNS CNAME: `node-{nodeId}.jobhunter07.com`
3. Stores the mapping in KV
4. Returns `{ tunnelToken, publicUrl, nodeId, displayName }`

Your CRM then starts `cloudflared` locally with the `tunnelToken`.

---

## Cloudflare Setup (UI)

1. Add domain `jobhunter07.com` to Cloudflare.

2. Get:
   - **Account ID**: Dashboard → Overview → right side.
   - **Zone ID**: Dashboard → jobhunter07.com → Overview → right side.

3. Create KV namespace:
   - Workers & Pages → KV → Create namespace
   - Name: `TUNNELS_KV`
   - Copy the ID and put it into `wrangler.toml`.

4. Create a Service Token:
   - Zero Trust → Access → Service Tokens
   - Name: `TunnelBroker`
   - Permissions:
     - Cloudflare Tunnel: Edit
     - DNS: Edit
   - Copy:
     - Client ID
     - Client Secret

5. Protect the Worker with Access:
   - Zero Trust → Access → Applications → Add an application
   - Type: Self-hosted
   - Domain: `cloudflare-tunnel-broker.kbdavis0007.workers.dev` (or your Worker route)
   - Policy: Service Token → select `TunnelBroker`

6. Configure Worker variables:
   - Workers & Pages → your Worker → Settings → Variables
   - Add:
     - `CF_ACCOUNT_ID`
     - `CF_ZONE_ID`
     - `CF_API_BASE` = `https://api.cloudflare.com/client/v4`
     - `DOMAIN` = `jobhunter07.com`
   - KV binding:
     - `TUNNELS_KV` → your KV namespace
   - Secrets:
     - `CF_API_CLIENT_ID`
     - `CF_API_CLIENT_SECRET`

7. Deploy via dashboard or `wrangler deploy`.

---

## Testing with Postman

POST:

- URL: `https://cloudflare-tunnel-broker.kbdavis0007.workers.dev/register`
- Headers:
  - `Content-Type: application/json`
  - `CF-Access-Client-Id: <service_token_client_id>`
  - `CF-Access-Client-Secret: <service_token_client_secret>`
- Body:
  ```json
  {
    "nodeId": "test-node-001",
    "displayName": "Brian Test Node"
  }

Expected response:

{
  "tunnelToken": "...",
  "publicUrl": "https://node-test-node-001.jobhunter07.com",
  "nodeId": "test-node-001",
  "displayName": "Brian Test Node"
}