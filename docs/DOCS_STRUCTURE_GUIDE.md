# 📚 docs 폴더 구조화 가이드

## 📊 개요
EchoPal 프로젝트의 모든 문서를 주제별로 체계화하여 관리 효율성을 극대화합니다.

## 📁 새로운 docs 폴더 구조

```
docs/
├── 01-프로젝트개요-project-overview/    # 📋 프로젝트 전체 개요 ✅ 정리완료
│   ├── 01_QUICK_START.md             # 🚀 빠른 시작 가이드 (3분 요약)
│   ├── 02_PROJECT_STATUS.md          # 📊 프로젝트 현재 상태 (완성도 90%)
│   ├── 03_FORBIDDEN_ZONES.md         # 🛡️ 절대 금지 구역 (보호 영역)
│   ├── 04_DEVELOPMENT_WORKFLOW.md    # 🔄 개발 워크플로우 (작업 절차)
│   ├── 05_FILE_STRUCTURE.md          # 📁 파일 구조 가이드
│   └── backup/                       # 원본 백업 보관
├── 02-비즈니스전략-business-strategy/   # 💼 비즈니스 전략 🚧 정리예정
│   ├── backup/                       # 원본 백업
│   │   ├── BUSINESS.md
│   │   └── STRATEGY.md
│   └── [정리된 문서들 생성 예정]
├── 03-기술아키텍처-technical-architecture/ # 🏗️ 기술 아키텍처 🚧 정리예정
├── 04-모듈별문서-module-specific/       # 🧩 모듈별 전용 문서 🚧 정리예정
├── 05-구현가이드-implementation-guides/ # 🔧 구현 가이드 ✅ 정리완료
│   ├── notion-integration-troubleshooting.md   # 노션 연동 문제 해결
│   ├── address-fields-implementation.md        # 주소 필드 구현 가이드
│   ├── implementation-guides-overview.md       # 구현가이드 개요
│   └── backup/                                 # 원본 백업 보관
├── 06-아카이브-archives/               # 🗄️ 아카이브 🚧 정리예정
└── DOCS_STRUCTURE_GUIDE.md            # 📖 이 가이드 문서
```

## 🎯 카테고리별 설명

### **📋 01-프로젝트개요-project-overview (프로젝트 전체 개요) ✅ 정리완료**
**목적**: 프로젝트 전체를 이해하는데 필요한 핵심 문서들
- **01_QUICK_START.md**: 🚀 3분 요약 - 가장 먼저 읽을 파일
- **02_PROJECT_STATUS.md**: 📊 상세 현황 - 완성도 90%, 기술 스택
- **03_FORBIDDEN_ZONES.md**: 🛡️ 절대 금지 구역 - 에코걸/마사지 보호
- **04_DEVELOPMENT_WORKFLOW.md**: 🔄 개발 워크플로우 - 실행법, 작업 절차
- **05_FILE_STRUCTURE.md**: 📁 파일 구조 - 전체 프로젝트 구조

**특징**: 중복 제거 완료, 각 파일별 고유 역할 명확화
**대상**: 새로운 개발자, 관리자, 프로젝트 파악이 필요한 모든 사람

### **💼 02-비즈니스전략-business-strategy (비즈니스 전략)**
**목적**: 사업적 관점에서의 전략과 수익 모델
- **BUSINESS.md**: 수익 구조, 광고 모델, 비즈니스 계획
- **STRATEGY.md**: 시장 진입 전략, 경쟁 우위, 확장 계획

**대상**: 사업 기획자, 마케팅 담당자, 투자 관련자

### **🏗️ 03-기술아키텍처-technical-architecture (기술 아키텍처)**
**목적**: 시스템의 전체적인 기술 구조와 설계
- **MODULARIZATION_GUIDE.md**: 전체 모듈화 시스템 설명
- **MAIN_INDEX_MODULARIZATION.md**: 메인 페이지 모듈화 방식
- **NOTION_API_INTEGRATION_COMPLETE.md**: 노션 연동 시스템

**대상**: 시니어 개발자, 아키텍트, 기술 리더

### **🧩 04-모듈별문서-module-specific (모듈별 전용 문서)**
**목적**: 각 모듈(에코걸, 마사지 등)의 전용 문서들
- **MASSAGE_DATABASE_PLAN.md**: 마사지 모듈 DB 설계
- **MASSAGE_SECTION_STATUS.md**: 마사지 모듈 현재 상태

**대상**: 해당 모듈 담당 개발자

### **🔧 05-구현가이드-implementation-guides (구현 가이드) ✅ 정리완료**
**목적**: 실제 구현 시 참고할 상세 가이드들
- **notion-integration-troubleshooting.md**: 노션 연동 문제 해결 과정
- **address-fields-implementation.md**: 주소 필드 구현 + 데이터 가이드  
- **implementation-guides-overview.md**: 구현가이드 개요 및 사용법

**특징**: 중복 제거 완료, 관련 내용별 통합 정리
**대상**: 실무 개발자, 구현 담당자

### **🗄️ 06-아카이브-archives (아카이브)**
**목적**: 과거 버전이나 백업된 문서들
- **ROADMAP-백업-20250531.md**: 이전 로드맵 백업

**대상**: 히스토리 추적, 버전 비교 필요 시

## 🔍 문서 찾기 가이드

