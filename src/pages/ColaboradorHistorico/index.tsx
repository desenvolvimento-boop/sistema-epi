import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, History, Package, Calendar, CheckCircle2 } from 'lucide-react';
import { EMPLOYEES } from '../../services/api';
import './styles.css';

const ColaboradorHistorico = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const colaborador = EMPLOYEES.find(e => e.id === Number(id)) || EMPLOYEES[0];

  const HISTORICO_MOCK = [
    { id: 1, data: '10/03/2026', acao: 'Entrega de EPI', item: 'Luva de Vaqueta', status: 'Concluído', responsavel: 'Admin Master' },
    { id: 2, data: '05/03/2026', acao: 'Troca Programada', item: 'Bota de Segurança', status: 'Concluído', responsavel: 'Sistema (Auto)' },
    { id: 3, data: '20/02/2026', acao: 'Treinamento NR-06', item: 'Uso Correto de EPIs', status: 'Certificado', responsavel: 'Segurança do Trabalho' },
    { id: 4, data: '15/01/2026', acao: 'Admissão', item: 'Kit Inicial de EPIs', status: 'Concluído', responsavel: 'RH' },
  ];

  return (
    <div className="historico-container">
      <div className="historico-header">
        <button onClick={() => navigate('/colaboradores')} className="historico-back-btn">
          <ArrowLeft className="historico-back-icon" />
        </button>
        <div>
          <h2 className="historico-title">Histórico do Colaborador</h2>
          <p className="historico-subtitle">Rastreabilidade completa de {colaborador.nome}</p>
        </div>
      </div>

      <div className="historico-stats-grid">
        <div className="historico-stat-card">
          <div>
            <p className="historico-stat-label">Total de Entregas</p>
            <h3 className="historico-stat-value">24</h3>
          </div>
          <div className="historico-stat-icon--primary">
            <Package className="historico-stat-icon-inner" />
          </div>
        </div>
        <div className="historico-stat-card">
          <div>
            <p className="historico-stat-label">Última Atividade</p>
            <h3 className="historico-stat-value">10/03/2026</h3>
          </div>
          <div className="historico-stat-icon--blue">
            <Calendar className="historico-stat-icon-inner" />
          </div>
        </div>
        <div className="historico-stat-card">
          <div>
            <p className="historico-stat-label">Status de Conformidade</p>
            <h3 className="historico-stat-value--primary">100%</h3>
          </div>
          <div className="historico-stat-icon--emerald">
            <CheckCircle2 className="historico-stat-icon-inner" />
          </div>
        </div>
      </div>

      <div className="historico-card">
        <div className="historico-card-header">
          <h3 className="historico-card-title">
            <History className="historico-card-title-icon" /> Linha do Tempo de Atividades
          </h3>
        </div>
        <div className="historico-card-body">
          <div className="historico-timeline">
            {HISTORICO_MOCK.map((item) => (
              <div key={item.id} className="historico-timeline-item">
                <div className="historico-timeline-dot">
                  <div className="historico-timeline-dot-inner"></div>
                </div>
                <div className="historico-timeline-content">
                  <div className="historico-timeline-header">
                    <span className="historico-timeline-date">{item.data}</span>
                    <span className="historico-timeline-status">{item.status}</span>
                  </div>
                  <h4 className="historico-timeline-action">{item.acao}</h4>
                  <p className="historico-timeline-item-desc">{item.item}</p>
                  <div className="historico-timeline-footer">
                    <span className="historico-timeline-responsible">Responsável: <span className="historico-timeline-responsible-name">{item.responsavel}</span></span>
                    <button className="historico-timeline-link">Ver Comprovante</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColaboradorHistorico;
