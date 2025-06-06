from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import shutil
import os
import sys
from ..models import ImageSearchResult

# 백엔드 루트 디렉토리를 Python 경로에 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from search_similar_google import search_by_image

router = APIRouter()

@router.post("/search-image", response_model=ImageSearchResult)
async def search_image(file: UploadFile = File(...)):
    try:
        # temp 디렉토리가 없으면 생성
        os.makedirs("temp", exist_ok=True)
        
        # 이미지 저장
        save_path = f"temp/{file.filename}"
        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 유사 이미지 검색
        result_url = search_by_image(save_path)
        
        # 임시 파일 삭제
        os.remove(save_path)
        
        return {"result_url": result_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e)) 