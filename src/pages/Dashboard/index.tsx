import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, Users, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { ConsumptionChart } from '../../components/dashboard/ConsumptionChart';
import { RiskIndicator } from '../../components/dashboard/RiskIndicator';
import { dashboardService } from '../../services/dashboardService';
import { incidentService, type IncidentAPI } from '../../services/incidentService';
import type { ReportDashboard } from '../../types/report.types';
import './styles.css';

function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR');
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<ReportDashboard | null>(null);
  const [auditAlerts, setAuditAlerts] = useState<IncidentAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [data, alerts] = await Promise.all([
        dashboardService.getOverview(),
        incidentService.getTopPending(3).catch(() => [] as IncidentAPI[]),
      ]);
      setOverview(data);
      setAuditAlerts(alerts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar o dashboard');
      setOverview(null);
      setAuditAlerts([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const stats = useMemo(() => {
    const summary = overview?.summary;
    if (!summary) return [];

    return [
      {
        label: 'Colaboradores Ativos',
        value: formatNumber(summary.colaboradores_ativos),
        icon: Users,
        color: 'text-blue-600',
      },
      {
        label: 'EPIs Vencidos',
        value: formatNumber(summary.epis_vencidos),
        icon: AlertTriangle,
        color: 'text-red-600',
      },
      {
        label: 'Trocas Próximas (7d)',
        value: formatNumber(summary.proximos_troca),
        icon: Clock,
        color: 'text-amber-600',
      },
      {
        label: 'Entregas Realizadas',
        value: formatNumber(summary.total_entregas),
        icon: AlertCircle,
        color: 'text-primary-600',
      },
    ];
  }, [overview]);

  const monthlyData = overview?.charts.monthly_consumption ?? [];
  const risk = overview?.risk;

  if (loading && !overview) {
    return (
      <div className="dashboard-page dashboard-page--loading">
        <Loader2 className="dashboard-loading-icon" size={32} />
        <span>Carregando indicadores...</span>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      {error && <div className="dashboard-error">{error}</div>}

      <div className="dashboard-stats-grid">
        {stats.map((stat, idx) => (
          <StatsCard
            key={stat.label}
            index={idx}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      <div className="dashboard-charts-grid">
        <ConsumptionChart data={monthlyData} />
        {risk && (
          <RiskIndicator
            score={risk.score}
            label={risk.label}
            description={risk.description}
          />
        )}
      </div>

      <div className="dashboard-alerts">
        <div className="dashboard-alerts-header">
          <AlertTriangle className="dashboard-alerts-icon" />
          <h3 className="dashboard-alerts-title">Alertas Prioritários de Auditoria</h3>
        </div>
        <div className="dashboard-alerts-list">
          {auditAlerts.length === 0 ? (
            <div className="dashboard-alert-item">
              <span className="dashboard-alert-text">Nenhuma intercorrência crítica pendente.</span>
            </div>
          ) : (
            auditAlerts.map((alert) => (
              <div key={alert.inc_id} className="dashboard-alert-item">
                <span className="dashboard-alert-text">{alert.inc_title}</span>
                <button
                  type="button"
                  className="dashboard-alert-action"
                  onClick={() => navigate(`/intercorrencias?inc_id=${alert.inc_id}`)}
                >
                  Resolver Agora
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
