import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Building2, ShieldCheck, Check, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { ListFiltersBar } from '../list/ListFiltersBar';
import { epiTypeService, epiTypeCategoryLabel, type EpiTypeAPI } from '../../services/epiTypeService';
import {
  sectionService,
  type SectionLifespanRuleLink,
} from '../../services/sectionService';
import { useNomenclature } from '../../hooks/useNomenclature';
import { NOMENCLATURE_KEYS } from '../../config/nomenclatureKeys';
import { validateSectionUniqueness } from '../../utils/uniqueness';
import './SectionForm.css';
import './SimpleCrudModal.css';
import '../../pages/ColaboradorEditar/styles.css';
import '../../pages/RegrasTroca/styles.css';

type SectionFormTab = 'dados' | 'regras';

interface SectionFormProps {
  onClose: () => void;
  onSaved?: () => void;
  sectionId?: number;
  existingSections?: { sec_id: number; sec_description?: string | null }[];
}

function buildLifespanPayload(
  overrides: Record<number, string>,
): SectionLifespanRuleLink[] {
  return Object.entries(overrides)
    .map(([eptId, raw]) => {
      const trimmed = raw.trim();
      if (!trimmed) return null;
      const days = Number(trimmed);
      if (!Number.isFinite(days) || days < 1) return null;
      return { ept_id: Number(eptId), slr_lifespan_days: Math.round(days) };
    })
    .filter((item): item is SectionLifespanRuleLink => item != null);
}

