// 에코걸 전체보기 갤러리 JavaScript

class EcogirlGallery {
    constructor() {
        this.profiles = [];
        this.filteredProfiles = [];
        this.currentFilters = {
            age: 'all',
            language: 'all',
            personality: 'all'
        };
        this.currentSort = 'popular';
        this.notionAPI = null;
        this.init();
    }

    async init() {
        // 노션 API 초기화
        if (typeof NotionAPI !== 'undefined') {
            this.notionAPI = new NotionAPI();
        } else if (typeof NotionAPIProxy !== 'undefined') {
            this.notionAPI = new NotionAPIProxy();
        }

        // 프로필 데이터 로드
        await this.loadProfiles();
        
        // 이벤트 리스너 초기화
        this.initEventListeners();
        
        // 초기 렌더링
        this.renderProfiles();
        
        console.log('✅ 에코걸 갤러리 초기화 완료');
    }

    async loadProfiles() {
        this.showLoading(true);
        
        try {
            if (this.notionAPI) {
                // 노션에서 데이터 가져오기
                let profiles = [];
                if (typeof this.notionAPI.getAllProfiles === 'function') {
                    profiles = await this.notionAPI.getAllProfiles();
                } else if (typeof this.notionAPI.getProfiles === 'function') {
                    profiles = await this.notionAPI.getProfiles();
                }
                
                if (profiles && profiles.length > 0) {
                    this.profiles = profiles;
                    console.log('✅ 노션에서 프로필 로드 완료:', profiles.length, '개');
                } else {
                    this.profiles = this.getBackupData();
                    console.log('⚠️ 노션 데이터 없음, 백업 데이터 사용');
                }
            } else {
                this.profiles = this.getBackupData();
                console.log('⚠️ 노션 API 없음, 백업 데이터 사용');
            }
            
            this.filteredProfiles = [...this.profiles];
            
        } catch (error) {
            console.error('❌ 프로필 로드 실패:', error);
            this.profiles = this.getBackupData();
            this.filteredProfiles = [...this.profiles];
        }
        
        this.showLoading(false);
    }

    getBackupData() {
        // 페이지네이션 테스트를 위해 30개의 프로필 생성
        const baseProfiles = [
            {
                id: 1,
                name: '아름',
                age: 27,
                mainImage: 'https://via.placeholder.com/300x400/ff6b9d/white?text=아름',
                languages: ['한국어', '영어', '베트남어'],
                hobbies: ['골프', '영화감상'],
                personality: ['차분함'],
                skills: ['바베큐', '요리'],
                introduction: '안녕하세요! 다낭을 잘 아는 아름입니다.'
            },
            {
                id: 2,
                name: '소희',
                age: 25,
                mainImage: 'https://via.placeholder.com/300x400/ff9f43/white?text=소희',
                languages: ['한국어', '베트남어'],
                hobbies: ['마사지', '요가'],
                personality: ['따뜻함', '차분함'],
                skills: ['마사지', '요가'],
                introduction: '안녕하세요! 소희입니다.'
            },
            {
                id: 3,
                name: '유리',
                age: 23,
                mainImage: 'https://via.placeholder.com/300x400/54a0ff/white?text=유리',
                languages: ['한국어', '영어'],
                hobbies: ['음악감상', '노래'],
                personality: ['발랄함', '활발함'],
                skills: ['기타연주', '노래'],
                introduction: '안녕하세요! 유리입니다.'
            },
            {
                id: 4,
                name: '하나',
                age: 26,
                mainImage: 'https://via.placeholder.com/300x400/5f27cd/white?text=하나',
                languages: ['한국어', '일본어'],
                hobbies: ['요리', '쇼핑'],
                personality: ['지적임', '따뜻함'],
                skills: ['요리', '요가'],
                introduction: '안녕하세요! 하나입니다.'
            },
            {
                id: 5,
                name: '민지',
                age: 24,
                mainImage: 'https://via.placeholder.com/300x400/00d2d3/white?text=민지',
                languages: ['한국어', '영어', '중국어'],
                hobbies: ['사진촬영', '여행'],
                personality: ['발랄함', '유머러스'],
                skills: ['사진촬영', '댄스'],
                introduction: '안녕하세요! 민지입니다.'
            }
        ];

        // 페이지네이션 테스트를 위해 데이터를 30개로 확장
        const profiles = [];
        for (let i = 0; i < 30; i++) {
            const baseProfile = baseProfiles[i % 5];
            const colors = ['ff6b9d', 'ff9f43', '54a0ff', '5f27cd', '00d2d3', 'ff3838', '2ed573', 'ffa502', '70a1ff', 'a4b0be'];
            profiles.push({
                ...baseProfile,
                id: i + 1,
                name: `${baseProfile.name}${i + 1}`,
                age: 20 + (i % 15), // 20-34세 사이
                mainImage: `https://via.placeholder.com/300x400/${colors[i % 10]}/white?text=${baseProfile.name}${i + 1}`,
                personality: i % 3 === 0 ? ['차분함'] : i % 3 === 1 ? ['발랄함'] : ['따뜻함']
            });
        }

        return profiles;
    }

