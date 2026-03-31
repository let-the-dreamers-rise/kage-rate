export const submissionDraft = {
  appName: "KAGE",
  tagline: "The post-launch operator for Bags creators.",
  description:
    "KAGE is the post-launch operator for Bags creators. It uses the live Bags API to read fee-share recipients, claim events, claimable positions, and lifetime fees, then turns that data into install-ready actions: fee recovery previews, retention campaigns, community drafts, and creator-safe automation. Anyone can paste a token mint and see live Bags analytics immediately, while token admins can generate a real fee-share update preview with KAGE operator and retention wallets. KAGE solves what happens after launch: creators miss fees, communities decay, and tokens die because no one is operating them.",
  recommendedCategory: "AI Agents",
  alternateCategory: "Bags API",
  recommendedCoinChoice: "No coin yet",
  coinRationale:
    "KAGE is more fundable if the product works before a native coin exists. The wedge is creator operations and fee recovery first, optional network token later.",
  websitePlaceholder: "Deploy this app and paste the public URL here.",
  githubPlaceholder: "Create a dedicated repo for kage-operator and paste that URL here.",
  emailPlaceholder: "Replace with your real email address.",
  xPlaceholder: "Replace with your real X profile URL.",
  proofPoints: [
    "Live Bags API reads are already wired into the product surface.",
    "The install flow generates a real fee-share admin update preview with KAGE wallets.",
    "Permission gates are honest: KAGE does not pretend to control a token it does not administer.",
    "The demo works with public token mints, so judges can verify value without requiring capital."
  ],
  fundabilityPoints: [
    "Painkiller wedge: creators lose fees and burn out after launch because nobody runs post-launch ops.",
    "Clear business model: KAGE can charge on recovered value or managed fee-share, not just on vague SaaS seats.",
    "Trust-led adoption: the product is useful before custody, which lowers the biggest creator trust barrier.",
    "Moat: once multiple creators install KAGE, retention and growth playbooks improve across the network."
  ],
  formFields: [
    {
      label: "App Name",
      value: "KAGE",
      note: "Short, memorable, and fits the shadow-operator brand."
    },
    {
      label: "Description",
      value:
        "KAGE is the post-launch operator for Bags creators. It reads live Bags fees and claim activity, prepares install-ready fee-share updates, and keeps creator control intact while automating recovery, retention, and community ops.",
      note: "Use this if the form prefers a shorter description."
    },
    {
      label: "Category",
      value: "AI Agents",
      note: "Best primary category. If you want to lean harder into protocol depth, use Bags API."
    },
    {
      label: "Coin",
      value: "No coin yet",
      note: "Recommended for a fundable application unless you already control a legitimate KAGE coin."
    }
  ]
} as const;
