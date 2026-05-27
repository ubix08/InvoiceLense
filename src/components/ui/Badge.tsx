import React from 'react';
import { cn } from '../../lib/utils';

export function Badge({ children, variant = 'default', className }: { children: React.ReactNode, variant?: 'default'|'success'|'warning'|'error'|'info'|'outline', className?: string }) {
  return (
    <span className={cn(
      "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider",
      {
        'bg-surface2 text-text-muted': variant === 'default',
        'bg-success/10 text-success': variant === 'success',
        'bg-warning/10 text-warning': variant === 'warning',
        'bg-error/10 text-error': variant === 'error',
        'bg-info/10 text-info': variant === 'info',
        'border border-border text-text-muted': variant === 'outline'
      },
      className
    )}>
      {children}
    </span>
  );
}
