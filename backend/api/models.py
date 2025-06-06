from typing import List, Dict, Any
from pydantic import BaseModel
from datetime import date

class Product(BaseModel):
    """상품 정보 모델"""
    id: str
    name: str
    price: int
    shop: str
    likes: int
    image: str
    reviews: int
    style: str
    category: str
    material: str
    color: str
    season: str
    release_date: date

class DataPoint(BaseModel):
    """데이터 포인트"""
    date: date
    count: int

class TrendData(BaseModel):
    """트렌드 데이터"""
    sales_trend: List[DataPoint]
    stock_trend: List[DataPoint]

class FilterOptions(BaseModel):
    """필터 옵션"""
    categories: List[str]
    styles: List[str]
    materials: List[str]
    colors: List[str]
    seasons: List[str]

class ImageSearchResult(BaseModel):
    """이미지 검색 결과"""
    result_url: str

class Error(BaseModel):
    """에러 정보"""
    code: str
    message: str
    additional_info: Dict[str, Any] = {}

class ErrorResponse(BaseModel):
    """에러 응답"""
    error: Error 