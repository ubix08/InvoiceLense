import { recognizeImage } from '../ocr/workerPool';
import { preprocessImage } from '../ocr/preprocess';
import { classifyLayout } from '../layout/layoutClassifier';
import { parseHeader } from './headerParser';
import { parseLineItemsFromHocr, parseLineItemsFromText } from './lineItemParser';
import { parseTotals } from './totalsParser';
import type { InvoiceJSON } from './extractionTypes';

export async function processDocument(
  imageBlob: Blob,
  onProgress?: (pct: number, stage: string) => void
): Promise<InvoiceJSON> {
  onProgress?.(10, 'Preprocessing image…');
  const processed = await preprocessImage(imageBlob);

  onProgress?.(20, 'Analyzing document layout…');
  const regions = await classifyLayout(processed).catch(() => null);

  onProgress?.(40, 'Running OCR…');
  const { text, confidence, hocr } = await recognizeImage(processed, { psm: '6' });

  onProgress?.(80, 'Extracting structured data…');
  const header    = parseHeader(text);
  const hocrItems = parseLineItemsFromHocr(hocr, 0);
  const lineItems = hocrItems.length >= 1 ? hocrItems : parseLineItemsFromText(text);
  const totals    = parseTotals(text);

  onProgress?.(95, 'Assembling JSON…');
  return {
    schemaVersion: '1.0',
    extractedAt:   new Date().toISOString(),
    ocrConfidence: confidence,
    header,
    lineItems,
    totals,
    rawText:       text,
    layoutRegions: regions ?? [],
  };
}
