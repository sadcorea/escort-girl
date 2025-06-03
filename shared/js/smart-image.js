/**
 * 🖼️ 스마트 이미지 유틸리티
 * 노션 이미지를 자동으로 최적화해주는 헬퍼 함수들
 */

// 이미지 타입별 기본 크기 설정
const IMAGE_SIZES = {
    thumbnail: 300,    // 작은 썸네일
    card: 500,        // 카드 이미지
    detail: 800,      // 상세 페이지
    gallery: 600,     // 갤러리
    full: null        // 원본
};

/**
 * 스마트 이미지 URL 생성
 * @param {string} url - 원본 이미지 URL
 * @param {string} type - 이미지 타입 (thumbnail, card, detail, gallery, full)
 * @returns {string} - 최적화된 이미지 URL
 */
function getSmartImageUrl(url, type = 'card') {
    // URL이 없으면 기본 이미지 반환
    if (!url || url === '') {
        return '/shared/images/logo/default.png';
    }
    
    // 이미 기본 이미지면 그대로 반환
    if (url.includes('/shared/images/logo/default.png')) {
        return url;
    }
    
    // 노션 S3 URL인지 확인
    if (url.includes('amazonaws.com') || url.includes('notion.so')) {
        const size = IMAGE_SIZES[type];
        
        // 원본 요청이면 그대로 반환
        if (!size) return url;
        
        // 이미 파라미터가 있는지 확인
        if (url.includes('?')) {
            // 기존 파라미터 제거하고 새로 추가
            return url.split('?')[0] + `?w=${size}`;
        } else {
            // 새로 파라미터 추가
            return url + `?w=${size}`;
        }
    }
    
    // 노션 URL이 아니면 그대로 반환
    return url;
}

/**
 * 반응형 이미지 속성 생성
 * @param {string} url - 원본 이미지 URL
 * @returns {object} - srcset과 sizes 속성 객체
 */
function getResponsiveImageAttrs(url) {
    if (!url || url.includes('default.png')) {
        return { src: url || '/shared/images/logo/default.png' };
    }
    
    // 다양한 크기의 URL 생성
    const small = getSmartImageUrl(url, 'thumbnail');
    const medium = getSmartImageUrl(url, 'card');
    const large = getSmartImageUrl(url, 'detail');
    
    return {
        src: medium, // 기본값
        srcset: `${small} 300w, ${medium} 500w, ${large} 800w`,
        sizes: '(max-width: 600px) 300px, (max-width: 1024px) 500px, 800px'
    };
}

/**
 * 이미지 엘리먼트 생성 (완전 자동화)
 * @param {string} url - 원본 이미지 URL
 * @param {string} alt - 대체 텍스트
 * @param {string} type - 이미지 타입
 * @param {string} className - CSS 클래스
 * @returns {string} - HTML 문자열
 */
function createSmartImage(url, alt = '', type = 'card', className = '') {
    const attrs = getResponsiveImageAttrs(url);
    
    return `
        <img 
            src="${attrs.src}"
            ${attrs.srcset ? `srcset="${attrs.srcset}"` : ''}
            ${attrs.sizes ? `sizes="${attrs.sizes}"` : ''}
            alt="${alt}"
            class="${className}"
            loading="lazy"
            onerror="this.onerror=null; this.src='/shared/images/logo/default.png';"
        >
    `;
}

// 전역으로 내보내기
window.SmartImage = {
    getUrl: getSmartImageUrl,
    getAttrs: getResponsiveImageAttrs,
    create: createSmartImage,
    SIZES: IMAGE_SIZES
};