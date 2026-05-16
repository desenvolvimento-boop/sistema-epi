import React, { useState, useEffect, useCallback } from 'react';
import { Plus, X } from 'lucide-react';
import {
  roleService,
  RISK_SEVERITIES,
  type RoleAPI,
  type RoleRiskAPI,
} from '../../services/roleService';
import { epiTypeService, type EpiTypeAPI } from '../../services/epiTypeService';
import { INTEGRATION_SOURCES } from '../../services/epiVariantService';
import { riskTypeService, type RiskTypeAPI } from '../../services/riskTypeService';
import { SimpleCrudModal, type SimpleCrudItem } from './SimpleCrudModal';
import './FuncaoForm.css';

function mapRiskTypesToCrud(types: RiskTypeAPI[]): SimpleCrudItem[] {
  return types.map((t) => ({
    id: t.rty_id,
    name: t.rty_description,
    description: t.rty_code || t.rty_integration_id,
    active: t.rty_active === 1,
  }));
}

function getDefaultRiskTypeName(types: SimpleCrudItem[]): string {
  const first = types.find((t) => t.active);
  return first?.name || '';
}

interface FuncaoFormProps {
  onClose: () => void;
  onSaved?: () => void;
  initialData?: RoleAPI;
}

interface RiskDraft {
  tempId: string;
  rsk_type: string;
  rsk_agent: string;
  rsk_severity: string;
  rsk_pgr_reference: string | null;
  rsk_integration_id: string | null;
  rsk_integration_source: string;
}

function buildRiskPayload(
  type: string,
  agent: string,
  severity: string,
  pgrRef: string,
  integrationSource: string,
  integrationId: string
) {
  return {
    rsk_active: 1,
    rsk_type: type,
    rsk_agent: agent.trim(),
    rsk_severity: severity,
    rsk_pgr_reference: pgrRef.trim() || null,
    rsk_integration_id: integrationId.trim() || null,
    rsk_integration_source: integrationSource,
    rsk_external_code: null,
    rsk_integration_sync_at: null,
    usr_id_insert: null,
    usr_id_lastupdate: null,
  };
}

