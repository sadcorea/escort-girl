/**
 * 🎯 Ecogirl.vn 헤더 JavaScript
 * 검색창, 언어 선택, 모바일 메뉴 기능
 */

// DOM 로드 상태에 관계없이 실행되는 함수
function initializeHeader() {
    // 📱 모바일 메뉴 토글
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuToggle && mobileMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.toggle('active');
            
            // 햄버거 아이콘 애니메이션
            this.classList.toggle('active');
        });
    }
    
    // 🔍 검색창 포커스 시 인기 검색어 하이라이트
    const searchInput = document.querySelector('.search-input');
    if (searchInput) {
        searchInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        searchInput.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    }
    
    // 🌐 언어 변경
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.addEventListener('click', function(e) {
            // 실제로는 페이지 리로드되지만, 시각적 피드백 제공
            languageOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // 📍 스크롤 시 헤더 스타일 변경
    let lastScroll = 0;
    
    window.addEventListener('scroll', function() {
        const header = document.getElementById('main-header');
        
        if (!header) return;
        
        const currentScroll = window.pageYOffset;
        
        // 스크롤 시 헤더 크기 축소 및 그림자 진하게
        if (currentScroll > 50) {
            header.classList.add('scrolled');
            header.classList.add('compact');
            document.body.classList.add('header-compact');
            
            // 테스트용 인라인 스타일 적용
            const headerContent = header.querySelector('.header-content');
            const logoImage = header.querySelector('.logo-image');
            if (headerContent) {
                headerContent.style.padding = '0.5rem 0';
                headerContent.style.minHeight = '50px';
            }
            if (logoImage) {
                logoImage.style.height = '35px';
            }
        } else {
            header.classList.remove('scrolled');
            header.classList.remove('compact');
            document.body.classList.remove('header-compact');
            
            // 인라인 스타일 제거
            const headerContent = header.querySelector('.header-content');
            const logoImage = header.querySelector('.logo-image');
            if (headerContent) {
                headerContent.style.padding = '';
                headerContent.style.minHeight = '';
            }
            if (logoImage) {
                logoImage.style.height = '';
            }
        }
        
        lastScroll = currentScroll;
    });
    
    // 초기 스크롤 위치 확인
    window.dispatchEvent(new Event('scroll'));
    
    // 🔍 검색 자동완성 (나중에 구현)
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            const query = this.querySelector('input[name="q"]').value.trim();
            
            if (!query) {
                e.preventDefault();
                alert('검색어를 입력해주세요!');
            }
        });
    }
    
    // 📱 모바일에서 검색창 클릭 시 키보드 최적화
    const mobileSearchInput = document.querySelector('.mobile-search input');
    if (mobileSearchInput) {
        mobileSearchInput.addEventListener('focus', function() {
            // 모바일에서 검색창 포커스 시 헤더 고정
            document.body.style.paddingTop = '70px';
            header.style.position = 'fixed';
        });
    }
    
    // 🎯 카테고리 네비게이션 링크 처리
    const categoryLinks = document.querySelectorAll('.nav-link');
    categoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const currentPath = window.location.pathname;
            
            // 현재 경로에 따른 적절한 이동
            let targetUrl = '/';
            
            switch(href) {
                case '#ecogirl':
                    // modules/ecogirl 폴더에 있으면 같은 폴더로
                    if (currentPath.includes('/modules/ecogirl/')) {
                        targetUrl = '/modules/ecogirl/ecogirl-section.html';
                    } else if (currentPath.includes('/modules/')) {
                        // 다른 모듈에서 에코걸로
                        targetUrl = '/modules/ecogirl/ecogirl-section.html';
                    } else {
                        targetUrl = '/modules/ecogirl/ecogirl-section.html';
                    }
                    break;
                case '#massage':
                    if (currentPath.includes('/modules/massage/')) {
                        targetUrl = '/modules/massage/massage-section.html';
                    } else if (currentPath.includes('/modules/')) {
                        targetUrl = '/modules/massage/massage-section.html';
                    } else {
                        targetUrl = '/modules/massage/massage-section.html';
                    }
                    break;
                case '#villa':
                    targetUrl = '/modules/villa/villa-section.html';
                    break;
                case '#karaoke':
                    targetUrl = '/modules/karaoke/karaoke-section.html';
                    break;
            }
            
            window.location.href = targetUrl;
        });
    });
    
    // 모바일 메뉴 네비게이션도 처리
    const mobileCategoryLinks = document.querySelectorAll('.mobile-nav a');
    mobileCategoryLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const currentPath = window.location.pathname;
            
            // 같은 로직 적용
            let targetUrl = '/';
            
            switch(href) {
                case '#ecogirl':
                    targetUrl = '/modules/ecogirl/ecogirl-section.html';
                    break;
                case '#massage':
                    targetUrl = '/modules/massage/massage-section.html';
                    break;
                case '#villa':
                    targetUrl = '/modules/villa/villa-section.html';
                    break;
                case '#karaoke':
                    targetUrl = '/modules/karaoke/karaoke-section.html';
                    break;
            }
            
            window.location.href = targetUrl;
        });
    });
    
    // 🎯 현재 페이지 네비게이션 하이라이트
    const currentPath = window.location.pathname;
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });
}

// DOM이 이미 로드되었는지 확인
if (document.readyState === 'loading') {
    // DOM이 아직 로딩 중이면 DOMContentLoaded 기다리기
    document.addEventListener('DOMContentLoaded', initializeHeader);
} else {
    // DOM이 이미 로드되었으면 바로 실행
    initializeHeader();
}

// 🔍 검색창 외부 클릭 시 닫기
document.addEventListener('click', function(e) {
    const searchWrapper = document.querySelector('.search-wrapper');
    const languageSelector = document.querySelector('.language-selector');
    
    // 검색창 외부 클릭
    if (searchWrapper && !searchWrapper.contains(e.target)) {
        const dropdown = searchWrapper.querySelector('.search-dropdown');
        if (dropdown) {
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
        }
    }
    
    // 언어 선택 외부 클릭
    if (languageSelector && !languageSelector.contains(e.target)) {
        const dropdown = languageSelector.querySelector('.language-dropdown');
        if (dropdown) {
            dropdown.style.opacity = '0';
            dropdown.style.visibility = 'hidden';
        }
    }
});

// 간단한 초기화 확인
console.log('헤더 스크립트 로드됨');
