// 에코걸 섹션 JavaScript

// 노션 색상을 CSS 색상으로 변환하는 매핑
const NOTION_COLOR_MAP = {
    'default': { bg: '#F3F4F6', text: '#374151' },
    'gray': { bg: '#F3F4F6', text: '#374151' },
    'brown': { bg: '#F5E6D3', text: '#92400E' },
    'orange': { bg: '#FED7AA', text: '#EA580C' },
    'yellow': { bg: '#FEF3C7', text: '#CA8A04' },
    'green': { bg: '#D1FAE5', text: '#059669' },
    'blue': { bg: '#DBEAFE', text: '#2563EB' },
    'purple': { bg: '#E9D5FF', text: '#7C3AED' },
    'pink': { bg: '#FCE7F3', text: '#DB2777' },
    'red': { bg: '#FEE2E2', text: '#DC2626' }
};

// 전역 변수
let ecogirlData = [];
let filteredData = [];
let activeFilters = {
    age: [],
    hobby: [],
    personality: [],
    language: []
};
let selectedForCompare = []; // 비교를 위해 선택된 프로필 ID들
let favoriteGirls = JSON.parse(localStorage.getItem('favoriteGirls') || '[]'); // 찜한 프로필들

// API 캐싱
const API_CACHE_KEY = 'ecogirl_data_cache';
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
async function loadEcogirlData() {
    const spinner = document.getElementById('loadingSpinner');
    spinner.classList.add('active');
    
    try {
        // 캐시 확인
        const cachedData = getCachedData();
        if (cachedData) {
            console.log('캐시된 데이터 사용');
            ecogirlData = cachedData.ecogirlData;
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
                database_id: '202e5f74c72e8188aeabf3176e9cb61c',
                api_key: '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',
                filter: {
                    property: "상태",
                    select: {
                        equals: "활성"
                    }
                },
                sorts: [
                    {
                        property: "ID",
                        direction: "ascending"
                    }
                ]
            })
        });
        
        if (!response.ok) {
            throw new Error('API 요청 실패');
        }
        
        const data = await response.json();
        
        // 디버깅: 원본 데이터 확인
        console.log('노션 원본 데이터:', data.results);
        
        ecogirlData = processEcogirlData(data.results);
        filteredData = [...ecogirlData];
        
        // 캐시에 저장
        setCachedData({
            ecogirlData: ecogirlData,
            filteredData: filteredData
        });
        
        console.log('처리된 에코걸 데이터:', ecogirlData);
        
        // 필터 생성
        generateFilters();
        
        renderCards();
        
    } catch (error) {
        console.error('에코걸 데이터 로드 실패:', error);
        showError();
    } finally {
        spinner.classList.remove('active');
    }
}

// 데이터 처리
function processEcogirlData(results) {
    return results.map(item => {
        const props = item.properties;
        
        // 원본 이미지 URL 가져오기
        const originalPhotoUrl = props['프로필사진']?.files?.[0]?.file?.url || 
                               props['프로필사진']?.files?.[0]?.external?.url || 
                               '/shared/images/logo/default.png';
        
        // 성향과 취미를 색상 정보와 함께 처리
        const personalities = props['성향']?.multi_select?.map(p => ({
            name: p.name,
            color: p.color || 'default'
        })) || [];
        
        const hobbies = props['취미']?.multi_select?.map(h => ({
            name: h.name,
            color: h.color || 'default'
        })) || [];
        
        return {
            id: props.ID?.number || 0,
            name: props['이름']?.title?.[0]?.plain_text || '이름 없음',
            age: props['나이']?.number || null,
            profilePhoto: originalPhotoUrl,  // 원본 URL 저장 (나중에 자동 변환)
            galleryPhotos: props['갤러리사진']?.files || [],
            introduction: props['자기소개']?.rich_text?.[0]?.plain_text || '',
            hobbiesData: hobbies,  // 색상 정보 포함
            personalitiesData: personalities,  // 색상 정보 포함
            hobbies: hobbies.map(h => h.name),  // 필터링용 이름만
            personalities: personalities.map(p => p.name),  // 필터링용 이름만
            languages: props['언어']?.multi_select?.map(l => l.name) || [],
            specialties: props['특기']?.multi_select?.map(s => s.name) || [],
            kakaoId: props['카카오톡ID']?.rich_text?.[0]?.plain_text || '',
            phone: props['전화번호']?.phone_number || ''
        };
    });
}

