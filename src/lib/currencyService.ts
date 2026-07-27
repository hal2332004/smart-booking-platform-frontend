/**
 * Live Exchange Rate Service for converting VND to USD
 */

let cachedVndToUsdRate: number = 1 / 25400; // Default fallback (~25,400 VND = 1 USD)
let lastFetchTime = 0;
const CACHE_DURATION_MS = 60 * 60 * 1000; // 1 hour cache

export async function getVndToUsdRate(): Promise<number> {
  const now = Date.now();
  if (now - lastFetchTime < CACHE_DURATION_MS && cachedVndToUsdRate > 0) {
    return cachedVndToUsdRate;
  }

  try {
    const res = await fetch('https://open.er-api.com/v6/latest/VND');
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates && data.rates.USD) {
        cachedVndToUsdRate = data.rates.USD;
        lastFetchTime = now;
        return cachedVndToUsdRate;
      }
    }
  } catch (err) {
    console.warn('Failed to fetch live exchange rate, using fallback rate:', err);
  }

  return cachedVndToUsdRate;
}

export function convertVndToUsdSync(vndValue: number): number {
  return Math.round(vndValue * cachedVndToUsdRate);
}

export function convertUsdToVndSync(usdValue: number): number {
  if (!cachedVndToUsdRate || cachedVndToUsdRate <= 0) return usdValue * 25400;
  return Math.round(usdValue / cachedVndToUsdRate);
}

// Trigger initial fetch silently
getVndToUsdRate().catch(() => {});
