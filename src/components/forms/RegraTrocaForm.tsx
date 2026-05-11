import React, { useState } from 'react';
import { ReplacementRule } from '../../types/system.types';

interface RegraTrocaFormProps {
  onClose: () => void;
  initialData?: ReplacementRule;
}

export const RegraTrocaForm = ({ onClose, initialData }: RegraTrocaFormProps) => {
  const [gatilho, setGatilho] = useState(initialData?.motivo || 'Vencimento por Tempo');

  return (
    <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">EPI Alvo</label>
          <select 
            defaultValue={initialData?.epi}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
          >
            <option>Selecione o EPI</option>
            <option value="Capacete de Segurança">Capacete de Segurança</option>
            <option value="Capacete H-700">Capacete H-700</option>
            <option value="Luva de Vaqueta">Luva de Vaqueta</option>
            <option value="Luva Nitrílica">Luva Nitrílica</option>
            <option value="Bota de Segurança">Bota de Segurança</option>
          </select>
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
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Criticidade</label>
          <select 
            defaultValue={initialData?.criticidade}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
          >
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700">Gatilho de Troca</label>
          <select 
            value={gatilho}
            onChange={(e) => setGatilho(e.target.value)}
            className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
          >
            <option value="Vencimento por Tempo">Vencimento por Tempo</option>
            <option value="Desgaste Natural">Desgaste Natural</option>
            <option value="Dano Acidental">Dano Acidental</option>
            <option value="Desgaste / Vencimento">Desgaste / Vencimento</option>
            <option value="Vencimento / Impacto">Vencimento / Impacto</option>
            <option value="Desgaste / Rasgo">Desgaste / Rasgo</option>
            <option value="Regra do contrato">Regra do contrato</option>
          </select>
        </div>
        
        {gatilho === 'Regra do contrato' && (
          <>
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="text-sm font-bold text-slate-700">Contrato</label>
              <select 
                defaultValue={initialData?.contrato}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
              >
                <option value="">Selecione o Contrato</option>
                <option value="CONTRATO-001">CONTRATO-001 - Limpeza Urbana</option>
                <option value="CONTRATO-002">CONTRATO-002 - Manutenção Predial</option>
                <option value="CONTRATO-003">CONTRATO-003 - Segurança Patrimonial</option>
              </select>
            </div>
            <div className="space-y-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <label className="text-sm font-bold text-slate-700">Jornada de Trabalho</label>
              <select 
                defaultValue={initialData?.jornada || ""}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 transition-all"
              >
                <option value="" disabled>Selecione a Jornada de Trabalho</option>
                <option value="DIARISTA">DIARISTA</option>
                <option value="PLANTONISTA">PLANTONISTA</option>
              </select>
            </div>
          </>
        )}
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
          {initialData ? 'Salvar Alterações' : 'Salvar Regra'}
        </button>
      </div>
    </form>
  );
};
