import React from 'react';
import './UsuarioForm.css';

interface UsuarioFormProps {
  onClose: () => void;
}

export const UsuarioForm = ({ onClose }: UsuarioFormProps) => {
  return (
    <form className="usuario-form" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
      <div className="usuario-form-grid">
        <div className="usuario-form-field">
          <label className="usuario-form-label">Nome Completo</label>
          <input 
            type="text" 
            placeholder="Ex: Carlos Oliveira" 
            className="usuario-form-input"
            required
          />
        </div>
        <div className="usuario-form-field">
          <label className="usuario-form-label">E-mail</label>
          <input 
            type="email" 
            placeholder="Ex: carlos@empresa.com" 
            className="usuario-form-input"
            required
          />
        </div>
        <div className="usuario-form-field">
          <label className="usuario-form-label">Perfil de Acesso</label>
          <select className="usuario-form-input">
            <option value="Administrador">Administrador</option>
            <option value="Gestor">Gestor de Unidade</option>
            <option value="Operador">Operador de Almoxarifado</option>
            <option value="Auditor">Auditor</option>
          </select>
        </div>
        <div className="usuario-form-field">
          <label className="usuario-form-label">Status Inicial</label>
          <select className="usuario-form-input">
            <option value="Ativo">Ativo</option>
            <option value="Inativo">Inativo</option>
          </select>
        </div>
      </div>

      <div className="usuario-form-actions">
        <button
          type="button"
          onClick={onClose}
          className="usuario-form-cancel"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="usuario-form-submit"
        >
          Criar Usuário
        </button>
      </div>
    </form>
  );
};
