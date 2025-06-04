import React from 'react';
import { Link } from 'react-router-dom';

const NavBar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex justify-between items-center">
      <Link to="/" className="text-xl font-bold text-gray-800">StylePulse</Link>
      <div className="space-x-4">
        <Link to="/trends" className="text-gray-600 hover:text-black">Trends</Link>
        <Link to="/input" className="text-gray-600 hover:text-black">Get Recommendation</Link>
      </div>
    </nav>
  );
};

export default NavBar;
