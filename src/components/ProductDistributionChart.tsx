
import React from 'react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';

type DistributionData = {
  name: string;
  value: number;
};

interface ProductDistributionChartProps {
  data: DistributionData[];
}

const COLORS = ['#4287f5', '#65a3ff', '#2563eb', '#8884d8', '#a4de6c'];

export const ProductDistributionChart = ({ data }: ProductDistributionChartProps) => {
  // Use provided data or fallback to empty array
  const chartData = data.length > 0 ? data : [];
  const total = chartData.reduce((sum, item) => sum + item.value, 0);

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
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const item = payload[0].payload;
                const percentage = ((item.value / total) * 100).toFixed(1);
                return (
                  <div className="rounded-lg border bg-background p-2 shadow-sm">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      Quantity: {item.value} ({percentage}%)
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
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
