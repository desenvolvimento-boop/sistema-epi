import React from 'react';
import { Search, Bell } from 'lucide-react';

interface TopbarProps {
  title: string;
}

export const Topbar = ({ title }: TopbarProps) => {
  return (
    <header className="h-16 bg-white border-b border-slate-200 fixed top-0 right-0 left-64 z-40 flex items-center justify-between px-8">
      <h1 className="text-xl font-bold text-slate-800">{title}</h1>
      
      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Busca global..." 
            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm w-64 focus:ring-2 focus:ring-primary-500 transition-all"
          />
        </div>
        
        <button className="relative p-2 text-slate-500 hover:bg-primary-50 hover:text-primary-600 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-px bg-slate-200"></div>
        
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-800 leading-none">Empresa Master S.A.</p>
            <p className="text-xs text-slate-500 mt-1">Sessão: 02:45h</p>
          </div>
        </div>
      </div>
    </header>
  );
};
