import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  RefreshCw, 
  Layers,
  Building2,
  Calendar, 
  History, 
  BarChart3, 
  UserCog,
  User,
  LogOut,
  ChevronDown,
  AlertTriangle,
  Settings as SettingsIcon
} from 'lucide-react';
import clsx from 'clsx';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import './Sidebar.css';

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/colaboradores', label: 'Colaboradores', icon: Users },
  { path: '/funcoes', label: 'Gestão de Funções', icon: Briefcase },
  { 
    label: 'EPI', 
    icon: ShieldCheck,
    children: [
      { path: '/tipos-epi', label: 'Tipo de EPIs', icon: ShieldCheck },
      { path: '/variantes-epi', label: 'Variantes de EPIs', icon: Layers },
      { path: '/regras-troca', label: 'Regras de Troca', icon: RefreshCw },
    ]
  },
  { path: '/intercorrencias', label: 'Intercorrências', icon: AlertTriangle },
  { path: '/agenda-trocas', label: 'Agenda de Trocas', icon: Calendar },
  { path: '/historico', label: 'Histórico', icon: History },
  { path: '/usuarios', label: 'Usuários', icon: UserCog },
  { path: '/nova-secao', label: 'Nova Seção', icon: Building2 },
  { path: '/relatorios', label: 'Relatórios', icon: BarChart3 },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

function canViewNovaSecao(canView: (path: string) => boolean) {
  return (
    canView('/nova-secao') ||
    canView('/colaboradores') ||
    canView('/configuracoes')
  );
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { logout, user, canView } = useAuth();
  const navigate = useNavigate();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>(['EPI']);

  const toggleSubmenu = (label: string) => {
    setOpenSubmenus(prev => 
      prev.includes(label) 
        ? prev.filter(item => item !== label) 
        : [...prev, label]
    );
  };

  return (
    <aside className={clsx("sidebar", isOpen && "sidebar-open")}>
      <div className="sidebar-header">
        <div className="sidebar-logo-wrapper">
          <div className="sidebar-logo">
            <ShieldCheck className="sidebar-logo-icon" fill="white" strokeWidth={2} />
          </div>
        </div>
        <span className="sidebar-title">EPI Control</span>
      </div>
      
      <nav className="sidebar-nav custom-scrollbar">
        {navItems.map((item) => {
          if (item.children) {
            const visibleChildren = item.children.filter(child => canView(child.path));
            if (visibleChildren.length === 0) return null;

            const isOpen = openSubmenus.includes(item.label);
            return (
              <div key={item.label} className="sidebar-submenu-group">
                <button
                  onClick={() => toggleSubmenu(item.label)}
                  className={clsx(
                    "sidebar-submenu-toggle",
                    isOpen ? "sidebar-submenu-toggle-active" : "sidebar-submenu-toggle-inactive"
                  )}
                >
                  <div className="sidebar-submenu-label">
                    <item.icon className="sidebar-submenu-icon" />
                    {item.label}
                  </div>
                  <ChevronDown className={clsx("sidebar-chevron", isOpen && "sidebar-chevron-open")} />
                </button>
                
                {isOpen && (
                  <div className="sidebar-submenu-items">
                    {visibleChildren.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) => clsx(
                          "sidebar-sub-nav-link",
                          isActive ? "sidebar-sub-nav-link-active" : "sidebar-sub-nav-link-inactive"
                        )}
                      >
                        {({ isActive }) => (
                          <>
                            <child.icon className={clsx("sidebar-sub-nav-icon", isActive ? "sidebar-sub-nav-icon-active" : "sidebar-sub-nav-icon-inactive")} />
                            {child.label}
                          </>
                        )}
                      </NavLink>
                    ))}
                  </div>
                )}
              </div>
            );
          }

          if (item.path === '/nova-secao' && !canViewNovaSecao(canView)) return null;
          if (item.path && item.path !== '/nova-secao' && !canView(item.path)) return null;

          return (
            <NavLink
              key={item.path}
              to={item.path!}
              className={({ isActive }) => clsx(
                "sidebar-nav-link",
                isActive ? "sidebar-nav-link-active" : "sidebar-nav-link-inactive"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={clsx("sidebar-nav-icon", isActive ? "sidebar-nav-icon-active" : "sidebar-nav-icon-inactive")} />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-row">
          <button 
            onClick={() => canView('/configuracoes') ? navigate('/configuracoes') : undefined}
            className={clsx("sidebar-user-button", !canView('/configuracoes') && "sidebar-user-button-disabled")}
            title={canView('/configuracoes') ? 'Configurações' : user?.usr_full_name || 'Usuário'}
          >
            <div className="sidebar-user-avatar">
              {user?.usr_full_name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'US'}
            </div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{user?.usr_full_name || 'Usuário'}</p>
              <p className="sidebar-user-email">{user?.usr_email || ''}</p>
            </div>
          </button>
          <button
            onClick={() => setIsLogoutConfirmOpen(true)}
            className="sidebar-logout-btn"
            title="Sair da conta"
          >
            <LogOut className="sidebar-logout-btn-icon" />
          </button>
        </div>
      </div>

      {/* Modal de Confirmação de Logout */}
      <Modal 
        isOpen={isLogoutConfirmOpen} 
        onClose={() => setIsLogoutConfirmOpen(false)} 
        title="Confirmar Saída"
      >
        <div className="sidebar-logout-content">
          <div className="sidebar-logout-icon-wrapper">
            <LogOut className="sidebar-logout-icon" />
          </div>
          <div>
            <h4 className="sidebar-logout-title">Deseja realmente sair?</h4>
            <p className="sidebar-logout-description">Você precisará realizar o login novamente para acessar o sistema.</p>
          </div>
          <div className="sidebar-logout-actions">
            <button 
              onClick={() => setIsLogoutConfirmOpen(false)}
              className="sidebar-logout-cancel"
            >
              Cancelar
            </button>
            <button 
              onClick={() => {
                logout();
                setIsLogoutConfirmOpen(false);
              }}
              className="sidebar-logout-confirm"
            >
              Sim, Sair
            </button>
          </div>
        </div>
      </Modal>
    </aside>
  );
};
