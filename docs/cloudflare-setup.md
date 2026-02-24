# Cloudflare UI Setup Guide

## Step 1 — Add Domain
Dashboard → Websites → Add a Site  
Choose a domain or buy one.

## Step 2 — Enable Zero Trust
Zero Trust → Access → Service Tokens  
Create a token:
- Name: TunnelBroker
- Permissions:
  - Cloudflare Tunnel: Edit
  - DNS: Edit

Copy:
- Client ID
- Client Secret

## Step 3 — Create KV Namespace
Workers → KV → Create Namespace  
Name: TUNNELS_KV  
Copy the ID.

## Step 4 — Create Worker
Workers → Create Worker  
Paste the code from:
- worker.ts
- tunnelBroker.ts
- cloudflareApi.ts

## Step 5 — Bind KV
Workers → Settings → KV Bindings  
Add:
- Binding name: TUNNELS_KV
- Namespace: your KV namespace

## Step 6 — Add Environment Variables
Workers → Settings → Variables  
Add:
- CF_ACCOUNT_ID
- CF_ZONE_ID
- DOMAIN

## Step 7 — Add Secrets
Workers → Settings → Secrets  
Add:
- CF_API_CLIENT_ID
- CF_API_CLIENT_SECRET

## Step 8 — Deploy
Click “Deploy”.

Your Worker is now ready.