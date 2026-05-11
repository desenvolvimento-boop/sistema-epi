import React from 'react';
import { Role } from '../../types/system.types';
import { EPIS } from '../../services/api';

interface MatrizFormProps {
  onClose: () => void;
  initialData?: Role;
}

export const MatrizForm = ({ onClose, initialData }: MatrizFormProps) => {
  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Função Selecionada</label>
          {initialData ? (
            <div className="w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-xl text-sm font-bold text-slate-800">
              {initialData.nome}
            </div>
          ) : (
            <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all">
              <option>Selecione uma função</option>
              <option>Operador de Empilhadeira</option>
              <option>Auxiliar de Produção</option>
              <option>Técnico de Segurança</option>
            </select>
          )}
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Vincular EPIs Obrigatórios</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl max-h-[250px] overflow-y-auto custom-scrollbar">
            {EPIS.map(epi => (
              <label key={epi.id} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 transition-colors p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-100">
                <input 
                  type="checkbox" 
                  defaultChecked={initialData?.epis.some(re => epi.nome.includes(re))}
                  className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" 
                />
                <span className="flex flex-col">
                  <span className="font-medium">{epi.nome}</span>
                  <span className="text-[10px] text-slate-400 uppercase">CA: {epi.ca}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl">
          <p className="text-xs text-blue-700 leading-relaxed">
            <strong>Nota Jurídica:</strong> Ao salvar esta matriz, o sistema passará a exigir a entrega destes EPIs para todos os colaboradores vinculados a esta função.
          </p>
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
          {initialData ? 'Atualizar Matriz' : 'Salvar Matriz'}
        </button>
      </div>
    </form>
  );
};
