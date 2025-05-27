// 3D 갤러리 전용 JavaScript
let scene, camera, renderer, sphere;
let mouse = { x: 0, y: 0 };
let targetRotation = { x: 0, y: 0 };
let currentRotation = { x: 0, y: 0 };
let images = [];
let imageSprites = [];
let currentSelectedEcoGirls = []; // 현재 선택된 12명

// 전체 에코걸 데이터에서 랜덤 12명 선택
async function selectRandomEcoGirls() {
    try {
        const response = await fetch('data/ecogirls.json');
        const data = await response.json();
        const allEcoGirls = data.ecogirls;
        
        // 세션 스토리지에서 이전 선택 확인
        const sessionKey = 'selectedEcoGirls_' + new Date().toDateString();
        const cached = sessionStorage.getItem(sessionKey);
        
        if (cached) {
            currentSelectedEcoGirls = JSON.parse(cached);
        } else {
            // 랜덤하게 12명 선택
            const shuffled = [...allEcoGirls].sort(() => 0.5 - Math.random());
            currentSelectedEcoGirls = shuffled.slice(0, 12);
            
            // 세션 스토리지에 저장 (같은 날 동일한 선택 유지)
            sessionStorage.setItem(sessionKey, JSON.stringify(currentSelectedEcoGirls));
        }
        
        return currentSelectedEcoGirls;
    } catch (error) {
        console.error('에코걸 데이터 로드 실패:', error);
        return [];
    }
}

// 🖼️ 자동 확장자 감지 시스템 (게시판 연동 준비)
const supportedExtensions = ['jpg', 'jpeg', 'png', 'webp', 'bmp', 'gif'];

// 이미지 파일 자동 감지 함수 (실제 파일 존재 확인)
async function checkImageExists(url) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
    });
}

function getImageUrl(baseName, folder = 'images/profiles/') {
    // 직접 PNG 파일 경로 반환 (파일이 존재하는 것 확인됨)
    return `${folder}${baseName}.png`;
}

// 게시판 데이터 연동 준비용 함수 (실제 존재하는 이미지들 사용)
function getImageUrls() {
    // 실제 존재하는 이미지 파일들
    const imageNames = [
        '250524-15-10_00002_',
        '250524-15-38_00003_',
        '250524-16-13_00001_',
        '250524-16-13_00008_',
        '250524-16-37_00001_',
        '250524-17-33_00005_',
        '250524-18-19_00006_',
        '250524-18-30_00013_',
        '250524-19-41_00002_',
        '250524-19-55_00004_',
        // 12개 맞추기 위해 추가
        '250524-15-10_00002_',
        '250524-15-38_00003_'
    ];
    
    return imageNames.map(name => getImageUrl(name));
}

// 실제 이미지 파일들 (자동 확장자 감지 + 게시판 연동 준비)
const imageUrls = getImageUrls();

// 3D 갤러리 초기화
async function init3DGallery() {
    const canvas = document.getElementById('gallery3D');
    if (!canvas) return;

    // 랜덤 에코걸 선택
    await selectRandomEcoGirls();

    // 씬 생성
    scene = new THREE.Scene();
    
    // 카메라 생성
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // 렌더러 생성
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // 이미지 로드 및 스프라이트 생성
    loadImages();

    // 마우스 이벤트 리스너
    setupMouseEvents(canvas);

    // 윈도우 리사이즈 이벤트
    window.addEventListener('resize', onWindowResize, false);

    // 애니메이션 시작
    animate();
}

