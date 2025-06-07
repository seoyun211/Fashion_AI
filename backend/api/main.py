import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from api.routes import router
from routers.image_search import router as image_router
from api.exceptions import APIError
from api.error_handlers import api_error_handler, general_exception_handler
from api.utils.file_cleanup import temp_manager

@asynccontextmanager
async def lifespan(app: FastAPI):
    """애플리케이션 시작 및 종료 시 실행되는 이벤트 핸들러"""
    yield
    # 앱 종료 시 정리 작업
    temp_manager.stop()

app = FastAPI(
    title="Fashion AI API",
    description="패션 트렌드 분석 및 추천 API",
    version="1.0.0",
    lifespan=lifespan
)

# Static 파일 디렉토리 생성
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")
os.makedirs(static_dir, exist_ok=True)

# Static 파일 마운트
app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Favicon 엔드포인트
@app.get("/favicon.ico")
async def favicon():
    return FileResponse(os.path.join(static_dir, "favicon.ico"))

# CORS 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "http://localhost:3002",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:3001",
        "http://127.0.0.1:3002"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 에러 핸들러 등록
app.add_exception_handler(APIError, api_error_handler)
app.add_exception_handler(Exception, general_exception_handler)

# 라우터 등록
app.include_router(router, prefix="/api")
app.include_router(image_router) 

@app.get("/")
async def root():
    return {
        "message": "Fashion AI API에 오신 것을 환영합니다",
        "docs_url": "/docs",
        "redoc_url": "/redoc"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000) 