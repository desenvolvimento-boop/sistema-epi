import { API_BASE_URL } from './authService';

export type IncidentType =
  | 'FRAUDE_FACIAL'
  | 'DIVERGENCIA_CARGO'
  | 'CONSUMO_ANORMAL'
  | 'GEO_INCONSISTENTE';

export type IncidentSeverity = 'ALTA' | 'MEDIA' | 'BAIXA';
export type IncidentStatus = 'PENDENTE' | 'ANALISADO' | 'DESCARTADO';
export type IncidentResolution = 'DESCARTADO' | 'CONFIRMADO' | 'BLOQUEIO';

export interface IncidentAPI {
  inc_id: number;
  inc_code: string;
  inc_type: IncidentType;
  inc_severity: IncidentSeverity;
  inc_status: IncidentStatus;
  inc_title: string;
  inc_summary: string | null;
  inc_evidence: Record<string, unknown> | null;
  emp_id: number | null;
  dlv_id: number | null;
  sec_id: number | null;
  com_id: number | null;
  inc_detected_at: string;
  inc_resolved_at: string | null;
  inc_resolution: IncidentResolution | null;
  inc_resolution_note: string | null;
  inc_block_employee: number;
  colaborador: string | null;
  description: string;
  detalhes: string | null;
  data: string;
  status: IncidentStatus;
  severity: IncidentSeverity;
  type: IncidentType;
  id: string;
}

export interface IncidentStats {
  criticalLast24h: number;
  pendingTotal: number;
  fraudRateMonthly: number;
  confirmedMonth: number;
  totalMonth: number;
}

export interface IncidentListResponse {
  items: IncidentAPI[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface IncidentListFilters {
  status?: IncidentStatus | '';
  severity?: IncidentSeverity | '';
  type?: IncidentType | '';
  q?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export interface ResolveIncidentPayload {
  status: 'ANALISADO' | 'DESCARTADO';
  resolution: IncidentResolution;
  note: string;
  blockEmployee?: boolean;
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Erro ${response.status}`);
  }
  return response.json();
}

function buildQuery(filters: IncidentListFilters): string {
  const qs = new URLSearchParams();
  if (filters.status) qs.set('status', filters.status);
  if (filters.severity) qs.set('severity', filters.severity);
  if (filters.type) qs.set('type', filters.type);
  if (filters.q?.trim()) qs.set('q', filters.q.trim());
  if (filters.from) qs.set('from', filters.from);
  if (filters.to) qs.set('to', filters.to);
  if (filters.page) qs.set('page', String(filters.page));
  if (filters.limit) qs.set('limit', String(filters.limit));
  const s = qs.toString();
  return s ? `?${s}` : '';
}

export const INCIDENT_TYPE_LABELS: Record<IncidentType, string> = {
  FRAUDE_FACIAL: 'Fraude facial',
  DIVERGENCIA_CARGO: 'Divergência de cargo',
  CONSUMO_ANORMAL: 'Consumo anormal',
  GEO_INCONSISTENTE: 'Geo inconsistente',
};

export const incidentService = {
  async getAll(filters: IncidentListFilters = {}): Promise<IncidentListResponse> {
    const res = await fetch(`${API_BASE_URL}/incident${buildQuery(filters)}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<IncidentListResponse>(res);
  },

  async getStats(): Promise<IncidentStats> {
    const res = await fetch(`${API_BASE_URL}/incident/stats`, { headers: getAuthHeaders() });
    return handleResponse<IncidentStats>(res);
  },

  async getById(id: number): Promise<IncidentAPI> {
    const res = await fetch(`${API_BASE_URL}/incident/${id}`, { headers: getAuthHeaders() });
    return handleResponse<IncidentAPI>(res);
  },

  async resolve(id: number, data: ResolveIncidentPayload): Promise<IncidentAPI> {
    const res = await fetch(`${API_BASE_URL}/incident/${id}/resolve`, {
      method: 'PATCH',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<IncidentAPI>(res);
  },

  async detect(windowDays = 7): Promise<{ scanned: number; created: number }> {
    const res = await fetch(`${API_BASE_URL}/incident/detect`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ windowDays }),
    });
    return handleResponse(res);
  },

  async getTopPending(limit = 3): Promise<IncidentAPI[]> {
    const res = await fetch(
      `${API_BASE_URL}/incident${buildQuery({ status: 'PENDENTE', severity: 'ALTA', limit, page: 1 })}`,
      { headers: getAuthHeaders() }
    );
    const data = await handleResponse<IncidentListResponse>(res);
    return data.items;
  },

  async getPendingByEmployee(): Promise<Map<number, number>> {
    const res = await fetch(
      `${API_BASE_URL}/incident${buildQuery({ status: 'PENDENTE', limit: 500, page: 1 })}`,
      { headers: getAuthHeaders() }
    );
    const data = await handleResponse<IncidentListResponse>(res);
    const map = new Map<number, number>();
    for (const item of data.items) {
      if (item.emp_id) {
        map.set(item.emp_id, (map.get(item.emp_id) || 0) + 1);
      }
    }
    return map;
  },

  async exportCsv(filters: IncidentListFilters = {}): Promise<Blob> {
    const res = await fetch(`${API_BASE_URL}/incident/export${buildQuery(filters)}`, {
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
    return res.blob();
  },
};
