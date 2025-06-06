import React from 'react';
import { FunctionComponentProps } from '../../types';

const StyleAnalysis: React.FC<FunctionComponentProps> = ({ onBack }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-bold text-gray-800">✨ 스타일 분석</h3>
      <button 
        onClick={onBack}
        className="text-gray-500 hover:text-gray-700 text-2xl"
      >
        ×
      </button>
    </div>
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-purple-100 hover:bg-purple-200 p-4 rounded-xl text-center transition-colors">
          <div className="text-2xl mb-2">👔</div>
          <div className="text-sm font-medium">포멀</div>
        </button>
        <button className="bg-pink-100 hover:bg-pink-200 p-4 rounded-xl text-center transition-colors">
          <div className="text-2xl mb-2">👕</div>
          <div className="text-sm font-medium">캐주얼</div>
        </button>
        <button className="bg-blue-100 hover:bg-blue-200 p-4 rounded-xl text-center transition-colors">
          <div className="text-2xl mb-2">🎨</div>
          <div className="text-sm font-medium">아티스틱</div>
        </button>
        <button className="bg-green-100 hover:bg-green-200 p-4 rounded-xl text-center transition-colors">
          <div className="text-2xl mb-2">🌟</div>
          <div className="text-sm font-medium">미니멀</div>
        </button>
      </div>
      <button className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl font-medium transition-colors">
        스타일 분석 시작하기
      </button>
    </div>
  </div>
);

export default StyleAnalysis;
