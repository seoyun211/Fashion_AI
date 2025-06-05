import React from 'react';
import { Link } from 'react-router-dom';
import ImageSearchUploader from "../components/ImageSearchUploader";

const HomePage = () => {
  return (
    <section className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-white to-gray-100 px-6 text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-800 mb-4">
        StylePulse
      </h1>
      <p className="text-gray-600 text-lg sm:text-xl mb-8">
        AI가 실시간 패션 트렌드를 분석하고<br />
        당신에게 어울리는 스타일을 추천해드려요 ✨
      </p>

      <Link
        to="/trends"
        className="bg-black text-white px-6 py-3 rounded-full hover:bg-gray-800 transition mb-6"
      >
        지금 트렌드 보러가기 →
      </Link>

      {/* ✅ 패션 이미지 업로드 기능 추가 */}
      <div className="w-full max-w-md mt-6 p-4 bg-white rounded shadow">
        <ImageSearchUploader />
      </div>
    </section>
  );
};

export default HomePage;