export const SectionForm = ({ onClose, onSaved, sectionId, existingSections }: SectionFormProps) => {
  const { t } = useNomenclature();
  const isEditing = sectionId != null;
  const sectionLabel = t(NOMENCLATURE_KEYS.entity.section_singular);
  const [activeTab, setActiveTab] = useState<SectionFormTab>('dados');
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [loadingEpis, setLoadingEpis] = useState(false);

  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [episCatalog, setEpisCatalog] = useState<EpiTypeAPI[]>([]);
  const [selectedEptIds, setSelectedEptIds] = useState<number[]>([]);
  const [lifespanOverrides, setLifespanOverrides] = useState<Record<number, string>>({});
  const [rulesSearch, setRulesSearch] = useState('');

  const loadCatalog = useCallback(async () => {
    const catalog = await epiTypeService.getActive();
    setEpisCatalog(catalog);
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        await loadCatalog();
        if (!isEditing || sectionId == null) {
          setLoading(false);
          return;
        }
        const section = await sectionService.getById(sectionId);
        setFormName(section.sec_description);
        setFormDesc(section.sec_integration_id || '');
        setFormActive(section.sec_active === 1);

        setLoadingEpis(true);
        const [linked, lifespanRules] = await Promise.all([
          sectionService.getEpiTypes(sectionId),
          sectionService.getLifespanRules(sectionId),
        ]);
        setSelectedEptIds(linked.map((e) => e.ept_id));

        const overrides: Record<number, string> = {};
        for (const rule of lifespanRules) {
          if (rule.slr_lifespan_days != null) {
            overrides[rule.ept_id] = String(rule.slr_lifespan_days);
          }
        }
        setLifespanOverrides(overrides);
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : 'Erro ao carregar setor');
        onClose();
      } finally {
        setLoading(false);
        setLoadingEpis(false);
      }
    };
    load();
  }, [isEditing, sectionId, loadCatalog, onClose]);

  const hasRequiredEpis = selectedEptIds.length >= 1;

  const toggleEpt = (eptId: number) => {
    setSelectedEptIds((prev) =>
      prev.includes(eptId) ? prev.filter((id) => id !== eptId) : [...prev, eptId]
    );
  };

  const setLifespanOverride = (eptId: number, value: string) => {
    setLifespanOverrides((prev) => {
      const next = { ...prev };
      if (!value.trim()) {
        delete next[eptId];
      } else {
        next[eptId] = value.replace(/\D/g, '');
      }
      return next;
    });
  };

  const rulesRows = useMemo(
    () =>
      [...episCatalog].sort((a, b) =>
        a.ept_description.localeCompare(b.ept_description, 'pt-BR'),
      ),
    [episCatalog],
  );

  const filteredRulesRows = useMemo(() => {
    const q = rulesSearch.trim().toLowerCase();
    if (!q) return rulesRows;
    return rulesRows.filter((epi) => {
      const category = epiTypeCategoryLabel(epi).toLowerCase();
      const defaultDays = String(epi.ept_lifespan_days ?? 180);
      const override = lifespanOverrides[epi.ept_id] ?? '';
      return (
        epi.ept_description.toLowerCase().includes(q)
        || category.includes(q)
        || defaultDays.includes(q)
        || override.includes(q)
      );
    });
  }, [rulesRows, rulesSearch, lifespanOverrides]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || saving) return;

    if (!hasRequiredEpis) {
      alert(`Selecione pelo menos 1 EPI do ${sectionLabel} para salvar.`);
      setActiveTab('dados');
      return;
    }

    try {
      const sectionsForCheck = existingSections ?? await sectionService.getAll();
      const duplicateMsg = validateSectionUniqueness(
        sectionsForCheck,
        formName,
        isEditing ? sectionId : undefined,
      );
      if (duplicateMsg) {
        alert(duplicateMsg);
        return;
      }
    } catch {
      /* segue para API */
    }

    setSaving(true);
    try {
      const payload = {
        sec_active: formActive ? 1 : 0,
        sec_description: formName.trim(),
        sec_integration_id: formDesc.trim() || null,
        usr_id_insert: null as number | null,
        usr_id_lastupdate: null as number | null,
      };
      const epiLinks = selectedEptIds.map((ept_id) => ({ ept_id, sle_mandatory: 1 }));
      const lifespanItems = buildLifespanPayload(lifespanOverrides);

      if (isEditing && sectionId != null) {
        await sectionService.update(sectionId, payload);
        await sectionService.setEpiTypes(sectionId, epiLinks);
        await sectionService.setLifespanRules(sectionId, lifespanItems);
      } else {
        const created = await sectionService.create(payload);
        await sectionService.setEpiTypes(created.sec_id, epiLinks);
        await sectionService.setLifespanRules(created.sec_id, lifespanItems);
      }
      onSaved?.();
      onClose();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar setor');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="section-form-loading">
        <Loader2 className="editar-submit-icon section-form-spin" />
        <span>Carregando...</span>
      </div>
    );
  }

  return (
    <form className="editar-form section-form" onSubmit={handleSubmit}>
      <div className="section-form-tabs regras-tabs">
        <button
          type="button"
          className={clsx('regras-tab', activeTab === 'dados' && 'regras-tab--active')}
          onClick={() => setActiveTab('dados')}
        >
          Dados da seção
        </button>
        <button
          type="button"
          className={clsx('regras-tab', activeTab === 'regras' && 'regras-tab--active')}
          onClick={() => setActiveTab('regras')}
        >
          Regras da Seção
        </button>
      </div>

      {activeTab === 'dados' && (
        <div className="editar-form-grid section-form-grid">
          <div className="editar-section">
            <h3 className="editar-section-title">
              <Building2 className="editar-section-icon" /> Dados do {sectionLabel}
            </h3>
            <div className="editar-fields">
              <div className="editar-field">
                <label className="editar-label">
                  Nome <span className="scrud-form-required">*</span>
                </label>
                <input
                  type="text"
                  className="editar-input"
                  placeholder={`Nome do ${t(NOMENCLATURE_KEYS.entity.section_compound).toLowerCase()}`}
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  required
                />
              </div>
              <div className="editar-field">
                <label className="editar-label">Descrição / ID integração</label>
                <input
                  type="text"
                  className="editar-input"
                  placeholder="Descrição ou código de integração"
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                />
              </div>
              <div className="editar-field">
                <div className="scrud-form-toggle-row">
                  <span className="scrud-form-toggle-label">Ativo</span>
                  <button
                    type="button"
                    className={`scrud-toggle ${formActive ? 'scrud-toggle--active' : ''}`}
                    onClick={() => setFormActive(!formActive)}
                  >
                    <span className="scrud-toggle-thumb" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="editar-section">
            <h3 className="editar-section-title">
              <ShieldCheck className="editar-section-icon" /> EPIs do {sectionLabel}
              <span className="scrud-form-required"> *</span>
            </h3>
            <p className="section-form-epis-hint">
              Selecione no mínimo 1 tipo de EPI obrigatório para este {sectionLabel.toLowerCase()}.
            </p>
            {!hasRequiredEpis && !loadingEpis && episCatalog.length > 0 && (
              <p className="section-form-epis-error" role="alert">
                Nenhum EPI selecionado. Marque ao menos um item abaixo.
              </p>
            )}
            {loadingEpis ? (
              <p className="scrud-epis-loading">
                <Loader2 className="scrud-icon-sm scrud-spin" />
                Carregando EPIs vinculados...
              </p>
            ) : (
              <div className="scrud-epi-grid custom-scrollbar section-form-epi-grid">
                {episCatalog.length === 0 ? (
                  <p className="scrud-epis-empty">Cadastre EPIs no catálogo primeiro.</p>
                ) : (
                  episCatalog.map((epi) => (
                    <label key={epi.ept_id} className="scrud-epi-label">
                      <input
                        type="checkbox"
                        className="scrud-epi-checkbox"
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
            )}
          </div>
        </div>
      )}

      {activeTab === 'regras' && (
        <div className="section-form-regras">
          <p className="regras-page-hint">
            Defina a vida útil em dias para cada EPI neste {sectionLabel.toLowerCase()}. Deixe
            em branco na coluna <strong>Regras</strong> para manter a vida útil padrão do cadastro.
          </p>

          {episCatalog.length > 0 && (
            <ListFiltersBar
              searchValue={rulesSearch}
              onSearchChange={setRulesSearch}
              searchPlaceholder="Buscar EPI, categoria ou dias..."
              onClear={() => setRulesSearch('')}
            />
          )}

          {loadingEpis ? (
            <div className="regras-loading">
              <Loader2 className="icon-sm regras-spin" />
              <span>Carregando regras...</span>
            </div>
          ) : episCatalog.length === 0 ? (
            <div className="regras-empty">Cadastre EPIs no catálogo primeiro.</div>
          ) : (
            <div className="table-container section-form-rules-scroll custom-scrollbar">
              <table className="data-table">
                <thead>
                  <tr className="table-header-row">
                    <th className="table-header-cell">Descrição</th>
                    <th className="table-header-cell">Vida útil (dias)</th>
                    <th className="table-header-cell">Regras</th>
                  </tr>
                </thead>
                <tbody className="table-body">
                  {filteredRulesRows.length === 0 ? (
                    <tr>
                      <td colSpan={3} className="table-cell epis-empty-cell">
                        Nenhum EPI encontrado com os filtros aplicados.
                      </td>
                    </tr>
                  ) : (
                    filteredRulesRows.map((epi) => {
                      const overrideRaw = lifespanOverrides[epi.ept_id] ?? '';
                      const hasOverride = overrideRaw.trim().length > 0;
                      const defaultDays = epi.ept_lifespan_days ?? 180;
                      const category = epiTypeCategoryLabel(epi);

                      return (
                        <tr
                          key={epi.ept_id}
                          className={clsx(
                            'table-row',
                            'section-form-rule-row',
                            hasOverride && 'section-form-rule-row--override',
                          )}
                        >
                          <td className="table-cell">
                            <span className="rule-epi-name">{epi.ept_description}</span>
                            {category !== '—' && (
                              <p className="rule-motivo">{category}</p>
                            )}
                          </td>
                          <td className="table-cell">
                            <span className="rule-vida-util">{defaultDays}</span>
                          </td>
                          <td className="table-cell">
                            <input
                              type="text"
                              inputMode="numeric"
                              className="regra-troca-form-input section-form-rule-input"
                              value={overrideRaw}
                              onChange={(e) => setLifespanOverride(epi.ept_id, e.target.value)}
                              aria-label={`Regra de vida útil em dias para ${epi.ept_description}`}
                            />
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <div className="editar-footer">
        <div />
        <div className="editar-footer-actions">
          <button type="button" onClick={onClose} className="editar-cancel-btn" disabled={saving}>
            Cancelar
          </button>
          <button
            type="submit"
            className="editar-submit-btn"
            disabled={!formName.trim() || !hasRequiredEpis || saving}
            title={!hasRequiredEpis ? `Selecione pelo menos 1 EPI do ${sectionLabel}` : undefined}
          >
            {saving ? (
              <>
                <Loader2 className="editar-submit-icon section-form-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Check className="editar-submit-icon" />
                {isEditing ? 'Salvar alterações' : `Salvar ${sectionLabel.toLowerCase()}`}
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
};
