import { API_BASE_URL } from './authService';
import type { EpiTypeAPI } from './epiTypeService';

export interface SectionAPI {
  sec_id: number;
  sec_active: number;
  sec_description: string;
  sec_integration_id: string | null;
  usr_id_insert: number | null;
  sec_datetimeinsert?: string;
  usr_id_lastupdate: number | null;
  sec_datetimeupdate?: string;
}

export type SectionCreatePayload = Omit<SectionAPI, 'sec_id' | 'sec_datetimeinsert' | 'sec_datetimeupdate'>;
export type SectionUpdatePayload = Partial<SectionCreatePayload>;

export interface SectionEpiTypeLink {
  ept_id: number;
  sle_mandatory?: number;
}

export type SectionEpiTypeWithLink = EpiTypeAPI & {
  sle_mandatory?: number;
};

export interface SectionLifespanRuleItem {
  ept_id: number;
  ept_description: string;
  ept_category: string | null;
  ept_lifespan_days: number;
  slr_lifespan_days: number | null;
  effective_lifespan_days: number;
}

export interface SectionLifespanRuleLink {
  ept_id: number;
  slr_lifespan_days: number;
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

export const sectionService = {
  async getAll(): Promise<SectionAPI[]> {
    const res = await fetch(`${API_BASE_URL}/section`, { headers: getAuthHeaders() });
    return handleResponse<SectionAPI[]>(res);
  },

  async getActive(): Promise<SectionAPI[]> {
    const res = await fetch(`${API_BASE_URL}/section/active`, { headers: getAuthHeaders() });
    return handleResponse<SectionAPI[]>(res);
  },

  async getById(id: number): Promise<SectionAPI> {
    const res = await fetch(`${API_BASE_URL}/section/${id}`, { headers: getAuthHeaders() });
    return handleResponse<SectionAPI>(res);
  },

  async create(data: SectionCreatePayload): Promise<SectionAPI> {
    const res = await fetch(`${API_BASE_URL}/section`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<SectionAPI>(res);
  },

  async update(id: number, data: SectionUpdatePayload): Promise<SectionAPI> {
    const res = await fetch(`${API_BASE_URL}/section/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<SectionAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/section/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },

  async getEpiTypes(sectionId: number): Promise<SectionEpiTypeWithLink[]> {
    const res = await fetch(`${API_BASE_URL}/section/${sectionId}/epi-types`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<SectionEpiTypeWithLink[]>(res);
  },

  async setEpiTypes(sectionId: number, items: SectionEpiTypeLink[]): Promise<SectionEpiTypeWithLink[]> {
    const res = await fetch(`${API_BASE_URL}/section/${sectionId}/epi-types`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ items }),
    });
    return handleResponse<SectionEpiTypeWithLink[]>(res);
  },

  async getLifespanRules(sectionId: number): Promise<SectionLifespanRuleItem[]> {
    const res = await fetch(`${API_BASE_URL}/section/${sectionId}/lifespan-rules`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<SectionLifespanRuleItem[]>(res);
  },

  async setLifespanRules(
    sectionId: number,
    items: SectionLifespanRuleLink[],
  ): Promise<SectionLifespanRuleItem[]> {
    const res = await fetch(`${API_BASE_URL}/section/${sectionId}/lifespan-rules`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify({ items }),
    });
    return handleResponse<SectionLifespanRuleItem[]>(res);
  },
};