// 이미지 로드 및 3D 구체 배치
function loadImages() {
    const loader = new THREE.TextureLoader();
    const radius = 3;
    const imageCount = imageUrls.length;

    imageUrls.forEach((url, index) => {
        loader.load(url, (texture) => {
            // 텍스처 원본 크기 가져오기
            const img = texture.image;
            const aspectRatio = img.width / img.height;
            
            // 스프라이트 재질 생성
            const spriteMaterial = new THREE.SpriteMaterial({ 
                map: texture,
                transparent: true,
                opacity: 0.9
            });
            
            // 스프라이트 생성
            const sprite = new THREE.Sprite(spriteMaterial);
            
            // 원통형 배치 (구형보다 더 직관적)
            const angle = (index / imageCount) * Math.PI * 2;
            const radius = 3;
            const height = (index % 3 - 1) * 1.5; // 3단계 높이
            
            const x = radius * Math.cos(angle);
            const y = height;
            const z = radius * Math.sin(angle);
            
            sprite.position.set(x, y, z);
            
            // 원본 이미지 비율 유지 (기본 크기 0.8)
            const baseSize = 0.8;
            if (aspectRatio > 1) {
                // 가로가 더 긴 경우
                sprite.scale.set(baseSize, baseSize / aspectRatio, 1);
            } else {
                // 세로가 더 긴 경우
                sprite.scale.set(baseSize * aspectRatio, baseSize, 1);
            }
            
            // 항상 카메라를 향하도록 설정
            sprite.lookAt(camera.position);
            
            scene.add(sprite);
            imageSprites.push({
                sprite: sprite,
                originalPosition: { x, y, z },
                originalScale: 1
            });
        });
    });

    // 파티클 효과 추가
    addParticles();
}

// 파티클 효과 추가
function addParticles() {
    const particleGeometry = new THREE.BufferGeometry();
    const particleCount = 10; // 100개 → 10개로 줄임
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i++) {
        positions[i] = (Math.random() - 0.5) * 15; // 범위도 줄임
    }

    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const particleMaterial = new THREE.PointsMaterial({
        color: 0xffffff,
        size: 0.05, // 크기 2.5배 키움
        transparent: true,
        opacity: 0.8 // 투명도 높임
    });

    const particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);
}

// 마우스 이벤트 설정
function setupMouseEvents(canvas) {
    let isMouseDown = false;
    let dragDistance = 0;
    let mouseDownTime = 0;
    
    canvas.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        dragDistance = 0;
        mouseDownTime = Date.now();
        canvas.style.cursor = 'grabbing';
    });

    canvas.addEventListener('mouseup', (event) => {
        const clickDuration = Date.now() - mouseDownTime;
        
        // 클릭 판정: 드래그 거리가 작고 클릭 시간이 짧을 때
        if (dragDistance < 10 && clickDuration < 300) {
            handleImageClick(event);
        }
        
        isMouseDown = false;
        canvas.style.cursor = 'grab';
    });

    canvas.addEventListener('mouseleave', () => {
        isMouseDown = false;
        canvas.style.cursor = 'grab';
    });

    canvas.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            const deltaX = event.clientX - mouse.x;
            const deltaY = event.clientY - mouse.y;
            
            // 드래그 거리 누적
            dragDistance += Math.abs(deltaX) + Math.abs(deltaY);
            
            // 마우스 방향과 동일하게 수정
            targetRotation.y += deltaX * 0.01;  // 다시 원래 방향
            targetRotation.x += deltaY * 0.01;  // 다시 원래 방향
            
            // X축 회전 제한 (더 자유롭게 회전 가능)
            targetRotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, targetRotation.x));
        }
        
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    // 터치 이벤트 (모바일)
    canvas.addEventListener('touchstart', (event) => {
        isMouseDown = true;
        const touch = event.touches[0];
        mouse.x = touch.clientX;
        mouse.y = touch.clientY;
        event.preventDefault();
    });

    canvas.addEventListener('touchend', () => {
        isMouseDown = false;
    });

    canvas.addEventListener('touchmove', (event) => {
        if (isMouseDown && event.touches.length === 1) {
            const touch = event.touches[0];
            const deltaX = touch.clientX - mouse.x;
            const deltaY = touch.clientY - mouse.y;
            
            // 마우스와 동일한 방향으로 수정
            targetRotation.y += deltaX * 0.01;  // 다시 원래 방향
            targetRotation.x += deltaY * 0.01;  // 다시 원래 방향
            
            targetRotation.x = Math.max(-Math.PI/2, Math.min(Math.PI/2, targetRotation.x));
            
            mouse.x = touch.clientX;
            mouse.y = touch.clientY;
        }
        event.preventDefault();
    });
}

