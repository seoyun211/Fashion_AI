// components/CategoryCard.tsx
import React from 'react';
import { Category } from '../types';

interface CategoryCardProps {
  category: Category;
  onClick: (categoryName: string) => void;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category, onClick }) => {
  return (
    <div
      className={`min-w-[300px] h-64 mr-5 rounded-2xl ${category.gradient} 
        flex flex-col justify-center items-center text-white cursor-pointer 
        transition-all duration-300 relative overflow-hidden group
        hover:-translate-y-3 hover:scale-105 hover:shadow-2xl`}
      onClick={() => onClick(category.name)}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent 
        opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <div className="text-5xl mb-4 relative z-10">{category.icon}</div>
      <div className="text-xl font-bold relative z-10">{category.name}</div>
    </div>
  );
};

export default CategoryCard;

// 