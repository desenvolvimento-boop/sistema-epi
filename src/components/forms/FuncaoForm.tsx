import React from 'react';
import './FuncaoForm.css';

interface FuncaoFormProps {
  onClose: () => void;
}

export const FuncaoForm = ({ onClose }: FuncaoFormProps) => {
  return (
    <form className="funcao-form" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
      <div className="funcao-form-fields">
        <div className="funcao-form-field">
          <label className="funcao-form-label">Nome da Função</label>
          <input 
            type="text" 
            placeholder="Ex: Operador de Empilhadeira" 
            className="funcao-form-input"
            required
          />
        </div>
        <div className="funcao-form-field">
          <label className="funcao-form-label">Descrição das Atividades</label>
          <textarea 
            placeholder="Descreva as principais atividades e riscos desta função..." 
            className="funcao-form-textarea"
            required
          />
        </div>
        <div className="funcao-form-field">
          <label className="funcao-form-label">EPIs Obrigatórios (Seleção Múltipla)</label>
          <div className="funcao-form-checkbox-grid">
            {['Capacete de Segurança', 'Luva de Vaqueta', 'Bota de Segurança', 'Protetor Auricular', 'Óculos de Proteção'].map(epi => (
              <label key={epi} className="funcao-form-checkbox-label">
                <input type="checkbox" className="funcao-form-checkbox" />
                {epi}
              </label>
            ))}
          </div>
        </div>
      </div>

      <div className="funcao-form-actions">
        <button
          type="button"
          onClick={onClose}
          className="funcao-form-cancel"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="funcao-form-submit"
        >
          Salvar Função
        </button>
      </div>
    </form>
  );
};
