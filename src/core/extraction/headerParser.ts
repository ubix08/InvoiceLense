import { parseAnyDate } from './dateParser';
import { detectCurrency } from './currencyParser';

export interface InvoiceHeader {
  invoiceNumber: string | null;
  invoiceDate:   string | null;
  dueDate:       string | null;
  poNumber:      string | null;
  currency:      string;
  vendorName:    string | null;
  vendorAddress: string | null;
  vendorTaxId:   string | null;
  customerName:  string | null;
  customerAddress: string | null;
}

const INVOICE_NUMBER_PATTERNS = [
  /invoice\s*(?:no\.?|number|#|num)[:\s#]*([A-Z0-9\-\/]{3,20})/gi,
  /inv[.\-\s]*#?\s*([A-Z0-9\-\/]{3,20})/gi,
  /bill\s*(?:no\.?|number|#)[:\s]*([A-Z0-9\-\/]{3,20})/gi,
  /#\s*([A-Z0-9\-]{4,20})/g,
];

const DUE_DATE_PATTERNS = [
  /(?:due\s*(?:date|by)|payment\s*due|pay\s*by)[:\s]*([A-Za-z0-9\s,\/\-\.]{5,20})/gi,
];

const INVOICE_DATE_PATTERNS = [
  /(?:invoice\s*date|date\s*of\s*invoice|date\s*issued|issued)[:\s]*([A-Za-z0-9\s,\/\-\.]{5,20})/gi,
  /(?:^|\n)date[:\s]*([A-Za-z0-9\s,\/\-\.]{5,20})/gim,
];

const PO_PATTERNS = [
  /(?:p\.?o\.?\s*(?:number|no\.?|#)|purchase\s*order)[:\s#]*([A-Z0-9\-]{3,20})/gi,
];

const TAX_ID_PATTERNS = [
  /(?:vat\s*(?:no\.?|number|#|id)|tax\s*(?:id|number)|ein|gst\s*no)[:\s#]*([A-Z0-9\-]{5,20})/gi,
  /(?:^|\n)vat\s*[:\-]\s*([A-Z]{2}\d{9,12})/gim,
];

function extractFirst(text: string, patterns: RegExp[]): string | null {
  for (const pattern of patterns) {
    pattern.lastIndex = 0;
    const match = pattern.exec(text);
    if (match?.[1]?.trim()) return match[1].trim();
  }
  return null;
}

export function parseHeader(text: string): InvoiceHeader {
  return {
    invoiceNumber: extractFirst(text, INVOICE_NUMBER_PATTERNS),
    invoiceDate:   parseAnyDate(extractFirst(text, INVOICE_DATE_PATTERNS)),
    dueDate:       parseAnyDate(extractFirst(text, DUE_DATE_PATTERNS)),
    poNumber:      extractFirst(text, PO_PATTERNS),
    currency:      detectCurrency(text),
    vendorName:    extractVendorName(text),
    vendorAddress: extractVendorAddress(text),
    vendorTaxId:   extractFirst(text, TAX_ID_PATTERNS),
    customerName:  extractCustomerName(text),
    customerAddress: extractCustomerAddress(text),
  };
}

function extractVendorName(text: string): string | null {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  for (const line of lines.slice(0, 8)) {
    if (/^\d/.test(line)) continue;
    if (/invoice|bill|receipt|statement/i.test(line)) continue;
    if (line.length > 3 && line.length < 80) return line;
  }
  return null;
}

function extractVendorAddress(text: string): string | null {
  const addressRx = /\d+\s+[\w\s]+(?:street|st\.?|avenue|ave\.?|road|rd\.?|blvd|drive|dr\.?|lane|ln\.?)/gi;
  const match = addressRx.exec(text);
  return match?.[0]?.trim() ?? null;
}

function extractCustomerName(text: string): string | null {
  const rx = /(?:bill\s*to|sold\s*to|customer|client|ship\s*to)[:\s]*\n?\s*([A-Za-z][\w\s,\.]{2,60})/gi;
  const match = rx.exec(text);
  return match?.[1]?.trim() ?? null;
}

function extractCustomerAddress(text: string): string | null {
  const rx = /(?:bill\s*to|sold\s*to|ship\s*to)[:\s]*\n([\s\S]{10,200}?)(?:\n\n|\n[A-Z]{2,}:)/gi;
  const match = rx.exec(text);
  return match?.[1]?.replace(/\n/g, ', ').trim() ?? null;
}
