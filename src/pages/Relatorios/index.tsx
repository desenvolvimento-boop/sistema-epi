import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart3,
  FileText,
  AlertCircle,
  Shield,
  Users,
  ClipboardList,
  ChevronRight,
  Loader2,
  Package,
  AlertTriangle,
} from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { defaultReportFilters, reportService } from '../../services/reportService';
import type { ReportCatalogItem, ReportDashboard, ReportFilters } from '../../types/report.types';
import { PageHeader } from '../../components/layout/PageHeader';
import { useNomenclature } from '../../hooks/useNomenclature';
import { NOMENCLATURE_KEYS } from '../../config/nomenclatureKeys';
import './styles.css';

const COLORS = ['#1e60d2', '#4a82d7', '#7aa5e3', '#adc8ef', '#d6e5f7'];

const CATEGORY_ICONS: Record<string, React.ElementType> = {
  operacional: FileText,
  gestao: Users,
  auditoria: Shield,
};

const CATEGORY_COLORS: Record<string, string> = {
  operacional: 'relatorios-report-color-blue',
  gestao: 'relatorios-report-color-purple',
  auditoria: 'relatorios-report-color-amber',
};

const Relatorios = () => {
  const navigate = useNavigate();
  const { t } = useNomenclature();
  const [catalog, setCatalog] = useState<ReportCatalogItem[]>([]);
  const [dashboard, setDashboard] = useState<ReportDashboard | null>(null);
  const [filters, setFilters] = useState<ReportFilters>(defaultReportFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [cat, dash] = await Promise.all([
        reportService.getCatalog(),
        reportService.getDashboard(filters),
      ]);
      setCatalog(cat);
      setDashboard(dash);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar relatórios');
    } finally {
      setLoading(false);
    }
  }, [filters.from, filters.to, filters.sec_id]);

  useEffect(() => {
    load();
  }, [load]);

  const topEpis = dashboard?.charts.top_epis ?? [];
  const bySection = dashboard?.charts.by_section ?? [];
  const summary = dashboard?.summary;

  return (
    <div className="relatorios-container">
      <PageHeader
        icon={BarChart3}
        title={t(NOMENCLATURE_KEYS.page.relatorios)}
        subtitle={t(NOMENCLATURE_KEYS.page.subtitle_relatorios)}
        actions={
        <div className="relatorios-filters">
          <label className="relatorios-date-wrapper">
            <span className="relatorios-filter-label">De</span>
            <input
              type="date"
              className="relatorios-date-input"
              value={filters.from || ''}
              onChange={(e) => setFilters((f) => ({ ...f, from: e.target.value }))}
            />
          </label>
          <label className="relatorios-date-wrapper">
            <span className="relatorios-filter-label">Até</span>
            <input
              type="date"
              className="relatorios-date-input"
              value={filters.to || ''}
              onChange={(e) => setFilters((f) => ({ ...f, to: e.target.value }))}
            />
          </label>
        </div>
        }
      />

      {error && <div className="relatorios-error">{error}</div>}

      {loading && !dashboard ? (
        <div className="relatorios-loading">
          <Loader2 className="relatorios-loading-icon" size={32} />
          <span>Carregando indicadores...</span>
        </div>
      ) : (
        <>
          {summary && (
            <div className="relatorios-kpi-grid">
              <div className="relatorios-kpi-card">
                <Package className="relatorios-kpi-icon" />
                <div>
                  <span className="relatorios-kpi-value">{summary.total_entregas}</span>
                  <span className="relatorios-kpi-label">Entregas no período</span>
                </div>
              </div>
              <div className="relatorios-kpi-card relatorios-kpi-warning">
                <AlertCircle className="relatorios-kpi-icon" />
                <div>
                  <span className="relatorios-kpi-value">{summary.epis_vencidos}</span>
                  <span className="relatorios-kpi-label">EPIs vencidos</span>
                </div>
              </div>
              <div className="relatorios-kpi-card">
                <ClipboardList className="relatorios-kpi-icon" />
                <div>
                  <span className="relatorios-kpi-value">{summary.proximos_troca}</span>
                  <span className="relatorios-kpi-label">Próximos da troca</span>
                </div>
              </div>
              <div className="relatorios-kpi-card">
                <FileText className="relatorios-kpi-icon" />
                <div>
                  <span className="relatorios-kpi-value">{summary.pendencias_assinatura}</span>
                  <span className="relatorios-kpi-label">Assinaturas pendentes</span>
                </div>
              </div>
              <div className="relatorios-kpi-card relatorios-kpi-danger">
                <AlertTriangle className="relatorios-kpi-icon" />
                <div>
                  <span className="relatorios-kpi-value">{summary.nao_conformidades_pendentes}</span>
                  <span className="relatorios-kpi-label">Não conformidades</span>
                </div>
              </div>
            </div>
          )}

          <div className="relatorios-quick-card">
            <h3 className="relatorios-section-title">Catálogo de relatórios</h3>
            <div className="relatorios-quick-grid">
              {catalog.map((report) => {
                const Icon = CATEGORY_ICONS[report.category] || BarChart3;
                const color = CATEGORY_COLORS[report.category] || 'relatorios-report-color-blue';
                return (
                  <button
                    key={report.id}
                    type="button"
                    onClick={() => navigate(`/relatorios/${report.id}`)}
                    className="relatorios-report-btn"
                  >
                    <div className={`relatorios-report-icon-wrapper ${color}`}>
                      <Icon className="relatorios-icon-md" />
                    </div>
                    <div>
                      <h3 className="relatorios-report-title">{report.title}</h3>
                      <p className="relatorios-report-desc">{report.description}</p>
                    </div>
                    <ChevronRight className="relatorios-chevron" />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relatorios-charts-grid">
            <div className="relatorios-consumption-card">
              <div className="relatorios-chart-header">
                <div>
                  <h3 className="relatorios-chart-title">EPIs mais utilizados</h3>
                  <p className="relatorios-chart-desc">Top 5 no período selecionado.</p>
                </div>
              </div>
              <div className="relatorios-chart-container">
                {topEpis.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={topEpis}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f9" />
                      <XAxis dataKey="name" tick={{ fill: '#6c757d', fontSize: 11 }} />
                      <YAxis tick={{ fill: '#6c757d', fontSize: 12 }} />
                      <Tooltip />
                      <Bar dataKey="value" fill="#1e60d2" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="relatorios-chart-empty">Sem dados no período</p>
                )}
              </div>
            </div>

            <div className="relatorios-distribution-card">
              <h3 className="relatorios-dist-title">Entregas por unidade</h3>
              <p className="relatorios-dist-desc">Distribuição por setor.</p>
              <div className="relatorios-dist-chart">
                {bySection.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={bySection}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        dataKey="value"
                      >
                        {bySection.map((_, index) => (
                          <Cell key={index} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="relatorios-chart-empty">Sem dados no período</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Relatorios;
