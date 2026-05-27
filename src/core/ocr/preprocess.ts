export interface PreprocessOptions {
  targetDpi?: number;
  greyscale?: boolean;
  binarize?: boolean;
  contrast?: number;
  denoise?: boolean;
}

export async function preprocessImage(
  source: File | Blob | HTMLImageElement,
  opts: PreprocessOptions = {}
): Promise<Blob> {
  const {
    targetDpi = 300,
    greyscale = true,
    binarize = true,
    contrast = 30,
    denoise = false,
  } = opts;

  const bitmap = await createImageBitmap(source as Blob);

  const scaleFactor = Math.min(Math.ceil(targetDpi / 96), 4);
  const canvas = new OffscreenCanvas(
    bitmap.width * scaleFactor,
    bitmap.height * scaleFactor
  );
  const ctx = canvas.getContext('2d')!;
  ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const data = imageData.data;

  if (greyscale) {
    for (let i = 0; i < data.length; i += 4) {
      const lum = Math.round(0.299 * data[i] + 0.587 * data[i+1] + 0.114 * data[i+2]);
      data[i] = data[i+1] = data[i+2] = lum;
    }
  }

  if (contrast > 0) {
    const factor = (259 * (contrast + 255)) / (255 * (259 - contrast));
    for (let i = 0; i < data.length; i += 4) {
      data[i]   = Math.max(0, Math.min(255, factor * (data[i]   - 128) + 128));
      data[i+1] = Math.max(0, Math.min(255, factor * (data[i+1] - 128) + 128));
      data[i+2] = Math.max(0, Math.min(255, factor * (data[i+2] - 128) + 128));
    }
  }

  if (binarize) {
    const hist = new Int32Array(256);
    for (let i = 0; i < data.length; i += 4) hist[data[i]]++;
    const threshold = otsuThreshold(hist, canvas.width * canvas.height);
    for (let i = 0; i < data.length; i += 4) {
      const v = data[i] > threshold ? 255 : 0;
      data[i] = data[i+1] = data[i+2] = v;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.convertToBlob({ type: 'image/png' });
}

function otsuThreshold(hist: Int32Array, totalPixels: number): number {
  let sum = 0;
  for (let i = 0; i < 256; i++) sum += i * hist[i];
  let sumB = 0, wB = 0, max = 0, threshold = 128;
  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (wB === 0) continue;
    const wF = totalPixels - wB;
    if (wF === 0) break;
    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const between = wB * wF * (mB - mF) ** 2;
    if (between > max) { max = between; threshold = t; }
  }
  return threshold;
}
