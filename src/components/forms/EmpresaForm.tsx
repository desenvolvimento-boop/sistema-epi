import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { employerService, type EmployerAPI } from '../../services/employerService';
import './EmpresaForm.css';

interface EmpresaFormProps {
  onClose: () => void;
  onSaved?: () => void;
  initialData?: EmployerAPI;
}

export const EmpresaForm = ({ onClose, onSaved, initialData }: EmpresaFormProps) => {
  const isEditing = !!initialData;
  const [saving, setSaving] = useState(false);
  const [ativo, setAtivo] = useState(initialData ? initialData.emr_active === 1 : true);
  const [razaoSocial, setRazaoSocial] = useState(initialData?.emr_name || initialData?.epr_description || '');
  const [nomeFantasia, setNomeFantasia] = useState(initialData?.emr_trade_name || initialData?.epr_fantasyname || '');
  const [cnpj, setCnpj] = useState(initialData?.emr_tax_id || initialData?.epr_cnpj || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!razaoSocial.trim()) {
      alert('Informe a razão social ou nome da empresa.');
      return;
    }
    setSaving(true);
    try {
      const payload = {
        emr_active: ativo ? 1 : 0,
        emr_name: razaoSocial.trim(),
        emr_trade_name: nomeFantasia.trim() || null,
        emr_tax_id: cnpj.trim() || null,
      };
      if (isEditing && initialData) {
        await employerService.update(initialData.emr_id, payload);
      } else {
        await employerService.create(payload);
      }
      onSaved?.();
      onClose();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar empresa');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="empresa-form" onSubmit={handleSubmit}>
      <div className="empresa-form-toggle-row">
        <span className="empresa-form-label">Ativa</span>
        <button
          type="button"
          className={`empresa-form-toggle ${ativo ? 'empresa-form-toggle--active' : ''}`}
          onClick={() => setAtivo(!ativo)}
          aria-label="Toggle ativa"
        >
          <span className="empresa-form-toggle-thumb" />
        </button>
      </div>

      <div className="empresa-form-field">
        <label className="empresa-form-label">
          Razão social / Nome <span className="empresa-form-required">*</span>
        </label>
        <input
          className="empresa-form-input"
          value={razaoSocial}
          onChange={(e) => setRazaoSocial(e.target.value)}
          placeholder="Ex: Construtora ABC Ltda"
          required
        />
      </div>

      <div className="empresa-form-field">
        <label className="empresa-form-label">Nome fantasia</label>
        <input
          className="empresa-form-input"
          value={nomeFantasia}
          onChange={(e) => setNomeFantasia(e.target.value)}
          placeholder="Opcional"
        />
      </div>

      <div className="empresa-form-field">
        <label className="empresa-form-label">CNPJ</label>
        <input
          className="empresa-form-input"
          value={cnpj}
          onChange={(e) => setCnpj(e.target.value)}
          placeholder="00.000.000/0000-00"
        />
      </div>

      <div className="empresa-form-actions">
        <button type="button" className="empresa-form-cancel" onClick={onClose} disabled={saving}>
          Cancelar
        </button>
        <button type="submit" className="empresa-form-submit" disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="empresa-form-spin" />
              Salvando...
            </>
          ) : (
            isEditing ? 'Salvar' : 'Cadastrar empresa'
          )}
        </button>
      </div>
    </form>
  );
};
