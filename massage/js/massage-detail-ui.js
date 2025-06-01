// 마사지 상세 페이지 - UI 렌더링 모듈
class MassageDetailUI {
    constructor() {
        // 요소들을 동적으로 찾도록 변경
    }

    // 요소를 동적으로 가져오는 헬퍼 함수
    getElement(id) {
        return document.getElementById(id);
    }

    // 로딩 상태 표시
    showLoading() {
        const loading = this.getElement('loadingMessage');
        const shopContent = this.getElement('shopContent');
        
        if (loading) {
            loading.style.display = 'block';
        }
        if (shopContent) {
            shopContent.style.display = 'none';
        }
    }

    // 에러 메시지 표시
    showError(message) {
        const loading = this.getElement('loadingMessage');
        const shopContent = this.getElement('shopContent');
        
        if (loading) {
            loading.innerHTML = `❌ ${message}`;
        }
        if (shopContent) {
            shopContent.style.display = 'none';
        }
    }

    // 업체 정보 화면에 표시
    displayShopInfo(shop) {
        console.log('🎨 업체 정보 표시:', shop);

        // 로딩 숨기고 콘텐츠 표시
        const loading = this.getElement('loadingMessage');
        const shopContent = this.getElement('shopContent');
        
        if (loading) {
            loading.style.display = 'none';
        }
        if (shopContent) {
            shopContent.style.display = 'block';
        }

        // 각 섹션 렌더링
        this.renderShopImage(shop);
        this.renderShopInfo(shop);
        this.renderContactSection(shop);
        this.renderLocationSection(shop);
        this.renderOperationSection(shop);

        // 페이지 제목 업데이트
        document.title = `${shop.name} - EchoPal`;
    }

    // 업체 이미지 섹션 렌더링 (왼쪽 반)
    renderShopImage(shop) {
        // Pinterest 갤러리 렌더링
        const pinterestGallery = document.getElementById('pinterestGallery');
        if (pinterestGallery) {
            const galleryHTML = this.createPinterestGallery(shop);
            pinterestGallery.innerHTML = galleryHTML;
        }

        // 모바일용 메인 이미지 렌더링
        const shopImageElement = document.getElementById('shopImage');
        if (shopImageElement) {
            const imageHTML = shop.image ? 
                `<img src="${shop.image}" alt="${shop.name}" style="width: 100%; height: 100%; object-fit: cover;" 
                    onload="console.log('✅ 이미지 로드 성공')" 
                    onerror="console.log('❌ 이미지 로드 실패'); this.parentElement.innerHTML='<div class=\\'shop-image-placeholder\\'>💆‍♀️</div>';">` :
                '<div class="shop-image-placeholder">💆‍♀️</div>';
            
            shopImageElement.innerHTML = imageHTML;
        }
    }

    // Pinterest 갤러리 생성
    createPinterestGallery(shop) {
        // 실제 노션 이미지들 사용
        let galleryItems = [];

        if (shop.images && shop.images.length > 0) {
            // 노션에서 가져온 실제 이미지들 사용
            galleryItems = shop.images.map((imageUrl, index) => ({
                image: imageUrl,
                title: index === 0 ? shop.name : `${shop.name} - ${index + 1}`,
                desc: index === 0 ? '메인 사진' : `업체 사진 ${index + 1}`
            }));
        } else {
            // 이미지가 없으면 플레이스홀더 하나만
            galleryItems = [{
                image: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPu2MjOyngOyngCDsmrDssrQ8L3RleHQ+PC9zdmc+',
                title: shop.name || '마사지 업체',
                desc: '업체 사진'
            }];
        }

        return galleryItems.map((item, index) => {
            return `
                <div class="pinterest-item" onclick="openImageModal('${item.image}')">
                    <img src="${item.image}" alt="${item.title}" 
                         onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPu2MjOyngOyngCDsmrDssrQ8L3RleHQ+PC9zdmc+';">
                </div>
            `;
        }).join('');
    }

    // 업체 정보 섹션 렌더링 (오른쪽 반 상단)
    renderShopInfo(shop) {
        const shopInfo = this.getElement('shopInfo');
        if (!shopInfo) return;

        let tagsHTML = '';
        if (shop.services && shop.services.length > 0) {
            tagsHTML += shop.services.map(service => `<span class="service-tag">${service}</span>`).join('');
        }
        if (shop.languages && shop.languages.length > 0) {
            tagsHTML += shop.languages.map(lang => `<span class="language-tag">${lang}</span>`).join('');
        }

        const specialOfferHTML = shop.specialOffer ? 
            `<div class="special-offer">🎁 ${shop.specialOffer}</div>` : '';

        shopInfo.innerHTML = `
            <h1 class="shop-title" style="text-align: center;">${shop.name || '마사지 업체'}</h1>
            
            <div class="shop-tags">
                ${tagsHTML}
            </div>
            
            <div class="shop-description">
                ${shop.adText || '프리미엄 마사지 서비스를 제공합니다.'}
            </div>
            
            ${specialOfferHTML}
        `;
    }

