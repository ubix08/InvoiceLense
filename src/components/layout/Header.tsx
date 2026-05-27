import { Link } from 'react-router-dom';
import { Settings } from 'lucide-react';
import { Badge } from '../ui/Badge';
import { useQuotaStore } from '../../store/useQuotaStore';

export function Header({ onOpenSettings }: { onOpenSettings?: () => void }) {
  const { tier } = useQuotaStore();

  return (
    <header className="h-14 border-b border-border bg-surface flex items-center px-6 sticky top-0 z-40">
      <Link to="/" className="flex items-center gap-2 font-bold text-lg tracking-tight">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2"/>
          <path d="M8 12H16M8 8H16M8 16H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
          <rect x="7" y="2" width="1" height="2" fill="var(--color-accent)"/>
          <rect x="11" y="2" width="1" height="2" fill="var(--color-accent)"/>
          <rect x="15" y="2" width="1" height="2" fill="var(--color-accent)"/>
        </svg>
        <span>Invoice<span className="text-accent">Lens</span></span>
      </Link>
      
      <div className="flex-1" />

      <nav className="flex items-center gap-6 text-sm font-medium mr-6">
        <Link to="/app" className="hover:text-accent transition-colors">App</Link>
        <Link to="/pricing" className="hover:text-accent transition-colors text-text-muted">Pricing</Link>
        <Link to="/docs" className="hover:text-accent transition-colors text-text-muted">Docs</Link>
      </nav>

      <div className="flex items-center gap-3">
        <Badge variant={tier === 'pro' ? 'success' : tier === 'starter' ? 'info' : 'default'} className="uppercase">
          {tier}
        </Badge>
        {onOpenSettings && (
          <button onClick={onOpenSettings} className="p-2 hover:bg-surface2 rounded text-text-muted hover:text-text transition-colors">
            <Settings className="w-5 h-5" />
          </button>
        )}
      </div>
    </header>
  );
}
