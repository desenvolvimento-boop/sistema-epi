import { API_BASE_URL } from './authService';
import type { EpiVariantAPI } from './epiVariantService';
import type { EpiTypeAPI } from './epiTypeService';

export type HistoryStatus = 'Validado' | 'Concluído' | 'Pendente';

export interface DeliveryAPI {
  dlv_id: number;
  emp_id: number;
  epv_id: number;
  dlv_date: string;
  dlv_kind: 'Entrega' | 'Troca';
  dlv_notes: string | null;
  dlv_latitude?: number | null;
  dlv_longitude?: number | null;
  dlv_geo_accuracy?: number | null;
  dlv_device_id?: string | null;
  dlv_face_valid?: number | null;
  dlv_face_score?: number | null;
  dlv_face_mismatch_emp_id?: number | null;
  dlv_face_photo_url?: string | null;
  usr_id_insert: number | null;
  dlv_datetimeinsert?: string;
  validation_status?: HistoryStatus;
  variant?: EpiVariantAPI & { epiType?: EpiTypeAPI };
  employee?: {
    emp_id: number;
    emp_full_name: string;
    rol_id: number;
    sec_id?: number;
    com_id?: number;
    company?: { com_id: number; com_description: string };
    section?: { sec_id: number; sec_description: string };
  };
  insertedBy?: { usr_id: number; usr_full_name: string };
}

export interface HistorySummaryItem {
  emp_id: number;
  colaborador: string;
  empresa: string | null;
  unidade: string | null;
  ultimo_evento: string;
  data: string;
  status: HistoryStatus;
  tipo: 'Entrega' | 'Troca';
  dlv_id: number;
  total_entregas: number;
  pending_incidents: number;
}

export interface HistorySummaryResponse {
  items: HistorySummaryItem[];
  total: number;
}

export interface HistorySummaryFilters {
  q?: string;
  dlv_kind?: 'Entrega' | 'Troca' | '';
  status?: HistoryStatus | '';
  sec_id?: number;
}

export interface ExchangeAgendaVariant {
  epv_id: number;
  ept_id: number;
  epv_manufacturer: string;
  epv_model: string | null;
  epv_ca: string;
}

export interface ExchangeAgendaItem {
  emp_id: number;
  colaborador: string;
  ept_id: number;
  epi: string;
  data: string;
  due_date: string;
  status: string;
  prioridade: string;
  effective_days?: number;
  rule_hint?: string | null;
  ca: string | null;
  last_epv_id: number | null;
  variants: ExchangeAgendaVariant[];
}

export interface ExchangeAgendaFilters {
  emp_id?: number;
  sec_id?: number;
  prioridade?: string;
  from?: string;
  to?: string;
  limit?: number;
  offset?: number;
}

export interface ExchangeAgendaResponse {
  items: ExchangeAgendaItem[];
  total?: number;
  stats: {
    hoje: number;
    atrasadas: number;
    proximos7: number;
    concluidasHoje: number;
  };
}

export interface DeliveryStatsItem {
  ept_id: number;
  ept_description: string;
  total: number;
}

export interface DeliveryCreatePayload {
  emp_id: number;
  epv_id: number;
  dlv_date: string;
  dlv_kind?: 'Entrega' | 'Troca';
  dlv_notes?: string | null;
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

export function getDeliveryValidationStatus(delivery: DeliveryAPI): HistoryStatus {
  if (delivery.dlv_face_valid === 0 || delivery.dlv_face_mismatch_emp_id) return 'Pendente';
  if (delivery.dlv_face_valid === 1) return 'Validado';
  return delivery.validation_status ?? 'Concluído';
}

export const deliveryService = {
  async getHistorySummary(filters?: HistorySummaryFilters): Promise<HistorySummaryResponse> {
    const params = new URLSearchParams();
    if (filters?.q?.trim()) params.set('q', filters.q.trim());
    if (filters?.dlv_kind) params.set('dlv_kind', filters.dlv_kind);
    if (filters?.status) params.set('status', filters.status);
    if (filters?.sec_id) params.set('sec_id', String(filters.sec_id));
    const qs = params.toString() ? `?${params}` : '';
    const res = await fetch(`${API_BASE_URL}/delivery/history/summary${qs}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<HistorySummaryResponse>(res);
  },
  async getAll(filters?: { emp_id?: number; dlv_kind?: string }): Promise<DeliveryAPI[]> {
    const params = new URLSearchParams();
    if (filters?.emp_id) params.set('emp_id', String(filters.emp_id));
    if (filters?.dlv_kind) params.set('dlv_kind', filters.dlv_kind);
    const qs = params.toString() ? `?${params}` : '';
    const res = await fetch(`${API_BASE_URL}/delivery${qs}`, { headers: getAuthHeaders() });
    return handleResponse<DeliveryAPI[]>(res);
  },

  async getExchangeAgenda(filters?: ExchangeAgendaFilters): Promise<ExchangeAgendaResponse> {
    const params = new URLSearchParams();
    if (filters?.emp_id) params.set('emp_id', String(filters.emp_id));
    if (filters?.sec_id) params.set('sec_id', String(filters.sec_id));
    if (filters?.prioridade) params.set('prioridade', filters.prioridade);
    if (filters?.from) params.set('from', filters.from);
    if (filters?.to) params.set('to', filters.to);
    if (filters?.limit) params.set('limit', String(filters.limit));
    if (filters?.offset) params.set('offset', String(filters.offset));
    const qs = params.toString() ? `?${params}` : '';
    const res = await fetch(`${API_BASE_URL}/exchange-agenda${qs}`, { headers: getAuthHeaders() });
    return handleResponse<ExchangeAgendaResponse>(res);
  },

  async getStats(days = 30): Promise<DeliveryStatsItem[]> {
    const res = await fetch(`${API_BASE_URL}/delivery/stats?days=${days}`, { headers: getAuthHeaders() });
    return handleResponse<DeliveryStatsItem[]>(res);
  },

  async create(data: DeliveryCreatePayload): Promise<DeliveryAPI> {
    const res = await fetch(`${API_BASE_URL}/delivery`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<DeliveryAPI>(res);
  },

  async getByEmployee(empId: number): Promise<DeliveryAPI[]> {
    const res = await fetch(`${API_BASE_URL}/delivery/employee/${empId}`, { headers: getAuthHeaders() });
    return handleResponse<DeliveryAPI[]>(res);
  },
};
