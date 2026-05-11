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
import clsx from 'clsx';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

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
    { id: 'sair', label: 'Sair da Conta', icon: LogOut, color: 'config-tab-danger' },
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
    <div className="config-container">
      <div className="config-header">
        <div className="config-header-icon">
          <SettingsIcon className="config-icon-lg" />
        </div>
        <div>
          <h2 className="config-title">Configurações do Sistema</h2>
          <p className="config-subtitle">Gerencie acessos, integrações e sua conta.</p>
        </div>
      </div>

      <div className="config-layout">
        <aside className="config-sidebar">
          <nav className="config-nav">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={clsx(
                  "config-tab",
                  activeTab === tab.id 
                    ? "config-tab-active" 
                    : clsx("config-tab-inactive", tab.color)
                )}
              >
                <tab.icon className="config-icon-md" />
                {tab.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="config-content">
          <AnimatePresence mode="wait">
            {activeTab === 'perfil' && (
              <motion.div
                key="perfil"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                className="config-tab-perfil"
              >
                <div className="config-section-header">
                  <div>
                    <h3 className="config-section-title">Perfis de Acesso</h3>
                    <p className="config-section-desc">Defina o que cada grupo de usuários pode visualizar.</p>
                  </div>
                  <button 
                    onClick={handleAddProfile}
                    className="config-primary-btn"
                  >
                    <Plus className="config-icon-sm" /> Adicionar Perfil
                  </button>
                </div>

                <div className="config-table-scroll">
                  <table className="config-table">
                    <thead>
                      <tr className="config-thead-row">
                        <th className="config-th">Nome do Perfil</th>
                        <th className="config-th">Permissões</th>
                        <th className="config-th">Usuários</th>
                        <th className="config-th-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="config-tbody">
                      {profiles.map(profile => (
                        <tr key={profile.id} className="config-row">
                          <td className="config-cell">
                            <span className="config-profile-name">{profile.name}</span>
                          </td>
                          <td className="config-cell">
                            <span className="config-permissions-badge">
                              {profile.permissions.length} módulos
                            </span>
                          </td>
                          <td className="config-cell">
                            <span className="config-user-count">{profile.userCount} usuários</span>
                          </td>
                          <td className="config-cell-right">
                            <div className="config-actions">
                              <button 
                                onClick={() => handleEditProfile(profile)}
                                className="config-action-edit"
                                title="Editar"
                              >
                                <Edit2 className="config-icon-sm" />
                              </button>
                              <button 
                                onClick={() => handleDuplicateProfile(profile)}
                                className="config-action-copy"
                                title="Duplicar"
                              >
                                <Copy className="config-icon-sm" />
                              </button>
                              <button 
                                onClick={() => handleDeleteProfile(profile.id)}
                                className="config-action-delete"
                                title="Excluir"
                              >
                                <Trash2 className="config-icon-sm" />
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
                className="config-tab-origem"
              >
                <div>
                  <h3 className="config-section-title">Origem dos Dados</h3>
                  <p className="config-section-desc">Defina como o sistema deve receber as informações principais.</p>
                </div>

                <div className="config-source-grid">
                  <button 
                    onClick={() => setDataSource('MANUAL')}
                    className={clsx(
                      "config-source-btn",
                      dataSource === 'MANUAL' 
                        ? "config-source-btn-active" 
                        : "config-source-btn-inactive"
                    )}
                  >
                    <div className={clsx(
                      "config-source-icon",
                      dataSource === 'MANUAL' ? "config-source-icon-active" : "config-source-icon-inactive"
                    )}>
                      <Edit2 className="config-icon-md" />
                    </div>
                    <div>
                      <p className="config-source-title">Entrada Manual</p>
                      <p className="config-source-desc">Dados inseridos pelos usuários.</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setDataSource('INTEGRACAO')}
                    className={clsx(
                      "config-source-btn",
                      dataSource === 'INTEGRACAO' 
                        ? "config-source-btn-active" 
                        : "config-source-btn-inactive"
                    )}
                  >
                    <div className={clsx(
                      "config-source-icon",
                      dataSource === 'INTEGRACAO' ? "config-source-icon-active" : "config-source-icon-inactive"
                    )}>
                      <LinkIcon className="config-icon-md" />
                    </div>
                    <div>
                      <p className="config-source-title">Integração Automática</p>
                      <p className="config-source-desc">Sincronização via API.</p>
                    </div>
                  </button>
                </div>

                {dataSource === 'INTEGRACAO' && (
                  <div className="config-warning-card">
                    <div className="config-warning-header">
                      <AlertTriangle className="config-icon-md" />
                      <p className="config-warning-title">Configuração de Sincronização</p>
                    </div>
                    <p className="config-warning-text">
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
                className="config-tab-integracao"
              >
                <div className="config-section-header">
                  <div>
                    <h3 className="config-section-title">Integração Ativa</h3>
                    <p className="config-section-desc">Gerencie a conexão do sistema com a sua empresa.</p>
                  </div>
                </div>

                <div className="config-table-scroll">
                  <table className="config-table">
                    <thead>
                      <tr className="config-thead-row">
                        <th className="config-th">Empresa</th>
                        <th className="config-th">Status</th>
                        <th className="config-th">Última Sincronização</th>
                        <th className="config-th">Módulos</th>
                        <th className="config-th-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="config-tbody">
                      {integratedCompanies.map(company => (
                        <tr key={company.id} className="config-row">
                          <td className="config-cell">
                            <span className="config-company-name">{company.name}</span>
                          </td>
                          <td className="config-cell">
                            <span className={clsx(
                              "config-company-status",
                              company.status === 'Ativo' ? "config-company-status-active" : "config-company-status-inactive"
                            )}>
                              {company.status}
                            </span>
                          </td>
                          <td className="config-cell">
                            <span className="config-company-sync">{company.lastSync}</span>
                          </td>
                          <td className="config-cell">
                            <div className="config-modules-wrapper">
                              {company.modules.map(mod => (
                                <span key={mod} className="config-module-badge">
                                  {mod}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="config-cell-right">
                            <button 
                              onClick={() => { setSelectedCompany(company); setIsIntegracaoModalOpen(true); }}
                              className="config-action-settings"
                              title="Configurar"
                            >
                              <SettingsIcon className="config-icon-sm" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="config-cards-grid">
                  <div className="config-integration-card">
                    <div className="config-card-header">
                      <div className="config-card-title-wrapper">
                        <div className="config-card-icon">
                          <LinkIcon className="config-card-icon-inner" />
                        </div>
                        <span className="config-card-title">Webhooks Globais</span>
                      </div>
                      <span className="config-badge-active">Ativo</span>
                    </div>
                    <p className="config-card-desc">Receba notificações em tempo real sobre entregas e vencimentos.</p>
                    <button className="config-card-link">Configurar Webhook</button>
                  </div>

                  <div className="config-integration-card">
                    <div className="config-card-header">
                      <div className="config-card-title-wrapper">
                        <div className="config-card-icon">
                          <Key className="config-card-icon-inner" />
                        </div>
                        <span className="config-card-title">Chaves de API</span>
                      </div>
                      <span className="config-badge-inactive">Inativo</span>
                    </div>
                    <p className="config-card-desc">Gere chaves de acesso para integração direta via REST API.</p>
                    <button className="config-card-link">Gerar Nova Chave</button>
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
                className="config-tab-senha"
              >
                <div className="config-senha-header">
                  <h3 className="config-section-title">Alterar Senha</h3>
                  <p className="config-section-desc">Mantenha sua conta segura trocando sua senha regularmente.</p>
                </div>

                <form className="config-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="config-form-group">
                    <label className="config-form-label">Senha Atual</label>
                    <input type="password" placeholder="••••••••" className="config-form-input" />
                  </div>
                  <div className="config-form-group">
                    <label className="config-form-label">Nova Senha</label>
                    <input type="password" placeholder="••••••••" className="config-form-input" />
                  </div>
                  <div className="config-form-group">
                    <label className="config-form-label">Confirmar Nova Senha</label>
                    <input type="password" placeholder="••••••••" className="config-form-input" />
                  </div>
                  <button className="config-submit-btn">
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
                className="config-tab-sair"
              >
                <div className="config-logout-icon-wrapper">
                  <LogOut className="config-icon-xl" />
                </div>
                <div className="config-logout-text-wrapper">
                  <h3 className="config-logout-title">Deseja sair do sistema?</h3>
                  <p className="config-logout-desc">Sua sessão será encerrada e você precisará fazer login novamente.</p>
                </div>
                <div className="config-logout-actions">
                  <button 
                    onClick={() => setActiveTab('perfil')}
                    className="config-logout-cancel-btn"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={logout}
                    className="config-logout-confirm-btn"
                  >
                    Sim, Sair Agora
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>
      </div>

      <Modal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        title={editingProfile ? `Editar Perfil: ${editingProfile.name}` : "Novo Perfil de Acesso"}
      >
        <div className="config-modal-content">
          <div className="config-form-group">
            <label className="config-form-label">Nome do Perfil</label>
            <input 
              type="text" 
              value={newProfileName}
              onChange={(e) => setNewProfileName(e.target.value)}
              placeholder="Ex: Supervisor de Campo" 
              className="config-form-input" 
            />
          </div>

          <div className="config-permissions-section">
            <label className="config-form-label">Permissões de Visualização</label>
            <div className="config-permissions-grid">
              {MENU_OPTIONS.map(option => (
                <button
                  key={option.id}
                  onClick={() => togglePermission(option.id)}
                  className={clsx(
                    "config-perm-btn",
                    selectedPermissions.includes(option.id)
                      ? "config-perm-btn-active"
                      : "config-perm-btn-inactive"
                  )}
                >
                  <div className={clsx(
                    "config-perm-check",
                    selectedPermissions.includes(option.id)
                      ? "config-perm-check-active"
                      : "config-perm-check-inactive"
                  )}>
                    {selectedPermissions.includes(option.id) && <Check className="config-check-icon" />}
                  </div>
                  <option.icon className="config-perm-option-icon" />
                  <span className="config-perm-label">{option.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="config-modal-actions">
            <button 
              onClick={() => setIsProfileModalOpen(false)}
              className="config-modal-cancel-btn"
            >
              Cancelar
            </button>
            <button 
              onClick={handleSaveProfile}
              disabled={!newProfileName}
              className="config-modal-save-btn"
            >
              Salvar Perfil
            </button>
          </div>
        </div>
      </Modal>
      <Modal
        isOpen={isIntegracaoModalOpen}
        onClose={() => setIsIntegracaoModalOpen(false)}
        title={`Configurar Integração: ${selectedCompany?.name}`}
      >
        <div className="config-modal-content">
          <div className="config-status-card">
            <p className="config-status-label">Status da Conexão</p>
            <div className="config-status-indicator">
              <div className="config-status-dot" />
              <span className="config-status-text">Sincronizado via REST API</span>
            </div>
          </div>

          <div className="config-sync-section">
            <label className="config-form-label">Módulos para Sincronização</label>
            <div className="config-sync-modules">
              {['Colaboradores', 'Funções', 'EPIs', 'Consumo', 'Unidades'].map(mod => (
                <label key={mod} className="config-sync-module-item">
                  <span className="config-sync-module-name">{mod}</span>
                  <input 
                    type="checkbox" 
                    defaultChecked={selectedCompany?.modules.includes(mod)}
                    className="config-checkbox" 
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="config-note-card">
            <p className="config-note-text">
              <strong>Nota:</strong> Algumas empresas podem não enviar todos os dados. Por exemplo, a Adlim envia apenas dados de colaboradores e funções.
            </p>
          </div>

          <div className="config-modal-actions">
            <button 
              onClick={() => setIsIntegracaoModalOpen(false)}
              className="config-modal-cancel-btn"
            >
              Cancelar
            </button>
            <button 
              onClick={() => setIsIntegracaoModalOpen(false)}
              className="config-modal-save-btn"
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
