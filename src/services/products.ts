import { apiRequest } from './api-client';

export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  thumbnail: string;
  images: string[];
}

export interface ProductListResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface ProductCategory {
  slug: string;
  name: string;
  url: string;
}

export interface GetProductsParams {
  limit?: number;
  skip?: number;
  sortBy?: string;
  order?: 'asc' | 'desc';
  category?: string | null;
  search?: string | null;
}

export async function getProducts(params: GetProductsParams): Promise<ProductListResponse> {
  const { limit = 12, skip = 0, sortBy, order, category, search } = params;

  const query = new URLSearchParams();
  query.set('limit', String(limit));
  query.set('skip', String(skip));
  if (sortBy) query.set('sortBy', sortBy);
  if (order) query.set('order', order);

  // Search and category-browse are separate DummyJSON endpoints.
  // Decision: if a search query is present, it takes priority over the
  // category filter (search wins), since DummyJSON's /products/search
  // does not accept a category param. Documented in the README decision log.
  if (search) {
    query.set('q', search);
    return apiRequest<ProductListResponse>(`/products/search?${query.toString()}`);
  }

  if (category) {
    return apiRequest<ProductListResponse>(`/products/category/${category}?${query.toString()}`);
  }

  return apiRequest<ProductListResponse>(`/products?${query.toString()}`);
}

export async function getCategories(): Promise<ProductCategory[]> {
  return apiRequest<ProductCategory[]>('/products/categories');
}

export async function getProduct(id: string | number): Promise<Product> {
  return apiRequest<Product>(`/products/${id}`);
}

export async function updateStock(id: string | number, stock: number): Promise<Product> {
  return apiRequest<Product>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ stock }),
  });
}
