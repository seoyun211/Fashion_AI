# crawling/musinsa_crawler.py

from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from bs4 import BeautifulSoup
import pandas as pd
import time
import os

def crawl_musinsa():
    options = Options()
    options.add_argument("--headless")  # 창 안 띄우고 실행
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    driver = webdriver.Chrome(options=options)

    url = "https://www.musinsa.com/ranking/best?period=week&mainCategory=001"
    driver.get(url)
    time.sleep(2)

    soup = BeautifulSoup(driver.page_source, "html.parser")
    items = soup.select("li.li_box")
    data = []

    for item in items[:10]:  # 상위 10개만 테스트
        try:
            product_link = "https:" + item.select_one(".list_info > a")["href"]
            print("👉 상품 링크:", product_link)
            driver.get(product_link)
            time.sleep(1.5)
            detail_soup = BeautifulSoup(driver.page_source, "html.parser")

            name = detail_soup.select_one("span.product_title").text.strip()
            price = detail_soup.select_one("span.product_article_price").text.strip()
            price = int(price.replace(",", "").replace("원", "").strip())

            like_tag = detail_soup.select_one("span.prd_like_cnt")
            like = int(like_tag.text.replace(",", "").strip()) if like_tag else 0

            review_tag = detail_soup.select_one("span.review_cnt")
            review = int(review_tag.text.replace(",", "").replace("개 리뷰", "").strip()) if review_tag else 0

            trend_score = like * 0.6 + review * 1.2

            data.append({
                "상품명": name,
                "가격": price,
                "좋아요": like,
                "리뷰": review,
                "trend_score": round(trend_score, 2),
                "URL": product_link
            })

        except Exception as e:
            print("❌ 에러:", e)

    driver.quit()

    os.makedirs("../data", exist_ok=True)
    df = pd.DataFrame(data)
    df.to_csv("../data/musinsa_trend.csv", index=False, encoding="utf-8-sig")
    print("✅ 크롤링 완료! → data/musinsa_trend.csv 저장됨")

if __name__ == "__main__":
    crawl_musinsa()
