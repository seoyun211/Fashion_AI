from fastapi import APIRouter, UploadFile, File
from models.image_analyzer import analyze_image
import os, shutil

router = APIRouter()
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/analyze-image/")
async def analyze_uploaded_image(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    result = analyze_image(file_path)
    return {"predicted_style": result}
