# 💆 마사지 업체 데이터베이스 설계 계획

## 🎯 **개요**
EchoPal 플랫폼의 마사지 섹션을 위한 협력 업체 관리 데이터베이스 구축 계획

## 📊 **노션 데이터베이스 구조**

### **기본 정보**
- **ID** (Number) - 고유 업체 번호
- **업체명** (Title) - 마사지샵 이름
- **대표명** (Text) - 사업자 대표 이름
- **연락처** (Phone) - 업체 전화번호
- **이메일** (Email) - 업체 이메일
- **사업자등록번호** (Text) - 법적 등록 번호

### **위치 및 운영 정보**
- **업체주소** (Text) - 기본 주소 (기존 필드)
- **kr 업체주소** (Rich Text) - 한국어 주소 (한국인용 안내)
- **vn 업체주소** (Rich Text) - 베트남어 주소 (그랩, 택시용)
- **GPS좌표** (Text) - 위도,경도 (예: "16.0544,108.2022")
- **운영시간** (Text) - 영업시간 (예: "09:00-24:00")
- **휴무일** (Multi-select) - 월,화,수,목,금,토,일
- **서비스종류** (Multi-select)
  - 타이마사지
  - 오일마사지 
  - 스포츠마사지
  - 발마사지
  - 커플마사지
  - 아로마테라피

### **마케팅 자료**
- **업체로고** (Files & media) - 광고에 사용할 로고
- **업체사진** (Files & media) - 매장 내부/외부 사진들
- **홍보문구** (Rich Text) - 광고 박스에 표시될 매력적인 문구
- **특별혜택** (Text) - "EchoPal 방문고객 10% 할인" 등
- **언어지원** (Multi-select) - 한국어, 영어, 일본어, 중국어, 베트남어

### **계약 관리**
- **광고섹션** (Select) - 마사지 섹션 내 위치
  - 마사지 #1 (프리미엄)
  - 마사지 #2
  - 마사지 #3
  - 마사지 #4
  - 마사지 #5
  - 마사지 #6
- **월광고금액** (Number) - 월 광고비 (만원 단위)
- **기본계약기간** (Number) - 기본 계약 개월 수
- **실제계약기간** (Date range) - 시작일 ~ 종료일
- **남은기간** (Formula) - 자동 계산 (종료일 - 오늘)
- **계약상태** (Select)
  - 🟢 활성
  - 🟡 일시정지
  - 🔴 만료
  - ⚫ 해지

### **결제 관리**
- **결제상태** (Select)
  - ✅ 정상
  - ⚠️ 지연 (7일 이내)
  - 🚨 연체 (7일 초과)
  - 💚 완료
- **선금액** (Number) - 선불 결제 금액
- **갱신여부** (Checkbox) - 자동갱신 여부
- **연체일수** (Formula) - 연체된 일수 계산

### **관리 정보**
- **담당자** (Text) - 우리 쪽 담당 직원
- **등록일** (Created time) - 데이터베이스 등록일
- **최종수정** (Last edited time) - 마지막 수정일
- **메모** (Long text) - 특이사항, 계약 조건, 기타 참고사항

### **성과 추적 (Google Analytics 연동 예정)**
- **월간클릭수** (Number) - 월별 광고 클릭 횟수
- **월간문의수** (Number) - 실제 문의 전화 건수
- **만족도평가** (Select) - ⭐⭐⭐⭐⭐ (1-5점)
- **재계약여부** (Checkbox) - 재계약 성공 여부

## ✅ **현재 완성 상황 (2025년 5월 30일)**

### **데이터베이스 구축 100% 완료**
- **노션 DB ID**: 203e5f74-c72e-815d-8f39-d2946ee85c0a
- **총 28개 컬럼** 완성 (기본정보~성과추적)
- **실제 6개 업체 데이터** 입력 완료

### **✅ 테스트 데이터 6개 입력 완료:**

**실제 다낭 마사지샵 기반 데이터:**

