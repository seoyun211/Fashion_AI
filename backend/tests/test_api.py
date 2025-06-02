import requests
import json
from datetime import datetime
import time

BASE_URL = "http://localhost:8000/api/v1"

def test_trend_report():
    """트렌드 분석 리포트 API 테스트"""
    print("\n=== 트렌드 분석 리포트 테스트 ===")
    
    start_time = time.time()
    response = requests.get(f"{BASE_URL}/trends/report")
    elapsed_time = time.time() - start_time
    
    print(f"응답 시간: {elapsed_time:.2f}초")
    
    if response.status_code == 200:
        data = response.json()
        print("✓ 상태 코드: 200 OK")
        print("\n주요 트렌드:")
        print(f"- 인기 스타일 수: {len(data['popular_styles'])}")
        print(f"- 색상 트렌드 수: {len(data['color_trends'])}")
        print(f"- 예측된 트렌드 수: {len(data['upcoming_trends'])}")
    else:
        print(f"✗ 에러 - 상태 코드: {response.status_code}")
        print(f"에러 메시지: {response.text}")

def test_products_by_shop():
    """쇼핑몰별 상품 목록 API 테스트"""
    print("\n=== 쇼핑몰별 상품 목록 테스트 ===")
    
    shops = ['무신사', '지그재그', '더블유컨셉', '29CM']
    
    for shop in shops:
        start_time = time.time()
        response = requests.get(f"{BASE_URL}/products/{shop}")
        elapsed_time = time.time() - start_time
        
        print(f"\n{shop} 테스트:")
        print(f"응답 시간: {elapsed_time:.2f}초")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✓ 상태 코드: 200 OK")
            print(f"- 상품 수: {len(data['products'])}")
        else:
            print(f"✗ 에러 - 상태 코드: {response.status_code}")
            print(f"에러 메시지: {response.text}")
    
    # 잘못된 쇼핑몰 이름 테스트
    response = requests.get(f"{BASE_URL}/products/invalid_shop")
    print("\n잘못된 쇼핑몰 이름 테스트:")
    print(f"상태 코드: {response.status_code} (예상: 4xx)")

def test_trending_products():
    """인기 상품 API 테스트"""
    print("\n=== 인기 상품 테스트 ===")
    
    limits = [5, 10, 20]
    
    for limit in limits:
        start_time = time.time()
        response = requests.get(f"{BASE_URL}/products/trending/{limit}")
        elapsed_time = time.time() - start_time
        
        print(f"\n상위 {limit}개 상품 테스트:")
        print(f"응답 시간: {elapsed_time:.2f}초")
        
        if response.status_code == 200:
            data = response.json()
            print(f"✓ 상태 코드: 200 OK")
            print(f"- 반환된 상품 수: {len(data['products'])}")
            assert len(data['products']) <= limit, "반환된 상품 수가 limit을 초과함"
        else:
            print(f"✗ 에러 - 상태 코드: {response.status_code}")
            print(f"에러 메시지: {response.text}")

def test_sales_data():
    """판매 데이터 API 테스트"""
    print("\n=== 판매 데이터 테스트 ===")
    
    # 먼저 상품 목록을 가져와서 실제 상품명으로 테스트
    response = requests.get(f"{BASE_URL}/products/무신사")
    if response.status_code == 200:
        products = response.json()['products']
        if products:
            test_product = products[0]['product_name']
            
            start_time = time.time()
            response = requests.get(f"{BASE_URL}/sales/{test_product}")
            elapsed_time = time.time() - start_time
            
            print(f"\n상품 '{test_product}' 테스트:")
            print(f"응답 시간: {elapsed_time:.2f}초")
            
            if response.status_code == 200:
                data = response.json()
                print(f"✓ 상태 코드: 200 OK")
                print(f"- 시계열 데이터 포인트 수: {len(data['time_series'])}")
            else:
                print(f"✗ 에러 - 상태 코드: {response.status_code}")
                print(f"에러 메시지: {response.text}")
    
    # 존재하지 않는 상품명 테스트
    response = requests.get(f"{BASE_URL}/sales/non_existent_product")
    print("\n존재하지 않는 상품 테스트:")
    print(f"상태 코드: {response.status_code} (예상: 4xx)")

if __name__ == "__main__":
    print("API 테스트를 시작합니다...")
    
    try:
        test_trend_report()
        test_products_by_shop()
        test_trending_products()
        test_sales_data()
        
        print("\n모든 테스트가 완료되었습니다!")
        
    except requests.exceptions.ConnectionError:
        print("\n✗ 에러: API 서버에 연결할 수 없습니다.")
        print("서버가 실행 중인지 확인해주세요. (localhost:8000)")
    except Exception as e:
        print(f"\n✗ 예상치 못한 에러 발생: {str(e)}") 