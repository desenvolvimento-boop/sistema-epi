import React, { useState } from 'react';
import {
  epiVariantService,
  INTEGRATION_SOURCES,
  type EpiVariantAPI,
} from '../../services/epiVariantService';
import type { EpiTypeAPI } from '../../services/epiTypeService';
import './EPIForm.css';

interface EpiVariantFormProps {
  eptId?: number;
  types?: EpiTypeAPI[];
  onClose: () => void;
  onSaved?: () => void;
  initialData?: EpiVariantAPI;
}

export const EpiVariantForm = ({ eptId, types = [], onClose, onSaved, initialData }: EpiVariantFormProps) => {
  const activeTypes = types.filter((t) => t.ept_active === 1);
  const [selectedEptId, setSelectedEptId] = useState<number>(
    initialData?.ept_id ?? eptId ?? activeTypes[0]?.ept_id ?? 0
  );
  const isIntegrated =
    initialData?.epv_integration_source && initialData.epv_integration_source !== 'Manual';
  const [saving, setSaving] = useState(false);
  const [showIntegration, setShowIntegration] = useState(
    !!(
      initialData?.epv_integration_id ||
      (initialData?.epv_integration_source && initialData.epv_integration_source !== 'Manual')
    )
  );

  const [manufacturer, setManufacturer] = useState(initialData?.epv_manufacturer || '');
  const [model, setModel] = useState(initialData?.epv_model || '');
  const [ca, setCa] = useState(initialData?.epv_ca || '');
  const [lifespanDays, setLifespanDays] = useState<string>(
    initialData?.epv_lifespan_days != null ? String(initialData.epv_lifespan_days) : ''
  );
  const [technicalDescription, setTechnicalDescription] = useState(
    initialData?.epv_technical_description || ''
  );
  const [active, setActive] = useState(initialData ? initialData.epv_active === 1 : true);
  const [integrationSource, setIntegrationSource] = useState(
    initialData?.epv_integration_source || 'Manual'
  );
  const [integrationId, setIntegrationId] = useState(initialData?.epv_integration_id || '');
  const [externalCode, setExternalCode] = useState(initialData?.epv_external_code || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!manufacturer.trim() || !ca.trim()) {
      alert('Fabricante e CA são obrigatórios.');
      return;
    }
    const resolvedEptId = initialData?.ept_id ?? selectedEptId;
    if (!resolvedEptId) {
      alert('Selecione o tipo de EPI.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        ept_id: resolvedEptId,
        epv_active: active ? 1 : 0,
        epv_manufacturer: manufacturer.trim(),
        epv_model: model.trim() || null,
        epv_ca: ca.trim(),
        epv_lifespan_days: lifespanDays ? Number(lifespanDays) : null,
        epv_technical_description: technicalDescription.trim() || null,
        epv_integration_id: integrationId.trim() || null,
        epv_integration_source: integrationSource,
        epv_external_code: externalCode.trim() || null,
        usr_id_insert: null,
        usr_id_lastupdate: null,
      };

      if (initialData) {
        await epiVariantService.update(initialData.epv_id, payload);
      } else {
        await epiVariantService.create(payload);
      }
      onSaved?.();
      onClose();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar variante');
    } finally {
      setSaving(false);
    }
  };

  const showTypeSelect = !initialData && activeTypes.length > 0;

  return (
    <form className="epi-form" onSubmit={handleSubmit}>
      <div className="epi-form-grid">
        {showTypeSelect && (
          <div className="epi-form-field epi-form-field-full">
            <label className="epi-form-label">
              Tipo de EPI <span className="epi-form-required">*</span>
            </label>
            <select
              className="epi-form-input"
              value={selectedEptId || ''}
              onChange={(e) => setSelectedEptId(Number(e.target.value))}
              required
            >
              <option value="" disabled>
                Selecione o tipo de EPI
              </option>
              {activeTypes.map((t) => (
                <option key={t.ept_id} value={t.ept_id}>
                  {t.ept_description} — {t.ept_category}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className="epi-form-field">
          <label className="epi-form-label">Fabricante <span className="epi-form-required">*</span></label>
          <input
            type="text"
            placeholder="Ex: Bracol"
            className="epi-form-input"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            required
            disabled={!!isIntegrated}
          />
        </div>
        <div className="epi-form-field">
          <label className="epi-form-label">Modelo</label>
          <input
            type="text"
            placeholder="Ex: PVC Plus"
            className="epi-form-input"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            disabled={!!isIntegrated}
          />
        </div>
        <div className="epi-form-field">
          <label className="epi-form-label">CA <span className="epi-form-required">*</span></label>
          <input
            type="text"
            placeholder="Ex: 12345"
            className="epi-form-input"
            value={ca}
            onChange={(e) => setCa(e.target.value)}
            required
            disabled={!!isIntegrated}
          />
        </div>
        <div className="epi-form-field">
          <label className="epi-form-label">Vida útil (dias) — vazio usa do tipo</label>
          <input
            type="number"
            min={1}
            className="epi-form-input"
            value={lifespanDays}
            onChange={(e) => setLifespanDays(e.target.value)}
            placeholder="Padrão do tipo"
          />
        </div>
        <div className="epi-form-field">
          <label className="epi-form-label">Status</label>
          <select
            className="epi-form-input"
            value={active ? '1' : '0'}
            onChange={(e) => setActive(e.target.value === '1')}
          >
            <option value="1">Ativo</option>
            <option value="0">Inativo</option>
          </select>
        </div>
        <div className="epi-form-field epi-form-field-full">
          <label className="epi-form-label">Descrição técnica</label>
          <textarea
            placeholder="Especificações da homologação..."
            className="epi-form-textarea"
            value={technicalDescription}
            onChange={(e) => setTechnicalDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="epi-form-integration-toggle">
        <button type="button" className="epi-form-link-btn" onClick={() => setShowIntegration(!showIntegration)}>
          {showIntegration ? 'Ocultar' : 'Mostrar'} Integração ERP
        </button>
      </div>

      {showIntegration && (
        <div className="epi-form-integration">
          {isIntegrated && (
            <p className="epi-form-integration-note">
              Registro importado de {initialData?.epv_integration_source}. Campos mestres bloqueados.
            </p>
          )}
          <div className="epi-form-grid">
            <div className="epi-form-field">
              <label className="epi-form-label">Sistema de origem</label>
              <select
                className="epi-form-input"
                value={integrationSource}
                onChange={(e) => setIntegrationSource(e.target.value)}
                disabled={!!isIntegrated}
              >
                {INTEGRATION_SOURCES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="epi-form-field">
              <label className="epi-form-label">ID no ERP (TOTVS)</label>
              <input
                type="text"
                className="epi-form-input"
                value={integrationId}
                onChange={(e) => setIntegrationId(e.target.value)}
                disabled={!!isIntegrated}
              />
            </div>
            <div className="epi-form-field">
              <label className="epi-form-label">Código alternativo</label>
              <input
                type="text"
                className="epi-form-input"
                value={externalCode}
                onChange={(e) => setExternalCode(e.target.value)}
                disabled={!!isIntegrated}
              />
            </div>
          </div>
        </div>
      )}

      <div className="epi-form-actions">
        <button type="button" onClick={onClose} className="epi-form-cancel" disabled={saving}>
          Cancelar
        </button>
        <button type="submit" className="epi-form-submit" disabled={saving}>
          {saving ? 'Salvando...' : initialData ? 'Salvar Alterações' : 'Salvar Variante'}
        </button>
      </div>
    </form>
  );
};
