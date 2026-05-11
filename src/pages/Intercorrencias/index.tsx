import React, { useState } from 'react';
import { 
  AlertOctagon, 
  Search, 
  Filter, 
  Download, 
  ChevronRight, 
  User, 
  Shield, 
  Calendar, 
  MapPin,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Eye,
  BarChart3
} from 'lucide-react';
import { motion } from 'motion/react';
import clsx from 'clsx';
import { Modal } from '../../components/ui/Modal';
import './styles.css';

interface BIInterference {
  id: string;
  type: 'FRAUDE_FACIAL' | 'DIVERGENCIA_CARGO' | 'CONSUMO_ANORMAL' | 'GEO_INCONSISTENTE';
  severity: 'ALTA' | 'MEDIA' | 'BAIXA';
  description: string;
  colaborador: string;
  data: string;
  detalhes: string;
  status: 'PENDENTE' | 'ANALISADO' | 'DESCARTADO';
}

const MOCK_BI_DATA: BIInterference[] = [
  {
    id: 'BI-001',
    type: 'FRAUDE_FACIAL',
    severity: 'ALTA',
    description: 'Colaborador do reconhecimento facial diferente do esperado',
    colaborador: 'João Silva Oliveira',
    data: '15/04/2024 08:45',
    detalhes: 'A face detectada possui 92% de similaridade com outro colaborador (Marcos Souza) e apenas 12% com o João Silva.',
    status: 'PENDENTE'
  },
  {
    id: 'BI-002',
    type: 'CONSUMO_ANORMAL',
    severity: 'MEDIA',
    description: 'Solicitação de EPI acima da média histórica do cargo',
    colaborador: 'Maria Santos Ferreira',
    data: '14/04/2024 15:20',
    detalhes: 'Solicitou 4 pares de luvas em 7 dias. A média para o cargo de Auxiliar de Limpeza é 1 par a cada 15 dias.',
    status: 'PENDENTE'
  },
  {
    id: 'BI-003',
    type: 'GEO_INCONSISTENTE',
    severity: 'ALTA',
    description: 'Registro de entrega fora do perímetro do contrato',
    colaborador: 'Ricardo Pereira',
    data: '14/04/2024 10:10',
    detalhes: 'O registro foi realizado a 15km de distância da unidade vinculada ao contrato do colaborador.',
    status: 'ANALISADO'
  },
  {
    id: 'BI-004',
    type: 'DIVERGENCIA_CARGO',
    severity: 'BAIXA',
    description: 'Solicitação de EPI não previsto na Matriz de Riscos',
    colaborador: 'Ana Paula Costa',
    data: '13/04/2024 09:30',
    detalhes: 'Tentativa de retirada de Protetor Facial, porém o cargo de Recepcionista não possui este EPI na matriz.',
    status: 'PENDENTE'
  }
];

const SeverityBadge = ({ severity }: { severity: BIInterference['severity'] }) => {
  const styles = {
    ALTA: "intercorrencias-severity-alta",
    MEDIA: "intercorrencias-severity-media",
    BAIXA: "intercorrencias-severity-baixa"
  };

  return (
    <span className={clsx("intercorrencias-severity-badge", styles[severity])}>
      {severity}
    </span>
  );
};

const StatusBadge = ({ status }: { status: BIInterference['status'] }) => {
  const styles = {
    PENDENTE: "intercorrencias-status-pendente",
    ANALISADO: "intercorrencias-status-analisado",
    DESCARTADO: "intercorrencias-status-descartado"
  };

  return (
    <span className={clsx("intercorrencias-status-badge", styles[status])}>
      {status}
    </span>
  );
};

