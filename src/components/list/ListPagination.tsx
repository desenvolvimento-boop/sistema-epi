import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { LIST_PAGE_SIZE_OPTIONS, type ListPageSize } from '../../hooks/useListPagination';
import './ListPagination.css';

interface ListPaginationProps {
  page: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
  pageSize: ListPageSize;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: ListPageSize) => void;
  itemLabel: string;
}

export const ListPagination: React.FC<ListPaginationProps> = ({
  page,
  totalPages,
  from,
  to,
  total,
  pageSize,
  onPageChange,
  onPageSizeChange,
  itemLabel,
}) => {
  if (total === 0) return null;

  return (
    <div className="list-pagination">
      <p className="list-pagination-info">
        Mostrando {from}–{to} de {total} {itemLabel}
      </p>

      <div className="list-pagination-size">
        <label className="list-pagination-size-label" htmlFor="list-page-size">
          Itens por página
        </label>
        <select
          id="list-page-size"
          className="list-pagination-size-select"
          value={pageSize}
          onChange={(e) => onPageSizeChange(Number(e.target.value) as ListPageSize)}
        >
          {LIST_PAGE_SIZE_OPTIONS.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </div>

      <div className="list-pagination-nav">
        <span className="list-pagination-page-indicator">
          Página {page} de {totalPages}
        </span>
        <div className="list-pagination-buttons">
          <button
            type="button"
            className="list-pagination-btn"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Página anterior"
          >
            <ChevronLeft className="list-pagination-btn-icon" />
          </button>
          <button
            type="button"
            className="list-pagination-btn"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Próxima página"
          >
            <ChevronRight className="list-pagination-btn-icon" />
          </button>
        </div>
      </div>
    </div>
  );
};
