import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ListFiltersBar } from '../../components/list/ListFiltersBar';
import { activeStatusMatcher, filterListRows } from '../../utils/listFilters';
import { Edit3, Loader2, Plus, Trash2, RefreshCw } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { epiTypeService, epiTypeCategoryLabel, type EpiTypeAPI } from '../../services/epiTypeService';
import { epiVariantService } from '../../services/epiVariantService';
import {
  exchangeRuleService,
  type ExchangeRuleAPI,
} from '../../services/exchangeRuleService';
import { useNomenclature } from '../../hooks/useNomenclature';
import { getExchangeScopeLabels } from '../../utils/exchangeScopeLabels';
import clsx from 'clsx';
import { Modal } from '../../components/ui/Modal';
import { RegraTrocaForm } from '../../components/forms/RegraTrocaForm';
import { ExchangeRuleForm } from '../../components/forms/ExchangeRuleForm';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

type TabId = 'base' | 'triggers';

const SHOW_CONDITIONAL_TRIGGERS = false;

const RegrasTroca = () => {
  const { t } = useNomenclature();
  const scopeLabels = React.useMemo(() => getExchangeScopeLabels(t), [t]);
  const [activeTab, setActiveTab] = useState<TabId>('base');
  const [types, setTypes] = useState<EpiTypeAPI[]>([]);
  const [variantOverrideCount, setVariantOverrideCount] = useState<Record<number, number>>({});
  const [rules, setRules] = useState<ExchangeRuleAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [rulesLoading, setRulesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isBaseModalOpen, setIsBaseModalOpen] = useState(false);
  const [isRuleModalOpen, setIsRuleModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<EpiTypeAPI | null>(null);
  const [selectedRule, setSelectedRule] = useState<ExchangeRuleAPI | null>(null);
  const [ruleDefaultEptId, setRuleDefaultEptId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const { canEdit, canCreate, canDelete } = useAuth();
  const allowEdit = canEdit('/regras-troca');
  const allowCreate = canCreate('/regras-troca');
  const allowDelete = canDelete('/regras-troca');

  const loadTypes = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [typeData, variantData] = await Promise.all([
        epiTypeService.getAll(),
        epiVariantService.getAll(),
      ]);
      setTypes(typeData);
      const counts: Record<number, number> = {};
      for (const v of variantData) {
        if (v.epv_lifespan_days != null && v.epv_active === 1) {
          counts[v.ept_id] = (counts[v.ept_id] || 0) + 1;
        }
      }
      setVariantOverrideCount(counts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar tipos de EPI');
    } finally {
      setLoading(false);
    }
  }, []);

  const loadRules = useCallback(async () => {
    setRulesLoading(true);
    try {
      const data = await exchangeRuleService.getAll();
      setRules(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar gatilhos');
    } finally {
      setRulesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTypes();
  }, [loadTypes]);

  useEffect(() => {
    if (activeTab === 'triggers') loadRules();
  }, [activeTab, loadRules]);

  const handleOpenBaseModal = (type: EpiTypeAPI) => {
    setSelectedType(type);
    setIsBaseModalOpen(true);
  };

  const handleOpenRuleModal = (rule?: ExchangeRuleAPI | null, eptId?: number) => {
    setSelectedRule(rule ?? null);
    setRuleDefaultEptId(eptId ?? null);
    setIsRuleModalOpen(true);
  };

  const handleDeleteRule = async (rule: ExchangeRuleAPI) => {
    if (!window.confirm('Inativar este gatilho condicional?')) return;
    try {
      await exchangeRuleService.delete(rule.exr_id);
      await loadRules();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir gatilho');
    }
  };

  const getConfigCriticidade = (days: number) => {
    if (days <= 90) return 'Alta';
    if (days <= 180) return 'Média';
    return 'Baixa';
  };

  const filteredTypes = useMemo(
    () =>
      filterListRows(types, searchTerm, filterValues, {
        searchText: (type) =>
          [
            type.ept_description,
            epiTypeCategoryLabel(type),
            getConfigCriticidade(type.ept_lifespan_days),
            String(type.ept_id),
            String(type.ept_lifespan_days),
          ].join(' '),
        fields: {
          status: activeStatusMatcher((type) => type.ept_active),
          criticidade: (type, value) => getConfigCriticidade(type.ept_lifespan_days) === value,
        },
      }),
    [types, searchTerm, filterValues],
  );

  const filteredRules = useMemo(
    () =>
      filterListRows(rules, searchTerm, filterValues, {
        searchText: (rule) =>
          [
            rule.epiType?.ept_description,
            scopeLabels[rule.exr_scope],
            rule.exr_reason,
            String(rule.exr_id),
            String(rule.exr_value),
          ]
            .filter(Boolean)
            .join(' '),
        fields: {
          status: activeStatusMatcher((rule) => rule.exr_active),
          scope: (rule, value) => rule.exr_scope === value,
        },
      }),
    [rules, searchTerm, filterValues, scopeLabels],
  );

  const baseFilterFields = useMemo(
    () => [
      {
        id: 'criticidade',
        label: 'Criticidade',
        type: 'select' as const,
        options: [
          { value: 'Alta', label: 'Alta' },
          { value: 'Média', label: 'Média' },
          { value: 'Baixa', label: 'Baixa' },
        ],
      },
      {
        id: 'status',
        label: 'Status',
        type: 'select' as const,
        options: [
          { value: '1', label: 'Ativo' },
          { value: '0', label: 'Inativo' },
        ],
      },
    ],
    [],
  );

  const triggerFilterFields = useMemo(
    () => [
      {
        id: 'scope',
        label: 'Escopo',
        type: 'select' as const,
        options: Object.entries(scopeLabels).map(([value, label]) => ({ value, label })),
      },
      {
        id: 'status',
        label: 'Status',
        type: 'select' as const,
        options: [
          { value: '1', label: 'Ativo' },
          { value: '0', label: 'Inativo' },
        ],
      },
    ],
    [scopeLabels],
  );

  return (
    <div className="regras-page">
      <PageHeader
        icon={RefreshCw}
        title={t(NOMENCLATURE_KEYS.page.regras_troca)}
        subtitle={t(NOMENCLATURE_KEYS.page.subtitle_regras_troca)}
        actions={
          SHOW_CONDITIONAL_TRIGGERS && activeTab === 'triggers' && allowCreate ? (
            <button type="button" className="btn-add" onClick={() => handleOpenRuleModal()}>
              <Plus className="icon-sm" />
              Novo gatilho
            </button>
          ) : undefined
        }
      />

      {SHOW_CONDITIONAL_TRIGGERS && (
        <div className="regras-tabs">
          <button
            type="button"
            className={clsx('regras-tab', activeTab === 'base' && 'regras-tab--active')}
            onClick={() => {
              setActiveTab('base');
              setSearchTerm('');
              setFilterValues({});
            }}
          >
            Vida útil padrão
          </button>
          <button
            type="button"
            className={clsx('regras-tab', activeTab === 'triggers' && 'regras-tab--active')}
            onClick={() => {
              setActiveTab('triggers');
              setSearchTerm('');
              setFilterValues({});
            }}
          >
            Gatilhos condicionais
          </button>
        </div>
      )}

      {error && <div className="regras-error-banner">{error}</div>}

      <Modal
        isOpen={isBaseModalOpen}
        onClose={() => setIsBaseModalOpen(false)}
        title={selectedType ? `Vida útil: ${selectedType.ept_description}` : 'Editar vida útil'}
      >
        <RegraTrocaForm
          onClose={() => setIsBaseModalOpen(false)}
          onSaved={loadTypes}
          initialData={selectedType || undefined}
          onManageTriggers={
            SHOW_CONDITIONAL_TRIGGERS && selectedType
              ? () => {
                  setIsBaseModalOpen(false);
                  setActiveTab('triggers');
                  handleOpenRuleModal(null, selectedType.ept_id);
                }
              : undefined
          }
        />
      </Modal>

      <Modal
        isOpen={isRuleModalOpen}
        onClose={() => setIsRuleModalOpen(false)}
        title={selectedRule ? 'Editar gatilho' : 'Novo gatilho condicional'}
      >
        <ExchangeRuleForm
          onClose={() => setIsRuleModalOpen(false)}
          onSaved={loadRules}
          initialData={selectedRule}
          defaultEptId={ruleDefaultEptId}
        />
      </Modal>

      <ListFiltersBar
        key={activeTab}
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={
          activeTab === 'base'
            ? 'Buscar tipo de EPI, categoria ou vida útil...'
            : 'Buscar gatilho, escopo ou motivo...'
        }
        fields={activeTab === 'base' ? baseFilterFields : triggerFilterFields}
        values={filterValues}
        onFieldChange={(id, value) => setFilterValues((prev) => ({ ...prev, [id]: value }))}
        onClear={() => setFilterValues({})}
      />

      {activeTab === 'base' && (
        <div className="table-container">
          {loading ? (
            <div className="regras-loading">
              <Loader2 className="icon-sm regras-spin" />
              <span>Carregando...</span>
            </div>
          ) : types.length === 0 ? (
            <div className="regras-empty">Nenhum tipo de EPI cadastrado.</div>
          ) : (
            <table className="data-table">
              <thead>
                <tr className="table-header-row">
                  <th className="table-header-cell table-col-id">ID</th>
                  <th className="table-header-cell">Tipo de EPI</th>
                  <th className="table-header-cell">Categoria</th>
                  <th className="table-header-cell">Vida útil (dias)</th>
                  <th className="table-header-cell">Criticidade (config.)</th>
                  <th className="table-header-cell">Variantes</th>
                  <th className="table-header-cell">Status</th>
                  {allowEdit && <th className="table-header-cell-right">Ações</th>}
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredTypes.length === 0 ? (
                  <tr>
                    <td colSpan={allowEdit ? 8 : 7} className="table-cell epis-empty-cell">
                      Nenhum tipo encontrado com os filtros aplicados.
                    </td>
                  </tr>
                ) : (
                filteredTypes.map((type) => {
                  const criticidade = getConfigCriticidade(type.ept_lifespan_days);
                  const overrides = variantOverrideCount[type.ept_id] || 0;
                  return (
                    <tr
                      key={type.ept_id}
                      className="table-row"
                      onClick={() => allowEdit && handleOpenBaseModal(type)}
                      style={{ cursor: allowEdit ? 'pointer' : 'default' }}
                    >
                      <td className="table-cell table-cell-id">{type.ept_id}</td>
                      <td className="table-cell">
                        <span className="rule-epi-name">{type.ept_description}</span>
                      </td>
                      <td className="table-cell">{epiTypeCategoryLabel(type)}</td>
                      <td className="table-cell">
                        <span className="rule-vida-util">{type.ept_lifespan_days}</span>
                      </td>
                      <td className="table-cell">
                        <span
                          className={clsx(
                            'criticidade-badge',
                            criticidade === 'Alta'
                              ? 'criticidade-alta'
                              : criticidade === 'Média'
                                ? 'criticidade-media'
                                : 'criticidade-baixa'
                          )}
                        >
                          {criticidade}
                        </span>
                      </td>
                      <td className="table-cell">
                        {overrides > 0 ? (
                          <span className="regras-variant-hint">{overrides} com override</span>
                        ) : (
                          <span className="regras-variant-none">—</span>
                        )}
                      </td>
                      <td className="table-cell">{type.ept_active === 1 ? 'Ativo' : 'Inativo'}</td>
                      {allowEdit && (
                        <td className="table-cell-right">
                          <button
                            type="button"
                            className="btn-edit"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenBaseModal(type);
                            }}
                          >
                            <Edit3 className="icon-sm" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
                )}
              </tbody>
            </table>
          )}
        </div>
      )}

      {SHOW_CONDITIONAL_TRIGGERS && activeTab === 'triggers' && (
        <div className="table-container">
          {rulesLoading ? (
            <div className="regras-loading">
              <Loader2 className="icon-sm regras-spin" />
              <span>Carregando gatilhos...</span>
            </div>
          ) : rules.length === 0 ? (
            <div className="regras-empty">
              Nenhum gatilho cadastrado. Crie regras por empresa, setor, função ou colaborador.
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr className="table-header-row">
                  <th className="table-header-cell table-col-id">ID</th>
                  <th className="table-header-cell">Tipo</th>
                  <th className="table-header-cell">Escopo</th>
                  <th className="table-header-cell">Gatilho (dias)</th>
                  <th className="table-header-cell">Motivo</th>
                  <th className="table-header-cell">Status</th>
                  {(allowEdit || allowDelete) && (
                    <th className="table-header-cell-right">Ações</th>
                  )}
                </tr>
              </thead>
              <tbody className="table-body">
                {filteredRules.length === 0 ? (
                  <tr>
                    <td
                      colSpan={allowEdit || allowDelete ? 7 : 6}
                      className="table-cell epis-empty-cell"
                    >
                      Nenhum gatilho encontrado com os filtros aplicados.
                    </td>
                  </tr>
                ) : (
                filteredRules.map((rule) => (
                  <tr key={rule.exr_id} className="table-row">
                    <td className="table-cell table-cell-id">{rule.exr_id}</td>
                    <td className="table-cell">
                      {rule.epiType?.ept_description ?? 'Todos os tipos'}
                    </td>
                    <td className="table-cell">
                      {scopeLabels[rule.exr_scope]}
                      {rule.exr_scope_id != null ? ` #${rule.exr_scope_id}` : ''}
                    </td>
                    <td className="table-cell">{rule.exr_value}</td>
                    <td className="table-cell">{rule.exr_reason ?? '—'}</td>
                    <td className="table-cell">{rule.exr_active === 1 ? 'Ativo' : 'Inativo'}</td>
                    {(allowEdit || allowDelete) && (
                      <td className="table-cell-right">
                        {allowEdit && (
                          <button
                            type="button"
                            className="btn-edit"
                            onClick={() => handleOpenRuleModal(rule)}
                          >
                            <Edit3 className="icon-sm" />
                          </button>
                        )}
                        {allowDelete && rule.exr_active === 1 && (
                          <button
                            type="button"
                            className="btn-edit"
                            onClick={() => handleDeleteRule(rule)}
                          >
                            <Trash2 className="icon-sm" />
                          </button>
                        )}
                      </td>
                    )}
                  </tr>
                ))
                )}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default RegrasTroca;
