import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, History, UserCog, MoreVertical, Check, X } from 'lucide-react';
import { EMPLOYEES } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { ColaboradorForm } from '../components/forms/ColaboradorForm';

const Colaboradores = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const isValidationNeeded = (status: string) => {
    return status === 'Aguardando validação' || status === 'Erro na validação';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Filtrar por nome, CPF ou matrícula..." 
              className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-sm w-80 focus:ring-2 focus:ring-primary-500 transition-all"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Filter className="w-4 h-4" /> Filtros Avançados
          </button>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-sm shadow-primary-200"
        >
          <Plus className="w-4 h-4" /> Novo Colaborador
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Cadastrar Novo Colaborador"
      >
        <ColaboradorForm onClose={() => setIsModalOpen(false)} />
      </Modal>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Colaborador</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Matrícula / CPF</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Função / Empresa</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {EMPLOYEES.map((emp) => (
              <tr key={emp.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold overflow-hidden">
                      {isValidationNeeded(emp.status) ? (
                        <div className="w-full h-full bg-slate-200 flex items-center justify-center relative group/photo">
                          <img 
                            src={`https://i.pravatar.cc/150?u=${emp.id}`} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                            referrerPolicy="no-referrer"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/photo:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                            <span className="text-[8px] text-white font-bold uppercase tracking-tighter">Ver Foto</span>
                          </div>
                        </div>
                      ) : emp.nome.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{emp.nome}</p>
                      <p className="text-xs text-slate-500">Admitido em {emp.admissao}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-700 font-mono">{emp.matricula}</p>
                  <p className="text-xs text-slate-500">{emp.cpf}</p>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-700">{emp.funcao}</p>
                  <p className="text-xs text-slate-500">{emp.empresa} - {emp.unidade}</p>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={emp.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {isValidationNeeded(emp.status) ? (
                      <div className="flex items-center gap-1">
                        <button 
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-600 hover:text-white rounded-lg text-xs font-bold transition-all border border-emerald-100"
                          title="Aprovar Cadastro"
                        >
                          <Check className="w-3.5 h-3.5" /> Aprovar
                        </button>
                        <button 
                          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-red-50 text-red-600 hover:bg-red-600 hover:text-white rounded-lg text-xs font-bold transition-all border border-red-100"
                          title="Recusar Cadastro"
                        >
                          <X className="w-3.5 h-3.5" /> Recusar
                        </button>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => navigate(`/colaboradores/${emp.id}/historico`)}
                          className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all" 
                          title="Histórico Completo"
                        >
                          <History className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => navigate(`/colaboradores/${emp.id}/editar`)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                          title="Editar"
                        >
                          <UserCog className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    <button 
                      onClick={() => navigate(`/colaboradores/${emp.id}/detalhes`)}
                      className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-all"
                      title="Mais Opções"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <p className="text-xs text-slate-500 font-medium">Mostrando {EMPLOYEES.length} de 1,284 colaboradores</p>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-400 cursor-not-allowed">Anterior</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded text-xs font-bold text-slate-700 hover:bg-slate-50">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Colaboradores;
