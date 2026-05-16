import React, { useState, useEffect, useCallback } from 'react';
import {
  Search,
  Filter,
  Download,
  Package,
  User,
  Loader2,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { deliveryService, type DeliveryAPI, type DeliveryStatsItem } from '../../services/deliveryService';
import './styles.css';

const Consumo = () => {
  const [deliveries, setDeliveries] = useState<DeliveryAPI[]>([]);
  const [stats, setStats] = useState<DeliveryStatsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [allDeliveries, statsData] = await Promise.all([
        deliveryService.getAll(),
        deliveryService.getStats(30),
      ]);
      allDeliveries.sort((a, b) => b.dlv_date.localeCompare(a.dlv_date));
      setDeliveries(allDeliveries);
      setStats(statsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const totalUnits = stats.reduce((sum, s) => sum + s.total, 0);
  const topType = stats[0]?.ept_description ?? '—';

  const formatDateTime = (iso: string, datetime?: string) => {
    const raw = datetime ?? iso;
    try {
      return format(parseISO(raw), 'dd/MM/yyyy HH:mm');
    } catch {
      try {
        return format(parseISO(iso), 'dd/MM/yyyy');
      } catch {
        return raw;
      }
    }
  };

  const filtered = deliveries.filter((d) => {
    const name = d.employee?.emp_full_name?.toLowerCase() ?? '';
    const epi = d.variant?.epiType?.ept_description?.toLowerCase() ?? '';
    const q = searchTerm.toLowerCase();
    return name.includes(q) || epi.includes(q);
  });

  return (
    <div className="consumo-page">
      <div className="consumo-header">
        <div>
          <h2 className="consumo-title">Registro de Consumo</h2>
          <p className="consumo-subtitle">Acompanhamento do fluxo de entregas e trocas de EPI (últimos 30 dias).</p>
        </div>
        <button className="consumo-export-btn" type="button">
          <Download className="consumo-export-icon" /> Exportar Log
        </button>
      </div>

      <div className="consumo-stats-grid">
        <div className="consumo-stat-card">
          <div className="consumo-stat-header">
            <span className="consumo-stat-label">Total (30 dias)</span>
          </div>
          <p className="consumo-stat-value">{totalUnits} un.</p>
          <p className="consumo-stat-desc">Entregas e trocas registradas</p>
        </div>
        <div className="consumo-stat-card">
          <div className="consumo-stat-header">
            <span className="consumo-stat-label">Tipo mais consumido</span>
          </div>
          <p className="consumo-stat-value consumo-stat-value--text">{topType}</p>
          <p className="consumo-stat-desc">{stats[0]?.total ?? 0} unidades</p>
        </div>
        <div className="consumo-stat-card">
          <div className="consumo-stat-header">
            <span className="consumo-stat-label">Tipos distintos</span>
          </div>
          <p className="consumo-stat-value">{stats.length}</p>
          <p className="consumo-stat-desc">Categorias com movimentação</p>
        </div>
      </div>

      <div className="consumo-table-wrapper">
        <div className="consumo-table-toolbar">
          <div className="consumo-table-toolbar-left">
            <div className="consumo-search-wrapper">
              <Search className="consumo-search-icon" />
              <input
                type="text"
                placeholder="Filtrar consumo..."
                className="consumo-search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="consumo-filter-btn" type="button">
              <Filter className="consumo-filter-icon" />
            </button>
          </div>
        </div>
        {loading ? (
          <div className="consumo-loading">
            <Loader2 className="consumo-filter-icon consumo-spin" />
            <span>Carregando...</span>
          </div>
        ) : (
          <table className="consumo-table">
            <thead>
              <tr className="consumo-table-head-row">
                <th className="consumo-table-th">Colaborador</th>
                <th className="consumo-table-th">Tipo / Variante</th>
                <th className="consumo-table-th">Data</th>
                <th className="consumo-table-th">Motivo</th>
              </tr>
            </thead>
            <tbody className="consumo-table-body">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={4} className="consumo-table-td consumo-empty">
                    Nenhum registro no período.
                  </td>
                </tr>
              ) : (
                filtered.map((item) => {
                  const typeName = item.variant?.epiType?.ept_description ?? 'EPI';
                  const variantName = item.variant
                    ? [item.variant.epv_manufacturer, item.variant.epv_model].filter(Boolean).join(' · ')
                    : '';
                  return (
                    <tr key={item.dlv_id} className="consumo-table-row">
                      <td className="consumo-table-td">
                        <div className="consumo-colaborador-cell">
                          <div className="consumo-avatar">
                            <User className="consumo-avatar-icon" />
                          </div>
                          <span className="consumo-colaborador-name">
                            {item.employee?.emp_full_name ?? `#${item.emp_id}`}
                          </span>
                        </div>
                      </td>
                      <td className="consumo-table-td">
                        <div className="consumo-epi-cell">
                          <Package className="consumo-epi-icon" />
                          <span className="consumo-epi-name">
                            {typeName}
                            {variantName ? ` — ${variantName}` : ''}
                          </span>
                        </div>
                      </td>
                      <td className="consumo-date-text">
                        {formatDateTime(item.dlv_date, item.dlv_datetimeinsert)}
                      </td>
                      <td className="consumo-table-td">
                        <span className="consumo-motivo-badge">{item.dlv_kind}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Consumo;
