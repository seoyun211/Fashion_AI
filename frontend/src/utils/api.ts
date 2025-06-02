import { Product, TimeSeriesData, FilterOptions, ProductList, TrendReport, SalesReport, ProductFilter, APIError } from '@/types';

const API_BASE_URL = 'http://localhost:8000/api';

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error: APIError = await response.json();
        throw new Error(error.error.message);
    }
    return response.json();
}

export async function getTrendReport(): Promise<TrendReport> {
    const response = await fetch(`${API_BASE_URL}/trends/report`);
    return handleResponse<TrendReport>(response);
}

export async function getProductsByShop(
    shop: string,
    filter?: ProductFilter
): Promise<ProductList> {
    const params = new URLSearchParams();
    if (filter) {
        Object.entries(filter).forEach(([key, value]) => {
            if (value !== undefined) {
                params.append(key, value.toString());
            }
        });
    }

    const url = `${API_BASE_URL}/products/${shop}${
        params.toString() ? `?${params.toString()}` : ''
    }`;
    const response = await fetch(url);
    return handleResponse<ProductList>(response);
}

export async function getTrendingProducts(limit: number = 10): Promise<ProductList> {
    const response = await fetch(`${API_BASE_URL}/products/trending/${limit}`);
    return handleResponse<ProductList>(response);
}

export async function getProductSales(
    productName: string,
    days: number = 30
): Promise<SalesReport> {
    const response = await fetch(
        `${API_BASE_URL}/sales/${encodeURIComponent(productName)}?days=${days}`
    );
    return handleResponse<SalesReport>(response);
}

// 상수 데이터
export const VALID_SHOPS = ['무신사', '지그재그', '더블유컨셉', '29CM'];
export const CATEGORIES = ['상의', '하의', '원피스', '아우터'];
export const STYLES = ['캐주얼', '스트릿', '미니멀', '러블리', '빈티지', '스포티', '클래식', '모던'];
export const COLORS = ['블랙', '화이트', '네이비', '베이지', '그레이', '브라운', '카키', '레드', '블루'];
export const SEASONS = ['봄', '여름', '가을', '겨울', '사계절'];

export async function fetchProducts(filters?: FilterOptions): Promise<Product[]> {
  const queryParams = filters ? `?${new URLSearchParams(Object.entries(filters).reduce((acc, [key, value]) => {
    if (value !== undefined) {
      acc[key] = String(value);
    }
    return acc;
  }, {} as Record<string, string>))}` : '';
  
  const response = await fetch(`${API_BASE_URL}/products${queryParams}`);
  if (!response.ok) {
    throw new Error('상품 데이터를 불러오는데 실패했습니다.');
  }
  return response.json();
}

export async function fetchTimeSeriesData(productId: string): Promise<TimeSeriesData[]> {
  const response = await fetch(`${API_BASE_URL}/timeseries/${productId}`);
  if (!response.ok) {
    throw new Error('시계열 데이터를 불러오는데 실패했습니다.');
  }
  return response.json();
}

export async function fetchTrendData(): Promise<{
  salesTrend: TimeSeriesData[];
  stockTrend: TimeSeriesData[];
}> {
  const response = await fetch(`${API_BASE_URL}/trends`);
  if (!response.ok) {
    throw new Error('트렌드 데이터를 불러오는데 실패했습니다.');
  }
  return response.json();
}

export async function fetchFilterOptions(): Promise<{
  categories: string[];
  styles: string[];
  materials: string[];
  colors: string[];
  seasons: string[];
}> {
  const response = await fetch(`${API_BASE_URL}/filter-options`);
  if (!response.ok) {
    throw new Error('필터 옵션을 불러오는데 실패했습니다.');
  }
  return response.json();
} 