// components/PopularProductsSection.tsx
import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase/firebaseConfig';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import dayjs from 'dayjs';

interface ChartDataPoint {
  date: string;
  [style: string]: string | number;
}

const PopularProductsSection: React.FC = () => {
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [topStyles, setTopStyles] = useState<string[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      const snapshot = await getDocs(collection(db, 'products'));
      const grouped: { [date: string]: { [style: string]: number } } = {};

      snapshot.forEach(doc => {
        const data = doc.data();
        const style = data.style || '미지정';
        const reviews = data.reviews || 0;
        const createdAt = data.created_at?.toDate?.() || new Date();
        const dateStr = dayjs(createdAt).format('YYYY-MM-DD');

        if (!grouped[dateStr]) grouped[dateStr] = {};
        if (!grouped[dateStr][style]) grouped[dateStr][style] = 0;

        grouped[dateStr][style] += reviews;
      });

      const chartArray = Object.entries(grouped)
        .sort(([a], [b]) => a.localeCompare(b))
        .map(([date, styles]) => ({
          date,
          ...styles,
        }));

      // 전체 스타일 누적 리뷰 수 계산
      const totalCounts: Record<string, number> = {};
      chartArray.forEach(entry => {
        Object.entries(entry).forEach(([style, value]) => {
          if (style !== 'date') {
            totalCounts[style] = (totalCounts[style] || 0) + (value as number);
          }
        });
      });

      // 리뷰 수 기준 TOP 5 스타일 추출
      const topN = 5;
      const topStyleList = Object.entries(totalCounts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, topN)
        .map(([style]) => style);

      setChartData(chartArray);
      setTopStyles(topStyleList);
      console.log("📊 차트용 데이터:", chartArray);
      console.log("🔥 상위 스타일:", topStyleList);
    };

    fetchData();
  }, []);

  const colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#00bcd4'];

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        📈 인기 스타일 변화 추이 (TOP 5)
      </h3>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          {topStyles.map((style, idx) => (
            <Line
              key={style}
              type="monotone"
              dataKey={style}
              stroke={colors[idx % colors.length]}
              strokeWidth={2}
              dot={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default PopularProductsSection;
