import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ListFiltersBar } from '../../components/list/ListFiltersBar';
import { activeStatusMatcher, filterListRows } from '../../utils/listFilters';
import { 
  Shield, 
  Link as LinkIcon, 
  Key, 
  LogOut, 
  Plus, 
  Edit2, 
  Copy, 
  Check,
  AlertTriangle,
  Settings as SettingsIcon,
  X,
  Loader2,
  BookOpen,
} from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useNomenclature } from '../../hooks/useNomenclature';
import { NOMENCLATURE_KEYS } from '../../config/nomenclatureKeys';
import { NomenclaturaTab } from './NomenclaturaTab';
import { OrigemTab } from './OrigemTab';
import { IntegracaoTab } from './IntegracaoTab';
import { FEATURE_PATHS } from '../../utils/permissionPaths';
import { motion, AnimatePresence } from 'motion/react';
import clsx from 'clsx';
import { Modal } from '../../components/ui/Modal';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/authService';
import { accessProfileService, type AccessProfileAPI } from '../../services/accessProfileService';
import { featureService, type FeatureAPI } from '../../services/featureService';
import { permissionService, type PermissionAPI, type PermissionBulkItem } from '../../services/permissionService';
import { validateAccessProfileUniqueness } from '../../utils/uniqueness';
import './styles.css';

interface PermissionSet {
  criar: boolean;
  visualizar: boolean;
  editar: boolean;
  excluir: boolean;
}

