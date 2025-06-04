import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './src/pages/HomePage';
import TrendCardFeed from './src/pages/TrendCardFeed';
import UserInputPage from './src/pages/UserInputPage';
import RecommendationPage from './src/pages/RecommendationPage';
import NavBar from './src/components/NavBar';
import Footer from './src/components/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
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
    </Router>
  );
}

export default App;
