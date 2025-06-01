# 📁 EchoPal 프로젝트 구조 가이드

## 🎯 프로젝트 개요
EchoPal은 다낭 종합 가이드 플랫폼으로, 노션 연동 기반의 모듈화된 구조로 개발되었습니다.

## 📂 실제 디렉토리 구조 (2025년 6월 1일 기준)

```
E:\ecogirl/
├── index.html                    # 🏠 메인 홈페이지 (3D 갤러리 + 가라오케)
├── proxy_server.py              # 🔗 노션 API 프록시 서버
├── 프록시 서버 여는 방법.txt      # 📋 서버 실행 가이드
├── components/                   # 🧩 완성된 JS 컴포넌트들
│   ├── ecogirl-gallery.js       # ✅ 3D 갤러리 컴포넌트 (완성)
│   └── karaoke-section.js       # ✅ 가라오케 섹션 컴포넌트 (완성)
├── assets/                       # 🎨 공통 자원
│   ├── css/
│   │   ├── global.css           # 전역 스타일
│   │   ├── detail_new.css       # ✅ 상세페이지 스타일 (완성)
│   │   ├── gallery.css          # ✅ 전체보기 갤러리 스타일
│   │   └── detail-백업.css      # 백업 파일
│   ├── js/
│   │   ├── notion-api-proxy.js  # ✅ 노션 API 연결 모듈 (완성)
│   │   └── notion-api-백업.js   # 백업 파일
│   └── images/
│       ├── profiles/            # 에코걸 프로필 이미지들
│       └── ads-백업/            # 광고 이미지 백업
├── ecogirl/                      # 👩 에코걸 모듈 (완성)
│   ├── gallery.html             # ✅ 전체보기 갤러리 (필터링+페이지네이션)
│   ├── detail_new.html          # ✅ 상세페이지 (노션 연동)
│   ├── js/
│   │   ├── gallery-new.js       # ✅ 갤러리 로직 (완성)
│   │   ├── detail_new.js        # ✅ 상세페이지 로직 (완성)
│   │   ├── gallery-백업.js      # 백업 파일
│   │   └── detail_backup.js     # 백업 파일
│   ├── css-백업/               # 백업 폴더
│   ├── images-백업/            # 백업 폴더
│   └── profiles-백업/          # 백업 폴더
├── sections/                     # 🆕 HTML 임베드 시스템
│   ├── ecogirl-section.html     # ✅ 에코걸 섹션 독립 HTML
│   └── massage-section.html     # ✅ 마사지 섹션 HTML
├── massage/                      # 💆 마사지 모듈 (표준 템플릿 ⭐)
│   ├── index.html               # ✅ 전체보기 페이지
│   ├── detail.html              # ✅ 상세페이지
│   ├── shop-image.html          # ✅ 이미지 모듈
│   ├── shop-info.html           # ✅ 정보 모듈
│   ├── css/
│   │   └── detail.css           # ✅ 완성된 스타일
│   ├── js/
│   │   ├── massage-detail-data.js # ✅ 데이터 로더
│   │   ├── massage-detail-ui.js   # ✅ UI 렌더링
│   │   └── massage-detail-main.js # ✅ 메인 컨트롤러
│   ├── backup/                  # 🗄️ 백업 폴더
│   └── README.md                # 📖 가이드 문서
├── data/                         # 📊 데이터 파일들 (완성)
│   ├── ecogirls.json            # ✅ 에코걸 백업 데이터
│   ├── images.json              # ✅ 이미지 목록
│   └── massage-ads.json         # ✅ 마사지 광고 데이터
├── docs/                         # 📚 문서들
│   ├── BUSINESS.md              # 비즈니스 모델
│   ├── README.md                # 프로젝트 설명
│   ├── STRATEGY.md              # 사업 전략
│   ├── ROADMAP.md               # 개발 로드맵
│   ├── MASSAGE_DATABASE_PLAN.md # 마사지 DB 계획
│   ├── NOTION_API_INTEGRATION_COMPLETE.md # 노션 연동 완료 리포트
│   ├── MAIN_INDEX_MODULARIZATION.md # 메인 모듈화 계획
│   └── ROADMAP-백업-20250531.md # 백업 문서
├── backup/                       # 🗄️ 백업 파일들
│   ├── 3d-gallery-versions/     # 3D 갤러리 버전들
│   ├── detail.html.unused       # 사용하지 않는 파일
│   └── detail.js.unused         # 사용하지 않는 파일
├── tools-백업/                  # 🔧 백업된 도구들
├── ecogirl-백업-250528/         # 🛡️ 원본 전체 백업
├── test-notion-백업.html        # 노션 테스트 백업
└── 노션api-백업.txt             # 노션 API 백업 정보
```

