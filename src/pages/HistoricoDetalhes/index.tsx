import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ShieldCheck, 
  RefreshCw, 
  AlertTriangle, 
  ScanFace, 
  ArrowLeft,
  Calendar,
  User,
  Building2,
  MapPin
} from 'lucide-react';
import clsx from 'clsx';
import './styles.css';

const HistoricoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const historyItem = {
    id: Number(id),
    colaborador: 'Ricardo Silva',
    cpf: '123.456.789-00',
    matricula: 'MT-001',
    funcao: 'Operador de Empilhadeira',
    unidade: 'CD São Paulo',
    empresa: 'Terceira Log',
    timeline: [
      { type: 'Entrega', title: 'Entrega de EPI: Capacete H-700', date: '05 Mar 2024, 08:30', status: 'Validado via FaceID', icon: ShieldCheck, color: 'detalhes-timeline-color-primary' },
      { type: 'Troca', title: 'Troca de EPI: Luva Nitrílica', date: '20 Fev 2024, 14:20', status: 'Motivo: Desgaste Natural', icon: RefreshCw, color: 'detalhes-timeline-color-blue' },
      { type: 'Alerta', title: 'Não Conformidade Registrada', date: '15 Fev 2024, 10:00', status: 'Uso incorreto do protetor auricular', icon: AlertTriangle, color: 'detalhes-timeline-color-amber' },
      { type: 'Admissão', title: 'Integração e Treinamento de EPI', date: '12 Jan 2023, 09:00', status: 'Certificado Anexado', icon: CheckCircle2, color: 'detalhes-timeline-color-dark' },
    ]
  };

  return (
    <div className="detalhes-container">
      <div className="detalhes-header">
        <button 
          onClick={() => navigate('/historico')}
          className="detalhes-back-btn"
        >
          <ArrowLeft className="detalhes-back-icon" />
        </button>
        <div>
          <h2 className="detalhes-title">Prontuário Jurídico</h2>
          <p className="detalhes-subtitle">Rastreabilidade completa de eventos de segurança</p>
        </div>
      </div>

      <div className="detalhes-card">
        <div className="detalhes-badge-wrapper">
          <div className="detalhes-badge">
            <CheckCircle2 className="detalhes-icon-md" />
            <span className="detalhes-badge-text">Validado</span>
          </div>
        </div>

        <div className="detalhes-profile">
          <div className="detalhes-avatar">
            {historyItem.colaborador.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="detalhes-name">{historyItem.colaborador}</h2>
            <div className="detalhes-info-grid">
              <p className="detalhes-info-item">
                <User className="detalhes-info-icon" /> CPF: {historyItem.cpf} | Matrícula: {historyItem.matricula}
              </p>
              <p className="detalhes-info-item">
                <Building2 className="detalhes-info-icon" /> {historyItem.empresa}
              </p>
              <p className="detalhes-info-item">
                <MapPin className="detalhes-info-icon" /> {historyItem.unidade}
              </p>
              <p className="detalhes-info-item">
                <Calendar className="detalhes-info-icon" /> {historyItem.funcao}
              </p>
            </div>
          </div>
        </div>

        <div className="detalhes-timeline">
          {historyItem.timeline.map((item, i) => (
            <div key={i} className="detalhes-timeline-item">
              <div className={clsx("detalhes-timeline-icon-base", item.color)}>
                <item.icon className="detalhes-icon-md" />
              </div>
              <div className="detalhes-timeline-content">
                <div className="detalhes-timeline-header">
                  <span className="detalhes-timeline-type">{item.type}</span>
                  <span className="detalhes-timeline-date">{item.date}</span>
                </div>
                <h4 className="detalhes-timeline-title">{item.title}</h4>
                <p className="detalhes-timeline-status">{item.status}</p>
                {item.type === 'Entrega' && (
                  <button className="detalhes-evidence-btn">
                    <ScanFace className="detalhes-icon-xs" /> Ver Evidência Facial
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoricoDetalhes;
