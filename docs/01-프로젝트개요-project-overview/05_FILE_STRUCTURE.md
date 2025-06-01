# 📁 EchoPal 파일 구조 가이드
> **프로젝트 전체 파일 구조와 각 파일의 역할**

## 🏗️ **전체 디렉토리 구조**

```
E:\ecogirl/
├── index.html                          # 🏠 메인 홈페이지
├── proxy_server.py                     # 🔗 노션 API 프록시 서버
├── 프록시 서버 여는 방법.txt             # 📋 서버 실행 가이드
├── components/                          # 🧩 완성된 JS 컴포넌트
│   ├── ecogirl-gallery.js              # ✅ 3D 갤러리 (절대 보호)
│   └── karaoke-section.js              # ✅ 가라오케 섹션
├── assets/                              # 🎨 공통 자원
│   ├── css/                            # 스타일시트
│   ├── js/                             # JavaScript 모듈
│   └── images/                         # 이미지 파일
├── ecogirl/                            # 👩 에코걸 모듈 (절대 보호)
│   ├── gallery.html                   # 전체보기 갤러리
│   ├── detail_new.html                # 상세페이지
│   └── js/                            # 에코걸 전용 로직
├── massage/                            # 💆 마사지 모듈 (표준 템플릿)
│   ├── index.html                     # 전체보기 페이지
│   ├── detail.html                    # 상세페이지
│   └── js/                            # 마사지 전용 로직
├── sections/                           # 🆕 HTML 임베드 시스템
├── data/                               # 📊 백업 데이터
├── docs/                               # 📚 문서화
└── backup/                             # 🗄️ 백업 파일들
```

## 🔥 **핵심 파일 상세 설명**

### **🏠 메인 페이지 (index.html)**
```
역할: 홈페이지 메인 엔트리포인트
포함 기능:
├── 에코걸 3D 갤러리 (절대 보호)
├── 가라오케 섹션 (완성)
├── 메인 광고 배너
└── 향후 확장 섹션들 (마사지, 풀빌라)

중요도: ⭐⭐⭐⭐⭐ (최고)
수정 주의: 에코걸 부분 절대 수정 금지
```

### **🔗 노션 프록시 서버 (proxy_server.py)**
```
역할: 노션 API CORS 문제 해결 + 중계 서버
기능:
├── 노션 API 호출 중계
├── CORS 헤더 자동 처리
├── 에코걸/마사지 DB 구분 처리
└── 8080 포트 웹서버 + API 서버 통합

중요도: ⭐⭐⭐⭐⭐ (최고)
수정 주의: 절대 수정 금지 (시스템 핵심)
```

## 🛡️ **절대 보호 영역**

### **👩 ecogirl/ 폴더 (완성된 에코걸 시스템)**
```
ecogirl/
├── gallery.html                       # ✅ 전체보기 갤러리 (완성)
├── detail_new.html                    # ✅ 상세페이지 (완성)
├── js/
│   ├── gallery-new.js                 # ✅ 갤러리 로직 (완성)
│   └── detail_new.js                  # ✅ 상세페이지 로직 (완성)
├── css-백업/                          # 백업 폴더
└── 기타 백업 폴더들...

⚠️ 경고: 이 폴더 전체가 절대 보호 구역
수정 금지: 모든 파일과 하위 폴더
이유: 완성된 제품, 복구 어려움
```

### **🧩 components/ 폴더**
```
components/
├── ecogirl-gallery.js                 # ❌ 절대 수정 금지
│   └── 3D 갤러리 핵심 컴포넌트
└── karaoke-section.js                 # ✅ 완성 (참고용)
    └── 가라오케 섹션 컴포넌트

역할: 재사용 가능한 독립 컴포넌트들
패턴: class 기반, 모듈화 구조
확장: 새 섹션 시 이 패턴 따라 개발
```

### **🎨 assets/ 폴더**
```
assets/
├── css/
│   ├── global.css                     # 전역 스타일
│   ├── gallery.css                    # 전체보기 갤러리
│   └── detail_new.css                 # 상세페이지
├── js/
│   └── notion-api-proxy.js            # ❌ 노션 연동 (수정 금지)
└── images/
    └── profiles/                      # 프로필 이미지들

수정 주의: notion-api-proxy.js는 수정 금지
안전 영역: CSS 파일들은 신중히 수정 가능
```

