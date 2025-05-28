// 🌟 에코걸 3D 갤러리 모듈
class EcogirlGallery {
    constructor(containerId) {
        this.containerId = containerId;
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.imageSprites = [];
        this.mouse = { x: 0, y: 0 };
        this.targetRotation = { x: 0, y: 0 };
        this.currentRotation = { x: 0, y: 0 };
        this.isMouseDown = false;
        this.dragDistance = 0;
        this.mouseDownTime = 0;
        this.availableImages = [];
        this.isInitialized = false;
    }

    // 🖼️ JSON에서 이미지 목록 가져오기
    async loadImageList() {
        try {
            const response = await fetch('data/images.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            this.availableImages = data.images;
            console.log(`✅ 에코걸 ${this.availableImages.length}개 이미지 로드 성공`);
            return this.availableImages;
        } catch (error) {
            console.error('❌ 에코걸 이미지 JSON 로드 실패:', error);
            // 실패 시 기본 이미지 사용
            this.availableImages = [
                { id: 1, filename: '250524-15-10_00002_', title: 'EcoGirl 1' },
                { id: 2, filename: '250524-15-38_00003_', title: 'EcoGirl 2' },
                { id: 3, filename: '250524-16-13_00001_', title: 'EcoGirl 3' },
                { id: 4, filename: '250524-16-13_00008_', title: 'EcoGirl 4' },
                { id: 5, filename: '250524-16-37_00001_', title: 'EcoGirl 5' },
                { id: 6, filename: '250524-17-33_00005_', title: 'EcoGirl 6' },
                { id: 7, filename: '250524-18-19_00006_', title: 'EcoGirl 7' },
                { id: 8, filename: '250524-18-30_00013_', title: 'EcoGirl 8' },
                { id: 9, filename: '250524-19-41_00002_', title: 'EcoGirl 9' },
                { id: 10, filename: '250524-19-55_00004_', title: 'EcoGirl 10' }
            ];
            console.log(`🔄 에코걸 기본 이미지 ${this.availableImages.length}개 사용`);
            return this.availableImages;
        }
    }

    // 🎲 랜덤 이미지 선택
    getRandomImages(count = 20) {
        console.log(`🎲 에코걸 ${this.availableImages.length}개 중에서 ${count}개 랜덤 선택`);
        
        if (this.availableImages.length === 0) {
            console.warn('⚠️ 에코걸 이미지 목록이 비어있습니다.');
            return [];
        }
        
        const selected = [];
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * this.availableImages.length);
            const selectedImage = this.availableImages[randomIndex];
            selected.push(selectedImage);
        }
        
