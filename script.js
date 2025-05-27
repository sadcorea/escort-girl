// 전역 변수
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let currentSection = 'karaoke';
let isScrolling = false;

// Stripe 스타일 인터랙션을 위한 추가 변수
let sections = [];
let sectionOffsets = [];
let isStripeModeActive = false;

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

// 앱 초기화
function initializeApp() {
    setupEventListeners();
    updateFavoritesList();
    createMobileMenuToggle();
    initializeStripeMode();
    setupScrollInteraction();
}

// 모바일 메뉴 토글 버튼 생성
function createMobileMenuToggle() {
    const toggleBtn = document.createElement('button');
    toggleBtn.className = 'menu-toggle';
    toggleBtn.innerHTML = '☰';
    toggleBtn.onclick = toggleSidebar;
    document.body.appendChild(toggleBtn);
}

// 사이드바 토글 (모바일)
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    sidebar.classList.toggle('open');
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 네비게이션 메뉴 클릭
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', function() {
            const category = this.dataset.category;
            
            // Stripe 모드가 활성화된 경우 부드러운 스크롤
            if (isStripeModeActive) {
                smoothScrollToSection(category);
            } else {
                switchSection(category);
            }
            
            // 모바일에서 사이드바 닫기
            if (window.innerWidth <= 768) {
                document.querySelector('.sidebar').classList.remove('open');
            }
        });
    });

    // 검색 기능
    const searchBar = document.getElementById('searchBar');
    if (searchBar) {
        searchBar.addEventListener('input', handleSearch);
    }

    // 예약 폼 제출
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', handleBookingSubmit);
    }

    // 모달 외부 클릭 시 닫기
    window.addEventListener('click', handleModalOutsideClick);

    // ESC 키로 모달 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeAllModals();
        }
    });

    // 윈도우 리사이즈 시 사이드바 상태 조정
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            document.querySelector('.sidebar').classList.remove('open');
        }
    });
}

// 섹션 전환
function switchSection(category) {
    // 기존 활성화된 섹션과 메뉴 아이템 비활성화
    document.querySelectorAll('.content-section').forEach(section => {
        section.classList.remove('active');
    });
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });

    // 새로운 섹션과 메뉴 아이템 활성화
    const targetSection = document.getElementById(category);
    const targetMenuItem = document.querySelector(`[data-category="${category}"]`);
    
    if (targetSection) {
        targetSection.classList.add('active');
        currentSection = category;
    }
    
    if (targetMenuItem) {
        targetMenuItem.classList.add('active');
    }
}

// 찜 목록 토글
function toggleFavorites() {
    const panel = document.getElementById('favoritesPanel');
    if (panel) {
        panel.classList.toggle('open');
    }
}

// 찜하기 기능
function addToFavorites(id, name) {
    if (!favorites.find(item => item.id === id)) {
        favorites.push({ id, name, category: currentSection });
        localStorage.setItem('favorites', JSON.stringify(favorites));
        updateFavoritesList();
        showNotification(`${name}이(가) 찜 목록에 추가되었습니다!`);
    } else {
        showNotification('이미 찜 목록에 있습니다.');
    }
}

// 찜 목록에서 제거
function removeFromFavorites(id) {
    favorites = favorites.filter(item => item.id !== id);
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateFavoritesList();
}

// 찜 목록 업데이트
function updateFavoritesList() {
    const favoritesList = document.getElementById('favoritesList');
    
    if (!favoritesList) return;

    if (favorites.length === 0) {
        favoritesList.innerHTML = '<p class="empty-message">찜한 항목이 없습니다.</p>';
    } else {
        favoritesList.innerHTML = favorites.map(item => `
            <div class="favorite-item">
                <span class="favorite-name">${item.name}</span>
                <button onclick="removeFromFavorites(${item.id})" class="remove-favorite">삭제</button>
            </div>
        `).join('');
    }
}

// 모달 관리
function openModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal(type) {
    const modal = document.getElementById(type + 'Modal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function closeAllModals() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
    document.body.style.overflow = 'auto';
    
    // 찜 목록 패널도 닫기
    const favoritesPanel = document.getElementById('favoritesPanel');
    if (favoritesPanel && favoritesPanel.classList.contains('open')) {
        favoritesPanel.classList.remove('open');
    }
}

// 검색 기능
function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const cards = document.querySelectorAll('.card');
    
    cards.forEach(card => {
        const title = card.querySelector('.card-title')?.textContent.toLowerCase() || '';
        const description = card.querySelector('.card-description')?.textContent.toLowerCase() || '';
        
        if (title.includes(searchTerm) || description.includes(searchTerm)) {
            card.style.display = 'block';
        } else {
            card.style.display = searchTerm === '' ? 'block' : 'none';
        }
    });
}

// 예약 폼 제출 처리
function handleBookingSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const data = {};
    for (let [key, value] of formData.entries()) {
        data[key] = value;
    }
    
    // 폼 유효성 검사
    if (validateBookingForm(data)) {
        showNotification('예약 문의가 접수되었습니다. 빠른 시일 내에 연락드리겠습니다!');
        e.target.reset();
        closeModal('booking');
        
        // 실제 환경에서는 서버로 데이터 전송
        console.log('예약 데이터:', data);
    }
}

