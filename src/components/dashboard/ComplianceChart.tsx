import React, { useMemo } from 'react';
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
import type { ReportDashboard } from '../../types/report.types';
import './DashboardChart.css';

const COMPLIANCE_COLORS = ['#dc3545', '#ffc107', '#6f42c1', '#dc3545'];

interface ComplianceChartProps {
  summary: ReportDashboard['summary'];
}

export const ComplianceChart = ({ summary }: ComplianceChartProps) => {
  const data = useMemo(
    () => [
      { name: 'EPIs vencidos', value: summary.epis_vencidos },
      { name: 'Trocas (7d)', value: summary.proximos_troca },
      { name: 'Assin. pendentes', value: summary.pendencias_assinatura },
      { name: 'Não conformidades', value: summary.nao_conformidades_pendentes },
    ],
    [summary]
  );

  const hasData = data.some((d) => d.value > 0);

  return (
    <div className="dashboard-chart-card">
      <div className="dashboard-chart-card-header">
        <h3 className="dashboard-chart-card-title">Pendências e conformidade</h3>
        <p className="dashboard-chart-card-desc">Indicadores que exigem ação imediata.</p>
      </div>
      <div className="dashboard-chart-card-body">
        {!hasData ? (
          <p className="dashboard-chart-card-empty">Nenhuma pendência registrada.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 4, right: 16 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eef2f9" />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fill: '#6c757d', fontSize: 12 }} allowDecimals={false} />
              <YAxis
                type="category"
                dataKey="name"
                width={110}
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6c757d', fontSize: 11 }}
              />
              <Tooltip
                cursor={{ fill: '#f4f7fe' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={24}>
                {data.map((_, index) => (
                  <Cell key={index} fill={COMPLIANCE_COLORS[index % COMPLIANCE_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
