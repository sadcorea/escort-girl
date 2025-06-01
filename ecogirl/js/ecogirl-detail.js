// 에코걸 상세 페이지 JavaScript - 노션 연동

class EcogirlDetail {
    constructor() {
        this.profileId = null;
        this.profileData = null;
        this.notionAPI = null;
        this.modal = null;
        this.init();
    }

    async init() {
        // URL에서 ID 추출
        const urlParams = new URLSearchParams(window.location.search);
        this.profileId = parseInt(urlParams.get('id'));
        
        if (!this.profileId) {
            console.error('프로필 ID가 없습니다.');
            return;
        }

        // 노션 API 초기화
        if (typeof NotionAPI !== 'undefined') {
            console.log('✅ NotionAPI 클래스 발견');
            this.notionAPI = new NotionAPI();
        } else if (typeof NotionAPIProxy !== 'undefined') {
            console.log('✅ NotionAPIProxy 클래스 발견');
            this.notionAPI = new NotionAPIProxy();
        } else {
            console.warn('⚠️ 노션 API 클래스를 찾을 수 없음');
        }

        // 모달 초기화
        this.initModal();
        
        // 프로필 데이터 로드
        await this.loadProfileData();
        
        // 페이지 렌더링
        this.renderProfile();
        
        console.log('에코걸 상세 페이지 초기화 완료');
    }

    async loadProfileData() {
        try {
            if (this.notionAPI) {
                console.log('🔍 노션에서 프로필 데이터 로드 중...');
                let profiles = [];
                if (typeof this.notionAPI.getAllProfiles === 'function') {
                    profiles = await this.notionAPI.getAllProfiles();
                } else if (typeof this.notionAPI.getProfiles === 'function') {
                    profiles = await this.notionAPI.getProfiles();
                }
                
                console.log('📊 노션에서 받은 전체 프로필:', profiles);
                
                this.profileData = profiles.find(p => p.id === this.profileId);
                
                if (this.profileData) {
                    console.log('✅ 노션 프로필 데이터 로드 성공:', this.profileData);
                    return;
                } else {
                    console.warn('⚠️ 노션에서 해당 ID 프로필을 찾을 수 없음:', this.profileId);
                }
            } else {
                console.warn('⚠️ 노션 API가 초기화되지 않음');
            }
            
            // 노션 실패 시 백업 데이터 사용
            console.log('🔄 백업 데이터 사용');
            this.profileData = this.getBackupData();
            
        } catch (error) {
            console.error('❌ 프로필 데이터 로드 실패:', error);
            this.profileData = this.getBackupData();
        }
    }

