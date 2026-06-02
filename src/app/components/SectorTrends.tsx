import { SectorIndex } from '../data/stockData';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface SectorTrendsProps {
  indices: SectorIndex[];
  selectedSector?: string | null;
  onSelectSector?: (sector: string) => void;
}

export function SectorTrends({ indices, selectedSector, onSelectSector }: SectorTrendsProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-violet-100 overflow-hidden">
      <div className="p-3 border-b border-violet-100 bg-violet-50/60 flex items-center justify-between gap-3">
        <h3 className="font-semibold text-sm text-violet-950">업종별 지표</h3>
        {selectedSector && (
          <button
            type="button"
            onClick={() => onSelectSector?.(selectedSector)}
            className="text-xs font-medium text-violet-600 hover:text-violet-700"
          >
            전체 보기
          </button>
        )}
      </div>
      
      {/* 업종별 지표 그리드 */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 p-3">
        {indices.map((sector) => {
          const isPositive = sector.changePercent >= 0;
          const isSelected = selectedSector === sector.sector;
          
          return (
            <button
              key={sector.sector}
              type="button"
              onClick={() => onSelectSector?.(sector.sector)}
              className={`text-left rounded-lg p-3 border transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-500 focus-visible:ring-offset-2 ${
                isSelected
                  ? 'bg-violet-50 border-violet-500 shadow-sm'
                  : 'bg-gray-50 border-gray-200 hover:border-violet-300 hover:bg-violet-50/40'
              }`}
              aria-pressed={isSelected}
            >
              {/* 헤더 */}
              <div className="mb-2">
                <div className="flex items-center gap-1 mb-1">
                  <h4 className="font-semibold text-xs text-gray-700">{sector.sector}</h4>
                  {isPositive ? (
                    <TrendingUp className="w-3 h-3 text-red-500" />
                  ) : (
                    <TrendingDown className="w-3 h-3 text-green-500" />
                  )}
                </div>
                <div className="text-lg font-bold">{sector.value.toFixed(2)}</div>
              </div>
              
              {/* 변동 지표 */}
              <div className="flex items-center gap-2">
                <div className={`text-sm font-semibold ${isPositive ? 'text-red-500' : 'text-green-500'}`}>
                  {isPositive ? '+' : ''}{sector.change.toFixed(2)}
                </div>
                <div className={`text-xs font-medium ${isPositive ? 'text-red-500' : 'text-green-500'}`}>
                  ({isPositive ? '+' : ''}{sector.changePercent}%)
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