const Intercorrencias = () => {
  const [selectedItem, setSelectedItem] = useState<BIInterference | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="intercorrencias-container">
      <div className="intercorrencias-header">
        <div className="intercorrencias-header-left">
          <div className="intercorrencias-icon-box">
            <AlertOctagon className="intercorrencias-icon-lg" />
          </div>
          <div>
            <h2 className="intercorrencias-title">Intercorrências</h2>
            <p className="intercorrencias-subtitle">Inconsistências e possíveis fraudes identificadas pela Inteligência de Dados.</p>
          </div>
        </div>
        <div className="intercorrencias-header-actions">
          <button className="intercorrencias-export-btn">
            <Download className="intercorrencias-btn-icon" /> Exportar Relatório
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="intercorrencias-stats-grid">
        <div className="intercorrencias-stat-card">
          <p className="intercorrencias-stat-label">Alertas Críticos</p>
          <div className="intercorrencias-stat-row">
            <h3 className="intercorrencias-stat-value--red">08</h3>
            <div className="intercorrencias-stat-icon-box--red">
              <AlertTriangle className="intercorrencias-stat-icon" />
            </div>
          </div>
          <p className="intercorrencias-stat-footnote">Últimas 24 horas</p>
        </div>
        <div className="intercorrencias-stat-card">
          <p className="intercorrencias-stat-label">Aguardando Análise</p>
          <div className="intercorrencias-stat-row">
            <h3 className="intercorrencias-stat-value--amber">15</h3>
            <div className="intercorrencias-stat-icon-box--amber">
              <BarChart3 className="intercorrencias-stat-icon" />
            </div>
          </div>
          <p className="intercorrencias-stat-footnote">Total pendente</p>
        </div>
        <div className="intercorrencias-stat-card">
          <p className="intercorrencias-stat-label">Taxa de Fraude</p>
          <div className="intercorrencias-stat-row">
            <h3 className="intercorrencias-stat-value--slate">1.2%</h3>
            <div className="intercorrencias-stat-icon-box--slate">
              <CheckCircle2 className="intercorrencias-stat-icon" />
            </div>
          </div>
          <p className="intercorrencias-stat-footnote">Média mensal</p>
        </div>
      </div>

      {/* Filters */}
      <div className="intercorrencias-filter-bar">
        <div className="intercorrencias-search-wrapper">
          <Search className="intercorrencias-search-icon" />
          <input 
            type="text" 
            placeholder="Buscar por colaborador ou tipo de alerta..." 
            className="intercorrencias-search-input"
          />
        </div>
        <div className="intercorrencias-filter-group">
          <select className="intercorrencias-select">
            <option>Severidade: Todas</option>
            <option>Alta</option>
            <option>Média</option>
            <option>Baixa</option>
          </select>
          <select className="intercorrencias-select">
            <option>Status: Todos</option>
            <option>Pendente</option>
            <option>Analisado</option>
            <option>Descartado</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="intercorrencias-table-wrapper">
        <table className="intercorrencias-table">
          <thead>
            <tr className="intercorrencias-thead-row">
              <th className="intercorrencias-th">Intercorrência</th>
              <th className="intercorrencias-th">Colaborador / Data</th>
              <th className="intercorrencias-th">Severidade</th>
              <th className="intercorrencias-th">Status</th>
              <th className="intercorrencias-th--right">Ações</th>
            </tr>
          </thead>
          <tbody className="intercorrencias-tbody">
            {MOCK_BI_DATA.map((item) => (
              <tr 
                key={item.id} 
                className="intercorrencias-row"
                onClick={() => { setSelectedItem(item); setIsModalOpen(true); }}
              >
                <td className="intercorrencias-cell">
                  <div className="intercorrencias-cell-content">
                    <div className={clsx(
                      "intercorrencias-cell-icon-box",
                      item.severity === 'ALTA' ? "intercorrencias-cell-icon-alta" : 
                      item.severity === 'MEDIA' ? "intercorrencias-cell-icon-media" : "intercorrencias-cell-icon-baixa"
                    )}>
                      <AlertOctagon className="intercorrencias-btn-icon" />
                    </div>
                    <div>
                      <p className="intercorrencias-description">{item.description}</p>
                      <span className="intercorrencias-id-tag">#{item.id}</span>
                    </div>
                  </div>
                </td>
                <td className="intercorrencias-cell">
                  <p className="intercorrencias-colaborador-name">{item.colaborador}</p>
                  <p className="intercorrencias-colaborador-date">{item.data}</p>
                </td>
                <td className="intercorrencias-cell">
                  <SeverityBadge severity={item.severity} />
                </td>
                <td className="intercorrencias-cell">
                  <StatusBadge status={item.status} />
                </td>
                <td className="intercorrencias-cell--right">
                  <button className="intercorrencias-action-btn">
                    <Eye className="intercorrencias-btn-icon" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalhes */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Análise de Intercorrência"
      >
        {selectedItem && (
          <div className="intercorrencias-modal-content">
            <div className="intercorrencias-modal-header">
              <div className={clsx(
                "intercorrencias-modal-icon-box",
                selectedItem.severity === 'ALTA' ? "intercorrencias-modal-icon-alta" : "intercorrencias-modal-icon-media"
              )}>
                <AlertTriangle className="intercorrencias-icon-lg" />
              </div>
              <div>
                <p className="intercorrencias-modal-description">{selectedItem.description}</p>
                <p className="intercorrencias-modal-date">Identificado em {selectedItem.data}</p>
              </div>
            </div>

            <div className="intercorrencias-modal-grid">
              <div className="intercorrencias-modal-field">
                <p className="intercorrencias-modal-field-label">Colaborador Alvo</p>
                <p className="intercorrencias-modal-field-value">{selectedItem.colaborador}</p>
              </div>
              <div className="intercorrencias-modal-field">
                <p className="intercorrencias-modal-field-label">Severidade do Risco</p>
                <SeverityBadge severity={selectedItem.severity} />
              </div>
            </div>

            <div className="intercorrencias-evidence-section">
              <p className="intercorrencias-evidence-label">Evidências e Detalhes</p>
              <div className="intercorrencias-evidence-box">
                {selectedItem.detalhes}
              </div>
            </div>

            <div className="intercorrencias-modal-actions">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="intercorrencias-discard-btn"
              >
                Descartar Alerta
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="intercorrencias-confirm-btn"
              >
                Confirmar e Bloquear
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Intercorrencias;
