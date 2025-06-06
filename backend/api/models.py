from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import date

class Product(BaseModel):
    """상품 정보 모델"""
    id: str = Field(..., description="상품 고유 ID")
    name: str = Field(..., description="상품명")
    price: int = Field(..., description="가격", gt=0)
    shop: str = Field(..., description="쇼핑몰 이름")
    likes: int = Field(..., description="좋아요 수", ge=0)
    image: str = Field(..., description="상품 이미지 URL")
    reviews: int = Field(..., description="리뷰 수", ge=0)
    style: str = Field(..., description="스타일")
    category: str = Field(..., description="카테고리")
    material: str = Field(..., description="소재")
    color: str = Field(..., description="색상")
    season: str = Field(..., description="시즌")
    release_date: date = Field(..., description="출시일")

class TimeSeriesData(BaseModel):
    date: str
    value: int

class TrendReport(BaseModel):
    salesTrend: List[TimeSeriesData]
    stockTrend: List[TimeSeriesData]

class ProductList(BaseModel):
    products: List[Product]
    total: int

class SalesReport(BaseModel):
    daily: List[TimeSeriesData]
    weekly: List[TimeSeriesData]
    monthly: List[TimeSeriesData]

class TrendPoint(BaseModel):
    """트렌드 데이터 포인트"""
    date: date = Field(..., description="날짜")
    value: int = Field(..., description="값")

class TrendData(BaseModel):
    """트렌드 데이터"""
    sales_trend: List[TrendPoint] = Field(..., description="판매량 트렌드")
    stock_trend: List[TrendPoint] = Field(..., description="재고량 트렌드")

class FilterOptions(BaseModel):
    """필터 옵션"""
    categories: List[str] = Field(..., description="카테고리 목록")
    styles: List[str] = Field(..., description="스타일 목록")
    materials: List[str] = Field(..., description="소재 목록")
    colors: List[str] = Field(..., description="색상 목록")
    seasons: List[str] = Field(..., description="시즌 목록")

class ImageSearchResult(BaseModel):
    """이미지 검색 결과"""
    result_url: str = Field(..., description="검색 결과 URL")

class ErrorResponse(BaseModel):
    """에러 응답"""
    error: dict = Field(
        ...,
        description="에러 정보",
        example={
            "code": "ERROR_CODE",
            "message": "에러 메시지",
            "additional_info": {}
        }
    ) 