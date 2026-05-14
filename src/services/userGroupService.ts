const API_BASE_URL = 'http://172.20.10.8:3001';

export interface UserGroupAPI {
  usg_id: number;
  usg_active: number | null;
  usg_description: string | null;
  usg_integrationid: string | null;
}

export type UserGroupCreatePayload = Omit<UserGroupAPI, 'usg_id'>;
export type UserGroupUpdatePayload = Partial<UserGroupCreatePayload>;

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

export const userGroupService = {
  async getAll(): Promise<UserGroupAPI[]> {
    const res = await fetch(`${API_BASE_URL}/user-group`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<UserGroupAPI[]>(res);
  },

  async getActive(): Promise<UserGroupAPI[]> {
    const res = await fetch(`${API_BASE_URL}/user-group/active`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<UserGroupAPI[]>(res);
  },

  async getById(id: number): Promise<UserGroupAPI> {
    const res = await fetch(`${API_BASE_URL}/user-group/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<UserGroupAPI>(res);
  },

  async create(data: UserGroupCreatePayload): Promise<UserGroupAPI> {
    const res = await fetch(`${API_BASE_URL}/user-group`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<UserGroupAPI>(res);
  },

  async update(id: number, data: UserGroupUpdatePayload): Promise<UserGroupAPI> {
    const res = await fetch(`${API_BASE_URL}/user-group/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<UserGroupAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/user-group/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },
};
