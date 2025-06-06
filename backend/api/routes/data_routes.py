from fastapi import APIRouter, HTTPException
from typing import List
import pandas as pd
import os
from datetime import datetime
from ..models import Product, TrendData, FilterOptions

router = APIRouter()

# 데이터 파일 경로
DATA_DIR = "backend/data"

@router.get("/products", response_model=List[Product])
async def get_products():
    try:
        # 모든 쇼핑몰의 상품 데이터를 합칩니다
        all_products = []
        for shop in ['무신사', '지그재그', '더블유컨셉', '29cm']:
            file_path = os.path.join(DATA_DIR, f"{shop.lower()}_products.csv")
            if os.path.exists(file_path):
                df = pd.read_csv(file_path)
                products = df.to_dict('records')
                for product in products:
                    # 데이터를 Pydantic 모델 형식으로 변환
                    all_products.append({
                        "id": str(len(all_products) + 1),
                        "name": product["상품명"],
                        "price": int(str(product["가격"]).replace(",", "")),
                        "shop": product["쇼핑몰"],
                        "likes": int(product["좋아요개수"]),
                        "image": product["이미지"],
                        "reviews": int(product["리뷰수"]),
                        "style": product["스타일"],
                        "category": product["카테고리"],
                        "material": product["소재"],
                        "color": product["색상"],
                        "season": product["시즌"],
                        "release_date": datetime.strptime(product["출시일"], "%Y-%m-%d").date()
                    })
        return all_products
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trends", response_model=TrendData)
async def get_trends():
    try:
        # 모든 쇼핑몰의 시계열 데이터를 합칩니다
        all_time_series = []
        for shop in ['무신사', '지그재그', '더블유컨셉', '29cm']:
            file_path = os.path.join(DATA_DIR, f"{shop.lower()}_time_series.csv")
            if os.path.exists(file_path):
                df = pd.read_csv(file_path)
                df = df.rename(columns={'날짜': 'date', '판매량': 'sales', '재고량': 'stock'})
                time_series = df.to_dict('records')
                all_time_series.extend(time_series)
        
        # 판매량과 재고량 트렌드를 분리
        sales_trend = []
        stock_trend = []
        
        for data in all_time_series:
            date_obj = datetime.strptime(data["date"], "%Y-%m-%d").date()
            sales_trend.append({
                "date": date_obj,
                "value": int(data["sales"])
            })
            stock_trend.append({
                "date": date_obj,
                "value": int(data["stock"])
            })
        
        # 날짜별로 집계
        sales_df = pd.DataFrame(sales_trend)
        stock_df = pd.DataFrame(stock_trend)
        
        if not sales_df.empty:
            sales_df = sales_df.groupby('date')['value'].sum().reset_index()
        if not stock_df.empty:
            stock_df = stock_df.groupby('date')['value'].sum().reset_index()
        
        return {
            "sales_trend": sales_df.to_dict('records') if not sales_df.empty else [],
            "stock_trend": stock_df.to_dict('records') if not stock_df.empty else []
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/filter-options", response_model=FilterOptions)
async def get_filter_options():
    return {
        "categories": ['상의', '하의', '원피스', '아우터'],
        "styles": ['캐주얼', '스트릿', '미니멀', '러블리', '빈티지', '스포티', '클래식', '모던'],
        "materials": ['면', '린넨', '데님', '실크', '니트', '폴리에스터', '울', '레이온'],
        "colors": ['블랙', '화이트', '네이비', '베이지', '그레이', '브라운', '카키', '레드', '블루'],
        "seasons": ['봄', '여름', '가을', '겨울', '사계절']
    } 