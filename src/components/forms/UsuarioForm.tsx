import React from 'react';

interface UsuarioFormProps {
  onClose: () => void;
}

export const UsuarioForm = ({ onClose }: UsuarioFormProps) => {
  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Nome Completo</label>
          <input 
            type="text" 
            placeholder="Ex: Carlos Oliveira" 
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 transition-all"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">E-mail</label>
          <input 
            type="email" 
            placeholder="Ex: carlos@empresa.com" 
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 transition-all"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Perfil de Acesso</label>
          <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 transition-all">
            <option value="Administrador">Administrador</option>
            <option value="Gestor">Gestor de Unidade</option>
            <option value="Operador">Operador de Almoxarifado</option>
            <option value="Auditor">Auditor</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Status Inicial</label>
          <select className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-slate-900 transition-all">
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
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
          className="px-6 py-2 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all shadow-sm"
        >
          Criar Usuário
        </button>
      </div>
    </form>
  );
};
