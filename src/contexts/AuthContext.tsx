import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, AuthUser, AuthPermission } from '../services/authService';
import { permissionService } from '../services/permissionService';
import { featureService } from '../services/featureService';
import {
  isPermissionGranted,
  pathMatchesPermission,
  resolveRoutePermissionPath,
} from '../utils/permissionPaths';

interface AuthContextType {
  isAuthenticated: boolean;
  hasProfile: boolean;
  user: AuthUser | null;
  permissions: AuthPermission[];
  loading: boolean;
  login: (usuario: string, senha: string) => Promise<string | null>;
  logout: () => void;
  refreshPermissions: () => Promise<void>;
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
      const fromInclude = (p as AuthPermission & { feature?: { fea_path?: string; fea_description?: string; fea_alternativeidentifier?: string } }).feature;
      return {
        ...p,
        fea_description: feat?.fea_description || fromInclude?.fea_description || null,
        fea_path: feat?.fea_path || fromInclude?.fea_path || null,
        fea_alternativeidentifier: feat?.fea_alternativeidentifier || fromInclude?.fea_alternativeidentifier || null,
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

  const hasProfile = Boolean(user?.acp_id);

  const logout = useCallback(() => {
    authService.clearSession();
    setUser(null);
    setPermissions([]);
    setIsAuthenticated(false);
  }, []);

  const refreshPermissions = useCallback(async () => {
    const token = authService.getToken();
    if (!token || !user?.acp_id) return;

    const meData = await authService.me(token);
    const { permissions: mePermissions, ...userData } = meData;
    setUser(userData);

    const perms = mePermissions?.length
      ? mePermissions
      : await fetchUserPermissions(userData.acp_id!);

    setPermissions(perms);
    authService.saveSession(token, userData, perms);
  }, [user?.acp_id]);

  useEffect(() => {
    const validateSession = async () => {
      const token = authService.getToken();
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const meData = await authService.me(token);
        const { permissions: mePermissions, ...userData } = meData;
        setUser(userData);
        setIsAuthenticated(true);

        let perms: AuthPermission[] = [];
        if (userData.acp_id) {
          perms = mePermissions?.length
            ? mePermissions
            : await fetchUserPermissions(userData.acp_id);
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
        perms = response.permissions?.length
          ? response.permissions
          : await fetchUserPermissions(userData.acp_id);
      }
      authService.saveSession(response.token, userData, perms);
      setUser(userData);
      setPermissions(perms);
      setIsAuthenticated(true);
      return null;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao realizar login.';
      return message;
    }
  };

  const hasPermission = useCallback((feaId: number, action: 'prm_create' | 'prm_view' | 'prm_edit' | 'prm_delete'): boolean => {
    if (!user?.acp_id) return false;
    if (!permissions.length) return false;
    const perm = permissions.find(p => p.fea_id === feaId);
    if (!perm) return false;
    return isPermissionGranted(perm, action);
  }, [permissions, user]);

  const checkPathPermission = useCallback((path: string, action: 'prm_create' | 'prm_view' | 'prm_edit' | 'prm_delete'): boolean => {
    if (!user?.acp_id) return false;

    const resolvedPath = resolveRoutePermissionPath(path);

    if (resolvedPath === '/dashboard') return true;

    if (!permissions.length) return false;

    const perm = permissions.find(p => pathMatchesPermission(resolvedPath, p));

    if (!perm) return false;
    return isPermissionGranted(perm, action);
  }, [permissions, user]);

  const canView = useCallback((path: string) => checkPathPermission(path, 'prm_view'), [checkPathPermission]);
  const canCreate = useCallback((path: string) => checkPathPermission(path, 'prm_create'), [checkPathPermission]);
  const canEdit = useCallback((path: string) => checkPathPermission(path, 'prm_edit'), [checkPathPermission]);
  const canDelete = useCallback((path: string) => checkPathPermission(path, 'prm_delete'), [checkPathPermission]);

  return (
    <AuthContext.Provider value={{
      isAuthenticated,
      hasProfile,
      user,
      permissions,
      loading,
      login,
      logout,
      refreshPermissions,
      hasPermission,
      canView,
      canCreate,
      canEdit,
      canDelete,
    }}>
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