        console.log(`✅ 에코걸 ${selected.length}개 랜덤 이미지 선택 완료`);
        return selected;
    }

    // 🖼️ 이미지 URL 생성
    getImageUrl(imageData) {
        return `images/profiles/${imageData.filename}.png`;
    }

    // 🎮 3D 갤러리 초기화
    async init() {
        if (this.isInitialized) {
            console.log('⚠️ 에코걸 갤러리 이미 초기화됨');
            return;
        }

        console.log('🚀 에코걸 3D 갤러리 초기화 시작...');
        
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`❌ ${this.containerId} 컨테이너를 찾을 수 없습니다.`);
            return;
        }

        // 컨테이너 크기 확인 및 강제 설정
        console.log(`📏 컨테이너 크기: ${container.clientWidth} x ${container.clientHeight}`);
        
        let width = container.clientWidth || 800;
        let height = container.clientHeight || 600;
        
        if (width === 0 || height === 0) {
            console.warn('⚠️ 컨테이너 크기가 0입니다. 기본값 사용');
            width = 800;
            height = 600;
            container.style.width = width + 'px';
            container.style.height = height + 'px';
        }

        // 캔버스 생성
        const canvas = document.createElement('canvas');
        canvas.id = 'ecogirlGallery3D';
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        canvas.style.display = 'block';
        container.appendChild(canvas);

        // 씬 생성
        this.scene = new THREE.Scene();
        
        // 카메라 생성
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = 5;

        // 렌더러 생성
        this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x000000, 0);

        console.log(`🎬 렌더러 크기 설정: ${width} x ${height}`);

        // 이미지 로드 및 배치
        await this.loadImages();

        // 마우스 이벤트 설정
        this.setupMouseEvents(canvas);

        // 윈도우 리사이즈 이벤트
        window.addEventListener('resize', () => this.onWindowResize(container), false);

        // 애니메이션 시작
        this.animate();
        
        this.isInitialized = true;
        console.log('✅ 에코걸 3D 갤러리 초기화 완료!');
    }

    // 🎲 랜덤 이미지 선택
    getRandomImages(count = 20) {
        
        await this.loadImageList();
        const selectedImages = this.getRandomImages(20);
        window.currentSelectedEcogirlImages = selectedImages;
        
        const loader = new THREE.TextureLoader();
        const radius = 3;
        let loadedCount = 0;

        selectedImages.forEach((imageData, index) => {
            const imageUrl = this.getImageUrl(imageData);
            
            loader.load(imageUrl, 
                (texture) => {
                    console.log(`✅ 에코걸 ${imageData.filename} 로드 성공`);
                    
                    const spriteMaterial = new THREE.SpriteMaterial({ 
                        map: texture,
                        transparent: false,
                        opacity: 1.0
                    });
                    
                    const sprite = new THREE.Sprite(spriteMaterial);
                    
                    // 원통형 배치
                    const angle = (index / selectedImages.length) * Math.PI * 2;
                    const height = (index % 3 - 1) * 1.5;
                    
                    const x = radius * Math.cos(angle);
                    const y = height;
                    const z = radius * Math.sin(angle);
                    
                    sprite.position.set(x, y, z);
                    
                    // 고정 크기
                    const fixedWidth = 1.2;
                    const fixedHeight = 1.7;
                    sprite.scale.set(fixedWidth, fixedHeight, 1);
                    
                    sprite.lookAt(this.camera.position);
                    
                    this.scene.add(sprite);
                    this.imageSprites.push({
                        sprite: sprite,
                        originalPosition: { x, y, z },
                        imageData: imageData
                    });
                    
                    loadedCount++;
                    console.log(`📊 에코걸 진행률: ${loadedCount}/${selectedImages.length}`);
                },
                undefined,
                (error) => {
                    console.error(`❌ 에코걸 ${imageData.filename} 로드 실패:`, error);
                    loadedCount++;
                }
            );
        });
    }

    // 🖱️📱 마우스 및 터치 이벤트 설정
    setupMouseEvents(canvas) {
        // 마우스 이벤트
        canvas.addEventListener('mousedown', (event) => {
            this.handlePointerDown(event.clientX, event.clientY);
            canvas.style.cursor = 'grabbing';
        });

        canvas.addEventListener('mouseup', (event) => {
            this.handlePointerUp(event.clientX, event.clientY, event);
            canvas.style.cursor = 'grab';
        });

        canvas.addEventListener('mouseleave', () => {
            this.isMouseDown = false;
            canvas.style.cursor = 'grab';
        });

        canvas.addEventListener('mousemove', (event) => {
            if (this.isMouseDown) {
                this.handlePointerMove(event.clientX, event.clientY);
            }
        });

        // 터치 이벤트 (모바일)
        canvas.addEventListener('touchstart', (event) => {
            event.preventDefault();
            const touch = event.touches[0];
            this.handlePointerDown(touch.clientX, touch.clientY);
        });

        canvas.addEventListener('touchend', (event) => {
            event.preventDefault();
            if (event.changedTouches.length > 0) {
                const touch = event.changedTouches[0];
                this.handlePointerUp(touch.clientX, touch.clientY, event);
            }
        });

        canvas.addEventListener('touchmove', (event) => {
            event.preventDefault();
            if (this.isMouseDown && event.touches.length > 0) {
                const touch = event.touches[0];
                this.handlePointerMove(touch.clientX, touch.clientY);
            }
        });
    }

    // 🖱️ 포인터 다운 (마우스/터치 공통)
    handlePointerDown(x, y) {
        this.isMouseDown = true;
        this.dragDistance = 0;
        this.mouseDownTime = Date.now();
        this.mouse.x = x;
        this.mouse.y = y;
    }

    // 🖱️ 포인터 업 (마우스/터치 공통)
    handlePointerUp(x, y, event) {
        const clickDuration = Date.now() - this.mouseDownTime;
        
        if (this.dragDistance < 10 && clickDuration < 300) {
            this.handleImageClick(event);
        }
        
        this.isMouseDown = false;
    }

    // 🖱️ 포인터 이동 (마우스/터치 공통)
    handlePointerMove(x, y) {
        const deltaX = x - this.mouse.x;
        const deltaY = y - this.mouse.y;
                
        this.dragDistance += Math.abs(deltaX) + Math.abs(deltaY);
        
        const speed = 0.01;
        this.targetRotation.y -= deltaX * speed;
        this.targetRotation.x += deltaY * speed;
        
        this.mouse.x = x;
        this.mouse.y = y;
    }

        canvas.addEventListener('touchend', () => {
            this.isMouseDown = false;
        });

        canvas.addEventListener('touchmove', (event) => {
            if (this.isMouseDown && event.touches.length === 1) {
                const touch = event.touches[0];
                const deltaX = touch.clientX - this.mouse.x;
    }

    // 🎬 애니메이션 루프
    animate() {
        requestAnimationFrame(() => this.animate());

        this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.05;
        this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.05;

        if (Math.abs(this.targetRotation.y - this.currentRotation.y) < 0.001) {
            this.targetRotation.y += 0.002;
        }

        this.imageSprites.forEach((item) => {
            const sprite = item.sprite;
            const originalPos = item.originalPosition;
            
            const rotatedX = originalPos.x * Math.cos(this.currentRotation.y) - originalPos.z * Math.sin(this.currentRotation.y);
            const rotatedZ = originalPos.x * Math.sin(this.currentRotation.y) + originalPos.z * Math.cos(this.currentRotation.y);
            const rotatedY = originalPos.y * Math.cos(this.currentRotation.x) - rotatedZ * Math.sin(this.currentRotation.x);
            const finalZ = originalPos.y * Math.sin(this.currentRotation.x) + rotatedZ * Math.cos(this.currentRotation.x);
            
            sprite.position.set(rotatedX, rotatedY, finalZ);
            
            const distance = sprite.position.distanceTo(this.camera.position);
            const perspectiveScale = Math.max(0.8, 1.2 - distance * 0.05);
            
            const fixedWidth = 1.2;
            const fixedHeight = 1.7;
            sprite.scale.set(fixedWidth * perspectiveScale, fixedHeight * perspectiveScale, 1);
        });

        this.renderer.render(this.scene, this.camera);
    }

    // 🖱️ 이미지 클릭 처리
    handleImageClick(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        const mouseVector = new THREE.Vector2();
        
        mouseVector.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
        mouseVector.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        
        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouseVector, this.camera);
        
        const sprites = this.imageSprites.map(item => item.sprite);
        const intersects = raycaster.intersectObjects(sprites);
        
        if (intersects.length > 0) {
            const clickedSprite = intersects[0].object;
            const clickedItem = this.imageSprites.find(item => item.sprite === clickedSprite);
            
            if (clickedItem && clickedItem.imageData) {
                console.log(`✅ 에코걸 이미지 클릭됨:`, clickedItem.imageData);
                const imageId = clickedItem.imageData.id;
                window.location.href = `ecogirl-detail.html?id=${imageId}`;
            }
        }
    }

    // 📱 윈도우 리사이즈 처리
    onWindowResize(container) {
        const width = container.clientWidth || 800;
        const height = container.clientHeight || 600;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    }

    // 🗑️ 갤러리 정리
    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        this.imageSprites.forEach(item => {
            this.scene.remove(item.sprite);
        });
        this.imageSprites = [];
        this.isInitialized = false;
        console.log('🗑️ 에코걸 갤러리 정리 완료');
    }
}

// 전역으로 내보내기
window.EcogirlGallery = EcogirlGallery;
