import { Search } from "lucide-react";
import type { ProductCategory } from "@/services/products";

interface SearchFilterBarProps {
  searchInput: string;
  onSearchChange: (value: string) => void;
  category: string;
  onCategoryChange: (slug: string) => void;
  sortBy: string;
  order: "asc" | "desc";
  onSortChange: (sortBy: string, order: "asc" | "desc") => void;
  categories: ProductCategory[];
}

export function SearchFilterBar({
  searchInput,
  onSearchChange,
  category,
  onCategoryChange,
  sortBy,
  order,
  onSortChange,
  categories,
}: SearchFilterBarProps) {
  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
        <input
          type="text"
          value={searchInput}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search stock..."
          aria-label="Search stock"
          className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
      </div>

      <select
        value={category}
        onChange={(e) => onCategoryChange(e.target.value)}
        aria-label="Filter by category"
        className="rounded-lg border border-border bg-surface px-3 py-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <option value="">All categories</option>
        {categories.map((c) => (
          <option key={c.slug} value={c.slug}>
            {c.name}
          </option>
        ))}
      </select>

      <select
        value={`${sortBy}-${order}`}
        onChange={(e) => {
          const [nextSortBy, nextOrder] = e.target.value.split("-") as [string, "asc" | "desc"];
          onSortChange(nextSortBy, nextOrder);
        }}
        aria-label="Sort order"
        className="rounded-lg border border-border bg-surface px-3 py-2.5 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
      >
        <option value="title-asc">Name (A-Z)</option>
        <option value="title-desc">Name (Z-A)</option>
        <option value="stock-asc">Stock (low-high)</option>
        <option value="stock-desc">Stock (high-low)</option>
        <option value="price-asc">Price (low-high)</option>
        <option value="price-desc">Price (high-low)</option>
      </select>
    </div>
  );
}