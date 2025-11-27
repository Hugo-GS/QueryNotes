import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { MetricPoint } from '../types';

interface MetricsChartProps {
  data: MetricPoint[];
  theme?: 'dark' | 'light';
}

export const MetricsChart: React.FC<MetricsChartProps> = ({ data, theme = 'dark' }) => {
  const isDark = theme === 'dark';
  
  // Dynamic colors based on theme
  const axisColor = isDark ? '#928374' : '#666666';
  const gridColor = isDark ? '#3c3836' : '#d4d4d4';
  const tooltipBg = isDark ? '#1a1a1a' : '#ffffff';
  const tooltipBorder = isDark ? '#3c3836' : '#d4d4d4';
  const tooltipText = isDark ? '#ebdbb2' : '#2c2c2c';
  const dotFill = isDark ? '#1a1a1a' : '#ffffff';

  return (
    <div className="w-full h-full min-h-[150px]">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke={gridColor} vertical={false} />
          <XAxis 
            dataKey="time" 
            stroke={axisColor} 
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis 
            stroke={axisColor} 
            fontSize={12}
            tickLine={false}
            axisLine={false}
            width={40}
          />
          <Tooltip 
            contentStyle={{ 
              backgroundColor: tooltipBg, 
              border: `1px solid ${tooltipBorder}`,
              borderRadius: '4px',
              color: tooltipText,
              boxShadow: 'none'
            }}
            itemStyle={{ color: '#89b482' }}
          />
          <Line 
            type="monotone" 
            dataKey="latency" 
            stroke="#89b482" 
            strokeWidth={2} 
            dot={{ fill: dotFill, stroke: '#89b482', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#ea6962' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};