1. **골든 타이 마사지** (ID: 1)
   - 타이/오일/커플마사지, 한/영/베트남어
   - 프리미엄 서비스, 만족도 ⭐⭐⭐⭐⭐

2. **로얄 스파 마사지** (ID: 2)  
   - 오일/아로마/스포츠마사지, 한/영/일본어
   - 스파 전문, 만족도 ⭐⭐⭐⭐

3. **허벌 스파 (다낭 본점)** (ID: 3)
   - 아로마/타이/오일마사지, 한/영/일/중국어
   - 유명 체인, 유기농 인증, 만족도 ⭐⭐⭐⭐⭐

4. **맥심 킹 VIP 스파** (ID: 4)
   - 오일/스포츠마사지, 한/영어
   - 남성 전용, VIP 서비스, 만족도 ⭐⭐⭐⭐⭐

5. **하나 뷰티 출장 마사지** (ID: 5)
   - 아로마/발/오일마사지, 한/영/베트남어
   - 24시간 출장 서비스, 만족도 ⭐⭐⭐⭐

6. **한 스파 & 네일** (ID: 6)
   - 발/아로마/타이마사지, 한/영/베트남어
   - 한시장 근처, 네일샵 병행, 만족도 ⭐⭐⭐⭐

**데이터베이스 특징:**
- GPS 좌표 포함 (실제 다낭 위치)
- 다양한 서비스 종류 및 언어 지원  
- 월간 클릭수, 문의수 등 성과 지표 포함
- 계약 관리 및 결제 상태 체계적 관리

## 🔧 **Google Analytics 연동 계획**

### **추적할 이벤트**
```javascript
// 마사지 광고 클릭 추적
gtag('event', 'massage_ad_click', {
  'massage_shop': '업체명',
  'ad_position': '마사지#1',
  'user_agent': 'mobile/desktop'
});

// 전화 클릭 추적  
gtag('event', 'phone_click', {
  'massage_shop': '업체명',
  'contact_type': 'phone'
});

// 지도 마커 클릭 추적
gtag('event', 'map_marker_click', {
  'massage_shop': '업체명',
  'map_location': 'massage_section'
});
```

### **대시보드 구성 (예정)**
- **실시간 클릭 현황**
- **업체별 성과 비교**
- **시간대별 트래픽 분석**
- **모바일 vs 데스크톱 비율**
- **지역별 접속 통계**

## 🎯 **노션 설정 가이드**

### **1단계: 새 데이터베이스 생성**
1. 노션에서 새 페이지 생성
2. 제목: "🏢 마사지 업체 관리"
3. 테이블 형태 데이터베이스 생성

### **2단계: 컬럼 설정**
위의 구조대로 컬럼들을 순서대로 생성

### **3단계: 테스트 데이터 입력**
```
업체명: 골든 타이 마사지
ID: 1
대표명: 김민수
연락처: +84-905-123-456
주소: 다낭시 한강구 123번지
서비스: 타이마사지, 오일마사지
광고섹션: 마사지 #1
월광고금액: 30
```

### **4단계: API 연동 설정**
- Integration 생성: "EchoPal 마사지 API"
- 데이터베이스 권한 부여
- API 키 및 DB ID 확인

## 🚀 **구현 로드맵 (업데이트)**

### **Phase 1: 데이터베이스 구축 (완료!)**
- [x] 계획 문서 작성
- [x] 노션 데이터베이스 생성 (ID: 203e5f74-c72e-815d-8f39-d2946ee85c0a)
- [x] 실제 6개 업체 데이터 입력 완료
- [x] API 연동 테스트

### **Phase 2: 웹사이트 구현 (현재 진행)**
- [ ] **마사지 전체페이지** 개발 (확정된 구성)
- [ ] **업체 상세페이지** 개발 (미니멀 구조)
- [ ] **메인 홈페이지** "남성 마사지 샵" 버튼 추가
- [ ] 구글맵 연동 및 GPS 핀 표시
- [ ] 노션 API 연동으로 실시간 데이터 반영

