import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postStyleRecommendation } from '../services/api';

const UserInputPage = () => {
  const navigate = useNavigate();
  const [gender, setGender] = useState<'male' | 'female' | null>(null);
  const [styles, setStyles] = useState<string[]>([]);
  const [colors, setColors] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const styleOptions = ['스트릿', '미니멀', '아메카지', '빈티지'];
  const colorOptions = ['블랙', '화이트', '베이지', '파스텔'];

  const toggleItem = (
    item: string,
    list: string[],
    setList: React.Dispatch<React.SetStateAction<string[]>>
  ) => {
    if (list.includes(item)) {
      setList(list.filter((v) => v !== item));
    } else {
      setList([...list, item]);
    }
  };

  const handleSubmit = async () => {
    if (!gender || styles.length === 0 || colors.length === 0) {
      alert('모든 항목을 선택해주세요!');
      return;
    }

    try {
      setIsLoading(true);
      const result = await postStyleRecommendation({ gender, styles, colors });

      // 👉 추천 결과를 state로 전달
      navigate('/recommendations', { state: { recommendations: result } });
    } catch (error) {
      console.error('추천 요청 실패:', error);
      alert('추천을 불러오는데 실패했어요 😢');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-center">나의 스타일 정보 입력</h2>

      <div className="mb-4">
        <p className="font-semibold mb-2">성별</p>
        <div className="flex space-x-4">
          <button
            onClick={() => setGender('male')}
            className={`px-4 py-2 rounded-full ${gender === 'male' ? 'bg-black text-white' : 'bg-gray-200'}`}
          >
            남자
          </button>
          <button
            onClick={() => setGender('female')}
            className={`px-4 py-2 rounded-full ${gender === 'female' ? 'bg-black text-white' : 'bg-gray-200'}`}
          >
            여자
          </button>
        </div>
      </div>

      <div className="mb-4">
        <p className="font-semibold mb-2">스타일 선택</p>
        <div className="flex flex-wrap gap-2">
          {styleOptions.map((style) => (
            <button
              key={style}
              onClick={() => toggleItem(style, styles, setStyles)}
              className={`px-3 py-1 rounded-full border ${styles.includes(style) ? 'bg-black text-white' : 'bg-gray-100'}`}
            >
              {style}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <p className="font-semibold mb-2">선호 색상</p>
        <div className="flex flex-wrap gap-2">
          {colorOptions.map((color) => (
            <button
              key={color}
              onClick={() => toggleItem(color, colors, setColors)}
              className={`px-3 py-1 rounded-full border ${colors.includes(color) ? 'bg-black text-white' : 'bg-gray-100'}`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={handleSubmit}
        className="w-full py-3 rounded-full bg-black text-white hover:bg-gray-800 transition"
        disabled={isLoading}
      >
        {isLoading ? '추천 중...' : '추천받기'}
      </button>
    </section>
  );
};

export default UserInputPage;
