export interface Stock {
  // TODO(API): 백엔드 /api/stocks 응답 JSON은 이 Stock 타입과 필드명을 맞춰주세요.
  // 필수 화면 필드: id, name, code, price, change, changePercent, marketCap, volume, sector
  // 투자지표 필드: per, pbr, roe
  id: string;
  name: string;
  code: string;
  price: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  per?: number; // 주가수익비율
  pbr?: number; // 주가순자산비율
  roe?: number; // 자기자본이익률
  sector?: string; // 업종
}

export interface SectorAverage {
  sector: string;
  per: number;
  pbr: number;
  roe: number;
}

export interface ChartData {
  time: string;
  price: number;
  id: string; // 고유 식별자 추가
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  time: string;
  category: string;
  url?: string;
}

export interface SectorIndex {
  sector: string;
  value: number;
  change: number;
  changePercent: number;
  color: string;
}

export interface SectorChartData {
  time: string;
  반도체: number;
  자동차: number;
  화학: number;
  금융: number;
  'IT/인터넷': number;
  바이오: number;
}

// TODO(API): 현재는 프론트 mock 데이터입니다.
// 백엔드 연동 시 이 stocks 배열 대신 GET /api/stocks 응답을 App.tsx에서 받아오면 됩니다.
// 응답 형식 예: Stock[]
// 코스피 200 주요 종목 데이터 (시가총액 순)
export const stocks: Stock[] = [
  {
    id: '1',
    name: '삼성전자',
    code: '005930',
    price: 71800,
    change: 1200,
    changePercent: 1.7,
    marketCap: 428500000,
    volume: 12450000,
    per: 18.5,
    pbr: 1.2,
    roe: 6.5,
    sector: '반도체',
  },
  {
    id: '2',
    name: 'SK하이닉스',
    code: '000660',
    price: 168500,
    change: -2500,
    changePercent: -1.46,
    marketCap: 122800000,
    volume: 3250000,
    per: 12.3,
    pbr: 1.8,
    roe: 14.6,
    sector: '반도체',
  },
  {
    id: '3',
    name: 'LG에너지솔루션',
    code: '373220',
    price: 385000,
    change: 5000,
    changePercent: 1.32,
    marketCap: 89800000,
    volume: 850000,
    per: 25.4,
    pbr: 3.2,
    roe: 12.6,
    sector: '2차전지',
  },
  {
    id: '4',
    name: '삼성바이오로직스',
    code: '207940',
    price: 912000,
    change: -8000,
    changePercent: -0.87,
    marketCap: 64100000,
    volume: 125000,
    per: 42.8,
    pbr: 5.6,
    roe: 13.1,
    sector: '바이오',
  },
  {
    id: '5',
    name: '현대차',
    code: '005380',
    price: 245500,
    change: 3500,
    changePercent: 1.45,
    marketCap: 52400000,
    volume: 680000,
    per: 8.5,
    pbr: 0.9,
    roe: 10.6,
    sector: '자동차',
  },
  {
    id: '6',
    name: 'NAVER',
    code: '035420',
    price: 186500,
    change: 2000,
    changePercent: 1.08,
    marketCap: 30500000,
    volume: 420000,
    per: 32.1,
    pbr: 2.4,
    roe: 7.5,
    sector: 'IT/인터넷',
  },
  {
    id: '7',
    name: '기아',
    code: '000270',
    price: 108500,
    change: -1500,
    changePercent: -1.36,
    marketCap: 29800000,
    volume: 920000,
    per: 7.2,
    pbr: 0.8,
    roe: 11.1,
    sector: '자동차',
  },
  {
    id: '8',
    name: '삼성SDI',
    code: '006400',
    price: 356000,
    change: 4500,
    changePercent: 1.28,
    marketCap: 24600000,
    volume: 340000,
    per: 28.9,
    pbr: 2.1,
    roe: 7.3,
    sector: '2차전지',
  },
  {
    id: '9',
    name: '카카오',
    code: '035720',
    price: 45200,
    change: -800,
    changePercent: -1.74,
    marketCap: 19500000,
    volume: 2100000,
    per: 45.6,
    pbr: 1.5,
    roe: 3.3,
    sector: 'IT/인터넷',
  },
  {
    id: '10',
    name: 'POSCO홀딩스',
    code: '005490',
    price: 378000,
    change: 2000,
    changePercent: 0.53,
    marketCap: 18900000,
    volume: 280000,
    per: 9.8,
    pbr: 0.7,
    roe: 7.1,
    sector: '화학',
  },
  {
    id: '11',
    name: '셀트리온',
    code: '068270',
    price: 178500,
    change: 3500,
    changePercent: 2.0,
    marketCap: 18200000,
    volume: 550000,
    per: 38.2,
    pbr: 4.8,
    roe: 12.6,
    sector: '바이오',
  },
  {
    id: '12',
    name: '삼성물산',
    code: '028260',
    price: 148500,
    change: -500,
    changePercent: -0.34,
    marketCap: 17800000,
    volume: 310000,
    per: 11.4,
    pbr: 0.6,
    roe: 5.3,
    sector: '화학',
  },
  {
    id: '13',
    name: '현대모비스',
    code: '012330',
    price: 245000,
    change: 1000,
    changePercent: 0.41,
    marketCap: 16500000,
    volume: 190000,
    per: 6.5,
    pbr: 0.9,
    roe: 13.8,
    sector: '자동차',
  },
  {
    id: '14',
    name: 'LG화학',
    code: '051910',
    price: 342000,
    change: -3000,
    changePercent: -0.87,
    marketCap: 15800000,
    volume: 220000,
    per: 15.7,
    pbr: 1.1,
    roe: 7.0,
    sector: '화학',
  },
  {
    id: '15',
    name: 'KB금융',
    code: '105560',
    price: 82500,
    change: 500,
    changePercent: 0.61,
    marketCap: 15200000,
    volume: 1450000,
    per: 5.8,
    pbr: 0.5,
    roe: 8.6,
    sector: '금융',
  },
];

