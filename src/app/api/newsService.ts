import type { NewsItem } from '../data/stockData';
import { requestJson } from './client';

export async function fetchStockNews(stockCode: string) {
  return requestJson<NewsItem[]>(`/api/stocks/${encodeURIComponent(stockCode)}/news`);
}
