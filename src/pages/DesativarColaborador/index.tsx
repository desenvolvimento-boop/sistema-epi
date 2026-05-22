import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserMinus, AlertTriangle, Save, FileText, CheckCircle2 } from 'lucide-react';
import { PageHeader, PageHeaderBackButton } from '../../components/layout/PageHeader';
import { EMPLOYEES } from '../../services/api';
import './styles.css';

const DesativarColaborador = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const colaborador = EMPLOYEES.find(e => e.id === Number(id)) || EMPLOYEES[0];

  return (
    <div className="page-container">
      <PageHeader
        leading={<PageHeaderBackButton onClick={() => navigate(`/colaboradores/${id}/detalhes`)} />}
        icon={UserMinus}
        iconTone="red"
        title="Desativar Colaborador"
        subtitle={`Processo de desligamento para ${colaborador.nome}`}
      />

      <div className="content-wrapper">
        <div className="danger-alert">
          <AlertTriangle className="danger-alert-icon" />
          <div className="danger-alert-content">
            <h4 className="danger-alert-title">Ação Irreversível</h4>
            <p className="danger-alert-text">
              A desativação removerá o colaborador da lista ativa e interromperá todas as notificações de troca de EPI. Certifique-se de que todos os equipamentos foram devolvidos.
            </p>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <form className="form" onSubmit={(e) => { e.preventDefault(); navigate(`/colaboradores`); }}>
              <div className="form-section">
                <div className="form-grid">
                  <div className="field-group">
                    <label className="field-label">Motivo do Desligamento</label>
                    <select className="field-input">
                      <option>Pedido de Demissão</option>
                      <option>Demissão sem Justa Causa</option>
                      <option>Demissão com Justa Causa</option>
                      <option>Término de Contrato</option>
                      <option>Aposentadoria</option>
                    </select>
                  </div>
                  <div className="field-group">
                    <label className="field-label">Data de Desligamento</label>
                    <input 
                      type="date" 
                      className="field-input"
                    />
                  </div>
                </div>

                <div className="checklist-section">
                  <h4 className="checklist-title">Checklist de Desligamento</h4>
                  <div className="checklist-items">
                    {[
                      'Todos os EPIs foram devolvidos e higienizados',
                      'Ficha de EPI final assinada pelo colaborador',
                      'Exame demissional realizado e anexado',
                      'Acesso ao aplicativo mobile revogado'
                    ].map((item, index) => (
                      <label key={index} className="checklist-item">
                        <div className="checklist-checkbox">
                          <CheckCircle2 className="checklist-check-icon" />
                        </div>
                        <span className="checklist-item-text">{item}</span>
                        <input type="checkbox" className="hidden" />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="field-group">
                  <label className="field-label">Observações Finais</label>
                  <textarea 
                    rows={3}
                    placeholder="Informações adicionais sobre o desligamento..."
                    className="field-textarea"
                  ></textarea>
                </div>
              </div>

              <div className="form-actions">
                <button 
                  type="button"
                  onClick={() => navigate(`/colaboradores/${id}/detalhes`)}
                  className="btn-cancel"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="btn-submit"
                >
                  <UserMinus className="btn-icon" /> Confirmar Desativação
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesativarColaborador;
