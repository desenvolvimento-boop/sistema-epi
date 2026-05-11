import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  ShieldCheck, 
  RefreshCw, 
  Grid3X3, 
  FileText, 
  ClipboardList, 
  Calendar, 
  History, 
  BarChart3, 
  UserCog,
  User,
  LogOut,
  ChevronRight,
  ChevronDown,
  Mail,
  Shield,
  MapPin,
  AlertTriangle,
  Settings as SettingsIcon
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Modal } from '../ui/Modal';
import { useAuth } from '../../contexts/AuthContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const navItems = [
  { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/colaboradores', label: 'Colaboradores', icon: Users },
  { path: '/funcoes', label: 'Gestão de Funções', icon: Briefcase },
  { 
    label: 'EPI', 
    icon: ShieldCheck,
    children: [
      { path: '/epis', label: 'Cadastro de EPIs', icon: ShieldCheck },
      { path: '/regras-troca', label: 'Regras de Troca', icon: RefreshCw },
      { path: '/matriz-funcao-epi', label: 'Matriz Função x EPI', icon: Grid3X3 },
    ]
  },
  { path: '/consumo', label: 'Registro de Consumo', icon: ClipboardList },
  { path: '/intercorrencias', label: 'Intercorrências', icon: AlertTriangle },
  { path: '/agenda-trocas', label: 'Agenda de Trocas', icon: Calendar },
  { path: '/historico', label: 'Histórico', icon: History },
  { path: '/relatorios', label: 'Relatórios', icon: BarChart3 },
  { path: '/usuarios', label: 'Usuários', icon: UserCog },
];

export const Sidebar = () => {
  const { logout } = useAuth();
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

  const userData = {
    nome: 'Admin Master',
    email: 'desenvolvimento@mobcode.com.br',
    cargo: 'Administrador de Sistemas',
    unidade: 'Matriz - São Paulo',
    permissao: 'Acesso Total',
    desde: '15/01/2024'
  };

  return (
    <aside className="w-64 bg-white text-slate-600 h-screen fixed left-0 top-0 flex flex-col border-r border-slate-200 z-50">
      <div className="p-6 flex items-center gap-3 border-b border-slate-100">
        <div className="relative flex items-center justify-center">
          <div className="w-10 h-10 bg-slate-100 rounded-full border border-slate-200 flex items-center justify-center shadow-sm">
            <ShieldCheck className="text-slate-800 w-6 h-6" fill="white" strokeWidth={2} />
          </div>
        </div>
        <span className="font-bold text-slate-900 text-xl tracking-tight">EPI Control</span>
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1 custom-scrollbar">
        {navItems.map((item) => {
          if (item.children) {
            const isOpen = openSubmenus.includes(item.label);
            return (
              <div key={item.label} className="space-y-1">
                <button
                  onClick={() => toggleSubmenu(item.label)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 hover:bg-primary-50 hover:text-primary-600",
                    isOpen ? "text-primary-600 bg-primary-50" : "text-slate-600"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className="w-4 h-4 text-slate-400" />
                    {item.label}
                  </div>
                  <ChevronDown className={cn("w-3.5 h-3.5 transition-transform duration-200", isOpen ? "rotate-180" : "")} />
                </button>
                
                {isOpen && (
                  <div className="pl-4 space-y-1 animate-in slide-in-from-top-1 duration-200">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        className={({ isActive }) => cn(
                          "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition-all duration-200",
                          isActive 
                            ? "bg-primary-50 text-primary-600 border border-primary-100" 
                            : "hover:bg-primary-50 hover:text-primary-600 text-slate-500"
                        )}
                      >
                        {({ isActive }) => (
                          <>
                            <child.icon className={cn("w-3.5 h-3.5", isActive ? "text-primary-600" : "text-slate-400")} />
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

          return (
            <NavLink
              key={item.path}
              to={item.path!}
              className={({ isActive }) => cn(
                "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive 
                  ? "bg-primary-50 text-primary-600 border border-primary-100" 
                  : "hover:bg-primary-50 hover:text-primary-600"
              )}
            >
              {({ isActive }) => (
                <>
                  <item.icon className={cn("w-4 h-4", isActive ? "text-primary-600" : "text-slate-400")} />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <button 
          onClick={() => navigate('/configuracoes')}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-100 transition-all text-left"
        >
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600 shrink-0">
            AD
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-900 truncate">{userData.nome}</p>
            <p className="text-xs text-slate-500 truncate">{userData.email}</p>
          </div>
        </button>
      </div>

      {/* Modal de Confirmação de Logout */}
      <Modal 
        isOpen={isLogoutConfirmOpen} 
        onClose={() => setIsLogoutConfirmOpen(false)} 
        title="Confirmar Saída"
      >
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <LogOut className="w-8 h-8" />
          </div>
          <div>
            <h4 className="text-lg font-bold text-slate-800">Deseja realmente sair?</h4>
            <p className="text-sm text-slate-500 mt-1">Você precisará realizar o login novamente para acessar o sistema.</p>
          </div>
          <div className="flex items-center gap-3 pt-4">
            <button 
              onClick={() => setIsLogoutConfirmOpen(false)}
              className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={() => {
                logout();
                setIsLogoutConfirmOpen(false);
              }}
              className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
            >
              Sim, Sair
            </button>
          </div>
        </div>
      </Modal>
    </aside>
  );
};
