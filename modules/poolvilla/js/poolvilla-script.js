// 풀빌라 섹션 JavaScript

// 가격 관련 설정
const PRICE_CONFIG = {
    exchangeRate: {
        KRW: 0.054,  // 1 VND = 0.054 KRW
        USD: 0.000041  // 1 VND = 0.000041 USD
    },
    defaultPrices: {
        '1베드룸': 2000000,
        '2베드룸': 3000000,
        '3베드룸': 4000000,
        '4베드룸': 5000000,
        '펜트하우스': 6500000
    }
};

// 전역 변수
let fullvillaData = [];
let filteredData = [];
let activeFilters = {
    service: [],
    language: [],
    benefit: false,
    location: []
};
let selectedForCompare = []; // 비교를 위해 선택된 업체 ID들

// API 캐싱
const API_CACHE_KEY = 'fullvilla_data_cache';
const CACHE_DURATION = 5 * 60 * 1000; // 5분

function getCachedData() {
    const cached = sessionStorage.getItem(API_CACHE_KEY);
    if (!cached) return null;
    
    const { data, timestamp } = JSON.parse(cached);
    const now = Date.now();
    
    // 캐시 만료 체크
    if (now - timestamp > CACHE_DURATION) {
        sessionStorage.removeItem(API_CACHE_KEY);
        return null;
    }
    
    return data;
}

function setCachedData(data) {
    const cacheObject = {
        data: data,
        timestamp: Date.now()
    };
    sessionStorage.setItem(API_CACHE_KEY, JSON.stringify(cacheObject));
}



// 노션 데이터 로드
async function loadFullvillaData() {
    const spinner = document.getElementById('loadingSpinner');
    spinner.classList.add('active');
    
    try {
        // 캐시 확인
        const cachedData = getCachedData();
        if (cachedData) {
            console.log('캐시된 데이터 사용');
            fullvillaData = cachedData.fullvillaData;
            filteredData = cachedData.filteredData;
            
            // 필터 생성
            generateFilters();
            
            // 카드 렌더링
            renderCards();
            spinner.classList.remove('active');
            return;
        }
        
        console.log('API에서 새 데이터 로드');
        const response = await fetch('http://localhost:8080/api/notion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                database_id: CONFIG.API.notion.databases.poolvilla,
                api_key: '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'
            })
        });
        
        if (!response.ok) {
            throw new Error('API 요청 실패');
        }
        
        const data = await response.json();
        
        // 디버깅: 원본 데이터 확인
        console.log('노션 원본 데이터:', data.results);
        
        // ID가 0인 기본 이미지 찾기
        const defaultItem = data.results.find(item => 
            item.properties.ID?.number === 0
        );
        console.log('ID=0 항목:', defaultItem);
        
        if (defaultItem) {
            console.log('ID=0 properties 키들:', Object.keys(defaultItem.properties));
            console.log('풀빌라사진 필드:', defaultItem.properties['풀빌라사진']);
            console.log('풀빌라로고 필드:', defaultItem.properties['풀빌라로고']);
        }
        
        // 풀빌라로고 필드에서 기본 이미지 가져오기
        const defaultImage = defaultItem?.properties['풀빌라로고']?.files?.[0]?.file?.url || 
                           defaultItem?.properties['풀빌라로고']?.files?.[0]?.external?.url || null;
        console.log('기본 이미지 URL:', defaultImage);
        
        fullvillaData = processFullvillaData(data.results, defaultImage);
        filteredData = [...fullvillaData];
        
        // 캐시에 저장
        setCachedData({
            fullvillaData: fullvillaData,
            filteredData: filteredData
        });
        
        console.log('처리된 풀빌라 데이터:', fullvillaData);
        
        // 필터 생성
        generateFilters();
        
        renderCards();
        
    } catch (error) {
        console.error('풀빌라 데이터 로드 실패:', error);
        showError();
    } finally {
        spinner.classList.remove('active');
    }
}

// 기본 가격 가져오기
function getDefaultPrice(services) {
    // 첫 번째 서비스 기준으로 가격 설정
    if (services.length > 0) {
        return PRICE_CONFIG.defaultPrices[services[0]] || 500000;
    }
    return 500000; // 기본값
}

// 노션 이미지 URL 최적화
function optimizeNotionImage(url, width = 400) {
    if (!url || !url.includes('amazonaws.com')) return url;
    
    // 노션 이미지는 이미 최적화되어 있으므로 원본 사용
    // width 파라미터가 작동하지 않을 수 있음
    return url;
}

