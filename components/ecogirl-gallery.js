// 🌟 에코걸 3D 갤러리 모듈 - 완전 수정 버전
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

    // 🎲 랜덤 이미지 선택 (20개)
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

        // 컨테이너 크기 확인
        let width = container.clientWidth || 800;
        let height = container.clientHeight || 600;
        
        console.log(`📏 컨테이너 크기: ${width} x ${height}`);

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

    // 🖼️ 이미지 로드 및 3D 배치
    async loadImages() {
        console.log('📸 에코걸 이미지 로딩 시작...');
        
        await this.loadImageList();
        const selectedImages = this.getRandomImages(20);
        window.currentSelectedEcogirlImages = selectedImages;
        
        const loader = new THREE.TextureLoader();
        const radius = 3;
        
        for (let i = 0; i < selectedImages.length; i++) {
            const imageData = selectedImages[i];
            const imageUrl = this.getImageUrl(imageData);
            
            try {
                const texture = await this.loadTexture(loader, imageUrl);
                const material = new THREE.SpriteMaterial({ map: texture });
                const sprite = new THREE.Sprite(material);
                
                // 3D 구형 배치
                const phi = Math.acos(2 * Math.random() - 1);
                const theta = 2 * Math.PI * Math.random();
                
                sprite.position.x = radius * Math.sin(phi) * Math.cos(theta);
                sprite.position.y = radius * Math.sin(phi) * Math.sin(theta);
                sprite.position.z = radius * Math.cos(phi);
                
                sprite.scale.set(1, 1.4, 1);
                sprite.userData = { imageData: imageData, originalScale: { x: 1, y: 1.4, z: 1 } };
                
                this.scene.add(sprite);
                this.imageSprites.push(sprite);
                
                console.log(`✅ 에코걸 이미지 로드: ${imageData.filename}`);
            } catch (error) {
                console.error(`❌ 에코걸 이미지 로드 실패: ${imageUrl}`, error);
            }
        }
        
        console.log(`🎉 에코걸 3D 갤러리 ${this.imageSprites.length}개 이미지 배치 완료!`);
    }

    // 🖼️ 텍스처 로드 (Promise 기반)
    loadTexture(loader, url) {
        return new Promise((resolve, reject) => {
            loader.load(url, resolve, undefined, reject);
        });
    }

    // 🖱️ 마우스 이벤트 설정
    setupMouseEvents(canvas) {
        const handleStart = (clientX, clientY) => {
            this.isMouseDown = true;
            this.mouse.x = clientX;
            this.mouse.y = clientY;
            this.dragDistance = 0;
            this.mouseDownTime = Date.now();
        };

        const handleMove = (clientX, clientY) => {
            if (!this.isMouseDown) return;

            const deltaX = clientX - this.mouse.x;
            const deltaY = clientY - this.mouse.y;
            
            this.dragDistance += Math.abs(deltaX) + Math.abs(deltaY);
            
            this.targetRotation.y += deltaX * 0.01;
            this.targetRotation.x += deltaY * 0.01;
            
            this.mouse.x = clientX;
            this.mouse.y = clientY;
        };

        const handleEnd = (clientX, clientY) => {
            if (!this.isMouseDown) return;
            
            const clickDuration = Date.now() - this.mouseDownTime;
            
            if (this.dragDistance < 5 && clickDuration < 200) {
                this.handleClick(clientX, clientY, canvas);
            }
            
            this.isMouseDown = false;
        };

        // 마우스 이벤트
        canvas.addEventListener('mousedown', (e) => {
            e.preventDefault();
            handleStart(e.clientX, e.clientY);
        });

        canvas.addEventListener('mousemove', (e) => {
            handleMove(e.clientX, e.clientY);
        });

        canvas.addEventListener('mouseup', (e) => {
            handleEnd(e.clientX, e.clientY);
        });

        // 터치 이벤트
        canvas.addEventListener('touchstart', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            handleStart(touch.clientX, touch.clientY);
        });

        canvas.addEventListener('touchmove', (e) => {
            e.preventDefault();
            const touch = e.touches[0];
            handleMove(touch.clientX, touch.clientY);
        });

        canvas.addEventListener('touchend', (e) => {
            e.preventDefault();
            if (e.changedTouches.length > 0) {
                const touch = e.changedTouches[0];
                handleEnd(touch.clientX, touch.clientY);
            }
        });
    }

    // 🖱️ 클릭 감지 및 처리
    handleClick(clientX, clientY, canvas) {
        const rect = canvas.getBoundingClientRect();
        const mouse = new THREE.Vector2();
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;

        const raycaster = new THREE.Raycaster();
        raycaster.setFromCamera(mouse, this.camera);

        const intersects = raycaster.intersectObjects(this.imageSprites);
        
        if (intersects.length > 0) {
            const clickedSprite = intersects[0].object;
            const imageData = clickedSprite.userData.imageData;
            
            console.log(`🖱️ 에코걸 이미지 클릭:`, imageData);
            
            // 상세 페이지로 이동
            const url = `ecogirl-detail.html?id=${imageData.id}&filename=${encodeURIComponent(imageData.filename)}&title=${encodeURIComponent(imageData.title)}`;
            window.open(url, '_blank');
        }
    }

    // 🎬 애니메이션 루프
    animate() {
        requestAnimationFrame(() => this.animate());
        
        // 부드러운 회전
        this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.05;
        this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.05;
        
        // 자동 회전 (천천히)
        this.targetRotation.y += 0.001;
        
        // 씬 회전 적용
        this.scene.rotation.x = this.currentRotation.x;
        this.scene.rotation.y = this.currentRotation.y;
        
        this.renderer.render(this.scene, this.camera);
    }

    // 🔧 윈도우 리사이즈 처리
    onWindowResize(container) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        
        console.log(`📏 에코걸 갤러리 크기 조정: ${width} x ${height}`);
    }

    // 🗑️ 정리 메서드
    destroy() {
        if (this.renderer) {
            this.renderer.dispose();
        }
        
        this.imageSprites.forEach(sprite => {
            if (sprite.material.map) {
                sprite.material.map.dispose();
            }
            sprite.material.dispose();
        });
        
        const container = document.getElementById(this.containerId);
        if (container) {
            container.innerHTML = '';
        }
        
        this.isInitialized = false;
        console.log('🗑️ 에코걸 갤러리 정리 완료');
    }
}
