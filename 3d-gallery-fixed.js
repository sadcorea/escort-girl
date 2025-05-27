// 🌟 3D 갤러리 시스템 - 완전 수정 버전
let scene, camera, renderer;
let mouse = { x: 0, y: 0 };
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
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        availableImages = data.images;
        console.log(`✅ ${availableImages.length}개 이미지 JSON에서 로드 성공`);
        return availableImages;
    } catch (error) {
        console.error('❌ 이미지 JSON 로드 실패:', error);
        // 실패 시 기본 이미지 사용
        availableImages = [
            { id: 1, filename: '250524-15-10_00002_', title: 'Image 1' },
            { id: 2, filename: '250524-15-38_00003_', title: 'Image 2' },
            { id: 3, filename: '250524-16-13_00001_', title: 'Image 3' },
            { id: 4, filename: '250524-16-13_00008_', title: 'Image 4' },
            { id: 5, filename: '250524-16-37_00001_', title: 'Image 5' },
            { id: 6, filename: '250524-17-33_00005_', title: 'Image 6' },
            { id: 7, filename: '250524-18-19_00006_', title: 'Image 7' },
            { id: 8, filename: '250524-18-30_00013_', title: 'Image 8' },
            { id: 9, filename: '250524-19-41_00002_', title: 'Image 9' },
            { id: 10, filename: '250524-19-55_00004_', title: 'Image 10' }
        ];
        console.log(`🔄 기본 이미지 ${availableImages.length}개 사용`);
        return availableImages;
    }
}

// 🎲 진짜 랜덤 이미지 선택 (셔플 알고리즘 사용)
function getRandomImages(count = 12) {
    console.log(`🎲 ${availableImages.length}개 중에서 ${count}개 랜덤 선택 시작`);
    
    if (availableImages.length === 0) {
        console.warn('⚠️ 이미지 목록이 비어있습니다.');
        return [];
    }
    
    const selected = [];
    for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * availableImages.length);
        const selectedImage = availableImages[randomIndex];
        selected.push(selectedImage);
        console.log(`   ${i+1}. ${selectedImage.filename} 선택됨`);
    }
    
    console.log(`✅ 총 ${selected.length}개 랜덤 이미지 선택 완료`);
    return selected;
}

// 🖼️ 이미지 URL 생성
function getImageUrl(imageData) {
    return `images/profiles/${imageData.filename}.png`;
}

// 🎮 3D 갤러리 초기화
async function init3DGallery() {
    console.log('🚀 3D 갤러리 초기화 시작...');
    
    const canvas = document.getElementById('gallery3D');
    if (!canvas) {
        console.error('❌ gallery3D 캔버스를 찾을 수 없습니다.');
        return;
    }

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
    
    console.log('✅ 3D 갤러리 초기화 완료!');
}

// 🖼️ 이미지 로드 및 3D 배치
async function loadImages() {
    console.log('📸 이미지 로딩 프로세스 시작...');
    
    // JSON에서 이미지 목록 로드
    await loadImageList();
    
    // 랜덤 이미지 선택
    const selectedImages = getRandomImages(12);
    
    // 전역 변수에 저장 (클릭용)
    window.currentSelectedImages = selectedImages;
    
    const loader = new THREE.TextureLoader();
    const radius = 3;
    let loadedCount = 0;

    console.log(`🔄 ${selectedImages.length}개 이미지 텍스처 로딩 중...`);

    selectedImages.forEach((imageData, index) => {
        const imageUrl = getImageUrl(imageData);
        console.log(`   로딩 중: ${imageUrl}`);
        
        loader.load(imageUrl, 
            // 성공
            (texture) => {
                console.log(`✅ ${imageData.filename} 로드 성공`);
                
                const img = texture.image;
                const aspectRatio = img.width / img.height;
                
                const spriteMaterial = new THREE.SpriteMaterial({ 
                    map: texture,
                    transparent: false,  // 투명도 제거
                    opacity: 1.0        // 완전 불투명
                });
                
                const sprite = new THREE.Sprite(spriteMaterial);
                
                // 원통형 배치
                const angle = (index / selectedImages.length) * Math.PI * 2;
                const height = (index % 3 - 1) * 1.5;
                
                const x = radius * Math.cos(angle);
                const y = height;
                const z = radius * Math.sin(angle);
                
                sprite.position.set(x, y, z);
                
                // 🎯 큰 갤러리 고정 크기
                const fixedWidth = 2.0;   // 큰 갤러리 가로 크기
                const fixedHeight = 2.7;  // 큰 갤러리 세로 크기
                sprite.scale.set(fixedWidth, fixedHeight, 1);  // 모든 이미지 동일 크기
                
                sprite.lookAt(camera.position);
                
                scene.add(sprite);
                imageSprites.push({
                    sprite: sprite,
                    originalPosition: { x, y, z },
                    imageData: imageData
                });
                
                loadedCount++;
                console.log(`📊 진행률: ${loadedCount}/${selectedImages.length}`);
            },
            // 진행
            undefined,
            // 에러
            (error) => {
                console.error(`❌ ${imageData.filename} 로드 실패:`, error);
                loadedCount++;
            }
        );
    });
}

