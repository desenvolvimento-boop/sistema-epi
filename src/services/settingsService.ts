import { API_BASE_URL } from './authService';
import { authFetch, handleResponse } from './httpClient';

export type DataSource = 'MANUAL' | 'INTEGRACAO';

export interface SystemSettings {
  dataSource: DataSource;
  hasErpCompany: boolean;
  updatedAt?: string;
}

export const settingsService = {
  async get(): Promise<SystemSettings> {
    const res = await authFetch(`${API_BASE_URL}/settings`);
    return handleResponse<SystemSettings>(res);
  },

  async updateDataSource(dataSource: DataSource): Promise<SystemSettings> {
    const res = await authFetch(`${API_BASE_URL}/settings/data-source`, {
      method: 'PUT',
      body: JSON.stringify({ dataSource }),
    });
    return handleResponse<SystemSettings>(res);
  },
};
