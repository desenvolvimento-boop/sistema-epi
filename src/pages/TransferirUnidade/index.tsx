import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { RefreshCw, Building2, MapPin, Save, AlertCircle } from 'lucide-react';
import { PageHeader, PageHeaderBackButton } from '../../components/layout/PageHeader';
import { EMPLOYEES } from '../../services/api';
import './styles.css';

const TransferirUnidade = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const colaborador = EMPLOYEES.find(e => e.id === Number(id)) || EMPLOYEES[0];

  return (
    <div className="page-container">
      <PageHeader
        leading={<PageHeaderBackButton onClick={() => navigate(`/colaboradores/${id}/detalhes`)} />}
        icon={MapPin}
        iconTone="blue"
        title="Transferir Unidade"
        subtitle={`Alteração de local de trabalho para ${colaborador.nome}`}
      />

      <div className="card">
        <div className="card-body">
          <form className="form" onSubmit={(e) => { e.preventDefault(); navigate(`/colaboradores/${id}/detalhes`); }}>
            <div className="form-grid">
              {/* Unidade Atual */}
              <div className="section">
                <h3 className="section-title">
                  <Building2 className="section-icon" /> Localização Atual
                </h3>
                <div className="current-location-card">
                  <div className="location-info">
                    <div className="location-icon-wrapper">
                      <MapPin className="location-icon" />
                    </div>
                    <div>
                      <p className="location-label">Empresa / Unidade</p>
                      <p className="location-value">{colaborador.empresa} - {colaborador.unidade}</p>
                    </div>
                  </div>
                  <div className="location-note">
                    <p className="location-note-text">Este colaborador está alocado nesta unidade desde a sua admissão em {colaborador.admissao}.</p>
                  </div>
                </div>
              </div>

              {/* Nova Unidade */}
              <div className="section">
                <h3 className="section-title-primary">
                  <RefreshCw className="section-icon" /> Nova Localização
                </h3>
                <div className="form-fields">
                  <div className="field-group">
                    <label className="field-label">Selecione a Nova Unidade</label>
                    <select className="field-input">
                      <option value="">Selecione uma unidade...</option>
                      <option>Matriz - São Paulo</option>
                      <option>Filial - Rio de Janeiro</option>
                      <option>Centro de Distribuição - MG</option>
                      <option>Unidade Industrial - PR</option>
                    </select>
                  </div>

                  <div className="field-group">
                    <label className="field-label">Data da Transferência</label>
                    <input 
                      type="date" 
                      className="field-input"
                    />
                  </div>

                  <div className="field-group">
                    <label className="field-label">Motivo da Movimentação</label>
                    <textarea 
                      rows={3}
                      placeholder="Justifique a necessidade de transferência..."
                      className="field-textarea"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="info-alert">
              <AlertCircle className="info-alert-icon" />
              <div className="info-alert-content">
                <h4 className="info-alert-title">Atenção sobre o Inventário de EPIs</h4>
                <p className="info-alert-text">
                  Ao transferir o colaborador, o sistema verificará se a nova unidade possui os mesmos riscos ambientais. Caso existam novos riscos, o colaborador será notificado para retirar os EPIs complementares na nova unidade.
                </p>
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
                <Save className="btn-icon" /> Confirmar Transferência
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransferirUnidade;
