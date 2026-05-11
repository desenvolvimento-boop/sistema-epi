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

const CONSUMO_MOCK = [
  { id: 1, colaborador: 'João Silva', epi: 'Luva de Vaqueta', data: '09/03/2026 10:15', motivo: 'Substituição (Vencimento)', custo: 'R$ 45,00' },
  { id: 2, colaborador: 'Maria Oliveira', epi: 'Bota de Segurança', data: '09/03/2026 09:30', motivo: 'Nova Admissão', custo: 'R$ 120,00' },
  { id: 3, colaborador: 'Carlos Santos', epi: 'Capacete de Segurança', data: '08/03/2026 16:45', motivo: 'Dano Acidental', custo: 'R$ 85,00' },
  { id: 4, colaborador: 'Ana Costa', epi: 'Protetor Auricular', data: '08/03/2026 14:20', motivo: 'Substituição (Desgaste)', custo: 'R$ 15,00' },
];

const Consumo = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Registro de Consumo</h2>
          <p className="text-sm text-slate-500 mt-1">Acompanhamento em tempo real do fluxo de saída de EPIs.</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
          <Download className="w-4 h-4" /> Exportar Log
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Consumo Hoje</span>
            <span className="flex items-center text-primary-600 text-[10px] font-bold bg-primary-50 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> 12%
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-800">142 un.</p>
          <p className="text-xs text-slate-500 mt-1">EPIs entregues nas últimas 24h</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Custo Estimado</span>
            <span className="flex items-center text-red-600 text-[10px] font-bold bg-red-50 px-1.5 py-0.5 rounded">
              <ArrowUpRight className="w-3 h-3 mr-0.5" /> 5%
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-800">R$ 4.280,00</p>
          <p className="text-xs text-slate-500 mt-1">Investimento em proteção (Mês)</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-400 uppercase">Eficiência de Troca</span>
            <span className="flex items-center text-primary-600 text-[10px] font-bold bg-primary-50 px-1.5 py-0.5 rounded">
              <ArrowDownRight className="w-3 h-3 mr-0.5" /> 2%
            </span>
          </div>
          <p className="text-2xl font-bold text-slate-800">98.4%</p>
          <p className="text-xs text-slate-500 mt-1">Trocas realizadas no prazo correto</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Filtrar consumo..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs w-64 focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <button className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white border border-transparent hover:border-slate-200 rounded-lg transition-all">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Colaborador</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">EPI Entregue</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Data / Hora</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Motivo</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Custo</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {CONSUMO_MOCK.map(item => (
              <tr key={item.id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center">
                      <User className="w-4 h-4 text-slate-400" />
                    </div>
                    <span className="text-sm font-bold text-slate-800">{item.colaborador}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <Package className="w-3 h-3 text-primary-500" />
                    <span className="text-sm text-slate-700">{item.epi}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{item.data}</td>
                <td className="px-6 py-4">
                  <span className="text-xs font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded-md">
                    {item.motivo}
                  </span>
                </td>
                <td className="px-6 py-4 text-right text-sm font-bold text-slate-800">{item.custo}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Consumo;
