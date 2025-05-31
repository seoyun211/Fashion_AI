import React from 'react';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <section className="text-center py-20 px-4 bg-gradient-to-br from-white to-gray-100">
      <h1 className="text-4xl font-semibold mb-4 text-gray-800">StylePulse</h1>
      <p className="text-gray-600 mb-8">
        AI가 분석한 실시간 패션 트렌드를 지금 확인하고,<br />
        나만의 스타일을 추천받아보세요.
      </p>
      <Link
        to="/trends"
        className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition"
      >
        트렌드 확인하기
      </Link>
    </section>
  );
}
