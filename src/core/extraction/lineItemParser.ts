import { parseAmount } from './currencyParser';

export interface LineItem {
  lineNumber:  number;
  description: string;
  quantity:    number | null;
  unit:        string | null;
  unitPrice:   number | null;
  taxRate:     number | null;
  discount:    number | null;
  lineTotal:   number | null;
  hsnCode:     string | null;
  sku:         string | null;
}

export function parseLineItemsFromHocr(hocr: string, imageHeight: number): LineItem[] {
  const parser = new DOMParser();
  const doc = parser.parseFromString(hocr, 'text/html');
  const words = Array.from(doc.querySelectorAll('.ocrx_word')) as HTMLElement[];

  type Word = { text: string; x: number; y: number; w: number; h: number };
  const parsedWords: Word[] = words.map((el) => {
    const title = el.getAttribute('title') ?? '';
    const bbox = title.match(/bbox\s+(\d+)\s+(\d+)\s+(\d+)\s+(\d+)/);
    if (!bbox) return null;
    const [, x1, y1, x2, y2] = bbox.map(Number);
    return {
      text: el.textContent?.trim() ?? '',
      x: x1,
      y: (y1 + y2) / 2,
      w: x2 - x1,
      h: y2 - y1,
    };
  }).filter(Boolean) as Word[];

  const ROW_TOLERANCE = 8;
  const rows: Word[][] = [];
  for (const word of parsedWords) {
    const existing = rows.find((r) => Math.abs(r[0].y - word.y) < ROW_TOLERANCE);
    if (existing) existing.push(word);
    else rows.push([word]);
  }

  rows.sort((a, b) => a[0].y - b[0].y);

  const TABLE_START_PATTERN = /\d+[\.,]\d{2}/;
  let tableStart = -1;
  for (let i = 0; i < rows.length; i++) {
    const rowText = rows[i].map(w => w.text).join(' ');
    if (TABLE_START_PATTERN.test(rowText)) { tableStart = i; break; }
  }
  if (tableStart === -1) return [];

  const tableRows = rows.slice(tableStart);
  return tableRows
    .map((row, idx) => parseTableRow(row, idx))
    .filter((item): item is LineItem => item !== null);
}

function parseTableRow(words: Array<{ text: string; x: number; y: number }>, idx: number): LineItem | null {
  const sorted = [...words].sort((a, b) => a.x - b.x);
  const rowText = sorted.map(w => w.text).join(' ');

  if (!/\d/.test(rowText)) return null;

  const numbers = sorted.filter(w => /^[\d,.$€£]+$/.test(w.text.replace(/[,.\s$€£]/g, '')));
  if (numbers.length < 1) return null;

  const amounts = numbers.slice(-3).map(w => parseAmount(w.text)).filter((n): n is number => n !== null);
  const lineTotal  = amounts.length >= 1 ? amounts[amounts.length - 1] : null;
  const unitPrice  = amounts.length >= 2 ? amounts[amounts.length - 2] : null;
  const quantity   = amounts.length >= 3 ? amounts[amounts.length - 3] : null;

  const firstNumX = numbers[0]?.x ?? Infinity;
  const descWords = sorted.filter(w => w.x < firstNumX - 10);
  const description = descWords.map(w => w.text).join(' ').trim();

  if (!description && !lineTotal) return null;

  return {
    lineNumber:  idx + 1,
    description: description || rowText,
    quantity,
    unit:        detectUnit(rowText),
    unitPrice,
    taxRate:     detectTaxRate(rowText),
    discount:    detectDiscount(rowText),
    lineTotal,
    hsnCode:     detectHsnCode(rowText),
    sku:         detectSku(rowText),
  };
}

export function parseLineItemsFromText(text: string): LineItem[] {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const items: LineItem[] = [];
  let idx = 0;

  const LINE_ITEM_RX = /^(.+?)\s+(\d+(?:\.\d+)?)\s*(?:x\s*[\d.,]+\s*)?(?:[\d.,]+\s*)?(\d{1,3}(?:[,. ]\d{3})*(?:[,.]\d{2})?)$/;

  for (const line of lines) {
    if (line.length < 5) continue;
    if (/^(?:total|subtotal|tax|vat|discount|due|balance)/i.test(line)) continue;

    const match = LINE_ITEM_RX.exec(line);
    if (match) {
      items.push({
        lineNumber:  ++idx,
        description: match[1].trim(),
        quantity:    parseAmount(match[2]),
        unit:        detectUnit(line),
        unitPrice:   null,
        taxRate:     detectTaxRate(line),
        discount:    detectDiscount(line),
        lineTotal:   parseAmount(match[3]),
        hsnCode:     detectHsnCode(line),
        sku:         detectSku(line),
      });
    }
  }

  return items;
}

function detectUnit(text: string): string | null {
  const m = text.match(/\b(pcs?|pieces?|hrs?|hours?|days?|kg|lbs?|oz|m²|sqft|units?|ea\.?|each|box(?:es)?|sets?)\b/i);
  return m?.[1] ?? null;
}

function detectTaxRate(text: string): number | null {
  const m = text.match(/(\d{1,2}(?:\.\d+)?)\s*%/);
  return m ? parseFloat(m[1]) : null;
}

function detectDiscount(text: string): number | null {
  const m = text.match(/(?:discount|disc\.?)[:\s]*-?\s*([\d.,]+)/i);
  return m ? parseAmount(m[1]) : null;
}

function detectHsnCode(text: string): string | null {
  const m = text.match(/(?:hsn|sac)[:\s]*(\d{4,8})/i);
  return m?.[1] ?? null;
}

function detectSku(text: string): string | null {
  const m = text.match(/(?:sku|item\s*no\.?|part\s*no\.?|ref)[:\s#]*([A-Z0-9\-]{3,20})/i);
  return m?.[1] ?? null;
}
