import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  Users,
  Clock,
  Package,
  FileText,
  ShieldAlert,
  Loader2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { ConsumptionChart } from '../../components/dashboard/ConsumptionChart';
import { RiskIndicator } from '../../components/dashboard/RiskIndicator';
import { TopEpisChart } from '../../components/dashboard/TopEpisChart';
import { SectionDistributionChart } from '../../components/dashboard/SectionDistributionChart';
import { ExchangeStatusChart } from '../../components/dashboard/ExchangeStatusChart';
import { ComplianceChart } from '../../components/dashboard/ComplianceChart';
import { DashboardFiltersBar } from '../../components/dashboard/DashboardFiltersBar';
import { dashboardService } from '../../services/dashboardService';
import { incidentService, type IncidentAPI } from '../../services/incidentService';
import { defaultReportFilters } from '../../services/reportService';
import type { ReportDashboard, ReportFilters } from '../../types/report.types';
import './styles.css';

function formatNumber(value: number): string {
  return value.toLocaleString('pt-BR');
}

function formatPeriodLabel(from?: string, to?: string): string {
  if (!from || !to) return 'Período padrão (mês atual)';
  const fmt = (iso: string) => {
    const [y, m, d] = iso.split('-');
    return d ? `${d}/${m}/${y}` : iso;
  };
  return `${fmt(from)} — ${fmt(to)}`;
}

function dashboardFiltersInitial(): ReportFilters {
  const defaults = defaultReportFilters();
  return {
    from: defaults.from,
    to: defaults.to,
  };
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<ReportFilters>(dashboardFiltersInitial);
  const [overview, setOverview] = useState<ReportDashboard | null>(null);
  const [auditAlerts, setAuditAlerts] = useState<IncidentAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (activeFilters: ReportFilters) => {
    setLoading(true);
    setError(null);
    try {
      const [data, alerts] = await Promise.all([
        dashboardService.getOverview(activeFilters),
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
    load(filters);
  }, []);

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
        label: 'Entregas no Período',
        value: formatNumber(summary.total_entregas),
        icon: Package,
        color: 'text-primary-600',
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
        label: 'Assinaturas Pendentes',
        value: formatNumber(summary.pendencias_assinatura),
        icon: FileText,
        color: 'text-purple-600',
      },
      {
        label: 'Não Conformidades',
        value: formatNumber(summary.nao_conformidades_pendentes),
        icon: ShieldAlert,
        color: 'text-red-700',
      },
    ];
  }, [overview]);

  const summary = overview?.summary;
  const monthlyData = overview?.charts.monthly_consumption ?? [];
  const topEpis = overview?.charts.top_epis ?? [];
  const bySection = overview?.charts.by_section ?? [];
  const exchangeStatus =
    overview?.charts.exchange_status ??
    (summary
      ? [
          { name: 'Atrasadas', value: summary.epis_vencidos },
          { name: 'Vencem hoje', value: 0 },
          { name: 'Próx. 7 dias', value: summary.proximos_troca },
        ]
      : []);
  const risk = overview?.risk;
  const periodLabel = formatPeriodLabel(overview?.period.from, overview?.period.to);

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
      <div className="dashboard-page-header">
        <div>
          <h2 className="dashboard-page-title">Visão geral</h2>
          <p className="dashboard-page-subtitle">
            Indicadores operacionais e de conformidade do controle de EPIs.
          </p>
        </div>
        <span className="dashboard-period-badge">{periodLabel}</span>
      </div>

      <DashboardFiltersBar
        filters={filters}
        onChange={setFilters}
        onApply={() => load(filters)}
        applying={loading && Boolean(overview)}
      />

      {error && <div className="dashboard-error">{error}</div>}

      <div className={`dashboard-content${loading && overview ? ' dashboard-content--refreshing' : ''}`}>
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

      <div className="dashboard-charts-grid dashboard-charts-grid--primary">
        <ConsumptionChart data={monthlyData} />
        {risk && (
          <RiskIndicator
            score={risk.score}
            label={risk.label}
            description={risk.description}
          />
        )}
      </div>

      <div className="dashboard-charts-grid dashboard-charts-grid--secondary">
        <TopEpisChart data={topEpis} />
        <SectionDistributionChart data={bySection} />
      </div>

      <div className="dashboard-charts-grid dashboard-charts-grid--secondary">
        <ExchangeStatusChart data={exchangeStatus} />
        {summary && <ComplianceChart summary={summary} />}
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
    </div>
  );
};

export default Dashboard;
