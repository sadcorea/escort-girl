// 마사지 상세 페이지 - 메인 컨트롤러 모듈
class MassageDetailMain {
    constructor() {
        this.dataLoader = window.massageDetailData;
        this.uiRenderer = window.massageDetailUI;
    }

    // 초기화 및 실행
    async init() {
        try {
            console.log('🚀 마사지 상세 페이지 초기화 시작...');
            
            // 모듈들 로드
            await this.loadModules();

            // 업체 데이터 로드
            const shop = await this.dataLoader.loadShopDetail();

            if (!shop) {
                throw new Error('업체 데이터를 찾을 수 없습니다.');
            }

            console.log('✅ 업체 데이터 로드 완료:', shop);

            // UI에 표시
            this.uiRenderer.displayShopInfo(shop);

        } catch (error) {
            console.error('❌ 초기화 실패:', error);
            
            // 더 구체적인 에러 메시지
            let errorMessage = '데이터를 불러올 수 없습니다.';
            if (error.message.includes('업체 ID가 없습니다')) {
                errorMessage = '업체 ID가 올바르지 않습니다.';
            } else if (error.message.includes('업체 정보를 찾을 수 없습니다')) {
                errorMessage = '해당 업체 정보를 찾을 수 없습니다.';
            } else if (error.message.includes('HTTP')) {
                errorMessage = '서버 연결에 문제가 있습니다. 잠시 후 다시 시도해주세요.';
            }
            
            this.uiRenderer.showError(errorMessage);
        }
    }

    // 모듈들 로드
    async loadModules() {
        try {
            // 사진 모듈 로드
            const imageResponse = await fetch('shop-image.html');
            const imageHTML = await imageResponse.text();
            document.getElementById('imageModule').innerHTML = imageHTML;

            // 설명 모듈 로드
            const infoResponse = await fetch('shop-info.html');
            const infoHTML = await infoResponse.text();
            document.getElementById('infoModule').innerHTML = infoHTML;

        } catch (error) {
            console.error('❌ 모듈 로드 실패:', error);
        }
    }
}

// 네비게이션 함수들 (전역)
function goToHome() {
    window.location.href = '../index.html';
}

function goToMassageList() {
    window.location.href = 'index.html';
}

// 헤더 메뉴 연락처 함수들 (에코걸과 동일)
function handleKakaoContact() {
    navigator.clipboard.writeText('EchoPal_vip').then(() => {
        alert('카카오톡 ID가 복사되었습니다: EchoPal_vip');
    }).catch(() => {
        prompt('카카오톡 ID를 복사하세요:', 'EchoPal_vip');
    });
}

function handlePhoneContact() {
    window.location.href = 'tel:+84-905-123-456';
}

// 페이지 로드 시 실행
document.addEventListener('DOMContentLoaded', () => {
    const massageDetailMain = new MassageDetailMain();
    massageDetailMain.init();
});

// 전역 변수로 인스턴스 생성
window.massageDetailMain = new MassageDetailMain();