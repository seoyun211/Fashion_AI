from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
import shutil
import os
import sys

# 백엔드 루트 디렉토리를 Python 경로에 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from search_similar_google import search_by_image

router = APIRouter()

@router.post("/search-image")
async def search_image(file: UploadFile = File(...)):
    # temp 디렉토리가 없으면 생성
    os.makedirs("temp", exist_ok=True)
    
    # 이미지 저장
    save_path = f"temp/{file.filename}"
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 유사 이미지 검색
    result_url = search_by_image(save_path)
    return JSONResponse(content={"result_url": result_url}) 