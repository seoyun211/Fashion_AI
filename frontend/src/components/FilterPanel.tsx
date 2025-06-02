import { useState } from 'react';
import { FilterPanelProps, FilterOptions } from '@/types';

export default function FilterPanel({
  categories,
  styles,
  materials,
  colors,
  seasons,
  onFilterChange
}: FilterPanelProps) {
  const [filters, setFilters] = useState<FilterOptions>({});

  const handleFilterChange = (key: keyof FilterOptions, value: string | number | undefined) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4">필터</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">카테고리</label>
          <select
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2"
            value={filters.category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value || undefined)}
          >
            <option value="">전체</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">스타일</label>
          <select
            className="w-full rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2"
            value={filters.style || ''}
            onChange={(e) => handleFilterChange('style', e.target.value || undefined)}
          >
            <option value="">전체</option>
            {styles.map(style => (
              <option key={style} value={style}>{style}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">가격 범위</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              className="w-1/2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2"
              value={filters.minPrice || ''}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : undefined;
                handleFilterChange('minPrice', value);
              }}
              placeholder="최소 가격"
            />
            <span>~</span>
            <input
              type="number"
              className="w-1/2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 p-2"
              value={filters.maxPrice || ''}
              onChange={(e) => {
                const value = e.target.value ? Number(e.target.value) : undefined;
                handleFilterChange('maxPrice', value);
              }}
              placeholder="최대 가격"
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {seasons.map(season => (
            <button
              key={season}
              className={`px-3 py-1 rounded-full text-sm ${
                filters.season === season
                  ? 'bg-primary text-white'
                  : 'bg-gray-100 dark:bg-gray-700'
              }`}
              onClick={() => handleFilterChange('season', filters.season === season ? undefined : season)}
            >
              {season}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
} 