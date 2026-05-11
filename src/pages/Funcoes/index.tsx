import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, MoreVertical, Shield, Info } from 'lucide-react';
import { ROLES } from '../../services/api';
import { Modal } from '../../components/ui/Modal';
import { FuncaoForm } from '../../components/forms/FuncaoForm';
import './styles.css';

const Funcoes = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="funcoes-container">
      <div className="funcoes-header">
        <h2 className="funcoes-title">Definição de Funções e Riscos</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="funcoes-add-btn"
        >
          <Plus className="funcoes-btn-icon" /> Nova Função
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Cadastrar Nova Função"
      >
        <FuncaoForm onClose={() => setIsModalOpen(false)} />
      </Modal>
      <div className="funcoes-table-container">
        <table className="funcoes-table">
          <thead>
            <tr className="funcoes-table-header">
              <th className="funcoes-table-th">Função</th>
              <th className="funcoes-table-th">Descrição</th>
              <th className="funcoes-table-th">EPIs Vinculados</th>
              <th className="funcoes-table-th-right">Ações</th>
            </tr>
          </thead>
          <tbody className="funcoes-table-body">
            {ROLES.map(role => (
              <tr key={role.id} className="funcoes-table-row">
                <td className="funcoes-table-cell">
                  <div className="funcoes-name-wrapper">
                    <div className="funcoes-role-icon">
                      <Shield className="funcoes-icon-sm" />
                    </div>
                    <span className="funcoes-name">{role.nome}</span>
                  </div>
                </td>
                <td className="funcoes-table-cell">
                  <p className="funcoes-description">{role.descricao}</p>
                </td>
                <td className="funcoes-table-cell">
                  <div className="funcoes-epi-tags">
                    {role.epis.slice(0, 3).map(epi => (
                      <span key={epi} className="funcoes-epi-tag">
                        {epi}
                      </span>
                    ))}
                    {role.epis.length > 3 && (
                      <span className="funcoes-epi-tag-extra">
                        +{role.epis.length - 3}
                      </span>
                    )}
                  </div>
                </td>
                <td className="funcoes-table-cell-right">
                  <div className="funcoes-actions-wrapper">
                    <button 
                      onClick={() => navigate(`/funcoes/${role.id}/detalhes`)}
                      className="funcoes-info-btn"
                      title="Ver Detalhes"
                    >
                      <Info className="funcoes-icon-sm" />
                    </button>
                    <button 
                      onClick={() => navigate(`/funcoes/${role.id}/detalhes`)}
                      className="funcoes-more-btn"
                    >
                      <MoreVertical className="funcoes-icon-sm" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Funcoes;
