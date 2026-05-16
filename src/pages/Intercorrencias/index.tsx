import React, { useState, useEffect, useCallback } from 'react';
import {
  AlertOctagon,
  Search,
  Download,
  AlertTriangle,
  CheckCircle2,
  BarChart3,
  Eye,
  Loader2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { format, parseISO } from 'date-fns';
import { Link, useSearchParams } from 'react-router-dom';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import {
  incidentService,
  INCIDENT_TYPE_LABELS,
  type IncidentAPI,
  type IncidentSeverity,
  type IncidentStats,
  type IncidentStatus,
  type IncidentType,
} from '../../services/incidentService';
import './styles.css';

const SeverityBadge = ({ severity }: { severity: IncidentSeverity }) => {
  const styles = {
    ALTA: 'intercorrencias-severity-alta',
    MEDIA: 'intercorrencias-severity-media',
    BAIXA: 'intercorrencias-severity-baixa',
  };
  return (
    <span className={clsx('intercorrencias-severity-badge', styles[severity])}>
      {severity}
    </span>
  );
};

const StatusBadge = ({ status }: { status: IncidentStatus }) => {
  const styles = {
    PENDENTE: 'intercorrencias-status-pendente',
    ANALISADO: 'intercorrencias-status-analisado',
    DESCARTADO: 'intercorrencias-status-descartado',
  };
  return (
    <span className={clsx('intercorrencias-status-badge', styles[status])}>
      {status}
    </span>
  );
};

const formatDetectedAt = (iso: string) => {
  try {
    return format(parseISO(iso), 'dd/MM/yyyy HH:mm');
  } catch {
    return iso;
  }
};

const Intercorrencias = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { canEdit } = useAuth();
  const allowResolve = canEdit('/intercorrencias');

  const [items, setItems] = useState<IncidentAPI[]>([]);
  const [stats, setStats] = useState<IncidentStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 20;

  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const [selectedItem, setSelectedItem] = useState<IncidentAPI | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [resolutionNote, setResolutionNote] = useState('');
  const [saving, setSaving] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  const loadStats = useCallback(async () => {
    try {
      const data = await incidentService.getStats();
      setStats(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  const loadIncidents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await incidentService.getAll({
        q: search || undefined,
        severity: (severityFilter as IncidentSeverity) || undefined,
        status: (statusFilter as IncidentStatus) || undefined,
        type: (typeFilter as IncidentType) || undefined,
        page,
        limit,
      });
      setItems(data.items);
      setTotal(data.total);
      setTotalPages(data.totalPages);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar intercorrências');
    } finally {
      setLoading(false);
    }
  }, [search, severityFilter, statusFilter, typeFilter, page]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  useEffect(() => {
    loadIncidents();
  }, [loadIncidents]);

  useEffect(() => {
    setPage(1);
  }, [search, severityFilter, statusFilter, typeFilter]);

  const openIncident = useCallback((item: IncidentAPI) => {
    setSelectedItem(item);
    setResolutionNote('');
    setActionError(null);
    setIsModalOpen(true);
  }, []);

  useEffect(() => {
    const incId = searchParams.get('inc_id');
    if (!incId || items.length === 0) return;
    const found = items.find((i) => String(i.inc_id) === incId);
    if (found) openIncident(found);
  }, [searchParams, items, openIncident]);

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedItem(null);
    setResolutionNote('');
    setActionError(null);
    if (searchParams.has('inc_id')) {
      searchParams.delete('inc_id');
      setSearchParams(searchParams, { replace: true });
    }
  };

  const handleResolve = async (status: 'ANALISADO' | 'DESCARTADO', blockEmployee: boolean) => {
    if (!selectedItem) return;
    if (!resolutionNote.trim()) {
      setActionError('Informe o motivo da resolução.');
      return;
    }
    setSaving(true);
    setActionError(null);
    try {
      await incidentService.resolve(selectedItem.inc_id, {
        status,
        resolution: blockEmployee ? 'BLOQUEIO' : status === 'DESCARTADO' ? 'DESCARTADO' : 'CONFIRMADO',
        note: resolutionNote.trim(),
        blockEmployee,
      });
      handleCloseModal();
      await Promise.all([loadIncidents(), loadStats()]);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Erro ao resolver intercorrência');
    } finally {
      setSaving(false);
    }
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await incidentService.exportCsv({
        q: search || undefined,
        severity: (severityFilter as IncidentSeverity) || undefined,
        status: (statusFilter as IncidentStatus) || undefined,
        type: (typeFilter as IncidentType) || undefined,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `intercorrencias-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao exportar');
    } finally {
      setExporting(false);
    }
  };

  const clearFilters = () => {
    setSearchInput('');
    setSearch('');
    setSeverityFilter('');
    setStatusFilter('');
    setTypeFilter('');
    setPage(1);
  };

  const hasActiveFilters = Boolean(search || severityFilter || statusFilter || typeFilter);
  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <motion.div className="intercorrencias-container">
      <motion.div className="intercorrencias-header">
        <motion.div className="intercorrencias-header-left">
          <motion.div className="intercorrencias-icon-box">
            <AlertOctagon className="intercorrencias-icon-lg" />
          </motion.div>
          <motion.div>
            <h2 className="intercorrencias-title">Intercorrências</h2>
            <p className="intercorrencias-subtitle">
              Inconsistências e possíveis fraudes identificadas pela Inteligência de Dados.
            </p>
          </motion.div>
        </motion.div>
        <motion.div className="intercorrencias-header-actions">
          <button
            type="button"
            className="intercorrencias-export-btn"
            onClick={handleExport}
            disabled={exporting}
          >
            {exporting ? (
              <Loader2 className="intercorrencias-btn-icon intercorrencias-spin" />
            ) : (
              <Download className="intercorrencias-btn-icon" />
            )}
            Exportar Relatório
          </button>
        </motion.div>
      </motion.div>

      <motion.div className="intercorrencias-stats-grid">
        <motion.div className="intercorrencias-stat-card">
          <p className="intercorrencias-stat-label">Alertas Críticos</p>
          <motion.div className="intercorrencias-stat-row">
            <h3 className="intercorrencias-stat-value--red">
              {stats ? String(stats.criticalLast24h).padStart(2, '0') : '—'}
            </h3>
            <motion.div className="intercorrencias-stat-icon-box--red">
              <AlertTriangle className="intercorrencias-stat-icon" />
            </motion.div>
          </motion.div>
          <p className="intercorrencias-stat-footnote">Últimas 24 horas</p>
        </motion.div>
        <motion.div className="intercorrencias-stat-card">
          <p className="intercorrencias-stat-label">Aguardando Análise</p>
          <motion.div className="intercorrencias-stat-row">
            <h3 className="intercorrencias-stat-value--amber">
              {stats ? String(stats.pendingTotal).padStart(2, '0') : '—'}
            </h3>
            <motion.div className="intercorrencias-stat-icon-box--amber">
              <BarChart3 className="intercorrencias-stat-icon" />
            </motion.div>
          </motion.div>
          <p className="intercorrencias-stat-footnote">Total pendente</p>
        </motion.div>
        <motion.div className="intercorrencias-stat-card">
          <p className="intercorrencias-stat-label">Taxa de Fraude</p>
          <motion.div className="intercorrencias-stat-row">
            <h3 className="intercorrencias-stat-value--slate">
              {stats != null ? `${stats.fraudRateMonthly}%` : '—'}
            </h3>
            <motion.div className="intercorrencias-stat-icon-box--slate">
              <CheckCircle2 className="intercorrencias-stat-icon" />
            </motion.div>
          </motion.div>
          <p className="intercorrencias-stat-footnote">Média mensal</p>
        </motion.div>
      </motion.div>

      <motion.div className="intercorrencias-filter-bar">
        <motion.div className="intercorrencias-search-wrapper">
          <Search className="intercorrencias-search-icon" />
          <input
            type="text"
            placeholder="Buscar por colaborador ou tipo de alerta..."
            className="intercorrencias-search-input"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </motion.div>
        <motion.div className="intercorrencias-filter-group">
          <select
            className="intercorrencias-select"
            value={severityFilter}
            onChange={(e) => setSeverityFilter(e.target.value)}
          >
            <option value="">Severidade: Todas</option>
            <option value="ALTA">Alta</option>
            <option value="MEDIA">Média</option>
            <option value="BAIXA">Baixa</option>
          </select>
          <select
            className="intercorrencias-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Status: Todos</option>
            <option value="PENDENTE">Pendente</option>
            <option value="ANALISADO">Analisado</option>
            <option value="DESCARTADO">Descartado</option>
          </select>
          <select
            className="intercorrencias-select"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">Tipo: Todos</option>
            {(Object.keys(INCIDENT_TYPE_LABELS) as IncidentType[]).map((t) => (
              <option key={t} value={t}>
                {INCIDENT_TYPE_LABELS[t]}
              </option>
            ))}
          </select>
          {hasActiveFilters && (
            <button type="button" className="intercorrencias-clear-filters" onClick={clearFilters}>
              <X className="intercorrencias-btn-icon" /> Limpar
            </button>
          )}
        </motion.div>
      </motion.div>

      {error && (
        <div className="intercorrencias-error">
          <p>{error}</p>
          <button type="button" onClick={loadIncidents}>
            Tentar novamente
          </button>
        </div>
      )}

      <motion.div className="intercorrencias-table-wrapper">
        {loading ? (
          <motion.div className="intercorrencias-loading">
            <Loader2 className="intercorrencias-spin intercorrencias-icon-lg" />
            <p>Carregando intercorrências...</p>
          </motion.div>
        ) : items.length === 0 ? (
          <motion.div className="intercorrencias-empty">
            <AlertOctagon className="intercorrencias-icon-lg" />
            <p>Nenhuma intercorrência encontrada</p>
            {hasActiveFilters && (
              <button type="button" onClick={clearFilters}>
                Limpar filtros
              </button>
            )}
          </motion.div>
        ) : (
          <table className="intercorrencias-table">
            <thead>
              <tr className="intercorrencias-thead-row">
                <th className="intercorrencias-th">Intercorrência</th>
                <th className="intercorrencias-th">Colaborador / Data</th>
                <th className="intercorrencias-th">Severidade</th>
                <th className="intercorrencias-th">Status</th>
                <th className="intercorrencias-th--right">Ações</th>
              </tr>
            </thead>
            <tbody className="intercorrencias-tbody">
              {items.map((item) => (
                <tr
                  key={item.inc_id}
                  className="intercorrencias-row"
                  onClick={() => openIncident(item)}
                >
                  <td className="intercorrencias-cell">
                    <motion.div className="intercorrencias-cell-content">
                      <motion.div
                        className={clsx(
                          'intercorrencias-cell-icon-box',
                          item.inc_severity === 'ALTA'
                            ? 'intercorrencias-cell-icon-alta'
                            : item.inc_severity === 'MEDIA'
                              ? 'intercorrencias-cell-icon-media'
                              : 'intercorrencias-cell-icon-baixa'
                        )}
                      >
                        <AlertOctagon className="intercorrencias-btn-icon" />
                      </motion.div>
                      <motion.div>
                        <p className="intercorrencias-description">{item.inc_title}</p>
                        <span className="intercorrencias-id-tag">#{item.inc_code}</span>
                        <span className="intercorrencias-type-tag">
                          {INCIDENT_TYPE_LABELS[item.inc_type]}
                        </span>
                      </motion.div>
                    </motion.div>
                  </td>
                  <td className="intercorrencias-cell">
                    <p className="intercorrencias-colaborador-name">
                      {item.colaborador ?? '—'}
                    </p>
                    <p className="intercorrencias-colaborador-date">
                      {formatDetectedAt(item.inc_detected_at)}
                    </p>
                  </td>
                  <td className="intercorrencias-cell">
                    <SeverityBadge severity={item.inc_severity} />
                  </td>
                  <td className="intercorrencias-cell">
                    <StatusBadge status={item.inc_status} />
                  </td>
                  <td className="intercorrencias-cell--right">
                    <button
                      type="button"
                      className="intercorrencias-action-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        openIncident(item);
                      }}
                    >
                      <Eye className="intercorrencias-btn-icon" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </motion.div>

      {!loading && total > 0 && (
        <motion.div className="intercorrencias-pagination">
          <span>
            Mostrando {from}–{to} de {total}
          </span>
          <motion.div className="intercorrencias-pagination-actions">
            <button
              type="button"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              <ChevronLeft className="intercorrencias-btn-icon" />
            </button>
            <span>
              {page} / {totalPages}
            </span>
            <button
              type="button"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              <ChevronRight className="intercorrencias-btn-icon" />
            </button>
          </motion.div>
        </motion.div>
      )}

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title="Análise de Intercorrência">
        {selectedItem && (
          <motion.div className="intercorrencias-modal-content">
            <motion.div className="intercorrencias-modal-header">
              <motion.div
                className={clsx(
                  'intercorrencias-modal-icon-box',
                  selectedItem.inc_severity === 'ALTA'
                    ? 'intercorrencias-modal-icon-alta'
                    : 'intercorrencias-modal-icon-media'
                )}
              >
                <AlertTriangle className="intercorrencias-icon-lg" />
              </motion.div>
              <motion.div>
                <p className="intercorrencias-modal-description">{selectedItem.inc_title}</p>
                <p className="intercorrencias-modal-date">
                  Identificado em {formatDetectedAt(selectedItem.inc_detected_at)}
                </p>
                <span className="intercorrencias-type-tag intercorrencias-type-tag--modal">
                  {INCIDENT_TYPE_LABELS[selectedItem.inc_type]}
                </span>
              </motion.div>
            </motion.div>

            <motion.div className="intercorrencias-modal-grid">
              <motion.div className="intercorrencias-modal-field">
                <p className="intercorrencias-modal-field-label">Colaborador Alvo</p>
                {selectedItem.emp_id ? (
                  <Link
                    to={`/colaboradores/${selectedItem.emp_id}/detalhes`}
                    className="intercorrencias-modal-link"
                    onClick={handleCloseModal}
                  >
                    {selectedItem.colaborador}
                  </Link>
                ) : (
                  <p className="intercorrencias-modal-field-value">—</p>
                )}
              </motion.div>
              <motion.div className="intercorrencias-modal-field">
                <p className="intercorrencias-modal-field-label">Severidade do Risco</p>
                <SeverityBadge severity={selectedItem.inc_severity} />
              </motion.div>
              {selectedItem.emp_id && (
                <motion.div className="intercorrencias-modal-field intercorrencias-modal-field--full">
                  <p className="intercorrencias-modal-field-label">Prontuário</p>
                  <Link
                    to={`/historico/${selectedItem.emp_id}`}
                    className="intercorrencias-modal-link"
                    onClick={handleCloseModal}
                  >
                    Ver histórico do colaborador
                    {selectedItem.dlv_id ? ` (entrega #${selectedItem.dlv_id})` : ''}
                  </Link>
                </motion.div>
              )}
            </motion.div>

            <motion.div className="intercorrencias-evidence-section">
              <p className="intercorrencias-evidence-label">Evidências e Detalhes</p>
              <motion.div className="intercorrencias-evidence-box">
                {selectedItem.inc_summary || 'Sem detalhes adicionais.'}
              </motion.div>
            </motion.div>

            {selectedItem.inc_status === 'PENDENTE' && allowResolve && (
              <motion.div className="intercorrencias-resolution-field">
                <label className="intercorrencias-evidence-label" htmlFor="resolution-note">
                  Motivo da resolução *
                </label>
                <textarea
                  id="resolution-note"
                  className="intercorrencias-resolution-input"
                  rows={3}
                  value={resolutionNote}
                  onChange={(e) => setResolutionNote(e.target.value)}
                  placeholder="Descreva a análise realizada..."
                />
              </motion.div>
            )}

            {actionError && <p className="intercorrencias-action-error">{actionError}</p>}

            {selectedItem.inc_status === 'PENDENTE' && allowResolve ? (
              <motion.div className="intercorrencias-modal-actions">
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleResolve('DESCARTADO', false)}
                  className="intercorrencias-discard-btn"
                >
                  {saving ? <Loader2 className="intercorrencias-btn-icon intercorrencias-spin" /> : null}
                  Descartar Alerta
                </button>
                <button
                  type="button"
                  disabled={saving}
                  onClick={() => handleResolve('ANALISADO', true)}
                  className="intercorrencias-confirm-btn"
                >
                  {saving ? <Loader2 className="intercorrencias-btn-icon intercorrencias-spin" /> : null}
                  Confirmar e Bloquear
                </button>
              </motion.div>
            ) : selectedItem.inc_status !== 'PENDENTE' ? (
              <p className="intercorrencias-resolved-hint">
                Resolvido como {selectedItem.inc_resolution}
                {selectedItem.inc_resolution_note ? `: ${selectedItem.inc_resolution_note}` : ''}
              </p>
            ) : (
              <p className="intercorrencias-resolved-hint">Sem permissão para resolver alertas.</p>
            )}
          </motion.div>
        )}
      </Modal>
    </motion.div>
  );
};

export default Intercorrencias;
