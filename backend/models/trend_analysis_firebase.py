import pandas as pd
import numpy as np
from datetime import datetime, timedelta
from sklearn.preprocessing import MinMaxScaler
from sklearn.linear_model import LinearRegression
import os
import sys

# Add the project root directory to Python path
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from backend.firebase.firebase_helper import FirebaseAdmin

class TrendAnalyzerFirebase:
    def __init__(self):
        self.firebase = FirebaseAdmin()
        self.shops = ['무신사', '지그재그', '더블유컨셉', '29cm']
        
    def get_products_data(self, shop_name):
        """Firebase에서 상품 데이터 조회"""
        products = self.firebase.get_products_by_shop(shop_name)
        return pd.DataFrame(products)
    
    def get_sales_data(self, start_date, end_date):
        """Firebase에서 판매 데이터 조회"""
        sales = self.firebase.get_sales_data_by_date_range(start_date, end_date)
        return pd.DataFrame(sales)

    def analyze_popular_styles(self, days=7):
        """인기 스타일 분석"""
        popular_styles = []
        
        for shop in self.shops:
            df = self.get_products_data(shop)
            if df.empty:
                continue
                
            # 좋아요 수 기반 가중치 계산
            df['가중치'] = df['likes'] / df['likes'].max()
            
            # 스타일별 가중치 합계
            style_weights = df.groupby('style')['가중치'].sum()
            popular_styles.extend([(style, weight) for style, weight in style_weights.items()])
        
        # 전체 스타일 순위 계산
        style_ranking = pd.DataFrame(popular_styles, columns=['스타일', '가중치'])
        style_ranking = style_ranking.groupby('스타일')['가중치'].sum().sort_values(ascending=False)
        
        return style_ranking

    def analyze_color_trends(self):
        """색상 트렌드 분석"""
        color_trends = {}
        rising_colors = {}
        
        end_date = datetime.now()
        start_date = end_date - timedelta(days=30)
        
        for shop in self.shops:
            # 상품 데이터 조회
            products_df = self.get_products_data(shop)
            if products_df.empty:
                continue
                
            # 판매 데이터 조회
            sales_df = self.get_sales_data(start_date, end_date)
            if sales_df.empty:
                continue
            
            # 색상별 인기도 계산
            color_popularity = products_df.groupby('color').agg({
                'likes': 'mean',
                'reviews': 'mean'
            })
            
            # 정규화
            scaler = MinMaxScaler()
            color_popularity['normalized_score'] = scaler.fit_transform(
                (color_popularity['likes'] + color_popularity['reviews']).values.reshape(-1, 1)
            )
            
            color_trends[shop] = color_popularity.sort_values('normalized_score', ascending=False)
            
            # 색상별 판매량 추세 분석
            merged_data = pd.merge(sales_df, products_df[['product_name', 'color']], 
                                 left_on='product_name', right_on='product_name')
            
            daily_color_sales = merged_data.groupby(['date', 'color'])['sales'].sum().reset_index()
            
            for color in products_df['color'].unique():
                color_sales = daily_color_sales[daily_color_sales['color'] == color]
                if len(color_sales) > 7:
                    X = np.arange(len(color_sales)).reshape(-1, 1)
                    y = color_sales['sales'].values
                    
                    model = LinearRegression()
                    model.fit(X, y)
                    
                    if shop not in rising_colors:
                        rising_colors[shop] = {}
                    rising_colors[shop][color] = model.coef_[0]
        
        return color_trends, rising_colors

    def predict_upcoming_trends(self):
        """트렌드 예측"""
        color_trends, rising_colors = self.analyze_color_trends()
        
        upcoming_trends = {
            'colors': {},
            'trending_products': self.firebase.get_trending_products(limit=10)
        }
        
        # 전체 쇼핑몰의 상승세 종합
        for shop in self.shops:
            if shop in rising_colors:
                for color, trend in rising_colors[shop].items():
                    if color not in upcoming_trends['colors']:
                        upcoming_trends['colors'][color] = 0
                    upcoming_trends['colors'][color] += trend
        
        # 상위 5개 상승 트렌드 선정
        upcoming_trends['colors'] = dict(sorted(upcoming_trends['colors'].items(), 
                                              key=lambda x: x[1], 
                                              reverse=True)[:5])
        
        return upcoming_trends

    def generate_trend_report(self):
        """종합 트렌드 리포트 생성"""
        report = {
            'popular_styles': self.analyze_popular_styles(),
            'color_trends': self.analyze_color_trends()[0],
            'upcoming_trends': self.predict_upcoming_trends()
        }
        return report

# 사용 예시
if __name__ == "__main__":
    analyzer = TrendAnalyzerFirebase()
    report = analyzer.generate_trend_report()
    
    print("\n=== Firebase 기반 트렌드 분석 리포트 ===")
    
    print("\n1. 인기 스타일 순위:")
    print(report['popular_styles'])
    
    print("\n2. 색상별 트렌드:")
    for shop, trends in report['color_trends'].items():
        print(f"\n{shop} 색상 트렌드:")
        print(trends)
    
    print("\n3. 다가오는 트렌드:")
    print("\n상승세인 색상:")
    for color, trend in report['upcoming_trends']['colors'].items():
        print(f"{color}: {trend:.2f}")
    
    print("\n인기 상품 TOP 10:")
    for product in report['upcoming_trends']['trending_products']:
        print(f"{product['product_name']} ({product['shop_name']}) - {product['likes']} likes") 