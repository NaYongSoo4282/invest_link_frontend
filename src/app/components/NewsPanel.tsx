import { NewsItem } from '../data/stockData';
import { Newspaper, Clock, ExternalLink } from 'lucide-react';

interface NewsPanelProps {
  news: NewsItem[];
  title?: string;
}

const categoryColors: Record<string, string> = {
  '반도체': 'bg-blue-100 text-blue-700',
  '자동차': 'bg-green-100 text-green-700',
  'IT': 'bg-purple-100 text-purple-700',
  '금융': 'bg-yellow-100 text-yellow-700',
  '바이오': 'bg-pink-100 text-pink-700',
  '2차전지': 'bg-teal-100 text-teal-700',
  '증시': 'bg-indigo-100 text-indigo-700',
};

const sourceHomepages: Record<string, string> = {
  '연합뉴스': 'https://www.yna.co.kr',
  '매일경제': 'https://www.mk.co.kr',
  '한국경제': 'https://www.hankyung.com',
  '전자신문': 'https://www.etnews.com',
  '조선일보': 'https://www.chosun.com',
  '서울경제': 'https://www.sedaily.com',
  'IT조선': 'https://it.chosun.com',
  '헬스조선': 'https://health.chosun.com',
};

export function NewsPanel({ news, title = '주요 뉴스' }: NewsPanelProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-violet-100">
      <div className="p-3 border-b border-violet-100 bg-violet-50/60 flex items-center gap-2">
        <Newspaper className="w-4 h-4 text-violet-600" />
        <h3 className="font-semibold text-sm text-violet-950">{title}</h3>
      </div>
      <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
        {news.map((item) => {
          const detailUrl = item.url || sourceHomepages[item.source] || 'https://www.google.com/search?tbm=nws&q=' + encodeURIComponent(item.title);

          return (
          <div key={item.id} className="p-4 hover:bg-violet-50/35 transition-colors">
            <div className="flex items-start gap-2 mb-2">
              <span
                className={`px-2 py-0.5 rounded text-xs font-medium ${
                  categoryColors[item.category] || 'bg-gray-100 text-gray-700'
                }`}
              >
                {item.category}
              </span>
            </div>
            <h4 className="text-sm font-medium mb-2 leading-snug line-clamp-2">
              {item.title}
            </h4>
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{item.source}</span>
              <div className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{item.time}</span>
              </div>
            </div>
            <a
              href={detailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-violet-600 hover:text-violet-700 hover:underline"
            >
              자세히 보기
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
          );
        })}
      </div>
    </div>
  );
}
