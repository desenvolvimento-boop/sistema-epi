import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authService, AuthUser } from '../services/authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  loading: boolean;
  login: (usuario: string, senha: string) => Promise<string | null>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => authService.getSavedUser());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => !!authService.getToken());
  const [loading, setLoading] = useState<boolean>(true);

  const logout = useCallback(() => {
    authService.clearSession();
    setUser(null);
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
        const userData = await authService.me(token);
        setUser(userData);
        setIsAuthenticated(true);
        authService.saveSession(token, userData);
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
      authService.saveSession(response.token, response.user);
      setUser(response.user);
      setIsAuthenticated(true);
      return null;
    } catch (err: any) {
      return err.message || 'Erro ao realizar login.';
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, loading, login, logout }}>
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
