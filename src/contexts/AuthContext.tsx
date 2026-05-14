import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, AuthUser, AuthPermission } from '../services/authService';
import { permissionService } from '../services/permissionService';
import { featureService } from '../services/featureService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  permissions: AuthPermission[];
  loading: boolean;
  login: (usuario: string, senha: string) => Promise<string | null>;
  logout: () => void;
  hasPermission: (feaId: number, action: 'prm_create' | 'prm_view' | 'prm_edit' | 'prm_delete') => boolean;
  canView: (path: string) => boolean;
  canCreate: (path: string) => boolean;
  canEdit: (path: string) => boolean;
  canDelete: (path: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function fetchUserPermissions(acpId: number): Promise<AuthPermission[]> {
  try {
    const [rawPerms, features] = await Promise.all([
      permissionService.getByProfile(acpId),
      featureService.getAll(),
    ]);
    const featMap = new Map(features.map(f => [f.fea_id, f]));
    return rawPerms.map(p => {
      const feat = featMap.get(p.fea_id);
      return {
        ...p,
        fea_description: feat?.fea_description || null,
        fea_path: feat?.fea_path || null,
        fea_alternativeidentifier: feat?.fea_alternativeidentifier || null,
      };
    });
  } catch (err) {
    console.error('Erro ao carregar permissões:', err);
    return [];
  }
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getSavedUser());
  const [permissions, setPermissions] = useState<AuthPermission[]>(() => authService.getSavedPermissions());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!authService.getToken());
  const [loading, setLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    authService.clearSession();
    setUser(null);
    setPermissions([]);
    setIsAuthenticated(false);
  }, []);

  useEffect(() => {
    const validateSession = async () => {
      const token = authService.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const meData = await authService.me(token);
        const { permissions: _ignored, ...userData } = meData;
        setUser(userData);
        setIsAuthenticated(true);

        let perms: AuthPermission[] = [];
        if (userData.acp_id) {
          perms = await fetchUserPermissions(userData.acp_id);
        }
        setPermissions(perms);
        authService.saveSession(token, userData, perms);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    validateSession();
  }, [logout]);

  const login = async (usuario: string, senha: string): Promise<string | null> => {
    try {
      const response = await authService.login(usuario, senha);
      const userData = response.user;

      let perms: AuthPermission[] = [];
      if (userData.acp_id) {
        perms = await fetchUserPermissions(userData.acp_id);
      }
      authService.saveSession(response.token, userData, perms);
      setUser(userData);
      setPermissions(perms);
      setIsAuthenticated(true);
      return null;
    } catch (err: any) {
      return err.message || 'Erro ao realizar login.';
    }
  };

  const hasPermission = useCallback((feaId: number, action: 'prm_create' | 'prm_view' | 'prm_edit' | 'prm_delete'): boolean => {
    if (!user?.acp_id) return true;
    if (!permissions.length) return false;
    const perm = permissions.find(p => p.fea_id === feaId);
    if (!perm) return false;
    return perm[action] === 1;
  }, [permissions, user]);

  const checkPathPermission = useCallback((path: string, action: 'prm_create' | 'prm_view' | 'prm_edit' | 'prm_delete'): boolean => {
    if (!user?.acp_id) return true;

    if (path === '/dashboard') return true;

    if (!permissions.length) return false;

    const normalizedPath = path.replace(/^\//, '');
    const perm = permissions.find(p => {
      if (!p.fea_path) return false;
      const feaPath = p.fea_path.replace(/^\//, '');
      return feaPath === normalizedPath || normalizedPath.startsWith(feaPath + '/');
    });

    if (!perm) return false;
    return perm[action] === 1;
  }, [permissions, user]);

  const canView = useCallback((path: string) => checkPathPermission(path, 'prm_view'), [checkPathPermission]);
  const canCreate = useCallback((path: string) => checkPathPermission(path, 'prm_create'), [checkPathPermission]);
  const canEdit = useCallback((path: string) => checkPathPermission(path, 'prm_edit'), [checkPathPermission]);
  const canDelete = useCallback((path: string) => checkPathPermission(path, 'prm_delete'), [checkPathPermission]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, permissions, loading, login, logout, hasPermission, canView, canCreate, canEdit, canDelete }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
