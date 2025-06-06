import React, { useState, useRef } from 'react';
interface ClothingFinderProps {
  onBack: () => void;
}

const ClothingFinder: React.FC<ClothingFinderProps> = ({ onBack }) =>  {
  const [selectedImage, setSelectedImage] = useState<string | null>(null); 
  const [description, setDescription] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleImageChange = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
  const result = (e.target as FileReader)?.result;
  if (typeof result === 'string') {
    setSelectedImage(result);
  }
};
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageChange(file);
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
    
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleImageChange(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleSearch = async () => {
    if (!selectedImage && !description.trim()) {
      alert('사진을 업로드하거나 옷을 설명해주세요!');
      return;
    }
    
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      alert('AI가 옷을 찾고 있습니다! 🔍');
    }, 2000);
  };

  const removeImage = () => {
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-8 shadow-xl max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
            <span className="text-white text-lg">👗</span>
          </div>
          <h3 className="text-2xl font-bold text-gray-900">옷 찾기</h3>
        </div>
        <button 
          onClick={onBack}
          className="w-10 h-10 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 hover:text-gray-600 transition-all"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="space-y-6">
        {/* Image Upload Area */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">사진으로 찾기</label>
          <div 
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all cursor-pointer ${
              dragActive 
                ? 'border-pink-400 bg-pink-50' 
                : selectedImage 
                  ? 'border-green-400 bg-green-50'
                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={handleUploadClick}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileInput}
            />
            
            {selectedImage ? (
              <div className="relative">
                <img 
                  src={selectedImage} 
                  alt="업로드된 옷 사진"
                  className="max-w-full max-h-48 mx-auto rounded-xl shadow-sm object-contain"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage();
                  }}
                  className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition-colors"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
                <p className="text-green-600 text-sm mt-3 font-medium">사진이 업로드되었어요!</p>
              </div>
            ) : (
              <div>
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  {dragActive ? (
                    <svg className="w-8 h-8 text-pink-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  ) : (
                    <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  )}
                </div>
                <p className="text-gray-600 font-medium mb-2">
                  {dragActive ? '여기에 놓아주세요' : '사진을 업로드해주세요'}
                </p>
                <p className="text-sm text-gray-400">
                  클릭하거나 드래그해서 업로드
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-4 text-sm text-gray-400 bg-white">또는</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        {/* Text Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">설명으로 찾기</label>
          <textarea 
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
            placeholder="어떤 옷을 찾고 계신가요?&#10;예: 검은색 가죽자켓, 흰색 면 티셔츠, 청바지..."
            className="w-full p-4 border border-gray-200 rounded-2xl resize-none h-24 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-all placeholder-gray-400"
            maxLength={200}
          />
          {description.length > 0 && (
            <div className="flex justify-between items-center mt-2">
              <span className="text-xs text-gray-400">
                {description.length}/200
              </span>
            </div>
          )}
        </div>

        {/* Search Button */}
        <button 
          onClick={handleSearch}
          disabled={isLoading}
          className={`w-full py-4 rounded-2xl font-semibold transition-all flex items-center justify-center ${
            isLoading 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-300 border-t-gray-600 mr-3"></div>
              AI가 찾는 중이에요...
            </>
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              AI로 옷 찾기
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default ClothingFinder;