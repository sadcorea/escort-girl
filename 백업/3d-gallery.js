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

// 에코걸 이미지 URL들 (실제 서비스에서는 실제 이미지 URL 사용)
const imageUrls = [
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjEwIiBoZWlnaHQ9IjI4MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImcxIiB4MT0iMCUiIHkxPSIwJSIgeDI9IjEwMCUiIHkyPSIxMDAlIj48c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZmY5OGE4Ii8+PHN0b3Agb2Zmc2V0PSIxMDAlIiBzdG9wLWNvbG9yPSIjZmZkNmU5Ii8+PC9saW5lYXJHcmFkaWVudD48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNnMSkiLz48dGV4dCB4PSI1MCUiIHk9IjQ1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjI0IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+RWNvR2lybDwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjU1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmaWxsPSIjZmZmIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+MSBNaW5oPC90ZXh0Pjwvc3ZnPg==',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOThhOGZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVjb0dpcmwgMjwvdGV4dD48L3N2Zz4=',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjYThmZjk4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVjb0dpcmwgMzwvdGV4dD48L3N2Zz4=',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZkNjk4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVjb0dpcmwgNDwvdGV4dD48L3N2Zz4=',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZDY5OGZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVjb0dpcmwgNTwvdGV4dD48L3N2Zz4=',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjOThmZmQ2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVjb0dpcmwgNjwvdGV4dD48L3N2Zz4=',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZhODk4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iI2ZmZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVjb0dpcmwgNzwvdGV4dD48L3N2Zz4=',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjYThmZmZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVjb0dpcmwgODwvdGV4dD48L3N2Zz4=',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZmZmE4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVjb0dpcmwgOTwvdGV4dD48L3N2Zz4=',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZmZhOGZmIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVjb0dpcmwgMTA8L3RleHQ+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZDZmZmE4Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVjb0dpcmwgMTE8L3RleHQ+PC9zdmc+',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjYThmZmQ2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyMCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVjb0dpcmwgMTI8L3RleHQ+PC9zdmc+'
];

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
            // 스프라이트 재질 생성
            const spriteMaterial = new THREE.SpriteMaterial({ 
                map: texture,
                transparent: true,
                opacity: 0.9
            });
            
            // 스프라이트 생성
            const sprite = new THREE.Sprite(spriteMaterial);
            
            // 구체 표면에 배치 (구면 좌표계)
            const phi = Math.acos(-1 + (2 * index) / imageCount);
            const theta = Math.sqrt(imageCount * Math.PI) * phi;
            
            const x = radius * Math.cos(theta) * Math.sin(phi);
            const y = radius * Math.sin(theta) * Math.sin(phi);
            const z = radius * Math.cos(phi);
            
            sprite.position.set(x, y, z);
            sprite.scale.set(0.8, 1.0, 1); // 3:4 비율 (폭:높이 = 3:4)
            
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
            
            targetRotation.y += deltaX * 0.01;
            targetRotation.x += deltaY * 0.01;
            
            // X축 회전 제한
            targetRotation.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, targetRotation.x));
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
            
            targetRotation.y += deltaX * 0.01;
            targetRotation.x += deltaY * 0.01;
            
            targetRotation.x = Math.max(-Math.PI/3, Math.min(Math.PI/3, targetRotation.x));
            
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