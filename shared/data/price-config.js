// 환율 및 가격 관련 설정
const PRICE_CONFIG = {
    // 환율 정보 (1 VND 기준)
    exchangeRate: {
        KRW: 0.054,  // 1 VND = 0.054 KRW
        USD: 0.000041  // 1 VND = 0.000041 USD
    },
    
    // 기본 가격 (노션에 가격 정보 없을 때 사용)
    defaultPrices: {
        '타이': 500000,
        '오일': 700000,
        '아로마': 800000,
        '스포츠': 600000,
        '발': 400000,
        '커플': 1200000
    },
    
    // 가격 포맷팅
    formatPrice: function(vnd, currency = 'KRW') {
        if (currency === 'KRW') {
            const krw = Math.round(vnd * this.exchangeRate.KRW / 1000) * 1000;
            return `₩${krw.toLocaleString()}`;
        } else if (currency === 'USD') {
            const usd = Math.round(vnd * this.exchangeRate.USD);
            return `$${usd}`;
        }
        return `₫${vnd.toLocaleString()}`;
    }
};

// 전역으로 사용 가능하도록 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PRICE_CONFIG;
}