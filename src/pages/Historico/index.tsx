import React, { useState, useEffect, useCallback } from 'react';
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
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { deliveryService, type DeliveryAPI } from '../../services/deliveryService';
import './styles.css';

interface HistoricoRow {
  emp_id: number;
  colaborador: string;
  ultimoEvento: string;
  data: string;
  status: string;
  tipo: string;
  dlv_id: number;
}

const Historico = () => {
  const navigate = useNavigate();
  const [rows, setRows] = useState<HistoricoRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const loadDeliveries = useCallback(async () => {
    setLoading(true);
    try {
      const deliveries = await deliveryService.getAll();
      const byEmployee = new Map<number, DeliveryAPI>();

      for (const d of deliveries) {
        const existing = byEmployee.get(d.emp_id);
        if (!existing || d.dlv_date > existing.dlv_date) {
          byEmployee.set(d.emp_id, d);
        }
      }

      const list: HistoricoRow[] = Array.from(byEmployee.values()).map((d) => {
        const typeLabel = d.variant?.epiType?.ept_description ?? 'EPI';
        const variantLabel = d.variant
          ? [d.variant.epv_manufacturer, d.variant.epv_model].filter(Boolean).join(' ')
          : '';
        return {
          emp_id: d.emp_id,
          colaborador: d.employee?.emp_full_name ?? `Colaborador #${d.emp_id}`,
          ultimoEvento: `${d.dlv_kind} de ${typeLabel}${variantLabel ? `: ${variantLabel}` : ''}`,
          data: d.dlv_date,
          status: 'Concluído',
          tipo: d.dlv_kind,
          dlv_id: d.dlv_id,
        };
      });

      list.sort((a, b) => b.data.localeCompare(a.data));
      setRows(list);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDeliveries();
  }, [loadDeliveries]);

  const formatDate = (iso: string) => {
    try {
      return format(parseISO(iso), 'dd/MM/yyyy');
    } catch {
      return iso;
    }
  };

  const filtered = rows.filter((item) =>
    item.colaborador.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
          <button className="historico-filter-btn" type="button">
            <Filter className="historico-icon-md" />
          </button>
        </div>
      </div>

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
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="historico-cell historico-empty">
                      Nenhum registro encontrado.
                    </td>
                  </tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.emp_id} className="historico-row">
                      <td className="historico-cell">
                        <div className="historico-colab-wrapper">
                          <div className="historico-avatar">
                            {item.colaborador.split(' ').map((n) => n[0]).join('').slice(0, 2)}
                          </div>
                          <div>
                            <p className="historico-colab-name">{item.colaborador}</p>
                            <p className="historico-colab-id">ID: #{item.emp_id.toString().padStart(4, '0')}</p>
                          </div>
                        </div>
                      </td>
                      <td className="historico-cell">
                        <div className="historico-event-wrapper">
                          {getEventIcon(item.tipo)}
                          <span className="historico-event-text">{item.ultimoEvento}</span>
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
