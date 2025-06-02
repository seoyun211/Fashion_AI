from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import router
from .exceptions import APIError
from .error_handlers import api_error_handler, general_exception_handler

app = FastAPI(
    title="Fashion AI API",
    description="패션 트렌드 분석 및 추천 API",
    version="1.0.0"
)

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 실제 운영 환경에서는 구체적인 도메인을 지정해야 합니다
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 에러 핸들러 등록
app.add_exception_handler(APIError, api_error_handler)
app.add_exception_handler(Exception, general_exception_handler)

# 라우터 등록
app.include_router(router, prefix="/api/v1")

@app.get("/")
async def root():
    return {
        "message": "Fashion AI API에 오신 것을 환영합니다",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    } 