// 업종별 평균 투자지표
export const sectorAverages: SectorAverage[] = [
  {
    sector: '반도체',
    per: 15.4,
    pbr: 1.5,
    roe: 10.6,
  },
  {
    sector: '자동차',
    per: 7.4,
    pbr: 0.9,
    roe: 11.8,
  },
  {
    sector: '화학',
    per: 12.3,
    pbr: 0.8,
    roe: 6.5,
  },
  {
    sector: '금융',
    per: 6.2,
    pbr: 0.6,
    roe: 9.2,
  },
  {
    sector: 'IT/인터넷',
    per: 38.9,
    pbr: 2.0,
    roe: 5.4,
  },
  {
    sector: '바이오',
    per: 40.5,
    pbr: 5.2,
    roe: 12.9,
  },
  {
    sector: '2차전지',
    per: 27.2,
    pbr: 2.7,
    roe: 10.0,
  },
];

// 업종별 평균 가져오기
export const getSectorAverage = (sector?: string): SectorAverage | null => {
  if (!sector) return null;
  return sectorAverages.find((avg) => avg.sector === sector) || null;
};

// 업종별 인덱스 데이터
export const sectorIndices: SectorIndex[] = [
  {
    sector: '반도체',
    value: 1523.45,
    change: 15.23,
    changePercent: 1.01,
    color: '#3b82f6',
  },
  {
    sector: '자동차',
    value: 892.31,
    change: -8.12,
    changePercent: -0.90,
    color: '#10b981',
  },
  {
    sector: '화학',
    value: 654.78,
    change: -3.45,
    changePercent: -0.52,
    color: '#f59e0b',
  },
  {
    sector: '금융',
    value: 1245.67,
    change: 7.89,
    changePercent: 0.64,
    color: '#8b5cf6',
  },
  {
    sector: 'IT/인터넷',
    value: 1089.23,
    change: 12.45,
    changePercent: 1.16,
    color: '#ec4899',
  },
  {
    sector: '바이오',
    value: 756.45,
    change: 18.90,
    changePercent: 2.56,
    color: '#06b6d4',
  },
];

