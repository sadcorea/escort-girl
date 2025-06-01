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
├── 02-비즈니스전략-business-strategy/   # 💼 비즈니스 전략 ✅ 정리완료
│   ├── 01_BUSINESS_OVERVIEW.md       # 📊 비즈니스 개요 및 현황
│   ├── 02_REVENUE_MODEL.md           # 💰 수익 모델 및 광고 시스템
│   ├── 03_MARKETING_STRATEGY.md      # 🎯 마케팅 전략 및 확장 계획
│   ├── 04_RISK_MANAGEMENT_STRATEGY.md # 🛡️ 리스크 관리 전략
│   └── backup/                       # 원본 백업 보관
├── 03-기술아키텍처-technical-architecture/ # 🏗️ 기술 아키텍처 ✅ 정리완료
│   ├── 01_SYSTEM_ARCHITECTURE.md    # 🏗️ 시스템 전체 아키텍처
│   ├── 02_NOTION_INTEGRATION.md     # 🔗 노션 연동 시스템
│   ├── 03_MODULARIZATION.md         # 🧩 모듈화 시스템 설계
│   ├── 04_MAIN_INDEX_MODULARIZATION.md # 📄 메인 페이지 모듈화
│   └── backup/                       # 원본 백업 보관
├── 04-모듈별문서-module-specific/       # 🧩 모듈별 전용 문서 ✅ 정리완료
│   ├── 01_ECOGIRL_MODULE.md          # 👩 에코걸 모듈 완성 현황
│   ├── 02_MASSAGE_MODULE.md          # 💆 마사지 모듈 완성 현황
│   ├── 03_FUTURE_MODULES.md          # 🚀 향후 모듈 계획
│   └── backup/                       # 원본 백업 보관
├── 05-구현가이드-implementation-guides/ # 🔧 구현 가이드 ✅ 정리완료
│   ├── notion-integration-troubleshooting.md   # 노션 연동 문제 해결
│   ├── address-fields-implementation.md        # 주소 필드 구현 가이드
│   ├── implementation-guides-overview.md       # 구현가이드 개요
│   └── backup/                                 # 원본 백업 보관
├── 06-아카이브-archives/               # 🗄️ 아카이브 ✅ 정리완료
│   ├── roadmaps/                     # 📈 로드맵 백업들
│   │   └── 2025/
│   │       └── ROADMAP-백업-20250531.md
│   ├── business/                     # 💼 비즈니스 문서 백업 (향후)
│   ├── technical/                    # 🏗️ 기술 문서 백업 (향후)
│   ├── guides/                       # 📖 가이드 문서 백업 (향후)
│   ├── README.md                     # 📋 아카이브 인덱스 및 사용법
│   └── backup/                       # 구 백업 시스템 보존
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

### **💼 02-비즈니스전략-business-strategy (비즈니스 전략) ✅ 정리완료**
**목적**: 사업적 관점에서의 전략과 수익 모델
- **01_BUSINESS_OVERVIEW.md**: 📊 비즈니스 개요, 핵심 철학, 현재 상태
- **02_REVENUE_MODEL.md**: 💰 수익 구조, 광고 시스템, 수익화 전략
- **03_MARKETING_STRATEGY.md**: 🎯 마케팅 전략, 타겟 고객, 확장 계획
- **04_RISK_MANAGEMENT_STRATEGY.md**: 🛡️ 리스크 관리, 안전장치, 대응 방안

**특징**: 중복 제거 완료, 수익 모델과 시장 전략 분리
**대상**: 사업 기획자, 마케팅 담당자, 투자 관련자

### **🏗️ 03-기술아키텍처-technical-architecture (기술 아키텍처) ✅ 정리완료**
**목적**: 시스템의 전체적인 기술 구조와 설계
- **01_SYSTEM_ARCHITECTURE.md**: 🏗️ 전체 시스템 아키텍처 및 기술 스택
- **02_NOTION_INTEGRATION.md**: 🔗 노션 연동 시스템 완성 리포트
- **03_MODULARIZATION.md**: 🧩 모듈화 시스템 설계 및 구현
- **04_MAIN_INDEX_MODULARIZATION.md**: 📄 메인 페이지 HTML 임베드 방식

