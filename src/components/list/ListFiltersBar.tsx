import React, { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import clsx from 'clsx';
import { Filter, Search, X } from 'lucide-react';
import './ListFiltersBar.css';

export type ListFilterFieldType = 'select' | 'date';

export interface ListFilterOption {
  value: string;
  label: string;
}

export interface ListFilterField {
  id: string;
  label: string;
  type: ListFilterFieldType;
  options?: ListFilterOption[];
  allOptionLabel?: string;
}

export interface ListFiltersBarProps {
  searchValue: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  fields?: ListFilterField[];
  values?: Record<string, string>;
  onFieldChange?: (id: string, value: string) => void;
  onClear?: () => void;
  defaultOpen?: boolean;
  className?: string;
}

export const ListFiltersBar: React.FC<ListFiltersBarProps> = ({
  searchValue,
  onSearchChange,
  searchPlaceholder = 'Buscar...',
  fields = [],
  values = {},
  onFieldChange,
  onClear,
  defaultOpen = false,
  className,
}) => {
  const [open, setOpen] = useState(defaultOpen);
  const location = useLocation();

  useEffect(() => {
    setOpen(false);
  }, [location.pathname]);

  const hasActiveFilters = useMemo(() => {
    if (searchValue.trim()) return true;
    return fields.some((f) => Boolean(values[f.id]));
  }, [searchValue, fields, values]);

  const handleClear = () => {
    onSearchChange('');
    onClear?.();
  };

  return (
    <div className={clsx('list-filters', className)}>
      <div className="list-filters-top">
        <div className="list-filters-search">
          <Search className="list-filters-search-icon" size={16} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="list-filters-search-input"
          />
        </div>
        {fields.length > 0 && (
          <button
            type="button"
            className={clsx('list-filters-toggle', hasActiveFilters && 'list-filters-toggle--active')}
            onClick={() => setOpen((v) => !v)}
          >
            <Filter size={16} /> Filtros
          </button>
        )}
      </div>

      {open && fields.length > 0 && (
        <div className="list-filters-grid">
          {fields.map((field) => (
            <label key={field.id} className="list-filters-field">
              <span>{field.label}</span>
              {field.type === 'date' ? (
                <input
                  type="date"
                  value={values[field.id] ?? ''}
                  onChange={(e) => onFieldChange?.(field.id, e.target.value)}
                />
              ) : (
                <select
                  value={values[field.id] ?? ''}
                  onChange={(e) => onFieldChange?.(field.id, e.target.value)}
                >
                  <option value="">{field.allOptionLabel ?? 'Todos'}</option>
                  {field.options?.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            </label>
          ))}
          {hasActiveFilters && onClear && (
            <button type="button" className="list-filters-clear" onClick={handleClear}>
              <X size={14} /> Limpar
            </button>
          )}
        </div>
      )}
    </div>
  );
};
