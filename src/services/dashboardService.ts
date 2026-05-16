import { API_BASE_URL } from './authService';
import { defaultReportFilters } from './reportService';
import type { ReportDashboard, ReportFilters } from '../types/report.types';

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

function buildQuery(filters: ReportFilters = {}): string {
  const params = new URLSearchParams();
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  if (filters.sec_id) params.set('sec_id', String(filters.sec_id));
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

export const dashboardService = {
  async getOverview(filters: ReportFilters = defaultReportFilters()): Promise<ReportDashboard> {
    const res = await fetch(`${API_BASE_URL}/dashboard/overview${buildQuery(filters)}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<ReportDashboard>(res);
  },
};
