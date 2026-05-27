import { useDropzone, FileRejection } from 'react-dropzone';
import { UploadCloud } from 'lucide-react';
import { cn } from '../../lib/utils';
import { useCallback } from 'react';

interface DropZoneProps {
  onFilesAccepted: (files: File[]) => void;
  disabled?: boolean;
}

export function DropZone({ onFilesAccepted, disabled }: DropZoneProps) {
  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[]) => {
    if (acceptedFiles.length > 0) {
      onFilesAccepted(acceptedFiles);
    }
    if (fileRejections.length > 0) {
      // Could show toast error here
      console.error(fileRejections);
    }
  }, [onFilesAccepted]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/jpeg': ['.jpg', '.jpeg'],
      'image/png': ['.png'],
      'image/webp': ['.webp'],
      'image/tiff': ['.tiff', '.tif'],
      'application/pdf': ['.pdf'],
    },
    maxSize: 20 * 1024 * 1024,
    disabled
  } as any);

  return (
    <div
      {...getRootProps()}
      className={cn(
        "relative flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer transition-all bg-surface hover:bg-surface2",
        {
          "border-accent bg-accent/5": isDragActive,
          "border-border": !isDragActive,
          "opacity-50 cursor-not-allowed": disabled
        }
      )}
    >
      <input {...getInputProps()} />
      <UploadCloud className={cn("w-10 h-10 mb-3", isDragActive ? "text-accent" : "text-text-muted")} />
      <p className="mb-2 text-sm text-text font-medium">
        <span className="font-semibold text-accent">Click to upload</span> or drag and drop
      </p>
      <p className="text-xs text-text-muted">
        PDF, PNG, JPG, WEBP (Max 20MB)
      </p>
    </div>
  );
}
