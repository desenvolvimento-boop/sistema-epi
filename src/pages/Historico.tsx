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
      case 'Validado': return 'bg-primary-100 text-primary-700';
      case 'Concluído': return 'bg-blue-100 text-blue-700';
      case 'Pendente': return 'bg-amber-100 text-amber-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  const getEventIcon = (tipo: string) => {
    switch (tipo) {
      case 'Entrega': return <ShieldCheck className="w-4 h-4 text-primary-500" />;
      case 'Troca': return <RefreshCw className="w-4 h-4 text-blue-500" />;
      case 'Alerta': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'Admissão': return <CheckCircle2 className="w-4 h-4 text-slate-900" />;
      default: return <History className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Histórico Geral</h2>
          <p className="text-slate-500">Rastreabilidade completa de todas as movimentações de EPI</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar colaborador..."
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Colaborador</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Empresa / Unidade</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Último Evento</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Data</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {HISTORICO_LIST_MOCK.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
                        {item.colaborador.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.colaborador}</p>
                        <p className="text-[10px] text-slate-500">ID: #{item.id.toString().padStart(4, '0')}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                      <p className="text-xs text-slate-600 flex items-center gap-1">
                        <Building2 className="w-3 h-3" /> {item.empresa}
                      </p>
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {item.unidade}
                      </p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {getEventIcon(item.tipo)}
                      <span className="text-xs font-medium text-slate-700">{item.ultimoEvento}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-600">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      {item.data}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex justify-center">
                      <button 
                        onClick={() => navigate(`/historico/${item.id}`)}
                        className="p-2 hover:bg-primary-50 text-slate-400 hover:text-primary-600 rounded-lg transition-all"
                        title="Visualizar Prontuário"
                      >
                        <Eye className="w-5 h-5" />
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
