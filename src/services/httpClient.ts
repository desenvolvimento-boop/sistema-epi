export { API_BASE_URL } from './authService';

export class PermissionDeniedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PermissionDeniedError';
  }
}

export function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

export async function authFetch(input: RequestInfo | URL, init?: RequestInit): Promise<Response> {
  const headers = {
    ...getAuthHeaders(),
    ...(init?.headers as Record<string, string> | undefined),
  };

  const response = await fetch(input, { ...init, headers });

  if (response.status === 403) {
    const body = await response.clone().json().catch(() => ({}));
    throw new PermissionDeniedError(
      body.error || 'Sem permissão para acessar este recurso.'
    );
  }

  return response;
}

export async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || body.message || `Erro ${response.status}`);
  }
  return response.json();
}
