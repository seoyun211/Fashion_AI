import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import os
from collections import Counter
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LinearRegression

class TrendAnalyzer:
    def __init__(self, data_path='backend/data'):
        self.data_path = data_path
        self.shops = ['무신사', '지그재그', '더블유컨셉', '29cm']
        self.products_data = {}
        self.time_series_data = {}
        self.load_data()
        
    def load_data(self):
        """데이터 로드"""
        for shop in self.shops:
            # 상품 기본 정보 로드
            products_file = f"{self.data_path}/{shop.lower()}_products.csv"
            self.products_data[shop] = pd.read_csv(products_file)
            
            # 시계열 데이터 로드
            time_series_file = f"{self.data_path}/{shop.lower()}_time_series.csv"
            self.time_series_data[shop] = pd.read_csv(time_series_file)
            self.time_series_data[shop]['날짜'] = pd.to_datetime(self.time_series_data[shop]['날짜'])

    def analyze_popular_styles(self, days=7):
        """
        최근 N일간 인기 있는 스타일 분석
        - 좋아요 수와 판매량을 기반으로 계산
        """
        popular_styles = []
        
        for shop in self.shops:
            df = self.products_data[shop]
            
            # 좋아요 수 기반 가중치 계산
            df['좋아요개수'] = df['좋아요개수'].astype(int)
            df['가중치'] = df['좋아요개수'] / df['좋아요개수'].max()
            
            # 스타일별 가중치 합계
            style_weights = df.groupby('스타일')['가중치'].sum()
            popular_styles.extend([(style, weight) for style, weight in style_weights.items()])
        
        # 전체 스타일 순위 계산
        style_ranking = pd.DataFrame(popular_styles, columns=['스타일', '가중치'])
        style_ranking = style_ranking.groupby('스타일')['가중치'].sum().sort_values(ascending=False)
        
        return style_ranking

    def analyze_price_trends(self):
        """가격대별 트렌드 분석"""
        price_trends = {}
        
        for shop in self.shops:
            df = self.products_data[shop]
            df['가격'] = df['가격'].str.replace(',', '').astype(int)
            
            # 가격대 구간 설정
            df['가격대'] = pd.cut(df['가격'], 
                              bins=[0, 30000, 50000, 100000, 200000, float('inf')],
                              labels=['3만원 이하', '3-5만원', '5-10만원', '10-20만원', '20만원 이상'])
            
            price_trends[shop] = df.groupby(['가격대', '스타일']).size().unstack(fill_value=0)
        
        return price_trends

    def analyze_seasonal_trends(self):
        """시즌별 트렌드 분석"""
        seasonal_trends = {}
        
        for shop in self.shops:
            df = self.products_data[shop]
            seasonal_trends[shop] = df.groupby(['시즌', '스타일']).size().unstack(fill_value=0)
        
        return seasonal_trends

    def analyze_sales_trends(self, days=30):
        """판매량 기반 트렌드 분석"""
        sales_trends = {}
        
        for shop in self.shops:
            df = self.time_series_data[shop]
            
            # 일별 총 판매량
            daily_sales = df.groupby('날짜')['판매량'].sum().sort_index()
            
            # 이동 평균 계산
            sales_trends[shop] = daily_sales.rolling(window=7).mean()
        
        return sales_trends

    def get_trending_items(self, top_n=10):
        """현재 가장 트렌디한 상품 추출"""
        trending_items = []
        
        for shop in self.shops:
            df = self.products_data[shop]
            
            # 좋아요 수와 리뷰수 정규화
            scaler = MinMaxScaler()
            df['normalized_likes'] = scaler.fit_transform(df['좋아요개수'].astype(int).values.reshape(-1, 1))
            df['normalized_reviews'] = scaler.fit_transform(df['리뷰수'].astype(int).values.reshape(-1, 1))
            
            # 트렌드 점수 계산
            df['trend_score'] = (df['normalized_likes'] * 0.7) + (df['normalized_reviews'] * 0.3)
            
            # 상위 상품 선정
            top_items = df.nlargest(top_n, 'trend_score')[['상품명', '스타일', '가격', 'trend_score']]
            trending_items.append(top_items)
        
        return pd.concat(trending_items).nlargest(top_n, 'trend_score')

    def analyze_color_trends(self):
        """색상별 트렌드 분석"""
        color_trends = {}
        rising_colors = {}
        
        for shop in self.shops:
            df = self.products_data[shop]
            
            # 색상별 인기도 점수 계산
            df['좋아요개수'] = df['좋아요개수'].astype(int)
            df['리뷰수'] = df['리뷰수'].astype(int)
            
            # 색상별 평균 인기도 계산
            color_popularity = df.groupby('색상').agg({
                '좋아요개수': 'mean',
                '리뷰수': 'mean'
            })
            
            # 정규화
            scaler = MinMaxScaler()
            color_popularity['normalized_score'] = scaler.fit_transform(
                (color_popularity['좋아요개수'] + color_popularity['리뷰수']).values.reshape(-1, 1)
            )
            
            color_trends[shop] = color_popularity.sort_values('normalized_score', ascending=False)
            
            # 상승세 분석
            time_series = self.time_series_data[shop]
            merged_data = pd.merge(time_series, df[['상품명', '색상']], on='상품명')
            
            # 색상별 일일 판매량 추세
            daily_color_sales = merged_data.groupby(['날짜', '색상'])['판매량'].sum().reset_index()
            
            # 색상별 판매량 추세 계산
            for color in df['색상'].unique():
                color_sales = daily_color_sales[daily_color_sales['색상'] == color]
                if len(color_sales) > 7:  # 최소 7일치 데이터 필요
                    X = np.arange(len(color_sales)).reshape(-1, 1)
                    y = color_sales['판매량'].values
                    
                    model = LinearRegression()
                    model.fit(X, y)
                    
                    # 기울기(추세)를 저장
                    if shop not in rising_colors:
                        rising_colors[shop] = {}
                    rising_colors[shop][color] = model.coef_[0]
        
        return color_trends, rising_colors

    def analyze_item_type_trends(self):
        """의류 종류별 트렌드 분석"""
        item_trends = {}
        rising_items = {}
        
        for shop in self.shops:
            df = self.products_data[shop]
            
            # 상품명에서 의류 종류 추출 (마지막 단어)
            df['의류종류'] = df['상품명'].apply(lambda x: x.split()[-1])
            
            # 의류 종류별 인기도 점수 계산
            item_popularity = df.groupby('의류종류').agg({
                '좋아요개수': 'mean',
                '리뷰수': 'mean'
            })
            
            # 정규화
            scaler = MinMaxScaler()
            item_popularity['normalized_score'] = scaler.fit_transform(
                (item_popularity['좋아요개수'] + item_popularity['리뷰수']).values.reshape(-1, 1)
            )
            
            item_trends[shop] = item_popularity.sort_values('normalized_score', ascending=False)
            
            # 상승세 분석
            time_series = self.time_series_data[shop]
            merged_data = pd.merge(time_series, df[['상품명', '의류종류']], on='상품명')
            
            # 의류 종류별 일일 판매량 추세
            daily_item_sales = merged_data.groupby(['날짜', '의류종류'])['판매량'].sum().reset_index()
            
            # 의류 종류별 판매량 추세 계산
            for item_type in df['의류종류'].unique():
                item_sales = daily_item_sales[daily_item_sales['의류종류'] == item_type]
                if len(item_sales) > 7:  # 최소 7일치 데이터 필요
                    X = np.arange(len(item_sales)).reshape(-1, 1)
                    y = item_sales['판매량'].values
                    
                    model = LinearRegression()
                    model.fit(X, y)
                    
                    # 기울기(추세)를 저장
                    if shop not in rising_items:
                        rising_items[shop] = {}
                    rising_items[shop][item_type] = model.coef_[0]
        
        return item_trends, rising_items

    def predict_upcoming_trends(self):
        """다가오는 트렌드 예측"""
        color_trends, rising_colors = self.analyze_color_trends()
        item_trends, rising_items = self.analyze_item_type_trends()
        
        upcoming_trends = {
            'colors': {},
            'items': {}
        }
        
        # 전체 쇼핑몰의 상승세 종합
        for shop in self.shops:
            # 색상 트렌드
            if shop in rising_colors:
                for color, trend in rising_colors[shop].items():
                    if color not in upcoming_trends['colors']:
                        upcoming_trends['colors'][color] = 0
                    upcoming_trends['colors'][color] += trend
            
            # 의류 종류 트렌드
            if shop in rising_items:
                for item, trend in rising_items[shop].items():
                    if item not in upcoming_trends['items']:
                        upcoming_trends['items'][item] = 0
                    upcoming_trends['items'][item] += trend
        
        # 상위 5개 상승 트렌드 선정
        upcoming_trends['colors'] = dict(sorted(upcoming_trends['colors'].items(), 
                                              key=lambda x: x[1], 
                                              reverse=True)[:5])
        upcoming_trends['items'] = dict(sorted(upcoming_trends['items'].items(), 
                                             key=lambda x: x[1], 
                                             reverse=True)[:5])
        
        return upcoming_trends

    def generate_trend_report(self):
        """종합 트렌드 리포트 생성"""
        report = {
            'popular_styles': self.analyze_popular_styles(),
            'price_trends': self.analyze_price_trends(),
            'seasonal_trends': self.analyze_seasonal_trends(),
            'sales_trends': self.analyze_sales_trends(),
            'trending_items': self.get_trending_items(),
            'color_trends': self.analyze_color_trends()[0],
            'item_type_trends': self.analyze_item_type_trends()[0],
            'upcoming_trends': self.predict_upcoming_trends()
        }
        return report

# 사용 예시
if __name__ == "__main__":
    analyzer = TrendAnalyzer()
    report = analyzer.generate_trend_report()
    
    print("\n=== 트렌드 분석 리포트 ===")
    print("\n1. 인기 스타일 순위:")
    print(report['popular_styles'])
    
    print("\n2. 가장 트렌디한 상품 TOP 10:")
    print(report['trending_items'][['상품명', '스타일', '가격']])
    
    print("\n3. 색상별 트렌드:")
    for shop, trends in report['color_trends'].items():
        print(f"\n{shop} 색상 트렌드:")
        print(trends)
    
    print("\n4. 의류 종류별 트렌드:")
    for shop, trends in report['item_type_trends'].items():
        print(f"\n{shop} 의류 종류 트렌드:")
        print(trends)
    
    print("\n5. 다가오는 트렌드 예측:")
    print("\n상승세인 색상:")
    for color, trend in report['upcoming_trends']['colors'].items():
        print(f"{color}: {trend:.2f}")
    print("\n상승세인 의류 종류:")
    for item, trend in report['upcoming_trends']['items'].items():
        print(f"{item}: {trend:.2f}") 