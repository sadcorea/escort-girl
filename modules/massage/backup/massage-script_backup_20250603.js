// 마사지 섹션 JavaScript

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

// 헤더 스크롤 처리 (공용 헤더용으로 수정)
let lastScrollTop = 0;

window.addEventListener('scroll', function() {
    const header = document.getElementById('main-header');
    if (!header) return;
    
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    
    if (scrollTop > lastScrollTop && scrollTop > 80) {
        // 아래로 스크롤 - 헤더 숨기기
        header.classList.add('hide');
    } else {
        // 위로 스크롤 - 헤더 보이기
        header.classList.remove('hide');
    }
    
    lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
});

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadMassageData();
    setupFilterListeners();
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
        
        renderCards();
        
    } catch (error) {
        console.error('마사지 데이터 로드 실패:', error);
        showError();
    } finally {
        spinner.classList.remove('active');
    }
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
            location: getLocationCategory(props['vn 업체주소']?.rich_text?.[0]?.plain_text || '')
        };
    }).filter(item => item !== null);  // null 제거
}

// 주소에서 지역 카테고리 추출
function getLocationCategory(address) {
    if (address.includes('한시장') || address.includes('Han Market')) return '한시장';
    if (address.includes('미케') || address.includes('My Khe')) return '미케비치';
    if (address.includes('썬짜') || address.includes('Son Tra') || address.includes('Sơn Trà')) return '썬짜';
    if (address.includes('하이쩌우') || address.includes('Hai Chau') || address.includes('Hải Châu')) return '하이쩌우';
    return '';
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

// 카드 생성
function createMassageCard(massage) {
    const card = document.createElement('div');
    card.className = 'card massage-card';  // 공용 card 클래스 + 마사지 전용
    
    // 선택된 상태 확인
    const isSelected = selectedForCompare.includes(massage.id);
    if (isSelected) {
        card.classList.add('selected-for-compare');
    }
    
    // 서비스 태그 HTML 생성
    const serviceTags = massage.services.map(service => 
        `<span class="service-tag tag-${service}">${service}</span>`
    ).join('');
    
    // 언어 표시
    let languageText = '';
    if (massage.languages.length === 1) {
        languageText = massage.languages[0];
    } else if (massage.languages.length > 1) {
        languageText = massage.languages.join(', ');
    } else {
        languageText = '문의';
    }
    
    // 카드 HTML
    card.innerHTML = `
        <div class="compare-checkbox" onclick="event.stopPropagation()">
            <input type="checkbox" id="compare-${massage.id}" 
                ${isSelected ? 'checked' : ''}
                onchange="toggleCompareSelection(${massage.id})">
            <label for="compare-${massage.id}">비교</label>
        </div>
        
        <div class="card-header">
            <img src="${massage.logo || defaultImage}" alt="${massage.name}" class="card-logo">
            <div class="card-title-wrapper">
                <h3 class="card-title">${massage.name}</h3>
            </div>
        </div>
        
        <div class="service-tags">
            ${serviceTags}
        </div>
        
        <div class="card-info">
            <div class="info-item language-info">
                <span>${languageText}${languageText === '문의' ? '' : ' 가능'}</span>
            </div>
            ${massage.benefit ? 
                `<div class="benefit-badge">🎁 ${massage.benefit}</div>` : 
                ''
            }
        </div>
        
        ${massage.promotion ? 
            `<div class="card-overlay">
                <p class="overlay-text">${massage.promotion}</p>
            </div>` : 
            ''
        }
    `;
    
    // 클릭 이벤트
    card.addEventListener('click', (e) => {
        // 체크박스 영역이 아닌 경우에만 상세 페이지로 이동
        if (!e.target.closest('.compare-checkbox')) {
            // 상세 페이지로 이동 (추후 구현)
            console.log('마사지 상세:', massage);
        }
    });
    
    return card;
}

// 필터 리스너 설정
function setupFilterListeners() {
    // 체크박스 이벤트
    const checkboxes = document.querySelectorAll('.filter-checkbox input');
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });
    
    // 초기화 버튼
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