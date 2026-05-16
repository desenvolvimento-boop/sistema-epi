import { API_BASE_URL } from './authService';
import type {
  ExportFormat,
  ReportCatalogItem,
  ReportDashboard,
  ReportFilters,
  ReportId,
  ReportResponse,
} from '../types/report.types';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function getAuthHeadersBlob(): Record<string, string> {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function buildQuery(filters: ReportFilters = {}): string {
  const params = new URLSearchParams();
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  if (filters.sec_id) params.set('sec_id', String(filters.sec_id));
  if (filters.emp_id) params.set('emp_id', String(filters.emp_id));
  if (filters.rol_id) params.set('rol_id', String(filters.rol_id));
  if (filters.status) params.set('status', filters.status);
  if (filters.q) params.set('q', filters.q);
  if (filters.page) params.set('page', String(filters.page));
  if (filters.limit) params.set('limit', String(filters.limit));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error || `Erro ${response.status}`);
  }
  return response.json();
}

export function defaultReportFilters(): ReportFilters {
  const to = new Date();
  const from = new Date();
  from.setDate(from.getDate() - 30);
  return {
    from: from.toISOString().slice(0, 10),
    to: to.toISOString().slice(0, 10),
    page: 1,
    limit: 20,
  };
}

export const reportService = {
  async getCatalog(): Promise<ReportCatalogItem[]> {
    const res = await fetch(`${API_BASE_URL}/report/catalog`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<ReportCatalogItem[]>(res);
  },

  async getDashboard(filters: ReportFilters = {}): Promise<ReportDashboard> {
    const res = await fetch(`${API_BASE_URL}/report/dashboard${buildQuery(filters)}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<ReportDashboard>(res);
  },

  async getReport(reportId: ReportId | string, filters: ReportFilters = {}): Promise<ReportResponse> {
    const res = await fetch(
      `${API_BASE_URL}/report/${reportId}${buildQuery(filters)}`,
      { headers: getAuthHeaders() }
    );
    return handleResponse<ReportResponse>(res);
  },

  async exportReport(
    reportId: ReportId | string,
    format: ExportFormat,
    filters: ReportFilters = {}
  ): Promise<Blob> {
    const params = new URLSearchParams(buildQuery(filters).replace(/^\?/, ''));
    params.set('format', format);
    const res = await fetch(
      `${API_BASE_URL}/report/${reportId}/export?${params.toString()}`,
      { headers: getAuthHeadersBlob() }
    );
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error((body as { error?: string }).error || `Erro ${res.status}`);
    }
    return res.blob();
  },
};
