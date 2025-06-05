// pages/FashionHubPage.tsx
import React from 'react';
import Header from '../components/Header';
import CategorySlider from '../components/CategorySlider';
import AIRecommendationSection from '../components/AIRecommendationSection';
import PopularProductsSection from '../components/PopularProductsSection';

const FashionHubPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-5 py-8">
        <Header />
        <CategorySlider />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-12">
          <AIRecommendationSection />
          <PopularProductsSection />
        </div>
      </div>
    </div>
  );
};

export default FashionHubPage;

// 