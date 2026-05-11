import React, { useState } from 'react';
import { 
  Shield, 
  Link as LinkIcon, 
  Key, 
  LogOut, 
  Plus, 
  Edit2, 
  Trash2, 
  Copy, 
  Check,
  ChevronRight,
  Search,
  AlertTriangle,
  Settings as SettingsIcon,
  LayoutDashboard,
  Users,
  Briefcase,
  ShieldCheck,
  RefreshCw,
  Grid3X3,
  ClipboardList,
  Smartphone,
  Calendar,
  History,
  BarChart3,
  UserCog
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Modal } from '../components/ui/Modal';
import { useAuth } from '../contexts/AuthContext';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MENU_OPTIONS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'colaboradores', label: 'Colaboradores', icon: Users },
  { id: 'funcoes', label: 'Gestão de Funções', icon: Briefcase },
  { id: 'epis', label: 'Cadastro de EPIs', icon: ShieldCheck },
  { id: 'regras-troca', label: 'Regras de Troca', icon: RefreshCw },
  { id: 'matriz-funcao-epi', label: 'Matriz Função x EPI', icon: Grid3X3 },
  { id: 'consumo', label: 'Registro de Consumo', icon: ClipboardList },
  { id: 'entregas', label: 'Registro de Entrega', icon: Smartphone },
  { id: 'agenda-trocas', label: 'Agenda de Trocas', icon: Calendar },
  { id: 'historico', label: 'Histórico', icon: History },
  { id: 'relatorios', label: 'Relatórios', icon: BarChart3 },
  { id: 'usuarios', label: 'Usuários', icon: UserCog },
];

interface AccessProfile {
  id: string;
  name: string;
  permissions: string[];
  userCount: number;
}

const INITIAL_PROFILES: AccessProfile[] = [
  { id: '1', name: 'Administrador Master', permissions: MENU_OPTIONS.map(o => o.id), userCount: 2 },
  { id: '2', name: 'Supervisor SESMT', permissions: ['dashboard', 'colaboradores', 'epis', 'relatorios'], userCount: 5 },
  { id: '3', name: 'Operador de Almoxarifado', permissions: ['dashboard', 'consumo', 'entregas', 'epis'], userCount: 12 },
];

