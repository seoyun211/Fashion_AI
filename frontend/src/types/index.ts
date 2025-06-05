// types/index.ts
export interface Category {
  id: string;
  name: string;
  icon: string;
  gradient: string;
}

export interface PopularProduct {
  id: string;
  name: string;
  price: string;
  rank: number;
}

export interface AIRecommendation {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'style' | 'color' | 'occasion';
}

// 