### **🎨 마사지 전체페이지 구성 (확정)**

**레이아웃 구조:**
```
┌─────────────────────────────────┐
│ 상단: 에코걸 + 스크롤 고정       │
├─────────────────────────────────┤
│ 중단: 프리미엄 광고 2개 (좌우)   │
├─────────────────────────────────┤
│ 하단: 마사지 업체 카드들         │
│       - 2열 배치                │
│       - 4개씩 노출              │
│       - 페이지네이션 (10개씩)    │
└─────────────────────────────────┘
```

**카드 구성 요소:**
```
┌─────────────────────────────┐
│ 🔥 골든 타이 마사지         │
│ 타이마사지, 오일마사지      │
│ 📞 전화 │ 💬 카톡           │
│ 🎁 "EchoPal 고객 20% 할인"  │
└─────────────────────────────┘

배지 시스템:
- 🔥 HOT (인기업체)
- ✨ NEW (신규업체)

혜택 표시:
- 🎁 "EchoPal 특가 XX% 할인"
- 🚗 "무료 픽업 서비스"  
- ⏰ "24시간 운영"
- (유연하게 추가/제거 가능)

색인 (서비스 종류):
- 타이마사지, 오일마사지, 아로마테라피
- 스포츠마사지, 발마사지, 커플마사지
- (아이콘 대신 텍스트로 명확하게)
```

**디자인 방향:**
- **남성 전용**: 야시꾸리한 분위기
- **카드 전체 클릭**: 모바일 편의성
- **2열 그리드**: 모바일 최적화
- **페이지네이션**: 10개 업체씩 분할

### **🏗️ 상세페이지 구조 (확정)**
```
업체 상세페이지 (심플 버전):
┌─────────────────────────────────┐
│  📸 대표사진 1장                │
├─────────────────────────────────┤
│  📞 연락처 (크게)               │
│  💬 카카오톡 ID                 │
├─────────────────────────────────┤
│  🏷️ 주요 서비스 3-4개           │
│  (타이, 오일, 아로마 등)        │
├─────────────────────────────────┤
│  📍 주소                       │
│  🇰🇷 한국어: 한강구 바흐당길    │
│  🇻🇳 베트남어: Đường Bạch Đằng │
├─────────────────────────────────┤
│  🗺️ [지도에서 보기] 버튼        │
│  🚗 [그랩 주소 복사] 버튼        │
│  📱 [그랩 앱 호출] 버튼          │
└─────────────────────────────────┘

핵심 기능:
- 미니멀 디자인 (술 마셔도 쉽게)
- 그랩 연결 고려 (주소 복사 + 앱 호출)
- 모바일 최적화 우선

### **🚗 그랩 연동 기능 (킬러 기능)**
```javascript
그랩 앱 딥링크 호출:
- [그랩 앱 호출] 버튼 클릭
- 그랩 앱 자동 실행
- 목적지 미리 설정 (GPS 좌표)
- 현재 위치 → 마사지샵 경로 자동 생성

백업 시스템:
- 그랩 앱 없음 → 구글맵 연결
- 구글맵 없음 → 주소 복사
- 원클릭으로 택시 호출 완료

사용자 경험:
술 마시고 → 업체 선택 → 그랩 버튼 → 
앱 열림 → 목적지 입력 완료 → 바로 호출
```
```

### **Phase 3: 수익화 준비**
- [ ] 1200×200 배너 광고 영역 준비
- [ ] 프리미엄/일반 광고 차별화 시스템
- [ ] Google Analytics 연동

## 💰 **수익 구조 (업데이트된 전략)**

### **현재 단계: 무료 게시 (시장 조사)**
```
목적: 시장 조사 + 업체 관계 구축 + 사용자 데이터 수집
비용: 0원 (웹사이트 개발비만)
효과: 
- 경쟁사 분석 데이터 수집
- 고객 관심도 및 클릭 패턴 분석
- 업체와의 신뢰 관계 구축
```

