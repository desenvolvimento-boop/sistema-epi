import { API_BASE_URL } from './authService';
import { authFetch, handleResponse } from './httpClient';

export type DataSourceType = 'TOTVS_RM' | 'PROTHEUS';
export type RmApiMode = 'REST' | 'SOAP';
export type RmSystemCode = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'P' | 'T' | 'V' | 'W' | 'X';
export type EntityType = 'EMPLOYEE' | 'SECTION' | 'ROLE' | 'EPI';
export type SyncInterval = '1H' | '6H' | '1D';

export interface EntitySyncConfigAPI {
  des_id: number;
  dso_id: number;
  des_entity_type: EntityType;
  des_entity_type_label?: string;
  des_sync_interval: SyncInterval;
  des_sync_interval_label?: string;
  des_enabled: number;
  des_is_primary: number;
  des_last_sync_at: string | null;
  des_next_sync_at: string | null;
  des_record_count: number;
  des_last_updated_count: number;
  des_last_sync_status: string;
  des_last_sync_message: string | null;
  dataSource?: {
    dso_id: number;
    dso_name: string;
    dso_type: string;
  };
}

export interface DataSourceAPI {
  dso_id: number;
  dso_name: string;
  dso_type: DataSourceType;
  dso_type_label?: string;
  dso_base_url: string | null;
  dso_rm_host: string | null;
  dso_rm_port: number;
  dso_rm_coligada: number;
  dso_rm_cod_sistema: RmSystemCode | string;
  dso_rm_ws_path: string;
  dso_rm_api_mode: RmApiMode;
  dso_rm_api_mode_label?: string;
  dso_rm_rest_path: string;
  dso_client_id: string | null;
  dso_client_secret?: string;
  dso_connection_status: string;
  dso_active: number;
  dso_created_at?: string;
  dso_updated_at?: string;
  entitySyncs?: EntitySyncConfigAPI[];
}

export interface DataSourceCreatePayload {
  dso_name: string;
  dso_type: DataSourceType;
  dso_base_url?: string | null;
  dso_rm_host?: string | null;
  dso_rm_port?: number;
  dso_rm_coligada?: number;
  dso_rm_cod_sistema?: RmSystemCode | string;
  dso_rm_ws_path?: string;
  dso_rm_api_mode?: RmApiMode;
  dso_rm_rest_path?: string;
  dso_client_id?: string | null;
  dso_client_secret?: string;
  entitySyncs?: Array<{
    des_entity_type: EntityType;
    des_sync_interval: SyncInterval;
    des_enabled?: boolean | number;
    des_is_primary?: boolean | number;
  }>;
}

export interface IntegrationCatalog {
  entityTypes: Array<{ key: EntityType; label: string }>;
  entityTypesBySource?: Record<DataSourceType, Array<{ key: EntityType; label: string }>>;
  disabledEntitiesBySource?: Partial<Record<DataSourceType, EntityType[]>>;
  rmApiModes?: Array<{ key: RmApiMode; label: string }>;
  rmSystemCodes?: Array<{ key: RmSystemCode; label: string }>;
  syncIntervals: Array<{ key: SyncInterval; label: string }>;
  dataSourceTypes: Array<{ key: DataSourceType; label: string }>;
}

export const dataSourceService = {
  async getCatalog(): Promise<IntegrationCatalog> {
    const res = await authFetch(`${API_BASE_URL}/data-sources/catalog`);
    return handleResponse<IntegrationCatalog>(res);
  },

  async getAll(): Promise<DataSourceAPI[]> {
    const res = await authFetch(`${API_BASE_URL}/data-sources`);
    return handleResponse<DataSourceAPI[]>(res);
  },

  async getById(id: number): Promise<DataSourceAPI> {
    const res = await authFetch(`${API_BASE_URL}/data-sources/${id}`);
    return handleResponse<DataSourceAPI>(res);
  },

  async create(data: DataSourceCreatePayload): Promise<DataSourceAPI> {
    const res = await authFetch(`${API_BASE_URL}/data-sources`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return handleResponse<DataSourceAPI>(res);
  },

  async update(id: number, data: Partial<DataSourceCreatePayload>): Promise<DataSourceAPI> {
    const res = await authFetch(`${API_BASE_URL}/data-sources/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return handleResponse<DataSourceAPI>(res);
  },

  async remove(id: number): Promise<{ message: string }> {
    const res = await authFetch(`${API_BASE_URL}/data-sources/${id}`, {
      method: 'DELETE',
    });
    return handleResponse<{ message: string }>(res);
  },

  async testConnection(id: number): Promise<{ ok: boolean; message: string }> {
    const res = await authFetch(`${API_BASE_URL}/data-sources/${id}/test`, {
      method: 'POST',
    });
    return handleResponse<{ ok: boolean; message: string }>(res);
  },

  async saveEntitySyncs(id: number, entitySyncs: DataSourceCreatePayload['entitySyncs']) {
    const res = await authFetch(`${API_BASE_URL}/data-sources/${id}/entity-sync`, {
      method: 'PUT',
      body: JSON.stringify({ entitySyncs }),
    });
    return handleResponse<EntitySyncConfigAPI[]>(res);
  },
};
