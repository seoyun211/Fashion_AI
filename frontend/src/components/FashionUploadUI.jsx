import React, { useState } from 'react';
import { Upload, Camera, Sparkles } from 'lucide-react';

export default function FashionUploadUI() {
  const [dragActive, setDragActive] = useState(false);
  const [uploadedImage, setUploadedImage] = useState(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <Sparkles className="w-8 h-8 text-amber-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">Fashion AI Studio</h1>
          </div>
          <p className="text-gray-600">AI로 당신만의 패션 스타일을 발견하세요</p>
        </div>

        {!uploadedImage ? (
          <div
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-2xl p-12 transition-all duration-300 cursor-pointer
              ${dragActive 
                ? 'border-amber-500 bg-amber-50 shadow-lg' 
                : 'border-gray-300 bg-white hover:border-gray-400 hover:bg-gray-50 hover:shadow-md'
              }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('upload-input').click()}
          >
            <div className="mb-6">
              {dragActive ? (
                <Upload className="w-16 h-16 text-amber-500 animate-bounce" />
              ) : (
                <Camera className="w-16 h-16 text-gray-400" />
              )}
            </div>
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">패션 사진을 업로드하세요</h3>
            <p className="text-gray-500 mb-6 text-center">
              Drag & Drop으로 간편하게 또는 아래 버튼을 클릭하세요<br />
              <span className="text-sm text-gray-400">JPG, PNG, WEBP 파일 지원</span>
            </p>
            <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" id="upload-input" />
            <button className="group relative overflow-hidden px-8 py-3 bg-gradient-to-r from-gray-800 to-black text-white rounded-xl font-medium transition-all duration-300 hover:from-black hover:to-gray-800 hover:shadow-lg transform hover:-translate-y-0.5">
              <span className="relative flex items-center">
                <Upload className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                파일 선택
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-yellow-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 bg-gradient-to-r from-gray-800 to-black">
              <h3 className="text-xl font-semibold text-white flex items-center">
                <Sparkles className="w-5 h-5 mr-2 text-amber-400" />
                업로드 완료
              </h3>
              <p className="text-gray-300 mt-1">AI 분석을 시작할 준비가 되었습니다</p>
            </div>
            <div className="p-6">
              <img src={uploadedImage} alt="Uploaded fashion" className="w-full max-h-96 object-contain rounded-xl shadow-md" />
              <div className="flex gap-3 mt-6">
                <button onClick={() => setUploadedImage(null)} className="flex-1 px-4 py-2 border-2 border-gray-300 text-gray-700 rounded-xl hover:border-gray-400 hover:bg-gray-50 transition-all font-medium">
                  다시 업로드
                </button>
                <button className="flex-1 px-4 py-2 bg-gradient-to-r from-amber-500 to-yellow-500 text-white rounded-xl hover:from-amber-600 hover:to-yellow-600 transition-all font-medium shadow-md hover:shadow-lg">
                  AI 분석 시작
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
