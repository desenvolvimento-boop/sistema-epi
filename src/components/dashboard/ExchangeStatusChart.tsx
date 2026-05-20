import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import './DashboardChart.css';

const STATUS_COLORS: Record<string, string> = {
  Atrasadas: '#dc3545',
  'Vencem hoje': '#ffc107',
  'Próx. 7 dias': '#1e60d2',
};

interface ExchangeStatusChartProps {
  data: { name: string; value: number }[];
}

export const ExchangeStatusChart = ({ data }: ExchangeStatusChartProps) => {
  const hasData = data.some((d) => d.value > 0);

  return (
    <div className="dashboard-chart-card">
      <div className="dashboard-chart-card-header">
        <h3 className="dashboard-chart-card-title">Agenda de trocas</h3>
        <p className="dashboard-chart-card-desc">Situação dos EPIs obrigatórios por vencimento.</p>
      </div>
      <div className="dashboard-chart-card-body">
        {!hasData ? (
          <p className="dashboard-chart-card-empty">Nenhuma troca pendente na agenda.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6c757d', fontSize: 11 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6c757d', fontSize: 12 }} allowDecimals={false} />
              <Tooltip
                cursor={{ fill: '#f4f7fe' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" radius={[4, 4, 0, 0]} barSize={48}>
                {data.map((entry) => (
                  <Cell key={entry.name} fill={STATUS_COLORS[entry.name] ?? '#adb5bd'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
