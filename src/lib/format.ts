import { convertVndToUsdSync } from './currencyService';
import type { Currency } from './currencyContext';

export function formatPrice(valueVnd: number, targetCurrency: Currency = 'VND'): string {
  if (!valueVnd || valueVnd <= 0) return targetCurrency === 'USD' ? '0$' : '0đ';

  if (targetCurrency === 'USD') {
    const usdVal = convertVndToUsdSync(valueVnd);
    const formattedNum = new Intl.NumberFormat('en-US', {
      maximumFractionDigits: 0,
    }).format(usdVal);
    return `${formattedNum}$`;
  }

  const formattedNum = new Intl.NumberFormat('vi-VN', {
    maximumFractionDigits: 0,
  }).format(valueVnd);
  return `${formattedNum}đ`;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
