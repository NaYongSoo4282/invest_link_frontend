import { useParams, useNavigate } from "react-router";
import {
  ArrowLeft,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Target,
  Sparkles,
  BarChart3,
} from "lucide-react";
import { stocks, Stock, getSectorAverage } from "../data/stockData";
import { StockChart } from "../components/StockChart";
import { generateChartData } from "../data/stockData";
import { useMemo } from "react";
import { TechnicalIndicatorHelp } from "../components/TechnicalIndicatorHelp";
import { AnalysisValueHelp } from "../components/AnalysisValueHelp";

export function AIAnalysisPage() {
  const { stockId } = useParams<{ stockId: string }>();
  const navigate = useNavigate();

  // 종목 찾기
  const stock = stocks.find((s) => s.id === stockId);

  if (!stock) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">
            종목을 찾을 수 없습니다.
          </p>
          <button
            onClick={() => navigate("/")}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            홈으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const chartData = useMemo(() => {
    return generateChartData(stock.price);
  }, [stock]);

  const sectorAvg = useMemo(() => {
    return getSectorAverage(stock.sector);
  }, [stock]);

  // Mock AI 분석 데이터
  const analysis = {
    summary: `${stock.name}는 최근 ${stock.changePercent >= 0 ? "상승" : "하락"} 추세를 보이고 있으며, 현재 시가총액은 ${(stock.marketCap / 1000000000000).toFixed(1)}조원입니다. 거래량과 뉴스 분석 결과를 종합한 AI 투자 의견입니다.`,
    recommendation:
      stock.changePercent >= 2
        ? "매수"
        : stock.changePercent <= -2
          ? "관망"
          : "보유",
    targetPrice:
      stock.price + stock.price * (Math.random() * 0.2 - 0.1),
    confidence: Math.floor(70 + Math.random() * 25),
    positiveFactors: [
      "최근 3일간 거래량 증가 추세",
      "업종 평균 대비 양호한 실적",
      "긍정적인 뉴스 sentiment 분석 결과",
      "기술적 지표상 상승 모멘텀 감지",
    ],
    negativeFactors: [
      "단기 과매수 구간 진입 가능성",
      "글로벌 시장 불확실성 증가",
      "경쟁사 대비 밸류에이션 높은 수준",
    ],
    newsAnalysis: [
      {
        sentiment: "positive",
        title: "신제품 출시로 시장 점유율 확대 전망",
        impact: "높음",
      },
      {
        sentiment: "positive",
        title: "분기 실적 시장 예상치 상회",
        impact: "중간",
      },
      {
        sentiment: "neutral",
        title: "경영진 교체 발표",
        impact: "낮음",
      },
    ],
    technicalIndicators: {
      rsi: 45 + Math.floor(Math.random() * 30),
      macd:
        stock.changePercent >= 0 ? "매수 신호" : "관망 신호",
      볼린저밴드: "중립",
      이동평균선:
        stock.changePercent >= 0 ? "정배열" : "역배열",
    },
  };

  const getRecommendationColor = (rec: string) => {
    if (rec === "매수")
      return "text-red-600 bg-red-50 border-red-200";
    if (rec === "매도")
      return "text-blue-600 bg-blue-50 border-blue-200";
    return "text-gray-600 bg-gray-50 border-gray-200";
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-gradient-to-r from-green-600 to-emerald-600 text-white sticky top-0 z-10 shadow-lg">
        <div className="max-w-[1400px] mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-3">
            <button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 text-white/90 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">
                홈으로 돌아가기
              </span>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <span className="font-bold">AI 투자 분석</span>
            </div>
          </div>

          {/* 종목 정보 */}
          <div className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold">
                  {stock.name}
                </h1>
                <p className="text-green-100 text-sm mt-1">
                  종목코드: {stock.code}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-green-100">
                  현재가
                </div>
                <div className="text-3xl font-bold">
                  {stock.price.toLocaleString()}원
                </div>
                <div
                  className={`text-lg font-semibold mt-1 ${stock.changePercent >= 0 ? "text-red-200" : "text-blue-200"}`}
                >
                  {stock.changePercent >= 0 ? "+" : ""}
                  {stock.changePercent}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      <main className="max-w-[1400px] mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 왼쪽: 차트와 AI 분석 요약 */}
          <div className="lg:col-span-2 space-y-6">
            {/* 차트 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-green-600" />
                30일 가격 추이
              </h2>
              <div className="h-[400px]">
                <StockChart
                  data={chartData}
                  stockName={stock.name}
                  currentPrice={stock.price}
                  changePercent={stock.changePercent}
                />
              </div>
            </div>

            {/* AI 분석 요약 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border border-green-200">
              <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-green-600" />
                AI 분석 요약
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                {analysis.summary}
              </p>
            </div>

            {/* 긍정적 요인 & 리스크 요인 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-red-50 rounded-xl p-6 border border-red-200">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-red-700">
                  <TrendingUp className="w-5 h-5" />
                  긍정적 요인
                </h3>
                <ul className="space-y-3">
                  {analysis.positiveFactors.map(
                    (factor, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-base leading-relaxed"
                      >
                        <span className="text-red-500 font-bold text-lg leading-relaxed">
                          ✓
                        </span>
                        <span className="text-gray-700">
                          {factor}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
              <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2 text-blue-700">
                  <AlertCircle className="w-5 h-5" />
                  리스크 요인
                </h3>
                <ul className="space-y-3">
                  {analysis.negativeFactors.map(
                    (factor, index) => (
                      <li
                        key={index}
                        className="flex items-start gap-2 text-base leading-relaxed"
                      >
                        <span className="text-blue-500 font-bold text-lg leading-relaxed">
                          !
                        </span>
                        <span className="text-gray-700">
                          {factor}
                        </span>
                      </li>
                    ),
                  )}
                </ul>
              </div>
            </div>

            {/* 뉴스 기반 분석 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-lg mb-4">
                뉴스 Sentiment 분석
              </h3>
              <div className="space-y-3">
                {analysis.newsAnalysis.map((news, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg"
                  >
                    <div
                      className={`w-3 h-3 rounded-full mt-1.5 ${
                        news.sentiment === "positive"
                          ? "bg-red-500"
                          : news.sentiment === "negative"
                            ? "bg-blue-500"
                            : "bg-gray-400"
                      }`}
                    />
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {news.title}
                      </div>
                      <div className="text-sm text-gray-500 mt-1">
                        영향도: {news.impact}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* 오른쪽: 투자 의견 및 기술적 지표 */}
          <div className="space-y-6">
            {/* 투자 의견 */}
            <div
              className={`rounded-xl p-6 border-2 ${getRecommendationColor(analysis.recommendation)}`}
            >
              <div className="text-sm font-medium mb-2">
                AI 투자 의견
              </div>
              <div className="text-4xl font-bold mb-4">
                {analysis.recommendation}
              </div>
              <div className="text-sm opacity-80">
                이 의견은 AI 분석 결과를 바탕으로
                생성되었습니다.
              </div>
            </div>

            {/* 투자지표 */}
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-base">
                  투자지표
                </h3>
                {stock.sector && (
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                    {stock.sector}
                  </span>
                )}
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="border border-blue-200 rounded-lg p-3 aspect-square flex flex-col items-center justify-center">
                  <div className="text-xs text-gray-600 font-medium mb-1">PER</div>
                  <div className="text-xl font-bold text-gray-900">
                    {stock.per?.toFixed(1) ?? '-'}
                  </div>
                  <div className="text-[10px] text-gray-500 mb-1">배</div>
                  {sectorAvg && (
                    <div className="text-[11px] font-medium text-gray-500 whitespace-nowrap">
                      동종업계 평균 {sectorAvg.per.toFixed(1)}
                    </div>
                  )}
                </div>
                <div className="border border-purple-200 rounded-lg p-3 aspect-square flex flex-col items-center justify-center">
                  <div className="text-xs text-gray-600 font-medium mb-1">PBR</div>
                  <div className="text-xl font-bold text-gray-900">
                    {stock.pbr?.toFixed(1) ?? '-'}
                  </div>
                  <div className="text-[10px] text-gray-500 mb-1">배</div>
                  {sectorAvg && (
                    <div className="text-[11px] font-medium text-gray-500 whitespace-nowrap">
                      동종업계 평균 {sectorAvg.pbr.toFixed(1)}
                    </div>
                  )}
                </div>
                <div className="border border-green-200 rounded-lg p-3 aspect-square flex flex-col items-center justify-center">
                  <div className="text-xs text-gray-600 font-medium mb-1">ROE</div>
                  <div className="text-xl font-bold text-gray-900">
                    {stock.roe?.toFixed(1) ?? '-'}
                  </div>
                  <div className="text-[10px] text-gray-500 mb-1">%</div>
                  {sectorAvg && (
                    <div className="text-[11px] font-medium text-gray-500 whitespace-nowrap">
                      동종업계 평균 {sectorAvg.roe.toFixed(1)}
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800 leading-relaxed">
                  💡 PER은 낮을수록, ROE는 높을수록 일반적으로 좋은 투자 신호로 평가됩니다.
                </p>
              </div>
            </div>

            {/* 목표 주가 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-500 mb-2 flex items-center gap-2">
                <Target className="w-4 h-4" />
                목표 주가
                <AnalysisValueHelp label="목표 주가" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">
                {Math.floor(
                  analysis.targetPrice,
                ).toLocaleString()}
                원
              </div>
              <div className="flex items-center gap-2">
                <span
                  className={`text-sm font-medium ${
                    analysis.targetPrice > stock.price
                      ? "text-red-500"
                      : "text-blue-500"
                  }`}
                >
                  {analysis.targetPrice > stock.price
                    ? "▲"
                    : "▼"}
                  {Math.abs(
                    ((analysis.targetPrice - stock.price) /
                      stock.price) *
                      100,
                  ).toFixed(1)}
                  %
                </span>
                <span className="text-sm text-gray-500">
                  (
                  {analysis.targetPrice > stock.price
                    ? "+"
                    : ""}
                  {Math.floor(
                    analysis.targetPrice - stock.price,
                  ).toLocaleString()}
                  원)
                </span>
              </div>
            </div>

            {/* 신뢰도 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <div className="text-sm text-gray-500 mb-3 flex items-center gap-2">
                분석 신뢰도
                <AnalysisValueHelp label="분석 신뢰도" />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-3xl font-bold text-green-600">
                  {analysis.confidence}%
                </div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-green-600 h-3 rounded-full transition-all"
                  style={{ width: `${analysis.confidence}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-3">
                높은 신뢰도는 데이터 품질과 분석 일관성을
                나타냅니다.
              </p>
            </div>

            {/* 기술적 지표 */}
            <div className="bg-white rounded-xl p-6 border border-gray-200">
              <h3 className="font-bold text-lg mb-4">
                기술적 분석
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="text-base text-gray-500 mb-1.5 flex items-center gap-1.5">
                    RSI (상대강도지수)
                    <TechnicalIndicatorHelp label="RSI" />
                  </div>
                  <div className="font-bold text-xl">
                    {analysis.technicalIndicators.rsi}
                  </div>
                </div>
                <div>
                  <div className="text-base text-gray-500 mb-1.5 flex items-center gap-1.5">
                    MACD
                    <TechnicalIndicatorHelp label="MACD" />
                  </div>
                  <div className="font-bold text-xl">
                    {analysis.technicalIndicators.macd}
                  </div>
                </div>
                <div>
                  <div className="text-base text-gray-500 mb-1.5 flex items-center gap-1.5">
                    볼린저밴드
                    <TechnicalIndicatorHelp label="볼린저밴드" />
                  </div>
                  <div className="font-bold text-xl">
                    {analysis.technicalIndicators.볼린저밴드}
                  </div>
                </div>
                <div>
                  <div className="text-base text-gray-500 mb-1.5 flex items-center gap-1.5">
                    이동평균선
                    <TechnicalIndicatorHelp label="이동평균선" />
                  </div>
                  <div className="font-bold text-xl">
                    {analysis.technicalIndicators.이동평균선}
                  </div>
                </div>
              </div>
            </div>

            {/* 면책 조항 */}
            <div className="bg-yellow-50 border-2 border-yellow-200 rounded-xl p-4">
              <p className="text-base text-yellow-800 leading-relaxed">
                ⚠️ 본 분석은 AI 알고리즘에 의해 생성된 참고
                자료이며, 투자 권유나 보장이 아닙니다. 투자
                결정은 본인의 판단과 책임 하에 이루어져야
                합니다.
              </p>
            </div>

            {/* 액션 버튼 */}
            <button className="w-full px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-colors">
              분석 리포트 저장
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
