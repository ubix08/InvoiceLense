import { useState, useCallback } from 'react';
import { useDocumentStore } from '../store/useDocumentStore';
import { useQuotaStore } from '../store/useQuotaStore';
import { processDocument } from '../core/extraction/invoiceParser';
import { pdfToImageBlobs } from '../core/pdf/pdfToImages';

export function useOCRPipeline() {
  const { addJob, updateJob } = useDocumentStore();
  const { consumePage } = useQuotaStore();
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const processFile = useCallback(async (file: File) => {
    if (file.type === 'application/pdf') {
       // Handled below for multiple pages
    }
    
    const allowed = consumePage();
    if (!allowed) {
      setShowUpgradeModal(true);
      return;
    }

    const id = crypto.randomUUID();
    addJob({
      id,
      fileName: file.name,
      fileSize: file.size,
      mimeType: file.type,
      stage: 'ingesting',
      progress: 0,
      ocrConfidence: 0,
      previewUrl: URL.createObjectURL(file)
    });

    try {
      let imageBlob: Blob;
      if (file.type === 'application/pdf') {
         updateJob(id, { stage: 'ingesting', progress: 5 });
         const blobs = await pdfToImageBlobs(file);
         // only take first page for now for simplicity, multi-page is complex
         imageBlob = blobs[0] || new Blob();
         updateJob(id, { previewUrl: URL.createObjectURL(imageBlob) });
      } else {
         imageBlob = file;
      }

      updateJob(id, { stage: 'preprocessing', progress: 10 });
      
      const result = await processDocument(imageBlob, (pct, stageName) => {
         let stage = 'preprocessing';
         if (pct > 20) stage = 'classifying';
         if (pct > 40) stage = 'ocr';
         if (pct > 80) stage = 'extracting';
         updateJob(id, { progress: pct, stage: stage as any });
      });

      updateJob(id, {
        stage: 'done',
        progress: 100,
        result,
        rawText: result.rawText,
        ocrConfidence: result.ocrConfidence,
        processedAt: new Date(result.extractedAt)
      });
    } catch (err: any) {
      updateJob(id, { stage: 'error', error: err.message, progress: 0 });
    }
  }, [addJob, updateJob, consumePage]);

  return { processFile, showUpgradeModal, setShowUpgradeModal };
}
