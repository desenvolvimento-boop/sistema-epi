import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Filter,
  Eye,
  History,
  Calendar,
  RefreshCw,
  ShieldCheck,
  Loader2,
  Building2,
  MapPin,
  X,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import clsx from 'clsx';
import {
  deliveryService,
  type HistorySummaryItem,
  type HistoryStatus,
} from '../../services/deliveryService';
import './styles.css';

const Historico = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<HistorySummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [tipoFilter, setTipoFilter] = useState<'' | 'Entrega' | 'Troca'>('');
  const [statusFilter, setStatusFilter] = useState<'' | HistoryStatus>('');
  const [filterOpen, setFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setFilterOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const loadHistory = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await deliveryService.getHistorySummary({
        q: debouncedSearch || undefined,
        dlv_kind: tipoFilter || undefined,
        status: statusFilter || undefined,
      });
      setRows(data.items);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar histórico');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [debouncedSearch, tipoFilter, statusFilter]);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const formatDate = (iso: string) => {
    try {
      return format(parseISO(iso), 'dd/MM/yyyy');
    } catch {
      return iso;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Validado':
        return 'historico-status-validado';
      case 'Concluído':
        return 'historico-status-concluido';
      case 'Pendente':
        return 'historico-status-pendente';
      default:
        return 'historico-status-default';
    }
  };

  const getEventIcon = (tipo: string) => {
    switch (tipo) {
      case 'Entrega':
        return <ShieldCheck className="historico-icon-entrega" />;
      case 'Troca':
        return <RefreshCw className="historico-icon-troca" />;
      default:
        return <History className="historico-icon-default" />;
    }
  };

  const hasActiveFilters = Boolean(tipoFilter || statusFilter);

  const clearFilters = () => {
    setTipoFilter('');
    setStatusFilter('');
    setFilterOpen(false);
  };

  return (
    <div className="historico-container">
      <div className="historico-header">
        <div>
          <h2 className="historico-title">Histórico Geral</h2>
          <p className="historico-subtitle">Rastreabilidade completa de todas as movimentações de EPI</p>
        </div>

        <div className="historico-actions">
          <div className="historico-search-wrapper">
            <Search className="historico-search-icon" />
            <input
              type="text"
              placeholder="Buscar colaborador..."
              className="historico-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="historico-filter-wrapper" ref={filterRef}>
            <button
              className={clsx('historico-filter-btn', hasActiveFilters && 'historico-filter-btn-active')}
              type="button"
              onClick={() => setFilterOpen((o) => !o)}
              title="Filtros"
            >
              <Filter className="historico-icon-md" />
            </button>
            {filterOpen && (
              <div className="historico-filter-panel">
                <p className="historico-filter-label">Tipo</p>
                <select
                  className="historico-filter-select"
                  value={tipoFilter}
                  onChange={(e) => setTipoFilter(e.target.value as '' | 'Entrega' | 'Troca')}
                >
                  <option value="">Todos</option>
                  <option value="Entrega">Entrega</option>
                  <option value="Troca">Troca</option>
                </select>
                <p className="historico-filter-label">Status</p>
                <select
                  className="historico-filter-select"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value as '' | HistoryStatus)}
                >
                  <option value="">Todos</option>
                  <option value="Validado">Validado</option>
                  <option value="Concluído">Concluído</option>
                  <option value="Pendente">Pendente</option>
                </select>
                {hasActiveFilters && (
                  <button type="button" className="historico-filter-clear" onClick={clearFilters}>
                    <X className="historico-icon-xs" /> Limpar filtros
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="historico-error">
          <span>{error}</span>
          <button type="button" className="historico-retry-btn" onClick={loadHistory}>
            Tentar novamente
          </button>
        </div>
      )}

      <div className="historico-table-card">
        <div className="historico-table-scroll">
          {loading ? (
            <div className="historico-loading">
              <Loader2 className="historico-icon-md historico-spin" />
              <span>Carregando histórico...</span>
            </div>
          ) : (
            <table className="historico-table">
              <thead>
                <tr className="historico-thead-row">
                  <th className="historico-th">Colaborador</th>
                  <th className="historico-th">Último Evento</th>
                  <th className="historico-th">Data</th>
                  <th className="historico-th">Status</th>
                  <th className="historico-th-center">Ações</th>
                </tr>
              </thead>
              <tbody className="historico-tbody">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="historico-cell historico-empty">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                ) : (
                  rows.map((item) => (
                    <tr key={item.emp_id} className="historico-row">
                      <td className="historico-cell">
                        <div className="historico-colab-wrapper">
                          <div className="historico-avatar">
                            {item.colaborador
                              .split(' ')
                              .map((n) => n[0])
                              .join('')
                              .slice(0, 2)}
                          </div>
                          <div>
                            <p className="historico-colab-name">
                              {item.colaborador}
                              {item.pending_incidents > 0 && (
                                <span className="historico-incident-badge" title="Intercorrências pendentes">
                                  Intercorrência
                                </span>
                              )}
                            </p>
                            <p className="historico-colab-id">
                              ID: #{item.emp_id.toString().padStart(4, '0')}
                            </p>
                            {(item.empresa || item.unidade) && (
                              <div className="historico-empresa-wrapper">
                                {item.empresa && (
                                  <p className="historico-empresa-text">
                                    <Building2 className="historico-icon-xs" />
                                    {item.empresa}
                                  </p>
                                )}
                                {item.unidade && (
                                  <p className="historico-unidade-text">
                                    <MapPin className="historico-icon-xs" />
                                    {item.unidade}
                                  </p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="historico-cell">
                        <div className="historico-event-wrapper">
                          {getEventIcon(item.tipo)}
                          <span className="historico-event-text">{item.ultimo_evento}</span>
                        </div>
                      </td>
                      <td className="historico-cell">
                        <div className="historico-date-wrapper">
                          <Calendar className="historico-date-icon" />
                          {formatDate(item.data)}
                        </div>
                      </td>
                      <td className="historico-cell">
                        <span className={`historico-status-badge ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td className="historico-cell">
                        <div className="historico-action-wrapper">
                          <button
                            onClick={() => navigate(`/historico/${item.emp_id}`)}
                            className="historico-view-btn"
                            title="Visualizar Prontuário"
                            type="button"
                          >
                            <Eye className="historico-icon-md" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Historico;
