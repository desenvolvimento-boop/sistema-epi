import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Plus, Edit3, Eye } from 'lucide-react';
import { ROLES, EPIS } from '../services/api';
import { Modal } from '../components/ui/Modal';
import { MatrizForm } from '../components/forms/MatrizForm';
import { Role } from '../types/system.types';

const MatrizFuncaoEPI = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const navigate = useNavigate();

  const handleEditMatriz = (role: Role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleNewMatriz = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Matriz de Proteção (Função x EPI)</h2>
        <button 
          onClick={handleNewMatriz}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-sm shadow-primary-200"
        >
          <Plus className="w-4 h-4" /> Nova Matriz
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedRole ? `Gerenciar Matriz: ${selectedRole.nome}` : "Gerenciar Matriz de Proteção"}
      >
        <MatrizForm 
          onClose={() => setIsModalOpen(false)} 
          initialData={selectedRole || undefined}
        />
      </Modal>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <h3 className="font-bold text-slate-800">Visualização da Matriz</h3>
          <p className="text-sm text-slate-500 mt-1">Cruzamento obrigatório para conformidade jurídica.</p>
        </div>
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase sticky left-0 bg-slate-50 z-10">Função</th>
                {EPIS.map(epi => (
                  <th key={epi.id} className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center">{epi.nome.split(' ')[0]}</th>
                ))}
                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center sticky right-0 bg-slate-50 z-10">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ROLES.map(role => (
                <tr key={role.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4 text-sm font-bold text-slate-800 sticky left-0 bg-white group-hover:bg-slate-50 transition-colors z-10 shadow-[2px_0_5px_rgba(0,0,0,0.02)]">{role.nome}</td>
                  {EPIS.map(epi => {
                    const isRequired = role.epis.some(re => epi.nome.includes(re));
                    return (
                      <td key={epi.id} className="px-6 py-4 text-center">
                        {isRequired ? (
                          <div className="flex justify-center">
                            <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          </div>
                        ) : (
                          <span className="text-slate-200">—</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="px-6 py-4 text-center sticky right-0 bg-white group-hover:bg-slate-50 transition-colors z-10 shadow-[-2px_0_5px_rgba(0,0,0,0.02)]">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => navigate(`/funcoes/${role.id}/detalhes`)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="Ver Detalhes da Função"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleEditMatriz(role)}
                        className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                        title="Editar Matriz"
                      >
                        <Edit3 className="w-4 h-4" />
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

export default MatrizFuncaoEPI;
