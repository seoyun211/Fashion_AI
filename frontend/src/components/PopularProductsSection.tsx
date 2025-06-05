// components/PopularProductsSection.tsx
import React, { useState, useEffect } from 'react';
import PopularProductItem from './PopularProductItem';
import { PopularProduct } from '../types';

const allProducts = [
  { id: '1', name: '오버사이즈 후드티', price: '39,000원', rank: 1 },
  { id: '2', name: '와이드 데님 팬츠', price: '65,000원', rank: 2 },
  { id: '3', name: '체크 무늬 셔츠', price: '45,000원', rank: 3 },
  { id: '4', name: '미니멀 실버 목걸이', price: '28,000원', rank: 4 },
  { id: '5', name: '화이트 스니커즈', price: '89,000원', rank: 5 },
  { id: '6', name: '크롭 니트', price: '52,000원', rank: 6 },
  { id: '7', name: '슬림핏 블레이저', price: '98,000원', rank: 7 },
  { id: '8', name: '골드 링 세트', price: '35,000원', rank: 8 },
];

const PopularProductsSection: React.FC = () => {
  const [currentTime, setCurrentTime] = useState('');
  const [popularProducts, setPopularProducts] = useState<PopularProduct[]>([]);

  const updateTime = () => {
    const now = new Date();
    const hours = now.getHours();
    const timeStr = hours < 12 ? `오전 ${hours}:00` : `오후 ${hours - 12}:00`;
    setCurrentTime(`${timeStr} 기준 실시간 랭킹`);
  };

  const updateProducts = () => {
    const shuffled = [...allProducts]
      .sort(() => Math.random() - 0.5)
      .slice(0, 5)
      .map((product, index) => ({ ...product, rank: index + 1 }));
    setPopularProducts(shuffled);
  };

  useEffect(() => {
    updateTime();
    updateProducts();
    
    const interval = setInterval(() => {
      updateTime();
      updateProducts();
    }, 30000); // 30초마다 업데이트 (실제로는 1시간)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl 
      border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        🔥 실시간 인기 제품
      </h3>
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white 
        px-4 py-2 rounded-full text-sm text-center mb-6 animate-pulse">
        {currentTime}
      </div>
      <div>
        {popularProducts.map((product) => (
          <PopularProductItem key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default PopularProductsSection;

// 