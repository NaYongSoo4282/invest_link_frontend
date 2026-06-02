import { HelpCircle } from 'lucide-react';

interface InvestmentMetricHelpProps {
  label: 'PER' | 'PBR' | 'ROE';
  tone?: 'blue' | 'purple' | 'green';
  compact?: boolean;
}

const metricDescriptions = {
  PER: {
    title: 'PER',
    summary: '주가를 주당순이익으로 나눈 값입니다.',
    hint: '낮을수록 이익 대비 주가가 저렴하게 평가될 수 있습니다.',
  },
  PBR: {
    title: 'PBR',
    summary: '주가를 주당순자산으로 나눈 값입니다.',
    hint: '1배에 가까울수록 장부가치와 주가가 비슷하다는 뜻입니다.',
  },
  ROE: {
    title: 'ROE',
    summary: '자기자본으로 얼마나 효율적으로 이익을 냈는지 보는 지표입니다.',
    hint: '높을수록 자본 대비 수익성이 좋다고 해석할 수 있습니다.',
  },
};

const toneClass = {
  blue: 'text-blue-500 hover:bg-blue-50 focus-visible:ring-blue-500',
  purple: 'text-purple-500 hover:bg-purple-50 focus-visible:ring-purple-500',
  green: 'text-green-500 hover:bg-green-50 focus-visible:ring-green-500',
};

export function InvestmentMetricHelp({
  label,
  tone = 'blue',
  compact = false,
}: InvestmentMetricHelpProps) {
  const description = metricDescriptions[label];

  return (
    <span className="relative inline-flex group">
      <button
        type="button"
        aria-label={`${label} 설명 보기`}
        className={`inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 ${toneClass[tone]} ${
          compact ? 'h-3.5 w-3.5' : 'h-4 w-4'
        }`}
      >
        <HelpCircle className={compact ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      </button>
      <span className="pointer-events-none absolute left-1/2 top-full z-20 mt-2 hidden w-52 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-3 text-left shadow-lg group-hover:block group-focus-within:block">
        <span className="mb-1 block text-xs font-bold text-gray-900">{description.title}</span>
        <span className="block text-[11px] leading-relaxed text-gray-600">{description.summary}</span>
        <span className="mt-1.5 block text-[10px] leading-relaxed text-gray-500">{description.hint}</span>
      </span>
    </span>
  );
}