// 이미지 로드 에러 처리
function handleImageError(img) {
    console.error('이미지 로드 실패:', img.src);
    img.onerror = null; // 무한 루프 방지
    img.src = '/shared/images/logo/default.png';
}

// 데이터 처리
function processFullvillaData(results, defaultImage) {
    return results.map(item => {
        const props = item.properties;
        
        // 첫 번째 항목의 필드명 확인 (한 번만)
        if (props.ID?.number === 1) {
            console.log('사용 가능한 필드들:', Object.keys(props));
        }
        
        // ID가 0이면 건너뛰기 (기본 이미지용)
        if (props.ID?.number === 0) return null;
        
        return {
            id: props.ID?.number || 0,
            name: props['풀빌라명']?.title?.[0]?.plain_text || '이름 없음',
            logo: props['풀빌라로고']?.files?.[0]?.file?.url || 
                  props['풀빌라로고']?.files?.[0]?.external?.url || 
                  defaultImage,  // 기본 이미지 사용
            photos: props['풀빌라사진']?.files || [],
            roomTypes: props['침실수']?.number || 0,
            capacity: props['수용인원']?.number || 0,
            languages: props['언어지원']?.multi_select?.map(l => l.name) || [],
            promotion: props['홍보문구']?.rich_text?.[0]?.plain_text || '',
            benefit: props['특별혜택']?.rich_text?.[0]?.plain_text || '',
            address: props['vn풀빌라주소']?.rich_text?.[0]?.plain_text || '',
            phone: props['연락처']?.rich_text?.[0]?.plain_text || '',
            kakaoId: props['카카오ID']?.rich_text?.[0]?.plain_text || '',
            hours: props['운영시간']?.rich_text?.[0]?.plain_text || '',
            location: getLocationCategory(props['vn풀빌라주소']?.rich_text?.[0]?.plain_text || ''),
            price: props['가격대']?.rich_text?.[0]?.plain_text || '',
            facilities: props['시설정보']?.rich_text?.[0]?.plain_text || '',
            poolType: props['풀타입']?.multi_select?.map(p => p.name) || []
        };
    }).filter(item => item !== null);  // null 제거
}

// 주소에서 지역 카테고리 추출 (자동 파싱)
function getLocationCategory(address) {
    if (!address) return '';
    
    // 첫 번째 쉼표 전까지 추출
    const firstPart = address.split(',')[0].trim();
    
    // 앞 번지수 제거 (123, 456 등)
    // 뒤 번지수 제거 (4, 5 등)
    // Street, Road 등 제거
    const cleaned = firstPart
        .replace(/^\d+\s+/, '') // 앞 번지 제거
        .replace(/\s+\d+$/, '') // 뒤 번지 제거
        .replace(/\s+(Street|Road|St|Rd)$/i, ''); // Street 등 제거
    
    // 너무 길면 앞 두 단어만
    const words = cleaned.split(' ');
    if (words.length > 3) {
        return words.slice(0, 2).join(' ');
    }
    
    return cleaned;
}

// 카드 렌더링
function renderCards() {
    const container = document.getElementById('fullvillaCards');
    const countElement = document.getElementById('resultCount');
    
    container.innerHTML = '';
    
    if (filteredData.length === 0) {
        container.innerHTML = '<p class="no-results">조건에 맞는 업체가 없습니다.</p>';
        countElement.textContent = '전체 0개';
        return;
    }
    
    countElement.textContent = `전체 ${filteredData.length}개`;
    
    filteredData.forEach(fullvilla => {
        const card = createFullvillaCard(fullvilla);
        container.appendChild(card);
    });
}

