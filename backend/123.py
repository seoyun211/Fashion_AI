# 필요한 라이브러리 임포트
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score, classification_report
import os

# 한글 폰트 설정 (Windows: Malgun Gothic)
plt.rcParams['font.family'] = 'Malgun Gothic'
plt.rcParams['axes.unicode_minus'] = False

# 1. 데이터셋 파일 경로 설정
file_path = r'C:\Users\23H2\Downloads\Car price prediction(used cars).csv'

# 파일 존재 여부 확인
if not os.path.exists(file_path):
    print(f"오류: {file_path} 파일을 찾을 수 없습니다.")
    print("Downloads 디렉토리 내 파일 목록:")
    print(os.listdir(r'C:\Users\23H2\Downloads'))
    exit()

# 2. 데이터 로드 (인코딩 지정)
try:
    df = pd.read_csv(file_path, encoding='CP949')
except UnicodeDecodeError:
    df = pd.read_csv(file_path, encoding='EUC-KR')

# 열 이름 및 데이터 미리보기
print("열 이름:")
print(df.columns)
print("\n데이터 미리보기:")
print(df.head())

# 3. 데이터 전처리
# 3.1 Fuel type 이진화
def classify_fuel_type(fuel):
    if fuel in ['Hybrid', 'Electric']:
        return 1  # 친환경
    elif fuel in ['Petrol', 'Diesel']:
        return 0  # 일반
    else:
        return None  # 기타는 제외

df['Fuel_type_binary'] = df['Fuel type'].apply(classify_fuel_type)
df = df.dropna(subset=['Fuel_type_binary'])  # 기타 값 제거

# 3.2 수치형 데이터 전처리
df['Prod. year'] = pd.to_numeric(df['Prod. year'], errors='coerce')
df['Mileage'] = df['Mileage'].str.replace(' km', '').astype(float)
df['Engine volume'] = df['Engine volume'].str.extract(r'(\d+\.\d+|\d+)').astype(float)
df['Cylinders'] = pd.to_numeric(df['Cylinders'], errors='coerce')
df['Levy'] = df['Levy'].replace('-', '0').astype(float)
df['Airbags'] = pd.to_numeric(df['Airbags'], errors='coerce')

# 3.3 결측값 처리
print("\n결측값 확인 (처리 전):")
print(df.isnull().sum())

# 결측값을 파일로 저장
with open(r'C:\Users\23H2\Downloads\missing_values.txt', 'w', encoding='utf-8') as f:
    f.write(str(df.isnull().sum()))

# 제거 전 데이터 크기 및 클래스 분포 확인
print("\n제거 전 데이터 크기:", df.shape)
print("제거 전 클래스 분포:", df['Fuel_type_binary'].value_counts())

# 결측값이 있는 행 제거
df = df.dropna()

print("\n결측값 확인 (처리 후):")
print(df.isnull().sum())
print("제거 후 데이터 크기:", df.shape)
print("제거 후 클래스 분포:", df['Fuel_type_binary'].value_counts())

# 3.4 시각화
# 3.4.1 클래스 분포 막대그래프
plt.figure(figsize=(8, 6))
sns.countplot(x='Fuel_type_binary', data=df, palette='Set2')
plt.title('친환경 vs 일반 차량 클래스 분포')
plt.xlabel('차량 유형 (0: 일반, 1: 친환경)')
plt.ylabel('빈도')
try:
    plt.savefig(r'C:\Users\23H2\Downloads\class_distribution.png')
    print("클래스 분포 시각화 저장 완료:", r'C:\Users\23H2\Downloads\class_distribution.png')
except Exception as e:
    print(f"클래스 분포 시각화 저장 실패: {e}")
plt.close()

# 3.4.2 연식별 친환경 차량 비율 꺾은선 그래프
eco_by_year = df.groupby('Prod. year')['Fuel_type_binary'].mean().reset_index()
plt.figure(figsize=(10, 6))
sns.lineplot(x='Prod. year', y='Fuel_type_binary', data=eco_by_year, marker='o', color='green')
plt.title('연식별 친환경 차량 비율')
plt.xlabel('연식')
plt.ylabel('친환경 차량 비율')
try:
    plt.savefig(r'C:\Users\23H2\Downloads\eco_friendly_by_year.png')
    print("연식별 친환경 차량 비율 시각화 저장 완료:", r'C:\Users\23H2\Downloads\eco_friendly_by_year.png')
except Exception as e:
    print(f"연식별 친환경 차량 비율 시각화 저장 실패: {e}")
plt.close()

# 3.4.3 주행거리 분포 히스토그램
plt.figure(figsize=(10, 6))
sns.histplot(data=df, x='Mileage', hue='Fuel_type_binary', bins=30, kde=True, palette='Set2')
plt.title('친환경 vs 일반 차량의 주행거리 분포')
plt.xlabel('주행거리 (km)')
plt.ylabel('빈도')
try:
    plt.savefig(r'C:\Users\23H2\Downloads\mileage_distribution.png')
    print("주행거리 분포 시각화 저장 완료:", r'C:\Users\23H2\Downloads\mileage_distribution.png')
except Exception as e:
    print(f"주행거리 분포 시각화 저장 실패: {e}")
plt.close()

# 3.5 범주형 변수 인코딩
categorical_cols = ['Manufacturer', 'Gear box type', 'Category', 'Leather interior', 'Drive wheels', 'Wheel', 'Color', 'Doors']
for col in categorical_cols:
    df = pd.get_dummies(df, columns=[col], drop_first=True)

# 불필요한 열 제거
df = df.drop(['Model', 'ID', 'Fuel type'], axis=1)

# 4. 특성 및 타겟 설정
X = df.drop('Fuel_type_binary', axis=1)
y = df['Fuel_type_binary']

# 5. 데이터 분할
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 6. 모델 구축 및 학습
rf = RandomForestClassifier(n_estimators=100, random_state=42)
rf.fit(X_train, y_train)

# 7. 예측 및 평가
y_pred = rf.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print("\n모델 성능:")
print(f"Accuracy: {accuracy:.4f}")
print("\n분류 보고서:")
print(classification_report(y_test, y_pred))

# 8. 시각화 (특성 중요도)
importances = rf.feature_importances_
feature_names = X.columns
plt.figure(figsize=(10, 8))
sns.barplot(x=importances, y=feature_names, hue=feature_names, palette='viridis', legend=False)
plt.title('특성 중요도')
plt.xlabel('중요도')
plt.ylabel('특성')
try:
    plt.savefig(r'C:\Users\23H2\Downloads\feature_importance.png')
    print("특성 중요도 시각화 저장 완료:", r'C:\Users\23H2\Downloads\feature_importance.png')
except Exception as e:
    print(f"특성 중요도 시각화 저장 실패: {e}")
plt.close()