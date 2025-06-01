// 상세페이지 JavaScript
let currentGalleryIndex = 0;
let currentEcoGirl = null;

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', function() {
    loadEcoGirlData();
    setupEventListeners();
});

// URL에서 ID 파라미터 가져오기
function getUrlParameter(name) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(name);
}

// 에코걸 데이터 로드 (노션 API 사용)
async function loadEcoGirlData() {
    try {
        const ecoGirlId = parseInt(getUrlParameter('id'));
        if (!ecoGirlId) {
            alert('잘못된 접근입니다.');
            goBack();
            return;
        }

        // 노션 API 초기화
        const notionAPI = new NotionAPI();
        
        // 노션에서 해당 ID의 프로필 데이터 가져오기
        currentEcoGirl = await notionAPI.getProfile(ecoGirlId);
        
        if (!currentEcoGirl) {
            alert('에코걸 정보를 찾을 수 없습니다.');
            goBack();
            return;
        }

        displayEcoGirlInfo();
        setupGallery();
        
    } catch (error) {
        console.error('노션 데이터 로드 실패:', error);
        alert('데이터를 불러오는데 실패했습니다.');
        goBack();
    }
}

// 에코걸 정보 표시 (노션 데이터 기반)
function displayEcoGirlInfo() {
    if (!currentEcoGirl) return;

    // 프로필 정보 (노션 데이터 기반)
    document.getElementById('profileName').textContent = currentEcoGirl.name;
    document.getElementById('profileAge').textContent = `${currentEcoGirl.age}세`;
    
    // 키와 지역은 노션에 없으므로 스킬과 언어로 대체
    const firstLanguage = currentEcoGirl.languages[0] || '한국어';
    const firstSkill = currentEcoGirl.skills[0] || '가이드';
    document.getElementById('profileHeight').textContent = firstLanguage; // "키" → "언어"
    document.getElementById('profileArea').textContent = firstSkill; // "지역" → "특기"

    // 프로필 이미지 (노션에서 가져온 메인 이미지)
    const profileImg = document.getElementById('profileImg');
    if (currentEcoGirl.mainImage) {
        profileImg.src = currentEcoGirl.mainImage;
        profileImg.alt = `${currentEcoGirl.name} 프로필 사진`;
    } else {
        // 노션에 이미지가 없으면 로컬 이미지 시도
        const localImagePath = `../assets/images/profiles/profile_${String(currentEcoGirl.id).padStart(3, '0')}.png`;
        profileImg.src = localImagePath;
        profileImg.alt = `${currentEcoGirl.name} 프로필 사진`;
        
        // 로컬 이미지도 없으면 SVG 플레이스홀더
        profileImg.onerror = function() {
            this.src = `data:image/svg+xml;base64,${btoa(`
                <svg width="300" height="400" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                        <linearGradient id="g${currentEcoGirl.id}" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stop-color="#ff98a8"/>
                            <stop offset="100%" stop-color="#ffd6e9"/>
                        </linearGradient>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#g${currentEcoGirl.id})"/>
                    <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="24" fill="#fff" text-anchor="middle" dy=".3em">${currentEcoGirl.name}</text>
                    <text x="50%" y="55%" font-family="Arial, sans-serif" font-size="18" fill="#fff" text-anchor="middle" dy=".3em">${currentEcoGirl.age}세</text>
                </svg>
            `)}`;
        };
    }

    // 인사 영상 설정 (노션에는 없으므로 프로필 이미지로 대체)
    const greetingVideo = document.getElementById('greetingVideo');
    greetingVideo.poster = profileImg.src;

    // 서비스 정보 (노션의 특기 데이터 사용)
    displayServices();
    displayLanguages();
    
    // 자기소개와 기타 정보
    if (currentEcoGirl.introduction) {
        document.getElementById('hobbies').textContent = currentEcoGirl.introduction;
    } else {
        // 자기소개가 없으면 취미와 성향을 조합
        const combined = [
            ...currentEcoGirl.hobbies.map(h => `💫 ${h}`),
            ...currentEcoGirl.personality.map(p => `✨ ${p}`)
        ].join(', ');
        document.getElementById('hobbies').textContent = combined || '다양한 취미와 매력을 가지고 있어요!';
    }
    
    // 시간 정보 (성향에 따라 다르게 설정)
    let availableTime = '오전 10시 - 오후 10시';
    if (currentEcoGirl.personality.includes('활발함')) {
        availableTime = '오전 9시 - 오후 11시';
    } else if (currentEcoGirl.personality.includes('차분함')) {
        availableTime = '오전 11시 - 오후 9시';
    }
    document.getElementById('availableTime').textContent = availableTime;
    
    // 연락처 정보 (노션 실제 데이터)
    document.getElementById('kakaoId').textContent = currentEcoGirl.contact || `${currentEcoGirl.name.toLowerCase()}_danang`;
    document.getElementById('phoneNumber').textContent = currentEcoGirl.phone || '문의 시 안내';
}

// 서비스 태그 표시 (노션의 특기 데이터 사용)
function displayServices() {
    const serviceList = document.getElementById('serviceList');
    serviceList.innerHTML = '';
    
    const services = currentEcoGirl.skills || [];
    if (services.length === 0) {
        services.push('동반 서비스', '관광 가이드', '통역 서비스'); // 기본 서비스
    }
    
    services.forEach(service => {
        const tag = document.createElement('span');
        tag.className = 'service-tag';
        tag.textContent = service;
        serviceList.appendChild(tag);
    });
}