// 필터 동적 생성
function generateFilters() {
    // 중복 제거를 위한 Set 사용
    const roomTypes = new Set();
    const languages = new Set();
    const locations = new Set();
    
    // 데이터에서 유니크한 값들 추출
    fullvillaData.forEach(fullvilla => {
        // 룸타입 (침실수 기반)
        if (fullvilla.roomTypes > 0) {
            roomTypes.add(`${fullvilla.roomTypes}베드룸`);
        }
        
        // 언어
        fullvilla.languages.forEach(lang => languages.add(lang));
        
        // 지역 (빈 값 제외)
        if (fullvilla.location) {
            locations.add(fullvilla.location);
        }
    });
    
    // 룸타입 필터 생성
    const serviceContainer = document.getElementById('serviceFilters');
    serviceContainer.innerHTML = '';
    Array.from(roomTypes).sort().forEach(roomType => {
        const label = createFilterCheckbox('service', roomType, roomType);
        serviceContainer.appendChild(label);
    });
    
    // 언어 필터 생성
    const languageContainer = document.getElementById('languageFilters');
    languageContainer.innerHTML = '';
    Array.from(languages).sort().forEach(language => {
        // 베트남어 제외
        if (language === '베트남어' || language === 'Vietnamese' || language === 'Tiếng Việt') {
            return;
        }
        const label = createFilterCheckbox('language', language, language);
        languageContainer.appendChild(label);
    });
    
    // 지역 필터 생성
    const locationContainer = document.getElementById('locationFilters');
    locationContainer.innerHTML = '';
    Array.from(locations).sort().forEach(location => {
        const label = createFilterCheckbox('location', location, `${location} 근처`);
        locationContainer.appendChild(label);
    });
}

// 필터 체크박스 생성 헬퍼 함수
function createFilterCheckbox(name, value, displayText) {
    const label = document.createElement('label');
    label.className = 'filter-checkbox';
    
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.name = name;
    input.value = value;
    input.addEventListener('change', handleFilterChange);
    
    const span = document.createElement('span');
    span.textContent = displayText;
    
    label.appendChild(input);
    label.appendChild(span);
    
    return label;
}

// 카드 생성 - 세로형 디자인
function createFullvillaCard(fullvilla) {
    const card = document.createElement('div');
    card.className = 'card fullvilla-card';  // 공용 card 클래스 + 풀빌라 전용
    
    // 선택된 상태 확인
    const isSelected = selectedForCompare.includes(fullvilla.id);
    if (isSelected) {
        card.classList.add('selected-for-compare');
    }
    
    // 룸타입 및 시설 정보
    const roomInfo = fullvilla.roomTypes > 0 ? `${fullvilla.roomTypes}베드룸` : '';
    const capacityInfo = fullvilla.capacity > 0 ? `${fullvilla.capacity}명` : '';
    
    // 풀타입 태그 HTML 생성
    const poolTags = fullvilla.poolType.map(pool => 
        `<span class="service-tag">${pool}</span>`
    ).join('');
    
    // 언어 정보
    const hasKorean = fullvilla.languages.includes('한국어');
    const languageText = hasKorean ? 
        '<span class="language-korean">한국어 가능</span>' : 
        '베트남어, 영어';
    
    // 할인 정보 확인
    const hasDiscount = fullvilla.benefit && fullvilla.benefit.includes('%');
    
    // 이미지 선택 (로고 또는 첫 번째 사진)
    const rawImage = fullvilla.logo || 
                    (fullvilla.photos && fullvilla.photos[0]?.file?.url) || 
                    (fullvilla.photos && fullvilla.photos[0]?.external?.url) ||
                    '/shared/images/logo/default.png';
    
    // 썸네일용 최적화 (400px)
    const displayImage = optimizeNotionImage(rawImage, 400);
    
    // 카드 HTML
    card.innerHTML = `
        <div class="compare-checkbox" onclick="event.stopPropagation()">
            <input type="checkbox" id="compare-${fullvilla.id}" 
                ${isSelected ? 'checked' : ''}
                onchange="toggleCompareSelection(${fullvilla.id})">
            <label for="compare-${fullvilla.id}">비교</label>
        </div>
        
        <div class="card-image">
            <img src="${displayImage}" 
                 alt="${fullvilla.name}" 
                 loading="lazy"
                 onerror="handleImageError(this)">
            ${hasDiscount ? `<div class="discount-badge">할인 중</div>` : ''}
        </div>
        
        <div class="card-content">
            <h3 class="card-title">${fullvilla.name}</h3>
            
            ${fullvilla.location ? 
                `<div class="location-info">${fullvilla.location} 근처</div>` : ''
            }
            
            <div class="room-info">
                ${roomInfo} ${capacityInfo ? `· ${capacityInfo}` : ''}
            </div>
            
            ${poolTags ? `<div class="service-tags">${poolTags}</div>` : ''}
            
            <div class="language-info">${languageText}</div>
            
            ${fullvilla.benefit ? 
                `<div class="benefit-info">🎁 ${fullvilla.benefit}</div>` : 
                ''
            }
            
            <div class="card-actions">
                <button class="btn-action primary" onclick="contactFullvilla(${fullvilla.id}, event)">
                    예약하기
                </button>
                <button class="btn-action" onclick="viewDetail(${fullvilla.id}, event)">
                    자세히
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// 상세 페이지 이동
function viewDetail(id, event) {
    event.stopPropagation();
    // 풀빌라 상세 페이지로 이동
    window.location.href = `/modules/poolvilla/poolvilla-detail.html?id=${id}`;
}

// 연락 함수
function contactFullvilla(id, event) {
    event.stopPropagation();
    const fullvilla = fullvillaData.find(f => f.id === id);
    if (fullvilla) {
        if (fullvilla.kakaoId) {
            window.open(`https://open.kakao.com/o/${fullvilla.kakaoId}`, '_blank');
        } else if (fullvilla.phone) {
            window.location.href = `tel:${fullvilla.phone}`;
        } else {
            alert('연락처 정보가 없습니다.');
        }
    }
}

