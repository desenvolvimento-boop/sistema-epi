import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import './DashboardChart.css';

const COLORS = ['#1e60d2', '#28a745', '#ffc107', '#6f42c1', '#dc3545', '#17a2b8', '#e83e8c', '#6c757d'];

interface SectionDistributionChartProps {
  data: { name: string; value: number }[];
}

export const SectionDistributionChart = ({ data }: SectionDistributionChartProps) => {
  const hasData = data.length > 0;

  return (
    <div className="dashboard-chart-card">
      <div className="dashboard-chart-card-header">
        <h3 className="dashboard-chart-card-title">Entregas por unidade</h3>
        <p className="dashboard-chart-card-desc">Distribuição por setor no período.</p>
      </div>
      <div className="dashboard-chart-card-body">
        {!hasData ? (
          <p className="dashboard-chart-card-empty">Sem entregas por unidade no período.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="45%"
                innerRadius={48}
                outerRadius={72}
                dataKey="value"
                paddingAngle={2}
              >
                {data.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Legend
                verticalAlign="bottom"
                iconType="circle"
                wrapperStyle={{ fontSize: '11px', paddingTop: '8px' }}
              />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
