export function formatPrice(value: number, currency = 'USD'): string {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0,
  }).format(value);
  return formatted;
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
