// 🎤 가라오케 섹션 모듈
class KaraokeSection {
    constructor(containerId) {
        this.containerId = containerId;
        this.container = null;
        this.karaokeAds = [];
        this.karaokeLocations = [];
        this.map = null;
        this.markers = [];
        this.isInitialized = false;
    }

    // 📄 데이터 로드
    async loadData() {
        try {
            console.log('🎤 가라오케 데이터 로딩...');
            
            // 광고 데이터 로드
            const adsResponse = await fetch('data/karaoke-ads.json');
            const adsData = await adsResponse.json();
            this.karaokeAds = adsData.ads;
            
            // 위치 데이터 로드
            const locationsResponse = await fetch('data/karaoke-locations.json');
            const locationsData = await locationsResponse.json();
            this.karaokeLocations = locationsData.locations;
            
            console.log(`✅ 가라오케 광고 ${this.karaokeAds.length}개, 위치 ${this.karaokeLocations.length}개 로드 완료`);
            return true;
        } catch (error) {
            console.error('❌ 가라오케 데이터 로드 실패:', error);
            return false;
        }
    }

    // 🎨 HTML 렌더링
    renderHTML() {
        const container = document.getElementById(this.containerId);
        if (!container) {
            console.error('❌ 가라오케 컨테이너를 찾을 수 없습니다:', this.containerId);
            return;
        }

        container.innerHTML = `
            <div class="karaoke-section">
                <div class="section-header">
                    <h2>🎤 다낭 가라오케</h2>
                    <p>검증된 가라오케에서 최고의 밤문화를 경험하세요</p>
                </div>
                
                <div class="karaoke-content">
                    <!-- 왼쪽: 광고 영역 (30%) -->
                    <div class="karaoke-ads">
                        <div class="ads-container" id="karaokeAdsContainer">
                            <!-- 광고 박스들이 여기에 렌더링 됩니다 -->
                        </div>
                    </div>
                    
                    <!-- 오른쪽: 지도 영역 (70%) -->
                    <div class="karaoke-map">
                        <div class="map-container" id="karaokeMapContainer">
                            <div class="map-placeholder">
                                <h3>🗺️ 다낭 가라오케 위치</h3>
                                <p>지도가 로딩 중입니다...</p>
                                <div class="loading-spinner"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        this.container = container;
    }

    // 📦 광고 박스 렌더링
    renderAds() {
        const adsContainer = document.getElementById('karaokeAdsContainer');
        if (!adsContainer) return;

        adsContainer.innerHTML = this.karaokeAds.map(ad => `
            <div class="ad-box ${ad.featured ? 'featured' : ''}" data-ad-id="${ad.id}">
                <div class="ad-image">
                    <img src="images/ads/${ad.image}" alt="${ad.name}" onerror="this.src='images/ads/default-karaoke.jpg'">
                    ${ad.featured ? '<div class="featured-badge">인기</div>' : ''}
                </div>
                <div class="ad-content">
                    <h3 class="ad-title">${ad.name}</h3>
                    <p class="ad-description">${ad.description}</p>
                    <div class="ad-info">
                        <div class="ad-location">📍 ${ad.location}</div>
                        <div class="ad-price">💰 ${ad.price}</div>
                    </div>
                    <div class="ad-contact">
                        <span>문의: ${ad.contact}</span>
                    </div>
                </div>
                <div class="ad-overlay">
                    <button class="ad-button">상세보기</button>
                </div>
            </div>
        `).join('');

        // 클릭 이벤트 추가
        this.setupAdClickEvents();
    }

    // 🗺️ 구글 맵 렌더링
    renderMap() {
        const mapContainer = document.getElementById('karaokeMapContainer');
        if (!mapContainer) return;

        // 구글 맵 초기화
        const mapOptions = {
            center: { lat: 16.0544, lng: 108.2022 }, // 다낭 중심
            zoom: 13,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            zoomControl: true,
            styles: [
                {
                    featureType: "poi",
                    elementType: "labels",
                    stylers: [{ visibility: "off" }]
                }
            ]
        };

        try {
            this.map = new google.maps.Map(mapContainer, mapOptions);
            
            // 마커들 추가
            this.addMarkers();
            
            console.log('✅ 구글 맵 로드 완료');
        } catch (error) {
            console.error('❌ 구글 맵 로드 실패:', error);
            // 실패 시 기존 핀 리스트 표시
            this.renderMapFallback();
        }
    }

    // 📍 마커들 추가
    addMarkers() {
        this.markers = [];
        
        this.karaokeLocations.forEach(location => {
            const marker = new google.maps.Marker({
                position: { lat: location.lat, lng: location.lng },
                map: this.map,
                title: location.name,
                icon: {
                    url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="30" height="40" viewBox="0 0 30 40">
                            <path d="M15 0C6.7 0 0 6.7 0 15c0 15 15 25 15 25s15-10 15-25C30 6.7 23.3 0 15 0z" fill="#667eea"/>
                            <circle cx="15" cy="15" r="8" fill="white"/>
                            <text x="15" y="19" text-anchor="middle" font-size="16" fill="#667eea">🎤</text>
                        </svg>
                    `),
                    scaledSize: new google.maps.Size(30, 40),
                    anchor: new google.maps.Point(15, 40)
                }
            });

            // 정보창 생성
            const ad = this.karaokeAds.find(a => a.id == location.adId);
            if (ad) {
                const infoWindow = new google.maps.InfoWindow({
                    content: `
                        <div style="padding: 10px; max-width: 200px;">
                            <h3 style="margin: 0 0 8px 0; color: #333;">${ad.name}</h3>
                            <p style="margin: 0 0 5px 0; font-size: 0.9rem; color: #666;">${ad.description}</p>
                            <p style="margin: 0 0 8px 0; font-size: 0.8rem; color: #888;">📍 ${ad.location}</p>
                            <p style="margin: 0 0 8px 0; font-size: 0.8rem; color: #888;">💰 ${ad.price}</p>
                            <button onclick="window.karaokeSection.openAdDetail(${ad.id})" 
                                    style="background: #667eea; color: white; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">
                                상세보기
                            </button>
                        </div>
                    `
                });

                marker.addListener('click', () => {
                    // 다른 정보창들 닫기
                    this.markers.forEach(m => {
                        if (m.infoWindow) m.infoWindow.close();
                    });
                    
                    infoWindow.open(this.map, marker);
                });

                marker.infoWindow = infoWindow;
            }

            this.markers.push(marker);
        });
    }

    // 🗺️ 구글 맵 실패 시 대체 렌더링 (스크롤 없이)
    renderMapFallback() {
        const mapContainer = document.getElementById('karaokeMapContainer');
        if (!mapContainer) return;

        mapContainer.innerHTML = `
            <div class="map-pins-grid">
                <h3>🎤 가라오케 위치</h3>
                <div class="pins-grid">
                    ${this.karaokeLocations.map(location => {
                        const ad = this.karaokeAds.find(a => a.id == location.adId);
                        return `
                            <div class="map-pin-card" data-location-id="${location.id}" data-ad-id="${location.adId}">
                                <div class="pin-header">
                                    <span class="pin-icon">🎤</span>
                                    <h4>${location.name}</h4>
                                </div>
                                <p class="pin-address">${location.address}</p>
                                ${ad ? `<p class="pin-price">${ad.price}</p>` : ''}
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;

        // 핀 클릭 이벤트 추가
        this.setupMapPinEvents();
    }

    // 🖱️ 광고 클릭 이벤트
    setupAdClickEvents() {
        const adBoxes = document.querySelectorAll('.ad-box');
        adBoxes.forEach(box => {
            box.addEventListener('click', () => {
                const adId = box.dataset.adId;
                const ad = this.karaokeAds.find(a => a.id == adId);
                if (ad) {
                    this.openAdDetail(ad);
                }
            });
        });
    }

    // 🗺️ 지도 핀 클릭 이벤트
    setupMapPinEvents() {
        const pins = document.querySelectorAll('.map-pin');
        pins.forEach(pin => {
            pin.addEventListener('click', () => {
                const adId = pin.dataset.adId;
                const ad = this.karaokeAds.find(a => a.id == adId);
                if (ad) {
                    this.openAdDetail(ad);
                }
            });
        });
    }

    // 📄 광고 상세 페이지 열기
    openAdDetail(adId) {
        const ad = this.karaokeAds.find(a => a.id == adId);
        if (!ad) return;
        
        // 새 창으로 해당 업체 게시판 열기
        const url = ad.link || `/karaoke/detail/${ad.id}`;
        console.log(`🔗 ${ad.name} 상세 페이지 이동:`, url);
        
        // 실제로는 새 창 또는 페이지 이동
        // window.open(url, '_blank');
        alert(`${ad.name} 상세 페이지로 이동합니다.\n문의: ${ad.contact}\n\n실제 서비스에서는 해당 업체 게시판으로 이동합니다.`);
    }

    // 🎭 CSS 스타일 추가
    addStyles() {
        if (document.getElementById('karaoke-section-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'karaoke-section-styles';
        styles.textContent = `
            .karaoke-section {
                max-width: 1200px;
                margin: 4rem auto;
                padding: 0 2rem;
                opacity: 0;
                transform: translateY(50px);
                transition: all 0.8s ease;
            }

            .karaoke-section.animate-in {
                opacity: 1;
                transform: translateY(0);
            }

            .section-header {
                text-align: center;
                margin-bottom: 3rem;
            }

            .section-header h2 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
                color: #333;
            }

            .section-header p {
                font-size: 1.1rem;
                color: #666;
            }

            .karaoke-content {
                display: flex;
                gap: 2rem;
                min-height: 600px;
            }

            .karaoke-ads {
                flex: 0 0 30%;
            }

            .ads-container {
                display: flex;
                flex-direction: column;
                gap: 1rem;
                max-height: 600px;
                overflow-y: auto;
                padding-right: 1rem;
            }

            .ad-box {
                background: white;
                border-radius: 10px;
                overflow: hidden;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
            }

            .ad-box:hover {
                transform: translateY(-5px);
                box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
            }

            .ad-box.featured {
                border: 2px solid #667eea;
            }

            .featured-badge {
                position: absolute;
                top: 10px;
                right: 10px;
                background: #667eea;
                color: white;
                padding: 0.2rem 0.5rem;
                border-radius: 10px;
                font-size: 0.8rem;
                z-index: 2;
            }

            .ad-image {
                height: 120px;
                position: relative;
                overflow: hidden;
            }

            .ad-image img {
                width: 100%;
                height: 100%;
                object-fit: cover;
            }

            .ad-content {
                padding: 1rem;
            }

            .ad-title {
                font-size: 1.1rem;
                font-weight: 600;
                margin-bottom: 0.5rem;
                color: #333;
            }

            .ad-description {
                font-size: 0.9rem;
                color: #666;
                margin-bottom: 0.8rem;
            }

            .ad-info {
                font-size: 0.8rem;
                color: #888;
                line-height: 1.4;
            }

            .ad-contact {
                margin-top: 0.5rem;
                font-size: 0.8rem;
                color: #667eea;
                font-weight: 500;
            }

            .karaoke-map {
                flex: 1;
            }

            .map-container {
                height: 600px;
                background: #f8f9fa;
                border-radius: 10px;
                overflow: hidden;
                position: relative;
            }

            .map-placeholder {
                height: 100%;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                text-align: center;
                color: #666;
            }

            /* 구글 맵 스타일 */
            .gm-style {
                border-radius: 10px;
            }

            /* 대체 핀 그리드 (스크롤 없이) */
            .map-pins-grid {
                padding: 2rem;
                height: 100%;
                display: flex;
                flex-direction: column;
            }

            .map-pins-grid h3 {
                margin-bottom: 1.5rem;
                color: #333;
                text-align: center;
            }

            .pins-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 1rem;
                flex: 1;
                align-content: start;
            }

            .map-pin-card {
                background: white;
                border-radius: 8px;
                padding: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                border: 1px solid #e0e0e0;
                height: fit-content;
            }

            .map-pin-card:hover {
                background: #f0f2ff;
                border-color: #667eea;
                transform: translateY(-2px);
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
            }

            .pin-header {
                display: flex;
                align-items: center;
                gap: 0.5rem;
                margin-bottom: 0.5rem;
            }

            .pin-icon {
                font-size: 1.2rem;
            }

            .pin-header h4 {
                margin: 0;
                color: #333;
                font-size: 1rem;
            }

            .pin-address {
                margin: 0 0 0.3rem 0;
                font-size: 0.8rem;
                color: #666;
            }

            .pin-price {
                margin: 0;
                font-size: 0.8rem;
                color: #667eea;
                font-weight: 500;
            }

            /* 기존 리스트 스타일 제거 */
            .map-pins-list {
                padding: 2rem;
                height: 100%;
                overflow-y: auto;
            }

            .map-pins-list h3 {
                margin-bottom: 1.5rem;
                color: #333;
            }

            .map-pin {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 1rem;
                background: white;
                border-radius: 8px;
                margin-bottom: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .map-pin:hover {
                background: #f0f2ff;
                transform: translateX(5px);
            }

            .pin-info h4 {
                margin: 0 0 0.3rem 0;
                color: #333;
            }

            .pin-info p {
                margin: 0;
                font-size: 0.9rem;
                color: #666;
            }

            .loading-spinner {
                width: 40px;
                height: 40px;
                border: 4px solid #f3f3f3;
                border-top: 4px solid #667eea;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-top: 1rem;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            /* 📱 모바일 반응형 */
            @media (max-width: 768px) {
                .karaoke-content {
                    flex-direction: column;
                    gap: 1rem;
                }

                .karaoke-ads {
                    flex: none;
                }

                .ads-container {
                    flex-direction: row;
                    overflow-x: auto;
                    max-height: none;
                    padding-bottom: 1rem;
                }

                .ad-box {
                    min-width: 250px;
                }

                .map-container {
                    height: 400px;
                }
            }
        `;

        document.head.appendChild(styles);
    }

    // 🚀 초기화
    async init() {
        if (this.isInitialized) {
            console.log('⚠️ 가라오케 섹션이 이미 초기화되었습니다.');
            return;
        }

        console.log('🎤 가라오케 섹션 초기화 시작...');

        try {
            // 전역 참조 설정 (구글 맵 정보창에서 사용)
            window.karaokeSection = this;

            // 스타일 추가
            this.addStyles();

            // 데이터 로드
            const dataLoaded = await this.loadData();
            if (!dataLoaded) {
                throw new Error('데이터 로드 실패');
            }

            // HTML 렌더링
            this.renderHTML();

            // 광고 박스 렌더링
            this.renderAds();

            // 지도 렌더링
            this.renderMap();

            // 스크롤 애니메이션 설정
            this.setupScrollAnimation();

            this.isInitialized = true;
            console.log('✅ 가라오케 섹션 초기화 완료!');

        } catch (error) {
            console.error('❌ 가라오케 섹션 초기화 실패:', error);
        }
    }

    // 🎭 스크롤 애니메이션 설정
    setupScrollAnimation() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    
                    // 지도도 애니메이션과 함께 나타나게
                    setTimeout(() => {
                        const mapContainer = entry.target.querySelector('.map-container');
                        if (mapContainer) {
                            mapContainer.style.opacity = '0';
                            mapContainer.style.transform = 'scale(0.95)';
                            mapContainer.style.transition = 'all 0.6s ease 0.3s';
                            
                            setTimeout(() => {
                                mapContainer.style.opacity = '1';
                                mapContainer.style.transform = 'scale(1)';
                            }, 100);
                        }
                    }, 200);
                    
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
        });

        const karaokeSection = this.container.querySelector('.karaoke-section');
        if (karaokeSection) {
            observer.observe(karaokeSection);
        }
    }

    // 🗑️ 정리
    destroy() {
        if (this.container) {
            this.container.innerHTML = '';
        }
        this.isInitialized = false;
        console.log('🗑️ 가라오케 섹션 정리 완료');
    }
}

// 전역 사용 가능하도록 export
window.KaraokeSection = KaraokeSection;