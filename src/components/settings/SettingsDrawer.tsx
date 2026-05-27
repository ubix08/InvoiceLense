import { useState } from 'react';
import { useSettingsStore } from '../../store/useSettingsStore';
import { Settings, Save, X } from 'lucide-react';
import { Button } from '../ui/Button';

export function SettingsDrawer({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const { webhookUrl, setWebhookUrl, webhookSecret, setWebhookSecret, sheetsUrl, setSheetsUrl } = useSettingsStore();
  
  const [localWebhook, setLocalWebhook] = useState(webhookUrl);
  const [localSecret, setLocalSecret] = useState(webhookSecret);
  const [localSheets, setLocalSheets] = useState(sheetsUrl);

  if (!isOpen) return null;

  const handleSave = () => {
    setWebhookUrl(localWebhook);
    setWebhookSecret(localSecret);
    setSheetsUrl(localSheets);
    onClose();
  };

  return (
    <div className="fixed inset-y-0 right-0 w-96 bg-surface border-l border-border shadow-2xl z-50 flex flex-col transform transition-transform duration-300">
      <div className="p-4 border-b border-border flex justify-between items-center">
        <h2 className="text-lg font-bold flex items-center gap-2"><Settings className="w-5 h-5"/> Integrations</h2>
        <button onClick={onClose} className="p-1 hover:bg-surface2 rounded text-text-muted hover:text-text">
           <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 flex-1 overflow-y-auto space-y-8">
         <section>
             <h3 className="text-sm font-semibold text-text uppercase tracking-wider mb-4 border-b border-border pb-2">Webhook Config</h3>
             <div className="space-y-4 text-sm">
                <div>
                   <label className="block text-text-muted mb-1 text-xs">Destination URL</label>
                   <input 
                     type="url" 
                     className="w-full bg-bg border border-border rounded p-2 focus:border-accent outline-none font-mono text-xs" 
                     placeholder="https://api.yourdomain.com/incoming"
                     value={localWebhook}
                     onChange={(e) => setLocalWebhook(e.target.value)}
                   />
                </div>
                <div>
                   <label className="block text-text-muted mb-1 text-xs">HMAC Secret (Optional)</label>
                   <input 
                     type="password" 
                     className="w-full bg-bg border border-border rounded p-2 focus:border-accent outline-none font-mono text-xs" 
                     placeholder="super_secret_string"
                     value={localSecret}
                     onChange={(e) => setLocalSecret(e.target.value)}
                   />
                </div>
             </div>
         </section>

         <section>
             <h3 className="text-sm font-semibold text-text uppercase tracking-wider mb-4 border-b border-border pb-2">Google Sheets Sync</h3>
             <div className="space-y-4 text-sm">
                 <p className="text-xs text-text-muted leading-relaxed">
                    Deploy the provided Apps Script template as a Web App and paste the URL here. This allows direct client-side insertion into your Sheets.
                 </p>
                <div>
                   <label className="block text-text-muted mb-1 text-xs">Apps Script Web App URL</label>
                   <input 
                     type="url" 
                     className="w-full bg-bg border border-border rounded p-2 focus:border-accent outline-none font-mono text-xs" 
                     placeholder="https://script.google.com/macros/s/.../exec"
                     value={localSheets}
                     onChange={(e) => setLocalSheets(e.target.value)}
                   />
                </div>
             </div>
         </section>
      </div>

      <div className="p-4 border-t border-border bg-surface2">
         <Button className="w-full" onClick={handleSave}><Save className="w-4 h-4 mr-2"/> Save Configurations</Button>
      </div>

    </div>
  );
}
