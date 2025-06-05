import React, { useState } from 'react';

const trendCardData = [
  {
    title: '🔥 2025 여름, Y2K 스트릿이 돌아왔다!',
    subtitle: '패션 위크에서 가장 주목받은 룩',
    image: '/assets/y2k.jpg',
  },
  {
    title: '📈 지금 뜨는 스타일',
    subtitle: '오늘의 가장 핫한 스타일을 확인해보세요요',
    image: '/assets/top3.jpg',
  },
  {
    title: '🎯 나와 어울리는 스타일은?',
    subtitle: '당신은 미니멀 & 블랙톤 스타일과 어울려요!',
    image: '/assets/minimal.jpg',
  },
  {
    title: '🤖 AI 추천 결과 도착!',
    subtitle: '이런 룩을 좋아할 확률이 높아요',
    image: '/assets/recommend.jpg',
  },
];

const TrendCardFeed = () => {
  const [index, setIndex] = useState(0);
  const nextCard = () => {
    if (index < trendCardData.length - 1) setIndex(index + 1);
  };
  const prevCard = () => {
    if (index > 0) setIndex(index - 1);
  };

  const current = trendCardData[index];

  return (
    <div className="flex flex-col items-center justify-center h-screen p-4 bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-6 text-center">
        <img
          src={current.image}
          alt={current.title}
          className="w-full h-56 object-cover rounded-lg mb-4"
        />
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{current.title}</h2>
        <p className="text-gray-500">{current.subtitle}</p>
      </div>
      <div className="mt-6 space-x-4">
        <button
          onClick={prevCard}
          disabled={index === 0}
          className="px-4 py-2 bg-gray-300 text-gray-800 rounded disabled:opacity-50"
        >
          이전
        </button>
        <button
          onClick={nextCard}
          disabled={index === trendCardData.length - 1}
          className="px-4 py-2 bg-black text-white rounded disabled:opacity-50"
        >
          다음
        </button>
      </div>
    </div>
  );
};

export default TrendCardFeed;
