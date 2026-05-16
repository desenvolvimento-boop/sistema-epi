import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react';
import { roleService, RISK_TYPES, RISK_SEVERITIES, type RoleAPI, type RoleRiskAPI } from '../../services/roleService';
import { FuncaoForm } from '../../components/forms/FuncaoForm';
import { INTEGRATION_SOURCES } from '../../services/epiService';
import './styles.css';

const FuncaoEditar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const roleId = Number(id);

  const [funcao, setFuncao] = useState<RoleAPI | null>(null);
  const [risks, setRisks] = useState<RoleRiskAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRiskForm, setShowRiskForm] = useState(false);
  const [riskType, setRiskType] = useState(RISK_TYPES[0]);
  const [riskAgent, setRiskAgent] = useState('');
  const [riskSeverity, setRiskSeverity] = useState<string>(RISK_SEVERITIES[0]);
  const [riskPgrRef, setRiskPgrRef] = useState('');
  const [riskIntegrationSource, setRiskIntegrationSource] = useState('Manual');
  const [riskIntegrationId, setRiskIntegrationId] = useState('');

  const load = async () => {
    if (!roleId) return;
    setLoading(true);
    try {
      const [role, linkedRisks] = await Promise.all([
        roleService.getById(roleId),
        roleService.getRisks(roleId),
      ]);
      setFuncao(role);
      setRisks(linkedRisks);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [roleId]);

  const resetRiskForm = () => {
    setRiskType(RISK_TYPES[0]);
    setRiskAgent('');
    setRiskSeverity(RISK_SEVERITIES[0]);
    setRiskPgrRef('');
    setRiskIntegrationSource('Manual');
    setRiskIntegrationId('');
    setShowRiskForm(false);
  };

  const handleAddRisk = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!riskAgent.trim()) return;
    try {
      await roleService.createRisk(roleId, {
        rsk_active: 1,
        rsk_type: riskType,
        rsk_agent: riskAgent.trim(),
        rsk_severity: riskSeverity,
        rsk_pgr_reference: riskPgrRef.trim() || null,
        rsk_integration_id: riskIntegrationId.trim() || null,
        rsk_integration_source: riskIntegrationSource,
        rsk_external_code: null,
        rsk_integration_sync_at: null,
        usr_id_insert: null,
        usr_id_lastupdate: null,
      });
      resetRiskForm();
      const updated = await roleService.getRisks(roleId);
      setRisks(updated);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao adicionar risco');
    }
  };

  const handleDeleteRisk = async (rskId: number) => {
    if (!confirm('Inativar este risco?')) return;
    try {
      await roleService.deleteRisk(roleId, rskId);
      setRisks(await roleService.getRisks(roleId));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao remover risco');
    }
  };

  if (loading) {
    return (
      <div className="funcao-editar-container">
        <div className="funcao-editar-loading">
          <Loader2 className="funcao-editar-back-icon funcao-editar-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  if (!funcao) {
    return (
      <div className="funcao-editar-container">
        <p>Função não encontrada.</p>
        <button type="button" onClick={() => navigate('/funcoes')}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="funcao-editar-container">
      <div className="funcao-editar-header">
        <button
          onClick={() => navigate(`/funcoes/${id}/detalhes`)}
          className="funcao-editar-back-btn"
          type="button"
        >
          <ArrowLeft className="funcao-editar-back-icon" />
        </button>
        <div>
          <h2 className="funcao-editar-title">Editar Função</h2>
          <p className="funcao-editar-subtitle">Atualize os requisitos para {funcao.rol_description}</p>
        </div>
      </div>

      <div className="funcao-editar-card">
        <FuncaoForm
          onClose={() => navigate(`/funcoes/${id}/detalhes`)}
          onSaved={() => navigate(`/funcoes/${id}/detalhes`)}
          initialData={funcao}
        />
      </div>

      <div className="funcao-editar-card funcao-editar-risks-card">
        <div className="funcao-editar-epis-header">
          <h3 className="funcao-editar-section-title">Riscos Ocupacionais</h3>
          <button type="button" onClick={() => setShowRiskForm(!showRiskForm)} className="funcao-editar-add-epi-btn">
            <Plus className="funcao-editar-add-epi-icon" /> Adicionar Risco
          </button>
        </div>

        {showRiskForm && (
          <form className="funcao-editar-risk-form" onSubmit={handleAddRisk}>
            <div className="funcao-editar-grid">
              <div className="funcao-editar-field-group">
                <label className="funcao-editar-label">Tipo</label>
                <select className="funcao-editar-input" value={riskType} onChange={(e) => setRiskType(e.target.value as typeof RISK_TYPES[number])}>
                  {RISK_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="funcao-editar-field-group">
                <label className="funcao-editar-label">Severidade</label>
                <select className="funcao-editar-input" value={riskSeverity} onChange={(e) => setRiskSeverity(e.target.value)}>
                  {RISK_SEVERITIES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="funcao-editar-field-group funcao-editar-field-full">
                <label className="funcao-editar-label">Descrição do agente</label>
                <input className="funcao-editar-input" value={riskAgent} onChange={(e) => setRiskAgent(e.target.value)} required />
              </div>
              <div className="funcao-editar-field-group">
                <label className="funcao-editar-label">Ref. PGR</label>
                <input className="funcao-editar-input" value={riskPgrRef} onChange={(e) => setRiskPgrRef(e.target.value)} />
              </div>
              <div className="funcao-editar-field-group">
                <label className="funcao-editar-label">Origem</label>
                <select className="funcao-editar-input" value={riskIntegrationSource} onChange={(e) => setRiskIntegrationSource(e.target.value)}>
                  {INTEGRATION_SOURCES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div className="funcao-editar-field-group">
                <label className="funcao-editar-label">ID TOTVS/ERP</label>
                <input className="funcao-editar-input" value={riskIntegrationId} onChange={(e) => setRiskIntegrationId(e.target.value)} />
              </div>
            </div>
            <div className="funcao-editar-risk-actions">
              <button type="button" className="funcao-editar-cancel-btn" onClick={resetRiskForm}>Cancelar</button>
              <button type="submit" className="funcao-editar-save-btn">Salvar Risco</button>
            </div>
          </form>
        )}

        <table className="funcao-editar-risks-table">
          <thead>
            <tr>
              <th>Tipo</th>
              <th>Agente</th>
              <th>Origem</th>
              <th>Severidade</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {risks.map((r) => (
              <tr key={r.rsk_id}>
                <td>{r.rsk_type}</td>
                <td>{r.rsk_agent}</td>
                <td>
                  <span className={`funcao-editar-origin funcao-editar-origin-${(r.rsk_integration_source || 'Manual').toLowerCase()}`}>
                    {r.rsk_integration_source || 'Manual'}
                  </span>
                </td>
                <td>{r.rsk_severity}</td>
                <td>
                  {r.rsk_integration_source === 'Manual' && (
                    <button type="button" onClick={() => handleDeleteRisk(r.rsk_id)} className="funcao-editar-epi-remove-btn">
                      <Trash2 className="funcao-editar-epi-remove-icon" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FuncaoEditar;
