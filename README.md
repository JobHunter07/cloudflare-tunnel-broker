# Tunnel Broker (Cloudflare Worker)

This Worker automatically provisions Cloudflare Tunnels for decentralized CRM nodes.

Each CRM instance calls `/register` with its NodeId.  
The Worker:

1. Creates a Cloudflare Tunnel
2. Creates a DNS record (node-{nodeId}.yourdomain.com)
3. Returns a tunnelToken + publicUrl
4. CRM starts cloudflared locally using the token

---

## Cloudflare Setup Instructions

### 1. Create a Cloudflare Account
Go to https://dash.cloudflare.com and create an account.

### 2. Add a Domain
Add a domain (example: `myhivecrm.com`).

### 3. Enable Cloudflare Zero Trust
Go to Zero Trust → Access → Service Tokens.

### 4. Create a Service Token
Create a new Service Token with:
- Name: `TunnelBroker`
- Permissions:
  - Cloudflare Tunnels: Edit
  - DNS: Edit

Copy:
- Client ID
- Client Secret

### 5. Create a KV Namespace
Workers → KV → Create Namespace  
Name: `TUNNELS_KV`

Copy the KV ID.

### 6. Create a Worker
Workers → Create Worker  
Replace code with the files in this repo.

### 7. Configure wrangler.toml
Set:
- CF_ACCOUNT_ID
- CF_ZONE_ID
- DOMAIN
- KV namespace ID

### 8. Add Secrets
Run:
wrangler secret put CF_API_CLIENT_ID wrangler secret put CF_API_CLIENT_SECRET


Paste the values from your Service Token.

### 9. Deploy

wrangler deploy


Your Worker is now live.

---

## CRM Integration

On first run:

1. CRM generates NodeId
2. CRM POSTs to `/register`
3. Worker returns:
   - tunnelToken
   - publicUrl
4. CRM starts cloudflared:

cloudflared tunnel run --token <tunnelToken>
5. CRM is now reachable at:
`https://node-{nodeId}.yourdomain.com`

