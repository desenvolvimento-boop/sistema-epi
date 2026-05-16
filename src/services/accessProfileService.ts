import { API_BASE_URL, authFetch, getAuthHeaders, handleResponse } from './httpClient';

export interface AccessProfileAPI {
  acp_id: number;
  acp_active: number | null;
  acp_description: string | null;
  acp_integrationid: string | null;
  acp_standard: number | null;
}

export type AccessProfileCreatePayload = Omit<AccessProfileAPI, 'acp_id'>;
export type AccessProfileUpdatePayload = Partial<AccessProfileCreatePayload>;

export const accessProfileService = {
  async getAll(): Promise<AccessProfileAPI[]> {
    const res = await authFetch(`${API_BASE_URL}/access-profile`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<AccessProfileAPI[]>(res);
  },

  async getActive(): Promise<AccessProfileAPI[]> {
    const res = await authFetch(`${API_BASE_URL}/access-profile/active`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<AccessProfileAPI[]>(res);
  },

  async getById(id: number): Promise<AccessProfileAPI & { permissions?: unknown[] }> {
    const res = await authFetch(`${API_BASE_URL}/access-profile/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<AccessProfileAPI & { permissions?: unknown[] }>(res);
  },

  async create(data: AccessProfileCreatePayload): Promise<AccessProfileAPI> {
    const res = await authFetch(`${API_BASE_URL}/access-profile`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<AccessProfileAPI>(res);
  },

  async update(id: number, data: AccessProfileUpdatePayload): Promise<AccessProfileAPI> {
    const res = await authFetch(`${API_BASE_URL}/access-profile/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<AccessProfileAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await authFetch(`${API_BASE_URL}/access-profile/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },
};
