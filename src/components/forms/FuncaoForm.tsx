import React, { useState, useEffect } from 'react';
import { roleService, type RoleAPI } from '../../services/roleService';
import { epiService, type EpiAPI } from '../../services/epiService';
import { INTEGRATION_SOURCES } from '../../services/epiService';
import './FuncaoForm.css';

interface FuncaoFormProps {
  onClose: () => void;
  onSaved?: () => void;
  initialData?: RoleAPI;
}

export const FuncaoForm = ({ onClose, onSaved, initialData }: FuncaoFormProps) => {
  const isIntegrated = initialData?.rol_integration_source && initialData.rol_integration_source !== 'Manual';
  const [saving, setSaving] = useState(false);
  const [episCatalog, setEpisCatalog] = useState<EpiAPI[]>([]);
  const [selectedEpiIds, setSelectedEpiIds] = useState<number[]>([]);
  const [showIntegration, setShowIntegration] = useState(
    !!(initialData?.rol_integration_id || (initialData?.rol_integration_source && initialData.rol_integration_source !== 'Manual'))
  );

  const [description, setDescription] = useState(initialData?.rol_description || '');
  const [activities, setActivities] = useState(initialData?.rol_activities || '');
  const [active, setActive] = useState(initialData ? initialData.rol_active === 1 : true);
  const [code, setCode] = useState(initialData?.rol_code || '');
  const [integrationId, setIntegrationId] = useState(initialData?.rol_integration_id || '');
  const [integrationSource, setIntegrationSource] = useState(initialData?.rol_integration_source || 'Manual');
  const [cbo, setCbo] = useState(initialData?.rol_cbo || '');

  useEffect(() => {
    const load = async () => {
      try {
        const [catalog, linked] = await Promise.all([
          epiService.getActive(),
          initialData ? roleService.getEpis(initialData.rol_id) : Promise.resolve([]),
        ]);
        setEpisCatalog(catalog);
        if (initialData) {
          setSelectedEpiIds(linked.map((e) => e.epi_id));
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [initialData]);

  const toggleEpi = (epiId: number) => {
    setSelectedEpiIds((prev) =>
      prev.includes(epiId) ? prev.filter((id) => id !== epiId) : [...prev, epiId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !activities.trim()) {
      alert('Preencha nome e descrição das atividades.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        rol_active: active ? 1 : 0,
        rol_description: description.trim(),
        rol_activities: activities.trim(),
        rol_code: code.trim() || null,
        rol_integration_id: integrationId.trim() || null,
        rol_integration_source: integrationSource,
        rol_cbo: cbo.trim() || null,
        usr_id_insert: null,
        usr_id_lastupdate: null,
      };

      let roleId: number;
      if (initialData) {
        const updated = await roleService.update(initialData.rol_id, payload);
        roleId = updated.rol_id;
      } else {
        const created = await roleService.create(payload);
        roleId = created.rol_id;
      }

      await roleService.setEpis(
        roleId,
        selectedEpiIds.map((epi_id) => ({ epi_id, rle_mandatory: 1 }))
      );

      onSaved?.();
      onClose();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar função');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="funcao-form" onSubmit={handleSubmit}>
      <div className="funcao-form-fields">
        <div className="funcao-form-field">
          <label className="funcao-form-label">Nome da Função <span className="funcao-form-required">*</span></label>
          <input
            type="text"
            placeholder="Ex: Levante"
            className="funcao-form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            disabled={!!isIntegrated}
          />
        </div>
        <div className="funcao-form-field">
          <label className="funcao-form-label">Status</label>
          <select className="funcao-form-input" value={active ? '1' : '0'} onChange={(e) => setActive(e.target.value === '1')}>
            <option value="1">Ativo</option>
            <option value="0">Inativo</option>
          </select>
        </div>
        <div className="funcao-form-field funcao-form-field-full">
          <label className="funcao-form-label">Descrição das Atividades <span className="funcao-form-required">*</span></label>
          <textarea
            placeholder="Descreva as principais atividades e riscos desta função..."
            className="funcao-form-textarea"
            value={activities}
            onChange={(e) => setActivities(e.target.value)}
            required
            disabled={!!isIntegrated}
          />
        </div>
        <div className="funcao-form-field">
          <label className="funcao-form-label">Código interno</label>
          <input
            type="text"
            placeholder="Ex: LEV-001"
            className="funcao-form-input"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            disabled={!!isIntegrated}
          />
        </div>
        <div className="funcao-form-field">
          <label className="funcao-form-label">CBO (opcional)</label>
          <input
            type="text"
            className="funcao-form-input"
            value={cbo}
            onChange={(e) => setCbo(e.target.value)}
          />
        </div>
        <div className="funcao-form-field funcao-form-field-full">
          <label className="funcao-form-label">EPIs Obrigatórios</label>
          <div className="funcao-form-checkbox-grid custom-scrollbar">
            {episCatalog.length === 0 ? (
              <p className="funcao-form-empty-epis">Cadastre EPIs no catálogo primeiro.</p>
            ) : (
              episCatalog.map((epi) => (
                <label key={epi.epi_id} className="funcao-form-checkbox-label">
                  <input
                    type="checkbox"
                    className="funcao-form-checkbox"
                    checked={selectedEpiIds.includes(epi.epi_id)}
                    onChange={() => toggleEpi(epi.epi_id)}
                  />
                  <span>
                    {epi.epi_description}
                    <small> CA: {epi.epi_ca}</small>
                  </span>
                </label>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="funcao-form-integration-toggle">
        <button type="button" className="funcao-form-link-btn" onClick={() => setShowIntegration(!showIntegration)}>
          {showIntegration ? 'Ocultar' : 'Mostrar'} Integração ERP
        </button>
      </div>

      {showIntegration && (
        <div className="funcao-form-integration">
          {isIntegrated && (
            <p className="funcao-form-integration-note">Função importada de {initialData?.rol_integration_source}.</p>
          )}
          <div className="funcao-form-fields">
            <div className="funcao-form-field">
              <label className="funcao-form-label">Sistema de origem</label>
              <select
                className="funcao-form-input"
                value={integrationSource}
                onChange={(e) => setIntegrationSource(e.target.value)}
                disabled={!!isIntegrated}
              >
                {INTEGRATION_SOURCES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div className="funcao-form-field">
              <label className="funcao-form-label">ID no ERP (TOTVS)</label>
              <input
                type="text"
                className="funcao-form-input"
                value={integrationId}
                onChange={(e) => setIntegrationId(e.target.value)}
                disabled={!!isIntegrated}
              />
            </div>
          </div>
        </div>
      )}

      <div className="funcao-form-actions">
        <button type="button" onClick={onClose} className="funcao-form-cancel" disabled={saving}>
          Cancelar
        </button>
        <button type="submit" className="funcao-form-submit" disabled={saving}>
          {saving ? 'Salvando...' : initialData ? 'Salvar Alterações' : 'Salvar Função'}
        </button>
      </div>
    </form>
  );
};