// 나이 범위 필터링
function checkAgeFilter(age, ageRange) {
    if (!age) return false;
    
    switch(ageRange) {
        case '18-22': return age >= 18 && age <= 22;
        case '23-25': return age >= 23 && age <= 25;
        case '26-30': return age >= 26 && age <= 30;
        case '30+': return age > 30;
        default: return false;
    }
}

// 카드 렌더링
function renderCards() {
    const container = document.getElementById('ecogirlCards');
    const countElement = document.getElementById('resultCount');
    
    container.innerHTML = '';
    
    if (filteredData.length === 0) {
        container.innerHTML = '<p class="no-results">조건에 맞는 프로필이 없습니다.</p>';
        countElement.textContent = '전체 0개';
        return;
    }
    
    countElement.textContent = `전체 ${filteredData.length}개`;
    
    filteredData.forEach(girl => {
        const card = createEcogirlCard(girl);
        container.appendChild(card);
    });
}

// 필터 동적 생성
function generateFilters() {
    // 중복 제거를 위한 Set 사용
    const hobbies = new Set();
    const personalities = new Set();
    const languages = new Set();
    
    // 데이터에서 유니크한 값들 추출
    ecogirlData.forEach(girl => {
        // 취미
        girl.hobbies.forEach(h => hobbies.add(h));
        
        // 성향
        girl.personalities.forEach(p => personalities.add(p));
        
        // 언어
        girl.languages.forEach(l => languages.add(l));
    });
    
    // 취미 필터 생성
    const hobbyContainer = document.getElementById('hobbyFilters');
    hobbyContainer.innerHTML = '';
    Array.from(hobbies).sort().forEach(hobby => {
        const label = createFilterCheckbox('hobby', hobby, hobby);
        hobbyContainer.appendChild(label);
    });
    
    // 성향 필터 생성
    const personalityContainer = document.getElementById('personalityFilters');
    personalityContainer.innerHTML = '';
    Array.from(personalities).sort().forEach(personality => {
        const label = createFilterCheckbox('personality', personality, personality);
        personalityContainer.appendChild(label);
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
function createEcogirlCard(girl) {
    const card = document.createElement('div');
    card.className = 'card ecogirl-card';  // 공용 card 클래스 + 에코걸 전용
    
    // 선택된 상태 확인
    const isSelected = selectedForCompare.includes(girl.id);
    if (isSelected) {
        card.classList.add('selected-for-compare');
    }
    
    // 찜한 상태 확인
    const isFavorite = favoriteGirls.includes(girl.id);
    
    // 태그 HTML 생성 (노션 색상 사용)
    const allTags = [...girl.personalitiesData, ...girl.hobbiesData].slice(0, 3);
    const tagHTML = allTags.map(tag => {
        const colorInfo = NOTION_COLOR_MAP[tag.color] || NOTION_COLOR_MAP.default;
        return `<span class="personality-tag" style="background: ${colorInfo.bg}; color: ${colorInfo.text};">${tag.name}</span>`;
    }).join('');
    
    // 언어 정보
    const hasKorean = girl.languages.includes('한국어');
    const languageText = hasKorean ? 
        '<span class="language-korean">한국어 가능</span>' : 
        '베트남어, 영어';
    
    // 카드 HTML
    card.innerHTML = `
        <button class="favorite-btn ${isFavorite ? 'active' : ''}" 
                onclick="toggleFavorite(${girl.id}, event)"
                title="찜하기">
            ${isFavorite ? '❤️' : '🤍'}
        </button>
        
        <div class="compare-checkbox" onclick="event.stopPropagation()">
            <input type="checkbox" id="compare-${girl.id}" 
                ${isSelected ? 'checked' : ''}
                onchange="toggleCompareSelection(${girl.id})">
            <label for="compare-${girl.id}">비교</label>
        </div>
        
        <div class="card-image">
            <img src="${girl.profilePhoto}" 
                 alt="${girl.name}" 
                 loading="lazy"
                 onerror="this.onerror=null; this.src='/shared/images/logo/default.png';">
            ${girl.age ? `<div class="age-badge">${girl.age}세</div>` : ''}
        </div>
        
        <div class="card-content">
            <h3 class="card-title">${girl.name}</h3>
            
            ${girl.introduction ? 
                `<p class="intro-text">${girl.introduction}</p>` : ''
            }
            
            ${tagHTML ? 
                `<div class="personality-tags">${tagHTML}</div>` : ''
            }
            
            <div class="language-info">${languageText}</div>
            
            <div class="card-actions">
                <button class="btn-action primary" onclick="contactGirl(${girl.id}, event)">
                    연락하기
                </button>
                <button class="btn-action" onclick="viewDetail(${girl.id}, event)">
                    프로필
                </button>
            </div>
        </div>
    `;
    
    return card;
}

// 찜하기 토글
function toggleFavorite(id, event) {
    event.stopPropagation();
    
    const index = favoriteGirls.indexOf(id);
    if (index > -1) {
        favoriteGirls.splice(index, 1);
    } else {
        favoriteGirls.push(id);
    }
    
    // 로컬 스토리지에 저장
    localStorage.setItem('favoriteGirls', JSON.stringify(favoriteGirls));
    
    // UI 업데이트
    renderCards();
}

// 연락 함수
function contactGirl(id, event) {
    event.stopPropagation();
    // 회사 카카오톡으로 연결 (개인 카톡 사용 안함)
    window.open(`https://open.kakao.com/o/gHDUmGRg`, '_blank');
}

// 상세 보기 함수
function viewDetail(id, event) {
    event.stopPropagation();
    // 에코걸 상세 페이지로 이동
    window.location.href = `ecogirl-detail.html?id=${id}`;
}

// 필터 리스너 설정
function setupFilterListeners() {
    // 초기화 버튼
    document.getElementById('resetFilters').addEventListener('click', resetFilters);
    
    // 나이 필터는 수동으로 이벤트 추가
    document.querySelectorAll('#ageFilters input').forEach(checkbox => {
        checkbox.addEventListener('change', handleFilterChange);
    });
}

// 필터 변경 처리
function handleFilterChange(e) {
    const filterType = e.target.name;
    const filterValue = e.target.value;
    const isChecked = e.target.checked;
    
    if (isChecked) {
        activeFilters[filterType].push(filterValue);
    } else {
        const index = activeFilters[filterType].indexOf(filterValue);
        if (index > -1) {
            activeFilters[filterType].splice(index, 1);
        }
    }
    
    applyFilters();
}

// 필터 적용
function applyFilters() {
    filteredData = ecogirlData.filter(girl => {
        // 나이 필터
        if (activeFilters.age.length > 0) {
            const matchesAge = activeFilters.age.some(ageRange => 
                checkAgeFilter(girl.age, ageRange)
            );
            if (!matchesAge) return false;
        }
        
        // 취미 필터
        if (activeFilters.hobby.length > 0) {
            const hasHobby = activeFilters.hobby.some(h => 
                girl.hobbies.includes(h)
            );
            if (!hasHobby) return false;
        }
        
        // 성향 필터
        if (activeFilters.personality.length > 0) {
            const hasPersonality = activeFilters.personality.some(p => 
                girl.personalities.includes(p)
            );
            if (!hasPersonality) return false;
        }
        
        // 언어 필터
        if (activeFilters.language.length > 0) {
            const hasLanguage = activeFilters.language.some(lang => 
                girl.languages.includes(lang)
            );
            if (!hasLanguage) return false;
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
        age: [],
        hobby: [],
        personality: [],
        language: []
    };
    
    // 전체 데이터 표시
    filteredData = [...ecogirlData];
    renderCards();
}

// 에러 표시
function showError() {
    const container = document.getElementById('ecogirlCards');
    container.innerHTML = `
        <div class="error-message">
            <p>데이터를 불러오는데 실패했습니다.</p>
            <p>프록시 서버가 실행 중인지 확인해주세요.</p>
        </div>
    `;
}

// ========== 비교 기능 ==========

// 비교 선택 토글
function toggleCompareSelection(girlId) {
    const index = selectedForCompare.indexOf(girlId);
    
    if (index > -1) {
        // 이미 선택된 경우 제거
        selectedForCompare.splice(index, 1);
    } else {
        // 최대 3명까지만 선택 가능
        if (selectedForCompare.length >= 3) {
            alert('최대 3명까지만 비교할 수 있습니다.');
            document.getElementById(`compare-${girlId}`).checked = false;
            return;
        }
        selectedForCompare.push(girlId);
    }
    
    updateCompareButton();
    
    // 카드 스타일 업데이트
    const card = document.getElementById(`compare-${girlId}`).closest('.card');
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
                    선택한 프로필 비교하기 (${selectedForCompare.length}명)
                </button>
                <button class="btn btn-ghost" onclick="clearCompareSelection()">
                    선택 취소
                </button>
            `;
            document.body.appendChild(compareButton);
        } else {
            // 버튼 텍스트 업데이트
            compareButton.querySelector('.btn-primary').textContent = 
                `선택한 프로필 비교하기 (${selectedForCompare.length}명)`;
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
    const selectedGirls = ecogirlData.filter(g => selectedForCompare.includes(g.id));
    
    // 비교 팝업 HTML 생성
    const popup = document.createElement('div');
    popup.className = 'comparison-popup';
    popup.innerHTML = `
        <div class="comparison-backdrop" onclick="closeComparison()"></div>
        <div class="comparison-modal">
            <div class="comparison-header">
                <h2>프로필 비교</h2>
                <button class="close-button" onclick="closeComparison()">✕</button>
            </div>
            <div class="comparison-content">
                <div class="comparison-grid">
                    ${selectedGirls.map(girl => {
                        // 태그 HTML 생성 (노션 색상 사용)
                        const allTags = [...girl.personalitiesData, ...girl.hobbiesData];
                        const tagHTML = allTags.map(tag => {
                            const colorInfo = NOTION_COLOR_MAP[tag.color] || NOTION_COLOR_MAP.default;
                            return `<span class="personality-tag" style="background: ${colorInfo.bg}; color: ${colorInfo.text};">${tag.name}</span>`;
                        }).join('');
                        
                        return `
                            <div class="comparison-card">
                                <img src="${girl.profilePhoto}" alt="${girl.name}" class="comparison-photo">
                                <h3>${girl.name}</h3>
                                <p class="comparison-age">${girl.age ? `${girl.age}세` : '나이 비공개'}</p>
                                
                                <div class="comparison-section">
                                    <h4>성향 & 취미</h4>
                                    <div class="comparison-tags">
                                        ${tagHTML}
                                    </div>
                                </div>
                                
                                <div class="comparison-section">
                                    <h4>언어</h4>
                                    <p>${girl.languages.join(', ') || '베트남어'}</p>
                                </div>
                                
                                ${girl.specialties && girl.specialties.length > 0 ? `
                                    <div class="comparison-section">
                                        <h4>특기</h4>
                                        <p>${girl.specialties.join(', ')}</p>
                                    </div>
                                ` : ''}
                                
                                <div class="comparison-section">
                                    <h4>연락처</h4>
                                    <button class="btn btn-primary btn-sm" onclick="window.open('https://open.kakao.com/o/gHDUmGRg')">
                                        카톡 문의
                                    </button>
                                </div>
                            </div>
                        `;
                    }).join('')}
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
window.toggleFavorite = toggleFavorite;
window.toggleCompareSelection = toggleCompareSelection;
window.showComparison = showComparison;
window.closeComparison = closeComparison;
window.clearCompareSelection = clearCompareSelection;
window.contactGirl = contactGirl;
window.viewDetail = viewDetail;

// 초기화
document.addEventListener('DOMContentLoaded', function() {
    loadEcogirlData();
    setupFilterListeners();
    
    // 헤더 스크롤 이벤트 강제 초기화
    setTimeout(() => {
        window.dispatchEvent(new Event('scroll'));
        console.log('스크롤 이벤트 수동 트리거');
    }, 500);
});