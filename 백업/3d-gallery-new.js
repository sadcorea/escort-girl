// 🌟 3D 갤러리 시스템 (완전히 새로운 버전)
let scene, camera, renderer;
let mouse = { x: 0, y: 0, prevX: 0, prevY: 0 };
let targetRotation = { x: 0, y: 0 };
let currentRotation = { x: 0, y: 0 };
let imageSprites = [];
let isMouseDown = false;
let dragDistance = 0;
let mouseDownTime = 0;
let availableImages = [];

// 🖼️ JSON에서 이미지 목록 가져오기
async function loadImageList() {
    try {
        const response = await fetch('data/images.json');
        const data = await response.json();
        availableImages = data.images;
        console.log(`📸 ${availableImages.length}개 이미지 로드됨`);
        return availableImages;
    } catch (error) {
        console.error('이미지 목록 로드 실패:', error);
        // 실패 시 기본 이미지 사용
        availableImages = [
            { id: 1, filename: '250524-15-10_00002_', title: 'Default Image' }
        ];
        return availableImages;
    }
}

// 🎲 랜덤 이미지 선택
function getRandomImages(count = 12) {
    if (availableImages.length === 0) {
        console.warn('이미지 목록이 비어있습니다.');
        return [];
    }
    
    const selectedImages = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * availableImages.length);
        selectedImages.push(availableImages[randomIndex]);
    }
    
    console.log(`🎲 ${count}개 랜덤 이미지 선택됨`);
    return selectedImages;
}

// 🖼️ 이미지 URL 생성
function getImageUrl(imageData) {
    return `images/profiles/${imageData.filename}.png`;
}

// 📋 이미지 URL 목록 생성
async function getImageUrls() {
    await loadImageList();
    const selectedImages = getRandomImages(12);
    window.currentSelectedImages = selectedImages;
    return selectedImages.map(imageData => getImageUrl(imageData));
}

// 🎮 3D 갤러리 초기화
async function init3DGallery() {
    const canvas = document.getElementById('gallery3D');
    if (!canvas) {
        console.error('gallery3D 캔버스를 찾을 수 없습니다.');
        return;
    }

    console.log('🚀 3D 갤러리 초기화 시작');

    // 씬 생성
    scene = new THREE.Scene();
    
    // 카메라 생성
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;

    // 렌더러 생성
    renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);

    // 이미지 로드 및 배치
    await loadImages();

    // 마우스 이벤트 설정
    setupMouseEvents(canvas);

    // 윈도우 리사이즈 이벤트
    window.addEventListener('resize', onWindowResize, false);

    // 애니메이션 시작
    animate();
    
    console.log('✅ 3D 갤러리 초기화 완료');
}

// 🖼️ 이미지 로드 및 3D 배치
async function loadImages() {
    console.log('🖼️ 이미지 로딩 시작');
    
    const imageUrls = await getImageUrls();
    const loader = new THREE.TextureLoader();
    const radius = 3;
    const imageCount = imageUrls.length;

    console.log(`📊 총 ${imageCount}개 이미지 로딩 중...`);

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
            
            // 원통형 배치
            const angle = (index / imageCount) * Math.PI * 2;
            const height = (index % 3 - 1) * 1.5;
            
            const x = radius * Math.cos(angle);
            const y = height;
            const z = radius * Math.sin(angle);
            
            sprite.position.set(x, y, z);
            
            // 원본 이미지 비율 유지
            const baseSize = 0.8;
            if (aspectRatio > 1) {
                sprite.scale.set(baseSize, baseSize / aspectRatio, 1);
            } else {
                sprite.scale.set(baseSize * aspectRatio, baseSize, 1);
            }
            
            // 항상 카메라를 향하도록 설정
            sprite.lookAt(camera.position);
            
            scene.add(sprite);
            imageSprites.push({
                sprite: sprite,
                originalPosition: { x, y, z }
            });
            
            console.log(`✅ 이미지 ${index + 1}/${imageCount} 로드 완료`);
        }, undefined, (error) => {
            console.error(`❌ 이미지 ${index + 1} 로드 실패:`, error);
        });
    });
}

