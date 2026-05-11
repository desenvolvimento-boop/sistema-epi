import React from 'react';
import './ColaboradorForm.css';

interface ColaboradorFormProps {
  onClose: () => void;
}

export const ColaboradorForm = ({ onClose }: ColaboradorFormProps) => {
  return (
    <form className="colaborador-form" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
      <div className="colaborador-form-grid">
        <div className="colaborador-form-field">
          <label className="colaborador-form-label">Nome Completo</label>
          <input 
            type="text" 
            placeholder="Ex: João Silva" 
            className="colaborador-form-input"
            required
          />
        </div>
        <div className="colaborador-form-field">
          <label className="colaborador-form-label">CPF</label>
          <input 
            type="text" 
            placeholder="000.000.000-00" 
            className="colaborador-form-input"
            required
          />
        </div>
        <div className="colaborador-form-field">
          <label className="colaborador-form-label">Matrícula</label>
          <input 
            type="text" 
            placeholder="Ex: 12345" 
            className="colaborador-form-input"
            required
          />
        </div>
        <div className="colaborador-form-field">
          <label className="colaborador-form-label">Data de Admissão</label>
          <input 
            type="date" 
            className="colaborador-form-input"
            required
          />
        </div>
        <div className="colaborador-form-field">
          <label className="colaborador-form-label">Função</label>
          <select className="colaborador-form-input">
            <option>Selecione uma função</option>
            <option>Operador de Empilhadeira</option>
            <option>Auxiliar de Produção</option>
            <option>Técnico de Segurança</option>
          </select>
        </div>
        <div className="colaborador-form-field">
          <label className="colaborador-form-label">Unidade / Empresa</label>
          <select className="colaborador-form-input">
            <option>Selecione a unidade</option>
            <option>Matriz - São Paulo</option>
            <option>Filial - Rio de Janeiro</option>
          </select>
        </div>
      </div>

      <div className="colaborador-form-actions">
        <button
          type="button"
          onClick={onClose}
          className="colaborador-form-cancel"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="colaborador-form-submit"
        >
          Salvar Colaborador
        </button>
      </div>
    </form>
  );
};
