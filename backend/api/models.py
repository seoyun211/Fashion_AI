from typing import List, Optional
from pydantic import BaseModel

class Product(BaseModel):
    상품명: str
    가격: str
    쇼핑몰: str
    좋아요개수: str
    이미지: str
    리뷰수: str
    스타일: str
    카테고리: str
    소재: str
    색상: str
    시즌: str
    출시일: str

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