### **새로운 사람이 프로젝트를 이해하려면:**
```
1. 01-프로젝트개요-project-overview/01_QUICK_START.md        # 3분 요약
2. 01-프로젝트개요-project-overview/02_PROJECT_STATUS.md     # 상세 현황
3. 01-프로젝트개요-project-overview/03_FORBIDDEN_ZONES.md    # 중요 주의사항
```

### **비즈니스 모델을 알고 싶다면:**
```
1. 02-비즈니스전략-business-strategy/ 폴더 전체 참조 (정리 예정)
```

## 📋 02 폴더 정리 가이드 (다음 작업)

### **02-비즈니스전략-business-strategy 정리 계획:**

**현재 상태**: backup 폴더에 BUSINESS.md, STRATEGY.md 존재
**정리 방향**: 
- **비즈니스 모델**: 수익 구조, 광고 시스템, 커미션 모델
- **시장 전략**: 3단계 확장 전략, 차별화 요소, 리스크 관리
- **중복 제거**: 수익 관련 중복 내용 통합

**예상 결과 파일들**:
- `business-model-revenue.md` - 수익 모델 및 광고 시스템
- `market-strategy-expansion.md` - 시장 전략 및 확장 계획  
- `business-strategy-overview.md` - 비즈니스 전략 개요

### **정리 방법 (01 폴더와 동일 패턴)**:
1. backup 폴더 내용 분석
2. 관련 내용별 묶기
3. 중복 내용 가장 적합한 파일에 통합
4. 상호 참조 링크 추가
5. backup 폴더 원본 보존

### **특정 모듈을 개발하려면:**
```
1. 04-모듈별문서-module-specific/[모듈명]_*.md        # 해당 모듈 계획
2. 05-구현가이드-implementation-guides/[모듈명]_*.md  # 구현 가이드
```

### **기술적 구조를 파악하려면:**
```
1. 03-기술아키텍처-technical-architecture/              # 전체 폴더 읽기
```

## 📝 문서 작성 규칙

### **새 문서 추가 시:**
1. **적절한 카테고리 선택**: 위 6개 카테고리 중 가장 적합한 곳
2. **명명 규칙**: `[주제]_[세부내용].md` 형식
3. **최신성 유지**: 업데이트 시 날짜 기록

### **파일명 컨벤션:**
- **프로젝트 전체**: `PROJECT_*.md`
- **모듈별**: `[모듈명]_*.md` (예: `MASSAGE_*.md`, `ECOGIRL_*.md`)
- **기술별**: `[기술명]_*.md` (예: `NOTION_*.md`)
- **백업**: `*-백업-YYYYMMDD.md`

### **문서 헤더 템플릿:**
```markdown
# 📋 문서 제목

## 📅 최종 업데이트: YYYY년 MM월 DD일

## 🎯 목적
이 문서의 목적과 대상 독자

## 📊 요약
핵심 내용 요약 (3-5줄)

## 상세 내용...
```

## 🔄 유지보수 가이드

### **정기 점검 (월 1회):**
- [ ] 각 문서의 최신성 확인
- [ ] 중복 내용 정리
- [ ] 아카이브 필요 문서 이동

### **새 모듈 추가 시:**
1. `04-모듈별문서-module-specific/`에 해당 모듈 문서 추가
2. `05-구현가이드-implementation-guides/`에 구현 가이드 추가
3. `03-기술아키텍처-technical-architecture/MODULARIZATION_GUIDE.md` 업데이트

### **버전 관리:**
- 중요한 변경 시 기존 문서를 `06-아카이브-archives/`로 백업
- 백업 파일명에 날짜 포함 (`*-백업-YYYYMMDD.md`)

## 🎉 구조화 진행 현황

### **✅ 완료된 폴더:**
- **01-프로젝트개요-project-overview**: 5개 파일 정리 완료, 중복 제거
- **05-구현가이드-implementation-guides**: 3개 파일 정리 완료, 관련 내용 통합

### **🚧 정리 예정 폴더:**
- **02-비즈니스전략-business-strategy**: 비즈니스 모델 + 시장 전략
- **03-기술아키텍처-technical-architecture**: 기술 구조 + 모듈화 시스템
- **04-모듈별문서-module-specific**: 각 모듈별 전용 문서
- **06-아카이브-archives**: 과거 문서 백업

### **🎯 다음 작업: 02 폴더 정리**
**목표**: 비즈니스 전략 문서들을 수익 모델, 시장 전략으로 체계화
**방법**: 01, 05 폴더와 동일한 패턴 적용 (관련 내용 묶기 + 중복 제거)

### **🎯 다음 담당자를 위한 팁:**
1. **문서 읽기 순서**: 01 → 03 → 04 → 05 순으로 읽으면 전체 이해
2. **새 기능 개발**: 04와 05 폴더에 해당 문서 작성
3. **문서 찾기**: 카테고리별로 목적에 맞게 탐색
4. **정리 주기**: 월 1회 정도 문서 정리 권장

---

**📅 마지막 업데이트**: 2025년 6월 1일  
**🎯 목적**: 문서 관리 효율성 극대화 및 협업 향상  
**✅ 완료**: 01, 05 폴더 정리 완료 (중복 제거, 관련 내용 통합)  
**🔄 다음**: 02 폴더 정리 → 03, 04, 06 폴더 순차 정리