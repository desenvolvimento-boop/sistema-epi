import { API_BASE_URL } from './authService';

export interface AccessProfileAPI {
  acp_id: number;
  acp_active: number | null;
  acp_description: string | null;
  acp_integrationid: string | null;
  acp_standard: number | null;
}

export type AccessProfileCreatePayload = Omit<AccessProfileAPI, 'acp_id'>;
export type AccessProfileUpdatePayload = Partial<AccessProfileCreatePayload>;

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

export const accessProfileService = {
  async getAll(): Promise<AccessProfileAPI[]> {
    const res = await fetch(`${API_BASE_URL}/access-profile`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<AccessProfileAPI[]>(res);
  },

  async getActive(): Promise<AccessProfileAPI[]> {
    const res = await fetch(`${API_BASE_URL}/access-profile/active`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<AccessProfileAPI[]>(res);
  },

  async getById(id: number): Promise<AccessProfileAPI & { permissions?: any[] }> {
    const res = await fetch(`${API_BASE_URL}/access-profile/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<AccessProfileAPI & { permissions?: any[] }>(res);
  },

  async create(data: AccessProfileCreatePayload): Promise<AccessProfileAPI> {
    const res = await fetch(`${API_BASE_URL}/access-profile`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<AccessProfileAPI>(res);
  },

  async update(id: number, data: AccessProfileUpdatePayload): Promise<AccessProfileAPI> {
    const res = await fetch(`${API_BASE_URL}/access-profile/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<AccessProfileAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/access-profile/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },
};
