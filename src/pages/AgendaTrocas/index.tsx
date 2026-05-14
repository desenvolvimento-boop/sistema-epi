import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  AlertCircle, 
  CheckCircle2, 
  ChevronRight, 
  User, 
  Package,
  RefreshCw,
  ShieldCheck,
  X
} from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

const AGENDA_MOCK = [
  { id: 1, colaborador: 'João Silva', epi: 'Luva de Vaqueta', data: '10/03/2026', status: 'Pendente', prioridade: 'Alta', ca: '12345' },
  { id: 2, colaborador: 'Maria Oliveira', epi: 'Bota de Segurança', data: '12/03/2026', status: 'Pendente', prioridade: 'Média', ca: '23456' },
  { id: 3, colaborador: 'Carlos Santos', epi: 'Capacete de Segurança', data: '15/03/2026', status: 'Pendente', prioridade: 'Baixa', ca: '34567' },
  { id: 4, colaborador: 'Ana Costa', epi: 'Protetor Auricular', data: '09/03/2026', status: 'Atrasado', prioridade: 'Crítica', ca: '45678' },
];

const AgendaTrocas = () => {
  const navigate = useNavigate();
  const [selectedExchange, setSelectedExchange] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { canCreate } = useAuth();

  const handleOpenRegister = (item: any) => {
    setSelectedExchange(item);
    setIsModalOpen(true);
  };

  const handleConfirmExchange = () => {
    setIsModalOpen(false);
    setSelectedExchange(null);
  };

  return (
    <div className="agenda-container">
      <div className="agenda-header">
        <div>
          <h2 className="agenda-title">Agenda de Trocas</h2>
          <p className="agenda-subtitle">Planejamento preventivo de substituição de EPIs por vencimento.</p>
        </div>
        <div className="agenda-header-actions">
          <button 
            onClick={() => navigate('/agenda-trocas/calendario')}
            className="agenda-btn-calendar"
          >
            Visualizar Calendário
          </button>
          {canCreate('/agenda-trocas') && (
            <button className="agenda-btn-generate">
              Gerar Lote de Troca
            </button>
          )}
        </div>
      </div>

      <div className="agenda-stats-grid">
        <div className="agenda-stat-card">
          <p className="agenda-stat-label">Trocas para Hoje</p>
          <div className="agenda-stat-row">
            <h3 className="agenda-stat-value">12</h3>
            <span className="agenda-stat-badge">8 concluídas</span>
          </div>
        </div>
        <div className="agenda-stat-card">
          <p className="agenda-stat-label">Atrasadas</p>
          <div className="agenda-stat-row">
            <h3 className="agenda-stat-value--danger">05</h3>
            <AlertCircle className="agenda-icon-danger" />
          </div>
        </div>
        <div className="agenda-stat-card">
          <p className="agenda-stat-label">Próximos 7 Dias</p>
          <div className="agenda-stat-row">
            <h3 className="agenda-stat-value">48</h3>
            <Calendar className="agenda-icon-muted" />
          </div>
        </div>
        <div className="agenda-stat-card">
          <p className="agenda-stat-label">Taxa de Renovação</p>
          <div className="agenda-stat-row">
            <h3 className="agenda-stat-value--primary">92%</h3>
            <RefreshCw className="agenda-icon-primary" />
          </div>
        </div>
      </div>

      <div className="agenda-table-container">
        <div className="agenda-table-header">
          <h3 className="agenda-table-title">Cronograma de Substituição</h3>
          <div className="agenda-filter-row">
            <span className="agenda-filter-label">Filtrar por:</span>
            <select className="agenda-filter-select">
              <option>Todas as Prioridades</option>
              <option>Crítica</option>
              <option>Alta</option>
            </select>
          </div>
        </div>
        <div className="agenda-table-scroll">
          <table className="agenda-table">
            <thead>
              <tr className="agenda-table-head-row">
                <th className="agenda-th">Colaborador</th>
                <th className="agenda-th">EPI Alvo</th>
                <th className="agenda-th">Data Prevista</th>
                <th className="agenda-th">Prioridade</th>
                <th className="agenda-th--right">Ações</th>
              </tr>
            </thead>
            <tbody className="agenda-tbody">
              {AGENDA_MOCK.map(item => (
                <tr key={item.id} className="agenda-row">
                  <td className="agenda-td">
                    <div className="agenda-collaborator">
                      <div className="agenda-avatar">
                        <User className="agenda-avatar-icon" />
                      </div>
                      <span className="agenda-collaborator-name">{item.colaborador}</span>
                    </div>
                  </td>
                  <td className="agenda-td">
                    <div className="agenda-epi-cell">
                      <Package className="agenda-epi-icon" />
                      <span className="agenda-epi-text">{item.epi}</span>
                    </div>
                  </td>
                  <td className="agenda-td">
                    <div className="agenda-date-cell">
                      <Clock className={`agenda-clock-icon ${item.status === 'Atrasado' ? 'agenda-clock-icon-late' : 'agenda-clock-icon-normal'}`} />
                      <span className={`agenda-date-text ${item.status === 'Atrasado' ? 'agenda-date-late' : 'agenda-date-normal'}`}>
                        {item.data}
                      </span>
                    </div>
                  </td>
                  <td className="agenda-td">
                    <span className={`agenda-priority-badge ${
                      item.prioridade === 'Crítica' ? 'agenda-priority-critica' :
                      item.prioridade === 'Alta' ? 'agenda-priority-alta' :
                      'agenda-priority-default'
                    }`}>
                      {item.prioridade}
                    </span>
                  </td>
                  <td className="agenda-td--right">
                    {canCreate('/agenda-trocas') && (
                      <button 
                        onClick={() => handleOpenRegister(item)}
                        className="agenda-btn-register"
                      >
                        Registrar Troca
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Troca de EPI"
      >
        {selectedExchange && (
          <div className="agenda-modal-content">
            <div className="agenda-modal-info">
              <div className="agenda-modal-info-icon">
                <ShieldCheck className="agenda-icon-shield" />
              </div>
              <div>
                <p className="agenda-modal-info-title">Confirmação de Substituição</p>
                <p className="agenda-modal-info-desc">Ao confirmar, o sistema registrará a entrega do novo EPI e atualizará a ficha do colaborador.</p>
              </div>
            </div>

            <div className="agenda-modal-grid">
              <div className="agenda-modal-field">
                <p className="agenda-modal-label">Colaborador</p>
                <p className="agenda-modal-value">{selectedExchange.colaborador}</p>
              </div>
              <div className="agenda-modal-field">
                <p className="agenda-modal-label">EPI a ser Trocado</p>
                <p className="agenda-modal-value">{selectedExchange.epi}</p>
              </div>
              <div className="agenda-modal-field">
                <p className="agenda-modal-label">CA do Equipamento</p>
                <p className="agenda-modal-value--mono">{selectedExchange.ca}</p>
              </div>
              <div className="agenda-modal-field">
                <p className="agenda-modal-label">Data Prevista</p>
                <p className="agenda-modal-value--light">{selectedExchange.data}</p>
              </div>
            </div>

            <div className="agenda-modal-textarea-group">
              <label className="agenda-modal-textarea-label">Observações (Opcional)</label>
              <textarea 
                className="agenda-modal-textarea"
                placeholder="Ex: Troca antecipada por desgaste excessivo..."
                rows={3}
              />
            </div>

            <div className="agenda-modal-footer">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="agenda-btn-cancel"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmExchange}
                className="agenda-btn-confirm"
              >
                <CheckCircle2 className="agenda-icon-check" /> Confirmar Entrega
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AgendaTrocas;
