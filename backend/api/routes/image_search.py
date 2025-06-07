from fastapi import APIRouter, File, UploadFile, HTTPException
from fastapi.responses import JSONResponse
import shutil
import os
import sys
from ..models import ImageSearchResult
from ..utils.file_cleanup import temp_manager

# 백엔드 루트 디렉토리를 Python 경로에 추가
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from backend.google_search.search_image_google import search_by_image

router = APIRouter()

@router.post("/search-image", response_model=ImageSearchResult)
async def search_image(file: UploadFile = File(...)):
    try:
        # 이미지 저장
        save_path = os.path.join(temp_manager.temp_dir, file.filename)
        with open(save_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # 유사 이미지 검색
        result_url = search_by_image(save_path)
        
        return {"result_url": result_url}
    except Exception as e:
        # 에러 발생 시에도 파일 삭제 시도
        if os.path.exists(save_path):
            try:
                os.remove(save_path)
            except:
                pass
        raise HTTPException(status_code=500, detail=str(e)) 