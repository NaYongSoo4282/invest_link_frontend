import { TrendingUp, AlertCircle, Target, Sparkles, BarChart3 } from 'lucide-react';
import type { ChartData, SectorAverage, Stock } from '../data/stockData';
import { StockChart } from './StockChart';
import { InvestmentMetricHelp } from './InvestmentMetricHelp';
import { TechnicalIndicatorHelp } from './TechnicalIndicatorHelp';
import { AnalysisValueHelp } from './AnalysisValueHelp';
import type { AIAnalysis } from '../api';

interface AIAnalysisTabProps {
  stock: Stock;
  analysis?: AIAnalysis;
  chartData: ChartData[];
  sectorAvg: SectorAverage | null;
}

export function AIAnalysisTab({ stock, analysis, chartData, sectorAvg }: AIAnalysisTabProps) {
  const getRecommendationColor = (rec: string) => {
    if (rec === '매수') return 'text-red-600 bg-red-50 border-red-200';
    if (rec === '매도') return 'text-blue-600 bg-blue-50 border-blue-200';
    return 'text-gray-600 bg-gray-50 border-gray-200';
  };

  if (!analysis) {
    return (
      <main className="max-w-[1400px] mx-auto px-4 py-10">
        <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-6 text-yellow-900">
          <h2 className="font-bold">AI 분석 데이터가 없습니다</h2>
          <p className="mt-2 text-sm">백엔드의 AI 분석 API 응답을 확인해주세요.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-[1400px] mx-auto px-4 py-4">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* 왼쪽: 종목 정보 헤더와 차트 */}
        <div className="lg:col-span-8 space-y-4">
          {/* 종목 정보 헤더 */}
          <div className="bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-lg font-bold">{stock.name}</h1>
                <p className="text-violet-100 text-xs mt-0.5">종목코드: {stock.code}</p>
              </div>
              <div className="text-right">
                <div className="text-xs text-violet-100">현재가</div>
                <div className="text-2xl font-bold">{stock.price.toLocaleString()}원</div>
                <div className={`text-sm font-semibold ${stock.changePercent >= 0 ? 'text-red-200' : 'text-blue-200'}`}>
                  {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                </div>
              </div>
            </div>
          </div>
          {/* 차트 */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <h2 className="font-semibold text-base mb-3 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-violet-600" />
              30일 가격 추이
            </h2>
            <div className="h-[350px]">
              <StockChart
                data={chartData}
                stockName={stock.name}
                currentPrice={stock.price}
                changePercent={stock.changePercent}
              />
            </div>
          </div>

          {/* AI 분석 요약 */}
          <div className="bg-gradient-to-br from-violet-50 to-fuchsia-50 rounded-xl p-5 border border-violet-200">
            <h3 className="font-semibold text-base mb-2.5 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-violet-600" />
              AI 분석 요약
            </h3>
            <p className="text-gray-700 text-base leading-relaxed">{analysis.summary}</p>
          </div>

          {/* 긍정적 요인 & 리스크 요인 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 rounded-xl p-5 border border-red-200">
              <h3 className="font-semibold text-base mb-3 flex items-center gap-2 text-red-700">
                <TrendingUp className="w-5 h-5" />
                긍정적 요인
              </h3>
              <ul className="space-y-2.5">
                {analysis.positiveFactors.map((factor, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm leading-relaxed">
                    <span className="text-red-500 font-bold flex-shrink-0 text-base leading-relaxed">✓</span>
                    <span className="text-gray-700">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50 rounded-xl p-5 border border-blue-200">
              <h3 className="font-semibold text-base mb-3 flex items-center gap-2 text-blue-700">
                <AlertCircle className="w-5 h-5" />
                리스크 요인
              </h3>
              <ul className="space-y-2.5">
                {analysis.negativeFactors.map((factor, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm leading-relaxed">
                    <span className="text-blue-500 font-bold flex-shrink-0 text-base leading-relaxed">!</span>
                    <span className="text-gray-700">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 뉴스 기반 분석 */}
          <div className="bg-white rounded-xl p-5 border border-gray-200">
            <h3 className="font-semibold text-base mb-3">뉴스 Sentiment 분석</h3>
            <div className="space-y-2.5">
              {analysis.newsAnalysis.map((news, index) => (
                <div key={index} className="flex items-start gap-3 p-3.5 bg-gray-50 rounded-lg">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    news.sentiment === 'positive' ? 'bg-red-500' :
                    news.sentiment === 'negative' ? 'bg-blue-500' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1">
                    <div className="font-medium text-gray-900 text-sm leading-relaxed">{news.title}</div>
                    <div className="text-xs text-gray-500 mt-1">영향도: {news.impact}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 오른쪽: 투자 의견 및 기술적 지표 */}
        <div className="lg:col-span-4 space-y-4">
          {/* 투자 의견 */}
          <div className={`rounded-xl p-4 border-2 ${getRecommendationColor(analysis.recommendation)}`}>
            <div className="text-xs font-medium mb-1 opacity-75">AI 투자 의견</div>
            <div className="text-3xl font-bold mb-2">{analysis.recommendation}</div>
            <div className="text-xs opacity-80">
              AI 분석 결과 기반
            </div>
          </div>

          {/* 목표 주가 */}
          <div className="bg-white rounded-xl p-4 border border-violet-100">
            <div className="text-sm text-violet-700 mb-2 flex items-center gap-1.5">
              <Target className="w-3.5 h-3.5 text-violet-600" />
              목표 주가
              <AnalysisValueHelp label="목표 주가" compact />
            </div>
            <div className="text-2xl font-bold text-gray-900 mb-2">
              {Math.floor(analysis.targetPrice).toLocaleString()}원
            </div>
            <div className="flex items-center gap-1.5 text-sm">
              <span className={`font-semibold ${
                analysis.targetPrice > stock.price ? 'text-red-500' : 'text-blue-500'
              }`}>
                {analysis.targetPrice > stock.price ? '▲' : '▼'}
                {Math.abs(((analysis.targetPrice - stock.price) / stock.price * 100)).toFixed(1)}%
              </span>
              <span className="text-xs text-gray-500">
                ({analysis.targetPrice > stock.price ? '+' : ''}{Math.floor(analysis.targetPrice - stock.price).toLocaleString()}원)
              </span>
            </div>
          </div>

          {/* 신뢰도 */}
          <div className="bg-white rounded-xl p-4 border border-violet-100">
            <div className="text-sm text-violet-700 mb-2 flex items-center gap-1.5">
              분석 신뢰도
              <AnalysisValueHelp label="분석 신뢰도" compact />
            </div>
            <div className="flex items-center gap-2 mb-2">
              <div className="text-2xl font-bold text-violet-600">{analysis.confidence}%</div>
            </div>
            <div className="w-full bg-violet-100 rounded-full h-2 mb-2">
              <div
                className="bg-violet-600 h-2 rounded-full transition-all"
                style={{ width: `${analysis.confidence}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-500">
              높은 신뢰도는 데이터 품질과 분석 일관성을 나타냅니다.
            </p>
          </div>

          {/* 투자지표 */}
          <div className="bg-white rounded-xl p-3 border border-violet-100">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-base text-violet-950">투자지표</h3>
              {stock.sector && (
                <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                  {stock.sector}
                </span>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_auto] lg:grid-cols-1 xl:grid-cols-[1fr_auto] gap-2">
              <div className="grid grid-cols-3 gap-2">
                <div className="border border-blue-200 rounded-lg p-3 flex flex-col items-start justify-start bg-blue-50/30">
                  <div className="text-xs text-gray-600 font-medium mb-1 flex items-center gap-1">
                    PER
                    <InvestmentMetricHelp label="PER" tone="blue" compact />
                  </div>
                  <div className="text-xl leading-none font-bold text-gray-900">
                    {stock.per?.toFixed(1) ?? '-'}
                  </div>
                  <div className="text-xs leading-tight text-gray-500 mt-1">배</div>
                </div>
                <div className="border border-purple-200 rounded-lg p-3 flex flex-col items-start justify-start bg-purple-50/30">
                  <div className="text-xs text-gray-600 font-medium mb-1 flex items-center gap-1">
                    PBR
                    <InvestmentMetricHelp label="PBR" tone="purple" compact />
                  </div>
                  <div className="text-xl leading-none font-bold text-gray-900">
                    {stock.pbr?.toFixed(1) ?? '-'}
                  </div>
                  <div className="text-xs leading-tight text-gray-500 mt-1">배</div>
                </div>
                <div className="border border-green-200 rounded-lg p-3 flex flex-col items-start justify-start bg-green-50/30">
                  <div className="text-xs text-gray-600 font-medium mb-1 flex items-center gap-1">
                    ROE
                    <InvestmentMetricHelp label="ROE" tone="green" compact />
                  </div>
                  <div className="text-xl leading-none font-bold text-gray-900">
                    {stock.roe?.toFixed(1) ?? '-'}
                  </div>
                  <div className="text-xs leading-tight text-gray-500 mt-1">%</div>
                </div>
              </div>
              <div className="rounded-lg border border-violet-200 bg-violet-50/50 p-3 sm:w-36 lg:w-auto xl:w-36">
                <div className="text-xs font-semibold text-violet-900 mb-2">동종업계 평균</div>
                {sectorAvg && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-gray-500">PER</span>
                      <span className="font-semibold text-gray-900">{sectorAvg.per.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-gray-500">PBR</span>
                      <span className="font-semibold text-gray-900">{sectorAvg.pbr.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="text-gray-500">ROE</span>
                      <span className="font-semibold text-gray-900">{sectorAvg.roe.toFixed(1)}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="mt-3 p-3 bg-violet-50 rounded-lg">
              <p className="text-xs leading-relaxed text-violet-800">
                💡 PER은 낮을수록, ROE는 높을수록 좋은 투자 신호로 평가됩니다.
              </p>
            </div>
          </div>

          {/* 기술적 지표 */}
          <div className="bg-white rounded-xl p-4 border border-violet-100">
            <h3 className="font-semibold text-base mb-4 text-violet-950">기술적 분석</h3>
            <div className="space-y-4">
              <div>
                <div className="text-sm text-gray-500 mb-1.5 flex items-center gap-1.5">
                  RSI (상대강도지수)
                  <TechnicalIndicatorHelp label="RSI" compact />
                </div>
                <div className="font-bold text-xl">{analysis.technicalIndicators.rsi}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1.5 flex items-center gap-1.5">
                  MACD
                  <TechnicalIndicatorHelp label="MACD" compact />
                </div>
                <div className="font-semibold text-base">{analysis.technicalIndicators.macd}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1.5 flex items-center gap-1.5">
                  볼린저밴드
                  <TechnicalIndicatorHelp label="볼린저밴드" compact />
                </div>
                <div className="font-semibold text-base">{analysis.technicalIndicators.볼린저밴드}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500 mb-1.5 flex items-center gap-1.5">
                  이동평균선
                  <TechnicalIndicatorHelp label="이동평균선" compact />
                </div>
                <div className="font-semibold text-base">{analysis.technicalIndicators.이동평균선}</div>
              </div>
            </div>
          </div>

          {/* 면책 조항 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
            <p className="text-sm text-yellow-800 leading-relaxed">
              ⚠️ 본 분석은 AI 알고리즘에 의해 생성된 참고 자료이며, 투자 권유나 보장이 아닙니다.
            </p>
          </div>

          {/* 액션 버튼 */}
          <button
            className="w-full px-4 py-2.5 bg-violet-600 hover:bg-violet-700 text-white rounded-lg font-medium text-sm transition-colors"
          >
            분석 리포트 저장
          </button>
        </div>
      </div>
    </main>
  );
}
