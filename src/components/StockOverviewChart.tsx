
import React from 'react';
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

type StockData = {
  name: string;
  stock: number;
  demand: number;
};

interface StockOverviewChartProps {
  data: StockData[];
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background rounded-md p-2 shadow-md border border-border text-foreground text-xs">
        <p className="mb-1">
          <span className="font-medium">Stock: </span>
          {payload[0].value}
        </p>
        <p>
          <span className="font-medium">Demand: </span>
          {payload[1].value}
        </p>
      </div>
    );
  }

  return null;
};

export const StockOverviewChart = ({ data }: StockOverviewChartProps) => {
  // Use provided data or fallback to empty array
  const chartData = data.length > 0 ? data : [];

  return (
    <div className="h-[270px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 0,
            bottom: 5,
          }}
        >
          <XAxis dataKey="name" tickLine={false} axisLine={false} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Line 
            type="monotone" 
            dataKey="stock" 
            stroke="#6366f1" 
            strokeWidth={3} 
            dot={false} 
            activeDot={{ r: 6, stroke: "#6366f1", strokeWidth: 2, fill: "white" }}
          />
          <Line 
            type="monotone" 
            dataKey="demand" 
            stroke="#a855f7" 
            strokeWidth={3} 
            dot={false}
            activeDot={{ r: 6, stroke: "#a855f7", strokeWidth: 2, fill: "white" }}
          />
        </LineChart>
      </ResponsiveContainer>
      <div className="flex justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
          <span className="text-sm">Stock</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-500"></div>
          <span className="text-sm">Demand</span>
        </div>
      </div>
    </div>
  );
};
