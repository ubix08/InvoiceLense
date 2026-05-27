import { Zap, Check, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { useQuotaStore, Tier } from '../../store/useQuotaStore';

export function UpgradeModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { upgradeTo } = useQuotaStore();

  if (!isOpen) return null;

  const handleUpgrade = (tier: Tier) => {
      // Stub for real payment processing.
      upgradeTo(tier);
      onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-bg/80 backdrop-blur-sm p-4">
      <div className="bg-surface border border-border rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 border-b border-border flex justify-between items-center">
            <div>
                <h2 className="text-2xl font-bold flex items-center gap-2"><Zap className="text-accent w-6 h-6"/> Upgrade your plan</h2>
                <p className="text-text-muted mt-1 text-sm">Unlock bulk processing, webhooks, and advanced exports.</p>
            </div>
            <button onClick={onClose} className="text-text-muted hover:text-text"><X className="w-5 h-5"/></button>
        </div>
        
        <div className="grid md:grid-cols-2 p-6 gap-6 bg-surface2/30">
           {/* Starter Tier */}
           <div className="bg-surface border border-border rounded-lg p-6 relative">
              <h3 className="text-lg font-bold">Starter</h3>
              <div className="my-4">
                 <span className="text-3xl font-mono text-white">$19</span>
                 <span className="text-text-muted text-sm ml-1">one-time</span>
              </div>
              <ul className="space-y-3 mb-6 text-sm">
                 <li className="flex gap-2"><Check className="w-4 h-4 text-success"/> 500 pages processed</li>
                 <li className="flex gap-2"><Check className="w-4 h-4 text-success"/> XLSX Exports</li>
                 <li className="flex gap-2"><Check className="w-4 h-4 text-success"/> Webhook JSON forwarding</li>
                 <li className="flex gap-2"><Check className="w-4 h-4 text-success"/> Batch upload multiple files</li>
              </ul>
              <Button className="w-full" onClick={() => handleUpgrade('starter')}>Buy Starter</Button>
           </div>
           
           {/* Pro Tier */}
           <div className="bg-surface border-2 border-accent rounded-lg p-6 relative shadow-[0_0_20px_rgba(245,166,35,0.15)]">
              <div className="absolute top-0 right-0 bg-accent text-bg text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-bl-lg">Unlimited</div>
              <h3 className="text-lg font-bold text-accent">Pro</h3>
              <div className="my-4">
                 <span className="text-3xl font-mono text-white">$49</span>
                 <span className="text-text-muted text-sm ml-1">/ month</span>
              </div>
              <ul className="space-y-3 mb-6 text-sm">
                 <li className="flex gap-2"><Check className="w-4 h-4 text-success"/> Unlimited pages</li>
                 <li className="flex gap-2"><Check className="w-4 h-4 text-success"/> Everything in Starter</li>
                 <li className="flex gap-2"><Check className="w-4 h-4 text-success"/> Google Sheets direct sync</li>
                 <li className="flex gap-2"><Check className="w-4 h-4 text-success"/> Priority processing queue</li>
              </ul>
              <Button className="w-full bg-accent text-bg hover:bg-accent-dim" onClick={() => handleUpgrade('pro')}>Subscribe Pro</Button>
           </div>
        </div>
      </div>
    </div>
  );
}
