import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TrendFeedPage from './pages/TrendFeedPage';
import UserInputPage from './pages/UserInputPage';
import RecommendationPage from './pages/RecommendationPage';
import NavBar from './components/NavBar';
import Footer from './components/Footer';

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/trends" element={<TrendFeedPage />} />
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
