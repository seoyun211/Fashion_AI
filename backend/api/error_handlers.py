from fastapi import Request
from fastapi.responses import JSONResponse
from api.exceptions import APIError

async def api_error_handler(request: Request, exc: APIError):
    """API 에러 핸들러"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": {
                "code": exc.error_code,
                "message": exc.detail,
                "additional_info": exc.additional_info
            }
        }
    )

async def general_exception_handler(request: Request, exc: Exception):
    """일반 예외 핸들러"""
    return JSONResponse(
        status_code=500,
        content={
            "error": {
                "code": "INTERNAL_SERVER_ERROR",
                "message": "내부 서버 오류가 발생했습니다.",
                "additional_info": {
                    "type": str(type(exc).__name__),
                    "detail": str(exc)
                }
            }
        }
    ) 