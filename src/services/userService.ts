import { API_BASE_URL } from './authService';

export interface UserAPI {
  usr_id: number;
  usr_active: number | null;
  usr_full_name: string | null;
  usr_username: string | null;
  usr_email: string | null;
  usr_password?: string;
  usr_agent_type: string | null;
  usr_access_profile: string | null;
  usr_phone_country_code: string | null;
  usr_phone_area_code: string | null;
  usr_phone_number: string | null;
  usr_mobile_country_code: string | null;
  usr_mobile_area_code: string | null;
  usr_mobile_number: string | null;
  usr_zip_code: string | null;
  usr_country: string | null;
  usr_state: string | null;
  usr_city: string | null;
  usr_neighborhood: string | null;
  usr_street: string | null;
  usr_street_number: string | null;
  usr_complement: string | null;
  usr_notes: string | null;
  usr_id_insert: number | null;
  usr_datetimeinsert?: string;
  usr_id_lastupdate: number | null;
  usr_datetimeupdate?: string;
  acp_id: number | null;
  agg_id: number | null;
  usr_center_access?: number | null;
  usr_perform_delivery?: number | null;
  section_ids?: number[];
  sections?: { sec_id: number; sec_description: string }[];
}

export type UserCreatePayload = Omit<UserAPI, 'usr_id' | 'usr_datetimeinsert' | 'usr_datetimeupdate'>;
export type UserUpdatePayload = Partial<UserCreatePayload>;

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

export const userService = {
  async getAll(): Promise<UserAPI[]> {
    const res = await fetch(`${API_BASE_URL}/user`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<UserAPI[]>(res);
  },

  async getById(id: number): Promise<UserAPI> {
    const res = await fetch(`${API_BASE_URL}/user/${id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<UserAPI>(res);
  },

  async create(data: UserCreatePayload): Promise<UserAPI> {
    const res = await fetch(`${API_BASE_URL}/user`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<UserAPI>(res);
  },

  async update(id: number, data: UserUpdatePayload): Promise<UserAPI> {
    const res = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<UserAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/user/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },
};
