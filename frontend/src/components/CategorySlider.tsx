import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import CategoryCard from './CategoryCard';
import ProductList from './ProductList';

interface Category {
  id: string;
  name: string;
  icon: string;
  gradient: string;
  backendValue: string;
}

interface Product {
  id: string;
  product_name: string;
  image_url: string;
  reviews: number;
  rating: number;
  price: number;
  shop_name: string;
}

const categories: Category[] = [
  { id: '1', name: '상의', icon: '👔', gradient: 'bg-gradient-to-br from-red-400 to-red-600', backendValue: '상의' },
  { id: '2', name: '하의', icon: '👖', gradient: 'bg-gradient-to-br from-blue-500 to-purple-600', backendValue: '하의' },
  { id: '3', name: '아우터', icon: '🧥', gradient: 'bg-gradient-to-br from-cyan-400 to-blue-500', backendValue: '아우터' },
  { id: '4', name: '주얼리', icon: '💎', gradient: 'bg-gradient-to-br from-pink-400 to-purple-500', backendValue: '주얼리' },
  { id: '5', name: '신발', icon: '👟', gradient: 'bg-gradient-to-br from-yellow-400 to-orange-500', backendValue: '신발' },
];

const CategorySlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [sortBy, setSortBy] = useState<'reviews' | 'rating'>('reviews');

  const slideWidth = 320;
  const maxSlide = categories.length - 3;

  const slideLeft = () => setCurrentSlide(prev => (prev > 0 ? prev - 1 : maxSlide));
  const slideRight = () => setCurrentSlide(prev => (prev < maxSlide ? prev + 1 : 0));

  const handleCategoryClick = async (category: Category) => {
    setSelectedCategory(category.name);

    try {
      const snapshot = await getDocs(query(collection(db, 'products')));
      const allData = snapshot.docs.map(doc => {
        const d = doc.data();
        return {
          id: doc.id,
          product_name: d.product_name || '',
          image_url: d.image_url || '',
          reviews: typeof d.reviews === 'number' ? d.reviews : Number(d.reviews) || 0,
          rating: typeof d.rating === 'number' ? d.rating : Number(d.rating) || 0,
          price: typeof d.price === 'number' ? d.price : Number(d.price) || 0,
          shop_name: d.shop_name || '',
          category: (d.category || '').trim(), // 공백 제거해서 필터링용
        };
      });

      const filtered = allData
        .filter(p => p.category === category.backendValue)
        .sort((a, b) => (sortBy === 'reviews' ? b.reviews - a.reviews : b.rating - a.rating))
        .slice(0, 10);

      console.log(`🔥 ${category.name} (${sortBy}) 정렬 결과 ${filtered.length}개`);
      console.table(filtered.map(p => ({ name: p.product_name, rating: p.rating, reviews: p.reviews })));

      setProducts(filtered);
    } catch (error: any) {
      console.error('🔥 Firebase 쿼리 실패:', error.message);
    }
  };

  useEffect(() => {
    if (selectedCategory) {
      const selected = categories.find(c => c.name === selectedCategory);
      if (selected) handleCategoryClick(selected);
    }
  }, [sortBy]);

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
          {categories.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              onClick={() => handleCategoryClick(category)}
            />
          ))}
        </div>
      </div>

      <div className="flex justify-center mt-6 gap-4">
        <button onClick={slideLeft} className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full text-2xl shadow-lg">‹</button>
        <button onClick={slideRight} className="w-12 h-12 bg-gray-200 hover:bg-gray-300 rounded-full text-2xl shadow-lg">›</button>
      </div>

      {selectedCategory && (
        <div className="text-center mt-10">
          <h3 className="text-xl font-semibold mb-4">{selectedCategory} 인기 제품</h3>

          <div className="inline-flex gap-4 mb-6">
            <button
              onClick={() => setSortBy('reviews')}
              className={`px-4 py-2 rounded-xl font-medium transition ${
                sortBy === 'reviews' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              리뷰 많은 순
            </button>
            <button
              onClick={() => setSortBy('rating')}
              className={`px-4 py-2 rounded-xl font-medium transition ${
                sortBy === 'rating' ? 'bg-purple-600 text-white' : 'bg-gray-100 text-gray-800'
              }`}
            >
              평점 높은 순
            </button>
          </div>

          <ProductList products={products} />
        </div>
      )}
    </section>
  );
};

export default CategorySlider;
