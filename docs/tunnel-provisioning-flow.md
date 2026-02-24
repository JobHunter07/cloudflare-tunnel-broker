# Tunnel Provisioning Flow

CRM → Worker → Cloudflare → Worker → CRM

1. CRM sends:
   POST /register
   { nodeId, displayName }

2. Worker checks KV:
   - If exists → return cached tunnel

3. Worker creates tunnel:
   POST /accounts/{id}/cfd_tunnel

4. Worker creates DNS record:
   POST /zones/{id}/dns_records
   CNAME node-{nodeId}.domain → {tunnelId}.cfargotunnel.com

5. Worker stores result in KV

6. Worker returns:
   - tunnelToken
   - publicUrl

7. CRM starts cloudflared with token

8. Cloudflare routes traffic to CRM