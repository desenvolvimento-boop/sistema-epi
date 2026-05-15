import { API_BASE_URL } from './authService';

export interface CompanyAPI {
  com_id: number;
  com_active: number;
  com_description: string;
  com_integration_id: string | null;
  usr_id_insert: number | null;
  com_datetimeinsert?: string;
  usr_id_lastupdate: number | null;
  com_datetimeupdate?: string;
}

export type CompanyCreatePayload = Omit<CompanyAPI, 'com_id' | 'com_datetimeinsert' | 'com_datetimeupdate'>;
export type CompanyUpdatePayload = Partial<CompanyCreatePayload>;

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

export const companyService = {
  async getAll(): Promise<CompanyAPI[]> {
    const res = await fetch(`${API_BASE_URL}/company`, { headers: getAuthHeaders() });
    return handleResponse<CompanyAPI[]>(res);
  },

  async getActive(): Promise<CompanyAPI[]> {
    const res = await fetch(`${API_BASE_URL}/company/active`, { headers: getAuthHeaders() });
    return handleResponse<CompanyAPI[]>(res);
  },

  async getById(id: number): Promise<CompanyAPI> {
    const res = await fetch(`${API_BASE_URL}/company/${id}`, { headers: getAuthHeaders() });
    return handleResponse<CompanyAPI>(res);
  },

  async create(data: CompanyCreatePayload): Promise<CompanyAPI> {
    const res = await fetch(`${API_BASE_URL}/company`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<CompanyAPI>(res);
  },

  async update(id: number, data: CompanyUpdatePayload): Promise<CompanyAPI> {
    const res = await fetch(`${API_BASE_URL}/company/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<CompanyAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/company/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },
};
