import { API_BASE_URL } from './authService';
import { authFetch, handleResponse } from './httpClient';

export type WebhookEvent = 'delivery.created' | 'delivery.expiring' | 'exchange.due';

export interface WebhookAPI {
  whk_id: number;
  whk_url: string;
  whk_events: WebhookEvent[];
  whk_active: number;
  whk_inbound_token?: string;
  whk_datetimeinsert?: string;
}

export interface WebhookCreatePayload {
  whk_url: string;
  whk_secret?: string;
  whk_events: WebhookEvent[];
  whk_active?: boolean;
}

export const webhookService = {
  async getAll(): Promise<WebhookAPI[]> {
    const res = await authFetch(`${API_BASE_URL}/webhooks`);
    return handleResponse<WebhookAPI[]>(res);
  },

  async create(data: WebhookCreatePayload) {
    const res = await authFetch(`${API_BASE_URL}/webhooks`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return handleResponse<WebhookAPI & { whk_secret_plain?: string; inboundUrl?: string }>(res);
  },

  async update(id: number, data: Partial<WebhookCreatePayload>) {
    const res = await authFetch(`${API_BASE_URL}/webhooks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return handleResponse<WebhookAPI>(res);
  },

  async delete(id: number): Promise<void> {
    const res = await authFetch(`${API_BASE_URL}/webhooks/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || `Erro ${res.status}`);
    }
  },

  async test(id: number): Promise<{ ok: boolean }> {
    const res = await authFetch(`${API_BASE_URL}/webhooks/${id}/test`, { method: 'POST' });
    return handleResponse<{ ok: boolean }>(res);
  },
};
