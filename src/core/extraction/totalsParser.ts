import { parseAmount } from './currencyParser';

export interface InvoiceTotals {
  subtotal:       number | null;
  totalTaxAmount: number | null;
  totalDiscount:  number | null;
  shippingAmount: number | null;
  grandTotal:     number | null;
  amountPaid:     number | null;
  amountDue:      number | null;
}

export function parseTotals(text: string): InvoiceTotals {
  function extract(patterns: RegExp[]): number | null {
    for (const rx of patterns) {
      rx.lastIndex = 0;
      const m = rx.exec(text);
      if (m?.[1]) return parseAmount(m[1]);
    }
    return null;
  }

  return {
    subtotal: extract([
      /(?:subtotal|sub\s*total|net\s*amount)[:\s]*\$?\s*([\d,. ]+)/gi,
    ]),
    totalTaxAmount: extract([
      /(?:tax\s*amount|vat\s*amount|gst\s*amount|total\s*tax)[:\s]*\$?\s*([\d,. ]+)/gi,
      /(?:tax|vat|gst)\s+(?:\d+%\s*)?\$?\s*([\d,. ]+)/gi,
    ]),
    totalDiscount: extract([
      /(?:total\s*discount|discount\s*total)[:\s]*\$?\s*([\d,. ]+)/gi,
    ]),
    shippingAmount: extract([
      /(?:shipping|freight|delivery\s*charge)[:\s]*\$?\s*([\d,. ]+)/gi,
    ]),
    grandTotal: extract([
      /(?:grand\s*total|total\s*amount\s*due|amount\s*due|total\s*due|total)[:\s]*\$?\s*([\d,. ]+)/gi,
    ]),
    amountPaid: extract([
      /(?:amount\s*paid|payment\s*received)[:\s]*\$?\s*([\d,. ]+)/gi,
    ]),
    amountDue: extract([
      /(?:balance\s*due|remaining\s*balance|amount\s*outstanding)[:\s]*\$?\s*([\d,. ]+)/gi,
    ]),
  };
}
