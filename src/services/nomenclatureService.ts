import { API_BASE_URL } from './authService';
import { authFetch, handleResponse } from './httpClient';

export interface NomenclatureCatalogEntry {
  nom_key: string;
  defaultLabel: string;
  currentLabel: string;
  group: string;
  description: string | null;
  isCustomized: boolean;
}

export interface NomenclatureBulkItem {
  nom_key: string;
  nom_label: string;
}

export const nomenclatureService = {
  async getResolved(): Promise<Record<string, string>> {
    const res = await authFetch(`${API_BASE_URL}/nomenclature`);
    const data = await handleResponse<{ nomenclature: Record<string, string> }>(res);
    return data.nomenclature;
  },

  async getCatalog(): Promise<NomenclatureCatalogEntry[]> {
    const res = await authFetch(`${API_BASE_URL}/nomenclature/catalog`);
    return handleResponse<NomenclatureCatalogEntry[]>(res);
  },

  async bulkSave(entries: NomenclatureBulkItem[]): Promise<Record<string, string>> {
    const res = await authFetch(`${API_BASE_URL}/nomenclature/bulk`, {
      method: 'PUT',
      body: JSON.stringify({ entries }),
    });
    const data = await handleResponse<{ nomenclature: Record<string, string> }>(res);
    return data.nomenclature;
  },

  async restoreKey(nom_key: string): Promise<Record<string, string>> {
    const res = await authFetch(`${API_BASE_URL}/nomenclature/${encodeURIComponent(nom_key)}`, {
      method: 'DELETE',
    });
    const data = await handleResponse<{ nomenclature: Record<string, string> }>(res);
    return data.nomenclature;
  },
};
