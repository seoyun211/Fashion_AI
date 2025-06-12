// src/pages/AuthPage.tsx
import React, { useState } from 'react';
import LoginForm from '../components/auth/LoginForm';
import SignupForm from '../components/auth/SignupForm';
import { Sparkles } from 'lucide-react';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {/* 왼쪽 브랜딩 섹션 */}
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 p-8 lg:p-12 text-white flex flex-col justify-center">
              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start mb-6">
                  <Sparkles className="w-12 h-12 mr-3" />
                  <h1 className="text-3xl lg:text-4xl font-bold">Fashion AI</h1>
                </div>
                
                <h2 className="text-xl lg:text-2xl font-semibold mb-4">
                  AI가 추천하는 나만의 스타일
                </h2>
                
                <p className="text-blue-100 text-lg mb-8">
                  개인 맞춤형 패션 추천 서비스로 새로운 스타일을 발견하세요
                </p>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <span>트렌드 분석 및 스타일 매칭</span>
                  </div>
                  
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-4">
                      <span className="text-white font-bold">✓</span>
                    </div>
                    <span>체형별 최적화된 코디 제안</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽 폼 섹션 */}
            <div className="p-8 lg:p-12 flex items-center justify-center">
              {isLogin ? (
                <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
              ) : (
                <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
              )}
            </div>
          </div>
        </div>
        
        <div className="text-center mt-8 text-gray-500 text-sm">
          © 2025 Fashion AI Hub. All rights reserved.
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
