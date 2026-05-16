import { API_BASE_URL } from './authService';
import type { EpiAPI } from './epiService';

export interface RoleAPI {
  rol_id: number;
  rol_active: number;
  rol_description: string;
  rol_activities: string | null;
  rol_code: string | null;
  rol_integration_id: string | null;
  rol_integration_source: string | null;
  rol_cbo: string | null;
  usr_id_insert: number | null;
  rol_datetimeinsert?: string;
  usr_id_lastupdate: number | null;
  rol_datetimeupdate?: string;
  epi_count?: number;
  employee_count?: number;
}

export interface RoleEpiLink {
  epi_id: number;
  rle_mandatory?: number;
}

export interface RoleRiskAPI {
  rsk_id: number;
  rol_id: number;
  rsk_active: number;
  rsk_type: string;
  rsk_agent: string;
  rsk_severity: string;
  rsk_pgr_reference: string | null;
  rsk_integration_id: string | null;
  rsk_integration_source: string | null;
  rsk_external_code: string | null;
  rsk_integration_sync_at: string | null;
  rsk_datetimeinsert?: string;
  rsk_datetimeupdate?: string;
}

export interface RoleMatrixResponse {
  roles: RoleAPI[];
  epis: EpiAPI[];
  matrix: { rol_id: number; epi_id: number; rle_mandatory: number }[];
}

export type RoleCreatePayload = Omit<RoleAPI, 'rol_id' | 'rol_datetimeinsert' | 'rol_datetimeupdate' | 'epi_count' | 'employee_count'>;
export type RoleUpdatePayload = Partial<RoleCreatePayload>;

export const RISK_TYPES = ['Físico', 'Químico', 'Ergonômico', 'Biológico', 'Mecânico', 'Acidentes'] as const;
export const RISK_SEVERITIES = ['Baixa', 'Média', 'Alta'] as const;

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

export const roleService = {
  async getAll(): Promise<RoleAPI[]> {
    const res = await fetch(`${API_BASE_URL}/role`, { headers: getAuthHeaders() });
    return handleResponse<RoleAPI[]>(res);
  },

  async getActive(): Promise<RoleAPI[]> {
    const res = await fetch(`${API_BASE_URL}/role/active`, { headers: getAuthHeaders() });
    return handleResponse<RoleAPI[]>(res);
  },

  async getMatrix(): Promise<RoleMatrixResponse> {
    const res = await fetch(`${API_BASE_URL}/role/matrix`, { headers: getAuthHeaders() });
    return handleResponse<RoleMatrixResponse>(res);
  },

  async getById(id: number, includeRelations = false): Promise<RoleAPI & { epis?: EpiAPI[]; risks?: RoleRiskAPI[] }> {
    const qs = includeRelations ? '?include=relations' : '';
    const res = await fetch(`${API_BASE_URL}/role/${id}${qs}`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async create(data: RoleCreatePayload): Promise<RoleAPI> {
    const res = await fetch(`${API_BASE_URL}/role`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        ...data,
        rol_integration_source: data.rol_integration_source || 'Manual',
      }),
    });
    return handleResponse<RoleAPI>(res);
  },

  async update(id: number, data: RoleUpdatePayload): Promise<RoleAPI> {
    const res = await fetch(`${API_BASE_URL}/role/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<RoleAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/role/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },

  async getEpis(roleId: number): Promise<(EpiAPI & { rle_mandatory?: number })[]> {
    const res = await fetch(`${API_BASE_URL}/role/${roleId}/epis`, { headers: getAuthHeaders() });
    return handleResponse(res);
  },

  async setEpis(roleId: number, items: RoleEpiLink[]): Promise<(EpiAPI & { rle_mandatory?: number })[]> {
    const res = await fetch(`${API_BASE_URL}/role/${roleId}/epis`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ items }),
    });
    return handleResponse(res);
  },

  async getRisks(roleId: number): Promise<RoleRiskAPI[]> {
    const res = await fetch(`${API_BASE_URL}/role/${roleId}/risks`, { headers: getAuthHeaders() });
    return handleResponse<RoleRiskAPI[]>(res);
  },

  async createRisk(roleId: number, data: Omit<RoleRiskAPI, 'rsk_id' | 'rol_id' | 'rsk_datetimeinsert' | 'rsk_datetimeupdate'>): Promise<RoleRiskAPI> {
    const res = await fetch(`${API_BASE_URL}/role/${roleId}/risks`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<RoleRiskAPI>(res);
  },

  async updateRisk(roleId: number, rskId: number, data: Partial<RoleRiskAPI>): Promise<RoleRiskAPI> {
    const res = await fetch(`${API_BASE_URL}/role/${roleId}/risks/${rskId}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<RoleRiskAPI>(res);
  },

  async deleteRisk(roleId: number, rskId: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/role/${roleId}/risks/${rskId}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },
};
