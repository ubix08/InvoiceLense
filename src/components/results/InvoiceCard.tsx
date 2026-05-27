import type { InvoiceJSON } from '../../core/extraction/extractionTypes';
import { Badge } from '../ui/Badge';
import { Calendar, Hash, User, Building, MapPin } from 'lucide-react';

export function InvoiceCard({ header, totals }: { header: InvoiceJSON['header'], totals: InvoiceJSON['totals'] }) {
  return (
    <div className="bg-surface rounded-lg border border-border p-5 mb-6 shadow-md mt-4">
      <div className="flex justify-between items-start mb-6 border-b border-border pb-4">
        <div>
          <h2 className="text-xl font-bold text-text mb-1 tracking-tight">Invoice Details</h2>
          <div className="flex gap-4 text-sm text-text-muted mt-2">
            <span className="flex items-center gap-1"><Hash className="w-4 h-4 text-accent" /> {header.invoiceNumber || 'Unknown'}</span>
            <span className="flex items-center gap-1"><Calendar className="w-4 h-4 text-accent" /> {header.invoiceDate || 'Unknown'}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-sm text-text-muted mb-1">Total Due</p>
          <p className="text-3xl font-mono text-accent">
            {header.currency} {totals.grandTotal?.toFixed(2) ?? '0.00'}
          </p>
          {totals.amountPaid ? (
             <Badge variant="success" className="mt-2">Paid {totals.amountPaid}</Badge>
          ) : null}
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-8 text-sm">
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-text-muted mb-3 uppercase tracking-wider text-xs">
            <Building className="w-4 h-4" /> Billed From
          </h3>
          <p className="font-medium text-text mb-1">{header.vendorName || <span className="italic text-text-muted/50">Unknown Vendor</span>}</p>
          {header.vendorAddress && <p className="text-text-muted leading-relaxed flex items-start gap-2 max-w-[200px]"><MapPin className="w-3 h-3 mt-1 flex-shrink-0"/> {header.vendorAddress}</p>}
          {header.vendorTaxId && <p className="text-text-muted mt-2">Tax ID: <span className="font-mono text-xs">{header.vendorTaxId}</span></p>}
        </div>
        <div>
          <h3 className="flex items-center gap-2 font-semibold text-text-muted mb-3 uppercase tracking-wider text-xs">
            <User className="w-4 h-4" /> Billed To
          </h3>
          <p className="font-medium text-text mb-1">{header.customerName || <span className="italic text-text-muted/50">Unknown Customer</span>}</p>
          {header.customerAddress && <p className="text-text-muted leading-relaxed flex items-start gap-2 max-w-[200px]"><MapPin className="w-3 h-3 mt-1 flex-shrink-0"/> {header.customerAddress}</p>}
        </div>
      </div>
    </div>
  );
}
