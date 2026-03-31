function parseCsv(value: string | undefined) {
  return (value ?? "")
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean);
}

export type RuntimeConfig = {
  bagsApiKey: string | null;
  kageOpsWallet: string | null;
  kageRetentionWallet: string | null;
  trackedTokenMints: string[];
  defaultAdminWallet: string | null;
};

export function getRuntimeConfig(): RuntimeConfig {
  return {
    bagsApiKey: process.env.BAGS_API_KEY ?? null,
    kageOpsWallet: process.env.KAGE_OPS_WALLET ?? null,
    kageRetentionWallet: process.env.KAGE_RETENTION_WALLET ?? null,
    trackedTokenMints: parseCsv(process.env.KAGE_TRACKED_TOKEN_MINTS),
    defaultAdminWallet: process.env.KAGE_ADMIN_WALLET ?? null
  };
}

export function getDashboardMissingEnv() {
  const config = getRuntimeConfig();
  const missing: string[] = [];

  if (!config.bagsApiKey) {
    missing.push("BAGS_API_KEY");
  }

  return missing;
}

export function getInstallMissingEnv() {
  const config = getRuntimeConfig();
  const missing: string[] = [];

  if (!config.bagsApiKey) {
    missing.push("BAGS_API_KEY");
  }

  if (!config.kageOpsWallet) {
    missing.push("KAGE_OPS_WALLET");
  }

  if (!config.kageRetentionWallet) {
    missing.push("KAGE_RETENTION_WALLET");
  }

  return missing;
}
