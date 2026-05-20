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
import './DashboardChart.css';

interface TopEpisChartProps {
  data: { name: string; value: number }[];
}

export const TopEpisChart = ({ data }: TopEpisChartProps) => {
  const hasData = data.length > 0;

  return (
    <div className="dashboard-chart-card">
      <div className="dashboard-chart-card-header">
        <h3 className="dashboard-chart-card-title">EPIs mais entregues</h3>
        <p className="dashboard-chart-card-desc">Top 5 no período atual.</p>
      </div>
      <div className="dashboard-chart-card-body">
        {!hasData ? (
          <p className="dashboard-chart-card-empty">Sem entregas no período.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 8, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eef2f9" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6c757d', fontSize: 12 }} />
              <YAxis
                type="category"
                dataKey="name"
                width={100}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6c757d', fontSize: 11 }}
              />
              <Tooltip
                cursor={{ fill: '#f4f7fe' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" fill="#1e60d2" radius={[0, 4, 4, 0]} barSize={22} />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
