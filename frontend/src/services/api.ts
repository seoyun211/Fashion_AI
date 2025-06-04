import axios from 'axios';

// 기본 Axios 인스턴스 설정
const api = axios.create({
  baseURL: 'https://your-backend-api.com/api', // 실제 API 주소로 수정!
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // 필요 없으면 제거 가능
});

// 예시: 스타일 추천 요청
export const postStyleRecommendation = async (userData: {
  gender: string;
  styles: string[];
  colors: string[];
}) => {
  const response = await api.post('/recommend', userData);
  return response.data;
};

// 예시: 트렌드 카드 데이터 요청
export const fetchTrendCards = async () => {
  const response = await api.get('/trends');
  return response.data;
};

export default api;
