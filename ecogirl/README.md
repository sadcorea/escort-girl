# 🌟 에코걸 폴더 구조 가이드

## 📁 현재 폴더 구조 (마사지 표준 템플릿 완전 적용)

```
ecogirl/
├── index.html                    # 📋 전체보기 갤러리 (gallery.html → 통일)
├── detail.html                   # 📄 상세 페이지 (detail_new.html → 통일)  
├── css/                          # 🎨 스타일시트 폴더 (예정)
├── js/
│   ├── ecogirl-gallery.js        # 🎮 갤러리 스크립트 (gallery-new.js → 통일)
│   └── ecogirl-detail.js         # 💻 상세 스크립트 (detail_new.js → 통일)
├── backup/                       # 🗄️ 모든 백업 파일들
│   ├── gallery.html              # 원본 gallery.html 백업
│   ├── detail_new.html           # 원본 detail_new.html 백업
│   ├── gallery-new.js            # 원본 gallery-new.js 백업
│   ├── detail_new.js             # 원본 detail_new.js 백업
│   ├── gallery-백업.js           # 기존 백업
│   ├── detail_backup.js          # 기존 백업
│   └── detail_new_backup_20250531.html
└── README.md                     # 📖 이 가이드 문서
```

## 🎯 파일명 통일화 완료

### **변경 사항**
- `gallery.html` → `index.html` (마사지 폴더처럼)
- `detail_new.html` → `detail.html` (통일된 이름)
- `gallery-new.js` → `ecogirl-gallery.js` (명확한 네이밍)
- `detail_new.js` → `ecogirl-detail.js` (명확한 네이밍)

### **경로 업데이트**
- 모든 스크립트 import 경로가 새 파일명으로 변경됨
- `viewProfile()` 함수에서 `detail.html`로 이동 경로 수정
- `goToGallery()` 함수에서 `index.html`로 이동 경로 수정

## ✅ 완성된 시스템

### **노션 연동 시스템**
- **index.html**: 에코걸 전체보기 갤러리 + 노션 실시간 연동
- **detail.html**: 개별 에코걸 상세 페이지 + 노션 데이터 표시
- **ecogirl-gallery.js**: 갤러리 렌더링 + 필터링 + 페이지네이션
- **ecogirl-detail.js**: 상세 정보 표시 + 이미지 갤러리 + 모달

### **주요 기능**
- 🔄 **노션 실시간 연동**: 노션 편집 → 웹사이트 자동 반영
- 🎨 **3D 갤러리**: Three.js 기반 인터랙티브 갤러리
- 📱 **모바일 최적화**: 완벽한 터치 이벤트 지원
- 🔍 **필터링 시스템**: 나이대, 언어, 성향별 필터
- 📄 **페이지네이션**: 24개씩 페이지 분할
- 🖼️ **이미지 모달**: 갤러리 이미지 확대 보기

## 🛡️ 백업 시스템

### **안전장치**
- 모든 원본 파일이 `backup/` 폴더에 보존됨
- 문제 발생 시 즉시 복원 가능
- 에코걸 완성된 기능 100% 보호

### **복원 방법**
```bash
# 문제 발생 시 원본 복원
backup/gallery.html → index.html
backup/detail_new.html → detail.html
backup/gallery-new.js → js/ecogirl-gallery.js
backup/detail_new.js → js/ecogirl-detail.js
```

## 🔗 메인 인덱스 연동 시스템

### **섹션 모듈화 구조**
에코걸은 메인 인덱스(`/index.html`)에서 **섹션 방식**으로 임베드됩니다:

```
메인 인덱스 (/index.html)
    ↓ (섹션 임베드)
sections/ecogirl-section.html
    ↓ (3D 갤러리 렌더링)
components/ecogirl-gallery.js
    ↓ (클릭 시 이동)
ecogirl/detail.html?id=X
```

### **실제 동작 흐름**
1. **메인 페이지 로드**: `/index.html`
2. **에코걸 섹션 임베드**: `sections/ecogirl-section.html`이 자동 로드
3. **3D 갤러리 초기화**: `components/ecogirl-gallery.js`가 Three.js로 3D 갤러리 생성
4. **프로필 클릭**: 3D 갤러리에서 프로필 클릭 시 `ecogirl/detail.html?id=X`로 이동
5. **전체보기 접근**: 상단 메뉴 "에코걸" 클릭 시 `ecogirl/index.html`로 이동

### **핵심 경로들**
```javascript
// 메인 인덱스 → 에코걸 전체보기
"ecogirl/index.html"

// 3D 갤러리 → 에코걸 상세
"ecogirl/detail.html?id=1"

// 상세페이지 → 전체보기
"index.html" 

// 상세페이지 → 메인 홈
"../index.html"
```

### **메인 홈페이지에서**
```javascript
// 에코걸 전체보기 이동
window.location.href = 'ecogirl/index.html';

// 에코걸 상세 이동 (3D 갤러리 클릭)
window.location.href = 'ecogirl/detail.html?id=1';
```

### **에코걸 폴더 내에서**
```javascript
// 전체보기 → 상세
window.location.href = 'detail.html?id=1';

// 상세 → 전체보기
window.location.href = 'index.html';

// 에코걸 → 메인 홈
window.location.href = '../index.html';
```

## 🚀 사용법

### **개발자**
```bash
# 프록시 서버 실행
cd E:\ecogirl
python proxy_server.py

# 접속 URL
http://localhost:8080/ecogirl/index.html    # 전체보기
http://localhost:8080/ecogirl/detail.html?id=1  # 상세페이지
```

### **관리자 (노션)**
1. 노션 "🌟 에코걸 프로필 관리" 데이터베이스 접속
2. 프로필 추가/수정/삭제
3. 웹사이트 자동 반영 확인

## ⚠️ 주의사항

### **절대 금지**
- `backup/` 폴더 내 파일 삭제 금지
- 에코걸 시스템 완성품이므로 신중한 수정 필요
- 노션 API 키 및 DB ID 변경 금지

### **안전한 수정 방법**
1. 수정 전 추가 백업 생성
2. 단계별 테스트 진행
3. 문제 발생 시 즉시 백업에서 복원

---

**📅 구조화 완료일**: 2025년 6월 1일  
**🎯 목표**: 마사지 표준 템플릿과 동일한 깔끔한 구조 달성  
**✅ 상태**: 구조화 완료, 모든 기능 정상 작동  
**🛡️ 백업**: 완전한 백업 시스템으로 안전성 확보  
**⭐ 표준**: 마사지 폴더가 모든 업체군의 표준 템플릿으로 확정