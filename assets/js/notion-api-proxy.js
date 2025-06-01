// 🔗 노션 API 연결 모듈 (프록시 서버 사용)
class NotionAPI {
    constructor() {
        // 프록시 서버를 통한 API 호출
        this.proxyUrl = 'http://localhost:8080/api/notion';
        this.apiKey = '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';
        this.databaseId = '202e5f74-c72e-8188-aeab-f3176e9cb61c';
    }

    // 📄 모든 에코걸 프로필 가져오기
    async getAllProfiles() {
        try {
            console.log('🔄 노션 API 호출 시작...');
            
            const response = await fetch(this.proxyUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    api_key: this.apiKey,
                    database_id: this.databaseId
                })
            });

            console.log('📡 응답 상태:', response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ 응답 오류:', errorText);
                throw new Error(`HTTP ${response.status}: ${errorText}`);
            }

            const data = await response.json();
            console.log('📄 노션 응답 데이터:', data);
            
            if (data.error) {
                throw new Error(`Notion Error: ${data.error}`);
            }

            const profiles = this.formatProfiles(data.results || []);
            console.log('✅ 포맷된 프로필:', profiles);
            
            return profiles;
        } catch (error) {
            console.error('❌ 노션 프로필 로드 실패:', error);
            throw error;
        }
    }

    // 📄 특정 프로필 상세 정보 가져오기
    async getProfile(id) {
        try {
            console.log(`🔍 프로필 ID ${id} 검색 중...`);
            const profiles = await this.getAllProfiles();
            const profile = profiles.find(profile => profile.id === id);
            console.log(`👤 찾은 프로필:`, profile);
            return profile || null;
        } catch (error) {
            console.error('❌ 노션 개별 프로필 로드 실패:', error);
            throw error;
        }
    }

    // 🔧 노션 데이터 포맷 변환
    formatProfiles(results) {
        console.log('🔧 데이터 포맷 변환 시작:', results.length + '개');
        
        return results.map((page, index) => {
            console.log(`📋 프로필 ${index + 1} 처리 중:`, page);
            console.log(`📋 프로필 ${index + 1} 속성들:`, page.properties);
            
            const props = page.properties;
            
            // ID 디버깅
            console.log('🔍 ID 속성 상세:', props.ID);
            const idValue = this.getProperty(props.ID, 'number');
            console.log('🔍 처리된 ID 값:', idValue);
            
            const formatted = {
                id: idValue, // 숫자형 ID (1, 2, 3, 4, 5)
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
            
            console.log(`✅ 포맷된 프로필 ${index + 1}:`, formatted);
            
            return formatted;
        });
    }

    // 🔧 속성값 추출 헬퍼 함수들
    getProperty(prop, type) {
        if (!prop || !prop[type]) {
            console.log(`⚠️ 속성 없음: ${type}`, prop);
            return type === 'number' ? 0 : '';
        }
        
        let result;
        switch (type) {
            case 'title':
                result = prop.title[0]?.plain_text || '';
                break;
            case 'rich_text':
                result = prop.rich_text.map(t => t.plain_text).join('') || '';
                break;
            case 'number':
                result = prop.number || 0;
                break;
            case 'select':
                result = prop.select?.name || '';
                break;
            case 'phone_number':
                result = prop.phone_number || '';
                break;
            case 'created_time':
                result = prop.created_time || '';
                break;
            default:
                result = '';
        }
        
        console.log(`🔧 속성 추출 [${type}]:`, result);
        return result;
    }

    getMultiSelect(prop) {
        if (!prop || !prop.multi_select) {
            console.log('⚠️ 멀티셀렉트 속성 없음:', prop);
            return [];
        }
        const result = prop.multi_select.map(item => item.name);
        console.log('🏷️ 멀티셀렉트:', result);
        return result;
    }

    getImageUrl(prop) {
        if (!prop || !prop.files || prop.files.length === 0) {
            console.log('⚠️ 이미지 파일 없음:', prop);
            return '';
        }
        const file = prop.files[0];
        const url = file.type === 'file' ? file.file.url : file.external.url;
        console.log('🖼️ 이미지 URL:', url);
        return url;
    }

    getImageUrls(prop) {
        if (!prop || !prop.files) {
            console.log('⚠️ 갤러리 이미지 없음:', prop);
            return [];
        }
        const urls = prop.files.map(file => 
            file.type === 'file' ? file.file.url : file.external.url
        );
        console.log('🖼️ 갤러리 URLs:', urls);
        return urls;
    }

    // 📄 특정 ID의 에코걸 프로필 가져오기
    async getProfile(targetId) {
        try {
            console.log(`🔍 프로필 검색 시작 - ID: ${targetId}`);
            
            // 모든 프로필 로드
            const profiles = await this.getAllProfiles();
            
            if (!profiles || profiles.length === 0) {
                throw new Error('프로필 목록을 불러올 수 없습니다.');
            }
            
            console.log('📋 모든 프로필 ID 목록:', profiles.map(p => ({ id: p.id, name: p.name })));
            
            // ID 매칭 (숫자형 직접 비교)
            const targetNum = parseInt(targetId);
            console.log(`🎯 검색할 ID: ${targetId} (숫자형: ${targetNum})`);
            
            const profile = profiles.find(p => {
                console.log(`🔍 ID 비교: 프로필 ${p.id}(${typeof p.id}) vs 검색 ${targetNum}(${typeof targetNum})`);
                return p.id === targetNum;
            });
            
            if (!profile) {
                console.error(`❌ ID ${targetId}번 프로필을 찾을 수 없습니다.`);
                console.log('📋 사용 가능한 프로필들:', profiles.map(p => ({ id: p.id, name: p.name })));
                throw new Error(`ID ${targetId}번 프로필을 찾을 수 없습니다.`);
            }
            
            console.log(`✅ 프로필 찾음:`, profile);
            return profile;
            
        } catch (error) {
            console.error('❌ 개별 프로필 로드 실패:', error);
            throw error;
        }
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
