import * as pdfjsLib from 'pdfjs-dist';

// Use CDN worker to avoid bundler issues
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdn.jsdelivr.net/npm/pdfjs-dist@4.7.76/build/pdf.worker.min.mjs`;

export async function pdfToImageBlobs(
  file: File,
  scale: number = 2.0
): Promise<Blob[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const blobs: Blob[] = [];

  for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
    const page = await pdf.getPage(pageNum);
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement('canvas');
    canvas.width  = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext('2d')!;
    await page.render({ canvasContext: ctx, viewport } as any).promise;
    const blob = await new Promise<Blob>((res) =>
      canvas.toBlob((b) => res(b!), 'image/png')
    );
    blobs.push(blob);
  }

  return blobs;
}
