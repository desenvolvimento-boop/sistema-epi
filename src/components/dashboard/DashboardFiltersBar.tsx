import React, { useEffect, useState } from 'react';
import { Filter, X } from 'lucide-react';
import type { ReportFilters } from '../../types/report.types';
import { sectionService, type SectionAPI } from '../../services/sectionService';
import { employeeService, type EmployeeAPI } from '../../services/employeeService';
import { roleService, type RoleAPI } from '../../services/roleService';
import './DashboardFiltersBar.css';

interface DashboardFiltersBarProps {
  filters: ReportFilters;
  onChange: (next: ReportFilters) => void;
  onApply: () => void;
  applying?: boolean;
}

export const DashboardFiltersBar: React.FC<DashboardFiltersBarProps> = ({
  filters,
  onChange,
  onApply,
  applying = false,
}) => {
  const [open, setOpen] = useState(false);
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
    onChange({ ...filters, ...partial });
  };

  const clearFilters = () => {
    onChange({
      from: filters.from,
      to: filters.to,
    });
  };

  const hasExtraFilters = Boolean(filters.sec_id || filters.emp_id || filters.rol_id);

  return (
    <div className="dashboard-filters">
      <div className="dashboard-filters-top">
        <button
          type="button"
          className="dashboard-filters-toggle"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
        >
          <Filter size={16} /> Filtros dos indicadores
        </button>
        <div className="dashboard-filters-actions">
          {hasExtraFilters && (
            <button type="button" className="dashboard-filters-clear" onClick={clearFilters}>
              <X size={14} /> Limpar filtros
            </button>
          )}
          <button
            type="button"
            className="dashboard-filters-apply"
            onClick={onApply}
            disabled={applying}
          >
            {applying ? 'Atualizando...' : 'Aplicar'}
          </button>
        </div>
      </div>

      {open && (
        <div className="dashboard-filters-grid">
          <label className="dashboard-filters-field">
            <span>De</span>
            <input
              type="date"
              value={filters.from || ''}
              onChange={(e) => patch({ from: e.target.value })}
            />
          </label>
          <label className="dashboard-filters-field">
            <span>Até</span>
            <input
              type="date"
              value={filters.to || ''}
              onChange={(e) => patch({ to: e.target.value })}
            />
          </label>
          <label className="dashboard-filters-field">
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
          <label className="dashboard-filters-field">
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
          <label className="dashboard-filters-field">
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
        </div>
      )}
    </div>
  );
};
