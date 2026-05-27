import { Header } from '../components/layout/Header';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function BulkExpenseScannerPage() {
  return (
    <div className="min-h-screen bg-bg text-text">
       <Header />
       <main className="max-w-5xl mx-auto px-6 py-24 text-center">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight">
             Bulk Expense Scanner Built for Accounting Teams
          </h1>
          <p className="text-xl text-text-muted mb-12 max-w-2xl mx-auto">
             Scan and parse 500+ receipts and invoices in bulk. Export to Excel, sync with Google Sheets, or send via webhook. Browser-based, GDPR-safe, no backend.
          </p>
          <div className="flex gap-4 justify-center">
             <Link to="/app"><Button size="lg" className="w-48">Try Web App</Button></Link>
             <Link to="/pricing"><Button size="lg" variant="outline" className="w-48">View Pricing</Button></Link>
          </div>
          
          <div className="mt-24 border border-border rounded-xl bg-surface p-8">
             <h2 className="text-2xl font-bold mb-8">Works With All Documents</h2>
             <div className="grid md:grid-cols-3 gap-6 text-left">
                <div className="p-4 border border-border rounded bg-surface2">
                   <h3 className="font-bold mb-2">Scanned PDFs</h3>
                   <p className="text-sm text-text-muted">Multi-page PDFs from flatbed scanners are instantly converted to high-DPI images for accurate OCR.</p>
                </div>
                <div className="p-4 border border-border rounded bg-surface2">
                   <h3 className="font-bold mb-2">Thermal Receipts</h3>
                   <p className="text-sm text-text-muted">Faded thermal POS receipts are processed through dynamic contrast enhancement algorithms.</p>
                </div>
                <div className="p-4 border border-border rounded bg-surface2">
                   <h3 className="font-bold mb-2">Smartphone Photos</h3>
                   <p className="text-sm text-text-muted">Handles shadows, skewed perspectives, and uneven lighting using document layout analysis.</p>
                </div>
             </div>
          </div>
       </main>
    </div>
  )
}
