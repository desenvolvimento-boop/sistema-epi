import React from 'react';
import { EPI } from '../../types/system.types';

interface EPIFormProps {
  onClose: () => void;
  initialData?: EPI;
}

export const EPIForm = ({ onClose, initialData }: EPIFormProps) => {
  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Nome do EPI</label>
          <input 
            type="text" 
            placeholder="Ex: Capacete de Segurança" 
            defaultValue={initialData?.nome}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Certificado de Aprovação (CA)</label>
          <input 
            type="text" 
            placeholder="Ex: 12345" 
            defaultValue={initialData?.ca}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Fabricante</label>
          <input 
            type="text" 
            placeholder="Ex: 3M" 
            defaultValue={initialData?.fabricante}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Vida Útil (Dias)</label>
          <input 
            type="number" 
            placeholder="Ex: 180" 
            defaultValue={initialData?.vidaUtil}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
            required
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm font-bold text-slate-700">Descrição Técnica</label>
          <textarea 
            placeholder="Especificações técnicas do equipamento..." 
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all min-h-[80px]"
          />
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 text-sm font-bold text-slate-500 hover:bg-slate-100 rounded-xl transition-all"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="px-6 py-2 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-sm shadow-primary-200"
        >
          {initialData ? 'Salvar Alterações' : 'Salvar EPI'}
        </button>
      </div>
    </form>
  );
};