// 상세 보기 함수
function viewDetail(id, event) {
    event.stopPropagation();
    // 풀빌라 상세 페이지로 이동
    window.location.href = `poolvilla-detail.html?id=${id}`;
}

// 필터 리스너 설정
function setupFilterListeners() {
    // 초기화 버튼만 설정 (체크박스는 동적 생성 시 이벤트 추가됨)
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
}

// 필터 변경 처리
function handleFilterChange(e) {
    const filterType = e.target.name;
    const filterValue = e.target.value;
    const isChecked = e.target.checked;
    
    if (filterType === 'benefit') {
        activeFilters.benefit = isChecked;
    } else {
        if (isChecked) {
            activeFilters[filterType].push(filterValue);
        } else {
            const index = activeFilters[filterType].indexOf(filterValue);
            if (index > -1) {
                activeFilters[filterType].splice(index, 1);
            }
        }
    }
    
    applyFilters();
}

// 필터 적용
function applyFilters() {
    filteredData = fullvillaData.filter(fullvilla => {
        // 룸타입 필터
        if (activeFilters.service.length > 0) {
            const roomType = fullvilla.roomTypes > 0 ? `${fullvilla.roomTypes}베드룸` : '';
            if (!activeFilters.service.includes(roomType)) return false;
        }
        
        // 언어 필터
        if (activeFilters.language.length > 0) {
            const hasLanguage = activeFilters.language.some(lang => 
                fullvilla.languages.includes(lang)
            );
            if (!hasLanguage) return false;
        }
        
        // 혜택 필터
        if (activeFilters.benefit && !fullvilla.benefit) {
            return false;
        }
        
        // 지역 필터
        if (activeFilters.location.length > 0) {
            if (!activeFilters.location.includes(fullvilla.location)) {
                return false;
            }
        }
        
        return true;
    });
    
    renderCards();
}

// 필터 초기화
function resetFilters() {
    // 모든 체크박스 해제
    const checkboxes = document.querySelectorAll('.filter-checkbox input');
    checkboxes.forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // 필터 상태 초기화
    activeFilters = {
        service: [],
        language: [],
        benefit: false,
        location: []
    };
    
    // 전체 데이터 표시
    filteredData = [...fullvillaData];
    renderCards();
}

// 에러 표시
function showError() {
    const container = document.getElementById('fullvillaCards');
    container.innerHTML = `
        <div class="error-message">
            <p>데이터를 불러오는데 실패했습니다.</p>
            <p>프록시 서버가 실행 중인지 확인해주세요.</p>
        </div>
    `;
}

// ========== 비교 기능 ==========

// 비교 선택 토글
function toggleCompareSelection(massageId) {
    const index = selectedForCompare.indexOf(massageId);
    
    if (index > -1) {
        // 이미 선택된 경우 제거
        selectedForCompare.splice(index, 1);
    } else {
        // 최대 3개까지만 선택 가능
        if (selectedForCompare.length >= 3) {
            alert('최대 3개까지만 비교할 수 있습니다.');
            document.getElementById(`compare-${massageId}`).checked = false;
            return;
        }
        selectedForCompare.push(massageId);
    }
    
    updateCompareButton();
    
    // 카드 스타일 업데이트
    const card = document.getElementById(`compare-${massageId}`).closest('.card');
    card.classList.toggle('selected-for-compare');
}

