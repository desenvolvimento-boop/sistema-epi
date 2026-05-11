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
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Modal } from '../components/ui/Modal';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

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
    ALTA: "bg-red-50 text-red-600 border-red-100",
    MEDIA: "bg-amber-50 text-amber-600 border-amber-100",
    BAIXA: "bg-blue-50 text-blue-600 border-blue-100"
  };

  return (
    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase", styles[severity])}>
      {severity}
    </span>
  );
};

const StatusBadge = ({ status }: { status: BIInterference['status'] }) => {
  const styles = {
    PENDENTE: "bg-slate-100 text-slate-600",
    ANALISADO: "bg-emerald-100 text-emerald-600",
    DESCARTADO: "bg-slate-200 text-slate-400"
  };

  return (
    <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full uppercase", styles[status])}>
      {status}
    </span>
  );
};

const Intercorrencias = () => {
  const [selectedItem, setSelectedItem] = useState<BIInterference | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center shadow-sm">
            <AlertOctagon className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Intercorrências</h2>
            <p className="text-slate-500 text-sm">Inconsistências e possíveis fraudes identificadas pela Inteligência de Dados.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 transition-all">
            <Download className="w-4 h-4" /> Exportar Relatório
          </button>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Alertas Críticos</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-red-600">08</h3>
            <div className="p-2 bg-red-50 text-red-600 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400">Últimas 24 horas</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Aguardando Análise</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-amber-600">15</h3>
            <div className="p-2 bg-amber-50 text-amber-600 rounded-xl">
              <BarChart3 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400">Total pendente</p>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
          <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">Taxa de Fraude</p>
          <div className="flex items-end justify-between">
            <h3 className="text-3xl font-black text-slate-800">1.2%</h3>
            <div className="p-2 bg-slate-50 text-slate-600 rounded-xl">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <p className="text-xs text-slate-400">Média mensal</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[240px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por colaborador ou tipo de alerta..." 
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          <select className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-primary-500">
            <option>Severidade: Todas</option>
            <option>Alta</option>
            <option>Média</option>
            <option>Baixa</option>
          </select>
          <select className="px-4 py-2 bg-slate-50 border border-slate-100 rounded-xl text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-primary-500">
            <option>Status: Todos</option>
            <option>Pendente</option>
            <option>Analisado</option>
            <option>Descartado</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Intercorrência</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Colaborador / Data</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Severidade</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_BI_DATA.map((item) => (
              <tr 
                key={item.id} 
                className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                onClick={() => { setSelectedItem(item); setIsModalOpen(true); }}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "p-2 rounded-lg shrink-0",
                      item.severity === 'ALTA' ? "bg-red-50 text-red-600" : 
                      item.severity === 'MEDIA' ? "bg-amber-50 text-amber-600" : "bg-blue-50 text-blue-600"
                    )}>
                      <AlertOctagon className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{item.description}</p>
                      <span className="text-[10px] font-bold text-slate-400">#{item.id}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-700">{item.colaborador}</p>
                  <p className="text-xs text-slate-500">{item.data}</p>
                </td>
                <td className="px-6 py-4">
                  <SeverityBadge severity={item.severity} />
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={item.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 group-hover:text-primary-600 group-hover:bg-primary-50 rounded-lg transition-all">
                    <Eye className="w-4 h-4" />
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
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center",
                selectedItem.severity === 'ALTA' ? "bg-red-100 text-red-600" : "bg-amber-100 text-amber-600"
              )}>
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800">{selectedItem.description}</p>
                <p className="text-xs text-slate-500">Identificado em {selectedItem.data}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Colaborador Alvo</p>
                <p className="text-sm font-bold text-slate-800">{selectedItem.colaborador}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Severidade do Risco</p>
                <SeverityBadge severity={selectedItem.severity} />
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase">Evidências e Detalhes</p>
              <div className="p-4 bg-slate-900 text-slate-300 rounded-2xl text-xs font-mono leading-relaxed">
                {selectedItem.detalhes}
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3 bg-slate-100 text-slate-600 rounded-xl text-sm font-bold hover:bg-slate-200 transition-all"
              >
                Descartar Alerta
              </button>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-100"
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
