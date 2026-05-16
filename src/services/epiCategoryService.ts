import { API_BASE_URL } from './authService';

export interface EpiCategoryAPI {
  eca_id: number;
  eca_active: number;
  eca_description: string;
  eca_code: string | null;
  usr_id_insert: number | null;
  eca_datetimeinsert?: string;
  usr_id_lastupdate: number | null;
  eca_datetimeupdate?: string;
}

export type EpiCategoryCreatePayload = Omit<EpiCategoryAPI, 'eca_id' | 'eca_datetimeinsert' | 'eca_datetimeupdate'>;
export type EpiCategoryUpdatePayload = Partial<EpiCategoryCreatePayload>;

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

export const epiCategoryService = {
  async getAll(): Promise<EpiCategoryAPI[]> {
    const res = await fetch(`${API_BASE_URL}/epi-category`, { headers: getAuthHeaders() });
    return handleResponse<EpiCategoryAPI[]>(res);
  },

  async getActive(): Promise<EpiCategoryAPI[]> {
    const res = await fetch(`${API_BASE_URL}/epi-category/active`, { headers: getAuthHeaders() });
    return handleResponse<EpiCategoryAPI[]>(res);
  },

  async create(data: EpiCategoryCreatePayload): Promise<EpiCategoryAPI> {
    const res = await fetch(`${API_BASE_URL}/epi-category`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<EpiCategoryAPI>(res);
  },

  async update(id: number, data: EpiCategoryUpdatePayload): Promise<EpiCategoryAPI> {
    const res = await fetch(`${API_BASE_URL}/epi-category/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<EpiCategoryAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/epi-category/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },
};
