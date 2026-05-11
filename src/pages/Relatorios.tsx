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
      color: 'bg-blue-50 text-blue-600',
    },
    {
      id: 'vencimento-epi',
      title: 'EPIs Próximos ao Vencimento',
      description: 'Lista de equipamentos que precisam de troca imediata.',
      icon: AlertCircle,
      color: 'bg-amber-50 text-amber-600',
    },
    {
      id: 'custos-mensais',
      title: 'Custos Mensais',
      description: 'Análise financeira de investimentos em proteção.',
      icon: TrendingUp,
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Relatórios e BI</h2>
          <p className="text-slate-500 text-sm mt-1">Análise de dados e exportação de indicadores de segurança.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-10 pr-8 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-2 focus:ring-primary-500 appearance-none cursor-pointer"
            >
              <option>Ultimos 7 dias</option>
              <option>Ultimos 30 dias</option>
              <option>Este Mês</option>
              <option>Este Ano</option>
              <option>Personalizado</option>
            </select>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
            <Filter className="w-4 h-4" /> Filtros
          </button>
        </div>
      </div>

      {/* Quick Access Reports */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-100">
          {reportCards.map((report, index) => (
            <button 
              key={index}
              onClick={() => navigate(`/relatorios/${report.id}`)}
              className="group flex items-center gap-4 p-5 hover:bg-slate-50 transition-all text-left"
            >
              <div className={`w-10 h-10 rounded-xl ${report.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                <report.icon className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-slate-800 text-sm group-hover:text-primary-600 transition-colors">{report.title}</h3>
                <p className="text-[10px] text-slate-500 line-clamp-1">{report.description}</p>
              </div>
              <ChevronRight className="w-4 h-4 ml-auto text-slate-300 group-hover:text-primary-400 transition-colors" />
            </button>
          ))}
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Consumption Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-bold text-slate-800">Consumo Mensal de EPIs</h3>
              <p className="text-xs text-slate-500 mt-1">Volume total de entregas realizadas por mês.</p>
            </div>
            <div className="flex gap-2">
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all" title="Imprimir">
                <Printer className="w-4 h-4" />
              </button>
              <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-50 rounded-lg transition-all" title="Exportar CSV">
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
          
          <div className="h-[300px] w-full">
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

        {/* Distribution Chart */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-2">Distribuição por Categoria</h3>
          <p className="text-xs text-slate-500 mb-8">Participação de cada tipo de EPI no consumo total.</p>
          
          <div className="h-[250px] w-full">
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

          <div className="mt-6 space-y-3">
            {epiDistributionData.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[index] }}></div>
                  <span className="text-xs font-medium text-slate-600">{item.name}</span>
                </div>
                <span className="text-xs font-bold text-slate-800">{item.value} un.</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reports Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Relatórios Gerados Recentemente</h3>
          <button className="text-xs font-bold text-primary-600 hover:underline">Ver todos</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Relatório</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Data de Geração</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Formato</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { name: 'Consumo_Mensal_Unidade_SP.pdf', date: '09/03/2026 10:45', format: 'PDF', status: 'Concluído' },
                { name: 'Inventario_EPI_Geral.xlsx', date: '08/03/2026 15:20', format: 'Excel', status: 'Concluído' },
                { name: 'Relatorio_Vencimentos_EPI.pdf', date: '07/03/2026 09:12', format: 'PDF', status: 'Concluído' },
              ].map((item, i) => (
                <tr key={i} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-slate-100 rounded-lg text-slate-500">
                        <FileText className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-medium text-slate-700">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-slate-500">{item.date}</td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${item.format === 'PDF' ? 'bg-red-50 text-red-600' : 'bg-primary-50 text-primary-600'}`}>
                      {item.format}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>
                      <span className="text-xs font-medium text-slate-600">{item.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" title="Download">
                        <Download className="w-4 h-4" />
                      </button>
                      <button className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Enviar por E-mail">
                        <Mail className="w-4 h-4" />
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
