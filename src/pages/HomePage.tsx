import React from 'react';
import { Header } from '../components/layout/Header';
import { Button } from '../components/ui/Button';
import { Link } from 'react-router-dom';
import { Zap, ShieldCheck, Cpu } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg text-text">
      <Header />
      <main>
        <section className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">
            Intelligent Document OCR<br/>
            <span className="text-accent">Entirely in Your Browser.</span>
          </h1>
          <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto leading-relaxed">
            Extract structured JSON from invoices and receipts instantly. 
            Powered by WebAssembly and ONNX Runtime. Zero data leaves your device.
          </p>
          <div className="flex justify-center gap-4">
            <Link to="/app">
               <Button size="lg" className="w-48 text-lg hover:shadow-[0_0_20px_rgba(245,166,35,0.4)]">Launch App</Button>
            </Link>
            <Link to="/docs">
               <Button size="lg" variant="outline" className="w-48 text-lg">Read Docs</Button>
            </Link>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 py-20 pb-32">
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<ShieldCheck className="w-8 h-8 text-accent"/>}
              title="Absolute Privacy"
              description="No servers, no AWS Textract, no Azure Document Intelligence. Everything runs locally in your browser cache."
            />
            <FeatureCard 
              icon={<Cpu className="w-8 h-8 text-accent"/>}
              title="Tesseract + ONNX"
              description="Uses YOLOv10m object detection to map document layouts, followed by SIMD-accelerated Tesseract.js OCR."
            />
            <FeatureCard 
              icon={<Zap className="w-8 h-8 text-accent"/>}
              title="Webhook Ready"
              description="Extract data locally, then push the structured JSON directly into your own ERP or Google Sheets."
            />
          </div>
        </section>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="p-8 rounded-xl bg-surface border border-border">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-text-muted leading-relaxed">{description}</p>
    </div>
  )
}
