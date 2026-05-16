import React, { useState } from 'react';
import { epiTypeService, EPI_CATEGORIES, type EpiTypeAPI } from '../../services/epiTypeService';
import './EPIForm.css';

interface EpiTypeFormProps {
  onClose: () => void;
  onSaved?: () => void;
  initialData?: EpiTypeAPI;
}

export const EpiTypeForm = ({ onClose, onSaved, initialData }: EpiTypeFormProps) => {
  const [saving, setSaving] = useState(false);
  const [description, setDescription] = useState(initialData?.ept_description || '');
  const [category, setCategory] = useState(initialData?.ept_category || EPI_CATEGORIES[0]);
  const [active, setActive] = useState(initialData ? initialData.ept_active === 1 : true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Preencha o nome do tipo de EPI.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ept_active: active ? 1 : 0,
        ept_description: description.trim(),
        ept_category: category,
        usr_id_insert: null,
        usr_id_lastupdate: null,
      };

      if (initialData) {
        await epiTypeService.update(initialData.ept_id, payload);
      } else {
        await epiTypeService.create(payload);
      }
      onSaved?.();
      onClose();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar tipo de EPI');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="epi-form" onSubmit={handleSubmit}>
      <div className="epi-form-grid">
        <div className="epi-form-field">
          <label className="epi-form-label">Tipo de EPI <span className="epi-form-required">*</span></label>
          <input
            type="text"
            placeholder="Ex: Bota PVC"
            className="epi-form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="epi-form-field">
          <label className="epi-form-label">Categoria <span className="epi-form-required">*</span></label>
          <select className="epi-form-input" value={category} onChange={(e) => setCategory(e.target.value)} required>
            {EPI_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="epi-form-field">
          <label className="epi-form-label">Status</label>
          <select className="epi-form-input" value={active ? '1' : '0'} onChange={(e) => setActive(e.target.value === '1')}>
            <option value="1">Ativo</option>
            <option value="0">Inativo</option>
          </select>
        </div>
      </div>
      <div className="epi-form-actions">
        <button type="button" onClick={onClose} className="epi-form-cancel" disabled={saving}>Cancelar</button>
        <button type="submit" className="epi-form-submit" disabled={saving}>
          {saving ? 'Salvando...' : initialData ? 'Salvar Alterações' : 'Salvar Tipo'}
        </button>
      </div>
    </form>
  );
};
