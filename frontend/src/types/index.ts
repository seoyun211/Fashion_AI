// 사용자 입력 정보 타입
export interface UserStyleInput {
  gender: 'male' | 'female';
  styles: string[];
  colors: string[];
}

// 추천 결과 항목 타입
export interface Recommendation {
  name: string;
  image: string;
  reason: string;
}
