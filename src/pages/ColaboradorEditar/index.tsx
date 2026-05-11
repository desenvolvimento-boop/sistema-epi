import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Shield, Briefcase, Building2 } from 'lucide-react';
import { EMPLOYEES } from '../../services/api';
import './styles.css';

const ColaboradorEditar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const colaborador = EMPLOYEES.find(e => e.id === Number(id)) || EMPLOYEES[0];

  return (
    <div className="editar-container">
      <div className="editar-header">
        <button onClick={() => navigate('/colaboradores')} className="editar-back-btn">
          <ArrowLeft className="editar-back-icon" />
        </button>
        <div>
          <h2 className="editar-title">Editar Colaborador</h2>
          <p className="editar-subtitle">Atualize as informações de {colaborador.nome}</p>
        </div>
      </div>

      <div className="editar-card">
        <div className="editar-card-body">
          <form className="editar-form" onSubmit={(e) => { e.preventDefault(); navigate('/colaboradores'); }}>
            <div className="editar-form-grid">
              <div className="editar-section">
                <h3 className="editar-section-title">
                  <User className="editar-section-icon" /> Dados Pessoais
                </h3>
                <div className="editar-fields">
                  <div className="editar-field">
                    <label className="editar-label">Nome Completo</label>
                    <input type="text" defaultValue={colaborador.nome} className="editar-input" />
                  </div>
                  <div className="editar-field-row">
                    <div className="editar-field">
                      <label className="editar-label">CPF</label>
                      <input type="text" defaultValue={colaborador.cpf} className="editar-input" />
                    </div>
                    <div className="editar-field">
                      <label className="editar-label">Matrícula</label>
                      <input type="text" defaultValue={colaborador.matricula} className="editar-input" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="editar-section">
                <h3 className="editar-section-title">
                  <Briefcase className="editar-section-icon" /> Dados Profissionais
                </h3>
                <div className="editar-fields">
                  <div className="editar-field">
                    <label className="editar-label">Função / Cargo</label>
                    <select className="editar-select">
                      <option>{colaborador.funcao}</option>
                      <option>Técnico de Manutenção</option>
                      <option>Operador de Empilhadeira</option>
                    </select>
                  </div>
                  <div className="editar-field">
                    <label className="editar-label">Empresa / Unidade</label>
                    <div className="editar-input-with-icon-wrapper">
                      <Building2 className="editar-input-icon" />
                      <input type="text" defaultValue={`${colaborador.empresa} - ${colaborador.unidade}`} className="editar-input-with-icon" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="editar-footer">
              <div className="editar-warning">
                <Shield className="editar-warning-icon" />
                <span className="editar-warning-text">Alterações requerem assinatura digital</span>
              </div>
              <div className="editar-footer-actions">
                <button type="button" onClick={() => navigate('/colaboradores')} className="editar-cancel-btn">Cancelar</button>
                <button type="submit" className="editar-submit-btn">
                  <Save className="editar-submit-icon" /> Salvar Alterações
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ColaboradorEditar;
