/**
 * 🎯 Ecogirl.vn 전체 설정 파일
 * 여기서 한 번만 바꾸면 전체 사이트에 적용됩니다!
 */

const CONFIG = {
    // 🌐 사이트 기본 정보
    SITE: {
        name: 'Ecogirl.vn',
        domain: 'ecogirl.vn',
        title: '오아시스 다낭 - 다낭 여행 가이드 플랫폼',
        description: '다낭 최고의 서비스를 한 곳에서',
        version: '1.0.2',
        slogan: '오아시스 다낭'
    },

    // 🎨 색상 (CSS 변수로도 사용됨)
    COLORS: {
        primary: '#0EA5E9',      // 다낭 바다색
        secondary: '#64748B',    // 따뜻한 회색
        
        // 배경색
        bgWhite: '#FFFFFF',
        bgLight: '#F8FAFC',      // 연한 회색 (섹션 구분)
        
        // 텍스트색
        textDark: '#334155',     // 진한 회색 (제목)
        textMedium: '#64748B',   // 중간 회색 (본문)
        textLight: '#94A3B8',    // 연한 회색 (캡션)
        
        // 상태색
        success: '#10B981',      // 초록 (성공)
        warning: '#F59E0B',      // 노랑 (경고)
        error: '#EF4444',        // 빨강 (에러)
        
        // 경계선
        border: '#E2E8F0'
    },

    // 📏 크기 단위
    SIZES: {
        // 컨테이너
        maxWidth: '1200px',
        
        // 간격 (8px 기준)
        spacing: {
            xs: '8px',
            sm: '16px',
            md: '24px',
            lg: '32px',
            xl: '48px',
            xxl: '64px',
            huge: '96px'
        },
        
        // 모서리 둥글기
        borderRadius: {
            sm: '4px',
            md: '8px',
            lg: '12px',
            full: '9999px'
        },
        
        // 반응형 분기점
        breakpoints: {
            mobile: '480px',
            tablet: '768px',
            desktop: '1024px'
        }
    },

    // 🖋️ 폰트
    FONTS: {
        main: '-apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Malgun Gothic", sans-serif',
        
        // 폰트 크기
        sizes: {
            h1: '2.5rem',      // 40px
            h2: '2rem',        // 32px
            h3: '1.5rem',      // 24px
            h4: '1.25rem',     // 20px
            body: '1rem',      // 16px
            small: '0.875rem'  // 14px
        },
        
        // 폰트 굵기
        weights: {
            regular: 400,
            medium: 500,
            semibold: 600,
            bold: 700
        }
    },

    // 🔗 API 설정
    API: {
        // 노션 관련
        notion: {
            proxy: 'http://localhost:8080/api/notion',
            
            // DB ID들 (슬래시 없는 버전)
            databases: {
                ecogirl: '202e5f74c72e81c4bb17000c32bc92df',
                massage: '203e5f74c72e81a98e15000cb3d92994',
                poolvilla: '208e5f74c72e805f9f29da2780d34974'
            }
        }
    },

    // 📱 연락 수단
    CONTACTS: {
        kakao: {
            id: 'Ecogirl.vn',  // 회사 카카오톡
            buttonText: '카카오톡 문의'
        },
        telegram: {
            id: 'Ecogirl.vn',  // 회사 텔레그램
            buttonText: '텔레그램 문의'
        },
        phone: {
            number: '010-1234-1234',  // 회사 전화번호
            buttonText: '전화 문의'
        }
    },

    // 💱 통화 설정
    CURRENCY: {
        default: 'VND',
        options: ['VND', 'KRW', 'USD'],
        
        // 임시 환율 (나중에 API로 실시간 변경)
        rates: {
            VND_to_KRW: 0.054,
            VND_to_USD: 0.000041
        }
    },

    // 🌍 언어 설정
    LANGUAGES: {
        default: 'ko',
        available: ['ko', 'en', 'vn']
    },

    // ⚡ 성능 설정
    PERFORMANCE: {
        lazyLoadOffset: 50,      // 레이지 로딩 오프셋
        imageQuality: 80,        // 이미지 품질 (%)
        cacheTime: 300000,       // 캐시 시간 (5분)
        loadingTimeout: 2000     // 로딩 타임아웃 (2초)
    },

    // 🎯 기능 토글 (쉽게 켜고 끄기)
    FEATURES: {
        rightClickProtection: true,   // 우클릭 방지
        imageProtection: true,        // 이미지 보호
        favoriteSystem: true,         // 찜하기 기능
        shareButtons: true,           // 공유 버튼
        currencyToggle: true,         // 통화 전환
        languageToggle: true,         // 언어 전환
        searchFilter: true,           // 검색/필터
        compareFeature: true,         // 업체 비교
        popupNotice: true            // 팝업 공지
    }
};

// 전역으로 사용 가능하게
window.CONFIG = CONFIG;

// 개발 환경에서 콘솔에 출력
if (window.location.hostname === 'localhost') {
    console.log('🎯 CONFIG 로드됨:', CONFIG);
}
