import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Shield, Plus, X, AlertCircle, Check, Search } from 'lucide-react';
import { ROLES, EPIS } from '../../services/api';
import { Modal } from '../../components/ui/Modal';
import './styles.css';

const FuncaoEditar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const funcao = ROLES.find(r => r.id === Number(id)) || ROLES[0];

  const [selectedEpis, setSelectedEpis] = useState<string[]>(funcao.epis);
  const [isEpiModalOpen, setIsEpiModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleEpi = (epiName: string) => {
    setSelectedEpis(prev => 
      prev.includes(epiName) 
        ? prev.filter(item => item !== epiName)
        : [...prev, epiName]
    );
  };

  const filteredEpis = EPIS.filter(epi => 
    epi.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    epi.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="funcao-editar-container">
      <div className="funcao-editar-header">
        <button 
          onClick={() => navigate(`/funcoes/${id}/detalhes`)}
          className="funcao-editar-back-btn"
        >
          <ArrowLeft className="funcao-editar-back-icon" />
        </button>
        <div>
          <h2 className="funcao-editar-title">Editar Função</h2>
          <p className="funcao-editar-subtitle">Atualize os requisitos e EPIs para {funcao.nome}</p>
        </div>
      </div>

      <div className="funcao-editar-card">
        <div className="funcao-editar-card-body">
          <form className="funcao-editar-form" onSubmit={(e) => { e.preventDefault(); navigate(`/funcoes/${id}/detalhes`); }}>
            <div className="funcao-editar-grid">
              <div className="funcao-editar-section">
                <h3 className="funcao-editar-section-title">Informações Básicas</h3>
                <div className="funcao-editar-fields">
                  <div className="funcao-editar-field-group">
                    <label className="funcao-editar-label">Nome da Função</label>
                    <input 
                      type="text" 
                      defaultValue={funcao.nome}
                      className="funcao-editar-input"
                    />
                  </div>
                  <div className="funcao-editar-field-group">
                    <label className="funcao-editar-label">Descrição das Atividades</label>
                    <textarea 
                      rows={4}
                      defaultValue={funcao.descricao}
                      className="funcao-editar-textarea"
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="funcao-editar-section">
                <div className="funcao-editar-epis-header">
                  <h3 className="funcao-editar-section-title">EPIs Obrigatórios</h3>
                  <button 
                    type="button" 
                    onClick={() => setIsEpiModalOpen(true)}
                    className="funcao-editar-add-epi-btn"
                  >
                    <Plus className="funcao-editar-add-epi-icon" /> Adicionar EPI
                  </button>
                </div>
                
                <div className="funcao-editar-epis-list">
                  {selectedEpis.map((epi, index) => (
                    <div key={index} className="funcao-editar-epi-item">
                      <div className="funcao-editar-epi-item-left">
                        <Shield className="funcao-editar-epi-item-icon" />
                        <span className="funcao-editar-epi-item-name">{epi}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => toggleEpi(epi)}
                        className="funcao-editar-epi-remove-btn"
                      >
                        <X className="funcao-editar-epi-remove-icon" />
                      </button>
                    </div>
                  ))}
                  {selectedEpis.length === 0 && (
                    <div className="funcao-editar-epis-empty">
                      <p className="funcao-editar-epis-empty-text">Nenhum EPI vinculado a esta função.</p>
                    </div>
                  )}
                </div>

                <div className="funcao-editar-alert">
                  <AlertCircle className="funcao-editar-alert-icon" />
                  <p className="funcao-editar-alert-text">
                    Alterar os EPIs vinculados a uma função gerará notificações automáticas para todos os colaboradores ativos nesta função para atualização de seus kits.
                  </p>
                </div>
              </div>
            </div>

            <div className="funcao-editar-actions">
              <button 
                type="button"
                onClick={() => navigate(`/funcoes/${id}/detalhes`)}
                className="funcao-editar-cancel-btn"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="funcao-editar-submit-btn"
              >
                <Save className="funcao-editar-submit-icon" /> Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>

      <Modal
        isOpen={isEpiModalOpen}
        onClose={() => setIsEpiModalOpen(false)}
        title="Vincular EPIs à Função"
      >
        <div className="funcao-editar-modal-content">
          <div className="funcao-editar-search-wrapper">
            <Search className="funcao-editar-search-icon" />
            <input 
              type="text" 
              placeholder="Buscar EPI por nome ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="funcao-editar-search-input"
            />
          </div>

          <div className="funcao-editar-modal-grid custom-scrollbar">
            {filteredEpis.map((epi) => {
              const isSelected = selectedEpis.includes(epi.nome);
              return (
                <button
                  key={epi.id}
                  onClick={() => toggleEpi(epi.nome)}
                  className={`funcao-editar-modal-epi-btn ${
                    isSelected 
                      ? 'funcao-editar-modal-epi-btn-selected' 
                      : 'funcao-editar-modal-epi-btn-unselected'
                  }`}
                >
                  <div className="funcao-editar-modal-epi-left">
                    <div className={`funcao-editar-modal-epi-icon-wrapper ${
                      isSelected ? 'funcao-editar-modal-epi-icon-selected' : 'funcao-editar-modal-epi-icon-unselected'
                    }`}>
                      <Shield className="funcao-editar-modal-epi-icon" />
                    </div>
                    <div>
                      <p className="funcao-editar-modal-epi-name">{epi.nome}</p>
                      <p className="funcao-editar-modal-epi-meta">CA: {epi.ca} • {epi.categoria}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="funcao-editar-modal-check">
                      <Check className="funcao-editar-modal-check-icon" />
                    </div>
                  )}
                </button>
              );
            })}
            {filteredEpis.length === 0 && (
              <div className="funcao-editar-modal-empty">
                <p className="funcao-editar-modal-empty-text">Nenhum EPI encontrado para "{searchTerm}"</p>
              </div>
            )}
          </div>

          <div className="funcao-editar-modal-footer">
            <button
              onClick={() => setIsEpiModalOpen(false)}
              className="funcao-editar-modal-done-btn"
            >
              Concluir Seleção
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FuncaoEditar;
