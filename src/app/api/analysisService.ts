import { requestJson } from './client';
import type { AIAnalysis } from './types';

interface AIAnalysisResponse extends Omit<AIAnalysis, 'technicalIndicators'> {
  technicalIndicators?: Partial<AIAnalysis['technicalIndicators']> & {
    bollingerBand?: string;
    movingAverage?: string;
  };
  narrative?: string;
  narrativeText?: string;
  stockCode?: string;
  stockName?: string;
}

export async function fetchStockAnalysis(stockCode: string) {
  const analyzedData = await requestJson<Partial<AIAnalysisResponse>>(`/api/v1/ai-narratives/${encodeURIComponent(stockCode)}/analyze`, {
    method: 'POST',
  });

  const narrativeData = await requestJson<AIAnalysisResponse>(`/api/v1/ai-narratives/${encodeURIComponent(stockCode)}/narrative`);
  const data = {
    ...analyzedData,
    ...narrativeData,
  };
  const technicalIndicators = data.technicalIndicators ?? {};

  return {
    summary: data.summary ?? data.narrativeText ?? data.narrative ?? 'AI 분석 결과를 불러왔습니다.',
    recommendation: data.recommendation ?? '보유',
    targetPrice: data.targetPrice ?? 0,
    confidence: data.confidence ?? 0,
    positiveFactors: data.positiveFactors ?? [],
    negativeFactors: data.negativeFactors ?? [],
    newsAnalysis: data.newsAnalysis ?? [],
    technicalIndicators: {
      rsi: technicalIndicators.rsi ?? 0,
      macd: technicalIndicators.macd ?? '-',
      볼린저밴드: technicalIndicators.볼린저밴드 ?? technicalIndicators.bollingerBand ?? '-',
      이동평균선: technicalIndicators.이동평균선 ?? technicalIndicators.movingAverage ?? '-',
    },
  };
}
