import React from 'react';
import { AIRecommendationCardProps } from '../types';

const AIRecommendationCard: React.FC<AIRecommendationCardProps> = ({ 
  recommendation, 
  onClick, 
  isLoading, 
  isActive 
}) => (
  <div 
    className={`bg-gradient-to-r rounded-2xl p-6 mb-4 
      cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105
      border-2 ${
        isActive 
          ? 'from-purple-100 to-pink-100 border-purple-400 shadow-lg' 
          : 'from-purple-50 to-pink-50 border-purple-100'
      } ${isLoading ? 'opacity-60' : ''}`}
    onClick={() => !isLoading && onClick(recommendation.type)}
  >
    <div className="flex items-center space-x-4">
      <div className="text-3xl">{recommendation.icon}</div>
      <div className="flex-1">
        <h4 className="font-bold text-gray-800 mb-1">{recommendation.title}</h4>
        <p className="text-gray-600 text-sm">{recommendation.description}</p>
      </div>
      {isLoading && (
        <div className="w-6 h-6 border-2 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
      )}
      {isActive && !isLoading && (
        <div className="text-purple-600 font-bold">활성화</div>
      )}
    </div>
  </div>
);

export default AIRecommendationCard;
