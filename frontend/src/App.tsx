// App.tsx
import React from 'react';
import FashionHubPage from './pages/FashionHubPage';
import './styles/index.css'; // Tailwind CSS

const App: React.FC = () => {
  return (
    <div className="App">
      <FashionHubPage />
    </div>
  );
};

export default App;