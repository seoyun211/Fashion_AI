import React from 'react';

export default function TrendFeedPage() {
  const dummyTrends = [
    { title: 'Y2K 스트릿', count: 1240 },
    { title: '미니멀 블랙', count: 970 },
    { title: '아메카지', count: 850 },
    { title: '테크웨어', count: 660 },
  ];

  return (
    <section className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">🔥 지금 인기 있는 스타일</h2>
      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {dummyTrends.map((trend, idx) => (
          <li key={idx} className="border p-4 rounded-lg shadow-sm hover:shadow transition">
            <h3 className="text-lg font-semibold text-gray-700">{trend.title}</h3>
            <p className="text-sm text-gray-500">최근 트렌드 지수: {trend.count}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}