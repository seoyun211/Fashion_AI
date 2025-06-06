// components/CategorySlider.tsx
import React, { useState, useEffect } from 'react';
import CategoryCard from './CategoryCard';
import { Category } from '../types';

const categories: Category[] = [
  { id: '1', name: '상의', icon: '👔', gradient: 'bg-gradient-to-br from-red-400 to-red-600' },
  { id: '2', name: '하의', icon: '👖', gradient: 'bg-gradient-to-br from-blue-500 to-purple-600' },
  { id: '3', name: '아우터', icon: '🧥', gradient: 'bg-gradient-to-br from-cyan-400 to-blue-500' },
  { id: '4', name: '주얼리', icon: '💎', gradient: 'bg-gradient-to-br from-pink-400 to-purple-500' },
  { id: '5', name: '신발', icon: '👟', gradient: 'bg-gradient-to-br from-yellow-400 to-orange-500' },
  { id: '6', name: '기타', icon: '🎒', gradient: 'bg-gradient-to-br from-green-400 to-emerald-500' },
];

const CategorySlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const slideWidth = 320;
  const maxSlide = categories.length - 3;

  const slideLeft = () => {
    setCurrentSlide(prev => prev > 0 ? prev - 1 : maxSlide);
  };

  const slideRight = () => {
    setCurrentSlide(prev => prev < maxSlide ? prev + 1 : 0);
  };

  useEffect(() => {
    const interval = setInterval(slideRight, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleCategoryClick = (categoryName: string) => {
    alert(`${categoryName} 카테고리를 선택하셨습니다!`);
  };

  return (
    <section className="mb-12">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
        카테고리별 인기 제품
      </h2>
      <div className="relative overflow-hidden rounded-3xl shadow-xl bg-white p-6">
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * slideWidth}px)` }}
        >
          {categories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={handleCategoryClick}
            />
          ))}
        </div>
      </div>
      <div className="flex justify-center mt-6 gap-4">
        <button
          onClick={slideLeft}
          className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full 
            flex items-center justify-center text-2xl text-gray-700 
            transition-all duration-300 hover:scale-110 shadow-lg"
        >
          ‹
        </button>
        <button
          onClick={slideRight}
          className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full 
            flex items-center justify-center text-2xl text-gray-700 
            transition-all duration-300 hover:scale-110 shadow-lg"
        >
          ›
        </button>
      </div>
    </section>
  );
};

export default CategorySlider;

// 