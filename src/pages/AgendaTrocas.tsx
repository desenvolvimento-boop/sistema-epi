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
import { Modal } from '../components/ui/Modal';

import { useNavigate } from 'react-router-dom';

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

  const handleOpenRegister = (item: any) => {
    setSelectedExchange(item);
    setIsModalOpen(true);
  };

  const handleConfirmExchange = () => {
    // Logic to register exchange would go here
    setIsModalOpen(false);
    setSelectedExchange(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Agenda de Trocas</h2>
          <p className="text-sm text-slate-500 mt-1">Planejamento preventivo de substituição de EPIs por vencimento.</p>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/agenda-trocas/calendario')}
            className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
          >
            Visualizar Calendário
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-sm shadow-primary-200">
            Gerar Lote de Troca
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Trocas para Hoje</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-slate-800">12</h3>
            <span className="text-xs font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-md">8 concluídas</span>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Atrasadas</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-red-600">05</h3>
            <AlertCircle className="w-5 h-5 text-red-500 mb-1" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Próximos 7 Dias</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-slate-800">48</h3>
            <Calendar className="w-5 h-5 text-slate-400 mb-1" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Taxa de Renovação</p>
          <div className="flex items-end justify-between">
            <h3 className="text-2xl font-bold text-primary-600">92%</h3>
            <RefreshCw className="w-5 h-5 text-primary-500 mb-1" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
          <h3 className="font-bold text-slate-800">Cronograma de Substituição</h3>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500">Filtrar por:</span>
            <select className="bg-white border border-slate-200 rounded-lg text-xs px-2 py-1 focus:ring-2 focus:ring-primary-500 outline-none transition-all">
              <option>Todas as Prioridades</option>
              <option>Crítica</option>
              <option>Alta</option>
            </select>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Colaborador</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">EPI Alvo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Data Prevista</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Prioridade</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {AGENDA_MOCK.map(item => (
                <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-primary-50 transition-colors">
                        <User className="w-4 h-4 text-slate-400 group-hover:text-primary-600" />
                      </div>
                      <span className="text-sm font-bold text-slate-800">{item.colaborador}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <Package className="w-3 h-3 text-slate-400" />
                      <span className="text-sm text-slate-700">{item.epi}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <Clock className={`w-3 h-3 ${item.status === 'Atrasado' ? 'text-red-500' : 'text-slate-400'}`} />
                      <span className={`text-sm font-medium ${item.status === 'Atrasado' ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                        {item.data}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold uppercase ${
                      item.prioridade === 'Crítica' ? 'bg-red-100 text-red-600' :
                      item.prioridade === 'Alta' ? 'bg-orange-100 text-orange-600' :
                      'bg-blue-100 text-blue-600'
                    }`}>
                      {item.prioridade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => handleOpenRegister(item)}
                      className="px-3 py-1.5 bg-primary-50 text-primary-600 text-xs font-bold rounded-lg hover:bg-primary-600 hover:text-white transition-all shadow-sm shadow-primary-50"
                    >
                      Registrar Troca
                    </button>
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
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-primary-50 border border-primary-100 rounded-2xl">
              <div className="p-3 bg-primary-100 text-primary-600 rounded-xl">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-bold text-primary-800">Confirmação de Substituição</p>
                <p className="text-xs text-primary-600 mt-0.5">Ao confirmar, o sistema registrará a entrega do novo EPI e atualizará a ficha do colaborador.</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Colaborador</p>
                <p className="text-sm font-bold text-slate-800">{selectedExchange.colaborador}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">EPI a ser Trocado</p>
                <p className="text-sm font-bold text-slate-800">{selectedExchange.epi}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">CA do Equipamento</p>
                <p className="text-sm font-mono text-slate-600">{selectedExchange.ca}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Data Prevista</p>
                <p className="text-sm text-slate-600">{selectedExchange.data}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-700">Observações (Opcional)</label>
              <textarea 
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                placeholder="Ex: Troca antecipada por desgaste excessivo..."
                rows={3}
              />
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => setIsModalOpen(false)}
                className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button 
                onClick={handleConfirmExchange}
                className="flex items-center gap-2 px-8 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
              >
                <CheckCircle2 className="w-4 h-4" /> Confirmar Entrega
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AgendaTrocas;
