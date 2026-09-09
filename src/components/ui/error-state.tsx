import { AlertCircle } from 'lucide-react';

interface ErrorStateProps {
  status: number | null;
  onRetry: () => void;
}

export function ErrorState({ status, onRetry }: ErrorStateProps) {
  return (
    <div className="mt-10 flex flex-col items-center justify-center gap-3 py-12 text-center">
      <AlertCircle className="h-10 w-10 text-error-500" />
      <p className="font-medium text-text-primary">
        {status === 500
          ? 'Something went wrong on the server.'
          : "Couldn't load stock. Check your connection."}
      </p>
      <button
        onClick={onRetry}
        className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
      >
        Retry
      </button>
    </div>
  );
}
