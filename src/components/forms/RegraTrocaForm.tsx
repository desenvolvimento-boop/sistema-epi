import React, { useState } from 'react';
import { ReplacementRule } from '../../types/system.types';
import './RegraTrocaForm.css';

interface RegraTrocaFormProps {
  onClose: () => void;
  initialData?: ReplacementRule;
}

export const RegraTrocaForm = ({ onClose, initialData }: RegraTrocaFormProps) => {
  const [gatilho, setGatilho] = useState(initialData?.motivo || 'Vencimento por Tempo');

  return (
    <form className="regra-troca-form" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
      <div className="regra-troca-form-grid">
        <div className="regra-troca-form-field">
          <label className="regra-troca-form-label">EPI Alvo</label>
          <select 
            defaultValue={initialData?.epi}
            className="regra-troca-form-input"
          >
            <option>Selecione o EPI</option>
            <option value="Capacete de Segurança">Capacete de Segurança</option>
            <option value="Capacete H-700">Capacete H-700</option>
            <option value="Luva de Vaqueta">Luva de Vaqueta</option>
            <option value="Luva Nitrílica">Luva Nitrílica</option>
            <option value="Bota de Segurança">Bota de Segurança</option>
          </select>
        </div>
        <div className="regra-troca-form-field">
          <label className="regra-troca-form-label">Vida Útil (Dias)</label>
          <input 
            type="number" 
            placeholder="Ex: 180" 
            defaultValue={initialData?.vidaUtil}
            className="regra-troca-form-input"
            required
          />
        </div>
        <div className="regra-troca-form-field">
          <label className="regra-troca-form-label">Criticidade</label>
          <select 
            defaultValue={initialData?.criticidade}
            className="regra-troca-form-input"
          >
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
          </select>
        </div>
        <div className="regra-troca-form-field">
          <label className="regra-troca-form-label">Gatilho de Troca</label>
          <select 
            value={gatilho}
            onChange={(e) => setGatilho(e.target.value)}
            className="regra-troca-form-input"
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
            <div className="regra-troca-form-field-animated">
              <label className="regra-troca-form-label">Contrato</label>
              <select 
                defaultValue={initialData?.contrato}
                className="regra-troca-form-input"
              >
                <option value="">Selecione o Contrato</option>
                <option value="CONTRATO-001">CONTRATO-001 - Limpeza Urbana</option>
                <option value="CONTRATO-002">CONTRATO-002 - Manutenção Predial</option>
                <option value="CONTRATO-003">CONTRATO-003 - Segurança Patrimonial</option>
              </select>
            </div>
            <div className="regra-troca-form-field-animated">
              <label className="regra-troca-form-label">Jornada de Trabalho</label>
              <select 
                defaultValue={initialData?.jornada || ""}
                className="regra-troca-form-input"
              >
                <option value="" disabled>Selecione a Jornada de Trabalho</option>
                <option value="DIARISTA">DIARISTA</option>
                <option value="PLANTONISTA">PLANTONISTA</option>
              </select>
            </div>
          </>
        )}
      </div>

      <div className="regra-troca-form-actions">
        <button
          type="button"
          onClick={onClose}
          className="regra-troca-form-cancel"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="regra-troca-form-submit"
        >
          {initialData ? 'Salvar Alterações' : 'Salvar Regra'}
        </button>
      </div>
    </form>
  );
};