## 📋 **표준 템플릿 (마사지 시스템)**

### **💆 massage/ 폴더 (모든 업체군의 기본 구조)**
```
massage/
├── index.html                         # ✅ 전체보기 페이지 (완성)
├── detail.html                        # ✅ 상세페이지 (완성)
├── shop-image.html                    # 🧩 이미지 모듈
├── shop-info.html                     # 🧩 정보 모듈
├── css/
│   └── detail.css                     # ✅ 완성된 스타일
├── js/
│   ├── massage-detail-data.js         # 📊 노션 데이터 로더
│   ├── massage-detail-ui.js           # 🎨 UI 렌더링
│   └── massage-detail-main.js         # 🎯 메인 컨트롤러
├── backup/                            # 🗄️ 백업 폴더
└── README.md                          # 📖 가이드 문서

활용법: 새 업체군 개발 시 이 폴더 전체 복사
복사 대상: karaoke/, poolvilla/, restaurant/ 등
수정 사항: 파일명 변경 + 노션 DB ID 변경
개발 시간: 2주 → 2-3일로 단축
```

## 📊 **데이터 관리 구조**

### **📊 data/ 폴더 (백업 데이터)**
```
data/
├── ecogirls.json                      # 에코걸 백업 데이터
├── images.json                        # 이미지 목록
├── massage-ads.json                   # 마사지 광고 데이터
└── karaoke-locations.json             # 가라오케 GPS 좌표

역할: 노션 서버 다운 시 백업 데이터
갱신: 노션 데이터 변경 시 수동 업데이트
중요도: ⭐⭐⭐ (백업 시스템)
```

### **🆕 sections/ 폴더 (HTML 임베드 시스템)**
```
sections/
├── ecogirl-section.html               # 에코걸 독립 HTML
└── massage-section.html               # 마사지 독립 HTML

역할: 메인 페이지에 임베드할 섹션들
장점: 독립적 개발 및 테스트 가능
사용법: iframe 또는 JavaScript 동적 로드
```

## 🔧 **노션 연동 구조**

### **노션 데이터베이스 연결**
```
에코걸 DB:
├── ID: 202e5f74-c72e-815d-8049-c65ef05fdc6b
├── 용도: 에코걸 프로필 관리
├── 필드: 14개 (이름, 나이, 이미지, 언어 등)
└── 상태: 100% 완성, 5개 프로필

마사지 DB:
├── ID: 203e5f74-c72e-815d-8f39-d2946ee85c0a
├── 용도: 마사지 업체 관리
├── 필드: 28개 (업체명, 주소, 서비스 등)
└── 상태: 100% 완성, 6개 업체

향후 확장:
├── 가라오케 DB: 신규 생성 예정
├── 풀빌라 DB: 신규 생성 예정
└── 기타 업체군: 필요시 추가
```

### **API 연결 흐름**
```
웹페이지 → assets/js/notion-api-proxy.js → proxy_server.py → 노션 API
                ↑                           ↑
           JavaScript 모듈            Python 프록시 서버
           (CORS 처리)               (API 키 + 중계)
```

## 📚 **문서화 구조**

### **📚 docs/ 폴더 (6개 카테고리)**
```
docs/
├── 01-프로젝트개요-project-overview/    # 📋 프로젝트 전체 개요
├── 02-비즈니스전략-business-strategy/   # 💼 비즈니스 전략
├── 03-기술아키텍처-technical-architecture/ # 🏗️ 기술 구조
├── 04-모듈별문서-module-specific/       # 🧩 모듈별 문서
├── 05-구현가이드-implementation-guides/ # 🔧 구현 가이드
└── 06-아카이브-archives/               # 🗄️ 백업 문서

활용법: 목적에 따라 해당 폴더 참조
우선순위: 01 → 03 → 04 → 05 순으로 읽기
```

## 🚀 **새 모듈 추가 시 파일 구조**

