from fastapi import HTTPException
from typing import Any, Optional, Dict

class APIError(HTTPException):
    def __init__(
        self,
        status_code: int,
        detail: str,
        error_code: str,
        additional_info: Optional[Dict[str, Any]] = None
    ):
        super().__init__(status_code=status_code, detail=detail)
        self.error_code = error_code
        self.additional_info = additional_info or {}

class ShopNotFoundError(APIError):
    def __init__(self, shop_name: str):
        super().__init__(
            status_code=404,
            detail=f"쇼핑몰 '{shop_name}'을(를) 찾을 수 없습니다.",
            error_code="SHOP_NOT_FOUND",
            additional_info={"shop_name": shop_name}
        )

class ProductNotFoundError(APIError):
    def __init__(self, product_name: str):
        super().__init__(
            status_code=404,
            detail=f"상품 '{product_name}'을(를) 찾을 수 없습니다.",
            error_code="PRODUCT_NOT_FOUND",
            additional_info={"product_name": product_name}
        )

class InvalidDateRangeError(APIError):
    def __init__(self, start_date: str, end_date: str):
        super().__init__(
            status_code=400,
            detail=f"잘못된 날짜 범위입니다: {start_date} - {end_date}",
            error_code="INVALID_DATE_RANGE",
            additional_info={"start_date": start_date, "end_date": end_date}
        )

class DatabaseError(APIError):
    def __init__(self, operation: str, detail: str):
        super().__init__(
            status_code=500,
            detail=f"데이터베이스 작업 중 오류 발생: {detail}",
            error_code="DATABASE_ERROR",
            additional_info={"operation": operation}
        )

class InvalidParameterError(APIError):
    def __init__(self, parameter: str, reason: str):
        super().__init__(
            status_code=400,
            detail=f"잘못된 매개변수 '{parameter}': {reason}",
            error_code="INVALID_PARAMETER",
            additional_info={"parameter": parameter, "reason": reason}
        )

class TrendAnalysisError(APIError):
    def __init__(self, detail: str):
        super().__init__(
            status_code=500,
            detail=f"트렌드 분석 중 오류 발생: {detail}",
            error_code="TREND_ANALYSIS_ERROR"
        ) 