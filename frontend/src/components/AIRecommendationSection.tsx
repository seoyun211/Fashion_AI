// components/AIRecommendationSection.tsx
import React from 'react';
import AIRecommendationCard from './AIRecommendationCard';
import { AIRecommendation } from '../types';

const recommendations: AIRecommendation[] = [
  {
    id: '1',
    title: '스타일 분석',
    description: '당신의 취향을 분석하여 완벽한 스타일을 추천해드립니다',
    icon: '✨',
    type: 'style'
  },
  {
    id: '2',
    title: '이 옷 뭐지?',
    description: '사진을 넣어 내가 찾는 그 옷을 AI가 찾아드립니다',
    icon: '🎨',
    type: 'color'
  },
  {
    id: '3',
    title: '상황별 추천',
    description: '데이트, 회사, 파티 등 상황에 맞는 완벽한 코디를 제안합니다',
    icon: '📅',
    type: 'occasion'
  }
];

const AIRecommendationSection: React.FC = () => {
  const handleRecommendationClick = (type: string) => {
    const messages = {
      style: 'AI가 당신의 스타일을 분석중입니다... 잠시만 기다려주세요!',
      color: 'AI가 최적의 컬러 조합을 찾고 있습니다... 분석중!',
      occasion: 'AI가 상황에 맞는 완벽한 코디를 준비하고 있습니다!'
    };
    alert(messages[type as keyof typeof messages]);
  };

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl 
      border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        🤖 AI 스타일 추천
      </h3>
      {recommendations.map((recommendation) => (
        <AIRecommendationCard
          key={recommendation.id}
          recommendation={recommendation}
          onClick={handleRecommendationClick}
        />
      ))}
    </div>
  );
};

export default AIRecommendationSection;

// 