    initEventListeners() {
        // 필터 버튼 이벤트
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filterType = e.target.dataset.filter;
                const filterValue = e.target.dataset.value;
                
                // 같은 타입의 다른 버튼들 비활성화
                document.querySelectorAll(`[data-filter="${filterType}"]`).forEach(b => {
                    b.classList.remove('active');
                });
                
                // 클릭한 버튼 활성화
                e.target.classList.add('active');
                
                // 필터 업데이트
                this.currentFilters[filterType] = filterValue;
                this.applyFilters();
            });
        });

        // 정렬 선택 이벤트
        document.getElementById('sortSelect').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.applySort();
        });
    }

    applyFilters() {
        this.filteredProfiles = this.profiles.filter(profile => {
            // 나이 필터
            if (this.currentFilters.age !== 'all') {
                const age = profile.age || profile.나이;
                const ageRange = this.currentFilters.age;
                
                if (ageRange === '20-24' && (age < 20 || age > 24)) return false;
                if (ageRange === '25-29' && (age < 25 || age > 29)) return false;
                if (ageRange === '30+' && age < 30) return false;
            }
            
            // 언어 필터
            if (this.currentFilters.language !== 'all') {
                const languages = profile.languages || profile.언어 || [];
                const targetLang = this.currentFilters.language;
                
                let hasLanguage = false;
                if (targetLang === 'korean') hasLanguage = languages.includes('한국어');
                if (targetLang === 'english') hasLanguage = languages.includes('영어');
                if (targetLang === 'japanese') hasLanguage = languages.includes('일본어');
                
                if (!hasLanguage) return false;
            }
            
            // 성향 필터
            if (this.currentFilters.personality !== 'all') {
                const personality = profile.personality || profile.성향 || [];
                const targetPersonality = this.currentFilters.personality;
                
                let hasPersonality = false;
                if (targetPersonality === 'calm') hasPersonality = personality.some(p => p.includes('차분함'));
                if (targetPersonality === 'cheerful') hasPersonality = personality.some(p => p.includes('발랄함') || p.includes('활발함'));
                if (targetPersonality === 'warm') hasPersonality = personality.some(p => p.includes('따뜻함'));
                if (targetPersonality === 'intellectual') hasPersonality = personality.some(p => p.includes('지적임'));
                if (targetPersonality === 'humorous') hasPersonality = personality.some(p => p.includes('유머러스'));
                
                if (!hasPersonality) return false;
            }
            
            return true;
        });
        
        this.applySort();
    }

    applySort() {
        this.filteredProfiles.sort((a, b) => {
            switch (this.currentSort) {
                case 'newest':
                    return (b.id || 0) - (a.id || 0);
                case 'name':
                    return (a.name || a.이름 || '').localeCompare(b.name || b.이름 || '');
                case 'age':
                    return (a.age || a.나이 || 0) - (b.age || b.나이 || 0);
                case 'popular':
                default:
                    return (a.id || 0) - (b.id || 0);
            }
        });
        
        this.renderProfiles();
    }

    renderProfiles() {
        const container = document.getElementById('profilesGrid');
        const resultStats = document.getElementById('resultStats');
        const pagination = document.getElementById('pagination');
        
        if (!container) {
            console.error('❌ profilesGrid 컨테이너를 찾을 수 없습니다');
            return;
        }
        
        // 페이지네이션 설정
        const itemsPerPage = 24;
        this.currentPage = this.currentPage || 1;
        const totalPages = Math.ceil(this.filteredProfiles.length / itemsPerPage);
        
        // 현재 페이지 프로필들 계산
        const startIndex = (this.currentPage - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        const currentProfiles = this.filteredProfiles.slice(startIndex, endIndex);
        
        // 결과 통계 업데이트
        if (resultStats) {
            const totalCount = this.filteredProfiles.length;
            const currentStart = startIndex + 1;
            const currentEnd = Math.min(endIndex, totalCount);
            
            resultStats.innerHTML = `
                <span class="result-count">${totalCount}명 중 ${currentStart}-${currentEnd}명 표시</span>
                <span class="page-info">페이지 ${this.currentPage} / ${totalPages}</span>
            `;
        }
        
        // 프로필 그리드 렌더링
        if (currentProfiles.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <i class="fas fa-search"></i>
                    <h3>검색 결과가 없습니다</h3>
                    <p>다른 조건으로 검색해보세요</p>
                </div>
            `;
        } else {
            container.innerHTML = currentProfiles.map(profile => this.createProfileCard(profile)).join('');
        }
        
        // 페이지네이션 렌더링
        if (pagination && totalPages > 1) {
            pagination.innerHTML = this.createPaginationHTML(totalPages);
            this.initPaginationEvents();
        } else if (pagination) {
            pagination.innerHTML = '';
        }
    }

    createProfileCard(profile) {
        const name = profile.name || profile.이름 || 'Unknown';
        const age = profile.age || profile.나이 || 0;
        const id = profile.id || 0;
        const mainImage = profile.mainImage || profile.프로필사진 || 'https://via.placeholder.com/300x400/ff6b9d/white?text=Profile';
        const languages = profile.languages || profile.언어 || [];
        const personality = profile.personality || profile.성향 || [];
        const skills = profile.skills || profile.특기 || [];
        
        return `
            <div class="profile-card" data-id="${id}">
                <div class="profile-image">
                    <img src="${mainImage}" alt="${name}" onerror="this.src='https://via.placeholder.com/300x400/ff6b9d/white?text=Profile'">
                    <div class="profile-overlay">
                        <div class="profile-actions">
                            <button class="btn-view" onclick="viewProfile(${id})">
                                <i class="fas fa-eye"></i> 자세히 보기
                            </button>
                        </div>
                    </div>
                </div>
                <div class="profile-info">
                    <h3 class="profile-name">${name}</h3>
                    <p class="profile-age">${age}세</p>
                    
                    <div class="profile-tags">
                        ${languages.slice(0, 2).map(lang => 
                            `<span class="tag tag-language">${lang}</span>`
                        ).join('')}
                        ${personality.slice(0, 1).map(p => 
                            `<span class="tag tag-personality">${p}</span>`
                        ).join('')}
                        ${skills.slice(0, 1).map(skill => 
                            `<span class="tag tag-skill">${skill}</span>`
                        ).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    createPaginationHTML(totalPages) {
        const currentPage = this.currentPage;
        let paginationHTML = '';
        
        // 이전 버튼
        if (currentPage > 1) {
            paginationHTML += `
                <button class="pagination-btn pagination-prev" data-page="${currentPage - 1}">
                    <i class="fas fa-chevron-left"></i> 이전
                </button>
            `;
        }
        
        // 페이지 번호들
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);
        
        // 첫 페이지가 범위에 없으면 추가
        if (startPage > 1) {
            paginationHTML += `<button class="pagination-btn" data-page="1">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-dots">...</span>`;
            }
        }
        
        // 페이지 번호 버튼들
        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === currentPage ? 'active' : '';
            paginationHTML += `
                <button class="pagination-btn ${isActive}" data-page="${i}">${i}</button>
            `;
        }
        
        // 마지막 페이지가 범위에 없으면 추가
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-dots">...</span>`;
            }
            paginationHTML += `<button class="pagination-btn" data-page="${totalPages}">${totalPages}</button>`;
        }
        
        // 다음 버튼
        if (currentPage < totalPages) {
            paginationHTML += `
                <button class="pagination-btn pagination-next" data-page="${currentPage + 1}">
                    다음 <i class="fas fa-chevron-right"></i>
                </button>
            `;
        }
        
        return paginationHTML;
    }

    initPaginationEvents() {
        document.querySelectorAll('.pagination-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.target.dataset.page);
                if (page && page !== this.currentPage) {
                    this.currentPage = page;
                    this.renderProfiles();
                    
                    // 스크롤을 맨 위로
                    document.querySelector('.gallery-container').scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    showLoading(show) {
        const container = document.getElementById('profilesGrid');
        if (!container) return;
        
        if (show) {
            container.innerHTML = `
                <div class="loading-spinner">
                    <div class="spinner"></div>
                    <p>프로필을 불러오는 중...</p>
                </div>
            `;
        }
    }

    // 검색 기능 (향후 확장용)
    search(query) {
        this.filteredProfiles = this.profiles.filter(profile => {
            const name = profile.name || profile.이름 || '';
            const intro = profile.introduction || profile.자기소개 || '';
            
            return name.toLowerCase().includes(query.toLowerCase()) ||
                   intro.toLowerCase().includes(query.toLowerCase());
        });
        
        this.currentPage = 1;
        this.renderProfiles();
    }

    // 필터 초기화
    resetFilters() {
        this.currentFilters = {
            age: 'all',
            language: 'all',
            personality: 'all'
        };
        
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        document.querySelectorAll('.filter-btn[data-value="all"]').forEach(btn => {
            btn.classList.add('active');
        });
        
        this.currentPage = 1;
        this.applyFilters();
    }
}

// 프로필 상세보기 함수 (전역)
function viewProfile(id) {
    window.location.href = `detail.html?id=${id}`;
}

// 전역 변수로 갤러리 인스턴스 생성
let ecogirlGallery;

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    ecogirlGallery = new EcogirlGallery();
});

