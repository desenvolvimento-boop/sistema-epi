import React from 'react';

interface ColaboradorFormProps {
  onClose: () => void;
}

export const ColaboradorForm = ({ onClose }: ColaboradorFormProps) => {
  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Nome Completo</label>
          <input 
            type="text" 
            placeholder="Ex: João Silva" 
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">CPF</label>
          <input 
            type="text" 
            placeholder="000.000.000-00" 
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Matrícula</label>
          <input 
            type="text" 
            placeholder="Ex: 12345" 
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Data de Admissão</label>
          <input 
            type="date" 
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Função</label>
          <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all">
            <option>Selecione uma função</option>
            <option>Operador de Empilhadeira</option>
            <option>Auxiliar de Produção</option>
            <option>Técnico de Segurança</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Unidade / Empresa</label>
          <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all">
            <option>Selecione a unidade</option>
            <option>Matriz - São Paulo</option>
            <option>Filial - Rio de Janeiro</option>
          </select>
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
          Salvar Colaborador
        </button>
      </div>
    </form>
  );
};
