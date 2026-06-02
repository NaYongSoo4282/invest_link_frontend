import { Stock } from '../data/stockData';
import { Star } from 'lucide-react';

interface StockListProps {
  // TODO(API): 백엔드에서 받아온 종목 배열 Stock[]가 이 props로 들어옵니다.
  // 리스트에서 현재 사용하는 필드는 id, name, code이고, 선택 시 전체 stock 객체가 상세 화면으로 전달됩니다.
  stocks: Stock[];
  onSelectStock: (stock: Stock) => void;
  selectedStockId?: string;
  favoriteStocks: string[];
  onToggleFavorite: (stockId: string) => void;
}

export function StockList({ stocks, onSelectStock, selectedStockId, favoriteStocks, onToggleFavorite }: StockListProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100">
      <div className="px-3 py-2 border-b border-gray-100">
        <h3 className="font-semibold text-sm">시가총액 순위</h3>
      </div>
      <div className="divide-y divide-gray-100 max-h-[600px] overflow-y-auto">
        {stocks.map((stock, index) => {
          const isSelected = stock.id === selectedStockId;
          const isFavorite = favoriteStocks.includes(stock.id);

          return (
            <div
              key={stock.id}
              onClick={() => onSelectStock(stock)}
              className={`w-full px-3 py-2 hover:bg-gray-50 transition-colors cursor-pointer flex items-center justify-between ${
                isSelected ? 'bg-violet-50 border-l-4 border-violet-600' : ''
              }`}
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                <span className="text-xs font-medium text-gray-400 w-5 flex-shrink-0">{index + 1}</span>
                <div className="min-w-0 flex-1">
                  <div className="font-medium text-sm truncate">{stock.name}</div>
                  <div className="text-xs text-gray-400">{stock.code}</div>
                </div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(stock.id);
                }}
                className="p-1 hover:bg-gray-200 rounded flex-shrink-0"
              >
                <Star
                  className={`w-4 h-4 ${
                    isFavorite ? 'fill-yellow-500 text-yellow-500' : 'text-gray-400'
                  }`}
                />
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