// 브라우저 전역에서 접근 가능하도록
window.EcogirlGallery = EcogirlGallery;
window.viewProfile = viewProfile;ntainer = document.getElementById('profilesGrid');
        container.innerHTML = '';
        
        if (this.filteredProfiles.length === 0) {
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #718096;">
                    <h3>조건에 맞는 에코걸이 없습니다</h3>
                    <p>다른 필터를 선택해보세요</p>
                </div>
            `;
            return;
        }
        
        this.filteredProfiles.forEach((profile, index) => {
            const card = this.createProfileCard(profile, index);
            container.appendChild(card);
        });
    }

    createProfileCard(profile, index) {
        const card = document.createElement('div');
        card.className = 'profile-card';
        card.style.animationDelay = `${index * 0.1}s`;
        
        // 이미지 소스 결정
        const mainImage = 
            profile.mainImage || 
            profile.프로필사진 || 
            profile.메인이미지 || 
            profile.profileImage ||
            (profile.galleryImages && profile.galleryImages[0]) ||
            (profile.갤러리사진 && profile.갤러리사진[0]) ||
            '../assets/images/profiles/default.png';
        
        // 특기 태그 준비
        const skills = profile.skills || profile.특기 || [];
        const skillTags = skills.slice(0, 2).map(skill => 
            `<span class="profile-tag">${skill}</span>`
        ).join('');
        
        // 언어 정보
        const languages = profile.languages || profile.언어 || [];
        const languageText = languages.slice(0, 3).join(' • ');
        
        card.innerHTML = `
            <div class="profile-image-container">
                <img class="profile-image-bg" src="${mainImage}" alt="배경">
                <img class="profile-image-main" src="${mainImage}" alt="${profile.name || profile.이름}">
                <div class="profile-overlay">
                    <div class="profile-tags">${skillTags}</div>
                    <div class="profile-languages">${languageText}</div>
                </div>
            </div>
            <div class="profile-info">
                <span class="profile-name">${profile.name || profile.이름}</span>
                <span class="profile-age">${profile.age || profile.나이}세</span>
            </div>
        `;
        
        // 클릭 이벤트
        card.addEventListener('click', () => {
            window.location.href = `detail_new.html?id=${profile.id}`;
        });
        
        return card;
    }

    showLoading(show) {
        const loader = document.getElementById('loadingIndicator');
        if (show) {
            loader.classList.add('show');
        } else {
            loader.classList.remove('show');
        }
    }
}

// 상단 메뉴바 버튼 기능들
function goToHome() {
    window.location.href = '../index.html';
}

function handleKakaoContact() {
    const kakaoUrl = 'https://open.kakao.com/o/s123456';
    window.open(kakaoUrl, '_blank');
}

function handlePhoneContact() {
    window.location.href = 'tel:+84-905-123-456';
}

// 스크롤 효과 초기화
function initScrollEffects() {
    const topMenuBar = document.querySelector('.top-menu-bar');
    
    if (topMenuBar) {
        console.log('✅ 갤러리 페이지 스크롤 효과 초기화 완료');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            if (scrollTop > 50) {
                topMenuBar.classList.add('scrolled');
            } else {
                topMenuBar.classList.remove('scrolled');
            }
        }, { passive: true });
    }
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new EcogirlGallery();
    
    setTimeout(() => {
        initScrollEffects();
    }, 100);
});