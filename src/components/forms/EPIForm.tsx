import React, { useState } from 'react';
import { epiService, EPI_CATEGORIES, INTEGRATION_SOURCES, type EpiAPI } from '../../services/epiService';
import './EPIForm.css';

interface EPIFormProps {
  onClose: () => void;
  onSaved?: () => void;
  initialData?: EpiAPI;
}

export const EPIForm = ({ onClose, onSaved, initialData }: EPIFormProps) => {
  const isIntegrated = initialData?.epi_integration_source && initialData.epi_integration_source !== 'Manual';
  const [saving, setSaving] = useState(false);
  const [showIntegration, setShowIntegration] = useState(
    !!(initialData?.epi_integration_id || (initialData?.epi_integration_source && initialData.epi_integration_source !== 'Manual'))
  );

  const [description, setDescription] = useState(initialData?.epi_description || '');
  const [ca, setCa] = useState(initialData?.epi_ca || '');
  const [manufacturer, setManufacturer] = useState(initialData?.epi_manufacturer || '');
  const [category, setCategory] = useState(initialData?.epi_category || EPI_CATEGORIES[0]);
  const [lifespanDays, setLifespanDays] = useState(String(initialData?.epi_lifespan_days || ''));
  const [technicalDescription, setTechnicalDescription] = useState(initialData?.epi_technical_description || '');
  const [active, setActive] = useState(initialData ? initialData.epi_active === 1 : true);
  const [integrationSource, setIntegrationSource] = useState(initialData?.epi_integration_source || 'Manual');
  const [integrationId, setIntegrationId] = useState(initialData?.epi_integration_id || '');
  const [externalCode, setExternalCode] = useState(initialData?.epi_external_code || '');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !ca.trim() || !manufacturer.trim() || !lifespanDays) {
      alert('Preencha os campos obrigatórios.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        epi_active: active ? 1 : 0,
        epi_description: description.trim(),
        epi_ca: ca.trim(),
        epi_manufacturer: manufacturer.trim(),
        epi_category: category,
        epi_lifespan_days: Number(lifespanDays),
        epi_technical_description: technicalDescription.trim() || null,
        epi_integration_id: integrationId.trim() || null,
        epi_integration_source: integrationSource,
        epi_external_code: externalCode.trim() || null,
        usr_id_insert: null,
        usr_id_lastupdate: null,
      };

      if (initialData) {
        await epiService.update(initialData.epi_id, payload);
      } else {
        await epiService.create(payload);
      }
      onSaved?.();
      onClose();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar EPI');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="epi-form" onSubmit={handleSubmit}>
      <div className="epi-form-grid">
        <div className="epi-form-field">
          <label className="epi-form-label">Nome do EPI <span className="epi-form-required">*</span></label>
          <input
            type="text"
            placeholder="Ex: Capacete de Segurança"
            className="epi-form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={!!isIntegrated}
          />
        </div>
        <div className="epi-form-field">
          <label className="epi-form-label">Certificado de Aprovação (CA) <span className="epi-form-required">*</span></label>
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
          <label className="epi-form-label">Fabricante <span className="epi-form-required">*</span></label>
          <input
            type="text"
            placeholder="Ex: 3M"
            className="epi-form-input"
            value={manufacturer}
            onChange={(e) => setManufacturer(e.target.value)}
            required
            disabled={!!isIntegrated}
          />
        </div>
        <div className="epi-form-field">
          <label className="epi-form-label">Categoria <span className="epi-form-required">*</span></label>
          <select
            className="epi-form-input"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            disabled={!!isIntegrated}
          >
            {EPI_CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
        <div className="epi-form-field">
          <label className="epi-form-label">Vida Útil (Dias) <span className="epi-form-required">*</span></label>
          <input
            type="number"
            min={1}
            placeholder="Ex: 180"
            className="epi-form-input"
            value={lifespanDays}
            onChange={(e) => setLifespanDays(e.target.value)}
            required
            disabled={!!isIntegrated}
          />
        </div>
        <div className="epi-form-field">
          <label className="epi-form-label">Status</label>
          <select className="epi-form-input" value={active ? '1' : '0'} onChange={(e) => setActive(e.target.value === '1')}>
            <option value="1">Ativo</option>
            <option value="0">Inativo</option>
          </select>
        </div>
        <div className="epi-form-field epi-form-field-full">
          <label className="epi-form-label">Descrição Técnica</label>
          <textarea
            placeholder="Especificações técnicas do equipamento..."
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
              Registro importado de {initialData?.epi_integration_source}. Campos mestres bloqueados.
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
                placeholder="Ex: PROD-00012345"
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
            {initialData?.epi_integration_sync_at && (
              <div className="epi-form-field">
                <label className="epi-form-label">Última sincronização</label>
                <input
                  type="text"
                  className="epi-form-input"
                  value={new Date(initialData.epi_integration_sync_at).toLocaleString('pt-BR')}
                  readOnly
                  disabled
                />
              </div>
            )}
          </div>
        </div>
      )}

      <div className="epi-form-actions">
        <button type="button" onClick={onClose} className="epi-form-cancel" disabled={saving}>
          Cancelar
        </button>
        <button type="submit" className="epi-form-submit" disabled={saving}>
          {saving ? 'Salvando...' : initialData ? 'Salvar Alterações' : 'Salvar EPI'}
        </button>
      </div>
    </form>
  );
};
