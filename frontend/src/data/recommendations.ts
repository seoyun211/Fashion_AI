import { AIRecommendation } from '../types';

export const recommendations: AIRecommendation[] = [
  {
    id: '1',
    title: '스타일 분석',
    description: '당신의 취향을 분석하여 완벽한 스타일을 추천해드립니다',
    icon: '✨',
    type: 'style'
  },
  {
    id: '2',
    title: '이 옷 뭐지?',
    description: '사진을 넣어 내가 찾는 그 옷을 AI가 찾아드립니다',
    icon: '🎨',
    type: 'color'
  },
  {
    id: '3',
    title: '상황별 추천',
    description: '데이트, 회사, 파티 등 상황에 맞는 완벽한 코디를 제안합니다',
    icon: '📅',
    type: 'occasion'
  }
];

