// 플로팅 연락 버튼 공용 스크립트

// 플로팅 연락 버튼 설정
function setupFloatingContact(contactInfo) {
    // 기본 Grab 링크
    const grabBtn = document.getElementById('grabBtn');
    if (grabBtn) {
        grabBtn.href = 'https://grab.onelink.me/2695613898?pid=website&c=website&af_dp=grab%3A%2F%2F&af_web_dp=https%3A%2F%2Fwww.grab.com%2Fvn%2F';
    }

    // 카카오톡 설정
    const kakaoBtn = document.getElementById('kakaoBtn');
    if (kakaoBtn && contactInfo.kakaoId) {
        kakaoBtn.href = `https://open.kakao.com/o/${contactInfo.kakaoId}`;
        kakaoBtn.style.display = 'flex';
    }

    // 전화 설정
    const phoneBtn = document.getElementById('phoneBtn');
    if (phoneBtn && contactInfo.phone) {
        phoneBtn.href = `tel:${contactInfo.phone}`;
        phoneBtn.style.display = 'flex';
    }
}

// 플로팅 연락 버튼 로드
async function loadFloatingContact(contactInfo = {}) {
    try {
        // 현재 페이지의 경로를 기준으로 shared 폴더까지의 상대 경로 계산
        const currentPath = window.location.pathname;
        const depth = (currentPath.match(/\//g) || []).length - 1;
        const basePath = '../'.repeat(depth);
        const sharedPath = basePath + 'shared/';
        
        console.log('현재 경로:', currentPath);
        console.log('depth:', depth);
        console.log('shared 경로:', sharedPath);
        
        // CSS 파일 로드 (한 번만)
        if (!document.querySelector('#floating-contact-style')) {
            const link = document.createElement('link');
            link.id = 'floating-contact-style';
            link.rel = 'stylesheet';
            link.href = sharedPath + 'styles/floating-contact.css';
            document.head.appendChild(link);
            console.log('CSS 로드:', link.href);
        }

        // 이미 존재하면 제거
        const existing = document.getElementById('floatingContact');
        if (existing) {
            existing.remove();
        }

        const floatingHtmlPath = sharedPath + 'components/floating-contact.html';
        console.log('HTML 로드 경로:', floatingHtmlPath);
        
        const response = await fetch(floatingHtmlPath);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const html = await response.text();
        
        // 임시 컨테이너에 HTML 삽입
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        
        // 플로팅 컨텍트 요소 추출
        const floatingContact = tempDiv.querySelector('.floating-contact');
        
        // body에 직접 추가
        if (floatingContact) {
            document.body.appendChild(floatingContact);
            
            // 연락처 정보 설정
            if (contactInfo) {
                setupFloatingContact(contactInfo);
            }
        }
    } catch (error) {
        console.error('플로팅 연락 버튼 로드 실패:', error);
    }
}

// 전역 함수로 내보내기
window.loadFloatingContact = loadFloatingContact;
window.setupFloatingContact = setupFloatingContact;
