import { API_BASE_URL } from './authService';

export interface EmployeeAPI {
  emp_id: number;
  emp_active: number;
  emp_full_name: string;
  emp_cpf: string;
  emp_registration: string;
  emp_admission_date: string;
  rol_id: number;
  sec_id: number;
  com_id: number;
  emp_status: number;
  emp_photo: string | null;
  usr_id_insert: number | null;
  emp_datetimeinsert?: string;
  usr_id_lastupdate: number | null;
  emp_datetimeupdate?: string;
  role?: {
    rol_id: number;
    rol_description: string;
    rol_active: number;
  };
  section?: {
    sec_id: number;
    sec_description: string;
    sec_active: number;
  };
  company?: {
    com_id: number;
    com_description: string;
    com_active: number;
  };
}

export type EmployeeCreatePayload = Omit<EmployeeAPI, 'emp_id' | 'emp_datetimeinsert' | 'emp_datetimeupdate' | 'role' | 'section' | 'company'>;
export type EmployeeUpdatePayload = Partial<EmployeeCreatePayload>;

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

export const employeeService = {
  async getAll(): Promise<EmployeeAPI[]> {
    const res = await fetch(`${API_BASE_URL}/employee`, { headers: getAuthHeaders() });
    return handleResponse<EmployeeAPI[]>(res);
  },

  async getActive(): Promise<EmployeeAPI[]> {
    const res = await fetch(`${API_BASE_URL}/employee/active`, { headers: getAuthHeaders() });
    return handleResponse<EmployeeAPI[]>(res);
  },

  async getById(id: number): Promise<EmployeeAPI> {
    const res = await fetch(`${API_BASE_URL}/employee/${id}`, { headers: getAuthHeaders() });
    return handleResponse<EmployeeAPI>(res);
  },

  async create(data: EmployeeCreatePayload): Promise<EmployeeAPI> {
    const res = await fetch(`${API_BASE_URL}/employee`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<EmployeeAPI>(res);
  },

  async update(id: number, data: EmployeeUpdatePayload): Promise<EmployeeAPI> {
    const res = await fetch(`${API_BASE_URL}/employee/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<EmployeeAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/employee/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },
};