// 🖱️ 마우스 이벤트 설정
function setupMouseEvents(canvas) {
    // 마우스 다운
    canvas.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        dragDistance = 0;
        mouseDownTime = Date.now();
        mouse.prevX = event.clientX;
        mouse.prevY = event.clientY;
        canvas.style.cursor = 'grabbing';
    });

    // 마우스 업
    canvas.addEventListener('mouseup', (event) => {
        const clickDuration = Date.now() - mouseDownTime;
        
        if (dragDistance < 10 && clickDuration < 300) {
            handleImageClick(event);
        }
        
        isMouseDown = false;
        canvas.style.cursor = 'grab';
    });

    // 마우스 벗어남
    canvas.addEventListener('mouseleave', () => {
        isMouseDown = false;
        canvas.style.cursor = 'grab';
    });

    // 마우스 이동 - 제안하신 방식으로 구현
    canvas.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            const deltaX = mouse.prevX - event.clientX;  // 제안하신 방식
            const deltaY = mouse.prevY - event.clientY;  // 제안하신 방식
            
            dragDistance += Math.abs(deltaX) + Math.abs(deltaY);
            
            const speed = 0.01;
            targetRotation.y += deltaX * speed;  // 제안하신 방식
            targetRotation.x += deltaY * speed;  // 제안하신 방식
            
            // 상하 회전 제한 완전 제거 (360도 회전)
            
            mouse.prevX = event.clientX;
            mouse.prevY = event.clientY;
        }
        
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    // 터치 이벤트
    canvas.addEventListener('touchstart', (event) => {
        isMouseDown = true;
        const touch = event.touches[0];
        mouse.prevX = touch.clientX;
        mouse.prevY = touch.clientY;
        event.preventDefault();
    });

    canvas.addEventListener('touchend', () => {
        isMouseDown = false;
    });

    canvas.addEventListener('touchmove', (event) => {
        if (isMouseDown && event.touches.length === 1) {
            const touch = event.touches[0];
            const deltaX = mouse.prevX - touch.clientX;
            const deltaY = mouse.prevY - touch.clientY;
            
            const speed = 0.01;
            targetRotation.y += deltaX * speed;
            targetRotation.x += deltaY * speed;
            
            mouse.prevX = touch.clientX;
            mouse.prevY = touch.clientY;
        }
        event.preventDefault();
    });
}

// 🎬 애니메이션 루프
function animate() {
    requestAnimationFrame(animate);

    // 부드러운 회전 보간
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;

    // 자동 회전 (마우스 조작이 없을 때)
    if (Math.abs(targetRotation.y - currentRotation.y) < 0.001) {
        targetRotation.y += 0.002;
    }

    // 스프라이트들 회전 적용
    imageSprites.forEach((item) => {
        const sprite = item.sprite;
        const originalPos = item.originalPosition;
        
        // Y축 회전 (좌우)
        const rotatedX = originalPos.x * Math.cos(currentRotation.y) - originalPos.z * Math.sin(currentRotation.y);
        const rotatedZ = originalPos.x * Math.sin(currentRotation.y) + originalPos.z * Math.cos(currentRotation.y);
        
        // X축 회전 (상하)
        const rotatedY = originalPos.y * Math.cos(currentRotation.x) - rotatedZ * Math.sin(currentRotation.x);
        const finalZ = originalPos.y * Math.sin(currentRotation.x) + rotatedZ * Math.cos(currentRotation.x);
        
        sprite.position.set(rotatedX, rotatedY, finalZ);
        
        // 거리에 따른 크기 조정
        const distance = sprite.position.distanceTo(camera.position);
        const scale = Math.max(0.3, 2 - distance * 0.3);
        
        // 현재 크기 유지하면서 거리 조정
        const currentScale = sprite.scale.clone();
        sprite.scale.multiplyScalar(scale);
    });

    renderer.render(scene, camera);
}

// 🖱️ 이미지 클릭 처리
function handleImageClick(event) {
    const rect = renderer.domElement.getBoundingClientRect();
    const mouse = new THREE.Vector2();
    
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouse, camera);
    
    const sprites = imageSprites.map(item => item.sprite);
    const intersects = raycaster.intersectObjects(sprites);
    
    if (intersects.length > 0) {
        const clickedSprite = intersects[0].object;
        const clickedIndex = imageSprites.findIndex(item => item.sprite === clickedSprite);
        
        if (clickedIndex >= 0 && window.currentSelectedImages && window.currentSelectedImages[clickedIndex]) {
            const imageData = window.currentSelectedImages[clickedIndex];
            console.log(`🖱️ 이미지 클릭됨:`, imageData);
            // 여기에 상세페이지 이동 로직 추가 가능
        }
    }
}

// 📱 윈도우 리사이즈 처리
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}

// 🚀 초기화 실행
document.addEventListener('DOMContentLoaded', function() {
    if (typeof THREE !== 'undefined') {
        console.log('🎮 Three.js 로드 확인됨');
        init3DGallery();
    } else {
        console.error('❌ Three.js 라이브러리를 로드할 수 없습니다.');
    }
});
