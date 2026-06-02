import type { ChartData, Stock } from '../data/stockData';
import { requestJson } from './client';
import type { StockPriceHistory, StockSummaryResponseDto } from './types';

type StockApiResponse = Stock | StockSummaryResponseDto;

const toNumber = (value: string | number | undefined) => {
  if (value === undefined) return undefined;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const isStockSummaryResponse = (stock: StockApiResponse): stock is StockSummaryResponseDto => {
  return 'stockCode' in stock && 'priceInfo' in stock;
};

const normalizeStock = (stock: StockApiResponse): Stock => {
  if (!isStockSummaryResponse(stock)) {
    return stock;
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
  const data = await requestJson<StockApiResponse[]>('/api/stocks');
  return data.map(normalizeStock);
}

export async function fetchStockChart(stockCode: string, range = '30d') {
  const data = await requestJson<Array<ChartData | StockPriceHistory>>(
    `/api/stocks/${encodeURIComponent(stockCode)}/chart?range=${encodeURIComponent(range)}`,
  );

  return toChartData(stockCode, data);
}
