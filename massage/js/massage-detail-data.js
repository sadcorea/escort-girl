// 마사지 상세 페이지 - 데이터 로드 모듈
class MassageDetailData {
    constructor() {
        this.currentShop = null;
        this.massageDbId = '203e5f74-c72e-815d-8f39-d2946ee85c0a';
        this.apiKey = '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'; // 에코걸과 동일한 API 키
    }

    // URL에서 업체 ID 가져오기
    getShopIdFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('id');
    }

    // 업체 상세 정보 로드
    async loadShopDetail() {
        const shopId = this.getShopIdFromUrl();
        
        if (!shopId) {
            throw new Error('업체 ID가 없습니다.');
        }

        try {
            // 노션에서 마사지 업체 데이터 로드 시도
            const notionData = await this.loadFromNotion();
            if (notionData && notionData.length > 0) {
                const shop = notionData.find(s => s.id === parseInt(shopId));
                if (shop) {
                    this.currentShop = shop;
                    return shop;
                }
            }

            // 노션에서 찾을 수 없으면 백업 데이터 사용
            const backupData = await this.loadBackupData();
            const shop = backupData.find(s => s.id === parseInt(shopId));
            
            if (shop) {
                this.currentShop = shop;
                return shop;
            } else {
                throw new Error('업체 정보를 찾을 수 없습니다.');
            }

        } catch (error) {
            console.error('❌ 데이터 로드 실패:', error);
            throw error;
        }
    }

    // 노션에서 데이터 로드
    async loadFromNotion() {
        try {
            console.log('🔄 노션 API 호출 시작...');
            console.log('📡 API 키:', this.apiKey ? '✅ 설정됨' : '❌ 없음');
            console.log('📊 DB ID:', this.massageDbId);
            
            const response = await fetch('http://localhost:8080/api/notion', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    api_key: this.apiKey,
                    database_id: this.massageDbId,
                    sorts: [
                        {
                            property: 'ID',
                            direction: 'ascending'
                        }
                    ]
                })
            });

            console.log('📡 응답 상태:', response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ API 응답 오류:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log('📡 노션 데이터 로드 성공:', data);

            if (data.error) {
                console.error('❌ 노션 API 에러:', data.error);
                throw new Error(`Notion Error: ${data.error}`);
            }

            return data.results?.map(item => {
                const properties = item.properties;
                return {
                    id: this.getProperty(properties.ID, 'number'),
                    name: this.getProperty(properties['업체명'], 'title'),
                    phone: this.getProperty(properties['연락처'], 'phone_number'),
                    address: this.getProperty(properties['업체주소'], 'rich_text'),
                    krAddress: this.getProperty(properties['kr 업체주소'], 'rich_text'),
                    vnAddress: this.getProperty(properties['vn 업체주소'], 'rich_text'),
                    gps: this.getProperty(properties['GPS좌표'], 'rich_text'),
                    services: this.getProperty(properties['서비스종류'], 'multi_select'),
                    languages: this.getProperty(properties['언어지원'], 'multi_select'),
                    operatingHours: this.getProperty(properties['운영시간'], 'rich_text'),
                    holidays: this.getProperty(properties['휴무일'], 'multi_select'),
                    adText: this.getProperty(properties['홍보문구'], 'rich_text'),
                    specialOffer: this.getProperty(properties['특별혜택'], 'rich_text'),
                    kakaoId: this.getProperty(properties['카카오ID'], 'rich_text'),
                    image: this.getProperty(properties['업체사진'], 'files')?.[0], // 메인 이미지
                    images: this.getProperty(properties['업체사진'], 'files'), // 모든 이미지들
                    status: this.getProperty(properties['계약상태'], 'select')
                };
            }) || [];

        } catch (error) {
            console.error('⚠️ 노션 연동 실패:', error);
            return null;
        }
    }

    // 백업 데이터 로드
    async loadBackupData() {
        try {
            const response = await fetch('../data/massage-ads.json');
            const data = await response.json();
            console.log('📦 백업 데이터 로드 성공:', data);
            
            // 백업 데이터 구조에 맞게 변환
            const backupShops = data.ads?.map(ad => ({
                id: ad.id,
                name: ad.name,
                phone: ad.contact || '',
                address: ad.location || '',
                adText: ad.description || '',
                image: ad.image || null,
                services: ['마사지'],
                languages: ['한국어'],
                gps: null,
                operatingHours: '예약 시 문의',
                holidays: [],
                specialOffer: null,
                kakaoId: 'dnred_ad'
            })) || [];
            
            return backupShops;
        } catch (error) {
            console.error('⚠️ 백업 데이터 로드 실패:', error);
            return [];
        }
    }

    // 노션 속성 값 추출
    getProperty(property, type) {
        if (!property) return null;

        switch (type) {
            case 'title':
                return property.title?.[0]?.plain_text || '';
            case 'rich_text':
                return property.rich_text?.[0]?.plain_text || '';
            case 'number':
                return property.number || 0;
            case 'phone_number':
                return property.phone_number || '';
            case 'select':
                return property.select?.name || '';
            case 'multi_select':
                return property.multi_select?.map(item => item.name) || [];
            case 'files':
                return property.files?.map(file => {
                    if (file.type === 'file') {
                        return file.file.url;
                    } else if (file.type === 'external') {
                        return file.external.url;
                    }
                    return '';
                }).filter(url => url) || [];
            default:
                return property;
        }
    }

    // 현재 업체 정보 반환
    getCurrentShop() {
        return this.currentShop;
    }
}

// 전역 변수로 인스턴스 생성
window.massageDetailData = new MassageDetailData();