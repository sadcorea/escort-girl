# 🔧 노션 연동 문제 해결 가이드

## 📋 문제 상황 요약
마사지 섹션에서 노션 DB 이미지가 로드되지 않고 백업 이미지(💆‍♀️ 아이콘)만 표시되는 문제

## ❌ 발생한 에러들

### 1. 400 Bad Request 에러
```
POST http://localhost:8080/api/notion 400 (Bad Request)
{"error": "Notion API Error: 400", "details": "Could not find property with name or id: \uc0c1\ud0dc"}
```

### 2. 에코걸 API 혼재 문제
```
notion-api-proxy.js:106 ⚠️ 속성 없음: title undefined
notion-api-proxy.js:150 ⚠️ 이미지 파일 없음: undefined
```

## 🔍 근본 원인 분석

### **핵심 문제: 프록시 서버의 DB ID 조건문 불일치**

**마사지 섹션에서 전송하는 DB ID:**
```
203e5f74-c72e-815d-8f39-d2946ee85c0a  (슬래시 포함)
```

**프록시 서버 조건문에서 체크하는 DB ID:**
```
203e5f74c72e815d8f39d2946ee85c0a   (슬래시 없음)
```

**결과:** 조건문이 매칭되지 않아 마사지 DB도 에코걸용 "상태" 필터가 적용됨

## 🛠️ 해결 과정

### Step 1: 에러 로그 분석
```bash
# 프록시 서버 로그에서 확인
🔍 받은 요청 DB ID: 203e5f74-c72e-815d-8f39-d2946ee85c0a
🔧 마사지 DB 접근 - 필터 없이 처리  # ← 이 메시지가 안 나옴
```

### Step 2: 섹션 독립 테스트
```bash
# 복잡한 메인 페이지 대신 섹션만 테스트
http://localhost:8080/sections/massage-section.html
```

**장점:**
- 에코걸 로그 간섭 없음
- 마사지 전용 로그만 확인
- 빠른 디버깅 가능

### Step 3: 프록시 서버 조건문 수정

**기존 코드 (proxy_server.py):**
```python
if request_data['database_id'] == '203e5f74c72e815d8f39d2946ee85c0a':
    # 마사지 DB - 필터 없이 처리
```

**수정된 코드:**
```python
# 슬래시 있는/없는 두 형태 모두 지원
massage_db_ids = ['203e5f74c72e815d8f39d2946ee85c0a', '203e5f74-c72e-815d-8f39-d2946ee85c0a']
if request_data['database_id'] in massage_db_ids:
    # 마사지 DB - 필터 없이 처리
    print("🔧 마사지 DB 접근 - 필터 없이 처리")
    filter_data = {
        "sorts": [
            {
                "property": "ID",
                "direction": "ascending"
            }
        ]
    }
```

## ✅ 해결 완료 확인

### 성공 로그 패턴:
```bash
# 프록시 서버 로그
🔍 받은 요청 DB ID: 203e5f74-c72e-815d-8f39-d2946ee85c0a
🔧 마사지 DB 접근 - 필터 없이 처리
127.0.0.1 - - [31/May/2025 16:51:57] "POST /api/notion HTTP/1.1" 200 -

# 브라우저 콘솔 로그
📡 마사지 API 응답 상태: 200
🔍 직접 필드 체크: 업체사진 = {files: [...]}
✅ 마사지 이미지 로드 성공
```

### 성공한 노션 이미지 URL 예시:
```
https://prod-files-secure.s3.us-west-2.amazonaws.com/fe6492cb-8367-4d83-8912-b657256f33e2/...
```

## 🚨 다른 개발자를 위한 체크리스트

### 문제 발생 시 확인 순서:

1. **프록시 서버 로그 확인**
   ```bash
   🔍 받은 요청 DB ID: [실제 ID 확인]
   🔧 마사지 DB 접근 - 필터 없이 처리  # ← 이 메시지가 나와야 함
   ```

2. **브라우저 콘솔에서 직접 테스트**
   ```javascript
   // 섹션 독립 테스트
   http://localhost:8080/sections/massage-section.html
   ```

3. **DB ID 형태 확인**
   - 노션 URL에서 복사한 ID: 슬래시 없음
   - API 요청에서 사용되는 ID: 슬래시 있을 수 있음
   - **두 형태 모두 지원**하도록 조건문 작성

4. **프록시 서버 조건문 확인**
   ```python
   # 잘못된 방식 (하나만 체크)
   if request_data['database_id'] == '특정ID':
   
   # 올바른 방식 (여러 형태 지원)
   target_db_ids = ['ID형태1', 'ID형태2']
   if request_data['database_id'] in target_db_ids:
   ```

## 🔧 디버깅 팁

### 1. 로그 메시지로 진행 상황 추적
```javascript
console.log('🔄 마사지 이미지 로드 시작...');
console.log('📡 마사지 API 응답 상태:', response.status);
console.log('📝 마사지 DB 실제 속성들:', Object.keys(properties));
console.log('🔍 직접 필드 체크: 업체사진 =', prop);
```

### 2. 섹션별 독립 테스트 활용
```bash
# 메인 페이지는 복잡하니 섹션만 테스트
http://localhost:8080/sections/[섹션명].html
```

### 3. 프록시 서버 디버깅 로그 추가
```python
print(f"🔍 받은 요청 DB ID: {request_data['database_id']}")
print("🔧 마사지 DB 접근 - 필터 없이 처리")  # 조건문 분기 확인
```

## 📚 관련 파일들

### 수정된 파일:
- `proxy_server.py` - DB ID 조건문 수정
- `sections/massage-section.html` - 독립 테스트 가능
- `index.html` - 순차 로드 적용

### 노션 DB 구조:
- **마사지 DB ID**: `203e5f74c72e815d8f39d2946ee85c0a`
- **이미지 컬럼**: `업체사진`
- **기본 이미지**: ID=0 행

## 🎯 핵심 교훈

1. **DB ID 형태 불일치**: 슬래시 있는/없는 형태 모두 고려
2. **섹션 독립 테스트**: 복잡한 메인 페이지보다 섹션별 테스트가 효율적
3. **프록시 서버 로그**: 실제 받은 요청과 조건문 매칭 여부 확인 필수
4. **순차 디버깅**: 에코걸, 마사지 동시 로드 시 로그 혼재 → 순차 로드로 해결

---

**✅ 최종 결과**: 노션 마사지 DB에서 실제 이미지 성공적으로 로드  
**📅 해결일**: 2025년 5월 31일  
**🔧 해결 방법**: 프록시 서버 DB ID 조건문 수정 (슬래시 형태 문제)
