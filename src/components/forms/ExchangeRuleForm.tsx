import React, { useEffect, useState } from 'react';
import {
  exchangeRuleService,
  type ExchangeRuleAPI,
  type ExchangeRulePayload,
  EXCHANGE_ACTION_LABELS,
  EXCHANGE_SCOPE_LABELS,
} from '../../services/exchangeRuleService';
import { epiTypeService, type EpiTypeAPI } from '../../services/epiTypeService';
import { companyService } from '../../services/companyService';
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
  const [action, setAction] = useState<ExchangeRulePayload['exr_action']>(
    initialData?.exr_action ?? 'SET_DAYS'
  );
  const [value, setValue] = useState(initialData?.exr_value ?? 30);
  const [reason, setReason] = useState(initialData?.exr_reason ?? '');

  useEffect(() => {
    Promise.all([
      epiTypeService.getActive(),
      companyService.getActive(),
      sectionService.getActive(),
      roleService.getActive(),
      employeeService.getActive(),
    ])
      .then(([t, c, s, r, e]) => {
        setTypes(t);
        setCompanies(c.map((x) => ({ id: x.com_id, label: x.com_description })));
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
    setAction(initialData.exr_action);
    setValue(initialData.exr_value);
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
    exr_action: action,
    exr_value: Number(value) || 1,
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
        <div className="exchange-rule-form-field">
          <label className="exchange-rule-form-label">Tipo de EPI</label>
          <select
            className="exchange-rule-form-input"
            value={eptId}
            onChange={(e) => setEptId(e.target.value)}
          >
            <option value="">Todos os tipos</option>
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
            {(Object.keys(EXCHANGE_SCOPE_LABELS) as ExchangeRulePayload['exr_scope'][]).map(
              (k) => (
                <option key={k} value={k}>
                  {EXCHANGE_SCOPE_LABELS[k]}
                </option>
              )
            )}
          </select>
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

        <div className="exchange-rule-form-field">
          <label className="exchange-rule-form-label">Ação</label>
          <select
            className="exchange-rule-form-input"
            value={action}
            onChange={(e) => setAction(e.target.value as ExchangeRulePayload['exr_action'])}
          >
            {(Object.keys(EXCHANGE_ACTION_LABELS) as ExchangeRulePayload['exr_action'][]).map(
              (k) => (
                <option key={k} value={k}>
                  {EXCHANGE_ACTION_LABELS[k]}
                </option>
              )
            )}
          </select>
        </div>

        <div className="exchange-rule-form-field">
          <label className="exchange-rule-form-label">Valor</label>
          <input
            type="number"
            min={1}
            className="exchange-rule-form-input"
            value={value}
            onChange={(e) => setValue(Number(e.target.value))}
            required
          />
        </div>

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
