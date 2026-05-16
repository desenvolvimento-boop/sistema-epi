import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Shield, Info, Loader2 } from 'lucide-react';
import { roleService, type RoleAPI } from '../../services/roleService';
import { Modal } from '../../components/ui/Modal';
import { FuncaoForm } from '../../components/forms/FuncaoForm';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

const Funcoes = () => {
  const [roles, setRoles] = useState<RoleAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRole, setEditRole] = useState<RoleAPI | null>(null);
  const navigate = useNavigate();
  const { canCreate } = useAuth();
  const allowCreate = canCreate('/funcoes');

  const loadRoles = useCallback(async () => {
    setLoading(true);
    try {
      const data = await roleService.getAll();
      setRoles(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRoles();
  }, [loadRoles]);

  const handleOpenCreate = () => {
    setEditRole(null);
    setIsModalOpen(true);
  };

  const truncate = (text: string | null | undefined, max = 80) => {
    if (!text) return '—';
    return text.length > max ? `${text.slice(0, max)}...` : text;
  };

  return (
    <div className="funcoes-container">
      <div className="funcoes-header">
        <h2 className="funcoes-title">Definição de Funções e Riscos</h2>
        {allowCreate && (
          <button onClick={handleOpenCreate} className="funcoes-add-btn">
            <Plus className="funcoes-btn-icon" /> Nova Função
          </button>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editRole ? 'Editar Função' : 'Cadastrar Nova Função'}
      >
        <FuncaoForm
          onClose={() => setIsModalOpen(false)}
          onSaved={loadRoles}
          initialData={editRole || undefined}
        />
      </Modal>

      <div className="funcoes-table-container">
        {loading ? (
          <div className="funcoes-loading">
            <Loader2 className="funcoes-icon-sm funcoes-spin" />
            <span>Carregando...</span>
          </div>
        ) : (
          <table className="funcoes-table">
            <thead>
              <tr className="funcoes-table-header">
                <th className="funcoes-table-th">Função</th>
                <th className="funcoes-table-th">Status</th>
                <th className="funcoes-table-th">Descrição</th>
                <th className="funcoes-table-th">EPIs</th>
                <th className="funcoes-table-th">Origem</th>
                <th className="funcoes-table-th-right">Ações</th>
              </tr>
            </thead>
            <tbody className="funcoes-table-body">
              {roles.map((role) => (
                <tr key={role.rol_id} className="funcoes-table-row">
                  <td className="funcoes-table-cell">
                    <div className="funcoes-name-wrapper">
                      <div className="funcoes-role-icon">
                        <Shield className="funcoes-icon-sm" />
                      </div>
                      <span className="funcoes-name">{role.rol_description}</span>
                    </div>
                  </td>
                  <td className="funcoes-table-cell">
                    <span className={`funcoes-status-badge ${role.rol_active === 1 ? 'funcoes-status-active' : 'funcoes-status-inactive'}`}>
                      {role.rol_active === 1 ? 'Ativo' : 'Inativo'}
                    </span>
                  </td>
                  <td className="funcoes-table-cell">
                    <p className="funcoes-description">{truncate(role.rol_activities)}</p>
                  </td>
                  <td className="funcoes-table-cell">
                    <span className="funcoes-epi-tag">{role.epi_count ?? 0} vinculado(s)</span>
                  </td>
                  <td className="funcoes-table-cell">
                    <span className={`funcoes-origin-badge funcoes-origin-${(role.rol_integration_source || 'Manual').toLowerCase()}`}>
                      {role.rol_integration_source || 'Manual'}
                    </span>
                  </td>
                  <td className="funcoes-table-cell-right">
                    <div className="funcoes-actions-wrapper">
                      <button
                        onClick={() => navigate(`/funcoes/${role.rol_id}/detalhes`)}
                        className="funcoes-info-btn"
                        title="Ver Detalhes"
                        type="button"
                      >
                        <Info className="funcoes-icon-sm" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Funcoes;
