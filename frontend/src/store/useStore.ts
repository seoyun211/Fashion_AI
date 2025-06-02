import { create } from 'zustand';
import { Product, TimeSeriesData, FilterOptions } from '@/types';
import { fetchProducts, fetchTrendData, fetchFilterOptions } from '@/utils/api';

interface StoreState {
  products: Product[];
  trendData: {
    salesTrend: TimeSeriesData[];
    stockTrend: TimeSeriesData[];
  };
  filterOptions: {
    categories: string[];
    styles: string[];
    materials: string[];
    colors: string[];
    seasons: string[];
  };
  filters: FilterOptions;
  loading: boolean;
  error: string | null;

  // Actions
  setProducts: (products: Product[]) => void;
  setTrendData: (trendData: { salesTrend: TimeSeriesData[]; stockTrend: TimeSeriesData[] }) => void;
  setFilterOptions: (options: StoreState['filterOptions']) => void;
  setFilters: (filters: FilterOptions) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Async Actions
  fetchInitialData: () => Promise<void>;
  fetchFilteredProducts: (filters: FilterOptions) => Promise<void>;
}

const createStore = create<StoreState>((set) => ({
  products: [],
  trendData: {
    salesTrend: [],
    stockTrend: [],
  },
  filterOptions: {
    categories: [],
    styles: [],
    materials: [],
    colors: [],
    seasons: [],
  },
  filters: {},
  loading: true,
  error: null,

  // Actions
  setProducts: (products: Product[]) => set({ products }),
  setTrendData: (trendData: { salesTrend: TimeSeriesData[]; stockTrend: TimeSeriesData[] }) => set({ trendData }),
  setFilterOptions: (filterOptions: StoreState['filterOptions']) => set({ filterOptions }),
  setFilters: (filters: FilterOptions) => set({ filters }),
  setLoading: (loading: boolean) => set({ loading }),
  setError: (error: string | null) => set({ error }),

  // Async Actions
  fetchInitialData: async () => {
    try {
      set({ loading: true, error: null });
      const [productsData, trendData, filterOptionsData] = await Promise.all([
        fetchProducts(),
        fetchTrendData(),
        fetchFilterOptions(),
      ]);

      set({
        products: productsData,
        trendData,
        filterOptions: filterOptionsData,
        loading: false,
      });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '데이터를 불러오는데 실패했습니다.',
        loading: false,
      });
    }
  },

  fetchFilteredProducts: async (filters: FilterOptions) => {
    try {
      set({ loading: true, error: null });
      const productsData = await fetchProducts(filters);
      set({ products: productsData, loading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : '상품을 필터링하는데 실패했습니다.',
        loading: false,
      });
    }
  },
}));

const useStore = createStore;
export default useStore; 