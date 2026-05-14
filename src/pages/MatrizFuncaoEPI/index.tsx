import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Plus, Edit3, Eye } from 'lucide-react';
import { ROLES, EPIS } from '../../services/api';
import { Modal } from '../../components/ui/Modal';
import { MatrizForm } from '../../components/forms/MatrizForm';
import { Role } from '../../types/system.types';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

const MatrizFuncaoEPI = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const navigate = useNavigate();
  const { canCreate, canEdit } = useAuth();
  const allowCreate = canCreate('/matriz-funcao-epi');
  const allowEdit = canEdit('/matriz-funcao-epi');

  const handleEditMatriz = (role: Role) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleNewMatriz = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  return (
    <div className="matriz-page">
      <div className="matriz-header">
        <h2 className="matriz-title">Matriz de Proteção (Função x EPI)</h2>
        {allowCreate && (
          <button 
            onClick={handleNewMatriz}
            className="matriz-new-btn"
          >
            <Plus className="w-4 h-4" /> Nova Matriz
          </button>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedRole ? `Gerenciar Matriz: ${selectedRole.nome}` : "Gerenciar Matriz de Proteção"}
      >
        <MatrizForm 
          onClose={() => setIsModalOpen(false)} 
          initialData={selectedRole || undefined}
        />
      </Modal>

      <div className="matriz-card">
        <div className="matriz-card-header">
          <h3 className="matriz-card-title">Visualização da Matriz</h3>
          <p className="matriz-card-subtitle">Cruzamento obrigatório para conformidade jurídica.</p>
        </div>
        <div className="matriz-table-wrapper custom-scrollbar">
          <table className="matriz-table">
            <thead>
              <tr className="matriz-thead-row">
                <th className="matriz-th-sticky-left">Função</th>
                {EPIS.map(epi => (
                  <th key={epi.id} className="matriz-th">{epi.nome.split(' ')[0]}</th>
                ))}
                <th className="matriz-th-sticky-right">Ações</th>
              </tr>
            </thead>
            <tbody className="matriz-tbody">
              {ROLES.map(role => (
                <tr key={role.id} className="matriz-row">
                  <td className="matriz-td-role">{role.nome}</td>
                  {EPIS.map(epi => {
                    const isRequired = role.epis.some(re => epi.nome.includes(re));
                    return (
                      <td key={epi.id} className="matriz-td-center">
                        {isRequired ? (
                          <div className="matriz-check-wrapper">
                            <div className="matriz-check-icon">
                              <CheckCircle2 className="w-4 h-4" />
                            </div>
                          </div>
                        ) : (
                          <span className="matriz-dash">—</span>
                        )}
                      </td>
                    );
                  })}
                  <td className="matriz-td-actions">
                    <div className="matriz-actions-wrapper">
                      <button 
                        onClick={() => navigate(`/funcoes/${role.id}/detalhes`)}
                        className="matriz-btn-view"
                        title="Ver Detalhes da Função"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      {allowEdit && (
                        <button 
                          onClick={() => handleEditMatriz(role)}
                          className="matriz-btn-edit"
                          title="Editar Matriz"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MatrizFuncaoEPI;