// 윈도우 리사이즈 처리
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// 애니메이션 루프
function animate() {
    requestAnimationFrame(animate);

    // 부드러운 회전 보간
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;

    // 자동 회전 (마우스 조작이 없을 때)
    if (Math.abs(targetRotation.y - currentRotation.y) < 0.001) {
        targetRotation.y += 0.002;
    }

    // 중앙 이미지 찾기 (카메라에서 가장 가까운 이미지)
    let closestSprite = null;
    let minDistance = Infinity;

    // 스프라이트들 회전 및 크기 조정
    imageSprites.forEach((item, index) => {
        const sprite = item.sprite;
        const originalPos = item.originalPosition;
        
        // 회전 적용
        const rotatedX = originalPos.x * Math.cos(currentRotation.y) - originalPos.z * Math.sin(currentRotation.y);
        const rotatedZ = originalPos.x * Math.sin(currentRotation.y) + originalPos.z * Math.cos(currentRotation.y);
        const rotatedY = originalPos.y * Math.cos(currentRotation.x) - rotatedZ * Math.sin(currentRotation.x);
        const finalZ = originalPos.y * Math.sin(currentRotation.x) + rotatedZ * Math.cos(currentRotation.x);
        
        sprite.position.set(rotatedX, rotatedY, finalZ);
        
        // 거리에 따른 크기 조정 (원근법)
        const distance = sprite.position.distanceTo(camera.position);
        const scale = Math.max(0.3, 2 - distance * 0.3);
        
        // 중앙 이미지 찾기 (가장 가까운 이미지)
        if (distance < minDistance) {
            minDistance = distance;
            closestSprite = sprite;
        }
        
        sprite.scale.set(scale, scale, scale);
        
        // 투명도 조정 (뒤쪽은 더 투명하게)
        const opacity = Math.max(0.3, 1 - (distance - 3) * 0.5);
        sprite.material.opacity = opacity;
    });

    // 중앙 이미지 임팩트 효과
    if (closestSprite) {
        const time = Date.now() * 0.001; // 속도 5배 느리게
        
        // 미묘한 진동 효과 (스케일) - 폭 5배 줄임
        const vibration = 1 + Math.sin(time * 2) * 0.01;
        const currentScale = closestSprite.scale.x;
        closestSprite.scale.set(currentScale * vibration, currentScale * vibration, currentScale * vibration);
        
        // 글로우 효과 (투명도 변화) - 폭 절반으로 줄임
        const glowEffect = 0.95 + Math.sin(time) * 0.05;
        closestSprite.material.opacity = Math.min(1, closestSprite.material.opacity * glowEffect);
    }

    renderer.render(scene, camera);
}

// 이미지 클릭 핸들러
function handleImageClick(event) {
    // 중앙에 가장 가까운 이미지 찾기
    let closestSprite = null;
    let minDistance = Infinity;
    let closestIndex = -1;

    imageSprites.forEach((item, index) => {
        const sprite = item.sprite;
        const distance = sprite.position.distanceTo(camera.position);
        
        if (distance < minDistance) {
            minDistance = distance;
            closestSprite = sprite;
            closestIndex = index;
        }
    });

    // 가장 가까운 이미지가 있으면 상세페이지로 이동
    if (closestSprite && closestIndex >= 0 && currentSelectedEcoGirls[closestIndex]) {
        const ecoGirlId = currentSelectedEcoGirls[closestIndex].id;
        window.location.href = `ecogirl-detail.html?id=${ecoGirlId}`;
    }
}

// 페이지 로드 시 3D 갤러리 초기화
document.addEventListener('DOMContentLoaded', function() {
    // Three.js 로드 확인 후 초기화
    if (typeof THREE !== 'undefined') {
        init3DGallery();
    } else {
        console.error('Three.js 라이브러리를 로드할 수 없습니다.');
    }
});