    // 연락처 섹션 렌더링
    renderContactSection(shop) {
        const contactSection = this.getElement('contactSection');
        if (!contactSection) return;

        const phoneHTML = shop.phone ? 
            `<div class="contact-item">
                <span class="contact-label">📞 전화:</span>
                <span class="contact-value">${shop.phone}</span>
                <button class="copy-btn" onclick="massageDetailUI.copyPhone('${shop.phone}')">복사</button>
            </div>` :
            `<div class="contact-item">
                <span class="contact-label">📞 전화:</span>
                <span class="contact-value">전화번호 없음</span>
            </div>`;

        const kakaoHTML = shop.kakaoId ? 
            `<div class="contact-item">
                <span class="contact-label">💬 카카오:</span>
                <span class="contact-value">${shop.kakaoId}</span>
                <button class="copy-btn" onclick="massageDetailUI.copyKakaoId('${shop.kakaoId}')">복사</button>
            </div>` : 
            `<div class="contact-item">
                <span class="contact-label">💬 카카오:</span>
                <span class="contact-value">카카오 ID 없음</span>
            </div>`;

        contactSection.innerHTML = `
            <h2 class="section-title">📞 연락처</h2>
            
            <div class="contact-list">
                ${phoneHTML}
                ${kakaoHTML}
            </div>
        `;
    }

    // 위치 정보 섹션 렌더링
    renderLocationSection(shop) {
        const locationSection = this.getElement('locationSection');
        if (!locationSection) return;

        const koreanAddress = shop.krAddress || shop.address || '다낭시 한강구';
        const vietnameseAddress = shop.vnAddress || this.translateToVietnamese(koreanAddress);
        
        // 표시용 짧은 주소
        const koreanShort = this.getShortAddress(koreanAddress);
        const vietnameseShort = this.getShortAddress(vietnameseAddress);

        locationSection.innerHTML = `
            <h2 class="section-title">📍 위치 정보</h2>
            
            <div class="address-list">
                <div class="address-item">
                    <span class="address-label">VN 주소:</span>
                    <span class="address-value">${vietnameseShort}</span>
                    <button class="copy-btn" onclick="massageDetailUI.copyAddress('${vietnameseAddress}')">복사</button>
                </div>
                <div class="address-item">
                    <span class="address-label">KR 주소:</span>
                    <span class="address-value">${koreanShort}</span>
                    <button class="copy-btn" onclick="massageDetailUI.copyAddress('${koreanAddress}')">복사</button>
                </div>
            </div>
            
            <div class="location-buttons">
                <button class="location-btn map-btn" onclick="massageDetailUI.openGoogleMaps()">
                    🗺️ 지도에서 보기
                </button>
                <button class="location-btn grab-btn" onclick="massageDetailUI.openGrabApp()">
                    🚗 그랩 앱 호출
                </button>
            </div>
        `;
    }

    // 운영 정보 섹션 렌더링
    renderOperationSection(shop) {
        const operationSection = this.getElement('operationSection');
        if (!operationSection) return;

        const operatingHours = shop.operatingHours || '09:00 - 24:00';
        const holidaysText = shop.holidays && shop.holidays.length > 0 ? 
            shop.holidays.join(', ') : '연중무휴';

        operationSection.innerHTML = `
            <h2 class="section-title">⏰ 운영 정보</h2>
            
            <div class="operation-box">
                <div class="operation-item">
                    <span class="operation-label">영업시간:</span>
                    <span class="operation-value">${operatingHours}</span>
                </div>
                <div class="operation-item">
                    <span class="operation-label">휴무일:</span>
                    <span class="operation-value">${holidaysText}</span>
                </div>
            </div>
        `;
    }

    // 간단한 베트남어 변환
    translateToVietnamese(koreanAddress) {
        return koreanAddress
            .replace('다낭시', 'Đà Nẵng')
            .replace('한강구', 'Quận Hải Châu')
            .replace('해안구', 'Quận Ngũ Hành Sơn')
            .replace('손짜구', 'Quận Sơn Trà');
    }

