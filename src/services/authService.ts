const API_BASE_URL = 'http://192.168.15.3:3001';

export interface AuthPermission {
  prm_id: number;
  acp_id: number;
  fea_id: number;
  prm_create: number;
  prm_view: number;
  prm_edit: number;
  prm_delete: number;
  fea_description: string | null;
  fea_path: string | null;
  fea_alternativeidentifier: string | null;
}

export interface AuthUser {
  usr_id: number;
  usr_full_name: string;
  usr_username: string;
  usr_email: string;
  usr_access_profile: string;
  usr_agent_type: string;
  usr_active: number;
  acp_id: number | null;
  agg_id: number | null;
}

export interface AuthMeResponse extends AuthUser {
  permissions: AuthPermission[];
}

export interface LoginResponse {
  token: string;
  user: AuthUser;
  permissions: AuthPermission[];
}

export const authService = {
  async login(username: string, password: string): Promise<LoginResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ usr_username: username, usr_password: password }),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Erro ao realizar login.');
    }

    return res.json();
  },

  async me(token: string): Promise<AuthMeResponse> {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      throw new Error(body.error || 'Sessão inválida.');
    }

    return res.json();
  },

  saveSession(token: string, user: AuthUser, permissions: AuthPermission[]): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    localStorage.setItem('permissions', JSON.stringify(permissions));
  },

  clearSession(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('permissions');
  },

  getToken(): string | null {
    return localStorage.getItem('token');
  },

  getSavedUser(): AuthUser | null {
    try {
      const data = localStorage.getItem('user');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  },

  getSavedPermissions(): AuthPermission[] {
    try {
      const data = localStorage.getItem('permissions');
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
};
