import React from 'react';
import { ShieldAlert, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

const SemPerfil = () => {
  const { logout, user } = useAuth();

  return (
    <div className="sem-perfil-page">
      <div className="sem-perfil-card">
        <div className="sem-perfil-icon-wrap">
          <ShieldAlert className="sem-perfil-icon" />
        </div>
        <h1 className="sem-perfil-title">Perfil de acesso não vinculado</h1>
        <p className="sem-perfil-text">
          O usuário <strong>{user?.usr_full_name || user?.usr_username}</strong> está ativo,
          mas não possui um perfil de acesso associado. Solicite ao administrador que vincule
          um perfil em Configurações → Usuários.
        </p>
        <button type="button" className="sem-perfil-logout" onClick={logout}>
          <LogOut size={18} />
          Sair da conta
        </button>
      </div>
    </div>
  );
};

export default SemPerfil;