const Configuracoes = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState('perfil');
  const [profiles, setProfiles] = useState<AccessProfile[]>(INITIAL_PROFILES);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<AccessProfile | null>(null);
  const [newProfileName, setNewProfileName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const tabs = [
    { id: 'perfil', label: 'Perfil de Acesso', icon: Shield },
    { id: 'origem', label: 'Origem dos Dados', icon: SettingsIcon },
    { id: 'integracao', label: 'Integração', icon: LinkIcon },
    { id: 'senha', label: 'Alterar Senha', icon: Key },
    { id: 'sair', label: 'Sair da Conta', icon: LogOut, color: 'text-red-600' },
  ];

  const [dataSource, setDataSource] = useState('MANUAL');
  const [integratedCompanies] = useState([
    { id: '1', name: 'Adlim Serviços', status: 'Ativo', lastSync: '10/04/2024 14:30', modules: ['Colaboradores', 'Funções', 'EPIs'] },
  ]);

  const [isIntegracaoModalOpen, setIsIntegracaoModalOpen] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<any>(null);

  const handleAddProfile = () => {
    setEditingProfile(null);
    setNewProfileName('');
    setSelectedPermissions([]);
    setIsProfileModalOpen(true);
  };

  const handleEditProfile = (profile: AccessProfile) => {
    setEditingProfile(profile);
    setNewProfileName(profile.name);
    setSelectedPermissions(profile.permissions);
    setIsProfileModalOpen(true);
  };

  const handleDuplicateProfile = (profile: AccessProfile) => {
    const duplicated: AccessProfile = {
      ...profile,
      id: Math.random().toString(36).substr(2, 9),
      name: `${profile.name} (Cópia)`,
      userCount: 0
    };
    setProfiles([...profiles, duplicated]);
  };

  const handleDeleteProfile = (id: string) => {
    setProfiles(profiles.filter(p => p.id !== id));
  };

  const handleSaveProfile = () => {
    if (editingProfile) {
      setProfiles(profiles.map(p => p.id === editingProfile.id ? { ...p, name: newProfileName, permissions: selectedPermissions } : p));
    } else {
      const newProfile: AccessProfile = {
        id: Math.random().toString(36).substr(2, 9),
        name: newProfileName,
        permissions: selectedPermissions,
        userCount: 0
      };
      setProfiles([...profiles, newProfile]);
    }
    setIsProfileModalOpen(false);
  };

  const togglePermission = (id: string) => {
    setSelectedPermissions(prev => 
      prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center">
          <SettingsIcon className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Configurações do Sistema</h2>
          <p className="text-slate-500 text-sm">Gerencie acessos, integrações e sua conta.</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar de Abas */}
        <aside className="w-full md:w-64 shrink-0">
          <nav className="space-y-1">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                  activeTab === tab.id 
                    ? "bg-primary-600 text-white shadow-lg shadow-primary-200" 
                    : cn("text-slate-600 hover:bg-slate-100", tab.color)
                )}
              >
                <tab.icon className="w-5 h-5" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* Conteúdo das Abas */}
        <main className="flex-1 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'perfil' && (
              <motion.div
                key="perfil"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="p-8 space-y-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Perfis de Acesso</h3>
                    <p className="text-sm text-slate-500">Defina o que cada grupo de usuários pode visualizar.</p>
                  </div>
                  <button 
                    onClick={handleAddProfile}
                    className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-sm"
                  >
                    <Plus className="w-4 h-4" /> Adicionar Perfil
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Nome do Perfil</th>
                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Permissões</th>
                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Usuários</th>
                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {profiles.map(profile => (
                        <tr key={profile.id} className="group">
                          <td className="py-4">
                            <span className="text-sm font-bold text-slate-700">{profile.name}</span>
                          </td>
                          <td className="py-4">
                            <span className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded-lg">
                              {profile.permissions.length} módulos
                            </span>
                          </td>
                          <td className="py-4">
                            <span className="text-sm text-slate-600">{profile.userCount} usuários</span>
                          </td>
                          <td className="py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={() => handleEditProfile(profile)}
                                className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                                title="Editar"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDuplicateProfile(profile)}
                                className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                                title="Duplicar"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProfile(profile.id)}
                                className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                                title="Excluir"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'origem' && (
              <motion.div
                key="origem"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="p-8 space-y-8"
              >
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Origem dos Dados</h3>
                  <p className="text-sm text-slate-500">Defina como o sistema deve receber as informações principais.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button 
                    onClick={() => setDataSource('MANUAL')}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4",
                      dataSource === 'MANUAL' 
                        ? "border-primary-600 bg-primary-50" 
                        : "border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shadow-sm shrink-0",
                      dataSource === 'MANUAL' ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-400"
                    )}>
                      <Edit2 className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">Entrada Manual</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">Dados inseridos pelos usuários.</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setDataSource('INTEGRACAO')}
                    className={cn(
                      "p-4 rounded-xl border-2 transition-all text-left flex items-center gap-4",
                      dataSource === 'INTEGRACAO' 
                        ? "border-primary-600 bg-primary-50" 
                        : "border-slate-100 hover:border-slate-200"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center shadow-sm shrink-0",
                      dataSource === 'INTEGRACAO' ? "bg-primary-600 text-white" : "bg-slate-100 text-slate-400"
                    )}>
                      <LinkIcon className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-bold text-slate-800 text-sm">Integração Automática</p>
                      <p className="text-[10px] text-slate-500 line-clamp-1">Sincronização via API.</p>
                    </div>
                  </button>
                </div>

                {dataSource === 'INTEGRACAO' && (
                  <div className="p-6 bg-amber-50 border border-amber-100 rounded-2xl space-y-3">
                    <div className="flex items-center gap-3 text-amber-800">
                      <AlertTriangle className="w-5 h-5" />
                      <p className="text-sm font-bold">Configuração de Sincronização</p>
                    </div>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Ao selecionar Integração Automática, certifique-se de configurar quais módulos serão sincronizados na aba <strong>Integração</strong>. 
                      Dados manuais podem ser sobrescritos durante a sincronização.
                    </p>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'integracao' && (
              <motion.div
                key="integracao"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="p-8 space-y-8"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800">Integração Ativa</h3>
                    <p className="text-sm text-slate-500">Gerencie a conexão do sistema com a sua empresa.</p>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Empresa</th>
                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Última Sincronização</th>
                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Módulos</th>
                        <th className="pb-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {integratedCompanies.map(company => (
                        <tr key={company.id} className="group">
                          <td className="py-4">
                            <span className="text-sm font-bold text-slate-700">{company.name}</span>
                          </td>
                          <td className="py-4">
                            <span className={cn(
                              "text-[10px] font-bold px-2 py-0.5 rounded-full uppercase",
                              company.status === 'Ativo' ? "text-emerald-600 bg-emerald-50" : "text-amber-600 bg-amber-50"
                            )}>
                              {company.status}
                            </span>
                          </td>
                          <td className="py-4">
                            <span className="text-sm text-slate-500">{company.lastSync}</span>
                          </td>
                          <td className="py-4">
                            <div className="flex flex-wrap gap-1">
                              {company.modules.map(mod => (
                                <span key={mod} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md">
                                  {mod}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-4 text-right">
                            <button 
                              onClick={() => { setSelectedCompany(company); setIsIntegracaoModalOpen(true); }}
                              className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                              title="Configurar"
                            >
                              <SettingsIcon className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-8 border-t border-slate-100">
                  <div className="p-5 border border-slate-100 rounded-xl bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <LinkIcon className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="font-bold text-slate-700 text-sm">Webhooks Globais</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full uppercase">Ativo</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Receba notificações em tempo real sobre entregas e vencimentos.</p>
                    <button className="text-[11px] font-bold text-primary-600 hover:underline">Configurar Webhook</button>
                  </div>

                  <div className="p-5 border border-slate-100 rounded-xl bg-slate-50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Key className="w-4 h-4 text-slate-400" />
                        </div>
                        <span className="font-bold text-slate-700 text-sm">Chaves de API</span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-200 px-2 py-0.5 rounded-full uppercase">Inativo</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Gere chaves de acesso para integração direta via REST API.</p>
                    <button className="text-[11px] font-bold text-primary-600 hover:underline">Gerar Nova Chave</button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'senha' && (
              <motion.div
                key="senha"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="p-8 max-w-md"
              >
                <div className="mb-8">
                  <h3 className="text-lg font-bold text-slate-800">Alterar Senha</h3>
                  <p className="text-sm text-slate-500">Mantenha sua conta segura trocando sua senha regularmente.</p>
                </div>

                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Senha Atual</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nova Senha</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Confirmar Nova Senha</label>
                    <input type="password" placeholder="••••••••" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all" />
                  </div>
                  <button className="w-full py-3 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-all mt-4">
                    Atualizar Senha
                  </button>
                </form>
              </motion.div>
            )}

            {activeTab === 'sair' && (
              <motion.div
                key="sair"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="p-8 text-center space-y-6"
              >
                <div className="w-20 h-20 bg-red-50 text-red-600 rounded-full flex items-center justify-center mx-auto">
                  <LogOut className="w-10 h-10" />
                </div>
                <div className="max-w-xs mx-auto">
                  <h3 className="text-xl font-bold text-slate-800">Deseja sair do sistema?</h3>
                  <p className="text-sm text-slate-500 mt-2">Sua sessão será encerrada e você precisará fazer login novamente.</p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button 
                    onClick={() => setActiveTab('perfil')}
                    className="w-full sm:w-auto px-8 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={logout}
                    className="w-full sm:w-auto px-8 py-3 bg-red-600 text-white rounded-xl font-bold text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                  >
                    Sim, Sair Agora
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      {/* Modal de Perfil de Acesso */}
      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title={editingProfile ? `Editar Perfil: ${editingProfile.name}` : "Novo Perfil de Acesso"}
      >
        <div className="space-y-6">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Nome do Perfil</label>
            <input 
              type="text" 
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="Ex: Supervisor de Campo" 
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all" 
            />
          </div>

          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Permissões de Visualização</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {MENU_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => togglePermission(option.id)}
                  className={cn(
                    "flex items-center gap-3 p-3 rounded-xl border transition-all text-left",
                    selectedPermissions.includes(option.id)
                      ? "bg-primary-50 border-primary-200 text-primary-700"
                      : "bg-white border-slate-100 text-slate-600 hover:border-slate-200"
                  )}
                >
                  <div className={cn(
                    "w-5 h-5 rounded flex items-center justify-center border transition-all",
                    selectedPermissions.includes(option.id)
                      ? "bg-primary-600 border-primary-600 text-white"
                      : "bg-white border-slate-300"
                  )}>
                    {selectedPermissions.includes(option.id) && <Check className="w-3.5 h-3.5" />}
                  </div>
                  <option.icon className="w-4 h-4 shrink-0" />
                  <span className="text-xs font-bold">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              onClick={() => setIsProfileModalOpen(false)}
              className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSaveProfile}
              disabled={!newProfileName}
              className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Salvar Perfil
            </button>
          </div>
        </div>
      </Modal>
      {/* Modal de Configuração de Integração */}
      <Modal
        isOpen={isIntegracaoModalOpen}
        onClose={() => setIsIntegracaoModalOpen(false)}
        title={`Configurar Integração: ${selectedCompany?.name}`}
      >
        <div className="space-y-6">
          <div className="p-4 bg-slate-50 border border-slate-100 rounded-2xl space-y-2">
            <p className="text-[10px] font-bold text-slate-400 uppercase">Status da Conexão</p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-sm font-bold text-slate-700">Sincronizado via REST API</span>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Módulos para Sincronização</label>
            <div className="space-y-2">
              {['Colaboradores', 'Funções', 'EPIs', 'Consumo', 'Unidades'].map(mod => (
                <label key={mod} className="flex items-center justify-between p-3 rounded-xl border border-slate-100 hover:bg-slate-50 cursor-pointer transition-all">
                  <span className="text-sm font-bold text-slate-700">{mod}</span>
                  <input 
                    type="checkbox" 
                    defaultChecked={selectedCompany?.modules.includes(mod)}
                    className="w-5 h-5 rounded border-slate-300 text-primary-600 focus:ring-primary-500" 
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="p-4 bg-amber-50 border border-amber-100 rounded-2xl">
            <p className="text-xs text-amber-700 leading-relaxed">
              <strong>Nota:</strong> Algumas empresas podem não enviar todos os dados. Por exemplo, a Adlim envia apenas dados de colaboradores e funções.
            </p>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              onClick={() => setIsIntegracaoModalOpen(false)}
              className="flex-1 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold text-sm hover:bg-slate-200 transition-all"
            >
              Cancelar
            </button>
            <button 
              onClick={() => setIsIntegracaoModalOpen(false)}
              className="flex-1 py-3 bg-primary-600 text-white rounded-xl font-bold text-sm hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
            >
              Salvar Configurações
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Configuracoes;
