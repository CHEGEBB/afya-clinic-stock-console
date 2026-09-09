import { WifiOff } from 'lucide-react';

export function OfflineBanner() {
  return (
    <div className="mt-4 flex items-center gap-2 rounded-lg border border-warning-500/30 bg-warning-50 px-3 py-2.5 text-sm text-warning-700">
      <WifiOff className="h-4 w-4 shrink-0" />
      <span>You&apos;re offline. Showing the last loaded results.</span>
    </div>
  );
}
