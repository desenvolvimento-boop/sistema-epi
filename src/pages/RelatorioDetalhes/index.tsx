import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Download, 
  Printer, 
  Mail, 
  Calendar, 
  Filter,
  FileText,
  TrendingUp,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';
import './styles.css';

const MOCK_DATA = [
  { name: 'Setor A', value: 400, cost: 2400 },
  { name: 'Setor B', value: 300, cost: 1398 },
  { name: 'Setor C', value: 200, cost: 9800 },
  { name: 'Setor D', value: 278, cost: 3908 },
  { name: 'Setor E', value: 189, cost: 4800 },
];

const RelatorioDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const reportInfo = {
    title: 'Consumo por Colaborador',
    description: 'Análise detalhada de entregas e custos por funcionário no período selecionado.',
    period: '01/02/2026 - 01/03/2026',
    generatedAt: '14/03/2026 12:40'
  };

  return (
    <div className="rel-detalhes-container">
      <div className="rel-detalhes-header">
        <div className="rel-detalhes-header-left">
          <button 
            onClick={() => navigate('/relatorios')}
            className="rel-detalhes-back-btn"
          >
            <ArrowLeft className="rel-detalhes-back-icon" />
          </button>
          <div>
            <h2 className="rel-detalhes-title">{reportInfo.title}</h2>
            <p className="rel-detalhes-subtitle">Gerado em: {reportInfo.generatedAt}</p>
          </div>
        </div>
        <div className="rel-detalhes-actions">
          <button className="rel-detalhes-print-btn">
            <Printer className="rel-detalhes-icon-sm" /> Imprimir
          </button>
          <button className="rel-detalhes-export-btn">
            <Download className="rel-detalhes-icon-sm" /> Exportar PDF
          </button>
        </div>
      </div>

      <div className="rel-detalhes-stats-grid">
        <div className="rel-detalhes-stat-card">
          <p className="rel-detalhes-stat-label">Total de Itens</p>
          <h3 className="rel-detalhes-stat-value">1.284</h3>
          <p className="rel-detalhes-stat-change rel-detalhes-stat-positive">+12% vs mês anterior</p>
        </div>
        <div className="rel-detalhes-stat-card">
          <p className="rel-detalhes-stat-label">Custo Total</p>
          <h3 className="rel-detalhes-stat-value">R$ 45.280</h3>
          <p className="rel-detalhes-stat-change rel-detalhes-stat-negative">+5% vs orçamento</p>
        </div>
        <div className="rel-detalhes-stat-card">
          <p className="rel-detalhes-stat-label">Colaboradores Atendidos</p>
          <h3 className="rel-detalhes-stat-value">452</h3>
          <p className="rel-detalhes-stat-change rel-detalhes-stat-neutral">98% da base ativa</p>
        </div>
        <div className="rel-detalhes-stat-card">
          <p className="rel-detalhes-stat-label">Ticket Médio</p>
          <h3 className="rel-detalhes-stat-value">R$ 100,17</h3>
          <p className="rel-detalhes-stat-change rel-detalhes-stat-positive">-2% vs mês anterior</p>
        </div>
      </div>

      <div className="rel-detalhes-charts-grid">
        <div className="rel-detalhes-chart-card">
          <h3 className="rel-detalhes-chart-title">Volume por Setor</h3>
          <div className="rel-detalhes-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rel-detalhes-chart-card">
          <h3 className="rel-detalhes-chart-title">Evolução de Custos</h3>
          <div className="rel-detalhes-chart-area">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MOCK_DATA}>
                <defs>
                  <linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="cost" stroke="#3b82f6" fillOpacity={1} fill="url(#colorCost)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="rel-detalhes-table-card">
        <div className="rel-detalhes-table-header">
          <h3 className="rel-detalhes-table-title">Dados Detalhados</h3>
          <div className="rel-detalhes-filter-wrapper">
            <div className="rel-detalhes-filter-input-wrapper">
              <Filter className="rel-detalhes-filter-icon" />
              <input type="text" placeholder="Filtrar resultados..." className="rel-detalhes-filter-input" />
            </div>
          </div>
        </div>
        <table className="rel-detalhes-table">
          <thead>
            <tr className="rel-detalhes-thead-row">
              <th className="rel-detalhes-th">Colaborador</th>
              <th className="rel-detalhes-th">Setor</th>
              <th className="rel-detalhes-th-right">Qtd Itens</th>
              <th className="rel-detalhes-th-right">Valor Total</th>
            </tr>
          </thead>
          <tbody className="rel-detalhes-tbody">
            {[
              { name: 'Ricardo Silva', sector: 'Logística', qty: 12, total: 'R$ 450,00' },
              { name: 'Ana Oliveira', sector: 'Produção', qty: 8, total: 'R$ 320,00' },
              { name: 'Marcos Santos', sector: 'Manutenção', qty: 15, total: 'R$ 890,00' },
              { name: 'Juliana Lima', sector: 'Logística', qty: 5, total: 'R$ 120,00' },
              { name: 'Carlos Eduardo', sector: 'Produção', qty: 10, total: 'R$ 410,00' },
            ].map((row, i) => (
              <tr key={i} className="rel-detalhes-row">
                <td className="rel-detalhes-cell-name">{row.name}</td>
                <td className="rel-detalhes-cell-sector">{row.sector}</td>
                <td className="rel-detalhes-cell-qty">{row.qty}</td>
                <td className="rel-detalhes-cell-total">{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RelatorioDetalhes;
