import { API_BASE_URL } from './authService';
import { authFetch, handleResponse } from './httpClient';

export interface EmployerAPI {
  emr_id: number;
  emr_active: number;
  emr_name: string;
  emr_trade_name: string | null;
  emr_tax_id: string | null;
  usr_id_insert: number | null;
  emr_created_at?: string;
  usr_id_lastupdate: number | null;
  emr_updated_at?: string;
  /** Aliases for legacy UI */
  com_id: number;
  com_description: string;
  com_active: number;
  epr_id?: number;
  epr_description?: string;
  epr_fantasyname?: string | null;
  epr_active?: number;
}

export type EmployerCreatePayload = {
  emr_active?: number;
  emr_name?: string;
  emr_trade_name?: string | null;
  emr_tax_id?: string | null;
  com_description?: string;
  com_active?: number;
  epr_description?: string;
  epr_fantasyname?: string | null;
};

export type EmployerUpdatePayload = Partial<EmployerCreatePayload>;

export const employerService = {
  async getAll(): Promise<EmployerAPI[]> {
    const res = await authFetch(`${API_BASE_URL}/employer`);
    return handleResponse<EmployerAPI[]>(res);
  },

  async getActive(): Promise<EmployerAPI[]> {
    const res = await authFetch(`${API_BASE_URL}/employer/active`);
    return handleResponse<EmployerAPI[]>(res);
  },

  async getById(id: number): Promise<EmployerAPI> {
    const res = await authFetch(`${API_BASE_URL}/employer/${id}`);
    return handleResponse<EmployerAPI>(res);
  },

  async create(data: EmployerCreatePayload): Promise<EmployerAPI> {
    const res = await authFetch(`${API_BASE_URL}/employer`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return handleResponse<EmployerAPI>(res);
  },

  async update(id: number, data: EmployerUpdatePayload): Promise<EmployerAPI> {
    const res = await authFetch(`${API_BASE_URL}/employer/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return handleResponse<EmployerAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await authFetch(`${API_BASE_URL}/employer/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },
};

/** @deprecated use employerService */
export const empresaService = employerService;
export type EmpresaAPI = EmployerAPI;
