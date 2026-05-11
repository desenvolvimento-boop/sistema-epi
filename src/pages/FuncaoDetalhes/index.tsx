import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, AlertTriangle, Users, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import { ROLES } from '../../services/api';
import './styles.css';

const FuncaoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const funcao = ROLES.find(r => r.id === Number(id)) || ROLES[0];

  const RISCOS_MOCK = [
    { tipo: 'Físico', descricao: 'Ruído contínuo acima de 85dB', severidade: 'Alta' },
    { tipo: 'Químico', descricao: 'Exposição a vapores orgânicos', severidade: 'Média' },
    { tipo: 'Ergonômico', descricao: 'Postura inadequada prolongada', severidade: 'Baixa' },
  ];

  return (
    <div className="funcao-detalhes-container">
      <div className="funcao-detalhes-header">
        <div className="funcao-detalhes-header-left">
          <button onClick={() => navigate('/funcoes')} className="funcao-detalhes-back-btn">
            <ArrowLeft className="funcao-detalhes-back-icon" />
          </button>
          <div>
            <h2 className="funcao-detalhes-title">Detalhes da Função</h2>
            <p className="funcao-detalhes-subtitle">Configurações e requisitos de segurança</p>
          </div>
        </div>
        <div className="funcao-detalhes-header-actions">
          <button onClick={() => navigate(`/funcoes/${id}/editar`)} className="funcao-detalhes-edit-btn">
            <Edit3 className="funcao-detalhes-icon-sm" /> Editar
          </button>
          <button className="funcao-detalhes-delete-btn">
            <Trash2 className="funcao-detalhes-icon-sm" /> Excluir
          </button>
        </div>
      </div>

      <div className="funcao-detalhes-grid">
        <div className="funcao-detalhes-main">
          <div className="funcao-detalhes-info-card">
            <div>
              <h3 className="funcao-detalhes-nome">{funcao.nome}</h3>
              <p className="funcao-detalhes-descricao">{funcao.descricao}</p>
            </div>
            <div className="funcao-detalhes-epi-section">
              <h4 className="funcao-detalhes-epi-title">EPIs Obrigatórios (NR-06)</h4>
              <div className="funcao-detalhes-epi-grid">
                {funcao.epis.map((epi, index) => (
                  <div key={index} className="funcao-detalhes-epi-item">
                    <div className="funcao-detalhes-epi-icon-wrapper">
                      <Shield className="funcao-detalhes-epi-icon" />
                    </div>
                    <div>
                      <p className="funcao-detalhes-epi-name">{epi}</p>
                      <p className="funcao-detalhes-epi-period">Troca a cada 180 dias</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="funcao-detalhes-riscos-card">
            <div className="funcao-detalhes-riscos-header">
              <h4 className="funcao-detalhes-riscos-title">
                <AlertTriangle className="funcao-detalhes-riscos-title-icon" /> Riscos Ocupacionais Identificados
              </h4>
              <button className="funcao-detalhes-riscos-link">Ver PGR Completo</button>
            </div>
            <div className="funcao-detalhes-riscos-body">
              <table className="funcao-detalhes-riscos-table">
                <thead>
                  <tr className="funcao-detalhes-riscos-thead-row">
                    <th className="funcao-detalhes-riscos-th">Tipo de Risco</th>
                    <th className="funcao-detalhes-riscos-th">Descrição do Agente</th>
                    <th className="funcao-detalhes-riscos-th-right">Severidade</th>
                  </tr>
                </thead>
                <tbody className="funcao-detalhes-riscos-tbody">
                  {RISCOS_MOCK.map((risco, index) => (
                    <tr key={index} className="funcao-detalhes-riscos-row">
                      <td className="funcao-detalhes-riscos-cell">
                        <span className="funcao-detalhes-riscos-tipo">{risco.tipo}</span>
                      </td>
                      <td className="funcao-detalhes-riscos-cell">
                        <span className="funcao-detalhes-riscos-descricao">{risco.descricao}</span>
                      </td>
                      <td className="funcao-detalhes-riscos-cell-right">
                        <span className={`funcao-detalhes-severidade ${
                          risco.severidade === 'Alta' ? 'funcao-detalhes-severidade-alta' :
                          risco.severidade === 'Média' ? 'funcao-detalhes-severidade-media' : 'funcao-detalhes-severidade-baixa'
                        }`}>
                          {risco.severidade}
                        </span>
                      </td>
                    </tr>
                  ))}
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
            <h3 className="funcao-detalhes-stats-number">128</h3>
            <p className="funcao-detalhes-stats-text">Colaboradores vinculados a esta função atualmente.</p>
            <button onClick={() => navigate('/colaboradores')} className="funcao-detalhes-stats-btn">
              Ver Listagem Completa
            </button>
          </div>

          <div className="funcao-detalhes-conformidade-card">
            <h4 className="funcao-detalhes-conformidade-title">Conformidade Técnica</h4>
            <div className="funcao-detalhes-conformidade-list">
              <div className="funcao-detalhes-conformidade-item">
                <CheckCircle2 className="funcao-detalhes-conformidade-icon" />
                <span className="funcao-detalhes-conformidade-text">PGR Atualizado (2026)</span>
              </div>
              <div className="funcao-detalhes-conformidade-item">
                <CheckCircle2 className="funcao-detalhes-conformidade-icon" />
                <span className="funcao-detalhes-conformidade-text">LTCAT Vinculado</span>
              </div>
              <div className="funcao-detalhes-conformidade-item">
                <CheckCircle2 className="funcao-detalhes-conformidade-icon" />
                <span className="funcao-detalhes-conformidade-text">PCMSO em Dia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuncaoDetalhes;