### **향후 유료 단계: 3단계 수익 모델**
```
📊 1단계: 메인 홈페이지 프리미엄 (3개 업체)
├── 프리미엄 카드 광고: 월 50만원 × 3개 = 150만원
└── "전체보기" 버튼으로 추가 유도

📊 2단계: 섹션별 배너 광고
├── 마사지 섹션 상단: 월 30만원 (1200×200px)
├── 가라오케 섹션 상단: 월 30만원 
├── 풀빌라 섹션 상단: 월 30만원 (예정)
└── 총 배너 수익: 월 90만원

📊 3단계: 전체페이지 일반 광고
├── 일반 업체 리스팅: 월 20만원 × 10개 = 200만원
├── 하단 배치, 작은 카드 형태
└── 무제한 확장 가능

총 예상 수익: 월 440만원 + α
연간 예상 수익: 5,280만원 + α
```

### **🎯 전략적 가치 (부업 준비)**
- **시장 정보 수집**: 무료로 업계 데이터 축적
- **고객 DB 구축**: 마사지 관심 고객 파악
- **최적 진입 타이밍**: 데이터 기반 직영 사업 진출
- **경쟁 우위 확보**: 플랫폼 + 직영 동시 운영

## 📋 **관리 체크리스트**

### **일일 체크사항**
- [ ] 광고 클릭수 확인
- [ ] 문의 전화 접수 기록
- [ ] 계약 만료 임박 업체 확인

### **주간 체크사항**
- [ ] 성과 리포트 생성
- [ ] 업체별 만족도 조사
- [ ] 경쟁사 광고료 조사

### **월간 체크사항**
- [ ] 계약 갱신 협상
- [ ] 새 업체 발굴
- [ ] 광고료 조정 검토

---

## 🎉 **마사지 전체 페이지 완성 (2025년 5월 31일)**

### **✅ 완성된 기능들**

#### **📄 전체보기 페이지 (`/massage/index.html`)**
- **✅ 노션 연동**: 마사지 업체 DB (ID: 203e5f74-c72e-815d-8f39-d2946ee85c0a) 실시간 반영
- **✅ 검색/필터 시스템**: 
  - 서비스 종류 (타이마사지, 오일마사지, 아로마테라피, 스포츠마사지)
  - 언어 지원 (한국어, 영어, 일본어, 중국어)
  - 지역별 (한강구, 해안구, 손짜구, 출장가능)
- **✅ 페이지네이션**: 6개씩 3열 그리드, 완전한 페이징 시스템
- **✅ 프리미엄 광고**: 2개 광고 공간 (500×150px)
- **✅ Pinterest 스타일**: 웹에서 이미지 원본 비율 유지, 1행부터 채우는 방식
- **✅ 기본 이미지**: 노션 ID=0 행 업체사진 자동 적용
- **✅ 모바일 최적화**: 반응형 디자인 (데스크톱 3열 → 모바일 2열)

#### **🎨 디자인 완성**
- **제목**: "당신만을 위한 깊은 휴식" (이모지 제거)
- **부제목**: "다낭 남성 전용 프리미엄 마사지, 특별한 곳만 골랐습니다"
- **에코걸 스타일 헤더**: 동일한 1줄 메뉴바 (통일성 확보)
- **업체 카드**: 배경 이미지 + 흰색 오버레이로 클릭성 유지

#### **🔧 기술적 구현**
```javascript
// 핵심 기능들
- 실시간 노션 연동 (API 키: ntn_61731030830...)
- 검색/필터링 시스템 (JavaScript 기반)
- 페이지네이션 (6개씩 표시)
- 배경 이미지 동적 설정
- 모바일 터치 이벤트 최적화
```

### **📊 현재 데이터 현황**
- **총 업체 수**: 6개 (노션 DB 기준)
- **기본 이미지**: ID=0 행 업체사진 (Unsplash 마사지 이미지)
- **필터링 지원**: 서비스 3종, 언어 4종, 지역 4종
- **페이지 수**: 1페이지 (6개 업체)

