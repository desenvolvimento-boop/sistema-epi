import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import './ConsumptionChart.css';

interface ConsumptionChartProps {
  data: { name: string; valor: number }[];
}

export const ConsumptionChart = ({ data }: ConsumptionChartProps) => {
  const hasData = data.length > 0;

  return (
    <div className="consumption-chart">
      <div className="consumption-chart-header">
        <h3 className="consumption-chart-title">Consumo Mensal de EPIs</h3>
        <span className="consumption-chart-period">Últimos 6 meses</span>
      </div>
      <div className="consumption-chart-body">
        {!hasData ? (
          <p className="consumption-chart-empty">Sem entregas registradas no período.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="valor" fill="#10b981" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