const Configuracoes = () => {
  const { t } = useNomenclature();
  const { logout, canCreate, canEdit, canView, user, refreshPermissions } = useAuth();
  const allowCreate = canCreate('/configuracoes');
  const allowEdit = canEdit('/configuracoes');
  const canViewNomenclatura = canView(FEATURE_PATHS.NOMENCLATURA);
  const canEditNomenclatura = canEdit(FEATURE_PATHS.NOMENCLATURA);
  const [activeTab, setActiveTab] = useState('perfil');
  const [profileSearch, setProfileSearch] = useState('');
  const [profileFilterValues, setProfileFilterValues] = useState<Record<string, string>>({});

  const [profiles, setProfiles] = useState<AccessProfileAPI[]>([]);
  const [features, setFeatures] = useState<FeatureAPI[]>([]);
  const [profilePermissionsCount, setProfilePermissionsCount] = useState<Record<number, number>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<AccessProfileAPI | null>(null);
  const [newProfileName, setNewProfileName] = useState('');
  const [newIntegrationId, setNewIntegrationId] = useState('');
  const [newStatus, setNewStatus] = useState<number>(1);
  const [newIsDefault, setNewIsDefault] = useState<number>(0);
  const [selectedPermissions, setSelectedPermissions] = useState<Record<string, PermissionSet>>({});

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);

  const tabs = [
    { id: 'perfil', label: 'Perfil de Acesso', icon: Shield },
    ...(canViewNomenclatura
      ? [{ id: 'nomenclatura' as const, label: 'Dicionário de Termos', icon: BookOpen }]
      : []),
    { id: 'origem', label: 'Origem dos Dados', icon: SettingsIcon },
    { id: 'integracao', label: 'Integração', icon: LinkIcon },
    { id: 'senha', label: 'Alterar Senha', icon: Key },
    { id: 'sair', label: 'Sair da Conta', icon: LogOut, color: 'config-tab-danger' },
  ];

  const createEmptyPermissions = useCallback((): Record<string, PermissionSet> => {
    const perms: Record<string, PermissionSet> = {};
    features.forEach(f => {
      perms[f.fea_id.toString()] = { criar: false, visualizar: false, editar: false, excluir: false };
    });
    return perms;
  }, [features]);

  const createFullPermissions = useCallback((): Record<string, PermissionSet> => {
    const perms: Record<string, PermissionSet> = {};
    features.forEach(f => {
      perms[f.fea_id.toString()] = { criar: true, visualizar: true, editar: true, excluir: true };
    });
    return perms;
  }, [features]);

  const countActiveModules = (perms: Record<string, PermissionSet>) => {
    return Object.values(perms).filter(p => p.criar || p.visualizar || p.editar || p.excluir).length;
  };

  const permissionsApiToLocal = (perms: PermissionAPI[]): Record<string, PermissionSet> => {
    const result: Record<string, PermissionSet> = {};
    features.forEach(f => {
      const p = perms.find(pm => pm.fea_id === f.fea_id);
      result[f.fea_id.toString()] = p
        ? { criar: !!p.prm_create, visualizar: !!p.prm_view, editar: !!p.prm_edit, excluir: !!p.prm_delete }
        : { criar: false, visualizar: false, editar: false, excluir: false };
    });
    return result;
  };

  const permissionsLocalToApi = (perms: Record<string, PermissionSet>): PermissionBulkItem[] => {
    return Object.entries(perms).map(([feaId, p]) => ({
      fea_id: parseInt(feaId),
      prm_create: p.criar ? 1 : 0,
      prm_view: p.visualizar ? 1 : 0,
      prm_edit: p.editar ? 1 : 0,
      prm_delete: p.excluir ? 1 : 0,
    }));
  };

  const loadPermissionsCount = useCallback(async (profileList: AccessProfileAPI[]) => {
    const counts: Record<number, number> = {};
    await Promise.all(
      profileList.map(async (profile) => {
        try {
          const perms = await permissionService.getByProfile(profile.acp_id);
          const localPerms = permissionsApiToLocal(perms);
          counts[profile.acp_id] = countActiveModules(localPerms);
        } catch {
          counts[profile.acp_id] = 0;
        }
      })
    );
    setProfilePermissionsCount(counts);
  }, [features]);

  const filteredProfiles = useMemo(
    () =>
      filterListRows(profiles, profileSearch, profileFilterValues, {
        searchText: (profile) =>
          [
            profile.acp_description,
            profile.acp_integration_id,
            String(profile.acp_id),
            String(profilePermissionsCount[profile.acp_id] ?? ''),
          ]
            .filter(Boolean)
            .join(' '),
        fields: {
          status: activeStatusMatcher((profile) => profile.acp_active),
        },
      }),
    [profiles, profileSearch, profileFilterValues, profilePermissionsCount],
  );

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [profilesData, featuresData] = await Promise.all([
        accessProfileService.getAll(),
        featureService.getAll(),
      ]);
      setProfiles(profilesData);
      setFeatures(featuresData);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (profiles.length > 0 && features.length > 0) {
      loadPermissionsCount(profiles);
    }
  }, [profiles, features, loadPermissionsCount]);

  useEffect(() => {
    if (activeTab === 'senha') return;
    setPasswordError(null);
    setPasswordSuccess(null);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
  }, [activeTab]);

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError('Preencha todos os campos.');
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError('A nova senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('A confirmação da nova senha não confere.');
      return;
    }

    if (currentPassword === newPassword) {
      setPasswordError('A nova senha deve ser diferente da senha atual.');
      return;
    }

    try {
      setPasswordSaving(true);
      const result = await authService.changePassword(currentPassword, newPassword);
      setPasswordSuccess(result.message || 'Senha alterada com sucesso.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setPasswordError(err instanceof Error ? err.message : 'Erro ao alterar senha.');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleAddProfile = () => {
    setEditingProfile(null);
    setNewProfileName('');
    setNewIntegrationId('');
    setNewStatus(1);
    setNewIsDefault(0);
    setSelectedPermissions(createEmptyPermissions());
    setIsProfileModalOpen(true);
  };

  const handleEditProfile = async (profile: AccessProfileAPI) => {
    setEditingProfile(profile);
    setNewProfileName(profile.acp_description || '');
    setNewIntegrationId(profile.acp_integrationid || '');
    setNewStatus(profile.acp_active ?? 1);
    setNewIsDefault(profile.acp_standard ?? 0);
    try {
      const perms = await permissionService.getByProfile(profile.acp_id);
      setSelectedPermissions(permissionsApiToLocal(perms));
    } catch {
      setSelectedPermissions(createEmptyPermissions());
    }
    setIsProfileModalOpen(true);
  };

  const handleDuplicateProfile = async (profile: AccessProfileAPI) => {
    try {
      setSaving(true);
      const newProfile = await accessProfileService.create({
        acp_description: `${profile.acp_description} (Cópia)`,
        acp_integrationid: profile.acp_integrationid,
        acp_active: profile.acp_active,
        acp_standard: 0,
      });
      const perms = await permissionService.getByProfile(profile.acp_id);
      if (perms.length > 0) {
        const bulkItems = perms.map(p => ({
          fea_id: p.fea_id,
          prm_create: p.prm_create,
          prm_view: p.prm_view,
          prm_edit: p.prm_edit,
          prm_delete: p.prm_delete,
        }));
        await permissionService.bulkSave(newProfile.acp_id, bulkItems);
      }
      await fetchData();
    } catch (err: any) {
      setError(err.message || 'Erro ao duplicar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveProfile = async () => {
    const duplicateMsg = validateAccessProfileUniqueness(
      profiles,
      newProfileName,
      editingProfile?.acp_id,
    );
    if (duplicateMsg) {
      setError(duplicateMsg);
      return;
    }

    try {
      setSaving(true);
      let profileId: number;

      if (editingProfile) {
        await accessProfileService.update(editingProfile.acp_id, {
          acp_description: newProfileName,
          acp_integrationid: newIntegrationId,
          acp_active: newStatus,
          acp_standard: newIsDefault,
        });
        profileId = editingProfile.acp_id;
      } else {
        const created = await accessProfileService.create({
          acp_description: newProfileName,
          acp_integrationid: newIntegrationId,
          acp_active: newStatus,
          acp_standard: newIsDefault,
        });
        profileId = created.acp_id;
      }

      await permissionService.bulkSave(profileId, permissionsLocalToApi(selectedPermissions));
      setIsProfileModalOpen(false);
      await fetchData();
      if (user?.acp_id === profileId) {
        await refreshPermissions();
      }
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar perfil');
    } finally {
      setSaving(false);
    }
  };

  const togglePermission = (feaId: string, type: keyof PermissionSet) => {
    setSelectedPermissions(prev => ({
      ...prev,
      [feaId]: {
        ...prev[feaId],
        [type]: !prev[feaId][type]
      }
    }));
  };

  const markAllPermissions = () => {
    setSelectedPermissions(createFullPermissions());
  };

  const unmarkAllPermissions = () => {
    setSelectedPermissions(createEmptyPermissions());
  };

  return (
    <div className="config-container">
      <PageHeader
        icon={SettingsIcon}
        iconTone="slate"
        title={t(NOMENCLATURE_KEYS.page.configuracoes)}
        subtitle={t(NOMENCLATURE_KEYS.page.subtitle_configuracoes)}
      />

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
                  {allowCreate && (
                    <button 
                      onClick={handleAddProfile}
                      className="config-primary-btn"
                      disabled={loading}
                    >
                      <Plus className="config-icon-sm" /> Adicionar Perfil
                    </button>
                  )}
                </div>

                {error && (
                  <div className="config-warning-card">
                    <div className="config-warning-header">
                      <AlertTriangle className="config-icon-md" />
                      <p className="config-warning-title">{error}</p>
                    </div>
                  </div>
                )}

                {loading ? (
                  <div style={{ display: 'flex', justifyContent: 'center', padding: '2rem' }}>
                    <Loader2 className="config-icon-lg" style={{ animation: 'spin 1s linear infinite' }} />
                  </div>
                ) : (
                  <>
                  <ListFiltersBar
                    searchValue={profileSearch}
                    onSearchChange={setProfileSearch}
                    searchPlaceholder="Buscar perfil de acesso..."
                    fields={[
                      {
                        id: 'status',
                        label: 'Status',
                        type: 'select',
                        options: [
                          { value: '1', label: 'Ativo' },
                          { value: '0', label: 'Inativo' },
                        ],
                      },
                    ]}
                    values={profileFilterValues}
                    onFieldChange={(id, value) =>
                      setProfileFilterValues((prev) => ({ ...prev, [id]: value }))
                    }
                    onClear={() => setProfileFilterValues({})}
                  />
                  <div className="config-table-scroll">
                    <table className="config-table">
                      <thead>
                        <tr className="config-thead-row">
                          <th className="config-th table-col-id">ID</th>
                          <th className="config-th">Nome do Perfil</th>
                          <th className="config-th">Status</th>
                          <th className="config-th">Permissões</th>
                          <th className="config-th-right">Ações</th>
                        </tr>
                      </thead>
                      <tbody className="config-tbody">
                        {filteredProfiles.length === 0 ? (
                          <tr className="config-row">
                            <td colSpan={5} className="config-cell">
                              Nenhum perfil encontrado com os filtros aplicados.
                            </td>
                          </tr>
                        ) : (
                        filteredProfiles.map(profile => (
                          <tr key={profile.acp_id} className="config-row">
                            <td className="config-cell table-cell-id">{profile.acp_id}</td>
                            <td className="config-cell">
                              <span className="config-profile-name">{profile.acp_description}</span>
                            </td>
                            <td className="config-cell">
                              <span className={clsx(
                                "config-company-status",
                                profile.acp_active === 1 ? "config-company-status-active" : "config-company-status-inactive"
                              )}>
                                {profile.acp_active === 1 ? 'Ativo' : 'Inativo'}
                              </span>
                            </td>
                            <td className="config-cell">
                              <span className="config-permissions-badge">
                                {profilePermissionsCount[profile.acp_id] ?? 0} módulos
                              </span>
                            </td>
                            <td className="config-cell-right">
                              <div className="config-actions">
                                {allowEdit && (
                                  <button 
                                    onClick={() => handleEditProfile(profile)}
                                    className="config-action-edit"
                                    title="Editar"
                                    disabled={saving}
                                  >
                                    <Edit2 className="config-icon-sm" />
                                  </button>
                                )}
                                {allowCreate && (
                                  <button 
                                    onClick={() => handleDuplicateProfile(profile)}
                                    className="config-action-copy"
                                    title="Duplicar"
                                    disabled={saving}
                                  >
                                    <Copy className="config-icon-sm" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                        )}
                      </tbody>
                    </table>
                  </div>
                  </>
                )}
              </motion.div>
            )}

            {activeTab === 'nomenclatura' && canViewNomenclatura && (
              <motion.div
                key="nomenclatura"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <NomenclaturaTab allowEdit={canEditNomenclatura} />
              </motion.div>
            )}

            {activeTab === 'origem' && (
              <motion.div
                key="origem"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <OrigemTab />
              </motion.div>
            )}

            {activeTab === 'integracao' && (
              <motion.div
                key="integracao"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
              >
                <IntegracaoTab />
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

                <form className="config-form" onSubmit={handleChangePassword}>
                  {passwordError && (
                    <p className="config-password-feedback config-password-feedback--error" role="alert">
                      {passwordError}
                    </p>
                  )}
                  {passwordSuccess && (
                    <p className="config-password-feedback config-password-feedback--success" role="status">
                      {passwordSuccess}
                    </p>
                  )}
                  <div className="config-form-group">
                    <label className="config-form-label" htmlFor="current-password">Senha Atual</label>
                    <input
                      id="current-password"
                      type="password"
                      placeholder="••••••••"
                      className="config-form-input"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      autoComplete="current-password"
                      disabled={passwordSaving}
                      required
                    />
                  </div>
                  <div className="config-form-group">
                    <label className="config-form-label" htmlFor="new-password">Nova Senha</label>
                    <input
                      id="new-password"
                      type="password"
                      placeholder="••••••••"
                      className="config-form-input"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      autoComplete="new-password"
                      disabled={passwordSaving}
                      minLength={6}
                      required
                    />
                  </div>
                  <div className="config-form-group">
                    <label className="config-form-label" htmlFor="confirm-password">Confirmar Nova Senha</label>
                    <input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      className="config-form-input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      autoComplete="new-password"
                      disabled={passwordSaving}
                      minLength={6}
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="config-submit-btn"
                    disabled={passwordSaving}
                  >
                    {passwordSaving ? (
                      <>
                        <Loader2 className="config-icon-sm config-spin" aria-hidden />
                        Atualizando...
                      </>
                    ) : (
                      'Atualizar Senha'
                    )}
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
        title={editingProfile ? `Editar Perfil: ${editingProfile.acp_description}` : "Novo Perfil de Acesso"}
      >
        <div className="config-modal-content">
          <div className="config-modal-form-row">
            <div className="config-form-group">
              <label className="config-form-label">Nome do Perfil *</label>
              <input 
                type="text" 
                value={newProfileName}
                onChange={(e) => setNewProfileName(e.target.value)}
                placeholder="Ex: Administrador" 
                className="config-form-input" 
              />
            </div>
            <div className="config-form-group">
              <label className="config-form-label">Identificador de Integração</label>
              <input 
                type="text" 
                value={newIntegrationId}
                onChange={(e) => setNewIntegrationId(e.target.value)}
                placeholder="Ex: admin" 
                className="config-form-input" 
              />
            </div>
          </div>

          <div className="config-modal-form-row">
            <div className="config-form-group">
              <label className="config-form-label">Status</label>
              <select 
                value={newStatus}
                onChange={(e) => setNewStatus(parseInt(e.target.value))}
                className="config-form-select"
              >
                <option value={1}>Ativo</option>
                <option value={0}>Inativo</option>
              </select>
            </div>
            <div className="config-form-group">
              <label className="config-form-label">Perfil Padrão</label>
              <select 
                value={newIsDefault}
                onChange={(e) => setNewIsDefault(parseInt(e.target.value))}
                className="config-form-select"
              >
                <option value={0}>Não</option>
                <option value={1}>Sim</option>
              </select>
            </div>
          </div>

          <div className="config-permissions-section">
            <div className="config-permissions-header">
              <span className="config-permissions-title">Permissões por Funcionalidade</span>
              <div className="config-permissions-bulk-actions">
                <button type="button" onClick={markAllPermissions} className="config-perm-bulk-btn">
                  Marcar todos
                </button>
                <button type="button" onClick={unmarkAllPermissions} className="config-perm-bulk-btn">
                  Desmarcar todos
                </button>
              </div>
            </div>

            <div className="config-perm-table-wrapper custom-scrollbar">
              <table className="config-perm-table">
                <thead>
                  <tr>
                    <th className="config-perm-th config-perm-th-func">FUNCIONALIDADE</th>
                    <th className="config-perm-th">ROTA</th>
                    <th className="config-perm-th">CRIAR</th>
                    <th className="config-perm-th">VISUALIZAR</th>
                    <th className="config-perm-th">EDITAR</th>
                    <th className="config-perm-th">EXCLUIR</th>
                  </tr>
                </thead>
                <tbody>
                  {features.map(feature => (
                    <tr key={feature.fea_id} className="config-perm-row">
                      <td className="config-perm-td-func">{feature.fea_description}</td>
                      <td className="config-perm-td-path">{feature.fea_path || '—'}</td>
                      {(['criar', 'visualizar', 'editar', 'excluir'] as const).map(type => (
                        <td key={type} className="config-perm-td">
                          <label className="config-perm-checkbox-label">
                            <input
                              type="checkbox"
                              checked={selectedPermissions[feature.fea_id.toString()]?.[type] || false}
                              onChange={() => togglePermission(feature.fea_id.toString(), type)}
                              disabled={!allowEdit}
                              className="config-perm-checkbox"
                            />
                          </label>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="config-modal-actions">
            <button 
              onClick={() => setIsProfileModalOpen(false)}
              className="config-modal-cancel-btn"
              disabled={saving}
            >
              <X className="config-icon-sm" />
              Cancelar
            </button>
            <button 
              onClick={handleSaveProfile}
              disabled={!newProfileName || saving}
              className="config-modal-save-btn"
            >
              {saving ? <Loader2 className="config-icon-sm" style={{ animation: 'spin 1s linear infinite' }} /> : <Check className="config-icon-sm" />}
              {saving ? 'Salvando...' : 'Salvar'}
            </button>
          </div>
        </div>
      </Modal>
      
    </div>
  );
};

export default Configuracoes;
