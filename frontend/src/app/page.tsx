'use client';

import { useState } from 'react';
import TrendChart from '@/components/TrendChart';
import ProductCard from '@/components/ProductCard';
import FilterPanel from '@/components/FilterPanel';
import { Product, FilterOptions } from '@/types';

// 임시 데이터
const dummyTimeSeriesData = Array.from({ length: 30 }, (_, i) => ({
  상품명: '테스트 상품',
  날짜: new Date(Date.now() - i * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  판매량: Math.floor(Math.random() * 100),
  재고량: Math.floor(Math.random() * 1000)
}));

const dummyProduct: Product = {
  상품명: '오버핏 티셔츠',
  가격: '29,000',
  쇼핑몰: '무신사',
  좋아요개수: '1,234',
  이미지: 'https://via.placeholder.com/300',
  리뷰수: '256',
  스타일: '캐주얼',
  카테고리: '상의',
  소재: '면',
  색상: '블랙',
  시즌: '사계절',
  출시일: '2024-01-01'
};

const filterOptions = {
  categories: ['상의', '하의', '원피스', '아우터'],
  styles: ['캐주얼', '스트릿', '미니멀', '러블리'],
  materials: ['면', '린넨', '데님', '실크'],
  colors: ['블랙', '화이트', '네이비', '베이지'],
  seasons: ['봄', '여름', '가을', '겨울', '사계절']
};

export default function Home() {
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleFilterChange = (newFilters: FilterOptions) => {
    setFilters(newFilters);
    console.log('필터 변경:', newFilters);
  };

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
              <TrendChart data={dummyTimeSeriesData} type="sales" />
              <TrendChart data={dummyTimeSeriesData} type="stock" />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <ProductCard key={i} product={dummyProduct} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
