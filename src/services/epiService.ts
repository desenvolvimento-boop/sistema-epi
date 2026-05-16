import { API_BASE_URL } from './authService';

export interface EpiAPI {
  epi_id: number;
  epi_active: number;
  epi_description: string;
  epi_ca: string;
  epi_manufacturer: string;
  epi_category: string;
  epi_lifespan_days: number;
  epi_technical_description: string | null;
  epi_integration_id: string | null;
  epi_integration_source: string | null;
  epi_external_code: string | null;
  epi_integration_sync_at: string | null;
  usr_id_insert: number | null;
  epi_datetimeinsert?: string;
  usr_id_lastupdate: number | null;
  epi_datetimeupdate?: string;
}

export type EpiCreatePayload = Omit<EpiAPI, 'epi_id' | 'epi_datetimeinsert' | 'epi_datetimeupdate'>;
export type EpiUpdatePayload = Partial<EpiCreatePayload>;

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

export const EPI_CATEGORIES = [
  'Proteção de Cabeça',
  'Proteção de Mãos',
  'Proteção de Pés',
  'Proteção Auditiva',
  'Proteção Visual',
  'Proteção Respiratória',
  'Proteção do Tronco',
  'Outros',
] as const;

export const INTEGRATION_SOURCES = ['Manual', 'TOTVS', 'Senior'] as const;

export const epiService = {
  async getAll(): Promise<EpiAPI[]> {
    const res = await fetch(`${API_BASE_URL}/epi`, { headers: getAuthHeaders() });
    return handleResponse<EpiAPI[]>(res);
  },

  async getActive(): Promise<EpiAPI[]> {
    const res = await fetch(`${API_BASE_URL}/epi/active`, { headers: getAuthHeaders() });
    return handleResponse<EpiAPI[]>(res);
  },

  async getById(id: number): Promise<EpiAPI> {
    const res = await fetch(`${API_BASE_URL}/epi/${id}`, { headers: getAuthHeaders() });
    return handleResponse<EpiAPI>(res);
  },

  async create(data: EpiCreatePayload): Promise<EpiAPI> {
    const res = await fetch(`${API_BASE_URL}/epi`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...data,
        epi_integration_source: data.epi_integration_source || 'Manual',
      }),
    });
    return handleResponse<EpiAPI>(res);
  },

  async update(id: number, data: EpiUpdatePayload): Promise<EpiAPI> {
    const res = await fetch(`${API_BASE_URL}/epi/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<EpiAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/epi/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },
};
