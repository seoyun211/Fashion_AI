import React, { useState, useEffect } from 'react';
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig'; // 경로는 프로젝트에 맞게
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
  { id: '6', name: '기타', icon: '🎒', gradient: 'bg-gradient-to-br from-green-400 to-emerald-500', backendValue: '기타' },
];

const CategorySlider: React.FC = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);

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

  const handleCategoryClick = async (category: Category) => {
    setSelectedCategory(category.name);
    try {
      const q = query(
        collection(db, "products"),
        where("category", "==", category.backendValue),
        orderBy("reviews", "desc"),
        limit(10)
      );
      const querySnapshot = await getDocs(q);
      const data: Product[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        product_name: doc.data().product_name,
        image_url: doc.data().image_url,
        reviews: doc.data().reviews || 0,
        rating: doc.data().rating || 0,
        price: doc.data().price || 0,
        shop_name: doc.data().shop_name || "",
      }));

      console.log("🔥 불러온 제품:", data);


      setProducts(data);
    } catch (error) {
      console.error("🔥 Firebase에서 데이터 불러오기 실패:", error);
    }
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
        <>
          <h3 className="text-xl mt-10 font-semibold text-center">
            {selectedCategory} 인기 제품
          </h3>
          <ProductList products={products} />
        </>
      )}
    </section>
  );
};

export default CategorySlider;
