import { API_BASE_URL } from './authService';

export interface EpiCategoryRef {
  eca_id: number;
  eca_description: string;
  eca_code?: string | null;
  eca_active?: number;
}

export interface EpiTypeAPI {
  ept_id: number;
  ept_active: number;
  ept_description: string;
  eca_id: number;
  /** Preenchido pela API a partir de epi_categories */
  ept_category: string | null;
  epiCategory?: EpiCategoryRef;
  ept_lifespan_days: number;
  usr_id_insert: number | null;
  ept_datetimeinsert?: string;
  usr_id_lastupdate: number | null;
  ept_datetimeupdate?: string;
}

export type EpiTypeCreatePayload = Omit<EpiTypeAPI, 'ept_id' | 'ept_datetimeinsert' | 'ept_datetimeupdate'>;
export type EpiTypeUpdatePayload = Partial<EpiTypeCreatePayload>;

export function epiTypeCategoryLabel(type: EpiTypeAPI): string {
  return type.epiCategory?.eca_description ?? type.ept_category ?? '—';
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

export const epiTypeService = {
  async getAll(): Promise<EpiTypeAPI[]> {
    const res = await fetch(`${API_BASE_URL}/epi-type`, { headers: getAuthHeaders() });
    return handleResponse<EpiTypeAPI[]>(res);
  },

  async getActive(): Promise<EpiTypeAPI[]> {
    const res = await fetch(`${API_BASE_URL}/epi-type/active`, { headers: getAuthHeaders() });
    return handleResponse<EpiTypeAPI[]>(res);
  },

  async getById(id: number): Promise<EpiTypeAPI> {
    const res = await fetch(`${API_BASE_URL}/epi-type/${id}`, { headers: getAuthHeaders() });
    return handleResponse<EpiTypeAPI>(res);
  },

  async create(data: EpiTypeCreatePayload): Promise<EpiTypeAPI> {
    const res = await fetch(`${API_BASE_URL}/epi-type`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<EpiTypeAPI>(res);
  },

  async update(id: number, data: EpiTypeUpdatePayload): Promise<EpiTypeAPI> {
    const res = await fetch(`${API_BASE_URL}/epi-type/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<EpiTypeAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/epi-type/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },
};
