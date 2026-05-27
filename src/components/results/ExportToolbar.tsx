import { CodeIcon, Download, Zap, FileSpreadsheet, PlayCircle } from 'lucide-react';
import { Button } from '../ui/Button';
import type { InvoiceJSON } from '../../core/extraction/extractionTypes';
import { useExport } from '../../hooks/useExport';

export function ExportToolbar({ invoice, requireUpgrade }: { invoice: InvoiceJSON, requireUpgrade: () => boolean }) {
  const { exportJSON, exportCSV, exportXLSX, triggerWebhook, triggerSheets } = useExport();

  return (
    <div className="flex flex-wrap gap-2 py-3 border-b border-border mb-4">
      <Button variant="outline" size="sm" onClick={() => exportJSON(invoice)}>
        <CodeIcon className="w-4 h-4 mr-2" /> JSON
      </Button>
      <Button variant="outline" size="sm" onClick={() => exportCSV(invoice)}>
        <Download className="w-4 h-4 mr-2" /> CSV
      </Button>
      <Button variant="outline" size="sm" onClick={() => {
        if (!requireUpgrade()) exportXLSX(invoice);
      }}>
        <FileSpreadsheet className="w-4 h-4 mr-2 text-green-500" /> XLSX
      </Button>
      
      <div className="w-px h-6 bg-border mx-2 self-center"></div>
      
      <Button variant="ghost" size="sm" onClick={() => {
        if (!requireUpgrade()) triggerWebhook(invoice);
      }}>
        <Zap className="w-4 h-4 mr-2 text-accent" /> Webhook
      </Button>
      <Button variant="ghost" size="sm" onClick={() => {
        if (!requireUpgrade()) triggerSheets(invoice);
      }}>
        <PlayCircle className="w-4 h-4 mr-2 text-green-500" /> Sheets Send
      </Button>
    </div>
  );
}
