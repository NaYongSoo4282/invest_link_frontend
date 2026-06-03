import { useState, useMemo, useEffect } from 'react';
import { SearchBar } from './components/SearchBar';
import { StockChart } from './components/StockChart';
import { StockList } from './components/StockList';
import { NewsPanel } from './components/NewsPanel';
import { SectorTrends } from './components/SectorTrends';
import { LoginModal } from './components/LoginModal';
import { AIAnalysisTab } from './components/AIAnalysisTab';
import { InvestmentMetricHelp } from './components/InvestmentMetricHelp';
import type { ChartData, NewsItem, SectorAverage, SectorIndex, Stock } from './data/stockData';
import {
  generateChartData,
  getNewsByStockCode,
  getSectorAverage,
  sectorIndices as mockSectorIndices,
  stocks as mockStocks,
} from './data/stockData';
import type { AIAnalysis } from './api';
import {
  fetchStockAnalysis,
  fetchStockSummary,
  fetchStocks,
} from './api';
import { BarChart3, User, Star, Sparkles, Home } from 'lucide-react';

function createMockAnalysis(stock: Stock): AIAnalysis {
  const isPositive = stock.changePercent >= 0;
  const targetPrice = Math.round(stock.price * (isPositive ? 1.08 : 1.04));

  return {
    summary: `${stock.name}는 최근 ${isPositive ? '상승' : '조정'} 흐름을 보이고 있으며, 거래량과 투자지표를 종합하면 단기 변동성은 있으나 업종 내 관심도가 유지되는 종목입니다.`,
    recommendation: isPositive ? '보유' : '관망',
    targetPrice,
    confidence: isPositive ? 82 : 74,
    positiveFactors: [
      '거래량이 꾸준히 유지되며 시장 관심도가 확인됩니다.',
      '동종업계 평균과 비교해 주요 투자지표를 함께 검토할 수 있습니다.',
      '최근 뉴스 흐름이 종목 모멘텀 판단에 참고됩니다.',
    ],
    negativeFactors: [
      '단기 가격 변동성이 확대될 가능성이 있습니다.',
      '시장 전체 흐름에 따라 목표 주가 신뢰도가 달라질 수 있습니다.',
    ],
    newsAnalysis: [
      {
        sentiment: isPositive ? 'positive' : 'neutral',
        title: `${stock.name} 관련 업종 이슈와 수급 흐름 점검`,
        impact: isPositive ? '높음' : '보통',
      },
      {
        sentiment: 'neutral',
        title: '국내 증시 변동성 확대에 따른 투자 심리 변화',
        impact: '보통',
      },
    ],
    technicalIndicators: {
      rsi: isPositive ? 58 : 46,
      macd: isPositive ? '매수 신호' : '중립',
      볼린저밴드: isPositive ? '상단 접근' : '중립',
      이동평균선: isPositive ? '정배열' : '혼조',
    },
  };
}

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  const [stocks, setStocks] = useState<Stock[]>(mockStocks);
  const [selectedStock, setSelectedStock] = useState<Stock | null>(mockStocks[0] ?? null);
  const [sectorIndices, setSectorIndices] = useState<SectorIndex[]>(mockSectorIndices);
  const [chartData, setChartData] = useState<ChartData[]>(generateChartData(mockStocks[0]?.price ?? 0));
  const [sectorAvg, setSectorAvg] = useState<SectorAverage | null>(getSectorAverage(mockStocks[0]?.sector));
  const [selectedStockNews, setSelectedStockNews] = useState<NewsItem[]>(getNewsByStockCode(mockStocks[0]?.code ?? ''));
  const [analysisByStockCode, setAnalysisByStockCode] = useState<Record<string, AIAnalysis>>({});
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isChartLoading, setIsChartLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [favoriteStocks, setFavoriteStocks] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [activeTab, setActiveTab] = useState<'home' | 'ai-analysis'>('home');
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadInitialData() {
      try {
        setApiError(null);
        const stockData = await fetchStocks();

        if (!isMounted) return;

        if (stockData.length > 0) {
          setStocks(stockData);
          setSelectedStock(stockData[0]);
        } else {
          setStocks(mockStocks);
          setSelectedStock(mockStocks[0] ?? null);
        }

        setSectorIndices(mockSectorIndices);
      } catch (error) {
        if (!isMounted) return;
        setStocks(mockStocks);
        setSectorIndices(mockSectorIndices);
        setSelectedStock(mockStocks[0] ?? null);
        setApiError('백엔드 연결이 불안정해서 mock 데이터로 화면을 표시합니다.');
      } finally {
        if (isMounted) {
          setIsInitialLoading(false);
        }
      }
    }

    loadInitialData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedStock) return;
    let isMounted = true;

    async function loadSelectedStockData(stock: Stock) {
      setIsChartLoading(true);
      setApiError(null);

      try {
        const summary = await fetchStockSummary(stock.code);
        if (!isMounted) return;

        const mergedStock = {
          ...stock,
          ...summary,
          sector: summary.sector ?? stock.sector,
        };

        setSelectedStock(mergedStock);
        setChartData(generateChartData(mergedStock.price));
        setSectorAvg(getSectorAverage(mergedStock.sector));
        setSelectedStockNews(getNewsByStockCode(mergedStock.code));
      } catch (error) {
        if (!isMounted) return;
        setChartData(generateChartData(stock.price));
        setSectorAvg(getSectorAverage(stock.sector));
        setSelectedStockNews(getNewsByStockCode(stock.code));
      } finally {
        if (isMounted) {
          setIsChartLoading(false);
        }
      }
    }

    loadSelectedStockData(selectedStock);

    return () => {
      isMounted = false;
    };
  }, [selectedStock?.code]);

  // 로그인 처리
  const handleLogin = (email: string, password: string) => {
    setUser({ email });
    setIsLoginModalOpen(false);

    const saved = localStorage.getItem(`favorites_${email}`);
    if (saved) {
      setFavoriteStocks(JSON.parse(saved));
    }
  };

  // 로그아웃 처리
  const handleLogout = () => {
    setUser(null);
    setFavoriteStocks([]);
    setShowFavoritesOnly(false);
  };

  // 관심종목 토글
  const handleToggleFavorite = (stockId: string) => {
    if (!user) {
      setIsLoginModalOpen(true);
      return;
    }

    setFavoriteStocks((prev) => {
      const newFavorites = prev.includes(stockId)
        ? prev.filter((id) => id !== stockId)
        : [...prev, stockId];

      localStorage.setItem(`favorites_${user.email}`, JSON.stringify(newFavorites));
      return newFavorites;
    });
  };

  // 검색 필터링
  const filteredStocks = useMemo(() => {
    let result = stocks;

    if (selectedSector) {
      result = result.filter((stock) => stock.sector === selectedSector);
    }

    if (showFavoritesOnly && user) {
      result = result.filter((stock) => favoriteStocks.includes(stock.id));
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (stock) =>
          stock.name.toLowerCase().includes(query) ||
          stock.code.includes(query)
      );
    }

    return result;
  }, [searchQuery, selectedSector, showFavoritesOnly, favoriteStocks, user]);

  // AI 분석 열기
  const handleOpenAIAnalysis = async () => {
    if (isAnalyzing || !selectedStock) return;

    if (analysisByStockCode[selectedStock.code]) {
      setActiveTab('ai-analysis');
      return;
    }

    setIsAnalyzing(true);

    setApiError(null);

    try {
      const analysis = await fetchStockAnalysis(selectedStock.code);
      setAnalysisByStockCode((prev) => ({
        ...prev,
        [selectedStock.code]: analysis,
      }));
      setActiveTab('ai-analysis');
    } catch (error) {
      const analysis = createMockAnalysis(selectedStock);
      setAnalysisByStockCode((prev) => ({
        ...prev,
        [selectedStock.code]: analysis,
      }));
      setApiError('AI 분석 API 연결이 불안정해서 mock 분석 결과로 표시합니다.');
      setActiveTab('ai-analysis');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // 업종별 필터
  const handleSelectSector = (sector: string) => {
    const nextSector = selectedSector === sector ? null : sector;
    setSelectedSector(nextSector);

    if (!nextSector) return;

    const firstStockInSector = stocks.find((stock) => stock.sector === nextSector);
    if (firstStockInSector) {
      setSelectedStock(firstStockInSector);
    }
  };

  const selectedAnalysis = selectedStock ? analysisByStockCode[selectedStock.code] : undefined;

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
            <span className="font-medium text-gray-700">종목 데이터를 불러오는 중입니다.</span>
          </div>
        </div>
      </div>
    );
  }

  if (!selectedStock) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="max-w-md rounded-xl border border-red-100 bg-white p-6 text-center shadow-sm">
          <h1 className="text-lg font-bold text-gray-900">종목 데이터를 표시할 수 없습니다</h1>
          <p className="mt-2 text-sm text-gray-600">
            {apiError ?? '백엔드에서 종목 목록을 내려주지 않았습니다.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-violet-100 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-violet-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">코스피 200</h1>
                <p className="text-xs text-gray-500">국내 주식 시장 현황</p>
              </div>
            </div>

            {activeTab === 'home' && (
              <div className="flex-1 max-w-md">
                <SearchBar
                  value={searchQuery}
                  onChange={setSearchQuery}
                  placeholder="종목명 또는 종목코드 검색 (예: 삼성전자, 005930)"
                />
              </div>
            )}

            <div className="flex items-center gap-3">
              {/* 탭 전환 버튼 */}
              <div className="flex items-center gap-2 bg-violet-50 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab('home')}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm font-medium ${
                    activeTab === 'home'
                      ? 'bg-white text-violet-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Home className="w-4 h-4" />
                  <span>홈</span>
                </button>
                <button
                  onClick={handleOpenAIAnalysis}
                  disabled={isAnalyzing}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-sm font-medium ${
                    activeTab === 'ai-analysis'
                      ? 'bg-white text-violet-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  } ${isAnalyzing ? 'opacity-70 cursor-wait' : ''}`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI 분석</span>
                </button>
              </div>

              {user ? (
                <>
                  <button
                    onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                      showFavoritesOnly
                        ? 'bg-yellow-100 text-yellow-700'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${showFavoritesOnly ? 'fill-yellow-500' : ''}`} />
                    <span className="text-sm font-medium">관심종목</span>
                  </button>
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">{user.email}</span>
                    <button
                      onClick={handleLogout}
                      className="text-sm text-violet-600 hover:underline ml-2"
                    >
                      로그아웃
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">로그인</span>
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 메인 컨텐츠 */}
      {apiError && (
        <div className="max-w-[1400px] mx-auto px-4 pt-4">
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {apiError}
          </div>
        </div>
      )}

      {activeTab === 'home' ? (
        <main className="max-w-[1400px] mx-auto px-4 py-4">
          {/* 업종별 지표 */}
          <div className="mb-4">
            <SectorTrends
              indices={sectorIndices}
              selectedSector={selectedSector}
              onSelectSector={handleSelectSector}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* 왼쪽: 종목 리스트 */}
          <div className="lg:col-span-3 space-y-4">
            {/* 즐겨찾기 종목 리스트 */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="px-3 py-2 border-b border-violet-100 bg-violet-50/60">
                  <div className="flex items-center gap-1.5">
                    <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                    <h3 className="font-semibold text-sm text-violet-950">관심종목</h3>
                  </div>
                </div>
                {favoriteStocks.length > 0 ? (
                  <div className="divide-y divide-gray-100">
                    {stocks
                      .filter(stock => favoriteStocks.includes(stock.id))
                      .map((stock, index) => {
                        const isSelected = stock.id === selectedStock.id;
                        return (
                          <div
                            key={stock.id}
                            onClick={() => setSelectedStock(stock)}
                            className={`w-full px-3 py-2 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between ${
                              isSelected ? 'bg-violet-50 border-l-4 border-violet-600' : ''
                            }`}
                          >
                            <div className="flex items-center gap-2 flex-1 min-w-0">
                              <div className="min-w-0 flex-1">
                                <div className="font-medium text-sm truncate">{stock.name}</div>
                                <div className="text-xs text-gray-400">{stock.code}</div>
                              </div>
                            </div>
                            <div className={`text-xs font-medium ${stock.changePercent >= 0 ? 'text-red-500' : 'text-blue-500'}`}>
                              {stock.changePercent >= 0 ? '+' : ''}{stock.changePercent}%
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="px-3 py-6 text-center text-xs text-gray-400">
                    {user ? '관심종목을 추가해보세요' : '로그인 후 이용하세요'}
                  </div>
                )}
              </div>

              {/* 전체 종목 리스트 */}
              {/* TODO(API): StockList에는 API에서 받은 Stock[]를 넘기면 됩니다. */}
              <StockList
                stocks={filteredStocks}
                onSelectStock={setSelectedStock}
                selectedStockId={selectedStock.id}
                favoriteStocks={favoriteStocks}
                onToggleFavorite={handleToggleFavorite}
              />
              {filteredStocks.length === 0 && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center text-gray-500">
                  <p>검색 결과가 없습니다</p>
                </div>
              )}
            </div>

            {/* 중앙: 차트와 종목 정보 */}
            <div className="lg:col-span-6 space-y-4">
              {/* 차트 */}
              <div className="bg-white rounded-xl shadow-sm border border-violet-100 p-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-bold">{selectedStock.name}</h2>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-3xl font-bold">{selectedStock.price.toLocaleString()}원</span>
                      <span className={`text-lg font-semibold ${selectedStock.changePercent >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.changePercent}%
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={handleOpenAIAnalysis}
                    disabled={isAnalyzing}
                    className={`flex items-center gap-2 px-3 py-2 bg-violet-600 text-white rounded-lg transition-colors ${
                      isAnalyzing ? 'opacity-80 cursor-wait' : 'hover:bg-violet-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">AI 분석</span>
                  </button>
                </div>
                <div className="h-[400px]">
                  {isChartLoading ? (
                    <div className="flex h-full items-center justify-center text-sm text-gray-500">
                      차트 데이터를 불러오는 중입니다.
                    </div>
                  ) : (
                    <StockChart
                      data={chartData}
                      stockName={selectedStock.name}
                      currentPrice={selectedStock.price}
                      changePercent={selectedStock.changePercent}
                    />
                  )}
                </div>
              </div>

              {/* 종목 상세 정보 */}
              <div className="bg-white rounded-xl p-5 shadow-sm border border-violet-100">
                <h3 className="font-semibold mb-4 text-violet-950">종목 정보</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <div className="text-xs text-gray-500 mb-1">종목코드</div>
                    <div className="font-medium">{selectedStock.code}</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">시가총액</div>
                    <div className="font-medium">{(selectedStock.marketCap / 10000).toFixed(0)}억원</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">거래량</div>
                    <div className="font-medium">{selectedStock.volume.toLocaleString()}주</div>
                  </div>
                  <div>
                    <div className="text-xs text-gray-500 mb-1">전일대비</div>
                    <div className={`font-medium ${selectedStock.changePercent >= 0 ? 'text-red-500' : 'text-green-500'}`}>
                      {selectedStock.changePercent >= 0 ? '+' : ''}{selectedStock.change.toLocaleString()}원
                    </div>
                  </div>
                </div>
                <div className="border-t border-violet-100 pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-semibold text-violet-900">투자지표</h4>
                    {selectedStock.sector && (
                      <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                        {selectedStock.sector}
                      </span>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-3">
                    <div className="grid grid-cols-3 gap-2">
                      <div className="border border-blue-200 rounded-lg p-3 flex flex-col items-start justify-start bg-blue-50/30">
                        <div className="text-xs text-gray-600 font-medium mb-1 flex items-center gap-1">
                          PER
                          <InvestmentMetricHelp label="PER" tone="blue" />
                        </div>
                        <div className="text-2xl leading-none font-bold text-gray-900">
                          {selectedStock.per?.toFixed(1) ?? '-'}
                        </div>
                        <div className="text-[11px] leading-tight text-gray-500 mt-1">배</div>
                      </div>
                      <div className="border border-purple-200 rounded-lg p-3 flex flex-col items-start justify-start bg-purple-50/30">
                        <div className="text-xs text-gray-600 font-medium mb-1 flex items-center gap-1">
                          PBR
                          <InvestmentMetricHelp label="PBR" tone="purple" />
                        </div>
                        <div className="text-2xl leading-none font-bold text-gray-900">
                          {selectedStock.pbr?.toFixed(1) ?? '-'}
                        </div>
                        <div className="text-[11px] leading-tight text-gray-500 mt-1">배</div>
                      </div>
                      <div className="border border-green-200 rounded-lg p-3 flex flex-col items-start justify-start bg-green-50/30">
                        <div className="text-xs text-gray-600 font-medium mb-1 flex items-center gap-1">
                          ROE
                          <InvestmentMetricHelp label="ROE" tone="green" />
                        </div>
                        <div className="text-2xl leading-none font-bold text-gray-900">
                          {selectedStock.roe?.toFixed(1) ?? '-'}
                        </div>
                        <div className="text-[11px] leading-tight text-gray-500 mt-1">%</div>
                      </div>
                    </div>
                    <div className="rounded-lg border border-violet-200 bg-violet-50/50 p-3 md:w-36">
                      <div className="text-xs font-semibold text-violet-900 mb-2">동종업계 평균</div>
                      {sectorAvg && (
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between gap-3 text-xs">
                            <span className="text-gray-500">PER</span>
                            <span className="font-semibold text-gray-900">{sectorAvg.per.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 text-xs">
                            <span className="text-gray-500">PBR</span>
                            <span className="font-semibold text-gray-900">{sectorAvg.pbr.toFixed(1)}</span>
                          </div>
                          <div className="flex items-center justify-between gap-3 text-xs">
                            <span className="text-gray-500">ROE</span>
                            <span className="font-semibold text-gray-900">{sectorAvg.roe.toFixed(1)}</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 오른쪽: 종목별 뉴스 */}
            <div className="lg:col-span-3">
              <NewsPanel
                news={selectedStockNews}
                title={`${selectedStock.name} 뉴스`}
              />
            </div>
          </div>
        </main>
      ) : (
        <AIAnalysisTab stock={selectedStock} analysis={selectedAnalysis} chartData={chartData} sectorAvg={sectorAvg} />
      )}

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />

      {isAnalyzing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/35 backdrop-blur-sm">
          <div className="w-[min(92vw,420px)] rounded-xl border border-violet-100 bg-white p-6 shadow-2xl">
            <div className="flex items-start gap-4">
              <div className="mt-1 flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-violet-50">
                <div className="h-6 w-6 animate-spin rounded-full border-2 border-violet-200 border-t-violet-600" />
              </div>
              <div>
                <div className="flex items-center gap-2 text-violet-700">
                  <Sparkles className="h-4 w-4" />
                  <h2 className="font-bold">AI 분석 중</h2>
                </div>
                <p className="mt-2 text-sm font-medium text-gray-900">
                  {selectedStock.name} 데이터를 분석하고 있습니다.
                </p>
                <p className="mt-1 text-sm leading-relaxed text-gray-600">
                  가격 흐름, 투자지표, 뉴스 요인을 종합하는 중입니다.
                </p>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div className="h-full w-2/3 animate-pulse rounded-full bg-violet-600" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
