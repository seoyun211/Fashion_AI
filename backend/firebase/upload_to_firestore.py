import firebase_admin
from firebase_admin import credentials, firestore
import pandas as pd
import os
from dotenv import load_dotenv

# .env 불러오기
load_dotenv()
KEY_PATH = os.getenv("FIREBASE_KEY_PATH")
CSV_FOLDER = os.getenv("DATA_PATH")

# ✅ Firebase 초기화
if not firebase_admin._apps:
    cred = credentials.Certificate(KEY_PATH)
    firebase_admin.initialize_app(cred)

db = firestore.client()

# ✅ 🔥 컬렉션 초기화 함수 위치 (💡 여기에 넣기!)
def clear_products_collection():
    docs = db.collection("products").stream()
    for doc in docs:
        doc.reference.delete()
    print("🧹 기존 products 컬렉션 전체 삭제 완료!")

clear_products_collection()

# 📄 data 폴더 내 모든 CSV 파일 리스트 가져오기
all_files = [os.path.join(CSV_FOLDER, f) for f in os.listdir(CSV_FOLDER) if f.endswith('.csv')]
print(f"🔍 총 {len(all_files)}개의 CSV 파일을 찾았어요.")

# 🧾 여러 CSV 병합
merged_df = pd.concat((pd.read_csv(f) for f in all_files), ignore_index=True)
print(f"📊 병합된 데이터 총 {len(merged_df)}개 항목")

# 🔁 Firestore 업로드
upload_count = 0
for _, row in merged_df.iterrows():
    try:
        # 숫자 처리 (가격, 리뷰수, 판매량 등)
        price = round(float(str(row["가격"]).replace(",", "").replace("원", "").strip()), 1)

        reviews_raw = str(row.get("리뷰수", 0)).strip()
        reviews = round(float(reviews_raw), 1) if reviews_raw.lower() != 'nan' else 0

        sales_raw = str(row.get("판매량", 0)).strip()
        sales = round(float(sales_raw), 1) if sales_raw.lower() != 'nan' else 0

        rating_raw = row.get("별점(5점)", 0)
        rating = round(float(rating_raw), 1) if not pd.isna(rating_raw) else 0.0

        # 문자열 필드 처리
        style = row.get("스타일", "미지정")
        category = row.get("분류", "기타")
        image_url = row.get("이미지", "")
        shop_name = row.get("쇼핑몰", "")
        product_name = row.get("상품명", "이름 없음")

        # Firestore 문서
        doc = {
            "product_name": product_name,
            "price": price,
            "shop_name": shop_name,
            "rating": rating,
            "image_url": image_url,
            "reviews": reviews,
            "style": style,
            "category": category,
            "sales": sales,
            "created_at": firestore.SERVER_TIMESTAMP
        }

        db.collection("products").add(doc)
        upload_count += 1

    except Exception as e:
        print(f"❌ 오류 (상품명: {row.get('상품명', '알 수 없음')}): {e}")

print(f"✅ Firestore 업로드 완료! 총 {upload_count}개 상품 등록됨.")