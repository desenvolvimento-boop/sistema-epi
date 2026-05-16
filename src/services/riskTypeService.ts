import { API_BASE_URL } from './authService';

export interface RiskTypeAPI {
  rty_id: number;
  rty_active: number;
  rty_description: string;
  rty_code: string | null;
  rty_integration_id: string | null;
  rty_integration_source: string | null;
  usr_id_insert: number | null;
  rty_datetimeinsert?: string;
  usr_id_lastupdate: number | null;
  rty_datetimeupdate?: string;
}

export type RiskTypeCreatePayload = Omit<RiskTypeAPI, 'rty_id' | 'rty_datetimeinsert' | 'rty_datetimeupdate'>;
export type RiskTypeUpdatePayload = Partial<RiskTypeCreatePayload>;

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

export const riskTypeService = {
  async getAll(): Promise<RiskTypeAPI[]> {
    const res = await fetch(`${API_BASE_URL}/risk-type`, { headers: getAuthHeaders() });
    return handleResponse<RiskTypeAPI[]>(res);
  },

  async getActive(): Promise<RiskTypeAPI[]> {
    const res = await fetch(`${API_BASE_URL}/risk-type/active`, { headers: getAuthHeaders() });
    return handleResponse<RiskTypeAPI[]>(res);
  },

  async getById(id: number): Promise<RiskTypeAPI> {
    const res = await fetch(`${API_BASE_URL}/risk-type/${id}`, { headers: getAuthHeaders() });
    return handleResponse<RiskTypeAPI>(res);
  },

  async create(data: RiskTypeCreatePayload): Promise<RiskTypeAPI> {
    const res = await fetch(`${API_BASE_URL}/risk-type`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...data,
        rty_integration_source: data.rty_integration_source || 'Manual',
      }),
    });
    return handleResponse<RiskTypeAPI>(res);
  },

  async update(id: number, data: RiskTypeUpdatePayload): Promise<RiskTypeAPI> {
    const res = await fetch(`${API_BASE_URL}/risk-type/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<RiskTypeAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/risk-type/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },
};
