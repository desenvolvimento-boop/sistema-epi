import React, { useEffect, useMemo, useState } from 'react';
import {
  exchangeRuleService,
  type ExchangeRuleAPI,
  type ExchangeRulePayload,
} from '../../services/exchangeRuleService';
import { useNomenclature } from '../../hooks/useNomenclature';
import { getExchangeScopeLabels } from '../../utils/exchangeScopeLabels';
import { epiTypeService, type EpiTypeAPI } from '../../services/epiTypeService';
import { employerService } from '../../services/employerService';
import { sectionService } from '../../services/sectionService';
import { roleService } from '../../services/roleService';
import { employeeService } from '../../services/employeeService';
import { useAuth } from '../../contexts/AuthContext';
import './ExchangeRuleForm.css';

interface ExchangeRuleFormProps {
  onClose: () => void;
  onSaved?: () => void;
  initialData?: ExchangeRuleAPI | null;
  defaultEptId?: number | null;
}

export const ExchangeRuleForm = ({
  onClose,
  onSaved,
  initialData,
  defaultEptId,
}: ExchangeRuleFormProps) => {
  const { user } = useAuth();
  const { t } = useNomenclature();
  const scopeLabels = useMemo(() => getExchangeScopeLabels(t), [t]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [types, setTypes] = useState<EpiTypeAPI[]>([]);
  const [companies, setCompanies] = useState<{ id: number; label: string }[]>([]);
  const [sections, setSections] = useState<{ id: number; label: string }[]>([]);
  const [roles, setRoles] = useState<{ id: number; label: string }[]>([]);
  const [employees, setEmployees] = useState<{ id: number; label: string }[]>([]);

  const [active, setActive] = useState(initialData?.exr_active ?? 1);
  const [eptId, setEptId] = useState<string>(
    initialData?.ept_id != null ? String(initialData.ept_id) : defaultEptId != null ? String(defaultEptId) : ''
  );
  const [scope, setScope] = useState<ExchangeRulePayload['exr_scope']>(
    initialData?.exr_scope ?? 'GLOBAL'
  );
  const [scopeId, setScopeId] = useState<string>(
    initialData?.exr_scope_id != null ? String(initialData.exr_scope_id) : ''
  );
  const [gatilho, setGatilho] = useState<number | ''>(initialData?.exr_value ?? '');
  const [reason, setReason] = useState(initialData?.exr_reason ?? '');

  const selectedEpiType = types.find((t) => String(t.ept_id) === eptId) ?? null;

  useEffect(() => {
    Promise.all([
      epiTypeService.getActive(),
      employerService.getActive(),
      sectionService.getActive(),
      roleService.getActive(),
      employeeService.getActive(),
    ])
      .then(([t, c, s, r, e]) => {
        setTypes(t);
        setCompanies(c.map((x) => ({ id: x.emr_id, label: x.com_description || x.emr_name })));
        setSections(s.map((x) => ({ id: x.sec_id, label: x.sec_description })));
        setRoles(r.map((x) => ({ id: x.rol_id, label: x.rol_description })));
        setEmployees(e.map((emp) => ({ id: emp.emp_id, label: emp.emp_full_name })));
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (!initialData) return;
    setActive(initialData.exr_active);
    setEptId(initialData.ept_id != null ? String(initialData.ept_id) : '');
    setScope(initialData.exr_scope);
    setScopeId(initialData.exr_scope_id != null ? String(initialData.exr_scope_id) : '');
    setGatilho(initialData.exr_value);
    setReason(initialData.exr_reason ?? '');
    setError(null);
  }, [initialData]);

  const scopeOptions =
    scope === 'COMPANY'
      ? companies
      : scope === 'SECTION'
        ? sections
        : scope === 'ROLE'
          ? roles
          : scope === 'EMPLOYEE'
            ? employees
            : [];

  const buildPayload = (): ExchangeRulePayload => ({
    exr_active: active,
    ept_id: eptId ? Number(eptId) : null,
    exr_scope: scope,
    exr_scope_id: scope === 'GLOBAL' ? null : scopeId ? Number(scopeId) : null,
    exr_action: 'SET_DAYS',
    exr_value: Number(gatilho) || 1,
    exr_priority: initialData?.exr_priority ?? 0,
    exr_valid_from: initialData?.exr_valid_from ?? null,
    exr_valid_to: initialData?.exr_valid_to ?? null,
    exr_risk_severity: initialData?.exr_risk_severity ?? null,
    exr_shift: null,
    exr_reason: reason.trim() || null,
    exr_environment: null,
    usr_id_insert: user?.usr_id ?? null,
    usr_id_lastupdate: user?.usr_id ?? null,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!eptId) {
      setError('Selecione o tipo de EPI.');
      return;
    }
    const gatilhoDays = Number(gatilho);
    if (!Number.isFinite(gatilhoDays) || gatilhoDays < 1) {
      setError('Informe o gatilho em dias (mínimo 1).');
      return;
    }
    if (scope !== 'GLOBAL' && !scopeId) {
      setError('Selecione o alvo do escopo.');
      return;
    }
    setSaving(true);
    try {
      const payload = buildPayload();
      if (initialData?.exr_id) {
        await exchangeRuleService.update(initialData.exr_id, payload);
      } else {
        await exchangeRuleService.create(payload);
      }
      onSaved?.();
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar gatilho');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="exchange-rule-form" onSubmit={handleSubmit}>
      {error && <div className="exchange-rule-form-error">{error}</div>}

      <div className="exchange-rule-form-toggle-row">
        <span className="exchange-rule-form-toggle-label">Ativo</span>
        <button
          type="button"
          className={`exchange-rule-toggle ${active === 1 ? 'exchange-rule-toggle--active' : ''}`}
          onClick={() => setActive(active === 1 ? 0 : 1)}
          aria-pressed={active === 1}
        >
          <span className="exchange-rule-toggle-thumb" />
        </button>
      </div>

      <div className="exchange-rule-form-grid">
        <div className="exchange-rule-form-row exchange-rule-form-row--top">
          <div className="exchange-rule-form-field">
            <label className="exchange-rule-form-label">Tipo de EPI</label>
            <select
              className="exchange-rule-form-input"
              value={eptId}
              onChange={(e) => setEptId(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {types.map((t) => (
                <option key={t.ept_id} value={t.ept_id}>
                  {t.ept_description}
                </option>
              ))}
            </select>
          </div>
          <div className="exchange-rule-form-field">
            <label className="exchange-rule-form-label">Escopo</label>
            <select
              className="exchange-rule-form-input"
              value={scope}
              onChange={(e) => {
                setScope(e.target.value as ExchangeRulePayload['exr_scope']);
                setScopeId('');
              }}
            >
              {(Object.keys(scopeLabels) as ExchangeRulePayload['exr_scope'][]).map(
                (k) => (
                  <option key={k} value={k}>
                    {scopeLabels[k]}
                  </option>
                )
              )}
            </select>
          </div>
        </div>

        <div className="exchange-rule-form-row exchange-rule-form-row--bottom">
          <div className="exchange-rule-form-field">
            <label className="exchange-rule-form-label">Nome do EPI</label>
            <div className="exchange-rule-form-static">
              {selectedEpiType?.ept_description ?? '—'}
            </div>
          </div>
          <div className="exchange-rule-form-field">
            <label className="exchange-rule-form-label">Vida útil</label>
            <div className="exchange-rule-form-static">
              {selectedEpiType != null ? `${selectedEpiType.ept_lifespan_days} dias` : '—'}
            </div>
          </div>
          <div className="exchange-rule-form-field">
            <label className="exchange-rule-form-label">Gatilho</label>
            <input
              type="number"
              min={1}
              className="exchange-rule-form-input"
              value={gatilho}
              onChange={(e) => setGatilho(e.target.value === '' ? '' : Number(e.target.value))}
              placeholder="Dias"
              disabled={!eptId}
              required
            />
          </div>
        </div>

        {scope !== 'GLOBAL' && (
          <div className="exchange-rule-form-field exchange-rule-form-field--full">
            <label className="exchange-rule-form-label">Alvo do escopo</label>
            <select
              className="exchange-rule-form-input"
              value={scopeId}
              onChange={(e) => setScopeId(e.target.value)}
              required
            >
              <option value="">Selecione...</option>
              {scopeOptions.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="exchange-rule-form-field exchange-rule-form-field--full">
          <label className="exchange-rule-form-label">Motivo / observação</label>
          <input
            type="text"
            className="exchange-rule-form-input"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ex: Setor químico — troca antecipada"
          />
        </div>
      </div>

      <div className="exchange-rule-form-actions">
        <button type="button" onClick={onClose} className="exchange-rule-form-cancel" disabled={saving}>
          Cancelar
        </button>
        <button type="submit" className="exchange-rule-form-submit" disabled={saving}>
          {saving ? 'Salvando...' : initialData ? 'Salvar' : 'Criar gatilho'}
        </button>
      </div>
    </form>
  );
};
