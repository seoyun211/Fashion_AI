# backend/routes/image_search.py
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
import shutil
from search_similar_google import search_by_image  # 앞서 만든 함수 불러오기

router = APIRouter()

@router.post("/search-image")
async def search_image(file: UploadFile = File(...)):
    # 이미지 저장
    save_path = f"temp/{file.filename}"
    with open(save_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # 유사 이미지 검색
    result_url = search_by_image(save_path)
    return JSONResponse(content={"result_url": result_url})
