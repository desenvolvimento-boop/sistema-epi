import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Eye, 
  History, 
  User, 
  Building2, 
  MapPin, 
  Calendar,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  ShieldCheck
} from 'lucide-react';
import './styles.css';

const HISTORICO_LIST_MOCK = [
  { 
    id: 1, 
    colaborador: 'Ricardo Silva', 
    empresa: 'Terceira Log', 
    unidade: 'CD São Paulo', 
    ultimoEvento: 'Entrega de EPI', 
    data: '05/03/2026', 
    status: 'Validado',
    tipo: 'Entrega'
  },
  { 
    id: 2, 
    colaborador: 'Ana Oliveira', 
    empresa: 'Logística Express', 
    unidade: 'Filial Campinas', 
    ultimoEvento: 'Troca de EPI', 
    data: '04/03/2026', 
    status: 'Concluído',
    tipo: 'Troca'
  },
  { 
    id: 3, 
    colaborador: 'Marcos Santos', 
    empresa: 'Terceira Log', 
    unidade: 'CD São Paulo', 
    ultimoEvento: 'Não Conformidade', 
    data: '03/03/2026', 
    status: 'Pendente',
    tipo: 'Alerta'
  },
  { 
    id: 4, 
    colaborador: 'Juliana Lima', 
    empresa: 'Logística Express', 
    unidade: 'Filial Campinas', 
    ultimoEvento: 'Admissão', 
    data: '01/03/2026', 
    status: 'Concluído',
    tipo: 'Admissão'
  },
  { 
    id: 5, 
    colaborador: 'Carlos Eduardo', 
    empresa: 'Terceira Log', 
    unidade: 'CD São Paulo', 
    ultimoEvento: 'Entrega de EPI', 
    data: '28/02/2026', 
    status: 'Validado',
    tipo: 'Entrega'
  },
];

const Historico = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Validado': return 'historico-status-validado';
      case 'Concluído': return 'historico-status-concluido';
      case 'Pendente': return 'historico-status-pendente';
      default: return 'historico-status-default';
    }
  };

  const getEventIcon = (tipo: string) => {
    switch (tipo) {
      case 'Entrega': return <ShieldCheck className="historico-icon-entrega" />;
      case 'Troca': return <RefreshCw className="historico-icon-troca" />;
      case 'Alerta': return <AlertTriangle className="historico-icon-alerta" />;
      case 'Admissão': return <CheckCircle2 className="historico-icon-admissao" />;
      default: return <History className="historico-icon-default" />;
    }
  };

  return (
    <div className="historico-container">
      <div className="historico-header">
        <div>
          <h2 className="historico-title">Histórico Geral</h2>
          <p className="historico-subtitle">Rastreabilidade completa de todas as movimentações de EPI</p>
        </div>
        
        <div className="historico-actions">
          <div className="historico-search-wrapper">
            <Search className="historico-search-icon" />
            <input
              type="text"
              placeholder="Buscar colaborador..."
              className="historico-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="historico-filter-btn">
            <Filter className="historico-icon-md" />
          </button>
        </div>
      </div>

      <div className="historico-table-card">
        <div className="historico-table-scroll">
          <table className="historico-table">
            <thead>
              <tr className="historico-thead-row">
                <th className="historico-th">Colaborador</th>
                <th className="historico-th">Empresa / Unidade</th>
                <th className="historico-th">Último Evento</th>
                <th className="historico-th">Data</th>
                <th className="historico-th">Status</th>
                <th className="historico-th-center">Ações</th>
              </tr>
            </thead>
            <tbody className="historico-tbody">
              {HISTORICO_LIST_MOCK.map((item) => (
                <tr key={item.id} className="historico-row">
                  <td className="historico-cell">
                    <div className="historico-colab-wrapper">
                      <div className="historico-avatar">
                        {item.colaborador.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="historico-colab-name">{item.colaborador}</p>
                        <p className="historico-colab-id">ID: #{item.id.toString().padStart(4, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="historico-cell">
                    <div className="historico-empresa-wrapper">
                      <p className="historico-empresa-text">
                        <Building2 className="historico-icon-xs" /> {item.empresa}
                      </p>
                      <p className="historico-unidade-text">
                        <MapPin className="historico-icon-xs" /> {item.unidade}
                      </p>
                    </div>
                  </td>
                  <td className="historico-cell">
                    <div className="historico-event-wrapper">
                      {getEventIcon(item.tipo)}
                      <span className="historico-event-text">{item.ultimoEvento}</span>
                    </div>
                  </td>
                  <td className="historico-cell">
                    <div className="historico-date-wrapper">
                      <Calendar className="historico-date-icon" />
                      {item.data}
                    </div>
                  </td>
                  <td className="historico-cell">
                    <span className={`historico-status-badge ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="historico-cell">
                    <div className="historico-action-wrapper">
                      <button 
                        onClick={() => navigate(`/historico/${item.id}`)}
                        className="historico-view-btn"
                        title="Visualizar Prontuário"
                      >
                        <Eye className="historico-icon-md" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Historico;
