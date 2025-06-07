from fastapi import APIRouter, UploadFile, File
import shutil, os, uuid
from google_search.search_image_google import search_by_image

router = APIRouter()

@router.post("/search-image")
async def search_image(file: UploadFile = File(...)):
    temp_name = f"temp_{uuid.uuid4().hex}.jpg"

    try:
        with open(temp_name, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        print("[서버] 이미지 저장 완료:", temp_name)

        # 유사 이미지 검색
        result_url = search_by_image(temp_name)

        print("[서버] 검색 완료:", result_url)

        return {"result_url": result_url}

    except Exception as e:
        print("[서버 오류] 유사 이미지 검색 실패:", e)
        return {"error": "이미지 검색 중 오류가 발생했어요."}

    finally:
        # 파일 제거 (존재할 때만)
        if os.path.exists(temp_name):
            os.remove(temp_name)
            print("[서버] 임시 파일 삭제:", temp_name)