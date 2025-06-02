import Image from 'next/image';
import { ProductCardProps } from '@/types';

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
      <div className="relative h-64 w-full">
        <Image
          src={product.이미지}
          alt={product.상품명}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold truncate">{product.상품명}</h3>
          <span className="text-sm text-gray-500">{product.쇼핑몰}</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-xl font-bold">{product.가격}원</span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">♥ {product.좋아요개수}</span>
            <span className="text-sm text-gray-500">리뷰 {product.리뷰수}</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mt-3">
          <span className="px-2 py-1 bg-primary/10 text-primary rounded-full text-sm">
            {product.스타일}
          </span>
          <span className="px-2 py-1 bg-secondary/10 text-secondary rounded-full text-sm">
            {product.카테고리}
          </span>
          <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-sm">
            {product.시즌}
          </span>
        </div>
      </div>
    </div>
  );
} 