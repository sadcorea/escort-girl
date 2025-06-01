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
        this.currentPage = 1;
        this.itemsPerPage = 24;
        this.notionAPI = null;
        
        console.log('🎯 EcogirlGallery 생성자 실행');
        this.init();
    }

    async init() {
        console.log('🚀 EcogirlGallery 초기화 시작');
        
        try {
            // 노션 API 초기화 (클래스명 확인)
            console.log('🔍 사용 가능한 전역 클래스들:', Object.keys(window));
            
            if (typeof NotionAPI !== 'undefined') {
                console.log('✅ NotionAPI 클래스 발견');
                this.notionAPI = new NotionAPI();
            } else if (typeof NotionAPIProxy !== 'undefined') {
                console.log('✅ NotionAPIProxy 클래스 발견');
                this.notionAPI = new NotionAPIProxy();
            } else {
                console.warn('⚠️ 노션 API 클래스를 찾을 수 없음');
                console.log('🔍 window.NotionAPI:', typeof window.NotionAPI);
                console.log('🔍 window.NotionAPIProxy:', typeof window.NotionAPIProxy);
            }

            // 프로필 데이터 로드
            await this.loadProfiles();
            
            // 이벤트 리스너 초기화
            this.initEventListeners();
            
            // 초기 렌더링
            this.renderProfiles();
            
            console.log('✅ 에코걸 갤러리 초기화 완료');
        } catch (error) {
            console.error('❌ 갤러리 초기화 실패:', error);
        }
    }

    async loadProfiles() {
        this.showLoading(true);
        
        try {
            if (this.notionAPI) {
                console.log('🔍 노션에서 프로필 데이터 로드 중...');
                
                // 상세 페이지와 동일한 방식으로 API 호출
                let profiles = [];
                if (typeof this.notionAPI.getAllProfiles === 'function') {
                    profiles = await this.notionAPI.getAllProfiles();
                } else if (typeof this.notionAPI.getProfiles === 'function') {
                    profiles = await this.notionAPI.getProfiles();
                }
                
                console.log('📊 노션에서 받은 전체 프로필:', profiles);
                
                if (profiles && profiles.length > 0) {
                    console.log('🔍 첫 번째 프로필 샘플:', profiles[0]);
                    console.log('📋 첫 번째 프로필의 키들:', Object.keys(profiles[0]));
                    
                    // 노션 데이터를 그대로 사용 (변환하지 않음)
                    this.profiles = profiles;
                    this.filteredProfiles = [...this.profiles];
                    
                    console.log('✅ 노션 프로필 로드 완료:', this.profiles.length, '개');
                    this.showLoading(false);
                    return;
                } else {
                    console.warn('⚠️ 노션에서 프로필 데이터를 가져올 수 없음');
                }
            } else {
                console.warn('⚠️ 노션 API가 초기화되지 않음');
            }
            
        } catch (error) {
            console.error('❌ 노션 프로필 로드 실패:', error);
        }
        
        // 노션 실패 시 백업 데이터 사용
        console.log('🔄 백업 데이터 사용');
        this.profiles = this.getBackupDataWithNotionFormat();
        this.filteredProfiles = [...this.profiles];
        this.showLoading(false);
    }

    getBackupDataWithNotionFormat() {
        // 노션 데이터가 없을 때 사용할 기본 데이터 (노션 API 응답 형태 모방)
        return [
            {
                id: 1,
                name: '아름',
                age: 27,
                mainImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY2YjlkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7sl4TrpoQ8L3RleHQ+PC9zdmc+',
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
                mainImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmY5ZjQzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7shozrnaU8L3RleHQ+PC9zdmc+',
                languages: ['한국어', '베트남어'],
                hobbies: ['마사지', '요가'],
                personality: ['따뜻함'],
                skills: ['마사지', '요가'],
                introduction: '안녕하세요! 소희입니다.'
            },
            {
                id: 3,
                name: '유리',
                age: 23,
                mainImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNTRhMGZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7snKDrpqw8L3RleHQ+PC9zdmc+',
                languages: ['한국어', '영어'],
                hobbies: ['음악감상', '노래'],
                personality: ['발랄함'],
                skills: ['기타연주', '노래'],
                introduction: '안녕하세요! 유리입니다.'
            },
            {
                id: 4,
                name: '하나',
                age: 26,
                mainImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjNWYyN2NkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7rrZjrgpg8L3RleHQ+PC9zdmc+',
                languages: ['한국어', '일본어'],
                hobbies: ['요리', '쇼핑'],
                personality: ['지적임'],
                skills: ['요리', '요가'],
                introduction: '안녕하세요! 하나입니다.'
            },
            {
                id: 5,
                name: '민지',
                age: 24,
                mainImage: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMDBkMmQzIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj7rr7zsp4A8L3RleHQ+PC9zdmc+',
                languages: ['한국어', '영어', '중국어'],
                hobbies: ['사진촬영', '여행'],
                personality: ['유머러스'],
                skills: ['사진촬영', '댄스'],
                introduction: '안녕하세요! 민지입니다.'
            }
        ];
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
                this.currentPage = 1; // 필터 변경 시 첫 페이지로
                this.applyFilters();
            });
        });
    }

    applyFilters() {
        this.filteredProfiles = this.profiles.filter(profile => {
            // 나이 필터
            if (this.currentFilters.age !== 'all') {
                const age = profile.age || profile.나이 || 0;
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
                if (targetPersonality === 'calm') hasPersonality = personality.some(p => p && p.includes('차분함'));
                if (targetPersonality === 'active') hasPersonality = personality.some(p => p && (p.includes('발랄함') || p.includes('활발함')));
                if (targetPersonality === 'warm') hasPersonality = personality.some(p => p && p.includes('따뜻함'));
                if (targetPersonality === 'bright') hasPersonality = personality.some(p => p && p.includes('유머러스'));
                
                if (!hasPersonality) return false;
            }
            
            return true;
        });
        
        this.renderProfiles();
    }

    renderProfiles() {
        const container = document.getElementById('profilesGrid');
        
        if (!container) {
            console.error('❌ profilesGrid 컨테이너를 찾을 수 없습니다');
            return;
        }
        
        // 페이지네이션 계산
        const totalPages = Math.ceil(this.filteredProfiles.length / this.itemsPerPage);
        const startIndex = (this.currentPage - 1) * this.itemsPerPage;
        const endIndex = startIndex + this.itemsPerPage;
        const currentProfiles = this.filteredProfiles.slice(startIndex, endIndex);
        
        // 결과 통계 업데이트
        const currentPageInfo = document.getElementById('currentPageInfo');
        if (currentPageInfo) {
            currentPageInfo.textContent = `페이지 ${this.currentPage} / ${totalPages}`;
        }
        
        // 프로필 그리드 렌더링
        if (currentProfiles.length === 0) {
            container.innerHTML = `
                <div class="no-results">
                    <div style="text-align: center; padding: 2rem;">
                        <h3>검색 결과가 없습니다</h3>
                        <p>다른 조건으로 검색해보세요</p>
                    </div>
                </div>
            `;
        } else {
            container.innerHTML = currentProfiles.map(profile => this.createProfileCard(profile)).join('');
        }
        
        // 페이지네이션 렌더링
        this.renderPagination(totalPages);
    }

    createProfileCard(profile) {
        // 노션 데이터 구조에 맞게 키 접근
        console.log('🎨 프로필 카드 생성:', profile);
        
        const name = profile.name || '이름없음';
        const age = profile.age || 0;
        const id = profile.id || 0;
        
        // 노션 이미지 처리 (profile_image 또는 mainImage)
        let mainImage = null;
        if (profile.profile_image) {
            mainImage = profile.profile_image;
        } else if (profile.mainImage) {
            mainImage = profile.mainImage;
        } else {
            mainImage = this.createDefaultImage(name);
        }
        
        // 배열 데이터 처리
        const languages = Array.isArray(profile.languages) ? profile.languages : 
                         Array.isArray(profile.언어) ? profile.언어 : [];
        const personality = Array.isArray(profile.personality) ? profile.personality : 
                           Array.isArray(profile.성향) ? profile.성향 : [];
        const introduction = profile.introduction || profile.자기소개 || profile.소개글 || '안녕하세요!';
        
        return `
            <div class="profile-card">
                <div class="profile-image" onclick="viewProfile(${id})" style="cursor: pointer;">
                    <img src="${mainImage}" alt="${name}" onerror="this.src='${this.createDefaultImage(name)}'">
                    
                    <!-- 호버 시 나타나는 오버레이 -->
                    <div class="profile-overlay">
                        <div class="profile-hover-info">
                            <!-- 언어 -->
                            ${languages.length > 0 ? `
                                <div class="hover-languages">
                                    <h4>🗣️ 언어</h4>
                                    <div class="hover-language-tags">
                                        ${languages.slice(0, 3).map(lang => 
                                            `<span class="hover-tag language">${lang}</span>`
                                        ).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            <!-- 성향 -->
                            ${personality.length > 0 ? `
                                <div class="hover-personality">
                                    <h4>💫 성향</h4>
                                    <div class="hover-personality-tags">
                                        ${personality.slice(0, 3).map(p => 
                                            `<span class="hover-tag personality">${p}</span>`
                                        ).join('')}
                                    </div>
                                </div>
                            ` : ''}
                            
                            <!-- 소개 -->
                            <div class="hover-intro">
                                <h4>💭 소개</h4>
                                <p>${introduction}</p>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="profile-info">
                    <div class="profile-basic-info">
                        <span class="profile-id">#${String(id).padStart(3, '0')}</span>
                        <h3 class="profile-name">${name}</h3>
                        <span class="profile-age">${age}세</span>
                    </div>
                </div>
            </div>
        `;
    }

    createDefaultImage(name) {
        // 한글 이름을 안전하게 처리
        const colors = ['ff6b9d', 'ff9f43', '54a0ff', '5f27cd', '00d2d3'];
        const colorIndex = name.charCodeAt(0) % colors.length;
        const color = colors[colorIndex];
        
        const svg = `<svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#${color}"/>
            <text x="50%" y="50%" font-family="Arial" font-size="24" fill="white" text-anchor="middle" dy=".3em">${name}</text>
        </svg>`;
        
        return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
    }

    renderPagination(totalPages) {
        const paginationContainer = document.getElementById('paginationContainer');
        if (!paginationContainer || totalPages <= 1) {
            if (paginationContainer) paginationContainer.innerHTML = '';
            return;
        }

        const prevBtn = document.getElementById('prevPageBtn');
        const nextBtn = document.getElementById('nextPageBtn');
        const paginationPages = document.getElementById('paginationPages');

        // 이전/다음 버튼 상태 업데이트
        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= totalPages;
        }

        // 페이지 번호들 생성
        if (paginationPages) {
            paginationPages.innerHTML = this.createPaginationNumbers(totalPages);
        }

        // 이벤트 리스너 설정
        this.initPaginationEvents();
    }

    createPaginationNumbers(totalPages) {
        const currentPage = this.currentPage;
        let paginationHTML = '';
        
        // 페이지 번호들
        let startPage = Math.max(1, currentPage - 2);
        let endPage = Math.min(totalPages, currentPage + 2);
        
        // 첫 페이지
        if (startPage > 1) {
            paginationHTML += `<button class="pagination-number" data-page="1">1</button>`;
            if (startPage > 2) {
                paginationHTML += `<span class="pagination-dots">...</span>`;
            }
        }
        
        // 페이지 번호 버튼들
        for (let i = startPage; i <= endPage; i++) {
            const isActive = i === currentPage ? 'active' : '';
            paginationHTML += `
                <button class="pagination-number ${isActive}" data-page="${i}">${i}</button>
            `;
        }
        
        // 마지막 페이지
        if (endPage < totalPages) {
            if (endPage < totalPages - 1) {
                paginationHTML += `<span class="pagination-dots">...</span>`;
            }
            paginationHTML += `<button class="pagination-number" data-page="${totalPages}">${totalPages}</button>`;
        }
        
        return paginationHTML;
    }

    initPaginationEvents() {
        // 이전 버튼
        const prevBtn = document.getElementById('prevPageBtn');
        if (prevBtn) {
            prevBtn.onclick = () => {
                if (this.currentPage > 1) {
                    this.currentPage--;
                    this.renderProfiles();
                    this.scrollToTop();
                }
            };
        }

        // 다음 버튼
        const nextBtn = document.getElementById('nextPageBtn');
        if (nextBtn) {
            nextBtn.onclick = () => {
                const totalPages = Math.ceil(this.filteredProfiles.length / this.itemsPerPage);
                if (this.currentPage < totalPages) {
                    this.currentPage++;
                    this.renderProfiles();
                    this.scrollToTop();
                }
            };
        }

        // 페이지 번호 버튼들
        document.querySelectorAll('.pagination-number').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const page = parseInt(e.target.dataset.page);
                if (page && page !== this.currentPage) {
                    this.currentPage = page;
                    this.renderProfiles();
                    this.scrollToTop();
                }
            });
        });
    }

    scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    showLoading(show) {
        const container = document.getElementById('profilesGrid');
        if (!container) return;
        
        if (show) {
            container.innerHTML = `
                <div class="loading-spinner" style="text-align: center; padding: 2rem;">
                    <div>프로필을 불러오는 중...</div>
                </div>
            `;
        }
    }
}

// 전역 함수
function viewProfile(id) {
    console.log('🔗 프로필 클릭:', id);
    window.location.href = `detail.html?id=${id}`;
}

// 전역 변수
let ecogirlGallery;

// 페이지 로드 시 초기화 (약간 지연)
document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM 로드 완료, 갤러리 초기화 준비');
    
    // 스크립트 로딩을 기다리기 위해 약간 지연
    setTimeout(() => {
        console.log('🎯 갤러리 초기화 시작');
        ecogirlGallery = new EcogirlGallery();
    }, 100);
});

// 전역 접근
window.EcogirlGallery = EcogirlGallery;
window.viewProfile = viewProfile;