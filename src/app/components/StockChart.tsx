import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChartData } from '../data/stockData';

interface StockChartProps {
  data: ChartData[];
  stockName: string;
  currentPrice: number;
  changePercent: number;
}

export function StockChart({ data, stockName, currentPrice, changePercent }: StockChartProps) {
  const isPositive = changePercent >= 0;

  return (
    <ResponsiveContainer width="100%" height="100%" minHeight={400}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis
          dataKey="time"
          tick={{ fontSize: 12 }}
          stroke="#999"
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 12 }}
          stroke="#999"
          domain={['dataMin - 1000', 'dataMax + 1000']}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            fontSize: '12px'
          }}
          formatter={(value: number) => [`${value.toLocaleString()}원`, '가격']}
        />
        <Line
          type="monotone"
          dataKey="price"
          stroke={isPositive ? '#ef4444' : '#16a34a'}
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}