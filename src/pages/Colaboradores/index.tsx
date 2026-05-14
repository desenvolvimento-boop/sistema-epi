import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, History, UserCog, MoreVertical, Check, X } from 'lucide-react';
import { EMPLOYEES } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { ColaboradorForm } from '../../components/forms/ColaboradorForm';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

const Colaboradores = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { canCreate, canEdit } = useAuth();
  const allowCreate = canCreate('/colaboradores');
  const allowEdit = canEdit('/colaboradores');

  const isValidationNeeded = (status: string) => {
    return status === 'Aguardando validação' || status === 'Erro na validação';
  };

  return (
    <div className="colaboradores-container">
      <div className="colaboradores-header">
        <div className="colaboradores-search-group">
          <div className="colaboradores-search-wrapper">
            <Search className="colaboradores-search-icon" />
            <input 
              type="text" 
              placeholder="Filtrar por nome, CPF ou matrícula..." 
              className="colaboradores-search-input"
            />
          </div>
          <button className="colaboradores-filter-btn">
            <Filter className="colaboradores-btn-icon" /> Filtros Avançados
          </button>
        </div>
        {allowCreate && (
          <button 
            onClick={() => setIsModalOpen(true)}
            className="colaboradores-add-btn"
          >
            <Plus className="colaboradores-btn-icon" /> Novo Colaborador
          </button>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Cadastrar Novo Colaborador"
      >
        <ColaboradorForm onClose={() => setIsModalOpen(false)} />
      </Modal>

      <div className="colaboradores-table-wrapper">
        <table className="colaboradores-table">
          <thead>
            <tr className="colaboradores-thead-row">
              <th className="colaboradores-th">Colaborador</th>
              <th className="colaboradores-th">Matrícula / CPF</th>
              <th className="colaboradores-th">Função / Empresa</th>
              <th className="colaboradores-th">Status</th>
              <th className="colaboradores-th--right">Ações</th>
            </tr>
          </thead>
          <tbody className="colaboradores-tbody">
            {EMPLOYEES.map((emp) => (
              <tr key={emp.id} className="colaboradores-row">
                <td className="colaboradores-cell">
                  <div className="colaboradores-avatar-group">
                    <div className="colaboradores-avatar">
                      {isValidationNeeded(emp.status) ? (
                        <div className="colaboradores-avatar-photo-wrapper">
                          <img 
                            src={`https://i.pravatar.cc/150?u=${emp.id}`} 
                            alt="Preview" 
                            className="colaboradores-avatar-photo"
                            referrerPolicy="no-referrer"
                          />
                          <div className="colaboradores-avatar-overlay">
                            <span className="colaboradores-avatar-overlay-text">Ver Foto</span>
                          </div>
                        </div>
                      ) : emp.nome.charAt(0)}
                    </div>
                    <div>
                      <p className="colaboradores-name">{emp.nome}</p>
                      <p className="colaboradores-admission">Admitido em {emp.admissao}</p>
                    </div>
                  </div>
                </td>
                <td className="colaboradores-cell">
                  <p className="colaboradores-matricula">{emp.matricula}</p>
                  <p className="colaboradores-cpf">{emp.cpf}</p>
                </td>
                <td className="colaboradores-cell">
                  <p className="colaboradores-funcao">{emp.funcao}</p>
                  <p className="colaboradores-empresa">{emp.empresa} - {emp.unidade}</p>
                </td>
                <td className="colaboradores-cell">
                  <StatusBadge status={emp.status} />
                </td>
                <td className="colaboradores-cell--right">
                  <div className="colaboradores-actions">
                    {isValidationNeeded(emp.status) ? (
                      <div className="colaboradores-validation-actions">
                        <button 
                          className="colaboradores-approve-btn"
                          title="Aprovar Cadastro"
                        >
                          <Check className="colaboradores-action-icon-sm" /> Aprovar
                        </button>
                        <button 
                          className="colaboradores-reject-btn"
                          title="Recusar Cadastro"
                        >
                          <X className="colaboradores-action-icon-sm" /> Recusar
                        </button>
                      </div>
                    ) : (
                      <>
                        <button 
                          onClick={() => navigate(`/colaboradores/${emp.id}/historico`)}
                          className="colaboradores-history-btn" 
                          title="Histórico Completo"
                        >
                          <History className="colaboradores-btn-icon" />
                        </button>
                        {allowEdit && (
                          <button 
                            onClick={() => navigate(`/colaboradores/${emp.id}/editar`)}
                            className="colaboradores-edit-btn" 
                            title="Editar"
                          >
                            <UserCog className="colaboradores-btn-icon" />
                          </button>
                        )}
                      </>
                    )}
                    <button 
                      onClick={() => navigate(`/colaboradores/${emp.id}/detalhes`)}
                      className="colaboradores-more-btn"
                      title="Mais Opções"
                    >
                      <MoreVertical className="colaboradores-btn-icon" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="colaboradores-pagination">
          <p className="colaboradores-pagination-info">Mostrando {EMPLOYEES.length} de 1,284 colaboradores</p>
          <div className="colaboradores-pagination-buttons">
            <button className="colaboradores-pagination-btn-disabled">Anterior</button>
            <button className="colaboradores-pagination-btn">Próxima</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Colaboradores;