**특징**: 모듈화 중심 설계, 노션 연동 혁신 시스템
**대상**: 시니어 개발자, 아키텍트, 기술 리더

### **🧩 04-모듈별문서-module-specific (모듈별 전용 문서) ✅ 정리완료**
**목적**: 각 모듈(에코걸, 마사지 등)의 전용 문서들
- **01_ECOGIRL_MODULE.md**: 👩 에코걸 모듈 100% 완성 현황
- **02_MASSAGE_MODULE.md**: 💆 마사지 모듈 완성 현황 (표준 템플릿)
- **03_FUTURE_MODULES.md**: 🚀 향후 모듈 개발 계획 (가라오케, 풀빌라)

**특징**: 모듈별 독립성, 표준 템플릿 시스템
**대상**: 해당 모듈 담당 개발자

### **🔧 05-구현가이드-implementation-guides (구현 가이드) ✅ 정리완료**
**목적**: 실제 구현 시 참고할 상세 가이드들
- **notion-integration-troubleshooting.md**: 노션 연동 문제 해결 과정
- **address-fields-implementation.md**: 주소 필드 구현 + 데이터 가이드  
- **implementation-guides-overview.md**: 구현가이드 개요 및 사용법

**특징**: 중복 제거 완료, 관련 내용별 통합 정리
**대상**: 실무 개발자, 구현 담당자

