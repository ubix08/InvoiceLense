import { useState } from 'react';
import type { InvoiceJSON } from '../../core/extraction/extractionTypes';
import { Copy, CheckCircle } from 'lucide-react';
import { Button } from '../ui/Button';

export function JsonViewer({ data }: { data: InvoiceJSON }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative mt-8 rounded-lg border border-border group overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-surface2 border-b border-border">
         <span className="text-xs font-mono text-text-muted">Structured Payload (JSON)</span>
         <Button variant="ghost" size="sm" onClick={handleCopy} className="h-6 px-2 text-xs">
             {copied ? <CheckCircle className="w-3 h-3 mr-1 text-success"/> : <Copy className="w-3 h-3 mr-1"/>}
             {copied ? 'Copied' : 'Copy JSON'}
         </Button>
      </div>
      <pre className="p-4 bg-[#0a0a0f] text-green-400 font-mono text-[11px] leading-relaxed overflow-x-auto max-h-[400px]">
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre>
    </div>
  );
}
