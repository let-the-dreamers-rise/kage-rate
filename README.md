<div align="center">

# 影 KAGE

### The Post-Launch Operator for Bags Creators

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38BDF8?logo=tailwindcss)](https://tailwindcss.com/)
[![Bags API](https://img.shields.io/badge/Bags_API-v2-e07a3f)](https://bags.fm/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

**Fee recovery · Holder retention · Community ops · Cross-token intelligence**

[Live Demo](#demo) · [Quick Start](#quick-start) · [Architecture](#architecture) · [API Reference](#api-reference)

</div>

---

## The Problem

Bags creators face a brutal post-launch reality:

- **Unclaimed fees** pile up because nobody monitors claimable positions
- **Holder decay** accelerates after the first 48 hours with no retention strategy
- **Community burnout** — creators manually draft updates, field questions, and manage sentiment alone
- **Zero cross-token insight** — each creator operates in isolation with no shared playbook

> **KAGE turns a fading Bags token into an operating system.** It scans for recoverable value, drafts retention campaigns, and routes every action through an approval-first control tower — so creators stay in control without doing all the work.

---

## Key Features

| Feature | Description | Status |
|---|---|---|
| 🔍 **Fee Recovery Scanner** | Detects claimable positions across Bags fee-share, batches claim transactions, and shows clear creator-side ROI before any approval | ✅ Live |
| 🔒 **Approval-First Autonomy** | Every agent action flows through a human trust gate — no silent custody, no surprise transactions | ✅ Live |
| 📊 **Token Health Dashboard** | Real-time portfolio overview with status classification (Healthy / Watchlist / Recovery) derived from on-chain fee activity | ✅ Live |
| ⚙️ **Install Flow** | One-click fee-share configuration preview with KAGE operator + retention wallet splits, driven by live Bags admin API | ✅ Live |
| 🎯 **Retention Campaigns** | Loyalty streaks, tier-based rewards, and cohort-targeted drops powered by wallet snapshots | 🧪 Advisory |
| 🌐 **Cross-Token Intelligence** | Opt-in signal overlap and cross-promotion recommendations across the KAGE-installed creator network | 🧪 Advisory |
| 📝 **Submission Kit** | Pre-filled hackathon application with live proof links, fundability rationale, and paste-ready copy | ✅ Live |

---

## Demo

Paste any **Bags token mint** into the dashboard URL to see live reads — no wallet connection or capital required:

```
/dashboard?tokenMint=<ANY_BAGS_TOKEN_MINT>
```

### Available Routes

| Route | Purpose |
|---|---|
| `/` | Landing page with agent overview and project pitch |
| `/install` | Creator install flow — configure fee-share splits with live Bags admin preview |
| `/dashboard` | Portfolio overview with real-time token health metrics |
| `/dashboard/tokens/[slug]` | Deep-dive drilldown for individual tokens |
| `/judge` | Live proof screen for hackathon judges |
| `/apply` | Submission kit with paste-ready application copy |

---

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                     KAGE Frontend                   │
│          Next.js 16 · React 19 · Tailwind CSS       │
├──────────┬──────────┬──────────┬────────────────────┤
│ Landing  │Dashboard │ Install  │ Judge / Apply      │
│  page.tsx│ page.tsx │ page.tsx │ page.tsx            │
└────┬─────┴────┬─────┴────┬─────┴──────┬─────────────┘
     │          │          │            │
┌────▼──────────▼──────────▼────────────▼─────────────┐
│                   API Layer                         │
│       /api/health  /api/tokens  /api/install-preview│
└────────────────────┬────────────────────────────────┘
                     │
┌────────────────────▼────────────────────────────────┐
│                  lib/ Core                          │
├─────────────┬────────────┬──────────────────────────┤
│  bags.ts    │kage-live.ts│  runtime-config.ts       │
│  Bags API   │Orchestrator│  Environment loader      │
│  client     │& analytics │                          │
└──────┬──────┴─────┬──────┴──────────────────────────┘
       │            │
┌──────▼────────────▼─────────────────────────────────┐
│              Bags Public API v2                     │
│  https://public-api-v2.bags.fm/api/v1               │
│                                                     │
│  • /token-launch/creator/v3                         │
│  • /token-launch/lifetime-fees                      │
│  • /token-launch/claim-stats                        │
│  • /token-launch/claim-txs/v3                       │
│  • /token-launch/claimable-positions                │
│  • /fee-share/token/claim-events                    │
│  • /fee-share/admin/list                            │
│  • /fee-share/admin/update-config                   │
└─────────────────────────────────────────────────────┘
```

### Agent System

KAGE ships three live agents and two advisory layers, all gated behind creator approval:

| Agent | Mode | Cadence |
|---|---|---|
| **Fee Harvester** | Live — scans & batches claim packets | Every 15 minutes |
| **Community Scribe** | Live — drafts updates for creator review | Daily |
| **Retention Auditor** | Live — monitors holder cohorts and decay | Daily |
| **State of Token** | Advisory — weekly performance digest | Weekly |
| **Network Strategist** | Advisory — cross-token recommendations | On-demand |

---

## Bags API Integration

KAGE is built **API-first** on top of the Bags Public API v2. Every data point in the dashboard comes from a live Bags read — no mocks, no simulated data.

### Endpoints Used

| Endpoint | Method | Purpose |
|---|---|---|
| `/token-launch/creator/v3` | GET | Fetch token creator profiles and royalty config |
| `/token-launch/lifetime-fees` | GET | Total lifetime fee accumulation for a token |
| `/token-launch/claim-stats` | GET | Per-recipient claim totals and admin status |
| `/token-launch/claim-txs/v3` | POST | Generate batched claim transactions |
| `/token-launch/claimable-positions` | GET | Unclaimed fee positions for a wallet |
| `/fee-share/token/claim-events` | GET | Recent claim event history with timestamps |
| `/fee-share/admin/list` | GET | Discover tokens a wallet administrates |
| `/fee-share/admin/update-config` | POST | Preview fee-share configuration updates |

### Data Flow

1. **Token discovery** — wallet-driven via `/fee-share/admin/list`, or direct mint input
2. **Health assessment** — aggregates creators, claim stats, claimable positions, and events
3. **Status classification** — `Healthy` / `Watchlist` / `Recovery` derived from 7-day claim volume and pending claimable lamports
4. **Action generation** — claim packets, install previews, and retention recommendations

---

## Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **npm** ≥ 9
- A **Bags API key** ([get one at bags.fm](https://bags.fm/))

### Setup

```bash
# Clone the repo
git clone https://github.com/let-the-dreamers-rise/kage-rate.git
cd kage-rate

# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
```

Edit `.env.local` with your credentials:

```env
# Required
BAGS_API_KEY=your_bags_api_key_here

# KAGE operator wallets (required for install flow)
KAGE_OPS_WALLET=your_ops_wallet_address
KAGE_RETENTION_WALLET=your_retention_wallet_address

# Optional — auto-populate dashboard with specific tokens
KAGE_TRACKED_TOKEN_MINTS=mint1,mint2,mint3

# Optional — default admin wallet for token discovery
KAGE_ADMIN_WALLET=your_admin_wallet_address
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) and paste any Bags token mint to see live data.

---

## Project Structure

```
kage-operator/
├── app/
│   ├── api/
│   │   ├── health/          # Runtime health check endpoint
│   │   ├── install-preview/  # Live fee-share config preview
│   │   └── tokens/           # Token data API (list + drilldown)
│   ├── apply/               # Hackathon submission kit
│   ├── dashboard/
│   │   ├── tokens/[slug]/   # Individual token deep-dive
│   │   ├── layout.tsx       # Dashboard shell with nav
│   │   └── page.tsx         # Portfolio overview
│   ├── install/             # Creator install flow
│   ├── judge/               # Judge proof screen
│   ├── globals.css          # Global styles + design tokens
│   ├── icon.tsx             # Dynamic favicon
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/
│   ├── badge.tsx            # Status badge component
│   ├── dashboard-nav.tsx    # Dashboard navigation bar
│   ├── metric-card.tsx      # KPI display card
│   ├── section-title.tsx    # Section header component
│   └── token-card.tsx       # Token summary card
├── lib/
│   ├── bags.ts              # Bags API client (typed, error-handled)
│   ├── data.ts              # Static content (agents, hero stats)
│   ├── kage-live.ts         # Live orchestrator (token overview, install preview, health)
│   ├── runtime-config.ts    # Environment variable loader
│   ├── submission.ts        # Hackathon submission content
│   └── types.ts             # Shared TypeScript types
├── .env.example             # Environment template
├── tailwind.config.ts       # Custom design tokens (ink, stone, ember, bronze, steel)
├── next.config.ts           # Next.js configuration
├── tsconfig.json            # TypeScript configuration
└── package.json             # Dependencies and scripts
```

---

## Design System

KAGE uses a custom dark-mode palette inspired by shadow operator aesthetics:

| Token | Hex | Usage |
|---|---|---|
| `ink` | `#111114` | Background / canvas |
| `stone` | `#e9e4d8` | Primary text / headings |
| `ember` | `#e07a3f` | Accent / CTAs / active states |
| `bronze` | `#b8915e` | Secondary accent / warm highlights |
| `steel` | `#8894a8` | Muted text / borders |

Custom utilities include `mesh` background gradients, `panel` box shadows, and `signal` letter-spacing for uppercase labels.

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server on port 3000 |
| `npm run build` | Create optimised production build |
| `npm run start` | Serve production build |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Next.js 16](https://nextjs.org/) (App Router) |
| UI | [React 19](https://react.dev/) |
| Styling | [Tailwind CSS 3.4](https://tailwindcss.com/) |
| Language | [TypeScript 5.9](https://www.typescriptlang.org/) |
| API | [Bags Public API v2](https://bags.fm/) |
| Deployment | Vercel / any Node.js host |

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feat/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feat/amazing-feature`)
5. Open a Pull Request

---

## License

This project is open source under the [MIT License](LICENSE).

---

<div align="center">

**Built for the [Bags Hackathon](https://bags.fm/) 🏆**

*KAGE keeps the token alive after launch — not just for the first 48 hours.*

</div>

