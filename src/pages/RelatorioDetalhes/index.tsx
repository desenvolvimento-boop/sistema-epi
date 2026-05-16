import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { defaultReportFilters, reportService } from '../../services/reportService';
import type { ExportFormat, ReportCatalogItem, ReportFilters, ReportResponse } from '../../types/report.types';
import { ReportFiltersBar } from '../../components/reports/ReportFiltersBar';
import { ReportSummaryCards } from '../../components/reports/ReportSummaryCards';
import { ReportDataTable } from '../../components/reports/ReportDataTable';
import './styles.css';

const RelatorioDetalhes = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { canEdit } = useAuth();
  const canExport = canEdit('/relatorios');

  const [catalogItem, setCatalogItem] = useState<ReportCatalogItem | null>(null);
  const [data, setData] = useState<ReportResponse | null>(null);
  const [filters, setFilters] = useState<ReportFilters>(defaultReportFilters());
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState<ExportFormat | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(t);
  }, [searchInput]);

  useEffect(() => {
    reportService
      .getCatalog()
      .then((cat) => {
        const item = cat.find((c) => c.id === id) ?? null;
        setCatalogItem(item);
        if (!item) navigate('/relatorios', { replace: true });
      })
      .catch(() => navigate('/relatorios', { replace: true }));
  }, [id, navigate]);

  const loadReport = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await reportService.getReport(id, {
        ...filters,
        q: search || undefined,
      });
      setData(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar relatório');
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [id, filters, search]);

  useEffect(() => {
    loadReport();
  }, [loadReport]);

  const handleExport = async (format: ExportFormat) => {
    if (!id || !canExport) return;
    setExporting(format);
    try {
      const blob = await reportService.exportReport(id, format, {
        ...filters,
        q: search || undefined,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `relatorio-${id}-${filters.to || 'export'}.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Erro ao exportar');
    } finally {
      setExporting(null);
    }
  };

  const title = data?.report?.title || catalogItem?.title || 'Relatório';

  return (
    <div className="rel-detalhes-container">
      <div className="rel-detalhes-header">
        <button
          type="button"
          onClick={() => navigate('/relatorios')}
          className="rel-detalhes-back"
        >
          <ArrowLeft size={18} /> Voltar
        </button>
        <div className="rel-detalhes-header-text">
          <h2 className="rel-detalhes-title">{title}</h2>
          <p className="rel-detalhes-desc">
            {data?.report?.description || catalogItem?.description}
          </p>
        </div>
        {canExport && (
          <div className="rel-detalhes-actions">
            <button
              type="button"
              className="rel-detalhes-export-btn"
              disabled={!!exporting}
              onClick={() => handleExport('pdf')}
            >
              {exporting === 'pdf' ? (
                <Loader2 size={16} className="rel-detalhes-spin" />
              ) : (
                <Download size={16} />
              )}
              PDF
            </button>
            <button
              type="button"
              className="rel-detalhes-export-btn rel-detalhes-export-excel"
              disabled={!!exporting}
              onClick={() => handleExport('xlsx')}
            >
              {exporting === 'xlsx' ? (
                <Loader2 size={16} className="rel-detalhes-spin" />
              ) : (
                <Download size={16} />
              )}
              Excel
            </button>
          </div>
        )}
      </div>

      <ReportFiltersBar
        catalogItem={catalogItem}
        filters={filters}
        onChange={setFilters}
        searchValue={searchInput}
        onSearchChange={setSearchInput}
      />

      {error && <div className="rel-detalhes-error">{error}</div>}

      {data?.summary && <ReportSummaryCards summary={data.summary} />}

      <ReportDataTable
        columns={data?.columns ?? catalogItem?.columns ?? []}
        items={data?.items ?? []}
        loading={loading}
        page={data?.page ?? 1}
        totalPages={data?.totalPages ?? 1}
        total={data?.total ?? 0}
        onPageChange={(page) => setFilters((f) => ({ ...f, page }))}
      />
    </div>
  );
};

export default RelatorioDetalhes;
