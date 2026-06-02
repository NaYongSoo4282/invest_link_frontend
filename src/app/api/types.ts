/**
 * 백엔드 API 응답 JSON 계약 정리
 *
 * 1) 종목 리스트
 * GET /api/stocks
 *
 * 백엔드 StockSummaryResponseDto 기준 응답 예시:
 * [
 *   {
 *     "stockCode": "005930",
 *     "stockName": "삼성전자",
 *     "sector": "반도체",
 *     "priceInfo": {
 *       "currentPrice": "71800",
 *       "changePrice": "1200",
 *       "changeRate": "1.7",
 *       "volume": 12450000,
 *       "openPrice": "70600",
 *       "highPrice": "72400",
 *       "lowPrice": "70100"
 *     },
 *     "valuationInfo": {
 *       "calculatedPer": "18.5",
 *       "calculatedPbr": "1.2",
 *       "calculatedRoe": "6.5",
 *       "eps": "3881",
 *       "bps": "59833"
 *     },
 *     "marketCapInfo": {
 *       "marketCap": 42850,
 *       "listedShares": 5969782550,
 *       "floatingShares": 4460000000,
 *       "floatingRatio": "74.7"
 *     }
 *   }
 * ]
 *
 * 2) 종목 차트
 * GET /api/stocks/{stockCode}/chart?range=30d
 * [
 *   {
 *     "date": "2026-05-01",
 *     "open": 69800,
 *     "close": 70100,
 *     "high": 71200,
 *     "low": 69500,
 *     "volume": 12340000
 *   }
 * ]
 *
 * 3) 업종별 지표
 * GET /api/sectors
 * [
 *   {
 *     "sector": "반도체",
 *     "value": 1523.45,
 *     "change": 15.23,
 *     "changePercent": 1.01,
 *     "color": "#3b82f6"
 *   }
 * ]
 *
 * 4) 동종업계 평균 투자지표
 * GET /api/sectors/{sector}/average
 * {
 *   "sector": "반도체",
 *   "per": 15.4,
 *   "pbr": 1.5,
 *   "roe": 10.6
 * }
 *
 * 5) 종목 뉴스
 * GET /api/stocks/{stockCode}/news
 * [
 *   {
 *     "id": "s1",
 *     "title": "삼성전자, 파운드리 신규 투자 계획 발표",
 *     "source": "연합뉴스",
 *     "time": "1시간 전",
 *     "category": "반도체",
 *     "url": "https://www.yna.co.kr/view/example"
 *   }
 * ]
 *
 * 6) AI 분석
 * GET /api/stocks/{stockCode}/analysis
 * {
 *   "stockCode": "005930",
 *   "summary": "삼성전자는 최근 상승 추세를 보이고 있으며...",
 *   "recommendation": "보유",
 *   "targetPrice": 76000,
 *   "confidence": 82,
 *   "positiveFactors": ["최근 3일간 거래량 증가 추세"],
 *   "negativeFactors": ["단기 과매수 구간 진입 가능성"],
 *   "newsAnalysis": [
 *     {
 *       "sentiment": "positive",
 *       "title": "신제품 출시로 시장 점유율 확대 전망",
 *       "impact": "높음"
 *     }
 *   ],
 *   "technicalIndicators": {
 *     "rsi": 58,
 *     "macd": "매수 신호",
 *     "bollingerBand": "중립",
 *     "movingAverage": "정배열"
 *   }
 * }
 */

export interface StockSummaryResponseDto {
  stockCode: string;
  stockName: string;
  sector?: string;
  priceInfo: {
    currentPrice: string;
    changePrice: string;
    changeRate: string;
    volume: number;
    openPrice: string;
    highPrice: string;
    lowPrice: string;
  };
  valuationInfo: {
    calculatedPer: string;
    calculatedPbr: string;
    calculatedRoe: string;
    eps: string;
    bps: string;
  };
  marketCapInfo: {
    marketCap: number;
    listedShares: number;
    floatingShares: number;
    floatingRatio: string;
  };
}

export interface StockPriceHistory {
  date: string;
  open: number;
  close: number;
  high?: number;
  low?: number;
  volume?: number;
}

export interface AIAnalysis {
  summary: string;
  recommendation: string;
  targetPrice: number;
  confidence: number;
  positiveFactors: string[];
  negativeFactors: string[];
  newsAnalysis: {
    sentiment: 'positive' | 'negative' | 'neutral' | string;
    title: string;
    impact: string;
  }[];
  technicalIndicators: {
    rsi: number;
    macd: string;
    볼린저밴드: string;
    이동평균선: string;
  };
}
