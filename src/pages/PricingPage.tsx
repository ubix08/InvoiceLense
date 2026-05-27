import { Header } from '../components/layout/Header';

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-bg text-text">
       <Header />
       <main className="max-w-6xl mx-auto px-6 py-24 text-center">
          <h1 className="text-5xl font-bold tracking-tight mb-6">Simple, Transparent Pricing</h1>
          <p className="text-xl text-text-muted mb-16">Pay only for what you process. Secure browser-based extraction.</p>
          
          {/* Using same design concepts as UpgradeModal roughly */}
          <div className="grid md:grid-cols-3 gap-8 text-left">
             <div className="bg-surface border border-border p-8 rounded-xl">
                 <h3 className="text-2xl font-bold mb-2">Free</h3>
                 <p className="text-text-muted mb-6 text-sm">Perfect for testing.</p>
                 <div className="mb-8"><span className="text-4xl font-mono text-white">$0</span></div>
                 <ul className="space-y-4 mb-8 text-sm">
                    <li>5 Lifetime Documents</li>
                    <li>Browser Local Storage</li>
                    <li>JSON & CSV Export</li>
                 </ul>
             </div>
             
             <div className="bg-surface border border-border p-8 rounded-xl">
                 <h3 className="text-2xl font-bold mb-2">Starter</h3>
                 <p className="text-text-muted mb-6 text-sm">For small businesses.</p>
                 <div className="mb-8"><span className="text-4xl font-mono text-white">$19</span><span className="text-text-muted text-sm ml-2">one-time</span></div>
                 <ul className="space-y-4 mb-8 text-sm">
                    <li>500 Pages Quota</li>
                    <li>Batch Uploads</li>
                    <li>Webhook Forwarding</li>
                    <li>Excel (XLSX) Export</li>
                 </ul>
             </div>
             
             <div className="bg-surface border-2 border-accent p-8 rounded-xl relative shadow-[0_0_30px_rgba(245,166,35,0.1)]">
                 <div className="absolute top-0 right-0 bg-accent text-bg text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-bl-lg">Unlimited</div>
                 <h3 className="text-2xl font-bold text-accent mb-2">Pro</h3>
                 <p className="text-text-muted mb-6 text-sm">For high volume teams.</p>
                 <div className="mb-8"><span className="text-4xl font-mono text-white">$49</span><span className="text-text-muted text-sm ml-2">/ month</span></div>
                 <ul className="space-y-4 mb-8 text-sm">
                    <li>Unlimited Processing</li>
                    <li>Google Sheets Direct Sync</li>
                    <li>Priority Queue Allocation</li>
                    <li>Custom Field Extraction</li>
                 </ul>
             </div>
          </div>
       </main>
    </div>
  )
}
