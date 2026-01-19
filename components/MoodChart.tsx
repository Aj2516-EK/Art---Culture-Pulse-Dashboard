
import React from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { FeedbackEntry } from '../types';

interface MoodChartProps {
  entries: FeedbackEntry[];
}

const MOOD_DATA = [
  { name: 'Awful', value: 1, color: '#EF4444' }, // Red
  { name: 'Bad', value: 2, color: '#F97316' },   // Orange
  { name: 'Okay', value: 3, color: '#EAB308' },  // Yellow
  { name: 'Good', value: 4, color: '#10B981' },  // Emerald
  { name: 'Great', value: 5, color: '#0D9488' }, // Teal
];

export const MoodChart: React.FC<MoodChartProps> = ({ entries }) => {
  const counts = entries.reduce((acc, entry) => {
    acc[entry.mood] = (acc[entry.mood] || 0) + 1;
    return acc;
  }, {} as Record<number, number>);

  const data = MOOD_DATA.map(m => ({
    name: m.name,
    count: counts[m.value] || 0,
    color: m.color
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-100 shadow-xl rounded-xl">
          <p className="text-sm font-bold text-gray-700">{`${payload[0].payload.name}: ${payload[0].value} responses`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F3F4F6" />
          <XAxis 
            dataKey="name" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9CA3AF', fontSize: 12 }} 
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#9CA3AF', fontSize: 12 }} 
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#F9FAFB' }} />
          <Bar dataKey="count" radius={[8, 8, 0, 0]} barSize={40}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
