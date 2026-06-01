export const SHIFT_SECONDS = 90;
export const CUSTOMER_SECONDS = 24;
export const ANOMALY_SECONDS = 18;
export const PROTECTION_HOLD_SECONDS = 2;
export const MAX_MISTAKES = 3;
export const MAX_THREAT = 100;

export type DifficultyConfig = {
  level: number;
  maxItemsPerOrder: number;
  anomalyChance: number;
  customerPatienceMs: number;
  subtleAnomalyChance: number;
};

export function getDifficulty(sequence: number, shiftElapsedRatio = 0): DifficultyConfig {
  const level = Math.min(5, 1 + Math.floor((sequence - 1) / 4) + Math.floor(shiftElapsedRatio * 2));

  return {
    level,
    maxItemsPerOrder: Math.min(5, 2 + level),
    anomalyChance: Math.min(0.38, 0.12 + level * 0.045),
    customerPatienceMs: Math.max(13_000, (CUSTOMER_SECONDS - (level - 1) * 1.8) * 1000),
    subtleAnomalyChance: Math.min(0.45, 0.12 + level * 0.06),
  };
}
