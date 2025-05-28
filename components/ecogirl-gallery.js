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
        
        // 🎯 3단 원기둥 좌표 (21개 위치) - 7.7.7 구성
        this.fixedPositions = [
            // 위층 (y=2) - 7개
            { x: 3, y: 2, z: 0 },
            { x: 2.1, y: 2, z: 2.1 },
            { x: 0, y: 2, z: 3 },
            { x: -2.1, y: 2, z: 2.1 },
            { x: -3, y: 2, z: 0 },
            { x: -2.1, y: 2, z: -2.1 },
            { x: 0, y: 2, z: -3 },
            
            // 중층 (y=0) - 7개
            { x: 3, y: 0, z: 0 },
            { x: 2.1, y: 0, z: 2.1 },
            { x: 0, y: 0, z: 3 },
            { x: -2.1, y: 0, z: 2.1 },
            { x: -3, y: 0, z: 0 },
            { x: -2.1, y: 0, z: -2.1 },
            { x: 0, y: 0, z: -3 },
            
            // 아래층 (y=-2) - 7개
            { x: 3, y: -2, z: 0 },
            { x: 2.1, y: -2, z: 2.1 },
            { x: 0, y: -2, z: 3 },
            { x: -2.1, y: -2, z: 2.1 },
            { x: -3, y: -2, z: 0 },
            { x: -2.1, y: -2, z: -2.1 },
            { x: 0, y: -2, z: -3 }
        ];
    }

    // 📁 폴더에서 이미지 파일 스캔
    async scanImagesFolder() {
        try {
            console.log('📁 에코걸 이미지 폴더 스캔 시작...');
            
            // 폴더의 모든 이미지 파일 감지 (실제로는 알려진 파일들 사용)
            const imageFiles = [
                '250524-14-52_00005_.png',
                '250524-15-02_00001_.png', 
                '250524-15-10_00002_.png',
                '250524-15-10_00005_.png',
                '250524-15-38_00003_.png',
                '250524-15-38_00007_.png',
                '250524-16-04_00002_.png',
                '250524-16-04_00004_.png',
                '250524-16-13_00001_.png',
                '250524-16-13_00003_.png',
                '250524-16-13_00008_.png',
                '250524-16-27_00001_.png',
                '250524-16-28_00004_.png',
                '250524-16-37_00001_.png',
                '250524-16-37_00002_.png',
                '250524-16-37_00006_.png',
                '250524-16-37_00007_.png',
                '250524-16-58_00005_.png',
                '250524-16-58_00006_.png',
                '250524-17-08_00008_.png',
                '250524-17-27_00001_.png',
                '250524-17-27_00002_.png',
                '250524-17-33_00005_.png',
                '250524-18-19_00006_.png',
                '250524-18-30_00013_.png',
                '250524-19-00_00007_.png',
                '250524-19-13_00002_.png',
                '250524-19-13_00003_.png',
                '250524-19-18_00004_.png',
                '250524-19-28_00003_.png',
                '250524-19-28_00006_.png',
                '250524-19-41_00002_.png',
                '250524-19-41_00004_.png',
                '250524-19-55_00004_.png',
                '250524-19-55_00005_.png',
                '250524-19-55_00008_.png',
                '250527-00-59_00002_.png',
                '250527-02-07_00005_.png',
                '250527-02-14_00003_.png',
                '250527-02-14_00006_.png'
            ];
            
            // 파일명을 이미지 객체로 변환
            this.availableImages = imageFiles.map((filename, index) => ({
                id: index + 1,
                filename: filename.replace('.png', ''),
                title: `EcoGirl ${index + 1}`,
                fullPath: `images/profiles/${filename}`
            }));
            
            console.log(`✅ 에코걸 폴더에서 ${this.availableImages.length}개 이미지 스캔 완료`);
            return this.availableImages;
            
        } catch (error) {
            console.error('❌ 에코걸 이미지 폴더 스캔 실패:', error);
            
            // 실패 시 기본 이미지 사용
            this.availableImages = [
                { id: 1, filename: '250524-15-10_00002_', title: 'EcoGirl 1', fullPath: 'images/profiles/250524-15-10_00002_.png' },
                { id: 2, filename: '250524-15-38_00003_', title: 'EcoGirl 2', fullPath: 'images/profiles/250524-15-38_00003_.png' },
                { id: 3, filename: '250524-16-13_00001_', title: 'EcoGirl 3', fullPath: 'images/profiles/250524-16-13_00001_.png' },
                { id: 4, filename: '250524-16-13_00008_', title: 'EcoGirl 4', fullPath: 'images/profiles/250524-16-13_00008_.png' },
                { id: 5, filename: '250524-16-37_00001_', title: 'EcoGirl 5', fullPath: 'images/profiles/250524-16-37_00001_.png' }
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
        return imageData.fullPath || `images/profiles/${imageData.filename}.png`;
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
        this.camera.position.z = 7;

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
        
        await this.scanImagesFolder();
        const selectedImages = this.getRandomImages(21);
        window.currentSelectedEcogirlImages = selectedImages;
        
        const loader = new THREE.TextureLoader();
        
        // 🚀 로딩 최적화: 병렬 처리
        const loadPromises = selectedImages.map(async (imageData, i) => {
            const imageUrl = this.getImageUrl(imageData);
            
            try {
                const texture = await this.loadTexture(loader, imageUrl);
                const material = new THREE.SpriteMaterial({ map: texture });
                const sprite = new THREE.Sprite(material);
                
                // 고정 좌표 배치
                const position = this.fixedPositions[i] || { x: 0, y: 0, z: 3 };
                sprite.position.x = position.x;
                sprite.position.y = position.y;
                sprite.position.z = position.z;
                
                sprite.scale.set(1.2, 1.6, 1);
                sprite.userData = { imageData: imageData, originalScale: { x: 1.2, y: 1.6, z: 1 } };
                
                this.scene.add(sprite);
                this.imageSprites.push(sprite);
                
                console.log(`✅ 에코걸 이미지 로드: ${imageData.filename}`);
                return sprite;
            } catch (error) {
                console.error(`❌ 에코걸 이미지 로드 실패: ${imageUrl}`, error);
                return null;
            }
        });
        
        // 모든 이미지 로딩 완료 대기
        await Promise.all(loadPromises);
        
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
        
        // 자동 회전 (드래그 중이 아닐 때만)
        if (!this.isMouseDown) {
            this.targetRotation.y += 0.001;
        }
        
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