// 🖱️ 마우스 이벤트 설정 - 완전 수정
function setupMouseEvents(canvas) {
    console.log('🖱️ 마우스 이벤트 설정 중...');
    
    canvas.addEventListener('mousedown', (event) => {
        isMouseDown = true;
        dragDistance = 0;
        mouseDownTime = Date.now();
        mouse.x = event.clientX;
        mouse.y = event.clientY;
        canvas.style.cursor = 'grabbing';
    });

    canvas.addEventListener('mouseup', (event) => {
        const clickDuration = Date.now() - mouseDownTime;
        
        // 클릭 감지 (드래그가 아닌 경우에만)
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

    // 🔥 완전 수정된 마우스 무브 이벤트
    canvas.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            const deltaX = event.clientX - mouse.x;
            const deltaY = event.clientY - mouse.y;
            
            dragDistance += Math.abs(deltaX) + Math.abs(deltaY);
            
            // 🎯 좌우: 마우스 반대 방향 (- 사용)
            // 🎯 상하: 마우스 방향 그대로 (+ 사용)
            const speed = 0.01;
            targetRotation.y -= deltaX * speed;  // 좌우 반대방향 (수정됨)
            targetRotation.x += deltaY * speed;  // 상하 정방향 (유지)
            
            // 🌀 상하 무한 회전 허용 (제한 완전 제거)
            // targetRotation.x에 제한을 걸지 않음
        }
        
        mouse.x = event.clientX;
        mouse.y = event.clientY;
    });

    // 터치 이벤트
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
            
            const speed = 0.01;
            targetRotation.y -= deltaX * speed;  // 좌우 반대방향 (수정됨)
            targetRotation.x += deltaY * speed;  // 상하 정방향 (유지)
            
            mouse.x = touch.clientX;
            mouse.y = touch.clientY;
        }
        event.preventDefault();
    });
    
    console.log('✅ 마우스 이벤트 설정 완료');
}

// 🎬 애니메이션 루프 - 무한 회전 보장
function animate() {
    requestAnimationFrame(animate);

    // 부드러운 회전 보간
    currentRotation.x += (targetRotation.x - currentRotation.x) * 0.05;
    currentRotation.y += (targetRotation.y - currentRotation.y) * 0.05;

    // 자동 회전 (마우스 조작이 없을 때)
    if (Math.abs(targetRotation.y - currentRotation.y) < 0.001) {
        targetRotation.y += 0.002;
    }

    // 🌀 스프라이트들 회전 적용 (무한 회전 보장)
    imageSprites.forEach((item) => {
        const sprite = item.sprite;
        const originalPos = item.originalPosition;
        
        // Y축 회전 (좌우) - 무한 회전
        const rotatedX = originalPos.x * Math.cos(currentRotation.y) - originalPos.z * Math.sin(currentRotation.y);
        const rotatedZ = originalPos.x * Math.sin(currentRotation.y) + originalPos.z * Math.cos(currentRotation.y);
        
        // X축 회전 (상하) - 무한 회전 (제한 없음)
        const rotatedY = originalPos.y * Math.cos(currentRotation.x) - rotatedZ * Math.sin(currentRotation.x);
        const finalZ = originalPos.y * Math.sin(currentRotation.x) + rotatedZ * Math.cos(currentRotation.x);
        
        sprite.position.set(rotatedX, rotatedY, finalZ);
        
        // 🎯 큰 갤러리 고정 크기 유지 (거리에 따른 약간의 원근감만)
        const distance = sprite.position.distanceTo(camera.position);
        const perspectiveScale = Math.max(0.8, 1.2 - distance * 0.05);  // 약간의 원근감만
        
        // 큰 갤러리 고정 크기 기반으로 원근감 적용
        const fixedWidth = 2.0;
        const fixedHeight = 2.7;
        sprite.scale.set(fixedWidth * perspectiveScale, fixedHeight * perspectiveScale, 1);
    });

    renderer.render(scene, camera);
}

// 🖱️ 정확한 이미지 클릭 처리 (배경 클릭 방지)
function handleImageClick(event) {
    console.log('🖱️ 클릭 감지, 레이캐스팅 시작...');
    
    const rect = renderer.domElement.getBoundingClientRect();
    const mouseVector = new THREE.Vector2();
    
    mouseVector.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouseVector.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(mouseVector, camera);
    
    // 스프라이트들만 대상으로 레이캐스팅
    const sprites = imageSprites.map(item => item.sprite);
    const intersects = raycaster.intersectObjects(sprites);
    
    if (intersects.length > 0) {
        const clickedSprite = intersects[0].object;
        const clickedItem = imageSprites.find(item => item.sprite === clickedSprite);
        
        if (clickedItem && clickedItem.imageData) {
            console.log(`✅ 이미지 클릭됨:`, clickedItem.imageData);
            
            // 상세페이지로 이동 (팝업 대신)
            const imageId = clickedItem.imageData.id;
            window.location.href = `ecogirl-detail.html?id=${imageId}`;
            
            // 만약 상세페이지가 없다면 임시로 팝업 (개발용)
            // alert(`이미지 클릭됨: ${clickedItem.imageData.title || clickedItem.imageData.filename}`);
        } else {
            console.log('⚠️ 클릭된 스프라이트의 데이터를 찾을 수 없음');
        }
    } else {
        console.log('📍 배경 클릭됨 - 아무 동작 안함');
        // 배경 클릭시 아무것도 하지 않음
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
    console.log('🌟 DOM 로드 완료, 3D 갤러리 시작...');
    
    if (typeof THREE !== 'undefined') {
        console.log('✅ Three.js 로드 확인됨');
        init3DGallery();
    } else {
        console.error('❌ Three.js 라이브러리를 로드할 수 없습니다.');
    }
});
