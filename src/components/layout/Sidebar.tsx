import React, { useMemo, useState } from 'react';
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
} from 'lucide-react';
import clsx from 'clsx';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { useNomenclature } from '../../hooks/useNomenclature';
import { NOMENCLATURE_KEYS } from '../../config/nomenclatureKeys';
import './Sidebar.css';

type NavItem =
  | { path: string; labelKey: string; icon: React.ComponentType<{ className?: string }> }
  | {
      id: string;
      labelKey: string;
      icon: React.ComponentType<{ className?: string }>;
      children: { path: string; labelKey: string; icon: React.ComponentType<{ className?: string }> }[];
    };

const NAV_ITEMS: NavItem[] = [
  { path: '/dashboard', labelKey: NOMENCLATURE_KEYS.menu.dashboard, icon: LayoutDashboard },
  { path: '/colaboradores', labelKey: NOMENCLATURE_KEYS.menu.colaboradores, icon: Users },
  { path: '/funcoes', labelKey: NOMENCLATURE_KEYS.menu.funcoes, icon: Briefcase },
  {
    id: 'epi',
    labelKey: NOMENCLATURE_KEYS.menu.epi,
    icon: ShieldCheck,
    children: [
      { path: '/tipos-epi', labelKey: NOMENCLATURE_KEYS.menu.tipos_epi, icon: ShieldCheck },
      { path: '/variantes-epi', labelKey: NOMENCLATURE_KEYS.menu.variantes_epi, icon: Layers },
      { path: '/regras-troca', labelKey: NOMENCLATURE_KEYS.menu.regras_troca, icon: RefreshCw },
    ],
  },
  { path: '/intercorrencias', labelKey: NOMENCLATURE_KEYS.menu.intercorrencias, icon: AlertTriangle },
  { path: '/agenda-trocas', labelKey: NOMENCLATURE_KEYS.menu.agenda_trocas, icon: Calendar },
  { path: '/historico', labelKey: NOMENCLATURE_KEYS.menu.historico, icon: History },
  { path: '/usuarios', labelKey: NOMENCLATURE_KEYS.menu.usuarios, icon: UserCog },
  { path: '/nova-secao', labelKey: NOMENCLATURE_KEYS.menu.section, icon: Building2 },
  { path: '/relatorios', labelKey: NOMENCLATURE_KEYS.menu.relatorios, icon: BarChart3 },
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
  const { t } = useNomenclature();
  const navigate = useNavigate();
  const [isLogoutConfirmOpen, setIsLogoutConfirmOpen] = useState(false);
  const [openSubmenus, setOpenSubmenus] = useState<string[]>(['epi']);

  const navItems = useMemo(
    () =>
      NAV_ITEMS.map((item) => {
        if ('children' in item) {
          return {
            ...item,
            label: t(item.labelKey),
            children: item.children.map((c) => ({ ...c, label: t(c.labelKey) })),
          };
        }
        return { ...item, label: t(item.labelKey) };
      }),
    [t]
  );

  const toggleSubmenu = (id: string) => {
    setOpenSubmenus(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id) 
        : [...prev, id]
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
        <span className="sidebar-title">{t(NOMENCLATURE_KEYS.page.app_default)}</span>
      </div>
      
      <nav className="sidebar-nav custom-scrollbar">
        {navItems.map((item) => {
          if ('children' in item && item.children) {
            const visibleChildren = item.children.filter(child => canView(child.path));
            if (visibleChildren.length === 0) return null;

            const isSubOpen = openSubmenus.includes(item.id);
            return (
              <div key={item.id} className="sidebar-submenu-group">
                <button
                  onClick={() => toggleSubmenu(item.id)}
                  className={clsx(
                    "sidebar-submenu-toggle",
                    isSubOpen ? "sidebar-submenu-toggle-active" : "sidebar-submenu-toggle-inactive"
                  )}
                >
                  <div className="sidebar-submenu-label">
                    <item.icon className="sidebar-submenu-icon" />
                    {item.label}
                  </div>
                  <ChevronDown className={clsx("sidebar-chevron", isSubOpen && "sidebar-chevron-open")} />
                </button>
                
                {isSubOpen && (
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

          if ('path' in item && item.path === '/nova-secao' && !canViewNovaSecao(canView)) return null;
          if ('path' in item && item.path !== '/nova-secao' && !canView(item.path)) return null;

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
            title={canView('/configuracoes') ? t(NOMENCLATURE_KEYS.menu.configuracoes) : user?.usr_full_name || t(NOMENCLATURE_KEYS.entity.usuario_singular)}
          >
            <div className="sidebar-user-avatar">
              {user?.usr_full_name?.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase() || 'US'}
            </div>
            <div className="sidebar-user-info">
              <p className="sidebar-user-name">{user?.usr_full_name || t(NOMENCLATURE_KEYS.entity.usuario_singular)}</p>
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
              {t(NOMENCLATURE_KEYS.action.cancel)}
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
