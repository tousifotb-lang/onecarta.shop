export interface Product {
  _id: string;
  name: string;
  title?: string;
  slug: string;
  description: string;
  price: number;
  originalPrice: number;
  discountPrice?: number;
  discount: number;
  images: (string | { url: string })[];
  category: string;
  brand: string;
  stock: number;
  sold: number;
  rating: number;
  reviewCount: number;
  tags: string[];
  isActive: boolean;
  status?: string;
  isFeatured: boolean;
  isFlashSale: boolean;
  flashSalePrice?: number;
  flashSaleEnds?: string;
  createdAt: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
}

export interface FilterState {
  category: string;
  minPrice: string;
  maxPrice: string;
  brand: string;
  sort: string;
  order: string;
  search: string;
  tag: string;
}