import { API_BASE_URL } from './authService';
import type { EpiVariantAPI } from './epiVariantService';
import type { EpiTypeAPI } from './epiTypeService';

export interface DeliveryAPI {
  dlv_id: number;
  emp_id: number;
  epv_id: number;
  dlv_date: string;
  dlv_kind: 'Entrega' | 'Troca';
  dlv_notes: string | null;
  usr_id_insert: number | null;
  dlv_datetimeinsert?: string;
  variant?: EpiVariantAPI & { epiType?: EpiTypeAPI };
  employee?: { emp_id: number; emp_full_name: string; rol_id: number };
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
  ca: string | null;
  last_epv_id: number | null;
  variants: ExchangeAgendaVariant[];
}

export interface ExchangeAgendaResponse {
  items: ExchangeAgendaItem[];
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

export const deliveryService = {
  async getAll(filters?: { emp_id?: number; dlv_kind?: string }): Promise<DeliveryAPI[]> {
    const params = new URLSearchParams();
    if (filters?.emp_id) params.set('emp_id', String(filters.emp_id));
    if (filters?.dlv_kind) params.set('dlv_kind', filters.dlv_kind);
    const qs = params.toString() ? `?${params}` : '';
    const res = await fetch(`${API_BASE_URL}/delivery${qs}`, { headers: getAuthHeaders() });
    return handleResponse<DeliveryAPI[]>(res);
  },

  async getExchangeAgenda(): Promise<ExchangeAgendaResponse> {
    const res = await fetch(`${API_BASE_URL}/exchange-agenda`, { headers: getAuthHeaders() });
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
