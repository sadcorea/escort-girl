# 🌟 DNRed Website - 3D 갤러리

## 📖 프로젝트 소개
DNRed 웹사이트의 3D 이미지 갤러리 시스템입니다. Three.js를 사용하여 구현된 인터랙티브한 3D 갤러리를 제공합니다.

## ✨ 주요 기능

### 🖼️ 3D 이미지 갤러리
- **Three.js 기반** 3D 렌더링
- **자동 회전** 갤러리 시스템
- **마우스 인터랙션** 지원
- **반응형 디자인** (모바일/데스크톱)

### 🔧 자동 확장자 감지 시스템
- 지원 포맷: `jpg`, `jpeg`, `png`, `webp`, `bmp`, `gif`
- 자동 이미지 파일 감지
- 게시판 연동 준비 완료

### 📱 반응형 웹 디자인
- 모바일 최적화
- 터치 제스처 지원
- 다양한 화면 크기 대응

## 🛠️ 기술 스택
- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **3D Graphics**: Three.js r128
- **Styling**: 현대적 CSS (Flexbox, Grid)
- **Icons**: 이모지 아이콘 시스템

## 📁 프로젝트 구조
```
dnred_website/
├── index.html              # 메인 HTML 파일
├── style.css              # 스타일시트
├── 3d-gallery.js          # 3D 갤러리 로직
├── images/
│   └── profiles/          # 프로필 이미지들
│       ├── 250524-15-10_00002_.png
│       ├── 250524-15-38_00003_.png
│       └── ...
└── README.md              # 프로젝트 문서
```

## 🚀 실행 방법

### GitHub Pages로 배포
1. GitHub Repository 생성
2. 전체 파일 업로드
3. Settings → Pages → Source: "main branch" 선택
4. `https://사용자명.github.io/저장소명/` 접속

### 로컬 개발 서버
```bash
# Python 3
python -m http.server 8000

# Node.js (http-server 사용)
npx http-server

# PHP
php -S localhost:8000
```

## 🎯 향후 개발 계획

### Phase 1: 기본 기능 완성 ✅
- [x] 3D 갤러리 구현
- [x] 자동 확장자 감지
- [x] 반응형 디자인
- [x] GitHub Pages 배포

### Phase 2: 게시판 연동 🔄
- [ ] 백엔드 API 연동
- [ ] 동적 이미지 로딩
- [ ] 사용자 업로드 기능
- [ ] 이미지 필터링/검색

### Phase 3: 고급 기능 📋
- [ ] 이미지 확대/축소
- [ ] 슬라이드쇼 모드
- [ ] 소셜 공유 기능
- [ ] 댓글 시스템

## 💡 핵심 코드 설명

### 자동 확장자 감지
```javascript
// 🖼️ 자동 확장자 감지 시스템
const supportedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif'];

function getImageUrl(baseName, folder = 'images/profiles/') {
    return `${folder}${baseName}.png`;
}
```

### 게시판 연동 준비
```javascript
// 게시판 데이터 연동 준비용 함수
function getImageUrls() {
    // 나중에 API 호출로 변경 예정
    const imageNames = ['250524-15-10_00002_', ...];
    return imageNames.map(name => getImageUrl(name));
}
```

## 🔧 문제 해결

### CORS 에러 해결
- **문제**: 로컬 파일 접근 시 CORS 정책 차단
- **해결**: GitHub Pages 또는 로컬 HTTP 서버 사용

### 이미지 로딩 실패
- **원인**: 파일 경로 오류 또는 파일 부재
- **해결**: 자동 확장자 감지 시스템으로 해결

## 📝 업데이트 로그

### v1.0.0 (2025-05-27)
- 🎉 초기 버전 출시
- ✨ 3D 갤러리 기본 기능 구현
- 🖼️ 자동 확장자 감지 시스템 추가
- 📱 반응형 디자인 적용
- 🚀 GitHub Pages 배포 준비 완료

## 📄 라이선스
이 프로젝트는 개인 사용 목적으로 개발되었습니다.

## 👨‍💻 개발자
- **개발**: InS_C
- **3D Graphics**: Three.js
- **배포**: GitHub Pages

---
⭐ **Star를 눌러주시면 개발에 큰 도움이 됩니다!** ⭐
