import { ExportToolbar } from './ExportToolbar';
import { InvoiceCard } from './InvoiceCard';
import { LineItemsTable } from './LineItemsTable';
import { JsonViewer } from './JsonViewer';
import type { DocumentJob } from '../../core/ocr/ocrTypes';
import { AlertCircle } from 'lucide-react';
import { useQuotaStore } from '../../store/useQuotaStore';
import { useState } from 'react';
import { UpgradeModal } from '../paywall/UpgradeModal';

export function ResultsPanel({ job }: { job: DocumentJob | null }) {
  const { tier } = useQuotaStore();
  const [showUpgrade, setShowUpgrade] = useState(false);

  if (!job) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-text-muted select-none">
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1" stroke="currentColor" className="w-16 h-16 mb-4 opacity-20">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m5.231 13.481L15 17.25m-4.5-15H5.625c-.621 0-1.125.504-1.125 1.125v16.5c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9zm3.75 11.625a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
        </svg>
        <p className="font-medium text-lg text-text">No document selected</p>
        <p className="text-sm mt-1">Upload a file or select one from the queue</p>
      </div>
    );
  }

  if (job.stage === 'error') {
     return (
        <div className="h-full flex flex-col items-center justify-center p-8 text-center">
            <AlertCircle className="w-12 h-12 text-error mb-4" />
            <h2 className="text-xl font-semibold mb-2">Processing Failed</h2>
            <p className="text-text-muted">{job.error}</p>
        </div>
     );
  }

  if (job.stage !== 'done' || !job.result) {
    return (
      <div className="h-full flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 border-4 border-surface2 border-t-accent rounded-full animate-spin"></div>
        <p className="text-accent font-mono uppercase tracking-widest text-sm animate-pulse">{job.stage}...</p>
      </div>
    );
  }

  const { result } = job;
  
  const handleRequireUpgrade = () => {
    if (tier === 'free') {
       setShowUpgrade(true);
       return true;
    }
    return false;
  };

  return (
    <div className="h-full overflow-y-auto p-2 sm:p-4">
      {showUpgrade && <UpgradeModal isOpen={showUpgrade} onClose={() => setShowUpgrade(false)} />}
      
      <ExportToolbar invoice={result} requireUpgrade={handleRequireUpgrade} />
      
      <div className="flex justify-between items-end">
          <h1 className="text-2xl font-bold tracking-tight text-white mb-2">{job.fileName}</h1>
          <div className="flex gap-2 items-center text-xs bg-surface2 px-3 py-1 rounded border border-border">
             <span className="text-text-muted uppercase tracking-wider font-semibold">Confidence</span>
             <span className={`font-mono text-sm ${job.ocrConfidence > 80 ? 'text-success' : job.ocrConfidence > 50 ? 'text-warning' : 'text-error'}`}>
                 {job.ocrConfidence.toFixed(1)}%
             </span>
          </div>
      </div>

      <InvoiceCard header={result.header} totals={result.totals} />
      <LineItemsTable items={result.lineItems} totals={result.totals} currency={result.header.currency} />
      <JsonViewer data={result} />
    </div>
  );
}
