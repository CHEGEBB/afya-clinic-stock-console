import Link from 'next/link';
import type { Product } from '@/services/products';

export function StockItemCard({ product }: { product: Product }) {
  return (
    <Link
      href={`/items/${product.id}`}
      className="rounded-lg border border-border bg-surface p-4 transition hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
    >
      <p className="font-medium text-text-primary">{product.title}</p>
      <p className="mt-1 text-sm capitalize text-text-secondary">
        {product.category.replace('-', ' ')}
      </p>
      <p className="mt-2 text-sm text-brand-700">Stock: {product.stock}</p>
    </Link>
  );
}
