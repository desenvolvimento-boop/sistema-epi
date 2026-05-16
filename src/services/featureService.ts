import { API_BASE_URL, authFetch, getAuthHeaders, handleResponse } from './httpClient';

export interface FeatureAPI {
  fea_id: number;
  fea_description: string;
  fea_alternativeidentifier: string | null;
  fea_path: string | null;
}

export const featureService = {
  async getAll(): Promise<FeatureAPI[]> {
    const res = await authFetch(`${API_BASE_URL}/feature`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<FeatureAPI[]>(res);
  },

  async getById(id: number): Promise<FeatureAPI> {
    const res = await authFetch(`${API_BASE_URL}/feature/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<FeatureAPI>(res);
  },

  async create(data: Omit<FeatureAPI, 'fea_id'>): Promise<FeatureAPI> {
    const res = await authFetch(`${API_BASE_URL}/feature`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<FeatureAPI>(res);
  },

  async update(id: number, data: Partial<Omit<FeatureAPI, 'fea_id'>>): Promise<FeatureAPI> {
    const res = await authFetch(`${API_BASE_URL}/feature/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<FeatureAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await authFetch(`${API_BASE_URL}/feature/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },
};
