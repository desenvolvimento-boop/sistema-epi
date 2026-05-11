import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MoreVertical, Shield, Info } from 'lucide-react';
import { ROLES } from '../services/api';
import { Modal } from '../components/ui/Modal';
import { FuncaoForm } from '../components/forms/FuncaoForm';

const Funcoes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Definição de Funções e Riscos</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-sm shadow-primary-200"
        >
          <Plus className="w-4 h-4" /> Nova Função
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Cadastrar Nova Função"
      >
        <FuncaoForm onClose={() => setIsModalOpen(false)} />
      </Modal>
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Função</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Descrição</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">EPIs Vinculados</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {ROLES.map(role => (
              <tr key={role.id} className="hover:bg-slate-50/50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                      <Shield className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">{role.nome}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-500 line-clamp-1 max-w-xs">{role.descricao}</p>
                </td>
                <td className="px-6 py-4">
                  <div className="flex flex-wrap gap-1">
                    {role.epis.slice(0, 3).map(epi => (
                      <span key={epi} className="px-2 py-0.5 bg-slate-100 text-slate-600 rounded text-[10px] font-medium border border-slate-200">
                        {epi}
                      </span>
                    ))}
                    {role.epis.length > 3 && (
                      <span className="px-2 py-0.5 bg-primary-50 text-primary-600 rounded text-[10px] font-bold border border-primary-100">
                        +{role.epis.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => navigate(`/funcoes/${role.id}/detalhes`)}
                      className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                      title="Ver Detalhes"
                    >
                      <Info className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => navigate(`/funcoes/${role.id}/detalhes`)}
                      className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Funcoes;
