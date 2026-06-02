import { X, TrendingUp, TrendingDown, AlertCircle, Target, Sparkles } from 'lucide-react';
import { Stock } from '../data/stockData';

interface AIAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: Stock;
}

export function AIAnalysisModal({ isOpen, onClose, stock }: AIAnalysisModalProps) {
  if (!isOpen) return null;

  // Mock AI 분석 데이터 (나중에 실제 AI API로 교체)
  const analysis = {
    summary: `${stock.name}는 최근 ${stock.changePercent >= 0 ? '상승' : '하락'} 추세를 보이고 있으며, 현재 시가총액은 ${(stock.marketCap / 1000000000000).toFixed(1)}조원입니다. 거래량과 뉴스 분석 결과를 종합한 AI 투자 의견입니다.`,
    recommendation: stock.changePercent >= 2 ? '매수' : stock.changePercent <= -2 ? '관망' : '보유',
    targetPrice: stock.price + (stock.price * (Math.random() * 0.2 - 0.1)),
    confidence: Math.floor(70 + Math.random() * 25),
    positiveFactors: [
      '최근 3일간 거래량 증가 추세',
      '업종 평균 대비 양호한 실적',
      '긍정적인 뉴스 sentiment 분석 결과',
      '기술적 지표상 상승 모멘텀 감지'
    ],
    negativeFactors: [
      '단기 과매수 구간 진입 가능성',
      '글로벌 시장 불확실성 증가',
      '경쟁사 대비 밸류에이션 높은 수준'
    ],
    newsAnalysis: [
      { sentiment: 'positive', title: '신제품 출시로 시장 점유율 확대 전망', impact: '높음' },
      { sentiment: 'positive', title: '분기 실적 시장 예상치 상회', impact: '중간' },
      { sentiment: 'neutral', title: '경영진 교체 발표', impact: '낮음' }
    ],
    technicalIndicators: {
      rsi: 45 + Math.floor(Math.random() * 30),
      macd: stock.changePercent >= 0 ? '매수 신호' : '관망 신호',
      볼린저밴드: '중립',
      이동평균선: stock.changePercent >= 0 ? '정배열' : '역배열'
    }
  };

  const getRecommendationColor = (rec: string) => {
    if (rec === '매수') return 'text-red-600 bg-red-50';
    if (rec === '매도') return 'text-blue-600 bg-blue-50';
    return 'text-gray-600 bg-gray-50';
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl my-4">
        {/* 헤더 */}
        <div className="bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-t-2xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-base font-bold flex items-center gap-2">
                  AI 투자 분석
                </h2>
                <p className="text-green-100 text-[10px] mt-0.5">{stock.name} ({stock.code})</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* 현재 가격 정보 */}
          <div className="mt-2 flex items-center gap-3">
            <div>
              <div className="text-[10px] text-green-100">현재가</div>
              <div className="text-lg font-bold">{stock.price.toLocaleString()}원</div>
            </div>
            <div className={`text-sm font-semibold ${stock.changePercent >= 0 ? 'text-red-200' : 'text-blue-200'}`}>
              {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
            </div>
          </div>
        </div>

        {/* 콘텐츠 영역 */}
        <div className="p-3 space-y-2.5">
          {/* AI 분석 요약 */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-2.5 border border-green-200">
            <h3 className="font-bold text-xs mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-green-600" />
              분석 요약
            </h3>
            <p className="text-[11px] text-gray-700 leading-relaxed">{analysis.summary}</p>
          </div>

          {/* 투자 의견 */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-white rounded-lg p-2.5 border border-gray-200">
              <div className="text-[9px] text-gray-500 mb-1">AI 투자 의견</div>
              <div className={`text-base font-bold px-2 py-1 rounded-lg inline-block ${getRecommendationColor(analysis.recommendation)}`}>
                {analysis.recommendation}
              </div>
            </div>
            <div className="bg-white rounded-lg p-2.5 border border-gray-200">
              <div className="text-[9px] text-gray-500 mb-1 flex items-center gap-1">
                <Target className="w-2.5 h-2.5" />
                목표 주가
              </div>
              <div className="text-base font-bold text-gray-900">
                {Math.floor(analysis.targetPrice).toLocaleString()}원
              </div>
              <div className="text-[9px] text-gray-500 mt-0.5">
                ({((analysis.targetPrice - stock.price) / stock.price * 100).toFixed(1)}%)
              </div>
            </div>
            <div className="bg-white rounded-lg p-2.5 border border-gray-200">
              <div className="text-[9px] text-gray-500 mb-1">신뢰도</div>
              <div className="flex items-center gap-1.5">
                <div className="text-base font-bold text-green-600">{analysis.confidence}%</div>
                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                  <div 
                    className="bg-green-600 h-1.5 rounded-full transition-all"
                    style={{ width: `${analysis.confidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* 긍정적 요인 & 부정적 요인 */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-red-50 rounded-lg p-2.5 border border-red-200">
              <h3 className="font-bold text-xs mb-1.5 flex items-center gap-1 text-red-700">
                <TrendingUp className="w-3 h-3" />
                긍정적 요인
              </h3>
              <ul className="space-y-1">
                {analysis.positiveFactors.map((factor, index) => (
                  <li key={index} className="flex items-start gap-1.5 text-[10px]">
                    <span className="text-red-500 mt-0.5">✓</span>
                    <span className="text-gray-700">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-blue-50 rounded-lg p-2.5 border border-blue-200">
              <h3 className="font-bold text-xs mb-1.5 flex items-center gap-1 text-blue-700">
                <AlertCircle className="w-3 h-3" />
                리스크 요인
              </h3>
              <ul className="space-y-1">
                {analysis.negativeFactors.map((factor, index) => (
                  <li key={index} className="flex items-start gap-1.5 text-[10px]">
                    <span className="text-blue-500 mt-0.5">!</span>
                    <span className="text-gray-700">{factor}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* 뉴스 기반 분석 & 기술적 지표를 한 줄로 */}
          <div className="grid grid-cols-2 gap-2">
            {/* 뉴스 기반 분석 */}
            <div className="bg-white rounded-lg p-2.5 border border-gray-200">
              <h3 className="font-bold text-xs mb-1.5">뉴스 Sentiment 분석</h3>
              <div className="space-y-1">
                {analysis.newsAnalysis.map((news, index) => (
                  <div key={index} className="flex items-start gap-1.5 p-1.5 bg-gray-50 rounded">
                    <div className={`w-1.5 h-1.5 rounded-full mt-1 ${
                      news.sentiment === 'positive' ? 'bg-red-500' :
                      news.sentiment === 'negative' ? 'bg-blue-500' : 'bg-gray-400'
                    }`} />
                    <div className="flex-1">
                      <div className="text-[10px] font-medium text-gray-900">{news.title}</div>
                      <div className="text-[9px] text-gray-500">영향도: {news.impact}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 기술적 지표 */}
            <div className="bg-white rounded-lg p-2.5 border border-gray-200">
              <h3 className="font-bold text-xs mb-1.5">기술적 분석</h3>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <div className="text-[9px] text-gray-500 mb-0.5">RSI</div>
                  <div className="font-semibold text-xs">{analysis.technicalIndicators.rsi}</div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-500 mb-0.5">MACD</div>
                  <div className="font-semibold text-xs">{analysis.technicalIndicators.macd}</div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-500 mb-0.5">볼린저밴드</div>
                  <div className="font-semibold text-xs">{analysis.technicalIndicators.볼린저밴드}</div>
                </div>
                <div>
                  <div className="text-[9px] text-gray-500 mb-0.5">이동평균선</div>
                  <div className="font-semibold text-xs">{analysis.technicalIndicators.이동평균선}</div>
                </div>
              </div>
            </div>
          </div>

          {/* 면책 조항 */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-2">
            <p className="text-[9px] text-yellow-800">
              ⚠️ 본 분석은 AI 알고리즘에 의해 생성된 참고 자료이며, 투자 권유나 보장이 아닙니다. 
              투자 결정은 본인의 판단과 책임 하에 이루어져야 합니다.
            </p>
          </div>

          {/* 액션 버튼 */}
          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg font-semibold text-xs transition-colors"
            >
              닫기
            </button>
            <button
              className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold text-xs transition-colors"
              onClick={onClose}
            >
              분석 리포트 저장
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}