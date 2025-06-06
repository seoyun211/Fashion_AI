import React from 'react';
import { FunctionComponentProps } from '../../types';

const ClothingFinder: React.FC<FunctionComponentProps> = ({ onBack }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-bold text-gray-800">🎨 이 옷 뭐지?</h3>
      <button 
        onClick={onBack}
        className="text-gray-500 hover:text-gray-700 text-2xl"
      >
        ×
      </button>
    </div>
    <div className="space-y-4">
      <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center">
        <div className="text-4xl mb-2">📷</div>
        <p className="text-gray-600 mb-4">사진을 업로드하거나 드래그하세요</p>
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          id="image-upload"
        />
        <label 
          htmlFor="image-upload"
          className="bg-pink-600 hover:bg-pink-700 text-white px-6 py-2 rounded-lg cursor-pointer transition-colors inline-block"
        >
          사진 선택
        </label>
      </div>
      <div className="text-center">
        <p className="text-sm text-gray-500">또는</p>
      </div>
      <textarea 
        placeholder="찾고 있는 옷을 설명해주세요 (예: 파란색 청바지, 흰색 셔츠...)"
        className="w-full p-3 border border-gray-300 rounded-xl resize-none h-20"
      ></textarea>
      <button className="w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl font-medium transition-colors">
        AI로 옷 찾기
      </button>
    </div>
  </div>
);

export default ClothingFinder;
