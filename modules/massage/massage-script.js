// 마사지 섹션 JavaScript

// 가격 관련 설정
const PRICE_CONFIG = {
    exchangeRate: {
        KRW: 0.054,  // 1 VND = 0.054 KRW
        USD: 0.000041  // 1 VND = 0.000041 USD
    },
    defaultPrices: {
        '타이': 500000,
        '오일': 700000,
        '아로마': 800000,
        '스포츠': 600000,
        '발': 400000,
        '커플': 1200000
    }
};

// 전역 변수
let massageData = [];
let filteredData = [];
let activeFilters = {
    service: [],
    language: [],
    benefit: false,
    location: []
};
let selectedForCompare = []; // 비교를 위해 선택된 업체 ID들

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadMassageData();
    setupFilterListeners();
    
    // 헤더 스크롤 이벤트 강제 초기화
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
        console.log('스크롤 이벤트 수동 트리거');
    }, 500);
});

// 노션 데이터 로드
async function loadMassageData() {
    const spinner = document.getElementById('loadingSpinner');
    spinner.classList.add('active');
    
    try {
        const response = await fetch('http://localhost:8080/api/notion', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                database_id: '203e5f74c72e815d8f39d2946ee85c0a',
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
            console.log('마사지사진 필드:', defaultItem.properties['마사지사진']);
            console.log('마사지로고 필드:', defaultItem.properties['마사지로고']);
        }
        
        // 마사지로고 필드에서 기본 이미지 가져오기
        const defaultImage = defaultItem?.properties['마사지로고']?.files?.[0]?.file?.url || 
                           defaultItem?.properties['마사지로고']?.files?.[0]?.external?.url || null;
        console.log('기본 이미지 URL:', defaultImage);
        
        massageData = processMassageData(data.results, defaultImage);
        filteredData = [...massageData];
        
        console.log('처리된 마사지 데이터:', massageData);
        
        // 필터 생성
        generateFilters();
        
        renderCards();
        
    } catch (error) {
        console.error('마사지 데이터 로드 실패:', error);
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

// 데이터 처리
function processMassageData(results, defaultImage) {
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
            name: props['마사지명']?.title?.[0]?.plain_text || '이름 없음',
            logo: props['마사지로고']?.files?.[0]?.file?.url || 
                  props['마사지로고']?.files?.[0]?.external?.url || 
                  defaultImage,  // 기본 이미지 사용
            photos: props['마사지사진']?.files || [],
            services: props['서비스종류']?.multi_select?.map(s => s.name) || [],
            languages: props['언어지원']?.multi_select?.map(l => l.name) || [],
            promotion: props['홍보문구']?.rich_text?.[0]?.plain_text || '',
            benefit: props['특별혜택']?.rich_text?.[0]?.plain_text || '',
            address: props['vn 업체주소']?.rich_text?.[0]?.plain_text || '',
            phone: props['연락처']?.rich_text?.[0]?.plain_text || '',
            kakaoId: props['카카오ID']?.rich_text?.[0]?.plain_text || '',
            hours: props['운영시간']?.rich_text?.[0]?.plain_text || '',
            location: getLocationCategory(props['vn 업체주소']?.rich_text?.[0]?.plain_text || ''),
            // 가격 정보 추가
            price: props['가격']?.number || getDefaultPrice(props['서비스종류']?.multi_select?.map(s => s.name) || [])
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
    const container = document.getElementById('massageCards');
    const countElement = document.getElementById('resultCount');
    
    container.innerHTML = '';
    
    if (filteredData.length === 0) {
        container.innerHTML = '<p class="no-results">조건에 맞는 업체가 없습니다.</p>';
        countElement.textContent = '전체 0개';
        return;
    }
    
    countElement.textContent = `전체 ${filteredData.length}개`;
    
    filteredData.forEach(massage => {
        const card = createMassageCard(massage);
        container.appendChild(card);
    });
}

// 필터 동적 생성
function generateFilters() {
    // 중복 제거를 위한 Set 사용
    const services = new Set();
    const languages = new Set();
    const locations = new Set();
    
    // 데이터에서 유니크한 값들 추출
    massageData.forEach(massage => {
        // 서비스 종류
        massage.services.forEach(service => services.add(service));
        
        // 언어
        massage.languages.forEach(lang => languages.add(lang));
        
        // 지역 (빈 값 제외)
        if (massage.location) {
            locations.add(massage.location);
        }
    });
    
    // 서비스 필터 생성
    const serviceContainer = document.getElementById('serviceFilters');
    serviceContainer.innerHTML = '';
    Array.from(services).sort().forEach(service => {
        const label = createFilterCheckbox('service', service, `${service}마사지`);
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
function createMassageCard(massage) {
    const card = document.createElement('div');
    card.className = 'card massage-card';  // 공용 card 클래스 + 마사지 전용
    
    // 선택된 상태 확인
    const isSelected = selectedForCompare.includes(massage.id);
    if (isSelected) {
        card.classList.add('selected-for-compare');
    }
    
    // 서비스 태그 HTML 생성 (최대 3개만 표시)
    const displayServices = massage.services.slice(0, 3);
    const serviceTags = displayServices.map(service => 
        `<span class="service-tag tag-${service}">${service}</span>`
    ).join('');
    
    // 가격 정보
    const priceVND = massage.price;
    
    // 언어 정보
    const hasKorean = massage.languages.includes('한국어');
    const languageText = hasKorean ? 
        '<span class="language-korean">한국어 가능</span>' : 
        '베트남어, 영어';
    
    // 할인 정보 확인
    const hasDiscount = massage.benefit && massage.benefit.includes('%');
    
    // 이미지 선택 (로고 또는 첫 번째 사진)
    const displayImage = massage.logo || 
                        (massage.photos && massage.photos[0]?.file?.url) || 
                        (massage.photos && massage.photos[0]?.external?.url) ||
                        '/shared/images/default-massage.jpg';
    
    // 카드 HTML
    card.innerHTML = `
        <div class="compare-checkbox" onclick="event.stopPropagation()">
            <input type="checkbox" id="compare-${massage.id}" 
                ${isSelected ? 'checked' : ''}
                onchange="toggleCompareSelection(${massage.id})">
            <label for="compare-${massage.id}">비교</label>
        </div>
        
        <div class="card-image">
            <img src="${displayImage}" 
                 alt="${massage.name}" 
                 loading="lazy">
            ${hasDiscount ? `<div class="discount-badge">할인 중</div>` : ''}
        </div>
        
        <div class="card-content">
            <h3 class="card-title">${massage.name}</h3>
            
            ${massage.location ? 
                `<div class="location-info">${massage.location} 근처</div>` : ''
            }
            
            <div class="service-tags">
                ${serviceTags}
                ${massage.services.length > 3 ? 
                    `<span class="service-tag" style="background: #F3F4F6; color: #6B7280;">+${massage.services.length - 3}</span>` : 
                    ''
                }
            </div>
            
            <div class="price-info">
                ₫${priceVND.toLocaleString()}
            </div>
            
            <div class="language-info">${languageText}</div>
            
            ${massage.benefit ? 
                `<div class="benefit-info">🎁 ${massage.benefit}</div>` : 
                ''
            }
            
            <div class="card-actions">
                <button class="btn-action primary" onclick="contactMassage(${massage.id}, event)">
                    예약하기
                </button>
                <button class="btn-action" onclick="viewDetail(${massage.id}, event)">
                    자세히
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// 연락 함수
function contactMassage(id, event) {
    event.stopPropagation();
    const massage = massageData.find(m => m.id === id);
    if (massage) {
        if (massage.kakaoId) {
            window.open(`https://open.kakao.com/o/${massage.kakaoId}`, '_blank');
        } else if (massage.phone) {
            window.location.href = `tel:${massage.phone}`;
        } else {
            alert('연락처 정보가 없습니다.');
        }
    }
}

// 상세 보기 함수
function viewDetail(id, event) {
    event.stopPropagation();
    // 상세 페이지 구현 예정
    console.log('상세 보기:', id);
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
    filteredData = massageData.filter(massage => {
        // 서비스 필터
        if (activeFilters.service.length > 0) {
            const hasService = activeFilters.service.some(service => 
                massage.services.includes(service)
            );
            if (!hasService) return false;
        }
        
        // 언어 필터
        if (activeFilters.language.length > 0) {
            const hasLanguage = activeFilters.language.some(lang => 
                massage.languages.includes(lang)
            );
            if (!hasLanguage) return false;
        }
        
        // 혜택 필터
        if (activeFilters.benefit && !massage.benefit) {
            return false;
        }
        
        // 지역 필터
        if (activeFilters.location.length > 0) {
            if (!activeFilters.location.includes(massage.location)) {
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
    filteredData = [...massageData];
    renderCards();
}

// 에러 표시
function showError() {
    const container = document.getElementById('massageCards');
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
    const selectedMassages = massageData.filter(m => selectedForCompare.includes(m.id));
    
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
                    ${selectedMassages.map(massage => `
                        <div class="comparison-card">
                            <img src="${massage.logo}" alt="${massage.name}" class="comparison-logo">
                            <h3>${massage.name}</h3>
                            
                            <div class="comparison-section">
                                <h4>서비스</h4>
                                <div class="comparison-tags">
                                    ${massage.services.map(s => 
                                        `<span class="service-tag tag-${s}">${s}</span>`
                                    ).join('')}
                                </div>
                            </div>
                            
                            <div class="comparison-section">
                                <h4>언어</h4>
                                <p>${massage.languages.join(', ') || '문의'}</p>
                            </div>
                            
                            ${massage.benefit ? `
                                <div class="comparison-section">
                                    <h4>특별혜택</h4>
                                    <p class="benefit-text">🎁 ${massage.benefit}</p>
                                </div>
                            ` : ''}
                            
                            <div class="comparison-section">
                                <h4>운영시간</h4>
                                <p>${massage.hours || '문의'}</p>
                            </div>
                            
                            <div class="comparison-section">
                                <h4>연락처</h4>
                                ${massage.kakaoId ? 
                                    `<button class="btn btn-primary btn-sm" onclick="window.open('https://open.kakao.com/o/${massage.kakaoId}')">
                                        카톡 문의
                                    </button>` : 
                                    `<p>${massage.phone || '문의'}</p>`
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
window.contactMassage = contactMassage;
window.viewDetail = viewDetail;