// 간단한 시드 기반 랜덤 생성 함수
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

// 차트 데이터 생성 함수
// TODO(API): 백엔드에서 [{ date: '2026-05-01', open: 69800, close: 70100 }] 형태로 받으면
// 아래처럼 하루 데이터를 "5월 1일 시가"와 "5월 1일 종가" 두 x축 포인트로 펼쳐서 StockChart에 넘기면 됩니다.
export const generateChartData = (basePrice: number, days: number = 30): ChartData[] => {
  const data: ChartData[] = [];
  let previousClose = basePrice * 0.95;

  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0); // 시간을 0으로 설정하여 일자만 사용

    // 시드 기반 랜덤 변동 (deterministic)
    const openSeed = basePrice * 1000 + i * 2;
    const closeSeed = basePrice * 1000 + i * 2 + 1;
    const openChange = (seededRandom(openSeed) - 0.5) * basePrice * 0.012;
    const closeChange = (seededRandom(closeSeed) - 0.5) * basePrice * 0.025;
    let openPrice = previousClose + openChange;
    let closePrice = openPrice + closeChange;

    openPrice = Math.max(openPrice, basePrice * 0.9);
    openPrice = Math.min(openPrice, basePrice * 1.1);
    closePrice = Math.max(closePrice, basePrice * 0.9);
    closePrice = Math.min(closePrice, basePrice * 1.1);
    previousClose = closePrice;

    const timeStr = date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });

    data.push({
      time: `${timeStr} 시가`,
      price: Math.round(openPrice),
      id: `chart-${basePrice}-${i}-open`, // 고유한 식별자
    });

    data.push({
      time: `${timeStr} 종가`,
      price: Math.round(closePrice),
      id: `chart-${basePrice}-${i}-close`, // 고유한 식별자
    });
  }

  return data;
};

// 업종별 추세 차트 데이터 생성
export const generateSectorChartData = (days: number = 30): SectorChartData[] => {
  const data: SectorChartData[] = [];
  
  const basePrices = {
    반도체: 1500,
    자동차: 900,
    화학: 660,
    금융: 1240,
    'IT/인터넷': 1080,
    바이오: 740,
  };
  
  const currentPrices = { ...basePrices };
  
  for (let i = days; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const dataPoint: SectorChartData = {
      time: date.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' }),
      반도체: 0,
      자동차: 0,
      화학: 0,
      금융: 0,
      'IT/인터넷': 0,
      바이오: 0,
    };
    
    // 각 업종별로 랜덤 변동 적용
    Object.keys(basePrices).forEach((sector) => {
      const key = sector as keyof typeof basePrices;
      const change = (Math.random() - 0.5) * basePrices[key] * 0.02;
      currentPrices[key] = Math.max(currentPrices[key] + change, basePrices[key] * 0.92);
      currentPrices[key] = Math.min(currentPrices[key], basePrices[key] * 1.08);
      dataPoint[key] = Math.round(currentPrices[key] * 100) / 100;
    });
    
    data.push(dataPoint);
  }
  
  return data;
};

// 주요 뉴스 데이터
export const news: NewsItem[] = [
  {
    id: '1',
    title: '삼성전자, 파운드리 신규 투자 계획 발표',
    source: '연합뉴스',
    time: '1시간 전',
    category: '반도체',
  },
  {
    id: '2',
    title: 'SK하이닉스, HBM3E 양산 본격화',
    source: '매일경제',
    time: '2시간 전',
    category: '반도체',
  },
  {
    id: '3',
    title: '현대차, 전기차 판매 목표 상향 조정',
    source: '한국경제',
    time: '3시간 전',
    category: '자동차',
  },
  {
    id: '4',
    title: 'NAVER, AI 검색 기능 대폭 개선',
    source: '전자신문',
    time: '4시간 전',
    category: 'IT',
  },
  {
    id: '5',
    title: 'LG에너지솔루션, 북미 배터리 공장 증설',
    source: '조선일보',
    time: '5시간 전',
    category: '2차전지',
  },
  {
    id: '6',
    title: '코스피, 외국인 순매수에 상승 마감',
    source: '서울경제',
    time: '6시간 전',
    category: '증시',
  },
  {
    id: '7',
    title: '카카오, 신규 AI 서비스 출시 예정',
    source: 'IT조선',
    time: '7시간 전',
    category: 'IT',
  },
  {
    id: '8',
    title: '셀트리온, 바이오시밀러 글로벌 확대',
    source: '헬스조선',
    time: '8시간 전',
    category: '바이오',
  },
];

