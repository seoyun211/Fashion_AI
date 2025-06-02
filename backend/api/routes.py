from fastapi import APIRouter, HTTPException, Query, Path
from typing import List, Optional
from datetime import datetime, timedelta

from .models import TrendReport, ProductList, SalesReport
from ..models.trend_analysis_firebase import TrendAnalyzerFirebase
from ..firebase.firebase_admin import FirebaseAdmin
from .exceptions import (
    ShopNotFoundError,
    ProductNotFoundError,
    InvalidDateRangeError,
    DatabaseError,
    InvalidParameterError,
    TrendAnalysisError
)

router = APIRouter()
trend_analyzer = TrendAnalyzerFirebase()
firebase = FirebaseAdmin()

VALID_SHOPS = ['무신사', '지그재그', '더블유컨셉', '29CM']

@router.get("/trends/report", response_model=TrendReport)
async def get_trend_report():
    """트렌드 분석 리포트를 반환합니다."""
    try:
        report = trend_analyzer.generate_trend_report()
        return report
    except Exception as e:
        raise TrendAnalysisError(str(e))

@router.get("/products/{shop_name}", response_model=ProductList)
async def get_products_by_shop(
    shop_name: str = Path(..., description="쇼핑몰 이름"),
    limit: int = Query(50, ge=1, le=100, description="반환할 최대 상품 수"),
    category: Optional[str] = Query(None, description="상품 카테고리"),
    min_price: Optional[int] = Query(None, ge=0, description="최소 가격"),
    max_price: Optional[int] = Query(None, ge=0, description="최대 가격")
):
    """특정 쇼핑몰의 상품 목록을 반환합니다."""
    try:
        if shop_name not in VALID_SHOPS:
            raise ShopNotFoundError(shop_name)
            
        if min_price is not None and max_price is not None and min_price > max_price:
            raise InvalidParameterError("price_range", "최소 가격이 최대 가격보다 큽니다")
            
        products = firebase.get_products_by_shop(shop_name)
        
        # 필터링 적용
        filtered_products = products
        if category:
            filtered_products = [p for p in filtered_products if p["category"] == category]
        if min_price:
            filtered_products = [p for p in filtered_products if p["price"] >= min_price]
        if max_price:
            filtered_products = [p for p in filtered_products if p["price"] <= max_price]
            
        # 결과 개수 제한
        filtered_products = filtered_products[:limit]
        
        return {"products": filtered_products}
    except ShopNotFoundError:
        raise
    except Exception as e:
        raise DatabaseError("get_products", str(e))

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