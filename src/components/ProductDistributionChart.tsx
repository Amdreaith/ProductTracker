
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';

type DistributionData = {
  name: string;
  value: number;
};

interface ProductDistributionChartProps {
  data: DistributionData[];
}

const COLORS = ['#4287f5', '#65a3ff', '#2563eb', '#e0e0e0'];

export const ProductDistributionChart = ({ data }: ProductDistributionChartProps) => {
  // Use provided data or fallback to empty array
  const chartData = data.length > 0 ? data : [];

  return (
    <div className="h-[280px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={120}
            fill="#8884d8"
            paddingAngle={2}
            dataKey="value"
            labelLine={false}
            label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
              const RADIAN = Math.PI / 180;
              const radius = 25 + innerRadius + (outerRadius - innerRadius);
              const x = cx + radius * Math.cos(-midAngle * RADIAN);
              const y = cy + radius * Math.sin(-midAngle * RADIAN);
              
              return (
                <text
                  x={x}
                  y={y}
                  textAnchor={x > cx ? 'start' : 'end'}
                  dominantBaseline="central"
                  className="text-xs"
                >
                  {`${(percent * 100).toFixed(0)}%`}
                </text>
              );
            }}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
        </PieChart>
      </ResponsiveContainer>

      <div className="flex justify-center gap-6 mt-4 text-sm">
        {chartData.map((entry, index) => (
          <div key={`legend-${index}`} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
