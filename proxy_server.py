from http.server import HTTPServer, SimpleHTTPRequestHandler
import json
import urllib.request
import urllib.parse
from urllib.error import HTTPError

class CORSRequestHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
        super().end_headers()
    
    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()
    
    def do_POST(self):
        if self.path == '/api/notion':
            self.handle_notion_proxy()
        else:
            super().do_POST()
    
    def handle_notion_proxy(self):
        try:
            # 요청 데이터 읽기
            content_length = int(self.headers['Content-Length'])
            post_data = self.rfile.read(content_length)
            request_data = json.loads(post_data.decode('utf-8'))
            
            print(f"🔍 받은 요청 DB ID: {request_data['database_id']}")
            
            # 노션 API 호출
            notion_url = f"https://api.notion.com/v1/databases/{request_data['database_id']}/query"
            
            # 요청 헤더 설정
            headers = {
                'Authorization': f"Bearer {request_data['api_key']}",
                'Content-Type': 'application/json',
                'Notion-Version': '2022-06-28'
            }
            
            # 필터 데이터 준비 (DB별 구분)
            massage_db_ids = ['203e5f74c72e815d8f39d2946ee85c0a', '203e5f74-c72e-815d-8f39-d2946ee85c0a']
            poolvilla_db_ids = ['205e5f74c72e81e299e3c54e615d0d68', '205e5f74-c72e-81e2-99e3-c54e615d0d68']
            
            if request_data['database_id'] in massage_db_ids:
                # 마사지 DB - 필터 없이 모든 데이터
                print("🔧 마사지 DB 접근 - 필터 없이 처리")
                filter_data = {
                    "sorts": [
                        {
                            "property": "ID",
                            "direction": "ascending"
                        }
                    ]
                }
            elif request_data['database_id'] in poolvilla_db_ids:
                # 풀빌라 DB - 활성 상태만 필터링
                print("🏊‍♀️ 풀빌라 DB 접근 - 활성 상태만 처리")
                filter_data = {
                    "filter": {
                        "property": "계약상태",
                        "select": {
                            "equals": "🟢 활성"
                        }
                    },
                    "sorts": [
                        {
                            "property": "ID",
                            "direction": "ascending"
                        }
                    ]
                }
            else:
                # 에코걸 DB - 상태 필터 적용
                filter_data = {
                    "filter": {
                        "property": "상태",
                        "select": {
                            "equals": "활성"
                        }
                    },
                    "sorts": [
                        {
                            "property": "ID",
                            "direction": "ascending"
                        }
                    ]
                }
            
            # 노션 API 요청
            req = urllib.request.Request(
                notion_url,
                data=json.dumps(filter_data).encode('utf-8'),
                headers=headers,
                method='POST'
            )
            
            with urllib.request.urlopen(req) as response:
                result = json.loads(response.read().decode('utf-8'))
            
            # 응답 전송
            self.send_response(200)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps(result).encode('utf-8'))
            
        except HTTPError as e:
            error_body = e.read().decode('utf-8')
            print(f"Notion API Error: {e.code} - {error_body}")
            
            self.send_response(e.code)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "error": f"Notion API Error: {e.code}",
                "details": error_body
            }).encode('utf-8'))
            
        except Exception as e:
            print(f"Proxy Error: {str(e)}")
            
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.end_headers()
            self.wfile.write(json.dumps({
                "error": "Proxy Server Error",
                "details": str(e)
            }).encode('utf-8'))

if __name__ == '__main__':
    server = HTTPServer(('localhost', 8080), CORSRequestHandler)
    print("🚀 프록시 서버 시작: http://localhost:8080")
    print("📁 파일 서버도 함께 실행됩니다.") 
    print("🔗 홈페이지: http://localhost:8080/index.html")
    print("🔗 마사지 상세:  http://localhost:8080/massage/detail.html?id=1")
    print("🔗 마사지 업체 전체: http://localhost:8080/massage/index.html")
    print("🔗 마사지: http://localhost:8080/sections/massage-section.html")
    print("🔗 풀빌라 전체: http://localhost:8080/poolvilla/index.html")
    print("🔗 풀빌라 상세: http://localhost:8080/poolvilla/detail.html?id=1")    
    print("🔗 테스트 페이지: http://localhost:8080/test-notion.html")
    server.serve_forever()

#python proxy_server.py