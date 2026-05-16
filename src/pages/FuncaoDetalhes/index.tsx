import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, AlertTriangle, Users, Edit3, Trash2, CheckCircle2, Loader2, ChevronDown, ChevronRight } from 'lucide-react';
import { roleService, type RoleAPI, type RoleRiskAPI, type RoleEpiTypeWithLink } from '../../services/roleService';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

const FuncaoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { canEdit, canDelete } = useAuth();
  const allowEdit = canEdit('/funcoes');
  const allowDelete = canDelete('/funcoes');
  const roleId = Number(id);

  const [funcao, setFuncao] = useState<RoleAPI | null>(null);
  const [epiTypes, setEpiTypes] = useState<RoleEpiTypeWithLink[]>([]);
  const [expandedEptIds, setExpandedEptIds] = useState<Set<number>>(new Set());
  const [risks, setRisks] = useState<RoleRiskAPI[]>([]);
  const [loading, setLoading] = useState(true);

  const toggleExpanded = (eptId: number) => {
    setExpandedEptIds((prev) => {
      const next = new Set(prev);
      if (next.has(eptId)) next.delete(eptId);
      else next.add(eptId);
      return next;
    });
  };

  useEffect(() => {
    if (!roleId) return;
    const load = async () => {
      setLoading(true);
      try {
        const [role, linkedTypes, linkedRisks] = await Promise.all([
          roleService.getById(roleId),
          roleService.getEpiTypes(roleId, true),
          roleService.getRisks(roleId),
        ]);
        setFuncao(role);
        setEpiTypes(linkedTypes);
        setRisks(linkedRisks);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [roleId]);

  const handleDelete = async () => {
    if (!funcao || !confirm('Inativar esta função?')) return;
    try {
      await roleService.delete(funcao.rol_id);
      navigate('/funcoes');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao inativar');
    }
  };

  if (loading) {
    return (
      <div className="funcao-detalhes-container">
        <div className="funcao-detalhes-loading">
          <Loader2 className="funcao-detalhes-icon-sm funcao-detalhes-spin" />
          <span>Carregando...</span>
        </div>
      </div>
    );
  }

  if (!funcao) {
    return (
      <div className="funcao-detalhes-container">
        <p>Função não encontrada.</p>
        <button type="button" onClick={() => navigate('/funcoes')}>Voltar</button>
      </div>
    );
  }

  return (
    <div className="funcao-detalhes-container">
      <div className="funcao-detalhes-header">
        <div className="funcao-detalhes-header-left">
          <button onClick={() => navigate('/funcoes')} className="funcao-detalhes-back-btn" type="button">
            <ArrowLeft className="funcao-detalhes-back-icon" />
          </button>
          <div>
            <h2 className="funcao-detalhes-title">Detalhes da Função</h2>
            <p className="funcao-detalhes-subtitle">Configurações e requisitos de segurança</p>
          </div>
        </div>
        <div className="funcao-detalhes-header-actions">
          {allowEdit && (
            <button onClick={() => navigate(`/funcoes/${id}/editar`)} className="funcao-detalhes-edit-btn" type="button">
              <Edit3 className="funcao-detalhes-icon-sm" /> Editar
            </button>
          )}
          {allowDelete && (
            <button onClick={handleDelete} className="funcao-detalhes-delete-btn" type="button">
              <Trash2 className="funcao-detalhes-icon-sm" /> Inativar
            </button>
          )}
        </div>
      </div>

      <div className="funcao-detalhes-grid">
        <div className="funcao-detalhes-main">
          <div className="funcao-detalhes-info-card">
            <div>
              <h3 className="funcao-detalhes-nome">{funcao.rol_description}</h3>
              <p className="funcao-detalhes-descricao">{funcao.rol_activities || '—'}</p>
              {funcao.rol_code && <p className="funcao-detalhes-meta">Código: {funcao.rol_code}</p>}
              <span className={`funcao-detalhes-origin funcao-detalhes-origin-${(funcao.rol_integration_source || 'Manual').toLowerCase()}`}>
                Origem: {funcao.rol_integration_source || 'Manual'}
                {funcao.rol_integration_id ? ` (${funcao.rol_integration_id})` : ''}
              </span>
            </div>
            <div className="funcao-detalhes-epi-section">
              <h4 className="funcao-detalhes-epi-title">EPIs Obrigatórios (NR-06)</h4>
              <div className="funcao-detalhes-epi-grid">
                {epiTypes.length === 0 ? (
                  <p className="funcao-detalhes-empty">Nenhum tipo de EPI vinculado.</p>
                ) : (
                  epiTypes.map((epi) => {
                    const expanded = expandedEptIds.has(epi.ept_id);
                    const variants = epi.variants ?? [];
                    return (
                      <div key={epi.ept_id} className="funcao-detalhes-epi-item funcao-detalhes-epi-item-expandable">
                        <button
                          type="button"
                          className="funcao-detalhes-epi-toggle"
                          onClick={() => toggleExpanded(epi.ept_id)}
                          aria-expanded={expanded}
                        >
                          <div className="funcao-detalhes-epi-icon-wrapper">
                            <Shield className="funcao-detalhes-epi-icon" />
                          </div>
                          <div className="funcao-detalhes-epi-toggle-text">
                            <p className="funcao-detalhes-epi-name">{epi.ept_description}</p>
                            <p className="funcao-detalhes-epi-period">
                              {epi.ept_category} · {variants.length} variante{variants.length !== 1 ? 's' : ''} homologada{variants.length !== 1 ? 's' : ''}
                            </p>
                          </div>
                          {expanded ? (
                            <ChevronDown className="funcao-detalhes-epi-chevron" />
                          ) : (
                            <ChevronRight className="funcao-detalhes-epi-chevron" />
                          )}
                        </button>
                        {expanded && variants.length > 0 && (
                          <ul className="funcao-detalhes-variant-list">
                            {variants.map((v) => (
                              <li key={v.epv_id} className="funcao-detalhes-variant-item">
                                <span>{[v.epv_manufacturer, v.epv_model].filter(Boolean).join(' · ')}</span>
                                <span className="funcao-detalhes-variant-ca">CA {v.epv_ca}</span>
                              </li>
                            ))}
                          </ul>
                        )}
                        {expanded && variants.length === 0 && (
                          <p className="funcao-detalhes-variant-empty">Nenhuma variante cadastrada.</p>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>

          <div className="funcao-detalhes-riscos-card">
            <div className="funcao-detalhes-riscos-header">
              <h4 className="funcao-detalhes-riscos-title">
                <AlertTriangle className="funcao-detalhes-riscos-title-icon" /> Riscos Ocupacionais Identificados
              </h4>
            </div>
            <div className="funcao-detalhes-riscos-body">
              <table className="funcao-detalhes-riscos-table">
                <thead>
                  <tr className="funcao-detalhes-riscos-thead-row">
                    <th className="funcao-detalhes-riscos-th">Tipo</th>
                    <th className="funcao-detalhes-riscos-th">Agente</th>
                    <th className="funcao-detalhes-riscos-th">Origem</th>
                    <th className="funcao-detalhes-riscos-th-right">Severidade</th>
                  </tr>
                </thead>
                <tbody className="funcao-detalhes-riscos-tbody">
                  {risks.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="funcao-detalhes-riscos-cell">Nenhum risco cadastrado.</td>
                    </tr>
                  ) : (
                    risks.map((risco) => (
                      <tr key={risco.rsk_id} className="funcao-detalhes-riscos-row">
                        <td className="funcao-detalhes-riscos-cell">
                          <span className="funcao-detalhes-riscos-tipo">{risco.rsk_type}</span>
                        </td>
                        <td className="funcao-detalhes-riscos-cell">
                          <span className="funcao-detalhes-riscos-descricao">{risco.rsk_agent}</span>
                        </td>
                        <td className="funcao-detalhes-riscos-cell">
                          <span className={`funcao-detalhes-origin funcao-detalhes-origin-${(risco.rsk_integration_source || 'Manual').toLowerCase()}`}>
                            {risco.rsk_integration_source || 'Manual'}
                          </span>
                        </td>
                        <td className="funcao-detalhes-riscos-cell-right">
                          <span className={`funcao-detalhes-severidade ${
                            risco.rsk_severity === 'Alta' ? 'funcao-detalhes-severidade-alta' :
                            risco.rsk_severity === 'Média' ? 'funcao-detalhes-severidade-media' : 'funcao-detalhes-severidade-baixa'
                          }`}>
                            {risco.rsk_severity}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="funcao-detalhes-sidebar">
          <div className="funcao-detalhes-stats-card">
            <div className="funcao-detalhes-stats-header">
              <div className="funcao-detalhes-stats-icon-wrapper">
                <Users className="funcao-detalhes-stats-icon" />
              </div>
              <span className="funcao-detalhes-stats-badge">Ativos</span>
            </div>
            <h3 className="funcao-detalhes-stats-number">{funcao.employee_count ?? 0}</h3>
            <p className="funcao-detalhes-stats-text">Colaboradores vinculados a esta função atualmente.</p>
            <button onClick={() => navigate('/colaboradores')} className="funcao-detalhes-stats-btn" type="button">
              Ver Listagem Completa
            </button>
          </div>

          <div className="funcao-detalhes-conformidade-card">
            <h4 className="funcao-detalhes-conformidade-title">Conformidade Técnica</h4>
            <div className="funcao-detalhes-conformidade-list">
              <div className="funcao-detalhes-conformidade-item">
                <CheckCircle2 className="funcao-detalhes-conformidade-icon" />
                <span className="funcao-detalhes-conformidade-text">
                  {epiTypes.length > 0 ? 'Matriz de EPI configurada' : 'Matriz de EPI pendente'}
                </span>
              </div>
              <div className="funcao-detalhes-conformidade-item">
                <CheckCircle2 className="funcao-detalhes-conformidade-icon" />
                <span className="funcao-detalhes-conformidade-text">
                  {risks.length > 0 ? 'Riscos mapeados' : 'Riscos pendentes'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuncaoDetalhes;
