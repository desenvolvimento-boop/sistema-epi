import { API_BASE_URL } from './authService';
import { authFetch, handleResponse } from './httpClient';
import type { CompanyIntegrationAPI } from './companyService';

export type SyncModule = 'colaboradores' | 'funcoes' | 'epis' | 'consumo' | 'unidades';

export interface SyncModuleCatalogItem {
  key: SyncModule;
  label: string;
}

export interface IntegrationSyncLogAPI {
  isl_id: number;
  com_id: number;
  isl_module: string;
  isl_status: 'SUCCESS' | 'PARTIAL' | 'ERROR' | 'SKIPPED';
  isl_started_at: string;
  isl_finished_at: string | null;
  isl_records_ok: number;
  isl_records_fail: number;
  isl_message: string | null;
}

export interface CompanyIntegrationUpdate {
  com_integration_source?: string;
  com_integration_id?: string | null;
  com_erp_base_url?: string | null;
  com_erp_client_id?: string | null;
  com_erp_client_secret?: string;
  com_sync_modules?: SyncModule[];
}

export const integrationService = {
  async getSyncModulesCatalog(): Promise<SyncModuleCatalogItem[]> {
    const res = await authFetch(`${API_BASE_URL}/company/sync-modules/catalog`);
    return handleResponse<SyncModuleCatalogItem[]>(res);
  },

  async getIntegration(comId: number): Promise<CompanyIntegrationAPI> {
    const res = await authFetch(`${API_BASE_URL}/company/${comId}/integration`);
    return handleResponse<CompanyIntegrationAPI>(res);
  },

  async updateIntegration(
    comId: number,
    data: CompanyIntegrationUpdate,
  ): Promise<CompanyIntegrationAPI> {
    const res = await authFetch(`${API_BASE_URL}/company/${comId}/integration`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return handleResponse<CompanyIntegrationAPI>(res);
  },

  async testConnection(comId: number): Promise<{ ok: boolean; message: string }> {
    const res = await authFetch(`${API_BASE_URL}/company/${comId}/integration/test`, {
      method: 'POST',
    });
    return handleResponse<{ ok: boolean; message: string }>(res);
  },

  async sync(comId: number, modules?: SyncModule[]) {
    const res = await authFetch(`${API_BASE_URL}/company/${comId}/sync`, {
      method: 'POST',
      body: JSON.stringify(modules?.length ? { modules } : {}),
    });
    return handleResponse<{ company: CompanyIntegrationAPI; logs: IntegrationSyncLogAPI[] }>(res);
  },

  async getSyncLogs(comId: number): Promise<IntegrationSyncLogAPI[]> {
    const res = await authFetch(`${API_BASE_URL}/company/${comId}/sync/logs`);
    return handleResponse<IntegrationSyncLogAPI[]>(res);
  },
};
