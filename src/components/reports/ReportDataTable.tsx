import React from 'react';
import { ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';
import type { ReportColumn, ReportRow } from '../../types/report.types';
import './ReportDataTable.css';

interface ReportDataTableProps {
  columns: ReportColumn[];
  items: ReportRow[];
  loading?: boolean;
  page: number;
  totalPages: number;
  total: number;
  onPageChange: (page: number) => void;
}

export const ReportDataTable: React.FC<ReportDataTableProps> = ({
  columns,
  items,
  loading,
  page,
  totalPages,
  total,
  onPageChange,
}) => {
  if (loading) {
    return (
      <div className="report-table-loading">
        <Loader2 className="report-table-spinner" size={32} />
        <span>Carregando relatório...</span>
      </div>
    );
  }

  if (!items.length) {
    return <p className="report-table-empty">Nenhum registro encontrado para os filtros selecionados.</p>;
  }

  return (
    <div className="report-table-wrap">
      <div className="report-table-scroll">
        <table className="report-table">
          <thead>
            <tr>
              {columns.map((col) => (
                <th key={col.key}>{col.label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items.map((row, idx) => (
              <tr key={idx}>
                {columns.map((col) => (
                  <td key={col.key}>{row[col.key] ?? '—'}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="report-table-pagination">
        <span className="report-table-count">
          {total} registro{total !== 1 ? 's' : ''} — página {page} de {totalPages}
        </span>
        <div className="report-table-pagination-btns">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => onPageChange(page - 1)}
            aria-label="Página anterior"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            disabled={page >= totalPages}
            onClick={() => onPageChange(page + 1)}
            aria-label="Próxima página"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};
