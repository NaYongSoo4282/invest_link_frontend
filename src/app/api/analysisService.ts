import { requestJson } from './client';
import type { AIAnalysis } from './types';

interface AIAnalysisResponse extends Omit<AIAnalysis, 'technicalIndicators'> {
  technicalIndicators: AIAnalysis['technicalIndicators'] & {
    bollingerBand?: string;
    movingAverage?: string;
  };
}

export async function fetchStockAnalysis(stockCode: string) {
  const data = await requestJson<AIAnalysisResponse>(`/api/stocks/${encodeURIComponent(stockCode)}/analysis`);

  return {
    ...data,
    technicalIndicators: {
      rsi: data.technicalIndicators.rsi,
      macd: data.technicalIndicators.macd,
      볼린저밴드: data.technicalIndicators.볼린저밴드 ?? data.technicalIndicators.bollingerBand ?? '-',
      이동평균선: data.technicalIndicators.이동평균선 ?? data.technicalIndicators.movingAverage ?? '-',
    },
  };
}
