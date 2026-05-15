import { API_BASE_URL } from './authService';

export interface SectionAPI {
  sec_id: number;
  sec_active: number;
  sec_description: string;
  sec_integration_id: string | null;
  usr_id_insert: number | null;
  sec_datetimeinsert?: string;
  usr_id_lastupdate: number | null;
  sec_datetimeupdate?: string;
}

export type SectionCreatePayload = Omit<SectionAPI, 'sec_id' | 'sec_datetimeinsert' | 'sec_datetimeupdate'>;
export type SectionUpdatePayload = Partial<SectionCreatePayload>;

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

export const sectionService = {
  async getAll(): Promise<SectionAPI[]> {
    const res = await fetch(`${API_BASE_URL}/section`, { headers: getAuthHeaders() });
    return handleResponse<SectionAPI[]>(res);
  },

  async getActive(): Promise<SectionAPI[]> {
    const res = await fetch(`${API_BASE_URL}/section/active`, { headers: getAuthHeaders() });
    return handleResponse<SectionAPI[]>(res);
  },

  async getById(id: number): Promise<SectionAPI> {
    const res = await fetch(`${API_BASE_URL}/section/${id}`, { headers: getAuthHeaders() });
    return handleResponse<SectionAPI>(res);
  },

  async create(data: SectionCreatePayload): Promise<SectionAPI> {
    const res = await fetch(`${API_BASE_URL}/section`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<SectionAPI>(res);
  },

  async update(id: number, data: SectionUpdatePayload): Promise<SectionAPI> {
    const res = await fetch(`${API_BASE_URL}/section/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<SectionAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/section/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },
};
