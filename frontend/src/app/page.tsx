'use client';

import { useEffect } from 'react';
import TrendChart from '@/components/TrendChart';
import ProductCard from '@/components/ProductCard';
import FilterPanel from '@/components/FilterPanel';
import { FilterOptions, Product } from '@/types';
import useStore from '@/store/useStore';

export default function Home() {
  const {
    products,
    trendData,
    filterOptions,
    loading,
    error,
    fetchInitialData,
    fetchFilteredProducts
  } = useStore();

  useEffect(() => {
    fetchInitialData();
  }, [fetchInitialData]);

  const handleFilterChange = (newFilters: FilterOptions) => {
    fetchFilteredProducts(newFilters);
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">오류 발생</h2>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center mb-8">
          Fashion AI
        </h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <FilterPanel
              {...filterOptions}
              onFilterChange={handleFilterChange}
            />
          </div>
          
          <div className="lg:col-span-3 space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <TrendChart data={trendData.salesTrend} type="sales" />
              <TrendChart data={trendData.stockTrend} type="stock" />
            </div>
            
            {loading ? (
              <div className="flex justify-center items-center min-h-[200px]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product: Product, index: number) => (
                  <ProductCard key={index} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
