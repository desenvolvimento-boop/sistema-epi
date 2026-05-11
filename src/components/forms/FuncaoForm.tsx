import React from 'react';

interface FuncaoFormProps {
  onClose: () => void;
}

export const FuncaoForm = ({ onClose }: FuncaoFormProps) => {
  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Nome da Função</label>
          <input 
            type="text" 
            placeholder="Ex: Operador de Empilhadeira" 
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Descrição das Atividades</label>
          <textarea 
            placeholder="Descreva as principais atividades e riscos desta função..." 
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all min-h-[100px]"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">EPIs Obrigatórios (Seleção Múltipla)</label>
          <div className="grid grid-cols-2 gap-3 p-4 bg-slate-50 border border-slate-200 rounded-xl">
            {['Capacete de Segurança', 'Luva de Vaqueta', 'Bota de Segurança', 'Protetor Auricular', 'Óculos de Proteção'].map(epi => (
              <label key={epi} className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer hover:text-slate-900 transition-colors">
                <input type="checkbox" className="rounded border-slate-300 text-primary-600 focus:ring-primary-500" />
                {epi}
              </label>
            ))}
          </div>
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
          Salvar Função
        </button>
      </div>
    </form>
  );
};
