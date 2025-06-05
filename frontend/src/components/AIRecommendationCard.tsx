// components/AIRecommendationCard.tsx
import React from 'react';
import { AIRecommendation } from '../types';

interface AIRecommendationCardProps {
  recommendation: AIRecommendation;
  onClick: (type: string) => void;
}

const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({ 
  recommendation, 
  onClick 
}) => {
  return (
    <div
      className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl 
        p-6 text-white text-center mb-5 cursor-pointer transition-all duration-300 
        hover:-translate-y-2 hover:shadow-xl border-2 border-white/20 
        hover:border-white/40"
      onClick={() => onClick(recommendation.type)}
    >
      <div className="text-4xl mb-4">{recommendation.icon}</div>
      <h4 className="text-xl font-bold mb-3">{recommendation.title}</h4>
      <p className="opacity-90 leading-relaxed">{recommendation.description}</p>
    </div>
  );
};

export default AIRecommendationCard;

// 