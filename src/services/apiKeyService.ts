import { API_BASE_URL } from './authService';
import { authFetch, handleResponse } from './httpClient';

export interface ApiKeyAPI {
  apk_id: number;
  apk_name: string;
  apk_key_prefix: string;
  apk_active: number;
  apk_last_used_at: string | null;
  apk_datetimeinsert?: string;
}

export const apiKeyService = {
  async getAll(): Promise<ApiKeyAPI[]> {
    const res = await authFetch(`${API_BASE_URL}/api-keys`);
    return handleResponse<ApiKeyAPI[]>(res);
  },

  async create(name: string) {
    const res = await authFetch(`${API_BASE_URL}/api-keys`, {
      method: 'POST',
      body: JSON.stringify({ apk_name: name, name }),
    });
    return handleResponse<ApiKeyAPI & { apiKey: string }>(res);
  },

  async update(id: number, data: { apk_name?: string; apk_active?: boolean }) {
    const res = await authFetch(`${API_BASE_URL}/api-keys/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
    return handleResponse<ApiKeyAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await authFetch(`${API_BASE_URL}/api-keys/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },
};
