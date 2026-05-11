import React, { useState } from 'react';
import { ShieldCheck, Plus, Edit3 } from 'lucide-react';
import { EPIS } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';
import { Modal } from '../components/ui/Modal';
import { EPIForm } from '../components/forms/EPIForm';
import { EPI } from '../types/system.types';

const EPIs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEpi, setSelectedEpi] = useState<EPI | null>(null);

  const handleOpenModal = (epi?: EPI) => {
    setSelectedEpi(epi || null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold text-slate-800">Catálogo de EPIs</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 bg-primary-600 text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-sm shadow-primary-200"
        >
          <Plus className="w-4 h-4" /> Novo EPI
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedEpi ? "Editar EPI" : "Cadastrar Novo EPI"}
      >
        <EPIForm 
          onClose={() => setIsModalOpen(false)} 
          initialData={selectedEpi || undefined}
        />
      </Modal>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">EPI</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">CA / Fabricante</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vida Útil</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {EPIS.map(epi => (
              <tr 
                key={epi.id} 
                className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                onClick={() => handleOpenModal(epi)}
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-slate-50 rounded-lg text-primary-600 group-hover:bg-primary-50 transition-colors">
                      <ShieldCheck className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-bold text-slate-900">{epi.nome}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="text-sm text-slate-700">CA: {epi.ca}</p>
                  <p className="text-xs text-slate-500">{epi.fabricante}</p>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-600 font-medium">{epi.vidaUtil} dias</span>
                </td>
                <td className="px-6 py-4">
                  <StatusBadge status={epi.status} />
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 hover:text-primary-600 hover:bg-primary-50 rounded-lg transition-all">
                    <Edit3 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EPIs;
