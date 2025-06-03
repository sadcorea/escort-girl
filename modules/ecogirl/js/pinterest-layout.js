/**
 * Pinterest 스타일 레이아웃 매니저
 * 이미지를 절대 위치로 배치하여 레이아웃 시프트 방지
 */

class PinterestLayout {
    constructor(options = {}) {
        this.container = options.container || '.pinterest-grid';
        this.itemSelector = options.itemSelector || '.photo-item';
        this.columnWidth = options.columnWidth || 250;
        this.gutter = options.gutter || 16;
        this.columns = [];
        this.items = [];
        this.resizeTimer = null;
        
        this.init();
    }
    
    init() {
        // 컨테이너 설정
        const container = document.querySelector(this.container);
        if (!container) return;
        
        container.style.position = 'relative';
        
        // 리사이즈 이벤트
        window.addEventListener('resize', () => {
            clearTimeout(this.resizeTimer);
            this.resizeTimer = setTimeout(() => {
                this.refresh();
            }, 300);
        });
    }
    
    // 컬럼 수 계산
    calculateColumns() {
        const container = document.querySelector(this.container);
        if (!container) return 1;
        
        const containerWidth = container.offsetWidth;
        const cols = Math.floor(containerWidth / (this.columnWidth + this.gutter));
        return Math.max(1, cols);
    }
    
    // 컬럼 높이 초기화
    initColumns() {
        const colCount = this.calculateColumns();
        this.columns = Array(colCount).fill(0);
    }
    
    // 가장 짧은 컬럼 찾기
    getShortestColumn() {
        let minHeight = Math.min(...this.columns);
        return this.columns.indexOf(minHeight);
    }
    
    // 아이템 위치 계산
    calculatePosition(item) {
        const col = this.getShortestColumn();
        const x = col * (this.columnWidth + this.gutter);
        const y = this.columns[col];
        
        // 컬럼 높이 업데이트
        const itemHeight = item.offsetHeight;
        this.columns[col] += itemHeight + this.gutter;
        
        return { x, y, col };
    }
    
    // 단일 아이템 배치
    positionItem(item) {
        const img = item.querySelector('img');
        if (!img) return;
        
        // 이미지 로드 대기
        if (!img.complete) {
            img.addEventListener('load', () => {
                this.positionItemAfterLoad(item);
            });
            img.addEventListener('error', () => {
                this.positionItemAfterLoad(item);
            });
        } else {
            this.positionItemAfterLoad(item);
        }
    }
    
    // 이미지 로드 후 배치
    positionItemAfterLoad(item) {
        item.style.position = 'absolute';
        item.style.width = this.columnWidth + 'px';
        
        const position = this.calculatePosition(item);
        item.style.left = position.x + 'px';
        item.style.top = position.y + 'px';
        item.style.opacity = '1';
        item.setAttribute('data-column', position.col);
        
        // 컨테이너 높이 업데이트
        this.updateContainerHeight();
    }
    
    // 새 아이템 추가
    addItems(newItems) {
        // 아이템들을 DOM에 추가하기 전에 숨김
        newItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transition = 'opacity 0.3s ease';
        });
        
        // 위치 계산 및 배치
        newItems.forEach((item, index) => {
            setTimeout(() => {
                this.positionItem(item);
            }, index * 30); // 순차적 애니메이션
        });
        
        this.items.push(...newItems);
    }
    
    // 전체 레이아웃 새로고침
    refresh() {
        this.initColumns();
        
        const container = document.querySelector(this.container);
        if (!container) return;
        
        // 모든 아이템 재배치
        const items = container.querySelectorAll(this.itemSelector);
        items.forEach(item => {
            // 이미지가 이미 로드되었으므로 바로 배치
            item.style.position = 'absolute';
            item.style.width = this.columnWidth + 'px';
            
            const position = this.calculatePosition(item);
            item.style.left = position.x + 'px';
            item.style.top = position.y + 'px';
        });
        
        // 컨테이너 높이 조정
        this.updateContainerHeight();
    }
    
    // 모든 이미지 로드 완료 대기
    waitForAllImages(items) {
        const promises = [];
        
        items.forEach(item => {
            const img = item.querySelector('img');
            if (img && !img.complete) {
                promises.push(new Promise((resolve) => {
                    img.addEventListener('load', resolve);
                    img.addEventListener('error', resolve);
                }));
            }
        });
        
        return Promise.all(promises);
    }
    
    // 초기 레이아웃 설정
    async layout() {
        this.initColumns();
        
        const container = document.querySelector(this.container);
        if (!container) return;
        
        const items = Array.from(container.querySelectorAll(this.itemSelector));
        if (items.length === 0) return;
        
        // 모든 이미지 로드 대기
        await this.waitForAllImages(items);
        
        // 모든 아이템 배치
        items.forEach((item, index) => {
            setTimeout(() => {
                this.positionItemAfterLoad(item);
            }, index * 20);
        });
        
        // 컨테이너 높이 설정
        setTimeout(() => {
            this.updateContainerHeight();
        }, items.length * 20 + 100);
    }
    
    // 컨테이너 높이 업데이트
    updateContainerHeight() {
        const container = document.querySelector(this.container);
        if (!container || this.columns.length === 0) return;
        
        const maxHeight = Math.max(...this.columns, 100); // 최소 100px
        container.style.height = maxHeight + 'px';
        container.style.minHeight = maxHeight + 'px';
    }
}

// 전역으로 export
window.PinterestLayout = PinterestLayout;