    getBackupData() {
        // 백업 프로필 데이터
        const backupProfiles = {
            1: {
                id: 1,
                name: '아름',
                age: 27,
                profileImage: '../assets/images/profiles/250524-15-02_00001_.png',
                galleryImages: [
                    '../assets/images/profiles/250524-15-10_00002_.png',
                    '../assets/images/profiles/250524-15-10_00005_.png',
                    '../assets/images/profiles/250524-14-52_00005_.png'
                ],
                languages: ['한국어', '영어', '베트남어'],
                hobbies: ['골프', '영화감상'],
                personality: ['차분함'],
                skills: ['바베큐', '요리'],
                introduction: '안녕하세요! 다낭을 잘 아는 아름입니다. 골프를 좋아하고 맛있는 음식 만들기를 좋아해요. 함께 즐거운 시간 보내요!'
            },
            2: {
                id: 2,
                name: '소희',
                age: 25,
                profileImage: '../assets/images/profiles/250524-15-38_00007_.png',
                galleryImages: [
                    '../assets/images/profiles/250524-15-38_00003_.png',
                    '../assets/images/profiles/250524-16-04_00002_.png',
                    '../assets/images/profiles/250524-16-04_00004_.png'
                ],
                languages: ['한국어', '베트남어'],
                hobbies: ['마사지', '요가'],
                personality: ['따뜻함', '차분함'],
                skills: ['마사지', '요가'],
                introduction: '안녕하세요! 소희입니다. 전문 마사지와 요가로 여행의 피로를 말끔히 풀어드릴게요. 편안한 시간을 만들어드리겠습니다.'
            },
            3: {
                id: 3,
                name: '유리',
                age: 23,
                profileImage: '../assets/images/profiles/250524-16-13_00003_.png',
                galleryImages: [
                    '../assets/images/profiles/250524-16-13_00001_.png',
                    '../assets/images/profiles/250524-16-13_00008_.png',
                    '../assets/images/profiles/250524-16-27_00001_.png'
                ],
                languages: ['한국어', '영어'],
                hobbies: ['음악감상', '노래'],
                personality: ['발랄함', '활발함'],
                skills: ['기타연주', '노래'],
                introduction: '안녕하세요! 유리입니다. 음악을 사랑하고 기타 연주와 노래를 잘해요. 함께 즐겁고 신나는 시간을 보내봐요!'
            },
            4: {
                id: 4,
                name: '하나',
                age: 26,
                profileImage: '../assets/images/profiles/250524-16-37_00002_.png',
                galleryImages: [
                    '../assets/images/profiles/250524-16-37_00001_.png',
                    '../assets/images/profiles/250524-16-37_00006_.png',
                    '../assets/images/profiles/250524-16-37_00007_.png'
                ],
                languages: ['한국어', '일본어'],
                hobbies: ['요리', '쇼핑'],
                personality: ['지적임', '따뜻함'],
                skills: ['요리', '요가'],
                introduction: '안녕하세요! 하나입니다. 요리를 정말 좋아하고 일본어도 할 수 있어요. 맛있는 음식과 함께 편안한 시간을 만들어드릴게요.'
            },
            5: {
                id: 5,
                name: '민지',
                age: 24,
                profileImage: '../assets/images/profiles/250524-16-58_00005_.png',
                galleryImages: [
                    '../assets/images/profiles/250524-16-28_00004_.png',
                    '../assets/images/profiles/250524-16-58_00006_.png',
                    '../assets/images/profiles/250524-17-08_00008_.png'
                ],
                languages: ['한국어', '영어', '중국어'],
                hobbies: ['사진촬영', '여행'],
                personality: ['발랄함', '유머러스'],
                skills: ['사진촬영', '댄스'],
                introduction: '안녕하세요! 민지입니다. 사진 촬영을 좋아하고 댄스도 잘해요. 여러분의 다낭 여행을 특별한 추억으로 만들어드릴게요!'
            }
        };

        return backupProfiles[this.profileId] || backupProfiles[1];
    }

    renderProfile() {
        if (!this.profileData) return;

        const data = this.profileData;
        
        console.log('🔍 프로필 렌더링:', data);
        
        // 프로필 이미지 결정
        let profileImageSrc = 
            data.mainImage ||
            data.프로필사진 ||
            data.profileImage ||
            data.profile_image ||
            null;

        // 프로필 이미지가 없으면 갤러리 첫 번째 이미지 사용
        if (!profileImageSrc) {
            const galleryImages = 
                data.galleryImages ||
                data.갤러리사진 ||
                data.gallery_images ||
                [];
            
            if (galleryImages && galleryImages.length > 0) {
                profileImageSrc = galleryImages[0];
            } else {
                profileImageSrc = this.createFallbackImage(data.name || '에코걸');
            }
        }

        // 히어로 섹션 업데이트
        const heroImage = document.getElementById('heroImage');
        const heroSection = document.querySelector('.hero-image');
        
        heroImage.src = profileImageSrc;
        heroSection.style.setProperty('--hero-bg-image', `url(${profileImageSrc})`);
        
        heroImage.onerror = () => {
            console.error('❌ 프로필 이미지 로드 실패:', profileImageSrc);
            const fallbackSrc = this.createFallbackImage(data.name || '에코걸');
            heroImage.src = fallbackSrc;
            heroSection.style.setProperty('--hero-bg-image', `url(${fallbackSrc})`);
        };

        document.getElementById('profileName').textContent = data.name || data.이름 || '에코걸';
        document.getElementById('profileAge').textContent = `${data.age || data.나이 || 23}세`;

        // 갤러리 렌더링
        this.renderGallery();

        // 태그들 렌더링
        this.renderTags('languagesList', data.languages || data.언어 || ['한국어']);
        this.renderTags('hobbiesList', data.hobbies || data.취미 || ['여행']);
        this.renderTags('personalityList', data.personality || data.성향 || ['친근함']);

        // 자기소개
        document.getElementById('introText').textContent = 
            data.introduction || data.자기소개 || '안녕하세요! 함께 즐거운 시간을 보내요!';
    }

