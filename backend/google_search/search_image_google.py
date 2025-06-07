import os
import time
import undetected_chromedriver as uc
from selenium.webdriver.common.by import By

def search_by_image(image_path):
    options = uc.ChromeOptions()
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.headless = False  # 개발 중엔 True로 하지 말자

    driver = uc.Chrome(options=options)

    try:
        # 1. 구글 이미지 검색 페이지 열기
        driver.get("https://images.google.com/")
        time.sleep(2)

        # 2. 이미지 검색 아이콘 클릭
        camera_icon = driver.find_element(By.CLASS_NAME, "nDcEnd")  # 최신 클래스명
        camera_icon.click()
        time.sleep(1)

        # 3. input[type='file'] 찾아서 이미지 업로드
        upload_input = driver.find_element(By.CSS_SELECTOR, "input[type='file']")
        upload_input.send_keys(os.path.abspath(image_path))
        time.sleep(5)  # 분석 기다림

        # 4. 분석 결과 URL 받아오기
        result_url = driver.current_url
        print("🔍 유사 이미지 검색 URL:", result_url)

        return result_url

    finally:
        driver.quit()
