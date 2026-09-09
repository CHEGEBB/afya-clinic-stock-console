'use client';

import { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Pencil } from 'lucide-react';
import { AuthGuard } from '@/components/auth-guard';
import { StockCorrectionForm } from '@/components/items/stock-correction-form';
import { ItemDetailSkeleton } from '@/components/items/item-detail-skeleton';
import { SuccessModal } from '@/components/ui/success-modal';
import { ErrorState } from '@/components/ui/error-state';
import { getProduct, type Product } from '@/services/products';
import { ApiError } from '@/services/api-client';

function ItemDetailContent({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showSaved, setShowSaved] = useState(false);
  const [reloadToken, setReloadToken] = useState(0);

  function load() {
    setStatus('loading');
    setErrorStatus(null);
    setReloadToken((token) => token + 1);
  }

  useEffect(() => {
    let cancelled = false;

    async function fetchProduct() {
      try {
        const data = await getProduct(id);
        if (cancelled) return;

        setProduct(data);
        setStatus('success');
      } catch (err) {
        if (cancelled) return;

        setStatus('error');
        setErrorStatus(err instanceof ApiError ? err.status : null);
      }
    }

    fetchProduct();

    return () => {
      cancelled = true;
    };
  }, [id, reloadToken]);

  function handleSaved(newStock: number) {
    setProduct((p) => (p ? { ...p, stock: newStock } : p));
    setIsEditing(false);
    setShowSaved(true);
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-8">
      <Link
        href="/stock"
        className="inline-flex items-center gap-1 text-sm text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to stock list
      </Link>

      {status === 'loading' && <ItemDetailSkeleton />}

      {status === 'error' && <ErrorState status={errorStatus} onRetry={load} />}

      {status === 'success' && product && (
        <div className="mt-6 rounded-lg border border-border bg-surface p-6">
          <h1 className="text-xl font-semibold text-text-primary">{product.title}</h1>
          <p className="mt-1 text-sm capitalize text-text-secondary">
            {product.category.replace('-', ' ')}
          </p>
          <p className="mt-4 text-text-secondary">{product.description}</p>

          <div className="mt-6 flex items-center justify-between border-t border-border pt-4">
            <div>
              <p className="text-sm text-text-secondary">Current stock</p>
              <p className="text-2xl font-semibold text-text-primary">{product.stock}</p>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2 text-sm text-text-primary hover:border-brand-500"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
            )}
          </div>

          {isEditing && (
            <StockCorrectionForm
              productId={product.id}
              currentStock={product.stock}
              onSaved={handleSaved}
              onCancel={() => setIsEditing(false)}
            />
          )}
        </div>
      )}

      {showSaved && (
        <SuccessModal message="Stock count updated." onClose={() => setShowSaved(false)} />
      )}
    </div>
  );
}

export default function ItemDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  return (
    <AuthGuard>
      <ItemDetailContent id={id} />
    </AuthGuard>
  );
}
