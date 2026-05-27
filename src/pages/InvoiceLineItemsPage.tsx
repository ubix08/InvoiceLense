import { Header } from '../components/layout/Header';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function InvoiceLineItemsPage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-24 text-center">
         <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-8 leading-tight">
            Extract Invoice Line Items to CSV — Instantly, In Your Browser
         </h1>
         <p className="text-xl text-text-muted mb-12 max-w-2xl mx-auto">
            Upload any invoice image or PDF. InvoiceLens uses browser-based OCR to extract line items, quantities, prices and tax into a clean CSV. No signup. Runs locally.
         </p>
         <Link to="/app">
             <Button size="lg" className="w-64">Start Extracting for Free</Button>
         </Link>
         
         <div className="mt-24 text-left grid md:grid-cols-2 gap-12 items-center">
            <div>
               <h2 className="text-3xl font-bold mb-4">Privacy First</h2>
               <p className="text-text-muted leading-relaxed">
                  Unlike traditional cloud APIs, InvoiceLens never transmits your sensitive documents over the network. The OCR processing happens directly inside your browser cache.
               </p>
            </div>
            <div className="bg-surface border border-border p-6 rounded-lg text-sm font-mono text-text-muted">
               [LOCAL BROWSER RUNTIME]<br/>
               &gt; init Tesseract.js WASM...<br/>
               &gt; loading layout-classifier.onnx...<br/>
               &gt; converting PDF to ImageBlob...<br/>
               &gt; parsing line items via Regex Heuristics...
            </div>
         </div>
      </main>
    </div>
  );
}
