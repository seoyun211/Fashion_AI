// src/components/Header.tsx
import React from 'react';
import { Sparkles, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Header: React.FC = () => {
  const { currentUser, userProfile, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('로그아웃 오류:', error);
    }
  };

  return (
    <header className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-3">
        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Fashion AI Hub</h1>
          <p className="text-gray-500 text-sm">AI로 만나는 개인 맞춤 패션</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        {/* 사용자 정보 */}
        <div className="flex items-center space-x-3 bg-white rounded-lg px-4 py-2 shadow-sm border">
          <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-gray-600" />
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">
              {currentUser?.email?.split('@')[0] || '사용자'}
            </p>
            {userProfile && (
              <p className="text-gray-500 text-xs">
                {userProfile.gender === 'male' ? '남성' : userProfile.gender === 'female' ? '여성' : '기타'} • 
                {userProfile.height}cm • {userProfile.weight}kg
              </p>
            )}
          </div>
        </div>
        
        {/* 로그아웃 버튼 */}
        <button
          onClick={handleLogout}
          className="flex items-center space-x-2 bg-red-50 hover:bg-red-100 text-red-600 px-4 py-2 rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">로그아웃</span>
        </button>
      </div>
    </header>
  );
};

export default Header;