export const FuncaoForm = ({ onClose, onSaved, initialData }: FuncaoFormProps) => {
  const isIntegrated = initialData?.rol_integration_source && initialData.rol_integration_source !== 'Manual';
  const [saving, setSaving] = useState(false);
  const [episCatalog, setEpisCatalog] = useState<EpiTypeAPI[]>([]);
  const [selectedEptIds, setSelectedEptIds] = useState<number[]>([]);
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

  const [risks, setRisks] = useState<RoleRiskAPI[]>([]);
  const [pendingRisks, setPendingRisks] = useState<RiskDraft[]>([]);
  const [showRiskForm, setShowRiskForm] = useState(false);
  const [riskTypes, setRiskTypes] = useState<SimpleCrudItem[]>([]);
  const [isRiskTypeModalOpen, setIsRiskTypeModalOpen] = useState(false);
  const [riskType, setRiskType] = useState('');
  const [riskAgent, setRiskAgent] = useState('');
  const [riskSeverity, setRiskSeverity] = useState<string>(RISK_SEVERITIES[0]);
  const [riskPgrRef, setRiskPgrRef] = useState('');
  const [riskIntegrationSource, setRiskIntegrationSource] = useState('Manual');
  const [riskIntegrationId, setRiskIntegrationId] = useState('');

  const reloadRiskTypes = useCallback(async () => {
    try {
      const types = await riskTypeService.getAll();
      const mapped = mapRiskTypesToCrud(types);
      setRiskTypes(mapped);
      setRiskType((current) => {
        if (current && mapped.some((t) => t.active && t.name === current)) return current;
        return getDefaultRiskTypeName(mapped);
      });
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const [catalog, types, linked, linkedRisks] = await Promise.all([
          epiTypeService.getActive(),
          riskTypeService.getAll(),
          initialData ? roleService.getEpiTypes(initialData.rol_id) : Promise.resolve([]),
          initialData ? roleService.getRisks(initialData.rol_id) : Promise.resolve([]),
        ]);
        setEpisCatalog(catalog);
        const mappedTypes = mapRiskTypesToCrud(types);
        setRiskTypes(mappedTypes);
        setRiskType(getDefaultRiskTypeName(mappedTypes));
        if (initialData) {
          setSelectedEptIds(linked.map((e) => e.ept_id));
          setRisks(linkedRisks);
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [initialData]);

  const activeRiskTypes = riskTypes.filter((t) => t.active);

  const handleRiskTypeCreated = async (item: SimpleCrudItem) => {
    try {
      const created = await riskTypeService.create({
        rty_active: item.active ? 1 : 0,
        rty_description: item.name,
        rty_code: item.description,
        rty_integration_id: null,
        rty_integration_source: 'Manual',
        usr_id_insert: null,
        usr_id_lastupdate: null,
      });
      setRiskType(created.rty_description);
      await reloadRiskTypes();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao criar tipo de risco');
    }
  };

  const toggleEpt = (eptId: number) => {
    setSelectedEptIds((prev) =>
      prev.includes(eptId) ? prev.filter((id) => id !== eptId) : [...prev, eptId]
    );
  };

  const resetRiskForm = () => {
    setRiskType(getDefaultRiskTypeName(riskTypes));
    setRiskAgent('');
    setRiskSeverity(RISK_SEVERITIES[0]);
    setRiskPgrRef('');
    setRiskIntegrationSource('Manual');
    setRiskIntegrationId('');
    setShowRiskForm(false);
  };

  const handleAddRisk = async () => {
    if (!riskType) {
      alert('Selecione o tipo de risco.');
      return;
    }
    if (!riskAgent.trim()) {
      alert('Informe a descrição do agente de risco.');
      return;
    }

    const payload = buildRiskPayload(
      riskType,
      riskAgent,
      riskSeverity,
      riskPgrRef,
      riskIntegrationSource,
      riskIntegrationId
    );

    if (initialData) {
      try {
        await roleService.createRisk(initialData.rol_id, payload);
        const updated = await roleService.getRisks(initialData.rol_id);
        setRisks(updated);
        resetRiskForm();
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : 'Erro ao adicionar risco');
      }
      return;
    }

    setPendingRisks((prev) => [
      ...prev,
      {
        tempId: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
        rsk_type: payload.rsk_type,
        rsk_agent: payload.rsk_agent,
        rsk_severity: payload.rsk_severity,
        rsk_pgr_reference: payload.rsk_pgr_reference,
        rsk_integration_id: payload.rsk_integration_id,
        rsk_integration_source: payload.rsk_integration_source || 'Manual',
      },
    ]);
    resetRiskForm();
  };

  const removePendingRisk = (tempId: string) => {
    setPendingRisks((prev) => prev.filter((r) => r.tempId !== tempId));
  };

  const savePendingRisks = async (roleId: number) => {
    for (const draft of pendingRisks) {
      await roleService.createRisk(roleId, buildRiskPayload(
        draft.rsk_type,
        draft.rsk_agent,
        draft.rsk_severity,
        draft.rsk_pgr_reference || '',
        draft.rsk_integration_source,
        draft.rsk_integration_id || ''
      ));
    }
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
        if (pendingRisks.length > 0) {
          await savePendingRisks(roleId);
        }
      }

      await roleService.setEpiTypes(
        roleId,
        selectedEptIds.map((ept_id) => ({ ept_id, rle_mandatory: 1 }))
      );

      onSaved?.();
      onClose();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar função');
    } finally {
      setSaving(false);
    }
  };

  const tableRisks: Array<RoleRiskAPI | (RiskDraft & { isPending: true })> = initialData
    ? risks
    : pendingRisks.map((r) => ({ ...r, isPending: true as const }));

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
                <label key={epi.ept_id} className="funcao-form-checkbox-label">
                  <input
                    type="checkbox"
                    className="funcao-form-checkbox"
                    checked={selectedEptIds.includes(epi.ept_id)}
                    onChange={() => toggleEpt(epi.ept_id)}
                  />
                  <span>
                    {epi.ept_description}
                    <small> · {epi.ept_category}</small>
                  </span>
                </label>
              ))
            )}
          </div>
        </div>
      </div>

      <div className="funcao-form-risks-section">
        <div className="funcao-form-risks-header">
          <div>
            <h4 className="funcao-form-risks-title">Riscos Ocupacionais</h4>
            <p className="funcao-form-risks-hint">
              Cadastre riscos manualmente ou vincule via integração ERP. Riscos importados aparecem automaticamente após sincronização.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowRiskForm(!showRiskForm)}
            className="funcao-form-add-risk-btn"
          >
            <Plus className="funcao-form-add-risk-icon" />
            Adicionar Risco
          </button>
        </div>

        {showRiskForm && (
          <div className="funcao-form-risk-form">
            <div className="funcao-form-risk-grid">
              <div className="funcao-form-field">
                <label className="funcao-form-label">Tipo</label>
                <div className="funcao-form-select-with-action">
                  <select
                    className="funcao-form-input"
                    value={riskType}
                    onChange={(e) => setRiskType(e.target.value)}
                    disabled={activeRiskTypes.length === 0}
                  >
                    {activeRiskTypes.length === 0 ? (
                      <option value="">Cadastre um tipo de risco</option>
                    ) : (
                      activeRiskTypes.map((t) => (
                        <option key={t.id} value={t.name}>{t.name}</option>
                      ))
                    )}
                  </select>
                  <button
                    type="button"
                    className="funcao-form-add-btn"
                    onClick={() => setIsRiskTypeModalOpen(true)}
                    title="Cadastrar tipo de risco"
                  >
                    <Plus className="funcao-form-add-icon" />
                  </button>
                </div>
                <SimpleCrudModal
                  isOpen={isRiskTypeModalOpen}
                  onClose={() => {
                    setIsRiskTypeModalOpen(false);
                    reloadRiskTypes();
                  }}
                  title="Cadastrar Tipo de Risco"
                  entityLabel="Tipo de Risco"
                  items={riskTypes}
                  onItemsChange={setRiskTypes}
                  onItemCreated={handleRiskTypeCreated}
                />
              </div>
              <div className="funcao-form-field">
                <label className="funcao-form-label">Severidade</label>
                <select
                  className="funcao-form-input"
                  value={riskSeverity}
                  onChange={(e) => setRiskSeverity(e.target.value)}
                >
                  {RISK_SEVERITIES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="funcao-form-field funcao-form-field-full">
                <label className="funcao-form-label">Descrição do agente <span className="funcao-form-required">*</span></label>
                <input
                  className="funcao-form-input"
                  value={riskAgent}
                  onChange={(e) => setRiskAgent(e.target.value)}
                  placeholder="Ex: Ruído contínuo acima de 85 dB"
                />
              </div>
              <div className="funcao-form-field">
                <label className="funcao-form-label">Ref. PGR</label>
                <input
                  className="funcao-form-input"
                  value={riskPgrRef}
                  onChange={(e) => setRiskPgrRef(e.target.value)}
                  placeholder="Ex: PGR-AUD-01"
                />
              </div>
              <div className="funcao-form-field">
                <label className="funcao-form-label">Origem</label>
                <select
                  className="funcao-form-input"
                  value={riskIntegrationSource}
                  onChange={(e) => setRiskIntegrationSource(e.target.value)}
                >
                  {INTEGRATION_SOURCES.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>
              <div className="funcao-form-field">
                <label className="funcao-form-label">ID TOTVS/ERP</label>
                <input
                  className="funcao-form-input"
                  value={riskIntegrationId}
                  onChange={(e) => setRiskIntegrationId(e.target.value)}
                  placeholder={riskIntegrationSource === 'Manual' ? 'Opcional' : 'Código no ERP'}
                />
              </div>
            </div>
            <div className="funcao-form-risk-actions">
              <button type="button" className="funcao-form-cancel" onClick={resetRiskForm}>
                Cancelar
              </button>
              <button type="button" className="funcao-form-risk-save-btn" onClick={handleAddRisk}>
                {initialData ? 'Salvar Risco' : 'Incluir na lista'}
              </button>
            </div>
          </div>
        )}

        {tableRisks.length === 0 ? (
          <p className="funcao-form-risks-empty">Nenhum risco cadastrado para esta função.</p>
        ) : (
          <div className="funcao-form-risks-table-wrap custom-scrollbar">
            <table className="funcao-form-risks-table">
              <thead>
                <tr>
                  <th>Tipo</th>
                  <th>Agente</th>
                  <th>Origem</th>
                  <th>Severidade</th>
                  {!initialData && <th></th>}
                </tr>
              </thead>
              <tbody>
                {tableRisks.map((r) => {
                  const isPending = 'isPending' in r && r.isPending;
                  const key = isPending ? r.tempId : (r as RoleRiskAPI).rsk_id;
                  const source = r.rsk_integration_source || 'Manual';
                  return (
                    <tr key={key}>
                      <td>{r.rsk_type}</td>
                      <td>{r.rsk_agent}</td>
                      <td>
                        <span className={`funcao-form-risk-origin funcao-form-risk-origin-${source.toLowerCase()}`}>
                          {source}
                        </span>
                      </td>
                      <td>{r.rsk_severity}</td>
                      {!initialData && (
                        <td className="funcao-form-risks-actions-cell">
                          {isPending && (
                            <button
                              type="button"
                              className="funcao-form-risk-remove-btn"
                              title="Remover da lista"
                              onClick={() => removePendingRisk(r.tempId)}
                            >
                              <X className="funcao-form-risk-remove-icon" />
                            </button>
                          )}
                        </td>
                      )}
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
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
