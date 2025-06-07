import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';

interface Product {
  id: string;
  name: string;
  style: string;
  image?: string;
}

const STYLES = ['캐주얼', '미니멀', '스트리트', '걸코어'];

const StyleAnalysis: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      const snapshot = await getDocs(collection(db, 'products'));
      const items: Product[] = [];

      snapshot.forEach(doc => {
        const data = doc.data();
        items.push({
          id: doc.id,
          name: data.product_name || '이름 없음',
          style: data.style || '미지정',
          image: data.image_url || '',
        });
      });

      setProducts(items);
    };

    fetchProducts();
  }, []);

  const filtered = selectedStyle
    ? products.filter(p => p.style === selectedStyle)
    : [];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200 w-full max-w-2xl mx-auto">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        🎯 원하는 스타일을 골라보세요
      </h3>

      {/* 스타일 버튼 */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {STYLES.map(style => {
          const isSelected = selectedStyle === style;
          return (
            <button
              key={style}
              onClick={() => setSelectedStyle(style)}
              className={`w-full py-4 rounded-xl font-medium transition-all border shadow-sm ${
                isSelected
                  ? 'bg-purple-600 text-white scale-105'
                  : 'bg-white text-gray-800 hover:bg-gray-100 hover:scale-105'
              }`}
            >
              {style}
            </button>
          );
        })}
      </div>

      {/* 선택 결과 */}
      {selectedStyle && (
        <>
          <h4 className="text-md font-semibold text-purple-700 mb-4 text-center">
            🔍 선택된 스타일: {selectedStyle}
          </h4>

          {filtered.length > 0 ? (
            <div className="grid grid-cols-2 gap-5">
              {filtered.map(product => (
                <div
                  key={product.id}
                  className="rounded-xl border bg-white shadow-sm hover:shadow-md transition p-4"
                >
                  {product.image && (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-44 object-cover rounded-md mb-3"
                    />
                  )}
                  <div className="text-base font-semibold text-gray-900">{product.name}</div>
                  <div className="text-sm text-gray-500">스타일: {product.style}</div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-center">해당 스타일의 상품이 없습니다.</p>
          )}
        </>
      )}
    </div>
  );
};

export default StyleAnalysis;
