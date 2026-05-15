import { API_BASE_URL } from './authService';

export interface RoleAPI {
  rol_id: number;
  rol_active: number;
  rol_description: string;
  rol_integration_id: string | null;
  usr_id_insert: number | null;
  rol_datetimeinsert?: string;
  usr_id_lastupdate: number | null;
  rol_datetimeupdate?: string;
}

export type RoleCreatePayload = Omit<RoleAPI, 'rol_id' | 'rol_datetimeinsert' | 'rol_datetimeupdate'>;
export type RoleUpdatePayload = Partial<RoleCreatePayload>;

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

export const roleService = {
  async getAll(): Promise<RoleAPI[]> {
    const res = await fetch(`${API_BASE_URL}/role`, { headers: getAuthHeaders() });
    return handleResponse<RoleAPI[]>(res);
  },

  async getActive(): Promise<RoleAPI[]> {
    const res = await fetch(`${API_BASE_URL}/role/active`, { headers: getAuthHeaders() });
    return handleResponse<RoleAPI[]>(res);
  },

  async getById(id: number): Promise<RoleAPI> {
    const res = await fetch(`${API_BASE_URL}/role/${id}`, { headers: getAuthHeaders() });
    return handleResponse<RoleAPI>(res);
  },

  async create(data: RoleCreatePayload): Promise<RoleAPI> {
    const res = await fetch(`${API_BASE_URL}/role`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<RoleAPI>(res);
  },

  async update(id: number, data: RoleUpdatePayload): Promise<RoleAPI> {
    const res = await fetch(`${API_BASE_URL}/role/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<RoleAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/role/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },
};
