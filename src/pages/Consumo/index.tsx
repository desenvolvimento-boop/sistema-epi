import React from 'react';
import { 
  ClipboardList, 
  Search, 
  Filter, 
  Download, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
  User
} from 'lucide-react';
import './styles.css';

const CONSUMO_MOCK = [
  { id: 1, colaborador: 'João Silva', epi: 'Luva de Vaqueta', data: '09/03/2026 10:15', motivo: 'Substituição (Vencimento)', custo: 'R$ 45,00' },
  { id: 2, colaborador: 'Maria Oliveira', epi: 'Bota de Segurança', data: '09/03/2026 09:30', motivo: 'Nova Admissão', custo: 'R$ 120,00' },
  { id: 3, colaborador: 'Carlos Santos', epi: 'Capacete de Segurança', data: '08/03/2026 16:45', motivo: 'Dano Acidental', custo: 'R$ 85,00' },
  { id: 4, colaborador: 'Ana Costa', epi: 'Protetor Auricular', data: '08/03/2026 14:20', motivo: 'Substituição (Desgaste)', custo: 'R$ 15,00' },
];

const Consumo = () => {
  return (
    <div className="consumo-page">
      <div className="consumo-header">
        <div>
          <h2 className="consumo-title">Registro de Consumo</h2>
          <p className="consumo-subtitle">Acompanhamento em tempo real do fluxo de saída de EPIs.</p>
        </div>
        <button className="consumo-export-btn">
          <Download className="consumo-export-icon" /> Exportar Log
        </button>
      </div>

      <div className="consumo-stats-grid">
        <div className="consumo-stat-card">
          <div className="consumo-stat-header">
            <span className="consumo-stat-label">Consumo Hoje</span>
            <span className="consumo-stat-badge-primary">
              <ArrowUpRight className="consumo-stat-badge-icon" /> 12%
            </span>
          </div>
          <p className="consumo-stat-value">142 un.</p>
          <p className="consumo-stat-desc">EPIs entregues nas últimas 24h</p>
        </div>
        <div className="consumo-stat-card">
          <div className="consumo-stat-header">
            <span className="consumo-stat-label">Custo Estimado</span>
            <span className="consumo-stat-badge-danger">
              <ArrowUpRight className="consumo-stat-badge-icon" /> 5%
            </span>
          </div>
          <p className="consumo-stat-value">R$ 4.280,00</p>
          <p className="consumo-stat-desc">Investimento em proteção (Mês)</p>
        </div>
        <div className="consumo-stat-card">
          <div className="consumo-stat-header">
            <span className="consumo-stat-label">Eficiência de Troca</span>
            <span className="consumo-stat-badge-primary">
              <ArrowDownRight className="consumo-stat-badge-icon" /> 2%
            </span>
          </div>
          <p className="consumo-stat-value">98.4%</p>
          <p className="consumo-stat-desc">Trocas realizadas no prazo correto</p>
        </div>
      </div>

      <div className="consumo-table-wrapper">
        <div className="consumo-table-toolbar">
          <div className="consumo-table-toolbar-left">
            <div className="consumo-search-wrapper">
              <Search className="consumo-search-icon" />
              <input 
                type="text" 
                placeholder="Filtrar consumo..." 
                className="consumo-search-input"
              />
            </div>
            <button className="consumo-filter-btn">
              <Filter className="consumo-filter-icon" />
            </button>
          </div>
        </div>
        <table className="consumo-table">
          <thead>
            <tr className="consumo-table-head-row">
              <th className="consumo-table-th">Colaborador</th>
              <th className="consumo-table-th">EPI Entregue</th>
              <th className="consumo-table-th">Data / Hora</th>
              <th className="consumo-table-th">Motivo</th>
              <th className="consumo-table-th-right">Custo</th>
            </tr>
          </thead>
          <tbody className="consumo-table-body">
            {CONSUMO_MOCK.map(item => (
              <tr key={item.id} className="consumo-table-row">
                <td className="consumo-table-td">
                  <div className="consumo-colaborador-cell">
                    <div className="consumo-avatar">
                      <User className="consumo-avatar-icon" />
                    </div>
                    <span className="consumo-colaborador-name">{item.colaborador}</span>
                  </div>
                </td>
                <td className="consumo-table-td">
                  <div className="consumo-epi-cell">
                    <Package className="consumo-epi-icon" />
                    <span className="consumo-epi-name">{item.epi}</span>
                  </div>
                </td>
                <td className="consumo-date-text">{item.data}</td>
                <td className="consumo-table-td">
                  <span className="consumo-motivo-badge">
                    {item.motivo}
                  </span>
                </td>
                <td className="consumo-custo-cell">{item.custo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Consumo;
