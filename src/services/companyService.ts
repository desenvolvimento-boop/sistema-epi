import { API_BASE_URL } from './authService';
import { authFetch, handleResponse } from './httpClient';
import type { SyncModule } from './integrationService';

export interface CompanyAPI {
  com_id: number;
  com_active: number;
  com_description: string;
  com_integration_id: string | null;
  com_integration_source?: string | null;
  com_connection_status?: string;
  com_last_sync_at?: string | null;
  com_sync_modules?: SyncModule[];
  com_erp_base_url?: string | null;
  com_erp_client_id?: string | null;
  usr_id_insert: number | null;
  com_datetimeinsert?: string;
  usr_id_lastupdate: number | null;
  com_datetimeupdate?: string;
}

export interface CompanyIntegrationAPI extends CompanyAPI {
  syncModuleLabels?: string[];
  statusLabel?: string;
  connectionStatusLabel?: string;
  hasErpCredentials?: boolean;
  erpConfigured?: boolean;
}

export type CompanyCreatePayload = Omit<CompanyAPI, 'com_id' | 'com_datetimeinsert' | 'com_datetimeupdate'>;
export type CompanyUpdatePayload = Partial<CompanyCreatePayload>;

export const companyService = {
  async getAll(): Promise<CompanyIntegrationAPI[]> {
    const res = await authFetch(`${API_BASE_URL}/company`);
    return handleResponse<CompanyIntegrationAPI[]>(res);
  },

  async getActive(): Promise<CompanyIntegrationAPI[]> {
    const res = await authFetch(`${API_BASE_URL}/company/active`);
    return handleResponse<CompanyIntegrationAPI[]>(res);
  },

  async getById(id: number): Promise<CompanyIntegrationAPI> {
    const res = await authFetch(`${API_BASE_URL}/company/${id}`);
    return handleResponse<CompanyIntegrationAPI>(res);
  },

  async create(data: CompanyCreatePayload): Promise<CompanyIntegrationAPI> {
    const res = await authFetch(`${API_BASE_URL}/company`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return handleResponse<CompanyIntegrationAPI>(res);
  },

  async update(id: number, data: CompanyUpdatePayload): Promise<CompanyIntegrationAPI> {
    const res = await authFetch(`${API_BASE_URL}/company/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return handleResponse<CompanyIntegrationAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await authFetch(`${API_BASE_URL}/company/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },
};
