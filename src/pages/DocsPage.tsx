import { Header } from '../components/layout/Header';

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-bg text-text">
       <Header />
       <main className="max-w-4xl mx-auto px-6 py-20">
          <h1 className="text-4xl font-bold mb-8">Documentation</h1>
          
          <div className="prose prose-invert prose-orange max-w-none">
             <h3>How It Works</h3>
             <p>InvoiceLens relies entirely on your browser's computational power to extract data. This ensures absolute privacy.</p>
             <ol>
                 <li><strong>Image Preprocessing:</strong> Contracts, resizes, and binarizes your document via an OffscreenCanvas.</li>
                 <li><strong>Layout Inference:</strong> Downloads a ~40MB ONNX Runtime model (cached locally) to pinpoint bounding boxes.</li>
                 <li><strong>Local OCR:</strong> Tesseract.js runs inside Web Workers (utilizing SIMD where supported) to extract text precisely.</li>
             </ol>
             
             <h3>Webhook Integration</h3>
             <p>You can configure InvoiceLens to POST JSON results sequentially to your webhooks.</p>
             <pre className="bg-[#0a0a0f] p-4 rounded font-mono text-sm border border-border">
{`{
  "schemaVersion": "1.0",
  "extractedAt": "...",
  "header": { ... },
  "lineItems": [ ... ]
}`}
             </pre>
          </div>
       </main>
    </div>
  )
}