// 비교 버튼 업데이트
function updateCompareButton() {
    let compareButton = document.getElementById('compareButton');
    
    if (selectedForCompare.length >= 2) {
        if (!compareButton) {
            // 비교 버튼 생성
            compareButton = document.createElement('div');
            compareButton.id = 'compareButton';
            compareButton.className = 'compare-button-container';
            compareButton.innerHTML = `
                <button class="btn btn-primary" onclick="showComparison()">
                    선택한 업체 비교하기 (${selectedForCompare.length}개)
                </button>
                <button class="btn btn-ghost" onclick="clearCompareSelection()">
                    선택 취소
                </button>
            `;
            document.body.appendChild(compareButton);
        } else {
            // 버튼 텍스트 업데이트
            compareButton.querySelector('.btn-primary').textContent = 
                `선택한 업체 비교하기 (${selectedForCompare.length}개)`;
        }
    } else {
        // 버튼 제거
        if (compareButton) {
            compareButton.remove();
        }
    }
}

// 비교 선택 초기화
function clearCompareSelection() {
    selectedForCompare = [];
    document.querySelectorAll('.compare-checkbox input').forEach(checkbox => {
        checkbox.checked = false;
    });
    document.querySelectorAll('.selected-for-compare').forEach(card => {
        card.classList.remove('selected-for-compare');
    });
    updateCompareButton();
}

// 비교 팝업 표시
function showComparison() {
    const selectedFullvillas = fullvillaData.filter(f => selectedForCompare.includes(f.id));
    
    // 비교 팝업 HTML 생성
    const popup = document.createElement('div');
    popup.className = 'comparison-popup';
    popup.innerHTML = `
        <div class="comparison-backdrop" onclick="closeComparison()"></div>
        <div class="comparison-modal">
            <div class="comparison-header">
                <h2>업체 비교</h2>
                <button class="close-button" onclick="closeComparison()">✕</button>
            </div>
            <div class="comparison-content">
                <div class="comparison-grid">
                    ${selectedFullvillas.map(fullvilla => `
                        <div class="comparison-card">
                            <img src="${fullvilla.logo}" alt="${fullvilla.name}" class="comparison-logo">
                            <h3>${fullvilla.name}</h3>
                            
                            <div class="comparison-section">
                                <h4>룸타입</h4>
                                <p>${fullvilla.roomTypes}베드룸 · ${fullvilla.capacity}명</p>
                            </div>
                            
                            <div class="comparison-section">
                                <h4>시설</h4>
                                <p>${fullvilla.facilities || '문의'}</p>
                            </div>
                            
                            <div class="comparison-section">
                                <h4>언어</h4>
                                <p>${fullvilla.languages.join(', ') || '문의'}</p>
                            </div>
                            
                            ${fullvilla.benefit ? `
                                <div class="comparison-section">
                                    <h4>특별혜택</h4>
                                    <p class="benefit-text">🎁 ${fullvilla.benefit}</p>
                                </div>
                            ` : ''}
                            
                            <div class="comparison-section">
                                <h4>가격</h4>
                                <p>${fullvilla.price || '문의'}</p>
                            </div>
                            
                            <div class="comparison-section">
                                <h4>연락처</h4>
                                ${fullvilla.kakaoId ? 
                                    `<button class="btn btn-primary btn-sm" onclick="window.open('https://open.kakao.com/o/${fullvilla.kakaoId}')">
                                        카톡 문의
                                    </button>` : 
                                    `<p>${fullvilla.phone || '문의'}</p>`
                                }
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(popup);
    document.body.style.overflow = 'hidden';
}

// 비교 팝업 닫기
function closeComparison() {
    const popup = document.querySelector('.comparison-popup');
    if (popup) {
        popup.remove();
        document.body.style.overflow = '';
    }
}

// 전역 함수로 등록 (인라인 onclick용)
window.toggleCompareSelection = toggleCompareSelection;
window.showComparison = showComparison;
window.closeComparison = closeComparison;
window.clearCompareSelection = clearCompareSelection;
window.contactFullvilla = contactFullvilla;
window.viewDetail = viewDetail;

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadFullvillaData();
    setupFilterListeners();
    
    // 헤더 스크롤 이벤트 강제 초기화
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
        console.log('스크롤 이벤트 수동 트리거');
    }, 500);
});