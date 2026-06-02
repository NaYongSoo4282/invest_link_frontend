import { HelpCircle } from 'lucide-react';

interface TechnicalIndicatorHelpProps {
  label: 'RSI' | 'MACD' | '볼린저밴드' | '이동평균선';
  compact?: boolean;
}

const indicatorDescriptions = {
  RSI: {
    title: 'RSI',
    summary: '최근 가격 상승과 하락의 강도를 비교해 과열 여부를 보는 지표입니다.',
    hint: '보통 70 이상은 과매수, 30 이하는 과매도 구간으로 참고합니다.',
  },
  MACD: {
    title: 'MACD',
    summary: '단기와 장기 이동평균의 차이로 추세 전환 가능성을 보는 지표입니다.',
    hint: '매수/매도 신호는 추세 방향을 판단할 때 보조적으로 사용합니다.',
  },
  볼린저밴드: {
    title: '볼린저밴드',
    summary: '가격이 평균선 주변에서 어느 정도 범위로 움직이는지 보여줍니다.',
    hint: '밴드 폭이 넓어지면 변동성이 커졌다는 의미로 볼 수 있습니다.',
  },
  이동평균선: {
    title: '이동평균선',
    summary: '일정 기간 평균 가격으로 주가의 큰 흐름을 파악하는 지표입니다.',
    hint: '정배열은 상승 추세, 역배열은 약세 추세 판단에 참고합니다.',
  },
};

export function TechnicalIndicatorHelp({ label, compact = false }: TechnicalIndicatorHelpProps) {
  const description = indicatorDescriptions[label];

  return (
    <span className="relative inline-flex group">
      <button
        type="button"
        aria-label={`${label} 설명 보기`}
        className={`inline-flex items-center justify-center rounded-full text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gray-500 focus-visible:ring-offset-1 ${
          compact ? 'h-4 w-4' : 'h-5 w-5'
        }`}
      >
        <HelpCircle className={compact ? 'h-3.5 w-3.5' : 'h-4 w-4'} />
      </button>
      <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 hidden w-64 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-3.5 text-left shadow-lg group-hover:block group-focus-within:block">
        <span className="mb-1 block text-sm font-bold text-gray-900">{description.title}</span>
        <span className="block text-xs leading-relaxed text-gray-600">{description.summary}</span>
        <span className="mt-1.5 block text-[11px] leading-relaxed text-gray-500">{description.hint}</span>
      </span>
    </span>
  );
}
