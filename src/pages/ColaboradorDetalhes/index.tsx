import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreHorizontal, ShieldCheck, FileText, AlertTriangle, UserMinus, RefreshCw } from 'lucide-react';
import { EMPLOYEES } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import './styles.css';

const ColaboradorDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const colaborador = EMPLOYEES.find(e => e.id === Number(id)) || EMPLOYEES[0];

  const ACÕES_ADICIONAIS = [
    { label: 'Emitir Ficha de EPI', icon: FileText, iconClass: 'detalhes-admin-icon-emitir', path: 'emitir-ficha' },
    { label: 'Transferir Unidade', icon: RefreshCw, iconClass: 'detalhes-admin-icon-transferir', path: 'transferir-unidade' },
    { label: 'Desativar Colaborador', icon: UserMinus, iconClass: 'detalhes-admin-icon-desativar', path: 'desativar' },
  ];

  return (
    <div className="detalhes-container">
      <div className="detalhes-header">
        <div className="detalhes-header-left">
          <button 
            onClick={() => navigate('/colaboradores')}
            className="detalhes-back-btn"
          >
            <ArrowLeft className="detalhes-back-icon" />
          </button>
          <div>
            <h2 className="detalhes-title">Detalhes do Colaborador</h2>
            <p className="detalhes-subtitle">Gestão avançada de perfil</p>
          </div>
        </div>
        <button className="detalhes-more-btn">
          <MoreHorizontal className="detalhes-more-icon" />
        </button>
      </div>

      <div className="detalhes-grid">
        <div className="detalhes-main">
          <div className="detalhes-profile-card">
            <div className="detalhes-avatar">
              {colaborador.nome.charAt(0)}
            </div>
            <div className="detalhes-profile-info">
              <div>
                <div className="detalhes-name-row">
                  <h3 className="detalhes-name">{colaborador.nome}</h3>
                  <StatusBadge status={colaborador.status} />
                </div>
                <p className="detalhes-role">{colaborador.funcao} • {colaborador.empresa}</p>
              </div>
              <div className="detalhes-info-grid">
                <div>
                  <p className="detalhes-info-label">Matrícula</p>
                  <p className="detalhes-info-value">{colaborador.matricula}</p>
                </div>
                <div>
                  <p className="detalhes-info-label">CPF</p>
                  <p className="detalhes-info-value">{colaborador.cpf}</p>
                </div>
                <div>
                  <p className="detalhes-info-label">Admissão</p>
                  <p className="detalhes-info-value">{colaborador.admissao}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="detalhes-protection-card">
            <div className="detalhes-protection-icon-wrapper">
              <ShieldCheck className="detalhes-protection-icon" />
            </div>
            <div className="detalhes-protection-content">
              <h4 className="detalhes-protection-title">Status de Proteção</h4>
              <p className="detalhes-protection-text">
                Este colaborador possui todos os EPIs obrigatórios para sua função devidamente entregues e dentro do prazo de validade.
              </p>
              <button className="detalhes-protection-btn">
                Ver Matriz de EPIs
              </button>
            </div>
          </div>
        </div>

        <div className="detalhes-sidebar">
          <div className="detalhes-admin-card">
            <h4 className="detalhes-admin-title">Ações Administrativas</h4>
            <div className="detalhes-admin-actions">
              {ACÕES_ADICIONAIS.map((acao, index) => (
                <button 
                  key={index}
                  onClick={() => navigate(`/colaboradores/${id}/${acao.path}`)}
                  className="detalhes-admin-btn"
                >
                  <div className={`detalhes-admin-icon ${acao.iconClass}`}>
                    <acao.icon className="detalhes-admin-icon-inner" />
                  </div>
                  <span className="detalhes-admin-label">{acao.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="detalhes-footer-card">
            <p className="detalhes-footer-text">
              Última atualização cadastral realizada por <span className="detalhes-footer-bold">Admin Master</span> em 09/03/2026 às 14:30.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColaboradorDetalhes;
