# KAGE

KAGE is a Bags creator operations dashboard prototype built for the hackathon brief. It focuses on a believable first wedge:

- fee recovery
- holder retention
- approval-first community operations
- cross-token intelligence as an advisory layer

## Routes

- `/` landing page and pitch
- `/install` creator install flow
- `/dashboard` portfolio overview
- `/judge` live proof screen for judges
- `/apply` submission kit with paste-ready application copy
- `/dashboard/tokens/[slug]`
- `/api/health`
- `/api/tokens`
- `/api/tokens/[slug]`
- `/api/install-preview`

## Current state

- live Bags-backed dashboard routes for token overview and token drilldowns
- real install-preview flow aimed at Bags fee-share admin updates
- configurable creator / ops / retention split preview in the install flow
- creator/admin wallet driven token discovery through the Bags admin list endpoint
- submission-kit route with fundable application copy and live proof hooks
- no local mock portfolio required anymore

## Environment

Create `.env.local` from `.env.example` and set:

- `BAGS_API_KEY`
- `KAGE_OPS_WALLET`
- `KAGE_RETENTION_WALLET`
- `KAGE_TRACKED_TOKEN_MINTS` (optional comma-separated list)
- `KAGE_ADMIN_WALLET` (optional default admin wallet)

## Local development

```bash
npm install
npm run dev
```
