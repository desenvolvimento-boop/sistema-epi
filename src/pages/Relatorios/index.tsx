import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart3, 
  Download, 
  Filter, 
  Calendar, 
  FileText, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle2,
  ChevronRight,
  Printer,
  Mail
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line
} from 'recharts';
import './styles.css';

const consumptionData = [
  { month: 'Jan', value: 450 },
  { month: 'Fev', value: 520 },
  { month: 'Mar', value: 480 },
  { month: 'Abr', value: 610 },
  { month: 'Mai', value: 550 },
  { month: 'Jun', value: 670 },
];

const epiDistributionData = [
  { name: 'Luvas', value: 400 },
  { name: 'Capacetes', value: 300 },
  { name: 'Botas', value: 300 },
  { name: 'Óculos', value: 200 },
];

const COLORS = ['#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe'];

const Relatorios = () => {
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState('Ultimos 30 dias');

  const reportCards = [
    {
      id: 'consumo-colaborador',
      title: 'Consumo por Colaborador',
      description: 'Detalhamento de entregas e custos por funcionário.',
      icon: FileText,
      color: 'relatorios-report-color-blue',
    },
    {
      id: 'vencimento-epi',
      title: 'EPIs Próximos ao Vencimento',
      description: 'Lista de equipamentos que precisam de troca imediata.',
      icon: AlertCircle,
      color: 'relatorios-report-color-amber',
    },
    {
      id: 'custos-mensais',
      title: 'Custos Mensais',
      description: 'Análise financeira de investimentos em proteção.',
      icon: TrendingUp,
      color: 'relatorios-report-color-purple',
    },
  ];

  return (
    <div className="relatorios-container">
      <div className="relatorios-header">
        <div>
          <h2 className="relatorios-title">Relatórios e BI</h2>
          <p className="relatorios-subtitle">Análise de dados e exportação de indicadores de segurança.</p>
        </div>
        
        <div className="relatorios-filters">
          <div className="relatorios-date-wrapper">
            <Calendar className="relatorios-date-icon" />
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="relatorios-date-select"
            >
              <option>Ultimos 7 dias</option>
              <option>Ultimos 30 dias</option>
              <option>Este Mês</option>
              <option>Este Ano</option>
              <option>Personalizado</option>
            </select>
          </div>
          <button className="relatorios-filter-btn">
            <Filter className="relatorios-icon-sm" /> Filtros
          </button>
        </div>
      </div>

      <div className="relatorios-quick-card">
        <div className="relatorios-quick-grid">
          {reportCards.map((report, index) => (
            <button 
              key={index}
              onClick={() => navigate(`/relatorios/${report.id}`)}
              className="relatorios-report-btn"
            >
              <div className={`relatorios-report-icon-wrapper ${report.color}`}>
                <report.icon className="relatorios-icon-md" />
              </div>
              <div>
                <h3 className="relatorios-report-title">{report.title}</h3>
                <p className="relatorios-report-desc">{report.description}</p>
              </div>
              <ChevronRight className="relatorios-chevron" />
            </button>
          ))}
        </div>
      </div>

      <div className="relatorios-charts-grid">
        <div className="relatorios-consumption-card">
          <div className="relatorios-chart-header">
            <div>
              <h3 className="relatorios-chart-title">Consumo Mensal de EPIs</h3>
              <p className="relatorios-chart-desc">Volume total de entregas realizadas por mês.</p>
            </div>
            <div className="relatorios-chart-actions">
              <button className="relatorios-chart-action-btn" title="Imprimir">
                <Printer className="relatorios-icon-sm" />
              </button>
              <button className="relatorios-chart-action-btn" title="Exportar CSV">
                <Download className="relatorios-icon-sm" />
              </button>
            </div>
          </div>
          
          <div className="relatorios-chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={consumptionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="relatorios-distribution-card">
          <h3 className="relatorios-dist-title">Distribuição por Categoria</h3>
          <p className="relatorios-dist-desc">Participação de cada tipo de EPI no consumo total.</p>
          
          <div className="relatorios-dist-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={epiDistributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {epiDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="relatorios-legend">
            {epiDistributionData.map((item, index) => (
              <div key={index} className="relatorios-legend-item">
                <div className="relatorios-legend-name">
                  <div className="relatorios-legend-dot" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="relatorios-legend-text">{item.name}</span>
                </div>
                <span className="relatorios-legend-value">{item.value} un.</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="relatorios-recent-card">
        <div className="relatorios-recent-header">
          <h3 className="relatorios-recent-title">Relatórios Gerados Recentemente</h3>
          <button className="relatorios-see-all-btn">Ver todos</button>
        </div>
        <div className="relatorios-table-scroll">
          <table className="relatorios-table">
            <thead>
              <tr className="relatorios-thead-row">
                <th className="relatorios-th">Relatório</th>
                <th className="relatorios-th">Data de Geração</th>
                <th className="relatorios-th">Formato</th>
                <th className="relatorios-th">Status</th>
                <th className="relatorios-th-right">Ações</th>
              </tr>
            </thead>
            <tbody className="relatorios-tbody">
              {[
                { name: 'Consumo_Mensal_Unidade_SP.pdf', date: '09/03/2026 10:45', format: 'PDF', status: 'Concluído' },
                { name: 'Inventario_EPI_Geral.xlsx', date: '08/03/2026 15:20', format: 'Excel', status: 'Concluído' },
                { name: 'Relatorio_Vencimentos_EPI.pdf', date: '07/03/2026 09:12', format: 'PDF', status: 'Concluído' },
              ].map((item, i) => (
                <tr key={i} className="relatorios-row">
                  <td className="relatorios-cell">
                    <div className="relatorios-file-wrapper">
                      <div className="relatorios-file-icon">
                        <FileText className="relatorios-icon-sm" />
                      </div>
                      <span className="relatorios-file-name">{item.name}</span>
                    </div>
                  </td>
                  <td className="relatorios-cell-date">{item.date}</td>
                  <td className="relatorios-cell">
                    <span className={`relatorios-format-badge ${item.format === 'PDF' ? 'relatorios-format-pdf' : 'relatorios-format-excel'}`}>
                      {item.format}
                    </span>
                  </td>
                  <td className="relatorios-cell">
                    <div className="relatorios-status-wrapper">
                      <div className="relatorios-status-dot"></div>
                      <span className="relatorios-status-text">{item.status}</span>
                    </div>
                  </td>
                  <td className="relatorios-cell-right">
                    <div className="relatorios-actions">
                      <button className="relatorios-action-download" title="Download">
                        <Download className="relatorios-icon-sm" />
                      </button>
                      <button className="relatorios-action-email" title="Enviar por E-mail">
                        <Mail className="relatorios-icon-sm" />
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

export default Relatorios;
