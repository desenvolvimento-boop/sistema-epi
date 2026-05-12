import React, { useState } from 'react';
import { Check, X, Search, Loader2 } from 'lucide-react';
import { User } from '../../types/system.types';
import { userService } from '../../services/userService';
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

  const isEdit = !!initialData;

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const form = e.currentTarget;
    const fd = new FormData(form);

    const payload: Record<string, any> = {
      usr_active: ativo ? 1 : 0,
      usr_full_name: fd.get('usr_full_name') as string || null,
      usr_username: fd.get('usr_username') as string || null,
      usr_email: fd.get('usr_email') as string || null,
      usr_agent_type: fd.get('usr_agent_type') as string || null,
      usr_access_profile: fd.get('usr_access_profile') as string || null,
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
      // #region agent log
      console.log('[DEBUG-4ed3d2] handleSubmit:', { isEdit, usrId: initialData?.usr_id, usrIdType: typeof initialData?.usr_id });
      // #endregion
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
          <input type="password" name="usr_password" placeholder={isEdit ? 'Deixe vazio para manter' : 'Senha'} className="usuario-form-input" required />
        </div>
      </div>

      <div className="usuario-form-grid">
        <div className="usuario-form-field">
          <label className="usuario-form-label">Tipo de Agente</label>
          <select name="usr_agent_type" className="usuario-form-input" defaultValue={initialData?.usr_agent_type ?? ''}>
            <option value="" disabled>Selecione...</option>
            <option value="Interno">Interno</option>
            <option value="Externo">Externo</option>
            <option value="Terceirizado">Terceirizado</option>
          </select>
        </div>
        <div className="usuario-form-field">
          <label className="usuario-form-label">Perfil de Acesso <span className="usuario-form-required">*</span></label>
          <select name="usr_access_profile" className="usuario-form-input" required defaultValue={initialData?.usr_access_profile ?? ''}>
            <option value="" disabled>Selecione...</option>
            <option value="Administrador">Administrador</option>
            <option value="Gestor">Gestor de Unidade</option>
            <option value="Operador">Operador de Almoxarifado</option>
            <option value="Auditor">Auditor</option>
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
