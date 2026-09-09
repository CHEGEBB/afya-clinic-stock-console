'use client';

import { useEffect } from 'react';
import { CheckCircle2 } from 'lucide-react';

interface SuccessModalProps {
  message: string;
  onClose: () => void;
}

export function SuccessModal({ message, onClose }: SuccessModalProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 2500);
    return () => clearTimeout(timer);
  }, [onClose]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Success"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="flex flex-col items-center gap-3 rounded-xl bg-surface px-8 py-8 text-center shadow-lg"
      >
        <CheckCircle2 className="h-12 w-12 text-success-500" />
        <p className="font-medium text-text-primary">{message}</p>
      </div>
    </div>
  );
}
