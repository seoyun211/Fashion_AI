import os
from PIL import Image, ImageDraw, ImageFont

# 현재 디렉토리의 static 폴더 경로
static_dir = os.path.join(os.path.dirname(os.path.abspath(__file__)), "static")

# 32x32 이미지 생성
img = Image.new('RGB', (32, 32), color='white')
draw = ImageDraw.Draw(img)

# 육각형 그리기
points = [(16, 4), (28, 12), (28, 20), (16, 28), (4, 20), (4, 12)]
draw.polygon(points, fill='#ff6b6b')

# 'F' 텍스트 그리기
draw.text((12, 8), 'F', fill='white', size=16)

# ICO 파일로 저장
ico_path = os.path.join(static_dir, "favicon.ico")
img.save(ico_path, format='ICO') 