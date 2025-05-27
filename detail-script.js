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

// 에코걸 데이터 로드
async function loadEcoGirlData() {
    try {
        const ecoGirlId = parseInt(getUrlParameter('id'));
        if (!ecoGirlId) {
            alert('잘못된 접근입니다.');
            goBack();
            return;
        }

        const response = await fetch('data/ecogirls.json');
        const data = await response.json();
        
        currentEcoGirl = data.ecogirls.find(girl => girl.id === ecoGirlId);
        
        if (!currentEcoGirl) {
            alert('에코걸 정보를 찾을 수 없습니다.');
            goBack();
            return;
        }

        displayEcoGirlInfo();
        setupGallery();
        
    } catch (error) {
        console.error('데이터 로드 실패:', error);
        alert('데이터를 불러오는데 실패했습니다.');
        goBack();
    }
}

// 에코걸 정보 표시
function displayEcoGirlInfo() {
    if (!currentEcoGirl) return;

    // 프로필 정보
    document.getElementById('profileName').textContent = currentEcoGirl.name;
    document.getElementById('profileAge').textContent = `${currentEcoGirl.age}세`;
    document.getElementById('profileHeight').textContent = currentEcoGirl.height;
    document.getElementById('profileArea').textContent = currentEcoGirl.area;

    // 프로필 이미지 (3D 갤러리에서 사용한 것과 동일)
    const profileImg = document.getElementById('profileImg');
    const imageIndex = currentEcoGirl.id - 1; // 0부터 시작
    const imageUrls = [
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEwIiBoZWlnaHQ9IjI4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImcxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmY5OGE4Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZmZkNmU5Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnMSkiLz48dGV4dCB4PSI1MCUiIHk9IjQ1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RWNvR2lybDwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+MSBNaW5oPC90ZXh0Pjwvc3ZnPg==',
        'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEwIiBoZWlnaHQ9IjI4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImcyIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjOThhOGZmIi8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZDZlOWZmIi8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnMikiLz48dGV4dCB4PSI1MCUiIHk9IjQ1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RWNvR2lybDwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+MiBMaW5oPC90ZXh0Pjwvc3ZnPg==',
        // ... 나머지 이미지들도 추가 (간략화)
    ];
    
    if (imageUrls[imageIndex]) {
        profileImg.src = imageUrls[imageIndex];
        profileImg.alt = `${currentEcoGirl.name} 프로필 사진`;
    }

    // 인사 영상 더미 설정
    const greetingVideo = document.getElementById('greetingVideo');
    greetingVideo.poster = imageUrls[imageIndex]; // 포스터로 프로필 이미지 사용
    // 실제 환경에서는 greetingVideo.src = `videos/${currentEcoGirl.video}`;

    // 서비스 정보
    displayServices();
    displayLanguages();
    
    // 기타 정보
    document.getElementById('availableTime').textContent = currentEcoGirl.availableTime;
    document.getElementById('hobbies').textContent = currentEcoGirl.hobbies;
    document.getElementById('kakaoId').textContent = currentEcoGirl.kakaoId;
    document.getElementById('phoneNumber').textContent = currentEcoGirl.phoneNumber;
}

// 서비스 태그 표시
function displayServices() {
    const serviceList = document.getElementById('serviceList');
    serviceList.innerHTML = '';
    
    currentEcoGirl.services.forEach(service => {
        const tag = document.createElement('span');
        tag.className = 'service-tag';
        tag.textContent = service;
        serviceList.appendChild(tag);
    });
}

// 언어 태그 표시
function displayLanguages() {
    const languageList = document.getElementById('languageList');
    languageList.innerHTML = '';
    
    currentEcoGirl.languages.forEach(language => {
        const tag = document.createElement('span');
        tag.className = 'service-tag';
        tag.textContent = language;
        languageList.appendChild(tag);
    });
}

// 갤러리 설정
function setupGallery() {
    const slider = document.getElementById('gallerySlider');
    slider.innerHTML = '';
    
    // 더미 갤러리 이미지 (실제로는 서버에서 로드)
    const dummyImages = [
        currentEcoGirl.id + '_gallery1.jpg',
        currentEcoGirl.id + '_gallery2.jpg',
        currentEcoGirl.id + '_gallery3.jpg'
    ];
    
    dummyImages.forEach((imageName, index) => {
        const item = document.createElement('div');
        item.className = 'gallery-item';
        item.innerHTML = `
            <img src="images/galleries/${imageName}" alt="갤러리 이미지 ${index + 1}" 
                 onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjI2NyIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPuqwpOufrOumrCDsnbTrr4jsp4A8L3RleHQ+PC9zdmc+Jz" 
                 onclick="openImageModal(this.src)">
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