### **🗄️ 06-아카이브-archives (아카이브) ✅ 정리완료**
**목적**: 과거 버전이나 백업된 문서들을 체계적으로 보관
- **roadmaps/2025/**: 📈 2025년 로드맵 백업들
  - `ROADMAP-백업-20250531.md`: 노션 연동 혁신 시스템 완성 시점 기록
- **business/**: 💼 비즈니스 문서 백업 (향후 확장)
- **technical/**: 🏗️ 기술 문서 백업 (향후 확장)
- **guides/**: 📖 가이드 문서 백업 (향후 확장)
- **README.md**: 📋 아카이브 인덱스, 검색 가이드, 백업 절차

**특징**: 문서 타입별 + 연도별 체계적 분류, 확장 가능한 구조
**대상**: 히스토리 추적, 버전 비교, 프로젝트 발전 과정 파악 필요 시

## 🔍 문서 찾기 가이드

### **새로운 사람이 프로젝트를 이해하려면:**
```
1. 01-프로젝트개요-project-overview/01_QUICK_START.md        # 3분 요약
2. 01-프로젝트개요-project-overview/02_PROJECT_STATUS.md     # 상세 현황
3. 01-프로젝트개요-project-overview/03_FORBIDDEN_ZONES.md    # 중요 주의사항
```

### **비즈니스 모델을 알고 싶다면:**
```
1. 02-비즈니스전략-business-strategy/01_BUSINESS_OVERVIEW.md     # 비즈니스 개요
2. 02-비즈니스전략-business-strategy/02_REVENUE_MODEL.md        # 수익 모델
3. 02-비즈니스전략-business-strategy/03_MARKETING_STRATEGY.md   # 마케팅 전략
```

### **기술적 구조를 파악하려면:**
```
1. 03-기술아키텍처-technical-architecture/01_SYSTEM_ARCHITECTURE.md    # 시스템 아키텍처
2. 03-기술아키텍처-technical-architecture/02_NOTION_INTEGRATION.md     # 노션 연동
3. 03-기술아키텍처-technical-architecture/03_MODULARIZATION.md         # 모듈화 시스템
```

### **특정 모듈을 개발하려면:**
```
1. 04-모듈별문서-module-specific/[모듈명]_MODULE.md           # 해당 모듈 현황
2. 05-구현가이드-implementation-guides/[관련가이드].md       # 구현 가이드
```

### **문제 해결이 필요하다면:**
```
1. 05-구현가이드-implementation-guides/notion-integration-troubleshooting.md  # 노션 문제
2. 05-구현가이드-implementation-guides/address-fields-implementation.md      # 주소 필드
3. 01-프로젝트개요-project-overview/03_FORBIDDEN_ZONES.md                   # 금지 구역 확인
```

### **과거 정보를 찾으려면:**
```
1. 06-아카이브-archives/README.md                            # 아카이브 인덱스
2. 06-아카이브-archives/[문서타입]/[연도]/                    # 백업 문서들
```

## 📝 문서 작성 규칙

### **새 문서 추가 시:**
1. **적절한 카테고리 선택**: 위 6개 카테고리 중 가장 적합한 곳
2. **명명 규칙**: `[주제]_[세부내용].md` 형식
3. **최신성 유지**: 업데이트 시 날짜 기록

### **파일명 컨벤션:**
- **프로젝트 전체**: `PROJECT_*.md`
- **모듈별**: `[모듈명]_MODULE.md` (예: `MASSAGE_MODULE.md`, `ECOGIRL_MODULE.md`)
- **기술별**: `[기술명]_*.md` (예: `NOTION_*.md`)
- **백업**: `*-백업-YYYYMMDD.md`
- **순번 체계**: `01_`, `02_`, `03_` (폴더 내 정렬)

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
3. `03-기술아키텍처-technical-architecture/03_MODULARIZATION.md` 업데이트

### **버전 관리:**
- 중요한 변경 시 기존 문서를 `06-아카이브-archives/`로 백업
- 백업 파일명에 날짜 포함 (`*-백업-YYYYMMDD.md`)

## 🚀 고급 활용 가이드

### **📊 프로젝트 전체 현황 파악하기:**
```
1. 01/02_PROJECT_STATUS.md          # 현재 완성도 90% 확인
2. 02/02_REVENUE_MODEL.md           # 수익 모델 확인
3. 04/01_ECOGIRL_MODULE.md          # 핵심 모듈 상태
4. 04/02_MASSAGE_MODULE.md          # 표준 템플릿 상태
```

### **🔧 개발 작업 시작하기:**
```
1. 01/03_FORBIDDEN_ZONES.md         # 금지 구역 반드시 확인
2. 01/04_DEVELOPMENT_WORKFLOW.md    # 개발 워크플로우
3. 03/02_NOTION_INTEGRATION.md      # 노션 연동 시스템
4. 05/implementation-guides-overview.md # 구현 가이드 개요
```

### **🐛 문제 해결하기:**
```
1. 05/notion-integration-troubleshooting.md  # 노션 문제 우선 확인
2. 01/03_FORBIDDEN_ZONES.md                  # 에코걸 보호 영역 확인
3. 05/address-fields-implementation.md       # 주소 필드 관련 문제
4. 06/아카이브 폴더                          # 과거 버전과 비교 분석
```

### **📈 비즈니스 의사결정 지원:**
```
1. 02/01_BUSINESS_OVERVIEW.md               # 현재 사업 현황
2. 02/02_REVENUE_MODEL.md                   # 수익성 분석
3. 02/04_RISK_MANAGEMENT_STRATEGY.md        # 리스크 평가
4. 04/03_FUTURE_MODULES.md                  # 확장 계획
```

### **🏗️ 시스템 아키텍처 이해:**
```
1. 03/01_SYSTEM_ARCHITECTURE.md             # 전체 구조 파악
2. 03/03_MODULARIZATION.md                  # 모듈화 시스템
3. 03/04_MAIN_INDEX_MODULARIZATION.md       # HTML 임베드 방식
4. 01/05_FILE_STRUCTURE.md                  # 실제 파일 구조
```

## 💡 문서 간 연관관계 맵

### **핵심 문서 의존성:**
```
01_QUICK_START.md (시작점)
    ↓
02_PROJECT_STATUS.md (현황 파악)
    ↓
03_FORBIDDEN_ZONES.md (주의사항)
    ↓
04_DEVELOPMENT_WORKFLOW.md (실행 방법)
```

### **기술 문서 플로우:**
```
SYSTEM_ARCHITECTURE.md (전체 구조)
    ↓
NOTION_INTEGRATION.md (핵심 기술)
    ↓
MODULARIZATION.md (설계 철학)
    ↓
각 모듈별 구현 가이드
```

### **비즈니스 문서 플로우:**
```
BUSINESS_OVERVIEW.md (현황)
    ↓
REVENUE_MODEL.md (수익 구조)
    ↓
MARKETING_STRATEGY.md (확장 전략)
    ↓
RISK_MANAGEMENT_STRATEGY.md (리스크 관리)
```

## 🎯 특수 상황별 가이드

### **새로운 개발자 온보딩:**
```
Day 1: 01 폴더 전체 읽기 (프로젝트 이해)
Day 2: 03 폴더 기술 문서 (시스템 파악)
Day 3: 04 폴더 모듈별 문서 (구체적 기능)
Day 4: 05 폴더 구현 가이드 (실제 작업)
Day 5: 실습 + 02 폴더 비즈니스 이해
```

### **긴급 버그 수정:**
```
1. 01/03_FORBIDDEN_ZONES.md 확인 (건드리면 안 되는 영역)
2. 05/troubleshooting 가이드 확인
3. 06/아카이브에서 이전 버전 비교
4. 문제 해결 후 해당 가이드 업데이트
```

### **새 모듈 개발:**
```
1. 04/03_FUTURE_MODULES.md에서 계획 확인
2. 04/02_MASSAGE_MODULE.md 표준 템플릿 참고
3. 03/03_MODULARIZATION.md 설계 원칙 준수
4. 개발 완료 후 04 폴더에 새 문서 추가
```

### **투자 미팅 준비:**
```
1. 02/01_BUSINESS_OVERVIEW.md (사업 개요)
2. 02/02_REVENUE_MODEL.md (수익성)
3. 01/02_PROJECT_STATUS.md (기술 완성도)
4. 02/03_MARKETING_STRATEGY.md (성장 전략)
```

## 🎉 구조화 진행 현황

### **✅ 완료된 폴더 (모든 폴더 정리 완료!):**
- **01-프로젝트개요-project-overview**: 5개 파일 정리 완료, 중복 제거
- **02-비즈니스전략-business-strategy**: 4개 파일 정리 완료, 수익 모델 분리
- **03-기술아키텍처-technical-architecture**: 4개 파일 정리 완료, 노션 연동 중심
- **04-모듈별문서-module-specific**: 3개 파일 정리 완료, 모듈별 독립성 확보
- **05-구현가이드-implementation-guides**: 3개 파일 정리 완료, 관련 내용 통합
- **06-아카이브-archives**: 새로운 구조 구축 완료, 체계적 백업 시스템

### **🎯 정리 완료 성과:**
- **총 23개 문서** 체계적 정리 완료
- **중복 내용 제거** 및 관련 내용 통합
- **문서 타입별 분류** 및 명확한 역할 구분
- **검색 효율성** 극대화 (목적별 빠른 접근)
- **확장 가능한 구조** 구축 (향후 문서 추가 용이)

### **📊 docs 폴더 통계:**
- **카테고리**: 6개 (프로젝트개요, 비즈니스, 기술, 모듈, 구현, 아카이브)
- **정리된 문서**: 23개
- **백업 보존**: 모든 원본 backup 폴더에 안전 보관
- **상호 참조**: 연관 문서간 링크 연결

### **🎯 다음 담당자를 위한 팁:**
1. **문서 읽기 순서**: 01 → 02 → 03 → 04 → 05 순으로 읽으면 전체 이해
2. **새 기능 개발**: 04(모듈 계획) → 05(구현 가이드) → 03(아키텍처 업데이트)
3. **문서 찾기**: 위의 "문서 찾기 가이드" 활용
4. **백업 생성**: 중요 변경 시 06 폴더의 백업 절차 준수
5. **정리 주기**: 분기별 문서 정리 및 아카이브 검토

### **🔄 유지보수 체크리스트:**
- [ ] **월간**: 각 문서 최신성 확인 및 링크 점검
- [ ] **분기별**: 중복 내용 점검 및 아카이브 대상 선별
- [ ] **신규 모듈 시**: 04→05→03 순서로 문서 작성
- [ ] **중요 변경 시**: 06 폴더에 백업 후 원본 업데이트

---

**📅 마지막 업데이트**: 2025년 6월 1일  
**🎯 목적**: 문서 관리 효율성 극대화 및 협업 향상  
**✅ 완료**: 01~06 모든 폴더 정리 완료 (총 23개 문서 체계화)  
**🎉 성과**: EchoPal 문서 시스템 완전 구조화 달성