import { HelpCircle } from 'lucide-react';

interface AnalysisValueHelpProps {
  label: '목표 주가' | '분석 신뢰도';
  compact?: boolean;
}

const valueDescriptions = {
  '목표 주가': {
    title: '목표 주가',
    summary: '현재 가격, 변동률, 지표 흐름을 바탕으로 계산한 참고 가격입니다.',
    hint: '실제 도달을 보장하는 값이 아니라 투자 판단을 돕는 예상치입니다.',
  },
  '분석 신뢰도': {
    title: '분석 신뢰도',
    summary: '분석에 사용된 데이터 품질과 지표 일관성을 종합한 점수입니다.',
    hint: '높을수록 분석 결과가 비교적 안정적이라는 뜻으로 참고할 수 있습니다.',
  },
};

export function AnalysisValueHelp({ label, compact = false }: AnalysisValueHelpProps) {
  const description = valueDescriptions[label];

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
