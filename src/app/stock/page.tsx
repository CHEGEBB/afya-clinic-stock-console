"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { AuthGuard } from "@/components/auth-guard";
import { SearchFilterBar } from "@/components/stock/search-filter-bar";
import { StockItemCard } from "@/components/stock/stock-item-card";
import { Pagination } from "@/components/stock/pagination";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { OfflineBanner } from "@/components/ui/offline-banner";
import { getProducts, getCategories, type Product, type ProductCategory } from "@/services/products";
import { ApiError } from "@/services/api-client";
import { parseStockUrlState, type StockUrlState } from "@/lib/url-state";

const LIMIT = 12;

function readUrlState(): StockUrlState {
  if (typeof window === "undefined") {
    return { search: "", category: "", sortBy: "title", order: "asc", page: 1 };
  }
  return parseStockUrlState(window.location.search);
}

function StockPageContent() {
  const router = useRouter();
  const pathname = usePathname();

  const [urlState, setUrlState] = useState<StockUrlState>(readUrlState);
  const [searchInput, setSearchInput] = useState(urlState.search);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [status, setStatus] = useState<"loading" | "success" | "empty" | "error">("loading");
  const [errorStatus, setErrorStatus] = useState<number | null>(null);

  useEffect(() => {
    function handlePopState() {
      setUrlState(readUrlState());
    }
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  function updateUrl(next: Partial<StockUrlState>) {
    const merged: StockUrlState = { ...urlState, ...next };
    const params = new URLSearchParams();
    if (merged.search) params.set("q", merged.search);
    if (merged.category) params.set("category", merged.category);
    params.set("sortBy", merged.sortBy);
    params.set("order", merged.order);
    params.set("page", String(merged.page));

    router.push(`${pathname}?${params.toString()}`);
    setUrlState(merged);
  }

  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchInput !== urlState.search) {
        updateUrl({ search: searchInput, page: 1 });
      }
    }, 400);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run on searchInput changes; including updateUrl/urlState would retrigger this on every URL change, defeating the debounce.
  }, [searchInput]);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

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

      <SearchFilterBar
        searchInput={searchInput}
        onSearchChange={setSearchInput}
        category={urlState.category}
        onCategoryChange={(category) => updateUrl({ category, page: 1 })}
        sortBy={urlState.sortBy}
        order={urlState.order}
        onSortChange={(sortBy, order) => updateUrl({ sortBy, order, page: 1 })}
        categories={categories}
      />

      {isOffline && <OfflineBanner />}

      {status === "loading" && <LoadingSkeleton />}
      {status === "empty" && <EmptyState />}
      {status === "error" && <ErrorState status={errorStatus} onRetry={handleRetry} />}

      {status === "success" && (
        <>
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <StockItemCard key={product.id} product={product} />
            ))}
          </div>
          <Pagination
            page={urlState.page}
            totalPages={totalPages}
            onPageChange={(page) => updateUrl({ page })}
          />
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