export function ProgressBar({ progress, className }: { progress: number, className?: string }) {
  return (
    <div className={`h-1.5 w-full bg-surface2 rounded-full overflow-hidden ${className || ''}`}>
      <div 
        className="h-full bg-accent transition-all duration-300 ease-out" 
        style={{ width: `${Math.max(0, Math.min(100, progress))}%` }} 
      />
    </div>
  );
}
