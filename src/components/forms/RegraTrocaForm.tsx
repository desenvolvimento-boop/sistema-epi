import React, { useEffect, useState } from 'react';
import { epiTypeService, epiTypeCategoryLabel, type EpiTypeAPI } from '../../services/epiTypeService';
import { useAuth } from '../../contexts/AuthContext';
import './RegraTrocaForm.css';

interface RegraTrocaFormProps {
  onClose: () => void;
  onSaved?: () => void;
  initialData?: EpiTypeAPI;
  onManageTriggers?: () => void;
}

export const RegraTrocaForm = ({
  onClose,
  onSaved,
  initialData,
  onManageTriggers,
}: RegraTrocaFormProps) => {
  const { user } = useAuth();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lifespanDays, setLifespanDays] = useState(initialData?.ept_lifespan_days ?? 180);

  useEffect(() => {
    if (initialData) {
      setLifespanDays(initialData.ept_lifespan_days ?? 180);
      setError(null);
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!initialData) return;

    setSaving(true);
    setError(null);
    try {
      await epiTypeService.update(initialData.ept_id, {
        ept_lifespan_days: Number(lifespanDays) || 180,
        usr_id_lastupdate: user?.usr_id ?? null,
      });
      onSaved?.();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar regra');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="regra-troca-form" onSubmit={handleSubmit}>
      {error && <div className="regra-troca-form-error">{error}</div>}

      <div className="regra-troca-form-grid">
        <div className="regra-troca-form-field">
          <label className="regra-troca-form-label">Tipo de EPI</label>
          <div className="regra-troca-form-static">{initialData?.ept_description ?? '—'}</div>
        </div>
        <div className="regra-troca-form-field">
          <label className="regra-troca-form-label">Categoria</label>
          <div className="regra-troca-form-static">
            {initialData ? epiTypeCategoryLabel(initialData) : '—'}
          </div>
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
            Prazo padrão de troca para este tipo. Variantes podem sobrescrever em Variantes de EPI.
          </p>
        </div>
      </div>

      {onManageTriggers && (
        <button type="button" className="regra-troca-form-link" onClick={onManageTriggers}>
          Gerenciar gatilhos deste tipo
        </button>
      )}

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
