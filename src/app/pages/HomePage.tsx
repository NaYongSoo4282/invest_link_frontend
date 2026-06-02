import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { SearchBar } from '../components/SearchBar';
import { StockChart } from '../components/StockChart';
import { StockList } from '../components/StockList';
import { NewsPanel } from '../components/NewsPanel';
import { SectorTrends } from '../components/SectorTrends';
import { LoginModal } from '../components/LoginModal';
import { stocks, generateChartData, sectorIndices, getNewsByStockCode, Stock, getSectorAverage } from '../data/stockData';
import { BarChart3, User, Star, Sparkles } from 'lucide-react';

export function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStock, setSelectedStock] = useState<Stock>(stocks[0]);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<{ email: string } | null>(null);
  const [favoriteStocks, setFavoriteStocks] = useState<string[]>([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [selectedSector, setSelectedSector] = useState<string | null>(null);

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

  // 선택된 주식의 차트 데이터
  const chartData = useMemo(() => {
    return generateChartData(selectedStock.price);
  }, [selectedStock]);

  // 업종 평균
  const sectorAvg = useMemo(() => {
    return getSectorAverage(selectedStock.sector);
  }, [selectedStock]);

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-[1400px] mx-auto px-4 py-3">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-600 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold">코스피 200</h1>
                <p className="text-xs text-gray-500">국내 주식 시장 현황</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
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
                      className="text-sm text-green-600 hover:underline ml-2"
                    >
                      로그아웃
                    </button>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => setIsLoginModalOpen(true)}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span className="text-sm font-medium">로그인</span>
                </button>
              )}
            </div>
          </div>
          <SearchBar
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="종목명 또는 종목코드 검색 (예: 삼성전자, 005930)"
          />
        </div>
      </header>

      {/* 메인 컨텐츠 */}
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
              <div className="px-3 py-2 border-b border-gray-100 bg-yellow-50">
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 fill-yellow-500 text-yellow-500" />
                  <h3 className="font-semibold text-sm text-gray-700">관심종목</h3>
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
                            isSelected ? 'bg-green-50 border-l-4 border-green-600' : ''
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
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
                <Link
                  to={`/ai-analysis/${selectedStock.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Sparkles className="w-4 h-4" />
                  <span className="text-sm font-medium">AI 분석</span>
                </Link>
              </div>
              <div className="h-[400px]">
                <StockChart
                  data={chartData}
                  stockName={selectedStock.name}
                  currentPrice={selectedStock.price}
                  changePercent={selectedStock.changePercent}
                />
              </div>
            </div>

            {/* 종목 상세 정보 */}
            <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
              <h3 className="font-semibold mb-4">종목 정보</h3>
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
              <div className="border-t border-gray-100 pt-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-semibold text-gray-700">투자지표</h4>
                  {selectedStock.sector && (
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">
                      {selectedStock.sector}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div className="border border-blue-200 rounded-lg py-3 px-2 flex flex-col items-center justify-center">
                    <div className="text-xs text-gray-600 font-medium mb-1">PER</div>
                    <div className="text-xl font-bold text-gray-900">
                      {selectedStock.per?.toFixed(1) ?? '-'}
                    </div>
                    <div className="text-[10px] text-gray-500 mb-1">배</div>
                    {sectorAvg && (
                      <div className="text-[11px] font-medium text-gray-500 whitespace-nowrap">
                        동종업계 평균 {sectorAvg.per.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <div className="border border-purple-200 rounded-lg py-3 px-2 flex flex-col items-center justify-center">
                    <div className="text-xs text-gray-600 font-medium mb-1">PBR</div>
                    <div className="text-xl font-bold text-gray-900">
                      {selectedStock.pbr?.toFixed(1) ?? '-'}
                    </div>
                    <div className="text-[10px] text-gray-500 mb-1">배</div>
                    {sectorAvg && (
                      <div className="text-[11px] font-medium text-gray-500 whitespace-nowrap">
                        동종업계 평균 {sectorAvg.pbr.toFixed(1)}
                      </div>
                    )}
                  </div>
                  <div className="border border-green-200 rounded-lg py-3 px-2 flex flex-col items-center justify-center">
                    <div className="text-xs text-gray-600 font-medium mb-1">ROE</div>
                    <div className="text-xl font-bold text-gray-900">
                      {selectedStock.roe?.toFixed(1) ?? '-'}
                    </div>
                    <div className="text-[10px] text-gray-500 mb-1">%</div>
                    {sectorAvg && (
                      <div className="text-[11px] font-medium text-gray-500 whitespace-nowrap">
                        동종업계 평균 {sectorAvg.roe.toFixed(1)}
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
              news={getNewsByStockCode(selectedStock.code)}
              title={`${selectedStock.name} 뉴스`}
            />
          </div>
        </div>
      </main>

      {/* 로그인 모달 */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLogin={handleLogin}
      />
    </div>
  );
}
