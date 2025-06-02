from fastapi import APIRouter, HTTPException, Query, Path
from typing import List, Optional
from datetime import datetime, timedelta
import os
import pandas as pd

from api.models import TrendReport, ProductList, SalesReport
from api.exceptions import (
    ShopNotFoundError,
    ProductNotFoundError,
    InvalidDateRangeError,
    DatabaseError,
    InvalidParameterError,
    TrendAnalysisError
)

router = APIRouter()

# 데이터 파일 경로
DATA_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data")

VALID_SHOPS = ['무신사', '지그재그', '더블유컨셉', '29CM']

@router.get("/products")
async def get_products(
    category: Optional[str] = None,
    style: Optional[str] = None,
    min_price: Optional[int] = None,
    max_price: Optional[int] = None
):
    """상품 목록을 반환합니다."""
    try:
        all_products = []
        for shop in ['무신사', '지그재그', '더블유컨셉', '29cm']:
            file_path = os.path.join(DATA_DIR, f"{shop.lower()}_products.csv")
            if os.path.exists(file_path):
                df = pd.read_csv(file_path)
                products = df.to_dict('records')
                for product in products:
                    # 프론트엔드에서 사용할 형식으로 키 이름 변경
                    all_products.append({
                        "id": str(len(all_products) + 1),  # 임시 ID 생성
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
                        "releaseDate": product["출시일"]
                    })

        # 필터링 적용
        filtered_products = all_products
        if category:
            filtered_products = [p for p in filtered_products if p["category"] == category]
        if style:
            filtered_products = [p for p in filtered_products if p["style"] == style]
        if min_price:
            filtered_products = [p for p in filtered_products if p["price"] >= min_price]
        if max_price:
            filtered_products = [p for p in filtered_products if p["price"] <= max_price]

        # products 배열을 직접 반환
        return filtered_products
    except Exception as e:
        raise DatabaseError("get_products", str(e))

@router.get("/trends")
async def get_trends():
    """트렌드 데이터를 반환합니다."""
    try:
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
            sales_trend.append({
                "date": data["date"],
                "value": data["sales"]
            })
            stock_trend.append({
                "date": data["date"],
                "value": data["stock"]
            })

        # 날짜별로 집계
        sales_df = pd.DataFrame(sales_trend)
        stock_df = pd.DataFrame(stock_trend)

        if not sales_df.empty:
            sales_df = sales_df.groupby('date')['value'].sum().reset_index()
        if not stock_df.empty:
            stock_df = stock_df.groupby('date')['value'].sum().reset_index()

        return {
            "salesTrend": sales_df.to_dict('records') if not sales_df.empty else [],
            "stockTrend": stock_df.to_dict('records') if not stock_df.empty else []
        }
    except Exception as e:
        raise DatabaseError("get_trends", str(e))

@router.get("/filter-options")
async def get_filter_options():
    """필터 옵션을 반환합니다."""
    return {
        "categories": ['상의', '하의', '원피스', '아우터'],
        "styles": ['캐주얼', '스트릿', '미니멀', '러블리', '빈티지', '스포티', '클래식', '모던'],
        "materials": ['면', '린넨', '데님', '실크', '니트', '폴리에스터', '울', '레이온'],
        "colors": ['블랙', '화이트', '네이비', '베이지', '그레이', '브라운', '카키', '레드', '블루'],
        "seasons": ['봄', '여름', '가을', '겨울', '사계절']
    }

@router.get("/products/trending/{limit}", response_model=ProductList)
async def get_trending_products(
    limit: int = Path(..., ge=1, le=100, description="반환할 상품 수"),
    time_range: int = Query(7, ge=1, le=30, description="집계 기간(일)")
):
    """인기 상품 목록을 반환합니다."""
    try:
        if limit < 1 or limit > 100:
            raise InvalidParameterError("limit", "1에서 100 사이의 값이어야 합니다")
            
        products = firebase.get_trending_products(limit)
        return {"products": products}
    except InvalidParameterError:
        raise
    except Exception as e:
        raise DatabaseError("get_trending_products", str(e))

@router.get("/sales/{product_name}", response_model=SalesReport)
async def get_sales_data(
    product_name: str = Path(..., description="상품명"),
    days: int = Query(30, ge=1, le=365, description="조회 기간(일)")
):
    """특정 상품의 판매 데이터를 반환합니다."""
    try:
        if days < 1 or days > 365:
            raise InvalidParameterError("days", "1에서 365 사이의 값이어야 합니다")
            
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        
        # 상품 존재 여부 확인
        product_exists = False
        for shop in VALID_SHOPS:
            products = firebase.get_products_by_shop(shop)
            if any(p["product_name"] == product_name for p in products):
                product_exists = True
                break
                
        if not product_exists:
            raise ProductNotFoundError(product_name)
            
        sales_data = firebase.get_sales_data_by_date_range(start_date, end_date)
        product_sales = [data for data in sales_data if data["product_name"] == product_name]
        
        return {
            "product_name": product_name,
            "time_series": product_sales
        }
    except (ProductNotFoundError, InvalidParameterError):
        raise
    except Exception as e:
        raise DatabaseError("get_sales_data", str(e)) 