// 예약 폼 유효성 검사
function validateBookingForm(data) {
    const requiredFields = ['name', 'phone', 'date'];
    
    for (let field of requiredFields) {
        if (!data[field] || data[field].trim() === '') {
            showNotification(`${getFieldName(field)}을(를) 입력해주세요.`);
            return false;
        }
    }
    
    // 전화번호 형식 검사
    const phoneRegex = /^[0-9-+\s]+$/;
    if (!phoneRegex.test(data.phone)) {
        showNotification('올바른 전화번호 형식을 입력해주세요.');
        return false;
    }
    
    return true;
}

// 필드명 한글 변환
function getFieldName(field) {
    const fieldNames = {
        name: '이름',
        phone: '연락처',
        date: '날짜',
        time: '시간',
        people: '인원수',
        karaoke: '가라오케'
    };
    return fieldNames[field] || field;
}

// 모달 외부 클릭 처리
function handleModalOutsideClick(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// 알림 표시
function showNotification(message) {
    // 기존 알림이 있다면 제거
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // 애니메이션으로 표시
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // 3초 후 자동 제거
    setTimeout(() => {
        notification.style.transform = 'translateX(400px)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 300);
    }, 3000);
}

// 페이지 로드 완료 시 추가 초기화
window.addEventListener('load', function() {
    console.log('DNRed.net 웹사이트가 로드되었습니다.');
    
    // 성능 최적화: 이미지 지연 로딩
    setupLazyLoading();
    
    // 접근성 개선
    setupAccessibility();
});

// 이미지 지연 로딩 설정
function setupLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('loading');
                imageObserver.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// 접근성 개선
function setupAccessibility() {
    // 키보드 네비게이션 지원
    document.querySelectorAll('.nav-item').forEach((item, index) => {
        item.setAttribute('tabindex', '0');
        item.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                item.click();
            }
        });
    });
    
    // 포커스 관리
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Tab') {
            document.body.classList.add('using-keyboard');
        }
    });
    
    document.addEventListener('mousedown', () => {
        document.body.classList.remove('using-keyboard');
    });
}

// 디바운스 함수 (검색 성능 향상)
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Stripe 스타일 모드 초기화
function initializeStripeMode() {
    // 섬션 요소들 수집
    sections = Array.from(document.querySelectorAll('.content-section'));
    
    // 스크롤 지점에서 Stripe 모드 활성화 감지
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.target.classList.contains('main-content') && entry.isIntersecting) {
                isStripeModeActive = true;
                document.body.classList.add('stripe-mode');
            }
        });
    }, { threshold: 0.1 });
    
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        observer.observe(mainContent);
    }
}

// 스크롤 인터랙션 설정
function setupScrollInteraction() {
    let ticking = false;
    
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                handleStripeScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
}

// Stripe 스타일 스크롤 처리
function handleStripeScroll() {
    if (!isStripeModeActive) return;
    
    const scrollTop = window.pageYOffset;
    const mainContentTop = document.querySelector('.main-content').offsetTop;
    const relativeScroll = scrollTop - mainContentTop;
    
    // 각 섹션의 활성화 지점 계산
    const sectionHeight = window.innerHeight * 0.8;
    const currentSectionIndex = Math.floor(relativeScroll / sectionHeight);
    
    // 유효한 인덱스 범위 제한
    const validIndex = Math.max(0, Math.min(sections.length - 1, currentSectionIndex));
    
    // 사이드바 메뉴 업데이트
    updateSidebarActive(validIndex);
    
    // 콘텐츠 전환 애니메이션
    animateContentTransition(validIndex, relativeScroll % sectionHeight / sectionHeight);
}

// 사이드바 활성 메뉴 업데이트
function updateSidebarActive(sectionIndex) {
    // 기존 활성 상태 제거
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // 새로운 활성 상태 설정
    const navItems = document.querySelectorAll('.nav-item');
    if (navItems[sectionIndex]) {
        navItems[sectionIndex].classList.add('active');
        
        // 현재 섹션 업데이트
        const sectionId = navItems[sectionIndex].dataset.category;
        if (sectionId !== currentSection) {
            currentSection = sectionId;
            updateMainContent(sectionId);
        }
    }
}

// 메인 콘텐츠 업데이트 (부드럽게)
function updateMainContent(sectionId) {
    // 모든 섹션 비활성화
    sections.forEach(section => {
        section.classList.remove('active');
        section.style.opacity = '0';
        section.style.transform = 'translateY(20px)';
    });
    
    // 선택된 섹션 활성화
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        setTimeout(() => {
            targetSection.classList.add('active');
            targetSection.style.opacity = '1';
            targetSection.style.transform = 'translateY(0)';
        }, 150);
    }
}

// 콘텐츠 전환 애니메이션
function animateContentTransition(sectionIndex, progress) {
    const targetSection = sections[sectionIndex];
    if (!targetSection) return;
    
    // 카드들에 스페이스드 애니메이션 적용
    const cards = targetSection.querySelectorAll('.card');
    cards.forEach((card, index) => {
        const delay = index * 0.1;
        const cardProgress = Math.max(0, Math.min(1, (progress * 2) - delay));
        
        card.style.opacity = cardProgress;
        card.style.transform = `translateY(${(1 - cardProgress) * 30}px)`;
    });
}

// 사이드바 메뉴 클릭 시 부드러운 스크롤
function smoothScrollToSection(sectionId) {
    const mainContent = document.querySelector('.main-content');
    const sectionIndex = Array.from(document.querySelectorAll('.nav-item'))
        .findIndex(item => item.dataset.category === sectionId);
    
    if (sectionIndex !== -1) {
        const targetY = mainContent.offsetTop + (sectionIndex * window.innerHeight * 0.8);
        
        window.scrollTo({
            top: targetY,
            behavior: 'smooth'
        });
    }
}