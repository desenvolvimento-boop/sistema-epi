import { API_BASE_URL } from './authService';
import { authFetch, handleResponse } from './httpClient';
import type { EntitySyncConfigAPI, EntityType, SyncInterval } from './dataSourceService';

export interface EntityDashboardCard {
  entityType: EntityType;
  entityTypeLabel: string;
  supported?: boolean;
  primary: EntitySyncConfigAPI | null;
  availableSources: EntitySyncConfigAPI[];
}

export interface IntegrationSyncLogAPI {
  isl_id: number;
  dso_id: number | null;
  des_entity_type: EntityType | null;
  isl_module: string;
  isl_status: 'SUCCESS' | 'PARTIAL' | 'ERROR' | 'SKIPPED';
  isl_started_at: string;
  isl_finished_at: string | null;
  isl_records_ok: number;
  isl_records_fail: number;
  isl_message: string | null;
  rmDebug?: RmRestDebugAPI | null;
}

export interface RmRestDebugAPI {
  apiMode?: string;
  dataServer?: string;
  filter?: string;
  coligada?: number;
  codSistema?: string;
  rawTotal?: number;
  rawSample?: Record<string, unknown>[];
  fieldNames?: string[];
  rmRest?: {
    dataServer?: string;
    filter?: string;
    totalRows?: number;
    fieldNames?: string[];
    normalizedSample?: Record<string, unknown>[];
    requests?: Array<{
      url?: string;
      method?: string;
      context?: string;
      status?: number;
      statusText?: string;
      rawTextLength?: number;
      rawBody?: unknown;
      pageStart?: number;
      pageLimit?: number;
    }>;
  };
}

export interface EntitySyncResult {
  config: EntitySyncConfigAPI;
  staging: { updated: number; recordCount: number; totalFetched: number };
  promotion: { ok: number; fail: number; message?: string | null; deactivated?: number };
  debug?: { rmRest?: RmRestDebugAPI };
}

export class IntegrationSyncError extends Error {
  result?: EntitySyncResult;
  statusCode?: number;
  code?: string | null;

  constructor(message: string, result?: EntitySyncResult, statusCode?: number, code?: string | null) {
    super(message);
    this.name = 'IntegrationSyncError';
    this.result = result;
    this.statusCode = statusCode;
    this.code = code;
  }
}

export function formatSyncSummary(result: EntitySyncResult): string {
  const { staging, promotion, config } = result;
  const parts = [
    `${staging.totalFetched} lido(s) do ERP`,
    `${staging.updated} alterado(s) na staging`,
    `${staging.recordCount} total na staging`,
    `${promotion.ok} promovido(s)`,
  ];
  if (promotion.fail > 0) parts.push(`${promotion.fail} falha(s) na promoção`);
  if (promotion.deactivated && promotion.deactivated > 0) {
    parts.push(`${promotion.deactivated} inativado(s) por ausência na sync`);
  }
  if (config.des_last_sync_status === 'PARTIAL') parts.push('concluído com ressalvas');
  return parts.join(' · ');
}

export const integrationEntityService = {
  async getDashboard(): Promise<EntityDashboardCard[]> {
    const res = await authFetch(`${API_BASE_URL}/integration/entity-sync/dashboard`);
    return handleResponse<EntityDashboardCard[]>(res);
  },

  async setPrimary(entityType: EntityType, desId: number): Promise<EntitySyncConfigAPI> {
    const res = await authFetch(`${API_BASE_URL}/integration/entity-sync/${entityType}/primary`, {
      method: 'PUT',
      body: JSON.stringify({ desId }),
    });
    return handleResponse<EntitySyncConfigAPI>(res);
  },

  async configureEntity(
    entityType: EntityType,
    payload: { dsoId: number; des_sync_interval: SyncInterval },
  ): Promise<EntitySyncConfigAPI> {
    const res = await authFetch(`${API_BASE_URL}/integration/entity-sync/${entityType}/config`, {
      method: 'PUT',
      body: JSON.stringify(payload),
    });
    return handleResponse<EntitySyncConfigAPI>(res);
  },

  async sync(entityType: EntityType, options?: { force?: boolean }): Promise<EntitySyncResult> {
    const res = await authFetch(`${API_BASE_URL}/integration/entity-sync/${entityType}/sync`, {
      method: 'POST',
      body: JSON.stringify({ force: options?.force === true }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({})) as {
        error?: string;
        message?: string;
        result?: EntitySyncResult;
        code?: string | null;
      };
      throw new IntegrationSyncError(
        body.error || body.message || `Erro ${res.status}`,
        body.result,
        res.status,
        body.code,
      );
    }
    return res.json();
  },

  async getLogs(entityType: EntityType): Promise<IntegrationSyncLogAPI[]> {
    const res = await authFetch(`${API_BASE_URL}/integration/entity-sync/${entityType}/logs`);
    return handleResponse<IntegrationSyncLogAPI[]>(res);
  },
};
