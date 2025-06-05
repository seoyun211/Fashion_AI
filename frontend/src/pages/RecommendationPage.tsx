import React from 'react';
import { useLocation } from 'react-router-dom';

const RecommendationPage = () => {
  const location = useLocation();
  const recommendations = location.state?.recommendations;

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="text-center py-20 text-gray-500">
        추천 데이터를 불러올 수 없습니다.
      </div>
    );
  }

  return (
    <section className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">💡 이런 스타일은 어때요?</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {recommendations.map((style: any, idx: number) => (
          <div
            key={idx}
            className="border rounded-xl p-4 shadow hover:shadow-lg transition text-center"
          >
            <img
              src={style.image || '/assets/default.jpg'}
              alt={style.name}
              className="w-full h-60 object-cover rounded-lg mb-3"
            />
            <h3 className="text-lg font-semibold text-gray-800">{style.name}</h3>
            <p className="text-sm text-gray-500 mt-1">{style.reason}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendationPage;
