import { API_BASE_URL } from './authService';
import type { EpiTypeAPI } from './epiTypeService';

export type ExchangeRuleScope = 'GLOBAL' | 'COMPANY' | 'SECTION' | 'ROLE' | 'EMPLOYEE';
export type ExchangeRuleAction =
  | 'SET_DAYS'
  | 'REDUCE_DAYS'
  | 'REDUCE_PERCENT'
  | 'MIN_DAYS'
  | 'MAX_DAYS';

export interface ExchangeRuleAPI {
  exr_id: number;
  exr_active: number;
  ept_id: number | null;
  exr_scope: ExchangeRuleScope;
  exr_scope_id: number | null;
  exr_action: ExchangeRuleAction;
  exr_value: number;
  exr_priority: number;
  exr_valid_from: string | null;
  exr_valid_to: string | null;
  exr_risk_severity: string | null;
  exr_shift: 'PLANTONISTA' | 'DIARISTA' | null;
  exr_reason: string | null;
  exr_environment: string | null;
  usr_id_insert: number | null;
  usr_id_lastupdate: number | null;
  epiType?: Pick<EpiTypeAPI, 'ept_id' | 'ept_description'>;
}

export interface ExchangeRuleMatchSummary {
  exr_id: number;
  exr_scope: ExchangeRuleScope;
  exr_action: ExchangeRuleAction;
  exr_value: number;
  exr_reason: string | null;
  ept_id: number | null;
}

export interface ExchangeRuleResolveResult {
  emp_id: number;
  ept_id: number;
  epv_id: number | null;
  colaborador: string;
  epi: string;
  base_days: number;
  variant_days: number | null;
  effective_days: number;
  matching_rules?: ExchangeRuleMatchSummary[];
  applied_rules: Array<{
    exr_id: number;
    exr_scope: ExchangeRuleScope;
    exr_action: ExchangeRuleAction;
    exr_value: number;
    exr_reason: string | null;
    days_before: number;
    days_after: number;
  }>;
  rule_hint: string | null;
  explanation: string;
}

export type ExchangeRulePayload = Omit<
  ExchangeRuleAPI,
  'exr_id' | 'epiType' | 'usr_id_insert' | 'usr_id_lastupdate'
>;

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

export const exchangeRuleService = {
  async getAll(): Promise<ExchangeRuleAPI[]> {
    const res = await fetch(`${API_BASE_URL}/exchange-rule`, { headers: getAuthHeaders() });
    return handleResponse<ExchangeRuleAPI[]>(res);
  },

  async getActive(): Promise<ExchangeRuleAPI[]> {
    const res = await fetch(`${API_BASE_URL}/exchange-rule/active`, { headers: getAuthHeaders() });
    return handleResponse<ExchangeRuleAPI[]>(res);
  },

  async getById(id: number): Promise<ExchangeRuleAPI> {
    const res = await fetch(`${API_BASE_URL}/exchange-rule/${id}`, { headers: getAuthHeaders() });
    return handleResponse<ExchangeRuleAPI>(res);
  },

  async create(data: ExchangeRulePayload): Promise<ExchangeRuleAPI> {
    const res = await fetch(`${API_BASE_URL}/exchange-rule`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ExchangeRuleAPI>(res);
  },

  async update(id: number, data: Partial<ExchangeRulePayload>): Promise<ExchangeRuleAPI> {
    const res = await fetch(`${API_BASE_URL}/exchange-rule/${id}`, {
      method: 'PUT',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    return handleResponse<ExchangeRuleAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await fetch(`${API_BASE_URL}/exchange-rule/${id}`, {
      method: 'DELETE',
      headers: getAuthHeaders(),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },

  async resolve(params: {
    emp_id: number;
    ept_id: number;
    epv_id?: number;
  }): Promise<ExchangeRuleResolveResult> {
    const qs = new URLSearchParams({
      emp_id: String(params.emp_id),
      ept_id: String(params.ept_id),
    });
    if (params.epv_id) qs.set('epv_id', String(params.epv_id));
    const res = await fetch(`${API_BASE_URL}/exchange-rule/resolve?${qs}`, {
      headers: getAuthHeaders(),
    });
    return handleResponse<ExchangeRuleResolveResult>(res);
  },
};

export const EXCHANGE_SCOPE_LABELS: Record<ExchangeRuleScope, string> = {
  GLOBAL: 'Global',
  COMPANY: 'Empresa',
  SECTION: 'Setor',
  ROLE: 'Função',
  EMPLOYEE: 'Colaborador',
};

export const EXCHANGE_ACTION_LABELS: Record<ExchangeRuleAction, string> = {
  SET_DAYS: 'Definir dias',
  REDUCE_DAYS: 'Reduzir dias',
  REDUCE_PERCENT: 'Reduzir %',
  MIN_DAYS: 'Mínimo de dias',
  MAX_DAYS: 'Máximo de dias',
};
