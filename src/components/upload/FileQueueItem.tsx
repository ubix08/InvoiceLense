import React from 'react';
import { FileText, Image as ImageIcon, X, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { ProgressBar } from '../ui/ProgressBar';
import { Badge } from '../ui/Badge';
import type { DocumentJob } from '../../core/ocr/ocrTypes';
import { cn } from '../../lib/utils';
import { useDocumentStore } from '../../store/useDocumentStore';

export function FileQueueItem({ job, key }: { job: DocumentJob, key?: React.Key }) {
  const { removeJob, setActiveJob, activeJobId } = useDocumentStore();
  const isActive = activeJobId === job.id;

  const isImage = job.mimeType.startsWith('image/');
  const Icon = isImage ? ImageIcon : FileText;

  let badgeVariant: 'default'|'success'|'warning'|'error'|'info' = 'default';
  let badgeText: string = job.stage;

  if (job.stage === 'done') {
    badgeVariant = job.ocrConfidence > 70 ? 'success' : 'warning';
    badgeText = 'Done';
  } else if (job.stage === 'error') {
    badgeVariant = 'error';
    badgeText = 'Failed';
  } else if (job.stage !== 'idle') {
    badgeVariant = 'info';
  }

  return (
    <div 
      onClick={() => (job.stage === 'done' || job.stage === 'error') && setActiveJob(job.id)}
      className={cn(
        "relative flex items-center gap-4 p-3 rounded-md border transition-colors",
        isActive ? "bg-surface2 border-accent" : "bg-surface border-border hover:border-text-muted",
        (job.stage === 'done' || job.stage === 'error') ? "cursor-pointer" : ""
      )}
    >
      <div className="flex-shrink-0 w-12 h-12 rounded bg-surface2 flex items-center justify-center overflow-hidden">
        {job.previewUrl ? (
          <img src={job.previewUrl} alt="preview" className="w-full h-full object-cover" />
        ) : (
          <Icon className="w-6 h-6 text-text-muted" />
        )}
      </div>
      
      <div className="flex-1 min-w-0">
        <div className="flex justify-between mb-1 items-center">
          <p className="text-sm font-medium text-text truncate pr-2">{job.fileName}</p>
          <Badge variant={badgeVariant}>{badgeText}</Badge>
        </div>
        
        {job.stage !== 'done' && job.stage !== 'error' && (
          <div className="mt-2">
            <ProgressBar progress={job.progress} />
            <p className="text-xs text-text-muted mt-1 uppercase tracking-wider">{job.stage}...</p>
          </div>
        )}

        {job.stage === 'done' && (
          <p className="text-xs text-text-muted mt-0.5">
            Confidence: {job.ocrConfidence.toFixed(0)}%
          </p>
        )}
        
        {job.stage === 'error' && (
          <p className="text-xs text-error mt-0.5 truncate" title={job.error}>
            {job.error}
          </p>
        )}
      </div>

      <button 
        onClick={(e) => { e.stopPropagation(); removeJob(job.id); }}
        className="absolute top-2 right-2 p-1 text-text-muted hover:text-error opacity-0 group-hover:opacity-100 transition-opacity"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
