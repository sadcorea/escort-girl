# 🏗️ EchoPal 모듈화 구조 완전 가이드

## 📊 전체 시스템 구조 (2025년 6월 1일 기준)

```
E:\ecogirl/
├── index.html                    # 🏠 메인 홈페이지 (모듈화 허브)
├── proxy_server.py              # 🔗 노션 API 프록시 서버
├── components/                   # 🧩 재사용 가능한 컴포넌트들
│   ├── ecogirl-gallery.js       # ✅ 3D 갤러리 컴포넌트 (완성)
│   └── karaoke-section.js       # 🎤 가라오케 섹션 (완성)
├── sections/                     # 🆕 HTML 임베드 시스템
│   ├── ecogirl-section.html     # ✅ 에코걸 섹션 HTML
│   └── massage-section.html     # ✅ 마사지 섹션 HTML
├── ecogirl/                      # 👩 에코걸 모듈 (완성)
│   ├── index.html               # 📋 전체보기 갤러리
│   ├── detail.html              # 📄 상세 페이지
│   ├── js/
│   │   ├── ecogirl-gallery.js   # 🎮 갤러리 로직
│   │   └── ecogirl-detail.js    # 💻 상세 로직
│   ├── backup/                  # 🗄️ 모든 백업 파일들
│   └── README.md                # 📖 에코걸 가이드
├── massage/                      # 💆 마사지 모듈 (표준 템플릿 ⭐)
│   ├── index.html               # 📋 전체보기 페이지
│   ├── detail.html              # 📄 상세 페이지
│   ├── shop-image.html          # 🖼️ 이미지 모듈
│   ├── shop-info.html           # ℹ️ 정보 모듈
│   ├── css/detail.css           # 🎨 스타일시트
│   ├── js/
│   │   ├── massage-detail-data.js  # 📊 데이터 로더
│   │   ├── massage-detail-ui.js    # 🎭 UI 렌더링
│   │   └── massage-detail-main.js  # 🎯 메인 컨트롤러
│   ├── backup/                  # 🗄️ 백업 폴더
│   └── README.md                # 📖 마사지 가이드
├── assets/                       # 🎨 공통 자원
│   ├── css/
│   ├── js/notion-api-proxy.js   # 📡 노션 API 연결
│   └── images/
└── data/                         # 📊 백업 데이터 파일들
```

## 🔄 섹션 모듈화 시스템

### **메인 인덱스 → 섹션 임베드 방식**

메인 페이지(`/index.html`)는 각 섹션을 **동적으로 임베드**하는 허브 역할:

```javascript
// 메인 인덱스 로드 순서
document.addEventListener('DOMContentLoaded', async () => {
    // 1단계: 에코걸 섹션 로드
    await loadSection('ecogirl-section', 'ecogirl-section.html');
    
    // 2단계: 마사지 섹션 로드  
    await loadSection('massage-section', 'massage-section.html');
    
    // 3단계: 각 섹션별 특화 초기화
    initEcogirlGallery();    // 3D 갤러리 초기화
    loadMassageImageDirect(); // 마사지 이미지 로드
});
```

### **섹션별 동작 흐름**

#### **🌟 에코걸 섹션**
```
메인 인덱스 (/index.html)
    ↓ loadSection('ecogirl-section', 'ecogirl-section.html')
sections/ecogirl-section.html (에코걸 소개 + 3D 갤러리 컨테이너)
    ↓ initEcogirlGallery()
components/ecogirl-gallery.js (3D 갤러리 렌더링)
    ↓ 프로필 클릭 이벤트
ecogirl/detail.html?id=X (상세 페이지)
    ↓ 전체보기 버튼
ecogirl/index.html (갤러리 페이지)
```

#### **💆 마사지 섹션**
```
메인 인덱스 (/index.html)  
    ↓ loadSection('massage-section', 'massage-section.html')
sections/massage-section.html (마사지 소개 + 이미지)
    ↓ loadMassageImageDirect()
노션 API → 마사지 DB에서 이미지 로드
    ↓ 전체보기 버튼 클릭
massage/index.html (전체보기)
    ↓ 업체 클릭
massage/detail.html?id=X (상세 페이지)
```

## 🎯 표준 템플릿 시스템

### **마사지 = 모든 업체군의 표준**

마사지 폴더 구조가 **모든 업체군의 표준 템플릿**으로 확정:

```bash
# 새 업체군 개발 시 복사 방식
cp -r massage/ karaoke/
cp -r massage/ poolvilla/
cp -r massage/ restaurant/

# 파일명 변경
massage-detail-* → {업체군}-detail-*

# DB ID 변경
massage: 203e5f74-c72e-815d-8f39-d2946ee85c0a
karaoke: [새 노션 DB ID]
poolvilla: [새 노션 DB ID]
```

### **개발 효율성 극대화**
- **80% 복사**: 검증된 구조 그대로 사용
- **20% 커스텀**: 업체군별 특화 필드만 추가
- **개발 시간**: 기존 2주 → 2-3일로 단축

## 🔗 경로 시스템

### **메인 인덱스 기준**
```javascript
// 상단 네비게이션에서 각 섹션으로 이동
"ecogirl/index.html"     // 에코걸 전체보기
"massage/index.html"     // 마사지 전체보기

// 3D 갤러리에서 상세로 이동  
"ecogirl/detail.html?id=1"   // 에코걸 상세

// 전체보기에서 상세로 이동
"detail.html?id=1"       // 각 폴더 내에서 상대경로
```

### **하위 페이지에서 메인으로**
```javascript
// 에코걸/마사지 → 메인 홈
"../index.html"

// 에코걸 상세 → 전체보기
"index.html"

// 마사지 상세 → 전체보기
"index.html"
```

## 🚀 노션 연동 시스템

### **DB별 역할 분담**
```javascript
// 에코걸 DB
"202e5f74-c72e-815d-8049-c65ef05fdc6b"
→ 3D 갤러리 + 상세페이지

// 마사지 DB  
"203e5f74-c72e-815d-8f39-d2946ee85c0a"
→ 전체보기 + 상세페이지
```

### **API 호출 흐름**
```
프록시 서버 (proxy_server.py)
    ↓ 포트 8080
노션 API 중계
    ↓ DB별 분기 처리
각 섹션에서 실시간 데이터 사용
```

## 💡 모듈화의 핵심 장점

### **🔧 유지보수성**
- **독립적 수정**: 각 섹션별 개별 수정 가능
- **영향 최소화**: 한 섹션 문제가 다른 섹션에 영향 안줌
- **테스트 용이성**: 섹션별 개별 테스트 가능

### **🚀 확장성**
- **새 섹션 추가**: sections/ 폴더에 HTML 추가만으로 확장
- **재사용성**: 컴포넌트를 다른 페이지에서도 사용
- **표준화**: 동일한 패턴으로 무한 확장

### **👥 협업 효율성**
- **역할 분담**: 각자 다른 섹션 담당 가능
- **병렬 개발**: 동시에 여러 섹션 개발 진행
- **백업 독립성**: 섹션별 백업 관리

---

**📅 작성일**: 2025년 6월 1일  
**🎯 상태**: 에코걸 + 마사지 모듈화 완성, 표준 템플릿 확정  
**🔄 다음**: 가라오케, 풀빌라 등 추가 업체군 개발