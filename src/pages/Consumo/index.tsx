import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Download,
  Package,
  User,
  Loader2,
} from 'lucide-react';
import { ListFiltersBar } from '../../components/list/ListFiltersBar';
import { filterListRows } from '../../utils/listFilters';
import { format, parseISO } from 'date-fns';
import { deliveryService, type DeliveryAPI, type DeliveryStatsItem } from '../../services/deliveryService';
import { PageHeader } from '../../components/layout/PageHeader';
import { useNomenclature } from '../../hooks/useNomenclature';
import { NOMENCLATURE_KEYS } from '../../config/nomenclatureKeys';
import './styles.css';

const Consumo = () => {
  const { t } = useNomenclature();
  const [deliveries, setDeliveries] = useState<DeliveryAPI[]>([]);
  const [stats, setStats] = useState<DeliveryStatsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

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

  const filtered = useMemo(
    () =>
      filterListRows(deliveries, searchTerm, filterValues, {
        searchText: (d) => {
          const typeName = d.variant?.epiType?.ept_description ?? '';
          const variantName = d.variant
            ? [d.variant.epv_manufacturer, d.variant.epv_model].filter(Boolean).join(' ')
            : '';
          return [
            d.employee?.emp_full_name,
            typeName,
            variantName,
            d.dlv_kind,
            d.dlv_notes,
            String(d.dlv_id),
          ]
            .filter(Boolean)
            .join(' ');
        },
        fields: {
          kind: (d, value) => d.dlv_kind === value,
          from: (d, value) => !value || d.dlv_date >= value,
          to: (d, value) => !value || d.dlv_date <= value,
        },
      }),
    [deliveries, searchTerm, filterValues],
  );

  return (
    <div className="consumo-page">
      <PageHeader
        icon={Package}
        title="Registro de Consumo"
        subtitle={t(NOMENCLATURE_KEYS.page.subtitle_consumo)}
        actions={
          <button className="consumo-export-btn" type="button">
            <Download className="consumo-export-icon" /> Exportar Log
          </button>
        }
      />

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

      <ListFiltersBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar colaborador, EPI ou motivo..."
        fields={[
          {
            id: 'kind',
            label: 'Tipo',
            type: 'select',
            options: [
              { value: 'Entrega', label: 'Entrega' },
              { value: 'Troca', label: 'Troca' },
            ],
          },
          { id: 'from', label: 'Data de', type: 'date' },
          { id: 'to', label: 'Data até', type: 'date' },
        ]}
        values={filterValues}
        onFieldChange={(id, value) => setFilterValues((prev) => ({ ...prev, [id]: value }))}
        onClear={() => setFilterValues({})}
      />

      <div className="consumo-table-wrapper">
        {loading ? (
          <div className="consumo-loading">
            <Loader2 className="consumo-filter-icon consumo-spin" />
            <span>Carregando...</span>
          </div>
        ) : (
          <table className="consumo-table">
            <thead>
              <tr className="consumo-table-head-row">
                <th className="consumo-table-th table-col-id">ID</th>
                <th className="consumo-table-th">Colaborador</th>
                <th className="consumo-table-th">Tipo / Variante</th>
                <th className="consumo-table-th">Data</th>
                <th className="consumo-table-th">Motivo</th>
              </tr>
            </thead>
            <tbody className="consumo-table-body">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="consumo-table-td consumo-empty">
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
                      <td className="consumo-table-td table-cell-id">{item.dlv_id}</td>
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
