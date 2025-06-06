import React from 'react';
import { ToastProps } from '../../types';

const Toast: React.FC<ToastProps> = ({ message, isVisible, onClose }) => (
  <div className={`fixed top-4 right-4 bg-purple-600 text-white px-6 py-3 rounded-lg shadow-lg
    transition-all duration-300 z-50 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}`}>
    <div className="flex items-center space-x-2">
      <span>✨</span>
      <span>{message}</span>
      <button onClick={onClose} className="ml-2 hover:bg-purple-700 rounded p-1">
        ×
      </button>
    </div>
  </div>
);

export default Toast;