## 🔗 경로 규칙 (실제 운영 중)

### 상대 경로 사용 원칙
- **메인 → 컴포넌트**: `components/파일명.js`
- **메인 → 에셋**: `assets/css/파일명.css`
- **메인 → 데이터**: `data/파일명.json`
- **서브모듈 → 에셋**: `../assets/css/파일명.css`
- **서브모듈 → 데이터**: `../data/파일명.json`
- **노션 API**: `http://localhost:8080/api/notion/...` (프록시 서버 통해)

### 실제 이미지 경로
- **에코걸 프로필**: `assets/images/profiles/` (현재 노션에서 로드)
- **광고 이미지**: `assets/images/ads-백업/` (백업 보관)
- **백업 이미지**: SVG 기본 이미지 자동 생성

### 실제 페이지 이동 경로
- **메인 → 에코걸 전체보기**: `ecogirl/gallery.html`
- **메인 → 에코걸 상세**: `ecogirl/detail_new.html?id=123`
- **갤러리 → 상세**: `detail_new.html?id=123`
- **상세 → 메인**: `../index.html`
- **상세 → 갤러리**: `gallery.html`

## 🧩 컴포넌트 구조 (완성된 시스템)

### EcogirlGallery 클래스 (완성)
```javascript
// 사용법: 메인 페이지 (index.html)
const gallery = new EcogirlGallery('main-gallery');
await gallery.init();

// 노션 연동: 
- API: http://localhost:8080/api/notion/database/202e5f74-c72e-815d-8049-c65ef05fdc6b/query
- 백업: data/images.json
- 이동: ecogirl/detail_new.html?id=

// 3D 기능:
- Three.js 기반 3D 렌더링
- 24개 프로필 3단 원기둥 배치
- 360도 드래그 회전 + 자동회전
- 모바일 터치 지원
```

## ✅ 새 모듈 추가 가이드 (실제 패턴 기반)

### 1. 마사지 섹션 개발 예정 (다음 작업)
```bash
# 이미 구조는 존재함
E:\ecogirl\massage\
├── index.html     # 기본 구조 있음
├── js/           # 빈 폴더
└── css/          # 빈 폴더

# 필요 작업:
1. components/massage-section.js 생성 (karaoke-section.js 복사)
2. data/massage-ads.json 활용 (이미 있음)
3. 노션 마사지 DB 연동 (203e5f74-c72e-815d-8f39-d2946ee85c0a)
4. Google Maps 마사지샵 위치 연동
```

### 2. 컴포넌트 클래스 표준 패턴
```javascript
// components/섹션명-section.js
class 섹션명Section {
    constructor(containerId) {
        this.containerId = containerId;
        this.notionData = null; // 노션 연동
    }
    
    async init() {
        await this.loadNotionData();    // 노션 API 호출
        await this.loadStaticData();    // 백업 데이터 로드
        this.renderHTML();              // HTML 구조 생성
        this.initGoogleMap();           // 구글맵 초기화
        this.setupAdBoxes();            // 광고박스 6개 설정
        this.setupMobileEvents();       // 모바일 최적화
    }
    
    async loadNotionData() {
        // 노션 API 호출 (프록시 서버 통해)
    }
    
    renderHTML() {
        // 야한 그라데이션 광고박스 + 지도 렌더링
    }
}

window.섹션명Section = 섹션명Section;
```

