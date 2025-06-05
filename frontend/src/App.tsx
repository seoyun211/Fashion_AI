import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TrendCardFeed from './pages/TrendFeedPage';
import UserInputPage from './pages/UserInputPage';
import RecommendationPage from './pages/RecommendationPage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <h1 style={{ textAlign: 'center', color: 'red' }}>✅ 앱 연결 성공</h1>
      <NavBar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/trends" element={<TrendCardFeed />} />
          <Route path="/input" element={<UserInputPage />} />
          <Route path="/recommendations" element={<RecommendationPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
