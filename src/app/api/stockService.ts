import type { ChartData, Stock } from '../data/stockData';
import { requestJson } from './client';
import type { StockPriceHistory, StockSummaryResponseDto } from './types';

type LooseStockApiResponse = Record<string, unknown>;
type StockApiResponse = Stock | StockSummaryResponseDto | LooseStockApiResponse;
type StockListResponse = StockApiResponse[] | { data?: StockApiResponse[]; stocks?: StockApiResponse[]; ticks?: StockApiResponse[] };

const toNumber = (value: string | number | unknown) => {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const isStockSummaryResponse = (stock: StockApiResponse): stock is StockSummaryResponseDto => {
  return 'stockCode' in stock && 'priceInfo' in stock;
};

const isFrontendStock = (stock: StockApiResponse): stock is Stock => {
  return 'id' in stock && 'code' in stock && 'name' in stock && 'price' in stock;
};

const toStringValue = (value: unknown, fallback?: string) => {
  return typeof value === 'string' || typeof value === 'number' ? String(value) : fallback;
};

const normalizeStock = (stock: StockApiResponse): Stock => {
  if (isFrontendStock(stock)) {
    return stock;
  }

  if (!isStockSummaryResponse(stock)) {
    const code = toStringValue(stock.stockCode ?? stock.code ?? stock.ticker ?? stock.symbol, '');
    const name = toStringValue(stock.stockName ?? stock.name ?? stock.companyName, code) ?? code;

    return {
      id: code,
      code,
      name,
      price: toNumber(stock.currentPrice ?? stock.price ?? stock.closePrice) ?? 0,
      change: toNumber(stock.changePrice ?? stock.change) ?? 0,
      changePercent: toNumber(stock.changeRate ?? stock.changePercent) ?? 0,
      marketCap: toNumber(stock.marketCap) ?? 0,
      volume: toNumber(stock.volume) ?? 0,
      per: toNumber(stock.per ?? stock.calculatedPer),
      pbr: toNumber(stock.pbr ?? stock.calculatedPbr),
      roe: toNumber(stock.roe ?? stock.calculatedRoe),
      sector: toStringValue(stock.sector ?? stock.industry, undefined),
    };
  }

  return {
    id: stock.stockCode,
    code: stock.stockCode,
    name: stock.stockName,
    price: toNumber(stock.priceInfo.currentPrice) ?? 0,
    change: toNumber(stock.priceInfo.changePrice) ?? 0,
    changePercent: toNumber(stock.priceInfo.changeRate) ?? 0,
    marketCap: stock.marketCapInfo.marketCap,
    volume: stock.priceInfo.volume,
    per: toNumber(stock.valuationInfo.calculatedPer),
    pbr: toNumber(stock.valuationInfo.calculatedPbr),
    roe: toNumber(stock.valuationInfo.calculatedRoe),
    sector: stock.sector,
  };
};

const unwrapStockList = (data: StockListResponse): StockApiResponse[] => {
  if (Array.isArray(data)) return data;
  return data.data ?? data.stocks ?? data.ticks ?? [];
};

const formatChartDate = (date: string) => {
  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return date;
  }

  return parsed.toLocaleDateString('ko-KR', { month: 'short', day: 'numeric' });
};

const isChartData = (item: ChartData | StockPriceHistory): item is ChartData => {
  return 'time' in item && 'price' in item;
};

export const toChartData = (stockCode: string, data: Array<ChartData | StockPriceHistory>): ChartData[] => {
  return data.flatMap((item) => {
    if (isChartData(item)) {
      return item;
    }

    const label = formatChartDate(item.date);

    return [
      {
        id: `${stockCode}-${item.date}-open`,
        time: `${label} 시가`,
        price: item.open,
      },
      {
        id: `${stockCode}-${item.date}-close`,
        time: `${label} 종가`,
        price: item.close,
      },
    ];
  });
};

export async function fetchStocks() {
  const data = await requestJson<StockListResponse>('/api/v1/stocks/ticks');
  return unwrapStockList(data).map(normalizeStock);
}

export async function fetchStockSummary(stockCode: string) {
  const data = await requestJson<StockApiResponse>(`/api/v1/stocks/${encodeURIComponent(stockCode)}/summary`);
  return normalizeStock(data);
}

export async function fetchStockChart(stockCode: string, range = '30d') {
  const data = await requestJson<Array<ChartData | StockPriceHistory>>(
    `/api/stocks/${encodeURIComponent(stockCode)}/chart?range=${encodeURIComponent(range)}`,
  );

  return toChartData(stockCode, data);
}
