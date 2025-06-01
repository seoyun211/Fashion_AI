import os
import time
import pandas as pd
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup

# 🔧 Selenium 설정
options = Options()
options.add_argument("--headless")
options.add_argument("--no-sandbox")
options.add_argument("--disable-dev-shm-usage")
options.add_argument(
    "user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36"
)

driver = webdriver.Chrome(executable_path="chromedriver.exe", options=options)

# 🧭 타겟 페이지
url = "https://www.wconcept.co.kr/Landing/Best?GENDER=F&SHOP_NO=1"
driver.get(url)
time.sleep(2)

# 🎯 리스트 파싱
soup = BeautifulSoup(driver.page_source, "html.parser")
items = soup.select("li.item")

results = []

for item in items[:10]:  # 10개만 테스트
    try:
        link_tag = item.select_one("a.prdLink")
        product_url = "https://www.wconcept.co.kr" + link_tag["href"]
        brand = item.select_one("span.brand").text.strip()
        name = item.select_one("p.productName").text.strip()
        price = item.select_one("span.finalPrice").text.strip().replace(",", "").replace("원", "")
        image = item.select_one("img")["data-original"]

        # 🔎 상세 페이지 진입
        driver.get(product_url)
        time.sleep(1.5)
        detail_soup = BeautifulSoup(driver.page_source, "html.parser")

        like_tag = detail_soup.select_one("span.count")  # 좋아요
        review_tag = detail_soup.select_one("a[href='#reviewTab'] span")  # 리뷰 수

        like = int(like_tag.text.strip().replace(",", "")) if like_tag else 0
        review = int(review_tag.text.strip().replace("(", "").replace(")", "")) if review_tag else 0

        trend_score = like * 0.7 + review * 1.3

        results.append({
            "브랜드": brand,
            "상품명": name,
            "가격": int(price),
            "좋아요": like,
            "리뷰": review,
            "trend_score": round(trend_score, 2),
            "URL": product_url,
            "이미지": image
        })

        print(f"✅ {name} 크롤링 완료")

    except Exception as e:
        print(f"❌ 크롤링 실패: {e}")

driver.quit()

# 📁 저장
os.makedirs("../data", exist_ok=True)
df = pd.DataFrame(results)  # ← 이 줄 추가!
df.to_csv("../data/wconcept_trend.csv", index=False, encoding="utf-8-sig")
print("🎉 W컨셉 크롤링 완료 → data/wconcept_trend.csv 저장됨")