### **가라오케 모듈 예시 (예정)**
```
karaoke/ (massage/ 폴더 복사)
├── index.html                         # 전체보기 페이지
├── detail.html                        # 상세페이지
├── shop-image.html                    # 이미지 모듈
├── shop-info.html                     # 정보 모듈
├── css/
│   └── detail.css                     # 스타일시트
├── js/
│   ├── karaoke-detail-data.js         # 노션 데이터 로더
│   ├── karaoke-detail-ui.js           # UI 렌더링
│   └── karaoke-detail-main.js         # 메인 컨트롤러
└── README.md                          # 가이드 문서

개발 시간: 2-3일 (템플릿 복사로 단축)
변경 사항: 파일명 + 노션 DB ID + 특화 필드
```

## 📋 **파일 명명 규칙**

### **JavaScript 파일**
```
패턴: [모듈명]-[역할]-[세부기능].js
예시:
├── massage-detail-data.js             # 마사지 상세 데이터
├── massage-detail-ui.js               # 마사지 상세 UI
├── karaoke-detail-main.js             # 가라오케 상세 메인
└── ecogirl-gallery.js                 # 에코걸 갤러리
```

### **HTML 파일**
```
메인: index.html
전체보기: [모듈]/index.html
상세페이지: [모듈]/detail.html
독립 섹션: sections/[모듈]-section.html
```

### **CSS 파일**
```
전역: assets/css/global.css
모듈별: [모듈]/css/detail.css
컴포넌트별: assets/css/[기능].css
```

## 🔍 **중요 파일 찾기 가이드**

### **새 개발자가 먼저 봐야 할 파일들**
```
1순위: docs/01-프로젝트개요-project-overview/01_QUICK_START.md
2순위: docs/01-프로젝트개요-project-overview/03_FORBIDDEN_ZONES.md
3순위: massage/ 폴더 전체 (표준 템플릿)
4순위: proxy_server.py (실행 방법)
```

### **기능별 핵심 파일**
```
3D 갤러리: components/ecogirl-gallery.js
노션 연동: assets/js/notion-api-proxy.js + proxy_server.py
전체보기: ecogirl/gallery.html (완성품)
상세페이지: ecogirl/detail_new.html (완성품)
표준 템플릿: massage/ 폴더 전체
```

### **문제 해결 시 참고 파일**
```
에러 해결: docs/05-구현가이드-implementation-guides/
기술 구조: docs/03-기술아키텍처-technical-architecture/
모듈 가이드: docs/04-모듈별문서-module-specific/
```

## ⚠️ **파일 수정 시 주의사항**

### **절대 수정 금지 파일들**
```
❌ ecogirl/ 폴더 전체
❌ components/ecogirl-gallery.js
❌ assets/js/notion-api-proxy.js
❌ proxy_server.py
❌ index.html의 에코걸 관련 부분
```

### **신중하게 수정해야 할 파일들**
```
⚠️ assets/css/ 폴더 (전역 스타일)
⚠️ data/ 폴더 (백업 데이터)
⚠️ components/ 폴더 (공유 컴포넌트)
```

### **자유롭게 수정 가능한 영역**
```
✅ massage/ 폴더 (표준 템플릿)
✅ sections/ 폴더 (독립 섹션)
✅ 새로 생성하는 모듈 폴더들
✅ docs/ 폴더 (문서화)
```

## 🚀 **효율적인 파일 탐색 팁**

### **VS Code 에서 빠른 탐색**
```
Ctrl+P: 파일명으로 빠른 검색
Ctrl+Shift+F: 전체 텍스트 검색
Explorer: 중요 폴더 북마크
Extensions: 추천 확장 프로그램
```

### **자주 사용하는 경로**
```
개발 시작: E:\ecogirl\proxy_server.py 실행
메인 확인: http://localhost:8080/index.html
에코걸: http://localhost:8080/ecogirl/gallery.html
마사지: http://localhost:8080/massage/index.html
```

---

**🎯 핵심 포인트**: 에코걸은 완성품(보호), 마사지는 템플릿(복사용)

**📁 중요 구조**: 모듈별 독립성 + 표준 템플릿 활용

**🔍 빠른 참조**: 01_QUICK_START.md → 03_FORBIDDEN_ZONES.md → massage/

**📅 마지막 업데이트**: 2025년 6월 1일
