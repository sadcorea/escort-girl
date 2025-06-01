// 🔗 Notion API 연결 모듈
class NotionAPI {
    constructor() {
        // 실제 API 키와 데이터베이스 ID
        this.apiKey = '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';
        this.databaseId = '202e5f74-c72e-8188-aeab-f3176e9cb61c';
        this.baseUrl = 'https://api.notion.com/v1';
    }

    // 📄 모든 에코걸 프로필 가져오기
    async getAllProfiles() {
        try {
            const response = await fetch(`${this.baseUrl}/databases/${this.databaseId}/query`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json',
                    'Notion-Version': '2022-06-28'
                },
                body: JSON.stringify({
                    filter: {
                        property: '상태',
                        select: {
                            equals: '활성'
                        }
                    },
                    sorts: [
                        {
                            property: 'ID',
                            direction: 'ascending'
                        }
                    ]
                })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(`Notion API Error: ${data.message}`);
            }

            return this.formatProfiles(data.results);
        } catch (error) {
            console.error('❌ 노션 프로필 로드 실패:', error);
            return [];
        }
    }

    // 📄 특정 프로필 상세 정보 가져오기
    async getProfile(id) {
        try {
            const profiles = await this.getAllProfiles();
            return profiles.find(profile => profile.id === id);
        } catch (error) {
            console.error('❌ 노션 개별 프로필 로드 실패:', error);
            return null;
        }
    }

    // 🔧 노션 데이터 포맷 변환
    formatProfiles(results) {
        return results.map(page => {
            const props = page.properties;
            
            return {
                id: this.getProperty(props.ID, 'number'),
                name: this.getProperty(props.이름, 'title'),
                age: this.getProperty(props.나이, 'number'),
                mainImage: this.getImageUrl(props.프로필사진),
                galleryImages: this.getImageUrls(props.갤러리사진),
                languages: this.getMultiSelect(props.언어),
                hobbies: this.getMultiSelect(props.취미),
                personality: this.getMultiSelect(props.성향),
                skills: this.getMultiSelect(props.특기),
                introduction: this.getProperty(props.자기소개, 'rich_text'),
                contact: this.getProperty(props.카카오톡ID, 'rich_text'),
                phone: this.getProperty(props.전화번호, 'phone_number'),
                status: this.getProperty(props.상태, 'select'),
                createdAt: this.getProperty(props.생성일, 'created_time')
            };
        });
    }

    // 🔧 속성값 추출 헬퍼 함수들
    getProperty(prop, type) {
        if (!prop || !prop[type]) return '';
        
        switch (type) {
            case 'title':
                return prop.title[0]?.plain_text || '';
            case 'rich_text':
                return prop.rich_text.map(t => t.plain_text).join('') || '';
            case 'number':
                return prop.number || 0;
            case 'select':
                return prop.select?.name || '';
            case 'phone_number':
                return prop.phone_number || '';
            case 'created_time':
                return prop.created_time || '';
            default:
                return '';
        }
    }

    getMultiSelect(prop) {
        if (!prop || !prop.multi_select) return [];
        return prop.multi_select.map(item => item.name);
    }

    getImageUrl(prop) {
        if (!prop || !prop.files || prop.files.length === 0) return '';
        const file = prop.files[0];
        return file.type === 'file' ? file.file.url : file.external.url;
    }

    getImageUrls(prop) {
        if (!prop || !prop.files) return [];
        return prop.files.map(file => 
            file.type === 'file' ? file.file.url : file.external.url
        );
    }

    // 🔧 이미지 URL 프록시 처리 (노션 이미지 만료 문제 해결)
    getProxiedImageUrl(notionUrl) {
        if (!notionUrl) return '';
        // 노션 이미지를 프록시 서버를 통해 캐싱하거나
        // 로컬에 다운로드해서 사용하는 방식 구현
        return notionUrl;
    }
}

// 전역으로 내보내기
window.NotionAPI = NotionAPI;
