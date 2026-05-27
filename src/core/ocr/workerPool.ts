import Tesseract from 'tesseract.js';
import type { Scheduler } from 'tesseract.js';

const { createWorker, createScheduler } = Tesseract;

const WORKER_COUNT = 4;
let schedulerSingleton: Scheduler | null = null;
let initPromise: Promise<Scheduler> | null = null;

export async function getScheduler(): Promise<Scheduler> {
  if (schedulerSingleton) return schedulerSingleton;
  if (initPromise) return initPromise;

  initPromise = (async () => {
    const scheduler = createScheduler();
    const workers = await Promise.all(
      Array.from({ length: WORKER_COUNT }, () =>
        createWorker('eng', 1, {
          logger: (m) => {
            if (m.status === 'recognizing text') {
              const channel = new BroadcastChannel('ocr-progress');
              channel.postMessage({ jobId: m.jobId, progress: m.progress });
            }
          },
        })
      )
    );
    workers.forEach((w) => scheduler.addWorker(w));
    schedulerSingleton = scheduler;
    return scheduler;
  })();

  return initPromise;
}

export async function recognizeImage(
  imageSource: string | Blob | HTMLCanvasElement,
  options?: { psm?: string } // NOTE: tesseract.js v5 expects string for tessedit_pageseg_mode sometimes, we'll pass string.
): Promise<{ text: string; confidence: number; hocr: string }> {
  const scheduler = await getScheduler();
  const result = await scheduler.addJob('recognize', imageSource, {
    tessedit_pageseg_mode: options?.psm ?? '6',
    preserve_interword_spaces: '1',
  } as any, { hocr: true } as any); // hack for hocr output in v5 Typescript

  const data = result.data;
  return { 
    text: data.text, 
    confidence: data.confidence ?? 0, 
    hocr: data.hocr ?? '' 
  };
}

export async function terminateScheduler(): Promise<void> {
  if (schedulerSingleton) {
    await schedulerSingleton.terminate();
    schedulerSingleton = null;
    initPromise = null;
  }
}
