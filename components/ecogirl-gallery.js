// 🌟 에코걸 3D 갤러리 모듈 - 간단 버전
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
        
        // 🎯 3단 원기둥 좌표 (24개)
        this.fixedPositions = [
            // 위층 (y=2) - 8개
            { x: 3, y: 2, z: 0 },
            { x: 2.1, y: 2, z: 2.1 },
            { x: 0, y: 2, z: 3 },
            { x: -2.1, y: 2, z: 2.1 },
            { x: -3, y: 2, z: 0 },
            { x: -2.1, y: 2, z: -2.1 },
            { x: 0, y: 2, z: -3 },
            { x: 2.1, y: 2, z: -2.1 },
            
            // 중층 (y=0) - 8개
            { x: 3, y: 0, z: 0 },
            { x: 2.1, y: 0, z: 2.1 },
            { x: 0, y: 0, z: 3 },
            { x: -2.1, y: 0, z: 2.1 },
            { x: -3, y: 0, z: 0 },
            { x: -2.1, y: 0, z: -2.1 },
            { x: 0, y: 0, z: -3 },
            { x: 2.1, y: 0, z: -2.1 },
            
            // 아래층 (y=-2) - 8개
            { x: 3, y: -2, z: 0 },
            { x: 2.1, y: -2, z: 2.1 },
            { x: 0, y: -2, z: 3 },
            { x: -2.1, y: -2, z: 2.1 },
            { x: -3, y: -2, z: 0 },
            { x: -2.1, y: -2, z: -2.1 },
            { x: 0, y: -2, z: -3 },
            { x: 2.1, y: -2, z: -2.1 }
        ];
    }

    // 이미지 목록 생성
    async scanImagesFolder() {
        try {
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
            
            this.availableImages = imageFiles.map((filename, index) => ({
                id: index + 1,
                filename: filename.replace('.png', ''),
                title: `EcoGirl ${index + 1}`,
                fullPath: `images/profiles/${filename}`
            }));
            
            console.log(`✅ 에코걸 ${this.availableImages.length}개 이미지 스캔 완료`);
            return this.availableImages;
        } catch (error) {
            console.error('❌ 이미지 스캔 실패:', error);
            return [];
        }
    }

    // 랜덤 이미지 선택
    getRandomImages(count = 24) {
        const selected = [];
        for (let i = 0; i < count; i++) {
            const randomIndex = Math.floor(Math.random() * this.availableImages.length);
            selected.push(this.availableImages[randomIndex]);
        }
        return selected;
    }

    // 이미지 URL 생성
    getImageUrl(imageData) {
        return imageData.fullPath || `images/profiles/${imageData.filename}.png`;
    }

    // 초기화
    async init() {
        if (this.isInitialized) return;

        console.log('🚀 에코걸 3D 갤러리 초기화 시작...');
        
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error(`❌ 컨테이너 ${this.containerId} 없음`);
            return;
        }

        let width = container.clientWidth || 800;
        let height = container.clientHeight || 600;

        // 캔버스 생성
        const canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        canvas.style.height = '100%';
        container.appendChild(canvas);

        // 3D 씬 설정
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        this.camera.position.z = 6.5;
        this.renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
        this.renderer.setSize(width, height);
        this.renderer.setClearColor(0x000000, 0);

        // 이미지 로드
        await this.loadImages();
        
        // 마우스 이벤트
        this.setupMouseEvents(canvas);
        
        // 애니메이션 시작
        this.animate();
        
        this.isInitialized = true;
        console.log('✅ 에코걸 갤러리 초기화 완료!');
    }

    // 이미지 로드
    async loadImages() {
        await this.scanImagesFolder();
        const selectedImages = this.getRandomImages(24);
        
        const loader = new THREE.TextureLoader();
        
        for (let i = 0; i < selectedImages.length; i++) {
            const imageData = selectedImages[i];
            const imageUrl = this.getImageUrl(imageData);
            
            try {
                const texture = await this.loadTexture(loader, imageUrl);
                const material = new THREE.SpriteMaterial({ map: texture });
                const sprite = new THREE.Sprite(material);
                
                const position = this.fixedPositions[i] || { x: 0, y: 0, z: 3 };
                sprite.position.set(position.x, position.y, position.z);
             // 가운데 기준 거리 계산
                const center = new THREE.Vector3(0, 0, 0);
                const dist = sprite.position.distanceTo(center);
                const maxDistance = 5; 
                const maxScale = 2.5;  // 1.8 → 2.5
                const minScale = 1.0;  // 0.6 → 1.0

             // 거리 기반 크기 조절
                const scale = Math.max(minScale, maxScale - (dist / maxDistance) * (maxScale - minScale));
                sprite.scale.set(scale, scale * 1.3, 1);

                sprite.userData = { imageData: imageData };
                
                this.scene.add(sprite);
                this.imageSprites.push(sprite);
                
                console.log(`✅ 이미지 로드: ${imageData.filename}`);
            } catch (error) {
                console.error(`❌ 이미지 로드 실패: ${imageUrl}`, error);
            }
        }
        
        console.log(`🎉 ${this.imageSprites.length}개 이미지 배치 완료!`);
    }

    // 텍스처 로드
    loadTexture(loader, url) {
        return new Promise((resolve, reject) => {
            loader.load(url, resolve, undefined, reject);
        });
    }

    // 마우스 이벤트
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

    // 클릭 처리
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
            
            console.log(`🖱️ 이미지 클릭:`, imageData);
            
            const url = `ecogirl-detail.html?id=${imageData.id}&filename=${encodeURIComponent(imageData.filename)}&title=${encodeURIComponent(imageData.title)}`;
            window.open(url, '_blank');
        }
    }

    // 애니메이션
    animate() {
        requestAnimationFrame(() => this.animate());
        
        this.currentRotation.x += (this.targetRotation.x - this.currentRotation.x) * 0.05;
        this.currentRotation.y += (this.targetRotation.y - this.currentRotation.y) * 0.05;
        
        // 드래그 중이 아닐 때만 자동 회전
        if (!this.isMouseDown) {
            this.targetRotation.y += 0.001;
        }
        
        this.scene.rotation.x = this.currentRotation.x;
        this.scene.rotation.y = this.currentRotation.y;
        
        this.renderer.render(this.scene, this.camera);
    }

    // 정리
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
