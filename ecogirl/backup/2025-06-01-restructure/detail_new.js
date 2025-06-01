// 새로운 상세 페이지 JavaScript - 이미지 중심 디자인

class EcogirlDetailNew {
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

        // 노션 API 초기화 (클래스명 확인)
        if (typeof NotionAPI !== 'undefined') {
            console.log('✅ NotionAPI 클래스 발견');
            this.notionAPI = new NotionAPI();
        } else if (typeof NotionAPIProxy !== 'undefined') {
            console.log('✅ NotionAPIProxy 클래스 발견');
            this.notionAPI = new NotionAPIProxy();
        } else {
            console.warn('⚠️ 노션 API 클래스를 찾을 수 없음. 사용 가능한 클래스:', Object.keys(window));
        }

        // 모달 초기화
        this.initModal();
        
        // 프로필 데이터 로드
        await this.loadProfileData();
        
        // 페이지 렌더링
        this.renderProfile();
        
        console.log('새로운 상세 페이지 초기화 완료');
    }

    async loadProfileData() {
        try {
            if (this.notionAPI) {
                console.log('🔍 노션에서 프로필 데이터 로드 중...');
                // getAllProfiles 또는 getProfiles 메서드 시도
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
                }
                
                this.profileData = profiles.find(p => p.id === this.profileId);
                
                if (this.profileData) {
                    console.log('✅ 노션 프로필 데이터 로드 성공:', this.profileData);
                    console.log('🖼️ 노션 프로필 이미지:', this.profileData.profile_image);
                    console.log('🎨 노션 갤러리 이미지:', this.profileData.gallery_images);
                    console.log('📋 현재 프로필의 모든 키:', Object.keys(this.profileData));
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
        // 백업 프로필 데이터 - 실제 파일명 사용 (갤러리 첫 번째 이미지를 프로필로 사용)
        const backupProfiles = {
            1: {
                id: 1,
                name: '아름',
                age: 27,
                profileImage: '../assets/images/profiles/250524-15-02_00001_.png', // 갤러리 첫 번째를 프로필로
                galleryImages: [
                    '../assets/images/profiles/250524-15-10_00002_.png', // 원래 프로필을 갤러리로
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
                profileImage: '../assets/images/profiles/250524-15-38_00007_.png', // 갤러리 첫 번째를 프로필로
                galleryImages: [
                    '../assets/images/profiles/250524-15-38_00003_.png', // 원래 프로필을 갤러리로
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
                profileImage: '../assets/images/profiles/250524-16-13_00003_.png', // 갤러리 첫 번째를 프로필로
                galleryImages: [
                    '../assets/images/profiles/250524-16-13_00001_.png', // 원래 프로필을 갤러리로
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
                profileImage: '../assets/images/profiles/250524-16-37_00002_.png', // 갤러리 첫 번째를 프로필로
                galleryImages: [
                    '../assets/images/profiles/250524-16-37_00001_.png', // 원래 프로필을 갤러리로
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
                profileImage: '../assets/images/profiles/250524-16-58_00005_.png', // 갤러리 첫 번째를 프로필로
                galleryImages: [
                    '../assets/images/profiles/250524-16-28_00004_.png', // 원래 프로필을 갤러리로
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
        
        console.log('🔍 전체 프로필 데이터:', data);
        console.log('📋 사용 가능한 모든 키:', Object.keys(data));
        
        // 노션 컬럼명 확인 (한글/영어 모두 체크)
        console.log('🖼️ 프로필사진 필드들:');
        console.log('  - profileImage:', data.profileImage);
        console.log('  - profile_image:', data.profile_image);
        console.log('  - 프로필사진:', data.프로필사진);
        console.log('  - 메인이미지:', data.메인이미지);
        
        console.log('🎨 갤러리사진 필드들:');
        console.log('  - galleryImages:', data.galleryImages);
        console.log('  - gallery_images:', data.gallery_images);
        console.log('  - 갤러리사진:', data.갤러리사진);
        console.log('  - 갤러리이미지:', data.갤러리이미지);

        // 프로필 이미지 경로 결정 (기존 성공 버전 기준)
        let profileImageSrc = 
            data.mainImage ||               // 노션에서 실제 사용하는 키 (기존 성공 버전)
            data.프로필사진 ||              // 한글 컬럼명 1
            data.메인이미지 ||              // 한글 컬럼명 2
            data.profileImage ||           // 영어 컬럼명 1
            data.profile_image ||          // 영어 컬럼명 2
            null;

        console.log('🔍 노션 데이터에서 이미지 필드들:');
        console.log('  - mainImage (기존성공):', data.mainImage);
        console.log('  - 프로필사진:', data.프로필사진);
        console.log('  - 메인이미지:', data.메인이미지);
        console.log('  - profileImage:', data.profileImage);
        console.log('  - profile_image:', data.profile_image);

        // 프로필 이미지가 없으면 갤러리 첫 번째 이미지 사용
        if (!profileImageSrc) {
            const galleryImages = 
                data.galleryImages ||       // 기존 성공 버전 키
                data.갤러리사진 ||       
                data.갤러리이미지 ||     
                data.gallery_images ||  
                [];
            
            if (galleryImages && galleryImages.length > 0) {
                profileImageSrc = galleryImages[0];
                console.log('🔄 갤러리 첫 번째 이미지를 프로필로 사용:', profileImageSrc);
            } else {
                profileImageSrc = '../assets/images/profiles/default.png';
                console.log('⚠️ 이미지가 없어서 기본 이미지 사용');
            }
        }

        console.log('📸 최종 선택된 프로필 이미지 경로:', profileImageSrc);

        // 히어로 섹션
        const heroImage = document.getElementById('heroImage');
        const heroSection = document.querySelector('.hero-image');
        
        console.log('🎯 히어로 이미지 요소:', heroImage);
        
        heroImage.src = profileImageSrc;
        
        // 이미지 로드 성공 이벤트
        heroImage.onload = () => {
            console.log('✅ 프로필 이미지 로드 성공:', profileImageSrc);
            // 배경 블러 이미지 설정
            heroSection.style.setProperty('--hero-bg-image', `url(${profileImageSrc})`);
        };
        
        // 배경 블러 이미지 설정 (즉시)
        heroSection.style.setProperty('--hero-bg-image', `url(${profileImageSrc})`);
        
        heroImage.onerror = () => {
            console.error('❌ 프로필 이미지 로드 실패:', profileImageSrc);
            const fallbackSrc = this.createFallbackImage(data.name || data.이름 || '에코걸');
            console.log('🔄 기본 이미지로 교체:', fallbackSrc);
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

    // 기본 이미지 생성 (SVG) - 한글 인코딩 문제 해결
    createFallbackImage(name) {
        // 한글 인코딩 문제로 영어 텍스트 사용
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

    // 영어 이니셜 변환
    getEnglishInitial(name) {
        const nameMap = {
            '아름': 'A',
            '소희': 'S', 
            '유리': 'Y',
            '하나': 'H',
            '민지': 'M',
            '1': '1',
            '2': '2',
            '3': '3',
            '4': '4',
            '5': '5'
        };
        return nameMap[name] || 'E'; // E for EcoGirl
    }

    renderGallery() {
        const galleryGrid = document.getElementById('galleryGrid');
        
        // 갤러리 이미지 소스 결정 (기존 성공 버전 기준)
        const images = 
            this.profileData.galleryImages ||   // 노션에서 실제 사용하는 키 (기존 성공 버전)
            this.profileData.갤러리사진 ||       // 한글 컬럼명 1
            this.profileData.갤러리이미지 ||     // 한글 컬럼명 2
            this.profileData.gallery_images ||  // 영어 컬럼명 2
            [];
        
        console.log('🎨 갤러리 이미지 디버깅:');
        console.log('  - galleryImages (기존성공):', this.profileData.galleryImages);
        console.log('  - 갤러리사진:', this.profileData.갤러리사진);
        console.log('  - 갤러리이미지:', this.profileData.갤러리이미지);
        console.log('  - gallery_images:', this.profileData.gallery_images);
        console.log('🖼️ 최종 선택된 갤러리 이미지들:', images);
        
        galleryGrid.innerHTML = '';
        
        if (images.length === 0) {
            galleryGrid.innerHTML = '<p style="text-align: center; color: #718096; grid-column: 1/-1;">갤러리 이미지가 없습니다.</p>';
            return;
        }
        
        images.forEach((imageSrc, index) => {
            console.log(`🖼️ 갤러리 이미지 ${index + 1}:`, imageSrc);
            
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const img = document.createElement('img');
            img.src = imageSrc;
            img.alt = `갤러리 이미지 ${index + 1}`;
            img.loading = 'lazy';
            
            // 이미지 로드 에러 처리
            img.onerror = () => {
                console.warn(`❌ 갤러리 이미지 ${index + 1} 로드 실패:`, imageSrc);
                img.src = this.createFallbackImage(`${index + 1}`);
            };
            
            img.onload = () => {
                console.log(`✅ 갤러리 이미지 ${index + 1} 로드 성공:`, imageSrc);
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
        
        // 닫기 버튼 클릭
        modalClose.addEventListener('click', () => {
            this.closeModal();
        });
        
        // 모달 배경 클릭으로 닫기
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.closeModal();
            }
        });
        
        // ESC 키로 닫기
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
        document.body.style.overflow = 'hidden'; // 스크롤 방지
    }

    closeModal() {
        this.modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // 스크롤 복원
    }
}

// 상단 메뉴바 버튼 기능들
function goToHome() {
    // 메인 홈 페이지로 이동
    window.location.href = '../index.html';
}

function handleKakaoContact() {
    // 카카오톡 오픈채팅 또는 카카오톡 링크로 이동
    const kakaoUrl = 'https://open.kakao.com/o/s123456'; // 실제 링크로 변경
    window.open(kakaoUrl, '_blank');
}

function handlePhoneContact() {
    // 전화 다이얼 실행
    window.location.href = 'tel:+84-905-123-456';
}

function goToGallery() {
    // 에코걸 전체보기 갤러리 페이지로 이동
    window.location.href = 'gallery.html';
}

// 페이지 로드 시 초기화
document.addEventListener('DOMContentLoaded', () => {
    new EcogirlDetailNew();
    
    // 약간의 지연 후 스크롤 이벤트 등록 (DOM이 완전히 로드된 후)
    setTimeout(() => {
        initScrollEffects();
    }, 100);
});

// 스크롤 효과 초기화 함수
function initScrollEffects() {
    let lastScrollTop = 0;
    const topMenuBar = document.querySelector('.top-menu-bar');
    
    // topMenuBar가 존재하는지 확인
    if (topMenuBar) {
        console.log('✅ 상단 메뉴바 스크롤 효과 초기화 완료');
        
        window.addEventListener('scroll', () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            
            // 스크롤 시 배경 진하게
            if (scrollTop > 50) {
                topMenuBar.classList.add('scrolled');
            } else {
                topMenuBar.classList.remove('scrolled');
            }
            
            lastScrollTop = scrollTop;
        }, { passive: true });
    } else {
        console.warn('⚠️ .top-menu-bar 요소를 찾을 수 없습니다. 다시 시도합니다...');
        
        // 1초 후 다시 시도
        setTimeout(() => {
            initScrollEffects();
        }, 1000);
    }
}