// 종목별 뉴스 매핑
export const stockNews: Record<string, NewsItem[]> = {
  '005930': [ // 삼성전자
    {
      id: 's1',
      title: '삼성전자, 파운드리 신규 투자 계획 발표',
      source: '연합뉴스',
      time: '1시간 전',
      category: '반도체',
    },
    {
      id: 's2',
      title: '삼성전자, 3분기 반도체 부문 실적 개선 전망',
      source: '매일경제',
      time: '3시간 전',
      category: '반도체',
    },
    {
      id: 's3',
      title: '삼성전자, 차세대 GAA 기술 개발 완료',
      source: '전자신문',
      time: '5시간 전',
      category: '반도체',
    },
  ],
  '000660': [ // SK하이닉스
    {
      id: 'h1',
      title: 'SK하이닉스, HBM3E 양산 본격화',
      source: '매일경제',
      time: '2시간 전',
      category: '반도체',
    },
    {
      id: 'h2',
      title: 'SK하이닉스, AI 반도체 수요 급증으로 호실적',
      source: '한국경제',
      time: '4시간 전',
      category: '반도체',
    },
  ],
  '005380': [ // 현대차
    {
      id: 'c1',
      title: '현대차, 전기차 판매 목표 상향 조정',
      source: '한국경제',
      time: '3시간 전',
      category: '자동차',
    },
    {
      id: 'c2',
      title: '현대차, 신형 아이오닉 7 공개 임박',
      source: '조선일보',
      time: '6시간 전',
      category: '자동차',
    },
  ],
  '035420': [ // NAVER
    {
      id: 'n1',
      title: 'NAVER, AI 검색 기능 대폭 개선',
      source: '전자신문',
      time: '4시간 전',
      category: 'IT',
    },
    {
      id: 'n2',
      title: 'NAVER, 클라우드 사업 확대 계획',
      source: 'IT조선',
      time: '7시간 전',
      category: 'IT',
    },
  ],
  '035720': [ // 카카오
    {
      id: 'k1',
      title: '카카오, 신규 AI 서비스 출시 예정',
      source: 'IT조선',
      time: '7시간 전',
      category: 'IT',
    },
    {
      id: 'k2',
      title: '카카오뱅크, 예금 잔액 40조원 돌파',
      source: '서울경제',
      time: '9시간 전',
      category: '금융',
    },
  ],
  '373220': [ // LG에너지솔루션
    {
      id: 'l1',
      title: 'LG에너지솔루션, 북미 배터리 공장 증설',
      source: '조선일보',
      time: '5시간 전',
      category: '2차전지',
    },
    {
      id: 'l2',
      title: 'LG에너지솔루션, 전고체 배터리 개발 박차',
      source: '매일경제',
      time: '8시간 전',
      category: '2차전지',
    },
  ],
  '068270': [ // 셀트리온
    {
      id: 'cell1',
      title: '셀트리온, 바이오시밀러 글로벌 확대',
      source: '헬스조선',
      time: '8시간 전',
      category: '바이오',
    },
    {
      id: 'cell2',
      title: '셀트리온, 미국 FDA 신약 승인 임박',
      source: '조선일보',
      time: '10시간 전',
      category: '바이오',
    },
  ],
};

// 종목 코드로 뉴스 가져오기
export const getNewsByStockCode = (stockCode: string): NewsItem[] => {
  return stockNews[stockCode] || news.slice(0, 3); // 기본 뉴스 반환
};
