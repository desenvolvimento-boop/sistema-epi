import React from 'react';
import { useNavigate } from 'react-router-dom';

export const RiskIndicator = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col">
      <h3 className="font-bold text-slate-800 mb-6">Indicador de Risco Trabalhista</h3>
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="relative w-48 h-48">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-slate-100" />
            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={502.6} strokeDashoffset={502.6 * 0.15} className="text-primary-500" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-4xl font-bold text-slate-800">85%</span>
            <span className="text-xs font-semibold text-primary-600 uppercase tracking-wider">Seguro</span>
          </div>
        </div>
        <p className="text-sm text-slate-500 text-center mt-6 px-4">
          Sua empresa possui um baixo risco de passivo trabalhista relacionado a EPIs.
        </p>
      </div>
      <button 
        onClick={() => navigate('/relatorios/conformidade')}
        className="mt-6 w-full py-2.5 bg-slate-900 text-white rounded-xl text-sm font-semibold hover:bg-slate-800 transition-colors"
      >
        Ver Relatório de Risco
      </button>
    </div>
  );
};
