export interface StockUrlState {
  search: string;
  category: string;
  sortBy: string;
  order: "asc" | "desc";
  page: number;
}

export function parseStockUrlState(search: string): StockUrlState {
  const params = new URLSearchParams(search);
  return {
    search: params.get("q") ?? "",
    category: params.get("category") ?? "",
    sortBy: params.get("sortBy") ?? "title",
    order: (params.get("order") as "asc" | "desc") ?? "asc",
    page: Number(params.get("page")) || 1,
  };
}