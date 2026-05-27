import type { InvoiceJSON } from '../../core/extraction/extractionTypes';

export function LineItemsTable({ items, totals, currency }: { items: InvoiceJSON['lineItems'], totals: InvoiceJSON['totals'], currency: string }) {
  if (!items || items.length === 0) {
    return (
      <div className="w-full p-8 border border-dashed border-border rounded flex justify-center text-text-muted">
        No line items extracted.
      </div>
    )
  }

  return (
    <div className="mb-8">
      <h3 className="text-base font-semibold text-text mb-3 tracking-wide border-l-2 border-accent pl-2">Line Items</h3>
      <div className="overflow-x-auto rounded border border-border">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-surface2 text-text-muted border-b border-border uppercase text-xs tracking-wider">
            <tr>
              <th className="px-4 py-3 font-medium border-r border-border">#</th>
              <th className="px-4 py-3 font-medium w-full">Description</th>
              <th className="px-4 py-3 font-medium text-right bg-surface2/50">Qty</th>
              <th className="px-4 py-3 font-medium bg-surface2/50 border-r border-border">Unit</th>
              <th className="px-4 py-3 font-medium text-right">Price</th>
              <th className="px-4 py-3 font-medium text-right text-accent font-semibold bg-surface2/30">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y text-text divide-border bg-surface font-mono text-sm">
            {items.map((item, idx) => (
              <tr key={idx} className="hover:bg-surface2/50 transition-colors">
                <td className="px-4 py-2 border-r border-border text-text-muted">{item.lineNumber}</td>
                <td className="px-4 py-2 font-sans overflow-hidden text-ellipsis whitespace-nowrap max-w-[300px]" title={item.description}>{item.description}</td>
                <td className="px-4 py-2 text-right bg-surface2/10">{item.quantity ?? '-'}</td>
                <td className="px-4 py-2 bg-surface2/10 border-r border-border text-text-muted">{item.unit ?? ''}</td>
                <td className="px-4 py-2 text-right">{item.unitPrice ? item.unitPrice.toFixed(2) : '-'}</td>
                <td className="px-4 py-2 text-right text-accent/90">{item.lineTotal ? item.lineTotal.toFixed(2) : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4">
        <div className="w-64 text-sm font-mono space-y-2 text-text">
            <div className="flex justify-between p-1">
                <span className="text-text-muted uppercase font-sans text-xs tracking-wider font-semibold">Subtotal</span>
                <span>{currency} {totals.subtotal?.toFixed(2) ?? '0.00'}</span>
            </div>
            {totals.totalTaxAmount ? (
                <div className="flex justify-between p-1">
                <span className="text-text-muted uppercase font-sans text-xs tracking-wider font-semibold">Tax</span>
                <span>{currency} {totals.totalTaxAmount?.toFixed(2) ?? '0.00'}</span>
                </div>
            ) : null}
        </div>
      </div>
    </div>
  );
}
