import type { Agent, Metric } from "@/lib/types";

export const heroStats: Metric[] = [
  {
    label: "Bags-native",
    value: "Live reads",
    delta: "official endpoints",
    note: "The app now targets real Bags analytics, claim, and fee-share flows instead of a fake local portfolio."
  },
  {
    label: "Approval-first",
    value: "Creator gated",
    delta: "trust-preserving",
    note: "Risky actions stay visible to the creator even when the operator stack is running continuously."
  },
  {
    label: "Install-ready",
    value: "Admin update",
    delta: "Bags preview",
    note: "The install flow is aimed at real fee-share admin updates for live tokens, not a mocked wizard."
  }
];

export const agents: Agent[] = [
  {
    name: "Revenue Agent",
    status: "Live",
    cadence: "Every 15 min",
    summary: "Scans claimable Bags fees, prepares claim actions, and tracks realized recovery against baseline."
  },
  {
    name: "Community Agent",
    status: "Needs approval",
    cadence: "Daily + weekly",
    summary: "Drafts price updates, state-of-token reports, and channel-ready posts without posting silently by default."
  },
  {
    name: "Retention Agent",
    status: "Live",
    cadence: "Daily",
    summary: "Builds holder streaks, loyalty tiers, and reward campaigns from wallet-aware cohorts and creator policy."
  },
  {
    name: "Growth Intelligence",
    status: "Advisory",
    cadence: "Daily",
    summary: "Benchmarks installed tokens and recommends content timing, hooks, and operator moves that correlate with volume."
  },
  {
    name: "Cross-Token Network",
    status: "Advisory",
    cadence: "Weekly",
    summary: "Finds opt-in audience overlap and suggests cross-community plays only when the signal is actually present."
  }
];

export const installSteps = [
  "Connect the creator wallet that already controls a live Bags token.",
  "Preview and tune the fee-share split with the KAGE operator and retention wallets.",
  "Choose assisted or delegated autonomy before generating any live Bags transactions."
];
