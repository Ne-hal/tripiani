// Approximate USD → BHD peg (~2.66 USD = 1 BHD), for display purposes only.
// Underlying mock data stays USD-denominated; only rendered text is converted.
const USD_TO_BHD_RATE = 0.376;

export function formatBHD(amountUsd: number): string {
  const bhd = amountUsd * USD_TO_BHD_RATE;
  return `BHD ${bhd.toLocaleString(undefined, {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })}`;
}
