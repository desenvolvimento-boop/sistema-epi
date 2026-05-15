import { API_BASE_URL } from './authService';

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

export const permissionService = {
  async getByProfile(acp_id: number): Promise<PermissionAPI[]> {
    const res = await fetch(`${API_BASE_URL}/permission/profile/${acp_id}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<PermissionAPI[]>(res);
  },

  async bulkSave(acp_id: number, permissions: PermissionBulkItem[]): Promise<PermissionAPI[]> {
    const res = await fetch(`${API_BASE_URL}/permission/bulk`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ acp_id, permissions }),
    });
    return handleResponse<PermissionAPI[]>(res);
  },
};
