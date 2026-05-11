import React from 'react';
import { EPI } from '../../types/system.types';
import './EPIForm.css';

interface EPIFormProps {
  onClose: () => void;
  initialData?: EPI;
}

export const EPIForm = ({ onClose, initialData }: EPIFormProps) => {
  return (
    <form className="epi-form" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
      <div className="epi-form-grid">
        <div className="epi-form-field">
          <label className="epi-form-label">Nome do EPI</label>
          <input 
            type="text" 
            placeholder="Ex: Capacete de Segurança" 
            defaultValue={initialData?.nome}
            className="epi-form-input"
            required
          />
        </div>
        <div className="epi-form-field">
          <label className="epi-form-label">Certificado de Aprovação (CA)</label>
          <input 
            type="text" 
            placeholder="Ex: 12345" 
            defaultValue={initialData?.ca}
            className="epi-form-input"
            required
          />
        </div>
        <div className="epi-form-field">
          <label className="epi-form-label">Fabricante</label>
          <input 
            type="text" 
            placeholder="Ex: 3M" 
            defaultValue={initialData?.fabricante}
            className="epi-form-input"
            required
          />
        </div>
        <div className="epi-form-field">
          <label className="epi-form-label">Vida Útil (Dias)</label>
          <input 
            type="number" 
            placeholder="Ex: 180" 
            defaultValue={initialData?.vidaUtil}
            className="epi-form-input"
            required
          />
        </div>
        <div className="epi-form-field epi-form-field-full">
          <label className="epi-form-label">Descrição Técnica</label>
          <textarea 
            placeholder="Especificações técnicas do equipamento..." 
            className="epi-form-textarea"
          />
        </div>
      </div>

      <div className="epi-form-actions">
        <button
          type="button"
          onClick={onClose}
          className="epi-form-cancel"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="epi-form-submit"
        >
          {initialData ? 'Salvar Alterações' : 'Salvar EPI'}
        </button>
      </div>
    </form>
  );
};
