import { pipeline, env, RawImage } from '@xenova/transformers';
import type { LayoutRegion, LayoutLabel, InvoiceZone } from './layoutTypes';

// Use HF CDN & Cache in browser IndexedDB
env.allowLocalModels = false;  
env.useBrowserCache = true;    

let detectorSingleton: Awaited<ReturnType<typeof pipeline>> | null = null;
let loadingPromise: Promise<Awaited<ReturnType<typeof pipeline>>> | null = null;

const MODEL_ID = 'Oblix/yolov10m-doclaynet_ONNX_document-layout-analysis';
const SCORE_THRESHOLD = 0.35;

const INVOICE_ZONE_MAP: Partial<Record<LayoutLabel, InvoiceZone>> = {
  'Title':          'HEADER',
  'Page-header':    'HEADER',
  'Section-header': 'SUBHEADER',
  'Table':          'LINE_ITEMS_TABLE',
  'Text':           'BODY_TEXT',
  'List-item':      'BODY_TEXT',
  'Page-footer':    'FOOTER',
};

export async function loadLayoutClassifier(): Promise<void> {
  if (detectorSingleton) return;
  if (loadingPromise) { await loadingPromise; return; }

  loadingPromise = pipeline('object-detection', MODEL_ID, {
    dtype: 'fp32' as any,
  } as any);
  detectorSingleton = await loadingPromise;
}

export async function classifyLayout(imageBlob: Blob): Promise<LayoutRegion[]> {
  if (!detectorSingleton) await loadLayoutClassifier();

  const image = await RawImage.fromURL(URL.createObjectURL(imageBlob));
  const output = await (detectorSingleton as any)(image as any, { threshold: SCORE_THRESHOLD });

  return (output as any[]).map((pred) => ({
    label: pred.label as LayoutLabel,
    score: pred.score,
    box: pred.box,
    invoiceZone: INVOICE_ZONE_MAP[pred.label as LayoutLabel] ?? 'BODY_TEXT',
  }));
}

export function cropRegionFromCanvas(
  sourceCanvas: HTMLCanvasElement,
  box: { xmin: number; ymin: number; xmax: number; ymax: number },
  padding: number = 5
): Promise<Blob> {
  const w = box.xmax - box.xmin;
  const h = box.ymax - box.ymin;
  const cropCanvas = document.createElement('canvas');
  cropCanvas.width  = w + padding * 2;
  cropCanvas.height = h + padding * 2;
  const ctx = cropCanvas.getContext('2d')!;
  ctx.drawImage(
    sourceCanvas,
    Math.max(0, box.xmin - padding),
    Math.max(0, box.ymin - padding),
    w + padding * 2,
    h + padding * 2,
    0, 0,
    cropCanvas.width,
    cropCanvas.height
  );
  return new Promise((res) => cropCanvas.toBlob((b) => res(b!), 'image/png'));
}
