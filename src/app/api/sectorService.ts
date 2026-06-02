import type { SectorAverage, SectorIndex } from '../data/stockData';
import { requestJson } from './client';

export async function fetchSectorIndices() {
  return requestJson<SectorIndex[]>('/api/sectors');
}

export async function fetchSectorAverage(sector: string) {
  return requestJson<SectorAverage>(`/api/sectors/${encodeURIComponent(sector)}/average`);
}
