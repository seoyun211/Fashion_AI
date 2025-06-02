export interface Product {
  상품명: string;
  가격: string;
  쇼핑몰: string;
  좋아요개수: string;
  이미지: string;
  리뷰수: string;
  스타일: string;
  카테고리: string;
  소재: string;
  색상: string;
  시즌: string;
  출시일: string;
}

export interface TimeSeriesData {
  date: string;
  value: number;
}

export interface FilterOptions {
  category?: string;
  style?: string;
  material?: string;
  color?: string;
  season?: string;
  minPrice?: number;
  maxPrice?: number;
}

export interface ProductList {
  products: Product[];
  total: number;
}

export interface TrendReport {
  salesTrend: TimeSeriesData[];
  stockTrend: TimeSeriesData[];
}

export interface SalesReport {
  daily: TimeSeriesData[];
  weekly: TimeSeriesData[];
  monthly: TimeSeriesData[];
}

export interface ProductFilter {
  category?: string;
  style?: string;
  material?: string;
  color?: string;
  season?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: 'price' | 'likes' | 'reviews';
  order?: 'asc' | 'desc';
}

export interface APIError {
  error: {
    code: string;
    message: string;
  };
}

export interface TrendChartProps {
  data: TimeSeriesData[];
  type: 'sales' | 'stock';
}

export interface ProductCardProps {
  product: Product;
}

export interface FilterPanelProps {
  categories: string[];
  styles: string[];
  materials: string[];
  colors: string[];
  seasons: string[];
  onFilterChange: (filters: FilterOptions) => void;
} 