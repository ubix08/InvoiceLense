import type { InvoiceJSON } from '../extraction/extractionTypes';

export function exportLineItemsCSV(invoice: InvoiceJSON): string {
  // Use lazy import or assume Papa is available if bundled
  // We'll return the object structure to be easily passed to Papa in the component
  return ""; // handled in export hook
}
