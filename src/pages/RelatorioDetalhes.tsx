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
    <div className="space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/relatorios')}
            className="p-2 hover:bg-slate-100 rounded-full transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">{reportInfo.title}</h2>
            <p className="text-sm text-slate-500">Gerado em: {reportInfo.generatedAt}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
            <Printer className="w-4 h-4" /> Imprimir
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-sm">
            <Download className="w-4 h-4" /> Exportar PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Total de Itens</p>
          <h3 className="text-2xl font-bold text-slate-800">1.284</h3>
          <p className="text-xs text-primary-600 mt-1 font-medium">+12% vs mês anterior</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Custo Total</p>
          <h3 className="text-2xl font-bold text-slate-800">R$ 45.280</h3>
          <p className="text-xs text-red-600 mt-1 font-medium">+5% vs orçamento</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Colaboradores Atendidos</p>
          <h3 className="text-2xl font-bold text-slate-800">452</h3>
          <p className="text-xs text-slate-500 mt-1 font-medium">98% da base ativa</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Ticket Médio</p>
          <h3 className="text-2xl font-bold text-slate-800">R$ 100,17</h3>
          <p className="text-xs text-primary-600 mt-1 font-medium">-2% vs mês anterior</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Volume por Setor</h3>
          <div className="h-[300px]">
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

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Evolução de Custos</h3>
          <div className="h-[300px]">
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

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-800">Dados Detalhados</h3>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input type="text" placeholder="Filtrar resultados..." className="pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs w-48 focus:ring-2 focus:ring-primary-500 outline-none" />
            </div>
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Colaborador</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Setor</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Qtd Itens</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Valor Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {[
              { name: 'Ricardo Silva', sector: 'Logística', qty: 12, total: 'R$ 450,00' },
              { name: 'Ana Oliveira', sector: 'Produção', qty: 8, total: 'R$ 320,00' },
              { name: 'Marcos Santos', sector: 'Manutenção', qty: 15, total: 'R$ 890,00' },
              { name: 'Juliana Lima', sector: 'Logística', qty: 5, total: 'R$ 120,00' },
              { name: 'Carlos Eduardo', sector: 'Produção', qty: 10, total: 'R$ 410,00' },
            ].map((row, i) => (
              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4 text-sm font-medium text-slate-700">{row.name}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{row.sector}</td>
                <td className="px-6 py-4 text-sm text-slate-600 text-right font-mono">{row.qty}</td>
                <td className="px-6 py-4 text-sm text-slate-800 text-right font-bold">{row.total}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RelatorioDetalhes;
