// 노션 API 테스트 스크립트
const https = require('https');

// 설정
const API_KEY = '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';
const DATABASE_ID = '202e5f74c72e80ad8049c65ef05fdc6b';

console.log('🔄 노션 API 연결 테스트 시작...');

// 연결 테스트 함수
function testConnection() {
    const options = {
        hostname: 'api.notion.com',
        port: 443,
        path: `/v1/databases/${DATABASE_ID}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28'
        }
    };

    const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                const result = JSON.parse(data);
                console.log('✅ 노션 API 연결 성공!');
                console.log(`데이터베이스 제목: ${result.title[0]?.plain_text || '제목 없음'}`);
                console.log(`속성 개수: ${Object.keys(result.properties).length}개`);
                
                // 데이터 조회 테스트
                testQuery();
            } else {
                console.log('❌ 연결 실패:', res.statusCode);
                console.log(data);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ 네트워크 오류:', error.message);
    });

    req.end();
}

// 데이터 조회 테스트
function testQuery() {
    const postData = JSON.stringify({
        page_size: 5
    });

    const options = {
        hostname: 'api.notion.com',
        port: 443,
        path: `/v1/databases/${DATABASE_ID}/query`,
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${API_KEY}`,
            'Content-Type': 'application/json',
            'Notion-Version': '2022-06-28',
            'Content-Length': Buffer.byteLength(postData)
        }
    };

    const req = https.request(options, (res) => {
        let data = '';

        res.on('data', (chunk) => {
            data += chunk;
        });

        res.on('end', () => {
            if (res.statusCode === 200) {
                const result = JSON.parse(data);
                console.log('\n✅ 데이터 조회 성공!');
                console.log(`총 ${result.results.length}개 항목 조회됨`);
                
                if (result.results.length > 0) {
                    console.log('\n📄 조회된 프로필들:');
                    result.results.forEach((item, index) => {
                        const props = item.properties;
                        const name = props['이름']?.title?.[0]?.plain_text || '이름 없음';
                        const id = props['**ID**']?.number || '번호 없음';
                        const age = props['**나이**']?.number || '나이 없음';
                        
                        console.log(`[${index + 1}] ${name} (ID: ${id}, 나이: ${age})`);
                        
                        // 언어 정보
                        const languages = props['**언어**']?.multi_select?.map(item => item.name) || [];
                        if (languages.length > 0) {
                            console.log(`    언어: ${languages.join(', ')}`);
                        }
                        
                        // 취미 정보  
                        const hobbies = props['**취미**']?.multi_select?.map(item => item.name) || [];
                        if (hobbies.length > 0) {
                            console.log(`    취미: ${hobbies.join(', ')}`);
                        }
                    });
                }
            } else {
                console.log('❌ 데이터 조회 실패:', res.statusCode);
                console.log(data);
            }
        });
    });

    req.on('error', (error) => {
        console.error('❌ 네트워크 오류:', error.message);
    });

    req.write(postData);
    req.end();
}

// 테스트 시작
testConnection();