    createFallbackImage(name) {
        const displayText = this.getEnglishInitial(name);
        const svg = `
            <svg width="400" height="400" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="100%" height="100%" fill="url(#bg)"/>
                <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="80" 
                      font-weight="bold" text-anchor="middle" dy=".3em" fill="white">
                    ${displayText}
                </text>
            </svg>
        `;
        return 'data:image/svg+xml;base64,' + btoa(svg);
    }

    getEnglishInitial(name) {
        const nameMap = {
            '아름': 'A', '소희': 'S', '유리': 'Y', '하나': 'H', '민지': 'M',
            '1': '1', '2': '2', '3': '3', '4': '4', '5': '5'
        };
        return nameMap[name] || 'E';
    }

    renderGallery() {
        const galleryGrid = document.getElementById('galleryGrid');
        
        const images = 
            this.profileData.galleryImages ||
            this.profileData.갤러리사진 ||
            this.profileData.gallery_images ||
            [];
        
        galleryGrid.innerHTML = '';
        
        if (images.length === 0) {
            galleryGrid.innerHTML = '<p style="text-align: center; color: #718096; grid-column: 1/-1;">갤러리 이미지가 없습니다.</p>';
            return;
        }
        
        images.forEach((imageSrc, index) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = `갤러리 이미지 ${index + 1}`;
            img.loading = 'lazy';
            
            img.onerror = () => {
                img.src = this.createFallbackImage(`${index + 1}`);
            };
            
            galleryItem.appendChild(img);
            
            // 클릭으로 모달 열기
            galleryItem.addEventListener('click', () => {
                this.openModal(img.src);
            });
            
            galleryGrid.appendChild(galleryItem);
        });
    }

    renderTags(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container || !items) return;
        
        container.innerHTML = '';
        
        const tagArray = Array.isArray(items) ? items : [items];
        
        tagArray.forEach(item => {
            const tag = document.createElement('span');
            tag.className = 'tag';
            tag.textContent = item;
            container.appendChild(tag);
        });
    }

    initModal() {
        this.modal = document.getElementById('imageModal');
        const modalClose = document.querySelector('.modal-close');
        
        modalClose.addEventListener('click', () => {
            this.closeModal();
        });
        
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.modal.style.display === 'block') {
                this.closeModal();
            }
        });
    }

    openModal(imageSrc) {
        const modalImage = document.getElementById('modalImage');
        modalImage.src = imageSrc;
        this.modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// 전역 함수들
function goToHome() {
    window.location.href = '../index.html';
}

function handleKakaoContact() {
    if (navigator.userAgent.match(/KAKAOTALK/i)) {
        window.location.href = 'kakaotalk://open/profile/EchoPal_vip';
    } else {
        navigator.clipboard.writeText('EchoPal_vip').then(() => {
            alert('카카오톡 ID가 복사되었습니다: EchoPal_vip');
        });
    }
}

function handlePhoneContact() {
    window.location.href = 'tel:+84905123456';
}

function goToGallery() {
    window.location.href = 'index.html';
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new EcogirlDetail();
    
    setTimeout(() => {
        initScrollEffects();
    }, 100);
});

function initScrollEffects() {
    const topMenuBar = document.querySelector('.top-menu-bar');
    
    if (topMenuBar) {
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