// 언어 태그 표시 (노션의 언어 데이터 사용)
function displayLanguages() {
    const languageList = document.getElementById('languageList');
    languageList.innerHTML = '';
    
    const languages = currentEcoGirl.languages || ['한국어'];
    
    languages.forEach(language => {
        const tag = document.createElement('span');
        tag.className = 'service-tag';
        tag.textContent = language;
        languageList.appendChild(tag);
    });
}

// 갤러리 설정 (노션의 갤러리 이미지 사용)
function setupGallery() {
    const slider = document.getElementById('gallerySlider');
    slider.innerHTML = '';
    
    let galleryImages = [];
    
    // 노션에서 갤러리 이미지가 있으면 사용
    if (currentEcoGirl.galleryImages && currentEcoGirl.galleryImages.length > 0) {
        galleryImages = currentEcoGirl.galleryImages;
    } else if (currentEcoGirl.mainImage) {
        // 갤러리 이미지가 없으면 메인 이미지를 3번 사용
        galleryImages = [currentEcoGirl.mainImage, currentEcoGirl.mainImage, currentEcoGirl.mainImage];
    } else {
        // 둘 다 없으면 로컬 이미지 시도
        const baseId = String(currentEcoGirl.id).padStart(3, '0');
        galleryImages = [
            `../assets/images/profiles/gallery_${baseId}_1.png`,
            `../assets/images/profiles/gallery_${baseId}_2.png`,
            `../assets/images/profiles/gallery_${baseId}_3.png`
        ];
    }
    
    galleryImages.forEach((imageUrl, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        
        // 한글 인코딩 문제 해결: encodeURIComponent 사용
        const fallbackSvg = `<svg width="200" height="267" xmlns="http://www.w3.org/2000/svg">
            <rect width="100%" height="100%" fill="#f0f0f0"/>
            <text x="50%" y="50%" font-family="Arial" font-size="14" fill="#999" text-anchor="middle" dy=".3em">Gallery ${index + 1}</text>
        </svg>`;
        
        const encodedSvg = btoa(fallbackSvg);
        
        item.innerHTML = `
            <img src="${imageUrl}" alt="${currentEcoGirl.name} 갤러리 이미지 ${index + 1}" 
                 onerror="this.src='data:image/svg+xml;base64,${encodedSvg}'"/>
                    </svg>
                 `)}'" 
                 onclick="openImageModal(this.src)"
                 style="cursor: pointer;">
        `;
        slider.appendChild(item);
    });
}

// 갤러리 슬라이드
function slideGallery(direction) {
    const slider = document.getElementById('gallerySlider');
    const items = slider.querySelectorAll('.gallery-item');
    const itemWidth = items[0].offsetWidth + 16; // gap 포함
    
    currentGalleryIndex += direction;
    
    // 범위 제한
    if (currentGalleryIndex < 0) {
        currentGalleryIndex = 0;
    } else if (currentGalleryIndex >= items.length - 2) {
        currentGalleryIndex = Math.max(0, items.length - 3);
    }
    
    slider.style.transform = `translateX(-${currentGalleryIndex * itemWidth}px)`;
}

// 이미지 모달 열기
function openImageModal(imageSrc) {
    // 간단한 이미지 모달 구현
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = imageSrc;
    img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        object-fit: contain;
    `;
    
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    modal.onclick = () => {
        document.body.removeChild(modal);
    };
}

// 클립보드 복사
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.textContent;
    
    navigator.clipboard.writeText(text).then(() => {
        // 복사 완료 알림
        showToast(`${text} 복사되었습니다!`);
    }).catch(err => {
        console.error('복사 실패:', err);
        // 폴백 방법
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast(`${text} 복사되었습니다!`);
    });
}

// 토스트 알림 표시
function showToast(message) {
    const toast = document.createElement('div');
    toast.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: #333;
        color: white;
        padding: 12px 24px;
        border-radius: 6px;
        z-index: 1000;
        font-size: 14px;
        font-weight: 500;
    `;
    toast.textContent = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        if (document.body.contains(toast)) {
            document.body.removeChild(toast);
        }
    }, 3000);
}

// 예약 모달 열기
function openBookingModal() {
    alert(`${currentEcoGirl.name}님과의 예약 문의는 카카오톡 ID: ${currentEcoGirl.kakaoId} 또는 전화번호: ${currentEcoGirl.phoneNumber}로 연락해주세요!`);
}

// 뒤로가기
function goBack() {
    window.history.back();
}

// 이벤트 리스너 설정
function setupEventListeners() {
    // 인사 영상 재생 버튼
    const playBtn = document.querySelector('.play-btn');
    const video = document.getElementById('greetingVideo');
    
    if (playBtn && video) {
        playBtn.addEventListener('click', () => {
            video.play();
            document.querySelector('.video-overlay').style.opacity = '0';
        });
        
        video.addEventListener('pause', () => {
            document.querySelector('.video-overlay').style.opacity = '1';
        });
    }
}

// 전역 함수들 (HTML에서 호출)
window.slideGallery = slideGallery;
window.copyToClipboard = copyToClipboard;
window.openBookingModal = openBookingModal;
window.goBack = goBack;