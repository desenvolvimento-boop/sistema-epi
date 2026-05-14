import React, { useState, useEffect } from 'react';
import { Check, X, Search, Loader2, Plus } from 'lucide-react';
import { User } from '../../types/system.types';
import { userService } from '../../services/userService';
import { accessProfileService, type AccessProfileAPI } from '../../services/accessProfileService';
import { userGroupService, type UserGroupAPI } from '../../services/userGroupService';
import { UserGroupCrudModal } from './UserGroupCrudModal';
import './UsuarioForm.css';

interface UsuarioFormProps {
  onClose: () => void;
  onSaved: () => void;
  initialData?: User;
}

export const UsuarioForm = ({ onClose, onSaved, initialData }: UsuarioFormProps) => {
  const [ativo, setAtivo] = useState(initialData ? initialData.usr_active === 1 : true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [accessProfiles, setAccessProfiles] = useState<AccessProfileAPI[]>([]);
  const [loadingProfiles, setLoadingProfiles] = useState(true);
  const [selectedAcpId, setSelectedAcpId] = useState<string>(
    initialData?.acp_id ? String(initialData.acp_id) : ''
  );

  const [userGroups, setUserGroups] = useState<UserGroupAPI[]>([]);
  const [loadingGroups, setLoadingGroups] = useState(true);
  const [selectedGroupId, setSelectedGroupId] = useState<string>(
    initialData?.agg_id ? String(initialData.agg_id) : ''
  );

  const [isUserTypeModalOpen, setIsUserTypeModalOpen] = useState(false);

  const handleGroupCreated = (group: UserGroupAPI) => {
    setUserGroups(prev => [...prev, group]);
    setSelectedGroupId(String(group.usg_id));
  };

  const isEdit = !!initialData;

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        const allProfiles = await accessProfileService.getAll();
        const activeProfiles = allProfiles.filter(p => p.acp_active === 1);
        setAccessProfiles(activeProfiles);
      } catch (err) {
        console.error('Erro ao carregar perfis de acesso:', err);
        setAccessProfiles([]);
      } finally {
        setLoadingProfiles(false);
      }
    };
    const fetchUserGroups = async () => {
      try {
        const groups = await userGroupService.getAll();
        const activeGroups = groups.filter(g => g.usg_active === 1);
        setUserGroups(activeGroups);
      } catch (err) {
        console.error('Erro ao carregar tipos de usuário:', err);
        setUserGroups([]);
      } finally {
        setLoadingGroups(false);
      }
    };
    fetchProfiles();
    fetchUserGroups();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const acpId = selectedAcpId ? parseInt(selectedAcpId) : null;
    const selectedProfile = accessProfiles.find(p => p.acp_id === acpId);
    const aggId = selectedGroupId ? parseInt(selectedGroupId) : null;
    const selectedGroup = userGroups.find(g => g.usg_id === aggId);

    const payload: Record<string, any> = {
      usr_active: ativo ? 1 : 0,
      usr_full_name: fd.get('usr_full_name') as string || null,
      usr_username: fd.get('usr_username') as string || null,
      usr_email: fd.get('usr_email') as string || null,
      usr_agent_type: selectedGroup?.usg_integrationid || null,
      agg_id: aggId,
      acp_id: acpId,
      usr_access_profile: selectedProfile?.acp_description || null,
      usr_phone_country_code: fd.get('usr_phone_country_code') as string || null,
      usr_phone_area_code: fd.get('usr_phone_area_code') as string || null,
      usr_phone_number: fd.get('usr_phone_number') as string || null,
      usr_mobile_country_code: fd.get('usr_mobile_country_code') as string || null,
      usr_mobile_area_code: fd.get('usr_mobile_area_code') as string || null,
      usr_mobile_number: fd.get('usr_mobile_number') as string || null,
      usr_zip_code: fd.get('usr_zip_code') as string || null,
      usr_country: fd.get('usr_country') as string || null,
      usr_state: fd.get('usr_state') as string || null,
      usr_city: fd.get('usr_city') as string || null,
      usr_neighborhood: fd.get('usr_neighborhood') as string || null,
      usr_street: fd.get('usr_street') as string || null,
      usr_street_number: fd.get('usr_street_number') as string || null,
      usr_complement: fd.get('usr_complement') as string || null,
      usr_notes: fd.get('usr_notes') as string || null,
    };

    const password = fd.get('usr_password') as string;
    if (password) {
      payload.usr_password = password;
    }

    try {
      if (isEdit) {
        await userService.update(initialData.usr_id, payload);
      } else {
        await userService.create(payload as any);
      }
      onSaved();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar usuário');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="usuario-form" onSubmit={handleSubmit}>
      {error && (
        <div className="usuario-form-error">
          {error}
        </div>
      )}

      <div className="usuario-form-toggle-row">
        <span className="usuario-form-toggle-label">Ativo</span>
        <button
          type="button"
          className={`usuario-form-toggle ${ativo ? 'usuario-form-toggle--active' : ''}`}
          onClick={() => setAtivo(!ativo)}
          aria-label="Toggle ativo"
        >
          <span className="usuario-form-toggle-thumb" />
        </button>
      </div>

      <div className="usuario-form-grid">
        <div className="usuario-form-field">
          <label className="usuario-form-label">Nome <span className="usuario-form-required">*</span></label>
          <input type="text" name="usr_full_name" placeholder="Nome completo" defaultValue={initialData?.usr_full_name ?? ''} className="usuario-form-input" required />
        </div>
        <div className="usuario-form-field">
          <label className="usuario-form-label">Login <span className="usuario-form-required">*</span></label>
          <input type="text" name="usr_username" placeholder="Nome de usuário" defaultValue={initialData?.usr_username ?? ''} className="usuario-form-input" required />
        </div>
      </div>

      <div className="usuario-form-grid">
        <div className="usuario-form-field">
          <label className="usuario-form-label">E-mail <span className="usuario-form-required">*</span></label>
          <input type="email" name="usr_email" placeholder="E-mail" defaultValue={initialData?.usr_email ?? ''} className="usuario-form-input" required />
        </div>
        <div className="usuario-form-field">
          <label className="usuario-form-label">Senha <span className="usuario-form-required">*</span></label>
          <input type="password" name="usr_password" placeholder={isEdit ? 'Deixe vazio para manter' : 'Senha'} className="usuario-form-input" required={!isEdit} />
        </div>
      </div>

      <div className="usuario-form-grid">
        <div className="usuario-form-field">
          <label className="usuario-form-label">Tipo de Usuário</label>
          <div className="usuario-form-select-with-action">
            <select
              className="usuario-form-input"
              value={selectedGroupId}
              onChange={(e) => setSelectedGroupId(e.target.value)}
              disabled={loadingGroups}
            >
              <option value="" disabled>
                {loadingGroups ? 'Carregando tipos...' : 'Selecione...'}
              </option>
              {userGroups.map(g => (
                <option key={g.usg_id} value={String(g.usg_id)}>
                  {g.usg_integrationid}
                </option>
              ))}
            </select>
            <button
              type="button"
              className="usuario-form-add-type-btn"
              onClick={() => setIsUserTypeModalOpen(true)}
              title="Adicionar novo tipo de usuário"
            >
              <Plus className="usuario-form-add-type-icon" />
            </button>
          </div>

          <UserGroupCrudModal
            isOpen={isUserTypeModalOpen}
            onClose={() => setIsUserTypeModalOpen(false)}
            onGroupCreated={handleGroupCreated}
          />
        </div>
        <div className="usuario-form-field">
          <label className="usuario-form-label">Perfil de Acesso <span className="usuario-form-required">*</span></label>
          <select
            className="usuario-form-input"
            required
            value={selectedAcpId}
            onChange={(e) => setSelectedAcpId(e.target.value)}
            disabled={loadingProfiles}
          >
            <option value="" disabled>
              {loadingProfiles ? 'Carregando perfis...' : 'Selecione...'}
            </option>
            {accessProfiles.map(profile => (
              <option key={profile.acp_id} value={String(profile.acp_id)}>
                {profile.acp_description}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="usuario-form-grid">
        <div className="usuario-form-field">
          <label className="usuario-form-label">Telefone</label>
          <div className="usuario-form-phone-group">
            <input type="text" name="usr_phone_country_code" placeholder="DDI" defaultValue={initialData?.usr_phone_country_code ?? ''} className="usuario-form-input usuario-form-phone-ddi" />
            <input type="text" name="usr_phone_area_code" placeholder="DDD" defaultValue={initialData?.usr_phone_area_code ?? ''} className="usuario-form-input usuario-form-phone-ddd" />
            <input type="text" name="usr_phone_number" placeholder="Número" defaultValue={initialData?.usr_phone_number ?? ''} className="usuario-form-input usuario-form-phone-numero" />
          </div>
        </div>
        <div className="usuario-form-field">
          <label className="usuario-form-label">Celular</label>
          <div className="usuario-form-phone-group">
            <input type="text" name="usr_mobile_country_code" placeholder="DDI" defaultValue={initialData?.usr_mobile_country_code ?? ''} className="usuario-form-input usuario-form-phone-ddi" />
            <input type="text" name="usr_mobile_area_code" placeholder="DDD" defaultValue={initialData?.usr_mobile_area_code ?? ''} className="usuario-form-input usuario-form-phone-ddd" />
            <input type="text" name="usr_mobile_number" placeholder="Número" defaultValue={initialData?.usr_mobile_number ?? ''} className="usuario-form-input usuario-form-phone-numero" />
          </div>
        </div>
      </div>

      <div className="usuario-form-grid">
        <div className="usuario-form-field">
          <label className="usuario-form-label">CEP</label>
          <div className="usuario-form-cep-group">
            <input type="text" name="usr_zip_code" placeholder="00000-000" defaultValue={initialData?.usr_zip_code ?? ''} className="usuario-form-input usuario-form-cep-input" />
            <button type="button" className="usuario-form-cep-btn" aria-label="Buscar CEP">
              <Search className="usuario-form-cep-icon" />
            </button>
          </div>
        </div>
        <div className="usuario-form-field">
          <label className="usuario-form-label">País</label>
          <input type="text" name="usr_country" placeholder="País" defaultValue={initialData?.usr_country ?? ''} className="usuario-form-input" />
        </div>
      </div>

      <div className="usuario-form-grid">
        <div className="usuario-form-field">
          <label className="usuario-form-label">Estado</label>
          <input type="text" name="usr_state" placeholder="UF" defaultValue={initialData?.usr_state ?? ''} className="usuario-form-input" />
        </div>
        <div className="usuario-form-field">
          <label className="usuario-form-label">Cidade</label>
          <input type="text" name="usr_city" placeholder="Cidade" defaultValue={initialData?.usr_city ?? ''} className="usuario-form-input" />
        </div>
      </div>

      <div className="usuario-form-grid">
        <div className="usuario-form-field">
          <label className="usuario-form-label">Bairro</label>
          <input type="text" name="usr_neighborhood" placeholder="Bairro" defaultValue={initialData?.usr_neighborhood ?? ''} className="usuario-form-input" />
        </div>
        <div className="usuario-form-field">
          <label className="usuario-form-label">Logradouro</label>
          <input type="text" name="usr_street" placeholder="Rua, Avenida, etc" defaultValue={initialData?.usr_street ?? ''} className="usuario-form-input" />
        </div>
      </div>

      <div className="usuario-form-grid">
        <div className="usuario-form-field">
          <label className="usuario-form-label">Número</label>
          <input type="text" name="usr_street_number" placeholder="Nº" defaultValue={initialData?.usr_street_number ?? ''} className="usuario-form-input" />
        </div>
        <div className="usuario-form-field">
          <label className="usuario-form-label">Complemento</label>
          <input type="text" name="usr_complement" placeholder="Complemento" defaultValue={initialData?.usr_complement ?? ''} className="usuario-form-input" />
        </div>
      </div>

      <div className="usuario-form-field usuario-form-full">
        <label className="usuario-form-label">Observação</label>
        <textarea name="usr_notes" placeholder="Observações adicionais" defaultValue={initialData?.usr_notes ?? ''} className="usuario-form-textarea" rows={3} />
      </div>

      <div className="usuario-form-actions">
        <button type="submit" className="usuario-form-submit" disabled={loading}>
          {loading ? (
            <Loader2 className="usuario-form-btn-icon usuario-form-spinner" />
          ) : (
            <Check className="usuario-form-btn-icon" />
          )}
          {loading ? 'Salvando...' : isEdit ? 'Salvar Alterações' : 'Salvar'}
        </button>
        <button type="button" onClick={onClose} className="usuario-form-cancel" disabled={loading}>
          <X className="usuario-form-btn-icon" />
          Cancelar
        </button>
      </div>
    </form>
  );
};
