import { API_BASE_URL, authFetch, getAuthHeaders, handleResponse } from './httpClient';

export interface PermissionAPI {
  prm_id: number;
  acp_id: number;
  fea_id: number;
  prm_create: number;
  prm_view: number;
  prm_edit: number;
  prm_delete: number;
}

export interface PermissionBulkItem {
  fea_id: number;
  prm_create: number;
  prm_view: number;
  prm_edit: number;
  prm_delete: number;
}

export const permissionService = {
  async getByProfile(acp_id: number): Promise<PermissionAPI[]> {
    const res = await authFetch(`${API_BASE_URL}/permission/profile/${acp_id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<PermissionAPI[]>(res);
  },

  async bulkSave(acp_id: number, permissions: PermissionBulkItem[]): Promise<PermissionAPI[]> {
    const res = await authFetch(`${API_BASE_URL}/permission/bulk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ acp_id, permissions }),
    });
    return handleResponse<PermissionAPI[]>(res);
  },
};
