from pydantic import BaseModel
from typing import List, Dict, Optional
from datetime import datetime

class TrendReport(BaseModel):
    popular_styles: Dict[str, float]
    color_trends: Dict[str, Dict]
    upcoming_trends: Dict[str, Dict]

class ProductBase(BaseModel):
    product_name: str
    shop_name: str
    price: int
    likes: int
    reviews: int
    style: str
    category: str
    material: str
    color: str
    season: str
    image_url: str

class ProductList(BaseModel):
    products: List[ProductBase]

class TimeSeriesData(BaseModel):
    date: datetime
    sales: int
    stock: int

class SalesReport(BaseModel):
    product_name: str
    time_series: List[TimeSeriesData] 