### **💰 수익 모델 준비**
- **프리미엄 광고**: 2개 × 월 50만원 = **100만원** 즉시 가능
- **확장 가능**: 업체 증가 시 페이지 자동 확장
- **광고 문의**: 상단 연락처 (카카오톡/전화) 활용

### **🚀 다음 단계**
- [ ] **상세 페이지 개발**: `detail.html?id=업체ID`
- [ ] **실제 업체 추가**: 노션 DB에 실제 업체 정보 확장
- [ ] **그랩 연동**: 딥링크 기능 구현
- [ ] **영어 버전**: `index-en.html` 생성

## 📄 **마사지 상세페이지 구조 (확정)**

### **💡 핵심 컨셉: "간단하지만 필요한 정보는 다 있게" (모바일 우선)**

```
┌─────────────────────────────┐
│ 🏆 골든 타이 마사지         │ ← 큰 제목
├─────────────────────────────┤
│ 📸 업체사진 (슬라이드)       │ ← 노션 업체사진 여러장
├─────────────────────────────┤
│ 🏷️ 타이 | 오일 | 커플      │ ← 서비스종류 태그
│ 🗣️ 한국어 | 영어 | 베트남어 │ ← 언어지원 태그
├─────────────────────────────┤
│ "프리미엄 서비스로..."       │ ← 홍보문구
│ 🎁 EchoPal 고객 20% 할인    │ ← 특별혜택
├─────────────────────────────┤
│📞 +84-905-123-456 [전화]   │ ← 바로 전화 걸기
│ 💬 kakao_massage [복사]     │ ← 카톡ID 복사
├─────────────────────────────┤
│ 📍 다낭시 한강구 123번지     │ ← 주소
│ 🚗 [그랩 호출] [주소복사]    │ ← 핵심 기능!
└─────────────────────────────┘
```

### **✅ 노션 데이터 활용 (고객용만)**
- **업체명** (Title) - 큰 제목
- **업체사진** (Files) - 여러장 슬라이드
- **서비스종류** (Multi-select) - 태그 표시
- **언어지원** (Multi-select) - 태그 표시  
- **홍보문구** (Rich Text) - 설명
- **특별혜택** (Text) - 할인 정보
- **연락처** (Phone) - 원터치 전화
- **업체주소** (Text) - 주소 표시
- **GPS좌표** (Text) - 그랩 연동용 (숨김)

### **❌ 고객에게 숨길 데이터**
- 대표명, 이메일, 사업자등록번호
- 월광고금액, 계약기간, 계약상태
- 월간클릭수, 만족도평가 (내부 관리용)
- 담당자, 메모

### **🔥 경쟁 우위 기능**
1. **그랩 원클릭**: GPS 좌표로 그랩 앱 바로 호출
2. **전화 원터치**: 번호 복사 말고 바로 전화
3. **카톡 즉시 복사**: ID 터치하면 클립보드 복사
4. **이미지 스와이프**: 업체 내부 사진들 쉽게 보기

### **🎯 사용자 시나리오**
```
술 마신 상태에서도:
1. 업체 선택 (3초)
2. 그랩 호출 (1터치)  
3. 끝! (앱 안나가도 됨)
```

## 🚗 **운송 연계 아이디어 (향후 검토)**

### **가능한 옵션들 (현장 검증 필요)**
- 다낭 로컬 택시/바이크 업체 제휴
- 호텔/숙소 픽업 서비스 연계
- EchoPal 전용 드라이버팀 구성

### **현실적 한계**
- 업체 오너 마인드에 따라 달라짐
- 운송 책임 리스크 고려 필요
- 현장 피드백 후 단계적 검토

**당분간은 그랩 딥링크만으로도 충분히 혁신적** 🚀

---

**📞 업체 모집 연락처**
- **카카오톡**: EchoPal_massage
- **이메일**: massage@echopal.net
- **전화**: +84-XXX-XXX-XXXX

**🔄 마지막 업데이트**: 2025년 5월 31일 - 마사지 전체 페이지 100% 완성
