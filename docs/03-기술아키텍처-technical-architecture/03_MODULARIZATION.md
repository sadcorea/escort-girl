# 🧩 모듈화 시스템 기술 문서
> **표준 템플릿 기반 확장 가능한 아키텍처**

## 🎯 **모듈화의 핵심 가치**

### **개발 효율성 혁신**
```
기존 방식: 처음부터 개발 (2주)
표준 템플릿: 복사 + 수정 (2-3일)
효율성 향상: 90% 시간 단축

마사지 시스템 = 모든 업체군의 표준 템플릿
├── 가라오케: massage/ → karaoke/ (복사)
├── 풀빌라: massage/ → poolvilla/ (복사)
├── 레스토랑: massage/ → restaurant/ (복사)
└── 무제한 확장 가능
```

### **일관성 보장**
- **동일한 UX**: 모든 업체군에서 동일한 사용자 경험
- **표준화된 구조**: 동일한 파일 구조 + 명명 규칙
- **유지보수 용이**: 하나의 템플릿 개선 → 전체 적용

## 🏗️ **모듈 아키텍처 구조**

### **1. 독립 모듈 시스템**
```
🧩 완전 독립 모듈:
├── ecogirl/ (에코걸 완성품)
│   ├── 자체 CSS, JS, HTML
│   ├── 독립적 노션 DB 연동
│   ├── 완전한 기능 구현
│   └── 다른 모듈과 무관한 동작
├── massage/ (표준 템플릿)
│   ├── 복사 가능한 완전한 구조
│   ├── 28개 노션 필드 매핑
│   ├── 전체보기 + 상세페이지
│   └── 확장 가능한 설계
└── 향후 모듈들 (karaoke/, poolvilla/)
    └── massage/ 구조 100% 복사
```

### **2. 공유 컴포넌트 시스템**
```
🔗 공유 모듈:
├── components/ (재사용 컴포넌트)
│   ├── ecogirl-gallery.js (3D 갤러리)
│   └── 향후 섹션별 컴포넌트들
├── assets/ (공용 자원)
│   ├── js/notion-api-proxy.js (노션 연동)
│   ├── css/global.css (전역 스타일)
│   └── images/ (공용 이미지)
└── data/ (백업 데이터)
    ├── ecogirls.json (에코걸 백업)
    └── 각 모듈별 백업 파일들
```

## 📋 **표준 템플릿 구조 (마사지 시스템)**

### **파일 구조 표준**
```
massage/ (표준 템플릿)
├── index.html                     # 전체보기 페이지
├── detail.html                    # 상세페이지
├── shop-image.html                # 이미지 모듈 (HTML 분리)
├── shop-info.html                 # 정보 모듈 (HTML 분리)
├── css/
│   └── detail.css                 # 모듈 전용 스타일
├── js/
│   ├── massage-detail-data.js     # 노션 데이터 로더
│   ├── massage-detail-ui.js       # UI 렌더링 로직
│   └── massage-detail-main.js     # 메인 컨트롤러
├── backup/                        # 백업 폴더
└── README.md                      # 가이드 문서

복사 후 변경사항:
├── 폴더명: massage/ → karaoke/
├── 파일명: massage-* → karaoke-*
├── 노션 DB ID 변경
└── 업체군별 특화 필드 추가
```

### **JavaScript 모듈 패턴**
```javascript
// 표준 데이터 로더 (massage-detail-data.js)
class MassageDataLoader {
    constructor() {
        this.databaseId = '203e5f74-c72e-815d-8f39-d2946ee85c0a';
        this.notionAPI = new NotionAPIProxy();
    }
    
    async loadShopData(shopId) {
        // 노션에서 업체 데이터 로드
    }
    
    async loadShopList() {
        // 전체보기용 업체 목록 로드
    }
}

// 표준 UI 렌더러 (massage-detail-ui.js)
class MassageUIRenderer {
    renderShopImages(images) {
        // Pinterest 스타일 이미지 갤러리
    }
    
    renderShopInfo(shopData) {
        // 업체 정보 렌더링
    }
    
    renderContactButtons(contact) {
        // 연락처 버튼들 (전화, 카카오)
    }
}

// 표준 메인 컨트롤러 (massage-detail-main.js)
class MassageDetailController {
    constructor() {
        this.dataLoader = new MassageDataLoader();
        this.uiRenderer = new MassageUIRenderer();
    }
    
    async init() {
        // 페이지 초기화 및 데이터 로드
    }
}
```

## 🚀 **모듈 확장 프로세스**

### **새 업체군 추가 단계**
```bash
# 1단계: 템플릿 복사
cp -r massage/ karaoke/

# 2단계: 파일명 일괄 변경
find karaoke/ -name "massage-*" -exec rename 's/massage/karaoke/' {} \;

# 3단계: 파일 내용 수정
- HTML 제목, 설명 변경
- JavaScript 클래스명 변경
- CSS 클래스명 필요시 변경
- 노션 DB ID 변경

# 4단계: 노션 DB 구축
- 마사지 DB 구조 복사
- 업체군별 특화 필드 추가
- 테스트 데이터 3-5개 입력

# 5단계: 프록시 서버 설정
- proxy_server.py에 새 DB ID 추가
- 필드 매핑 확인

# 6단계: 메인 페이지 연동
- index.html에 새 섹션 추가
- 메뉴 링크 연결
- 전체 테스트
```

## 📊 **성능 및 최적화**

### **모듈별 성능 최적화**
```javascript
// 지연 로딩 (Lazy Loading)
class ModuleLoader {
    async loadModule(moduleName) {
        if (!this.loadedModules.has(moduleName)) {
            const module = await import(`/modules/${moduleName}/main.js`);
            this.loadedModules.set(moduleName, module);
        }
        return this.loadedModules.get(moduleName);
    }
}

// 조건부 로딩
function loadModuleIfNeeded(sectionId) {
    const section = document.getElementById(sectionId);
    if (section && isInViewport(section)) {
        loadModule(sectionId);
    }
}
```

### **메모리 관리**
```javascript
// 모듈 해제 시 리소스 정리
class ModuleManager {
    unloadModule(moduleName) {
        const module = this.modules.get(moduleName);
        if (module && module.cleanup) {
            module.cleanup(); // 이벤트 리스너 제거 등
        }
        this.modules.delete(moduleName);
    }
    
    // 사용하지 않는 모듈 자동 정리
    scheduleCleanup() {
        setInterval(() => {
            this.cleanupUnusedModules();
        }, 300000); // 5분마다
    }
}
```

---

**🧩 모듈화 핵심**: 독립성 + 표준화 + 재사용성

**🚀 개발 효율**: 90% 시간 단축 (2주 → 2-3일)

**🔧 확장성**: 무제한 업체군 추가 가능

**📅 완성일**: 2025년 6월 1일 - 표준 템플릿 시스템 완성
