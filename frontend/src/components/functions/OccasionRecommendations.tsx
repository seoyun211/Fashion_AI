import React from 'react';
import { FunctionComponentProps } from '../../types';

const OccasionRecommendations: React.FC<FunctionComponentProps> = ({ onBack }) => (
  <div className="bg-white rounded-2xl p-6 shadow-lg">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xl font-bold text-gray-800">📅 상황별 추천</h3>
      <button 
        onClick={onBack}
        className="text-gray-500 hover:text-gray-700 text-2xl"
      >
        ×
      </button>
    </div>
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-3">
        <button className="bg-red-100 hover:bg-red-200 p-4 rounded-xl text-left transition-colors">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">💕</div>
            <div>
              <div className="font-medium">데이트</div>
              <div className="text-sm text-gray-600">로맨틱한 분위기의 코디</div>
            </div>
          </div>
        </button>
        <button className="bg-blue-100 hover:bg-blue-200 p-4 rounded-xl text-left transition-colors">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">💼</div>
            <div>
              <div className="font-medium">회사/면접</div>
              <div className="text-sm text-gray-600">프로페셔널한 룩</div>
            </div>
          </div>
        </button>
        <button className="bg-yellow-100 hover:bg-yellow-200 p-4 rounded-xl text-left transition-colors">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">🎉</div>
            <div>
              <div className="font-medium">파티/모임</div>
              <div className="text-sm text-gray-600">화려하고 트렌디한 스타일</div>
            </div>
          </div>
        </button>
        <button className="bg-green-100 hover:bg-green-200 p-4 rounded-xl text-left transition-colors">
          <div className="flex items-center space-x-3">
            <div className="text-2xl">☕</div>
            <div>
              <div className="font-medium">일상/카페</div>
              <div className="text-sm text-gray-600">편안하고 자연스러운 룩</div>
            </div>
          </div>
        </button>
      </div>
    </div>
  </div>
);

export default OccasionRecommendations;

