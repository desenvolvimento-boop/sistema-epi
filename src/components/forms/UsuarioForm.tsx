import React, { useState } from 'react';
import { Check, X, Search } from 'lucide-react';
import './UsuarioForm.css';

interface UsuarioFormProps {
  onClose: () => void;
}

export const UsuarioForm = ({ onClose }: UsuarioFormProps) => {
  const [ativo, setAtivo] = useState(true);

  return (
    <form className="usuario-form" onSubmit={(e) => { e.preventDefault(); onClose(); }}>
      {/* Toggle Ativo */}
      <div className="usuario-form-toggle-row">
        <span className="usuario-form-toggle-label">Ativo</span>
        <button
          type="button"
          className={`usuario-form-toggle ${ativo ? 'usuario-form-toggle--active' : ''}`}
          onClick={() => setAtivo(!ativo)}
          aria-label="Toggle ativo"
        >
          <span className="usuario-form-toggle-thumb" />
        </button>
      </div>

      {/* Nome / Login */}
      <div className="usuario-form-grid">
        <div className="usuario-form-field">
          <label className="usuario-form-label">Nome <span className="usuario-form-required">*</span></label>
          <input type="text" placeholder="Nome completo" className="usuario-form-input" required />
        </div>
        <div className="usuario-form-field">
          <label className="usuario-form-label">Login <span className="usuario-form-required">*</span></label>
          <input type="text" placeholder="Nome de usuário" className="usuario-form-input" required />
        </div>
      </div>

      {/* E-mail / Senha */}
      <div className="usuario-form-grid">
        <div className="usuario-form-field">
          <label className="usuario-form-label">E-mail</label>
          <input type="email" placeholder="E-mail" className="usuario-form-input" />
        </div>
        <div className="usuario-form-field">
          <label className="usuario-form-label">Senha <span className="usuario-form-required">*</span></label>
          <input type="password" placeholder="Senha" className="usuario-form-input" required />
        </div>
      </div>

      {/* Tipo de Agente / Perfil de Acesso */}
      <div className="usuario-form-grid">
        <div className="usuario-form-field">
          <label className="usuario-form-label">Tipo de Agente <span className="usuario-form-required">*</span></label>
          <select className="usuario-form-input" required defaultValue="">
            <option value="" disabled>Selecione...</option>
            <option value="Interno">Interno</option>
            <option value="Externo">Externo</option>
            <option value="Terceirizado">Terceirizado</option>
          </select>
        </div>
        <div className="usuario-form-field">
          <label className="usuario-form-label">Perfil de Acesso <span className="usuario-form-required">*</span></label>
          <select className="usuario-form-input" required defaultValue="">
            <option value="" disabled>Selecione...</option>
            <option value="Administrador">Administrador</option>
            <option value="Gestor">Gestor de Unidade</option>
            <option value="Operador">Operador de Almoxarifado</option>
            <option value="Auditor">Auditor</option>
          </select>
        </div>
      </div>

      {/* Telefone / Celular */}
      <div className="usuario-form-grid">
        <div className="usuario-form-field">
          <label className="usuario-form-label">Telefone</label>
          <div className="usuario-form-phone-group">
            <input type="text" placeholder="DDI" className="usuario-form-input usuario-form-phone-ddi" />
            <input type="text" placeholder="DDD" className="usuario-form-input usuario-form-phone-ddd" />
            <input type="text" placeholder="Número" className="usuario-form-input usuario-form-phone-numero" />
          </div>
        </div>
        <div className="usuario-form-field">
          <label className="usuario-form-label">Celular</label>
          <div className="usuario-form-phone-group">
            <input type="text" placeholder="DDI" className="usuario-form-input usuario-form-phone-ddi" />
            <input type="text" placeholder="DDD" className="usuario-form-input usuario-form-phone-ddd" />
            <input type="text" placeholder="Número" className="usuario-form-input usuario-form-phone-numero" />
          </div>
        </div>
      </div>

      {/* CEP / País */}
      <div className="usuario-form-grid">
        <div className="usuario-form-field">
          <label className="usuario-form-label">CEP</label>
          <div className="usuario-form-cep-group">
            <input type="text" placeholder="00000-000" className="usuario-form-input usuario-form-cep-input" />
            <button type="button" className="usuario-form-cep-btn" aria-label="Buscar CEP">
              <Search className="usuario-form-cep-icon" />
            </button>
          </div>
        </div>
        <div className="usuario-form-field">
          <label className="usuario-form-label">País</label>
          <input type="text" placeholder="País" className="usuario-form-input" />
        </div>
      </div>

      {/* Estado / Cidade */}
      <div className="usuario-form-grid">
        <div className="usuario-form-field">
          <label className="usuario-form-label">Estado</label>
          <input type="text" placeholder="UF" className="usuario-form-input" />
        </div>
        <div className="usuario-form-field">
          <label className="usuario-form-label">Cidade</label>
          <input type="text" placeholder="Cidade" className="usuario-form-input" />
        </div>
      </div>

      {/* Bairro / Logradouro */}
      <div className="usuario-form-grid">
        <div className="usuario-form-field">
          <label className="usuario-form-label">Bairro</label>
          <input type="text" placeholder="Bairro" className="usuario-form-input" />
        </div>
        <div className="usuario-form-field">
          <label className="usuario-form-label">Logradouro</label>
          <input type="text" placeholder="Rua, Avenida, etc" className="usuario-form-input" />
        </div>
      </div>

      {/* Número / Complemento */}
      <div className="usuario-form-grid">
        <div className="usuario-form-field">
          <label className="usuario-form-label">Número</label>
          <input type="text" placeholder="Nº" className="usuario-form-input" />
        </div>
        <div className="usuario-form-field">
          <label className="usuario-form-label">Complemento</label>
          <input type="text" placeholder="Complemento" className="usuario-form-input" />
        </div>
      </div>

      {/* Observação */}
      <div className="usuario-form-field usuario-form-full">
        <label className="usuario-form-label">Observação</label>
        <textarea placeholder="Observações adicionais" className="usuario-form-textarea" rows={3} />
      </div>

      {/* Ações */}
      <div className="usuario-form-actions">
        <button type="submit" className="usuario-form-submit">
          <Check className="usuario-form-btn-icon" />
          Salvar
        </button>
        <button type="button" onClick={onClose} className="usuario-form-cancel">
          <X className="usuario-form-btn-icon" />
          Cancelar
        </button>
      </div>
    </form>
  );
};
