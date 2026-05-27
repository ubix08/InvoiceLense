import { useQuotaStore } from '../../store/useQuotaStore';
import { Button } from '../ui/Button';

export function QuotaBanner({ onUpgradeClick }: { onUpgradeClick: () => void }) {
  const { tier, docsUsed, pagesUsed, pagesAllowed } = useQuotaStore();

  if (tier === 'pro') return null;

  const used = tier === 'free' ? docsUsed : pagesUsed;
  const total = pagesAllowed;
  const percentage = (used / total) * 100;
  const isNearLimit = percentage > 80;

  return (
    <div className={`p-4 rounded-lg border ${isNearLimit ? 'bg-warning/10 border-warning/30' : 'bg-surface2 border-border'} mt-4`}>
       <div className="flex justify-between items-center mb-2">
           <span className="text-sm font-semibold uppercase tracking-wider text-text-muted">
               {tier === 'free' ? 'Lifetime Quota' : 'Monthly Quota'}
           </span>
           <span className="text-sm font-mono text-text">
               {used} / {total}
           </span>
       </div>
       <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden mb-3">
          <div 
             className={`h-full ${isNearLimit ? 'bg-warning' : 'bg-accent'}`} 
             style={{ width: `${percentage}%` }}
          />
       </div>
       {isNearLimit && tier === 'free' && (
          <Button size="sm" variant="outline" className="w-full text-xs text-warning border-warning/50 hover:bg-warning/10" onClick={onUpgradeClick}>
             Upgrade to process more
          </Button>
       )}
    </div>
  );
}
