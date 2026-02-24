# CRM Startup Flow (Local Aspire App)

1. CRM starts
2. Check NodeIdentity table
   - If missing → generate NodeId
3. Check TunnelConfig table
   - If missing → call Worker /register
4. Worker returns:
   - tunnelToken
   - publicUrl
5. CRM stores tunnelToken + publicUrl
6. CRM starts cloudflared:
   cloudflared tunnel run --token <tunnelToken>
7. CRM is now reachable at:
   https://node-{nodeId}.yourdomain.com
8. Sync peers use this URL for:
   - /sync/handshake
   - /sync/changes/pull
   - /sync/changes/push