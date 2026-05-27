import { useState, useMemo } from 'react';
import { Header } from '../components/layout/Header';
import { DropZone } from '../components/upload/DropZone';
import { FileQueueItem } from '../components/upload/FileQueueItem';
import { QuotaBanner } from '../components/paywall/QuotaBanner';
import { ResultsPanel } from '../components/results/ResultsPanel';
import { SettingsDrawer } from '../components/settings/SettingsDrawer';
import { UpgradeModal } from '../components/paywall/UpgradeModal';
import { useDocumentStore } from '../store/useDocumentStore';
import { useOCRPipeline } from '../hooks/useOCRPipeline';

export default function AppPage() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { jobs, activeJobId } = useDocumentStore();
  const { processFile, showUpgradeModal, setShowUpgradeModal } = useOCRPipeline();

  const activeJob = useMemo(() => jobs.find(j => j.id === activeJobId) || null, [jobs, activeJobId]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-bg text-text">
      <Header onOpenSettings={() => setIsSettingsOpen(true)} />
      
      <main className="flex-1 overflow-hidden grid lg:grid-cols-12 gap-px bg-border">
        {/* LEFT PANEL */}
        <section className="lg:col-span-5 xl:col-span-4 bg-bg flex flex-col hide-scrollbar overflow-y-auto">
          <div className="p-4 border-b border-border">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted mb-3">Upload Documents</h2>
            <DropZone onFilesAccepted={(files) => files.forEach(f => processFile(f))} />
            <QuotaBanner onUpgradeClick={() => setShowUpgradeModal(true)} />
          </div>
          
          <div className="flex-1 p-4 bg-surface/30">
             <div className="flex justify-between items-center mb-4">
                 <h2 className="text-sm font-semibold uppercase tracking-wider text-text-muted">Processing Queue</h2>
                 <span className="text-xs bg-surface2 px-2 py-0.5 rounded text-text-muted font-mono">{jobs.length} items</span>
             </div>
             
             {jobs.length === 0 ? (
                <div className="text-center py-12 text-sm text-text-muted">
                    Your queue is empty.<br/>Upload an invoice to begin.
                </div>
             ) : (
                <div className="space-y-2">
                  {jobs.map(job => (
                     <FileQueueItem key={job.id} job={job} />
                  ))}
                </div>
             )}
          </div>
        </section>
        
        {/* RIGHT PANEL */}
        <section className="lg:col-span-7 xl:col-span-8 bg-bg relative">
           <ResultsPanel job={activeJob} />
        </section>
      </main>

      <SettingsDrawer isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} />
    </div>
  );
}
