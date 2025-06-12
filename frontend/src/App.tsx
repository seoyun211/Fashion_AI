// App.tsx
import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import FashionHubPage from './pages/FashionHubPage';
import AuthPage from './pages/AuthPage';
import './styles/index.css'; // Tailwind CSS

const AppContent: React.FC = () => {
  const { currentUser, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    );
  }

  return currentUser ? <FashionHubPage /> : <AuthPage />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <div className="App">
        <AppContent />
      </div>
    </AuthProvider>
  );
};

export default App;