### 3. 메인 페이지 연동 패턴
```html
<!-- index.html -->
<script src="components/섹션명-section.js"></script>

<script>
document.addEventListener('DOMContentLoaded', async () => {
    // 에코걸 갤러리 (완성)
    const ecogirlGallery = new EcogirlGallery('main-gallery');
    await ecogirlGallery.init();
    
    // 가라오케 섹션 (완성)
    const karaokeSection = new KaraokeSection('karaoke-section');
    await karaokeSection.init();
    
    // 마사지 섹션 (예정)
    // const massageSection = new MassageSection('massage-section');
    // await massageSection.init();
});
</script>
```

## 🚀 개발 워크플로우 (실제 운영)

### **🔄 표준 템플릿 복사 가이드**
```bash
# 1. 마사지 폴더 전체 복사
cp -r massage/ karaoke/
cp -r massage/ poolvilla/

# 2. 파일명 일괄 변경
massage-detail-* → karaoke-detail-*
massage-detail-* → poolvilla-detail-*

# 3. DB ID 변경 (각 업체군별 노션 DB)
massage: 203e5f74-c72e-815d-8f39-d2946ee85c0a
karaoke: [새 노션 DB ID]
poolvilla: [새 노션 DB ID]

# 4. 업체군별 커스텀 필드 추가
```

### **📊 표준 템플릿 구조**
```
{업체군}/
├── index.html                    # 전체보기 페이지
├── detail.html                   # 상세 페이지  
├── shop-image.html               # 이미지 모듈
├── shop-info.html                # 정보 모듈
├── css/detail.css                # 스타일시트
├── js/
│   ├── {업체군}-detail-data.js   # 노션 데이터 로더
│   ├── {업체군}-detail-ui.js     # UI 렌더링
│   └── {업체군}-detail-main.js   # 메인 컨트롤러
├── backup/                       # 백업 폴더
└── README.md                     # 가이드 문서
```

### 노션 연동 개발 환경
```bash
# 1. 프록시 서버 실행 (필수)
cd E:\ecogirl
python proxy_server.py

# 2. 브라우저에서 확인
http://localhost:8080/index.html          # 메인 페이지
http://localhost:8080/ecogirl/gallery.html    # 에코걸 전체보기
http://localhost:8080/ecogirl/detail_new.html?id=1  # 에코걸 상세
http://localhost:8080/massage/index.html      # 마사지 전체보기 ⭐
http://localhost:8080/massage/detail.html?id=1 # 마사지 상세 ⭐

# 3. 노션 데이터베이스 관리
https://www.notion.so/Ecogirl-202e5f74c72e80ad8049c65ef05fdc6b (에코걸)
https://www.notion.so/Massage-203e5f74c72e815d8f39d2946ee85c0a (마사지)
```

### 백업 및 버전 관리
```bash
# 중요 백업들
├── ecogirl-백업-250528/         # 원본 전체 백업
├── backup/3d-gallery-versions/  # 3D 갤러리 버전들
├── massage/backup/              # 마사지 백업 폴더
├── tools-백업/                 # 테스트 도구들
└── *-백업.* 파일들             # 각종 백업 파일들

# 새로운 기능 개발 시 백업 생성 권장
```

### 에코걸 시스템 보호 규칙 ⚠️
```
🛡️ 절대 건드리지 않을 영역:
├── components/ecogirl-gallery.js    # 3D 갤러리 완성품
├── ecogirl/ 폴더 전체              # 에코걸 모듈 완성품  
├── assets/js/notion-api-proxy.js   # 노션 연동 완성품
└── proxy_server.py                 # 프록시 서버

⚠️ 새 기능 개발 시:
- 에코걸 관련 파일 절대 수정 금지
- 새로운 섹션은 독립적 모듈로 개발
- 문제 생기면 백업에서 즉시 복원
```

---

**📧 문의**: 프로젝트 관련 질문은 개발팀에 문의  
**🔄 마지막 업데이트**: 2025년 5월 31일 - 실제 프로젝트 구조 반영 및 노션 연동 시스템 완성
**🎯 현재 상태**: 에코걸 시스템 100% 완성, 마사지 섹션 개발 준비 중
