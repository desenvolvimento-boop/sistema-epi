import React, { useState } from 'react';
import { Plus, Edit3 } from 'lucide-react';
import { REPLACEMENT_RULES } from '../services/api';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { Modal } from '../components/ui/Modal';
import { RegraTrocaForm } from '../components/forms/RegraTrocaForm';
import { ReplacementRule } from '../types/system.types';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const RegrasTroca = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<ReplacementRule | null>(null);

  const handleOpenModal = (rule?: ReplacementRule) => {
    setSelectedRule(rule || null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-slate-800">Regras de Troca e Substituição</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-sm shadow-primary-200"
        >
          <Plus className="w-4 h-4" /> Nova Regra
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedRule ? "Editar Regra de Troca" : "Cadastrar Nova Regra de Troca"}
      >
        <RegraTrocaForm 
          onClose={() => setIsModalOpen(false)} 
          initialData={selectedRule || undefined}
        />
      </Modal>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">EPI Alvo</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Vida Útil (Dias)</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Gatilho de Troca</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Criticidade</th>
              <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {REPLACEMENT_RULES.map(rule => (
              <tr 
                key={rule.id} 
                className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                onClick={() => handleOpenModal(rule)}
              >
                <td className="px-6 py-4">
                  <span className="text-sm font-bold text-slate-900">{rule.epi}</span>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-slate-700 font-mono font-bold">{rule.vidaUtil}</span>
                </td>
                <td className="px-6 py-4">
                  <p className="text-xs text-slate-600 font-medium">{rule.motivo}</p>
                  {rule.contrato && <p className="text-[10px] text-slate-400 mt-0.5">Contrato: {rule.contrato}</p>}
                </td>
                <td className="px-6 py-4">
                  <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold uppercase border", 
                    rule.criticidade === 'Alta' ? 'bg-red-50 text-red-600 border-red-100' : 
                    rule.criticidade === 'Média' ? 'bg-amber-50 text-amber-600 border-amber-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                  )}>
                    {rule.criticidade}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <button className="p-2 text-slate-400 group-hover:text-primary-600 group-hover:bg-primary-50 rounded-lg transition-all">
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

export default RegrasTroca;
