import type { InvoiceJSON } from '../extraction/extractionTypes';

export type ProcessingStage =
  | 'idle'
  | 'ingesting'
  | 'preprocessing'
  | 'classifying'
  | 'ocr'
  | 'extracting'
  | 'done'
  | 'error';

export interface DocumentJob {
  id: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  stage: ProcessingStage;
  progress: number;            
  ocrConfidence: number;       
  error?: string;
  result?: InvoiceJSON;
  rawText?: string;
  previewUrl?: string;         
  processedAt?: Date;
}
