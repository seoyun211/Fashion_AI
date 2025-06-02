import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendChartProps } from '@/types';

export default function TrendChart({ data, type }: TrendChartProps) {
  const chartData = data.map(item => ({
    date: new Date(item.날짜).toLocaleDateString(),
    value: type === 'sales' ? item.판매량 : item.재고량
  }));

  return (
    <div className="w-full h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
      <h3 className="text-lg font-semibold mb-4">
        {type === 'sales' ? '일일 판매량 추이' : '일일 재고량 추이'}
      </h3>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tick={{ fill: 'currentColor' }}
          />
          <YAxis 
            tick={{ fill: 'currentColor' }}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: '1px solid #ccc'
            }}
          />
          <Legend />
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke="#4F46E5" 
            name={type === 'sales' ? '판매량' : '재고량'}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 