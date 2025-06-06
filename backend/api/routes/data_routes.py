from fastapi import APIRouter, HTTPException
from typing import List
import pandas as pd
import os
from datetime import datetime
from ..models import Product, TrendData, FilterOptions
from ..utils.cache import cache

router = APIRouter()

# 데이터 파일 경로
DATA_DIR = "backend/data"

def _load_products():
    """상품 데이터를 로드하고 변환합니다."""
    all_products = []
    for shop in ['무신사', '지그재그', '더블유컨셉', '29cm']:
        file_path = os.path.join(DATA_DIR, f"{shop.lower()}_products.csv")
        if os.path.exists(file_path):
            df = pd.read_csv(file_path)
            products = df.to_dict('records')
            for product in products:
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

def _load_trends():
    """트렌드 데이터를 로드하고 변환합니다."""
    all_time_series = []
    for shop in ['무신사', '지그재그', '더블유컨셉', '29cm']:
        file_path = os.path.join(DATA_DIR, f"{shop.lower()}_time_series.csv")
        if os.path.exists(file_path):
            df = pd.read_csv(file_path)
            df = df.rename(columns={'날짜': 'date', '판매량': 'sales', '재고량': 'stock'})
            time_series = df.to_dict('records')
            all_time_series.extend(time_series)
    
    sales_trend = []
    stock_trend = []
    
    for data in all_time_series:
        date_obj = datetime.strptime(data["date"], "%Y-%m-%d").date()
        sales_trend.append({
            "date": date_obj,
            "count": int(data["sales"])
        })
        stock_trend.append({
            "date": date_obj,
            "count": int(data["stock"])
        })
    
    sales_df = pd.DataFrame(sales_trend)
    stock_df = pd.DataFrame(stock_trend)
    
    if not sales_df.empty:
        sales_df = sales_df.groupby('date')['count'].sum().reset_index()
    if not stock_df.empty:
        stock_df = stock_df.groupby('date')['count'].sum().reset_index()
    
    return {
        "sales_trend": sales_df.to_dict('records') if not sales_df.empty else [],
        "stock_trend": stock_df.to_dict('records') if not stock_df.empty else []
    }

@router.get("/products", response_model=List[Product])
async def get_products():
    try:
        # 캐시에서 데이터 확인
        cached_products = cache.get("products")
        if cached_products is not None:
            return cached_products
        
        # 캐시에 없으면 데이터 로드
        products = _load_products()
        cache.set("products", products)
        return products
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/trends", response_model=TrendData)
async def get_trends():
    try:
        # 캐시에서 데이터 확인
        cached_trends = cache.get("trends")
        if cached_trends is not None:
            return cached_trends
        
        # 캐시에 없으면 데이터 로드
        trends = _load_trends()
        cache.set("trends", trends)
        return trends
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 필터 옵션은 정적 데이터이므로 변수로 정의
FILTER_OPTIONS = {
    "categories": ['상의', '하의', '원피스', '아우터'],
    "styles": ['캐주얼', '스트릿', '미니멀', '러블리', '빈티지', '스포티', '클래식', '모던'],
    "materials": ['면', '린넨', '데님', '실크', '니트', '폴리에스터', '울', '레이온'],
    "colors": ['블랙', '화이트', '네이비', '베이지', '그레이', '브라운', '카키', '레드', '블루'],
    "seasons": ['봄', '여름', '가을', '겨울', '사계절']
}

@router.get("/filter-options", response_model=FilterOptions)
async def get_filter_options():
    return FILTER_OPTIONS 