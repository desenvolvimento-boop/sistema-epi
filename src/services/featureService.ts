const API_BASE_URL = 'http://172.20.10.8:3001';

export interface FeatureAPI {
  fea_id: number;
  fea_description: string;
  fea_alternativeidentifier: string | null;
  fea_path: string | null;
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

export const featureService = {
  async getAll(): Promise<FeatureAPI[]> {
    const res = await fetch(`${API_BASE_URL}/feature`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<FeatureAPI[]>(res);
  },

  async getById(id: number): Promise<FeatureAPI> {
    const res = await fetch(`${API_BASE_URL}/feature/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<FeatureAPI>(res);
  },

  async create(data: Omit<FeatureAPI, 'fea_id'>): Promise<FeatureAPI> {
    const res = await fetch(`${API_BASE_URL}/feature`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<FeatureAPI>(res);
  },

  async update(id: number, data: Partial<Omit<FeatureAPI, 'fea_id'>>): Promise<FeatureAPI> {
    const res = await fetch(`${API_BASE_URL}/feature/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<FeatureAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/feature/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },
};
