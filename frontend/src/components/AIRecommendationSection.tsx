import React, { useState } from 'react';
import AIRecommendationCard from './AIRecommendationCard';
import StyleAnalysis from './functions/StyleAnalysis';
import ClothingFinder from './functions/ClothingFinder';
import OccasionRecommendations from './functions/OccasionRecommendations';
import Toast from './common/Toast';
import { recommendations } from '../data/recommendations';
import { useToast } from '../hooks/useToast';

const AIRecommendationSection: React.FC = () => {
  const [activeFunction, setActiveFunction] = useState<string | null>(null);
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const { toastMessage, showToast, showToastMessage, hideToast } = useToast();

  const handleRecommendationClick = (type: string) => {
    if (loadingType) return;

    setLoadingType(type);
    
    // Simulate loading
    setTimeout(() => {
      setLoadingType(null);
      setActiveFunction(type);
      const messages = {
        style: '스타일 분석',
        color: '옷 찾기',
        occasion: '상황별 추천'
      };
      showToastMessage(`${messages[type as keyof typeof messages]} 기능이 활성화되었습니다!`);
    }, 1000);
  };

  const handleBack = () => {
    setActiveFunction(null);
  };

  const renderActiveFunction = () => {
    switch (activeFunction) {
      case 'style':
        return <StyleAnalysis onBack={handleBack} />;
      case 'color':
        return <ClothingFinder onBack={handleBack} />;
      case 'occasion':
        return <OccasionRecommendations onBack={handleBack} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="max-w-md mx-auto">
        {!activeFunction ? (
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
              🤖 AI 스타일 추천
            </h3>
            {recommendations.map((recommendation) => (
              <AIRecommendationCard
                key={recommendation.id}
                recommendation={recommendation}
                onClick={handleRecommendationClick}
                isLoading={loadingType === recommendation.type}
                isActive={activeFunction === recommendation.type}
              />
            ))}
          </div>
        ) : (
          renderActiveFunction()
        )}
      </div>
      
      <Toast 
        message={toastMessage}
        isVisible={showToast}
        onClose={hideToast}
      />
    </>
  );
};

export default AIRecommendationSection;