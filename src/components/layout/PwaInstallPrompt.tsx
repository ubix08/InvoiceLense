import { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { Button } from '../ui/Button';

export function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferredPrompt) return null;

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  return (
     <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-surface border border-accent rounded-lg shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-bottom duration-300 flex flex-col gap-3">
         <div className="flex justify-between items-start">
             <h3 className="font-bold text-text">Install InvoiceLens</h3>
             <button onClick={() => setDeferredPrompt(null)} className="text-text-muted hover:text-text">
                 <X className="w-5 h-5"/>
             </button>
         </div>
         <p className="text-sm text-text-muted">Install this app on your device for fast, offline-capable access to document OCR.</p>
         <Button onClick={handleInstall} className="w-full flex items-center justify-center gap-2">
             <Download className="w-4 h-4" /> Install App
         </Button>
     </div>
  );
}
