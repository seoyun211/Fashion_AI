from fastapi import APIRouter, HTTPException
from typing import List, Optional
from datetime import datetime, timedelta

from .models import TrendReport, ProductList, SalesReport
from ..models.trend_analysis_firebase import TrendAnalyzerFirebase
from ..firebase.firebase_admin import FirebaseAdmin

router = APIRouter()
trend_analyzer = TrendAnalyzerFirebase()
firebase = FirebaseAdmin()

@router.get("/trends/report", response_model=TrendReport)
async def get_trend_report():
    """트렌드 분석 리포트를 반환합니다."""
    try:
        report = trend_analyzer.generate_trend_report()
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/products/{shop_name}", response_model=ProductList)
async def get_products_by_shop(shop_name: str):
    """특정 쇼핑몰의 상품 목록을 반환합니다."""
    try:
        products = firebase.get_products_by_shop(shop_name)
        return {"products": products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/products/trending/{limit}", response_model=ProductList)
async def get_trending_products(limit: int = 10):
    """인기 상품 목록을 반환합니다."""
    try:
        products = firebase.get_trending_products(limit)
        return {"products": products}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/sales/{product_name}", response_model=SalesReport)
async def get_sales_data(product_name: str, days: Optional[int] = 30):
    """특정 상품의 판매 데이터를 반환합니다."""
    try:
        end_date = datetime.now()
        start_date = end_date - timedelta(days=days)
        sales_data = firebase.get_sales_data_by_date_range(start_date, end_date)
        
        # 특정 상품의 데이터만 필터링
        product_sales = [data for data in sales_data if data["product_name"] == product_name]
        
        return {
            "product_name": product_name,
            "time_series": product_sales
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 