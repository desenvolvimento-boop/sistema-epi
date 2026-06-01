import { API_BASE_URL } from './authService';
import type { EpiTypeAPI } from './epiTypeService';

export const INTEGRATION_SOURCES = ['Manual', 'TOTVS_RM', 'PROTHEUS', 'TOTVS', 'Senior'] as const;

export interface EpiVariantAPI {
  epv_id: number;
  ept_id: number;
  epv_active: number;
  epv_manufacturer: string;
  epv_model: string | null;
  epv_ca: string;
  epv_lifespan_days: number | null;
  epv_technical_description: string | null;
  epv_integration_id: string | null;
  epv_integration_source: string | null;
  epv_external_code: string | null;
  epv_integration_sync_at: string | null;
  usr_id_insert: number | null;
  epv_datetimeinsert?: string;
  usr_id_lastupdate: number | null;
  epv_datetimeupdate?: string;
  epiType?: EpiTypeAPI;
}

export type EpiVariantCreatePayload = Omit<EpiVariantAPI, 'epv_id' | 'epv_datetimeinsert' | 'epv_datetimeupdate' | 'epiType'>;
export type EpiVariantUpdatePayload = Partial<EpiVariantCreatePayload>;

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

export const epiVariantService = {
  async getAll(): Promise<EpiVariantAPI[]> {
    const res = await fetch(`${API_BASE_URL}/epi-variant`, { headers: getAuthHeaders() });
    return handleResponse<EpiVariantAPI[]>(res);
  },

  async getActive(): Promise<EpiVariantAPI[]> {
    const res = await fetch(`${API_BASE_URL}/epi-variant/active`, { headers: getAuthHeaders() });
    return handleResponse<EpiVariantAPI[]>(res);
  },

  async getByTypeId(eptId: number, activeOnly = true): Promise<EpiVariantAPI[]> {
    const qs = activeOnly ? '?active=1' : '';
    const res = await fetch(`${API_BASE_URL}/epi-type/${eptId}/variants${qs}`, { headers: getAuthHeaders() });
    return handleResponse<EpiVariantAPI[]>(res);
  },

  async getById(id: number): Promise<EpiVariantAPI> {
    const res = await fetch(`${API_BASE_URL}/epi-variant/${id}`, { headers: getAuthHeaders() });
    return handleResponse<EpiVariantAPI>(res);
  },

  async create(data: EpiVariantCreatePayload): Promise<EpiVariantAPI> {
    const res = await fetch(`${API_BASE_URL}/epi-variant`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...data,
        epv_integration_source: data.epv_integration_source || 'Manual',
      }),
    });
    return handleResponse<EpiVariantAPI>(res);
  },

  async update(id: number, data: EpiVariantUpdatePayload): Promise<EpiVariantAPI> {
    const res = await fetch(`${API_BASE_URL}/epi-variant/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<EpiVariantAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/epi-variant/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },
};
