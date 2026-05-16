import React from 'react';
import type { ReportSummary } from '../../types/report.types';
import './ReportSummaryCards.css';

const LABELS: Record<string, string> = {
  colaboradores: 'Colaboradores',
  total_entregas: 'Total entregas',
  total_trocas: 'Total trocas',
  total_vencidos: 'Vencidos',
  total_proximos: 'Próximos da troca',
  total_pendencias: 'Pendências',
  total_vinculos: 'Vínculos',
  total_registros: 'Registros',
  tipos_distintos: 'Tipos distintos',
  total: 'Total',
  total_ativos: 'Ativos',
  com_entrega: 'Com entrega',
  sem_entrega: 'Sem entrega',
  pendentes: 'Pendentes',
};

interface ReportSummaryCardsProps {
  summary: ReportSummary;
}

export const ReportSummaryCards: React.FC<ReportSummaryCardsProps> = ({ summary }) => {
  const entries = Object.entries(summary).filter(([, v]) => v != null && v !== '');
  if (!entries.length) return null;

  return (
    <div className="report-summary-grid">
      {entries.map(([key, value]) => (
        <div key={key} className="report-summary-card">
          <span className="report-summary-label">{LABELS[key] || key}</span>
          <span className="report-summary-value">{value}</span>
        </div>
      ))}
    </div>
  );
};
