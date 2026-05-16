import React, { useState } from 'react';
import { epiTypeService, type EpiTypeAPI } from '../../services/epiTypeService';
import './RegraTrocaForm.css';

interface RegraTrocaFormProps {
  onClose: () => void;
  onSaved?: () => void;
  initialData?: EpiTypeAPI;
}

export const RegraTrocaForm = ({ onClose, onSaved, initialData }: RegraTrocaFormProps) => {
  const [saving, setSaving] = useState(false);
  const [lifespanDays, setLifespanDays] = useState(initialData?.ept_lifespan_days ?? 180);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData) return;

    setSaving(true);
    try {
      await epiTypeService.update(initialData.ept_id, {
        ept_lifespan_days: Number(lifespanDays) || 180,
        usr_id_lastupdate: null,
      });
      onSaved?.();
      onClose();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar regra');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="regra-troca-form" onSubmit={handleSubmit}>
      <div className="regra-troca-form-grid">
        <div className="regra-troca-form-field">
          <label className="regra-troca-form-label">Tipo de EPI</label>
          <div className="regra-troca-form-static">{initialData?.ept_description ?? '—'}</div>
        </div>
        <div className="regra-troca-form-field">
          <label className="regra-troca-form-label">Categoria</label>
          <div className="regra-troca-form-static">{initialData?.ept_category ?? '—'}</div>
        </div>
        <div className="regra-troca-form-field">
          <label className="regra-troca-form-label">Vida Útil Padrão (Dias)</label>
          <input
            type="number"
            min={1}
            placeholder="Ex: 180"
            className="regra-troca-form-input"
            value={lifespanDays}
            onChange={(e) => setLifespanDays(Number(e.target.value))}
            required
          />
          <p className="regra-troca-form-hint">
            Define o prazo padrão de troca para este tipo. Variantes podem sobrescrever com vida útil própria.
          </p>
        </div>
      </div>

      <div className="regra-troca-form-actions">
        <button type="button" onClick={onClose} className="regra-troca-form-cancel" disabled={saving}>
          Cancelar
        </button>
        <button type="submit" className="regra-troca-form-submit" disabled={saving}>
          {saving ? 'Salvando...' : 'Salvar Alterações'}
        </button>
      </div>
    </form>
  );
};
