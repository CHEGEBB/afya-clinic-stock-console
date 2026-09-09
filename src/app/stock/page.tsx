// src/app/stock/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { Search, AlertCircle, PackageX, WifiOff } from "lucide-react";
import { AuthGuard } from "@/components/auth-guard";
import { getProducts, getCategories, type Product, type ProductCategory } from "@/services/products";
import { ApiError } from "@/services/api-client";

const LIMIT = 12;

interface UrlState {
  search: string;
  category: string;
  sortBy: string;
  order: "asc" | "desc";
  page: number;
}

function readUrlState(): UrlState {
  if (typeof window === "undefined") {
    return { search: "", category: "", sortBy: "title", order: "asc", page: 1 };
  }
  const params = new URLSearchParams(window.location.search);
  return {
    search: params.get("q") ?? "",
    category: params.get("category") ?? "",
    sortBy: params.get("sortBy") ?? "title",
    order: (params.get("order") as "asc" | "desc") ?? "asc",
    page: Number(params.get("page")) || 1,
  };
}

function StockPageContent() {
  const router = useRouter();
  const pathname = usePathname();

  const [urlState, setUrlState] = useState<UrlState>(readUrlState);
  const [searchInput, setSearchInput] = useState(urlState.search);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "empty" | "error">("loading");
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  // Re-sync state from the URL on browser back/forward navigation.
  useEffect(() => {
    function handlePopState() {
      setUrlState(readUrlState());
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function updateUrl(next: Partial<UrlState>) {
    const merged: UrlState = { ...urlState, ...next };
    const params = new URLSearchParams();
    if (merged.search) params.set("q", merged.search);
    if (merged.category) params.set("category", merged.category);
    params.set("sortBy", merged.sortBy);
    params.set("order", merged.order);
    params.set("page", String(merged.page));

    router.push(`${pathname}?${params.toString()}`);
    setUrlState(merged);
  }

  // Debounce search input -> URL.
  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchInput !== urlState.search) {
        updateUrl({ search: searchInput, page: 1 });
      }
    }, 400);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run on searchInput changes; including updateUrl/urlState would retrigger this on every URL change, defeating the debounce.
  }, [searchInput]);

  // Fetch categories once.
  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  // Fetch products whenever URL state changes. AbortController guards
  // against a slow, stale response overwriting a newer one.
 useEffect(() => {
  const controller = new AbortController();
  // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting to a loading state at the start of a data-fetch effect is the standard pattern; the alternative (deriving loading from a separate promise-tracking state) adds complexity without changing behavior here.
  setStatus("loading");
  setErrorStatus(null);

    getProducts({
      limit: LIMIT,
      skip: (urlState.page - 1) * LIMIT,
      sortBy: urlState.sortBy,
      order: urlState.order,
      category: urlState.category || null,
      search: urlState.search || null,
    })
      .then((data) => {
        if (controller.signal.aborted) return;
        setProducts(data.products);
        setTotal(data.total);
        setStatus(data.products.length === 0 ? "empty" : "success");
      })
      .catch((err) => {
        if (controller.signal.aborted) return;
        setStatus("error");
        setErrorStatus(err instanceof ApiError ? err.status : null);
      });

    return () => controller.abort();
  }, [urlState.search, urlState.category, urlState.sortBy, urlState.order, urlState.page]);

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));
  const isOffline = typeof navigator !== "undefined" && !navigator.onLine;

  const handleRetry = useCallback(() => {
    setUrlState((s) => ({ ...s }));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-8">
      <h1 className="text-2xl font-semibold text-text-primary">Stock List</h1>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-secondary" />
          <input
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search stock..."
            aria-label="Search stock"
            className="w-full rounded-lg border border-border bg-surface py-2.5 pl-9 pr-3 text-text-primary focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <select
          value={urlState.category}
          onChange={(e) => updateUrl({ category: e.target.value, page: 1 })}
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
          value={`${urlState.sortBy}-${urlState.order}`}
          onChange={(e) => {
            const [sortBy, order] = e.target.value.split("-") as [string, "asc" | "desc"];
            updateUrl({ sortBy, order, page: 1 });
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

      {isOffline && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-warning-500/30 bg-warning-50 px-3 py-2.5 text-sm text-warning-700">
          <WifiOff className="h-4 w-4 shrink-0" />
          <span>You&apos;re offline. Showing the last loaded results.</span>
        </div>
      )}

      {status === "loading" && (
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="animate-pulse rounded-lg border border-border bg-surface p-4">
              <div className="h-32 w-full rounded bg-border" />
              <div className="mt-3 h-4 w-3/4 rounded bg-border" />
              <div className="mt-2 h-3 w-1/2 rounded bg-border" />
            </div>
          ))}
        </div>
      )}

      {status === "empty" && (
        <div className="mt-10 flex flex-col items-center justify-center gap-2 py-12 text-center">
          <PackageX className="h-10 w-10 text-text-secondary" />
          <p className="font-medium text-text-primary">No items found</p>
          <p className="text-sm text-text-secondary">Try a different search or category.</p>
        </div>
      )}

      {status === "error" && (
        <div className="mt-10 flex flex-col items-center justify-center gap-3 py-12 text-center">
          <AlertCircle className="h-10 w-10 text-error-500" />
          <p className="font-medium text-text-primary">
            {errorStatus === 500
              ? "Something went wrong on the server."
              : "Couldn't load stock. Check your connection."}
          </p>
          <button
            onClick={handleRetry}
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-700"
          >
            Retry
          </button>
        </div>
      )}

      {status === "success" && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/items/${product.id}`}
                className="rounded-lg border border-border bg-surface p-4 transition hover:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <p className="font-medium text-text-primary">{product.title}</p>
                <p className="mt-1 text-sm capitalize text-text-secondary">
                  {product.category.replace("-", " ")}
                </p>
                <p className="mt-2 text-sm text-brand-700">Stock: {product.stock}</p>
              </Link>
            ))}
          </div>

          <div className="mt-6 flex items-center justify-between">
            <button
              onClick={() => updateUrl({ page: urlState.page - 1 })}
              disabled={urlState.page <= 1}
              className="rounded-lg border border-border px-3 py-2 text-sm text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-text-secondary">
              Page {urlState.page} of {totalPages}
            </span>
            <button
              onClick={() => updateUrl({ page: urlState.page + 1 })}
              disabled={urlState.page >= totalPages}
              className="rounded-lg border border-border px-3 py-2 text-sm text-text-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default function StockPage() {
  return (
    <AuthGuard>
      <StockPageContent />
    </AuthGuard>
  );
}