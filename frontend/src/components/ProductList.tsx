import React from 'react';

interface Product {
  id: string;
  product_name: string;
  image_url: string;
  reviews: number;
  rating: number;
  price: number;
  shop_name: string;
}

interface Props {
  products: Product[];
}

const ProductList: React.FC<Props> = ({ products }) => {

  console.log("✅ 렌더링할 제품:", products);


  if (!products.length) {
    return <p className="text-center mt-4 text-gray-500">선택한 카테고리에 해당하는 제품이 없습니다.</p>;
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 px-4">
      {products.map(product => (
        <div key={product.id} className="bg-white p-4 rounded-xl shadow-md hover:scale-105 transition">
          <img src={product.image_url} alt={product.product_name} className="w-full h-48 object-cover rounded-lg mb-2" />
          <h4 className="text-sm font-semibold truncate">{product.product_name}</h4>
          <p className="text-xs text-gray-500">{product.shop_name}</p>
          <p className="text-sm font-bold text-blue-600">{product.price.toLocaleString()}원</p>
          <p className="text-xs text-gray-600">⭐ {product.rating} / 리뷰 {product.reviews}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductList;
