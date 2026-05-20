import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Eye,
  History,
  Calendar,
  RefreshCw,
  ShieldCheck,
  Loader2,
  Building2,
  MapPin,
} from 'lucide-react';
import { ListFiltersBar } from '../../components/list/ListFiltersBar';
import { useNomenclature } from '../../hooks/useNomenclature';
import { NOMENCLATURE_KEYS } from '../../config/nomenclatureKeys';
import { format, parseISO } from 'date-fns';
import {
  deliveryService,
  type HistorySummaryItem,
  type HistoryStatus,
} from '../../services/deliveryService';
import './styles.css';

const Historico = () => {
  const { t } = useNomenclature();
  const navigate = useNavigate();
  const [rows, setRows] = useState<HistorySummaryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const tipoFilter = (filterValues.tipo ?? '') as '' | 'Entrega' | 'Troca';
  const statusFilter = (filterValues.status ?? '') as '' | HistoryStatus;

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(searchTerm), 300);
    return () => clearTimeout(t);
  }, [searchTerm]);

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

  const clearFilters = () => {
    setFilterValues({});
  };

  return (
    <div className="historico-container">
      <div className="historico-header">
        <div>
          <h2 className="historico-title">{t(NOMENCLATURE_KEYS.menu.historico)} Geral</h2>
          <p className="historico-subtitle">Rastreabilidade completa de todas as movimentações de EPI</p>
        </div>
      </div>

      <ListFiltersBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar colaborador, empresa ou unidade..."
        fields={[
          {
            id: 'tipo',
            label: 'Tipo de evento',
            type: 'select',
            options: [
              { value: 'Entrega', label: 'Entrega' },
              { value: 'Troca', label: 'Troca' },
            ],
          },
          {
            id: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { value: 'Validado', label: 'Validado' },
              { value: 'Concluído', label: 'Concluído' },
              { value: 'Pendente', label: 'Pendente' },
            ],
          },
        ]}
        values={filterValues}
        onFieldChange={(id, value) => setFilterValues((prev) => ({ ...prev, [id]: value }))}
        onClear={clearFilters}
      />

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
                  <th className="historico-th table-col-id">ID</th>
                  <th className="historico-th">{t(NOMENCLATURE_KEYS.entity.colaborador_singular)}</th>
                  <th className="historico-th">Último Evento</th>
                  <th className="historico-th">Data</th>
                  <th className="historico-th">Status</th>
                  <th className="historico-th-center">Ações</th>
                </tr>
              </thead>
              <tbody className="historico-tbody">
                {rows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="historico-cell historico-empty">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                ) : (
                  rows.map((item) => (
                    <tr key={item.emp_id} className="historico-row">
                      <td className="historico-cell table-cell-id">{item.emp_id}</td>
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
