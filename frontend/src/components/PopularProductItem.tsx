
// components/PopularProductItem.tsx
import React from 'react';
import { PopularProduct } from '../types';

interface PopularProductItemProps {
  product: PopularProduct;
}

const PopularProductItem: React.FC<PopularProductItemProps> = ({ product }) => {
  return (
    <div className="flex items-center bg-gray-50 rounded-xl p-4 mb-4 
      transition-all duration-300 hover:bg-gray-100 hover:translate-x-2 
      border border-gray-200 hover:border-gray-300">
      <div className="text-2xl font-bold text-yellow-500 mr-4 w-8">
        {product.rank}
      </div>
      <div className="flex-grow">
        <div className="text-gray-800 font-semibold mb-1">{product.name}</div>
        <div className="text-gray-600 text-sm">{product.price}</div>
      </div>
    </div>
  );
};

export default PopularProductItem;

// 