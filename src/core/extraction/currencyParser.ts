const CURRENCY_SYMBOLS: Record<string, string> = {
  '$': 'USD', '€': 'EUR', '£': 'GBP', '¥': 'JPY',
  '₹': 'INR', '₩': 'KRW', 'CHF': 'CHF', 'CAD': 'CAD',
  'AUD': 'AUD', 'NZD': 'NZD', 'SEK': 'SEK', 'NOK': 'NOK',
  'DKK': 'DKK', 'MXN': 'MXN', 'BRL': 'BRL', 'ZAR': 'ZAR',
};

export function detectCurrency(text: string): string {
  const isoMatch = text.match(/\b(USD|EUR|GBP|JPY|INR|CAD|AUD|CHF|NZD|SEK|NOK|DKK|MXN|BRL|ZAR)\b/i);
  if (isoMatch) return isoMatch[1].toUpperCase();

  for (const [sym, code] of Object.entries(CURRENCY_SYMBOLS)) {
    if (text.includes(sym)) return code;
  }
  return 'USD';
}

export function parseAmount(raw: string): number | null {
  if (!raw) return null;
  const cleaned = raw.replace(/[^0-9,.\-]/g, '').trim();
  if (!cleaned) return null;

  // European format: 1.234,56
  if (/^\d{1,3}(\.\d{3})*(,\d{2})?$/.test(cleaned)) {
    return parseFloat(cleaned.replace(/\./g, '').replace(',', '.'));
  }
  // Standard format: 1,234.56
  return parseFloat(cleaned.replace(/,/g, ''));
}