    // 짧은 주소 생성 (표시용)
    getShortAddress(fullAddress) {
        if (!fullAddress) return '주소 없음';
        
        // 예: "157 Tran Phu Street, Hai Chau District, Da Nang" 
        // → "Tran Phu Street 부근"
        
        let address = fullAddress;
        
        // 맨 앞의 번지수만 제거 (157, 123번지 등)
        address = address.replace(/^\d+\s*/, '');  // 맨 앞 숫자 제거
        address = address.replace(/\s*\d+번지\s*/, ' '); // 한국식 번지 제거
        
        // 콤마로 구분된 경우 첫 번째 부분만 (거리명만)
        if (address.includes(',')) {
            address = address.split(',')[0];
        }
        
        return address.trim() + ' 부근';
    }

    // 전화 걸기
    callShop(phoneNumber = null) {
        const currentShop = window.massageDetailData.getCurrentShop();
        const phone = phoneNumber || currentShop?.phone;
        if (phone) {
            window.location.href = `tel:${phone}`;
        } else {
            alert('전화번호가 없습니다.');
        }
    }

    // 전화번호 복사
    copyPhone(phoneNumber = null) {
        const currentShop = window.massageDetailData.getCurrentShop();
        const phone = phoneNumber || currentShop?.phone;
        if (phone) {
            navigator.clipboard.writeText(phone).then(() => {
                alert(`전화번호가 복사되었습니다: ${phone}`);
            }).catch(() => {
                prompt('전화번호를 복사하세요:', phone);
            });
        } else {
            alert('전화번호가 없습니다.');
        }
    }

    // 카카오톡 ID 복사
    copyKakaoId(kakaoId = null) {
        const currentShop = window.massageDetailData.getCurrentShop();
        const id = kakaoId || currentShop?.kakaoId;
        if (id) {
            navigator.clipboard.writeText(id).then(() => {
                alert(`카카오톡 ID가 복사되었습니다: ${id}`);
            }).catch(() => {
                prompt('카카오톡 ID를 복사하세요:', id);
            });
        } else {
            alert('카카오톡 ID가 없습니다.');
        }
    }

    // 구글맵에서 보기
    openGoogleMaps() {
        const currentShop = window.massageDetailData.getCurrentShop();
        if (currentShop?.gps) {
            const [lat, lng] = currentShop.gps.split(',');
            const url = `https://www.google.com/maps?q=${lat},${lng}`;
            window.open(url, '_blank');
        } else if (currentShop?.address) {
            const url = `https://www.google.com/maps/search/${encodeURIComponent(currentShop.address)}`;
            window.open(url, '_blank');
        } else {
            alert('위치 정보가 없습니다.');
        }
    }

    // 주소 복사
    copyAddress(address = null) {
        if (address) {
            // 직접 전달된 주소 복사
            navigator.clipboard.writeText(address).then(() => {
                alert(`주소가 복사되었습니다: ${address}`);
            }).catch(() => {
                prompt('주소를 복사하세요:', address);
            });
        } else {
            // 기본 주소 복사 (이전 방식 호환)
            const currentShop = window.massageDetailData.getCurrentShop();
            const shopAddress = currentShop?.address;
            if (shopAddress) {
                navigator.clipboard.writeText(shopAddress).then(() => {
                    alert(`주소가 복사되었습니다: ${shopAddress}`);
                }).catch(() => {
                    prompt('주소를 복사하세요:', shopAddress);
                });
            } else {
                alert('주소 정보가 없습니다.');
            }
        }
    }

    // 그랩 앱 호출
    openGrabApp() {
        const currentShop = window.massageDetailData.getCurrentShop();
        if (currentShop?.gps) {
            const [lat, lng] = currentShop.gps.split(',');
            // 그랩 딥링크 (안드로이드/iOS 모두 지원)
            const grabUrl = `grab://location?latitude=${lat}&longitude=${lng}`;
            
            // 그랩 앱이 없으면 구글맵으로 대체
            const fallbackUrl = `https://www.google.com/maps?q=${lat},${lng}`;
            
            try {
                window.location.href = grabUrl;
                // 3초 후에도 페이지가 변경되지 않으면 구글맵으로 이동
                setTimeout(() => {
                    if (document.visibilityState === 'visible') {
                        window.open(fallbackUrl, '_blank');
                    }
                }, 3000);
            } catch (error) {
                window.open(fallbackUrl, '_blank');
            }
        } else {
            alert('GPS 정보가 없어서 그랩을 호출할 수 없습니다.');
        }
    }
}

// 이미지 모달 함수 (전역)
function openImageModal(imageSrc) {
    // 간단한 이미지 모달 (나중에 개선 가능)
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.8);
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
        border-radius: 10px;
    `;
    
    modal.appendChild(img);
    document.body.appendChild(modal);
    
    modal.onclick = () => {
        document.body.removeChild(modal);
    };
}

// 전역 변수로 인스턴스 생성
window.massageDetailUI = new MassageDetailUI();