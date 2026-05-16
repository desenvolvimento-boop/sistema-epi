import React, { useEffect, useState } from 'react';
import { Filter, Search, X } from 'lucide-react';
import type { ReportCatalogItem, ReportFilters } from '../../types/report.types';
import { sectionService, type SectionAPI } from '../../services/sectionService';
import { employeeService, type EmployeeAPI } from '../../services/employeeService';
import { roleService, type RoleAPI } from '../../services/roleService';
import './ReportFiltersBar.css';

interface ReportFiltersBarProps {
  catalogItem: ReportCatalogItem | null;
  filters: ReportFilters;
  onChange: (next: ReportFilters) => void;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export const ReportFiltersBar: React.FC<ReportFiltersBarProps> = ({
  catalogItem,
  filters,
  onChange,
  searchValue,
  onSearchChange,
}) => {
  const [open, setOpen] = useState(true);
  const [sections, setSections] = useState<SectionAPI[]>([]);
  const [employees, setEmployees] = useState<EmployeeAPI[]>([]);
  const [roles, setRoles] = useState<RoleAPI[]>([]);

  useEffect(() => {
    Promise.all([
      sectionService.getActive(),
      employeeService.getActive(),
      roleService.getActive(),
    ])
      .then(([s, e, r]) => {
        setSections(s);
        setEmployees(e);
        setRoles(r);
      })
      .catch(() => {});
  }, []);

  const patch = (partial: Partial<ReportFilters>) => {
    onChange({ ...filters, ...partial, page: 1 });
  };

  const clearFilters = () => {
    onSearchChange('');
    onChange({
      from: filters.from,
      to: filters.to,
      page: 1,
      limit: filters.limit || 20,
    });
  };

  return (
    <div className="report-filters">
      <div className="report-filters-top">
        <div className="report-filters-search">
          <Search className="report-filters-search-icon" size={16} />
          <input
            type="text"
            placeholder="Buscar..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="report-filters-search-input"
          />
        </div>
        <button
          type="button"
          className="report-filters-toggle"
          onClick={() => setOpen((v) => !v)}
        >
          <Filter size={16} /> Filtros
        </button>
      </div>

      {open && (
        <div className="report-filters-grid">
          <label className="report-filters-field">
            <span>De</span>
            <input
              type="date"
              value={filters.from || ''}
              onChange={(e) => patch({ from: e.target.value })}
            />
          </label>
          <label className="report-filters-field">
            <span>Até</span>
            <input
              type="date"
              value={filters.to || ''}
              onChange={(e) => patch({ to: e.target.value })}
            />
          </label>
          <label className="report-filters-field">
            <span>Unidade</span>
            <select
              value={filters.sec_id ?? ''}
              onChange={(e) =>
                patch({ sec_id: e.target.value ? Number(e.target.value) : '' })
              }
            >
              <option value="">Todas</option>
              {sections.map((s) => (
                <option key={s.sec_id} value={s.sec_id}>
                  {s.sec_description}
                </option>
              ))}
            </select>
          </label>
          <label className="report-filters-field">
            <span>Colaborador</span>
            <select
              value={filters.emp_id ?? ''}
              onChange={(e) =>
                patch({ emp_id: e.target.value ? Number(e.target.value) : '' })
              }
            >
              <option value="">Todos</option>
              {employees.map((e) => (
                <option key={e.emp_id} value={e.emp_id}>
                  {e.emp_full_name}
                </option>
              ))}
            </select>
          </label>
          <label className="report-filters-field">
            <span>Função</span>
            <select
              value={filters.rol_id ?? ''}
              onChange={(e) =>
                patch({ rol_id: e.target.value ? Number(e.target.value) : '' })
              }
            >
              <option value="">Todas</option>
              {roles.map((r) => (
                <option key={r.rol_id} value={r.rol_id}>
                  {r.rol_description}
                </option>
              ))}
            </select>
          </label>
          {catalogItem?.statusOptions && catalogItem.statusOptions.length > 0 && (
            <label className="report-filters-field">
              <span>Status</span>
              <select
                value={filters.status ?? ''}
                onChange={(e) => patch({ status: e.target.value })}
              >
                {catalogItem.statusOptions.map((opt) => (
                  <option key={opt.value || 'all'} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </label>
          )}
          <button type="button" className="report-filters-clear" onClick={clearFilters}>
            <X size={14} /> Limpar
          </button>
        </div>
      )}
    </div>
  );
};
