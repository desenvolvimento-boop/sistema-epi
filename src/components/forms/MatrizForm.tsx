import React from 'react';
import { Role } from '../../types/system.types';
import { EPIS } from '../../services/api';
import './MatrizForm.css';

interface MatrizFormProps {
  onClose: () => void;
  initialData?: Role;
}

export const MatrizForm = ({ onClose, initialData }: MatrizFormProps) => {
  return (
    <form className="matriz-form" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
      <div className="matriz-form-fields">
        <div className="matriz-form-field">
          <label className="matriz-form-label">Função Selecionada</label>
          {initialData ? (
            <div className="matriz-form-static-value">
              {initialData.nome}
            </div>
          ) : (
            <select className="matriz-form-input">
              <option>Selecione uma função</option>
              <option>Operador de Empilhadeira</option>
              <option>Auxiliar de Produção</option>
              <option>Técnico de Segurança</option>
            </select>
          )}
        </div>
        
        <div className="matriz-form-field">
          <label className="matriz-form-label">Vincular EPIs Obrigatórios</label>
          <div className="matriz-form-checkbox-grid custom-scrollbar">
            {EPIS.map(epi => (
              <label key={epi.id} className="matriz-form-checkbox-label">
                <input 
                  type="checkbox" 
                  defaultChecked={initialData?.epis.some(re => epi.nome.includes(re))}
                  className="matriz-form-checkbox" 
                />
                <span className="matriz-form-checkbox-text">
                  <span className="matriz-form-checkbox-name">{epi.nome}</span>
                  <span className="matriz-form-checkbox-ca">CA: {epi.ca}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="matriz-form-legal-note">
          <p className="matriz-form-legal-note-text">
            <strong>Nota Jurídica:</strong> Ao salvar esta matriz, o sistema passará a exigir a entrega destes EPIs para todos os colaboradores vinculados a esta função.
          </p>
        </div>
      </div>

      <div className="matriz-form-actions">
        <button
          type="button"
          onClick={onClose}
          className="matriz-form-cancel"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="matriz-form-submit"
        >
          {initialData ? 'Atualizar Matriz' : 'Salvar Matriz'}
        </button>
      </div>
    </form>
  );
};
