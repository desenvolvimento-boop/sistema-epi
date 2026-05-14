import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, Plus, History, UserCog, MoreVertical, Check, X, Loader2, RefreshCw, AlertTriangle, Trash2 } from 'lucide-react';
import { employeeService, type EmployeeAPI } from '../../services/employeeService';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { ColaboradorForm } from '../../components/forms/ColaboradorForm';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR');
}

function getStatusLabel(emp: EmployeeAPI): string {
  return emp.emp_active === 1 ? 'Ativo' : 'Inativo';
}

const Colaboradores = () => {
  const [employees, setEmployees] = useState<EmployeeAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeAPI | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState<EmployeeAPI | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navigate = useNavigate();
  const { canCreate, canEdit, canDelete } = useAuth();
  const allowCreate = canCreate('/colaboradores');
  const allowEdit = canEdit('/colaboradores');
  const allowDelete = canDelete('/colaboradores');

  const fetchEmployees = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await employeeService.getAll();
      setEmployees(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar colaboradores');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchEmployees();
  }, [fetchEmployees]);

  const handleOpenCreate = () => {
    setSelectedEmployee(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (emp: EmployeeAPI) => {
    setSelectedEmployee(emp);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleSaved = () => {
    handleCloseModal();
    fetchEmployees();
  };

  const handleDeleteClick = (emp: EmployeeAPI) => {
    setEmployeeToDelete(emp);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    setDeleting(true);
    try {
      await employeeService.delete(employeeToDelete.emp_id);
      setIsDeleteModalOpen(false);
      setEmployeeToDelete(null);
      fetchEmployees();
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir colaborador');
    } finally {
      setDeleting(false);
    }
  };

  const filtered = employees.filter(emp => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      emp.emp_full_name.toLowerCase().includes(term) ||
      emp.emp_cpf.toLowerCase().includes(term) ||
      emp.emp_registration.toLowerCase().includes(term)
    );
  });

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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button onClick={fetchEmployees} className="colaboradores-filter-btn" disabled={loading}>
            <RefreshCw className={`colaboradores-btn-icon ${loading ? 'colaboradores-spin' : ''}`} /> Atualizar
          </button>
        </div>
        {allowCreate && (
          <button 
            onClick={handleOpenCreate}
            className="colaboradores-add-btn"
          >
            <Plus className="colaboradores-btn-icon" /> Novo Colaborador
          </button>
        )}
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        title={selectedEmployee ? 'Editar Colaborador' : 'Cadastrar Novo Colaborador'}
      >
        <ColaboradorForm
          onClose={handleCloseModal}
          onSaved={handleSaved}
          initialData={selectedEmployee ?? undefined}
        />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
      >
        <div className="colaboradores-delete-content">
          <div className="colaboradores-delete-warning">
            <div className="colaboradores-delete-icon-wrapper">
              <AlertTriangle className="colaboradores-delete-icon-lg" />
            </div>
            <div>
              <p className="colaboradores-delete-title">Atenção!</p>
              <p className="colaboradores-delete-text">
                Você está prestes a excluir o colaborador <span className="colaboradores-delete-bold">{employeeToDelete?.emp_full_name}</span>. Esta ação não pode ser desfeita.
              </p>
            </div>
          </div>
          <div className="colaboradores-delete-actions">
            <button onClick={() => setIsDeleteModalOpen(false)} className="colaboradores-delete-cancel-btn" disabled={deleting}>
              Cancelar
            </button>
            <button onClick={confirmDelete} className="colaboradores-delete-confirm-btn" disabled={deleting}>
              {deleting ? 'Excluindo...' : 'Confirmar Exclusão'}
            </button>
          </div>
        </div>
      </Modal>

      {error && (
        <div className="colaboradores-error-banner">
          <p>{error}</p>
          <button onClick={fetchEmployees} className="colaboradores-retry-btn">Tentar novamente</button>
        </div>
      )}

      {loading && employees.length === 0 ? (
        <div className="colaboradores-loading">
          <Loader2 className="colaboradores-loading-icon colaboradores-spin" />
          <p>Carregando colaboradores...</p>
        </div>
      ) : (
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
              {filtered.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="colaboradores-empty">Nenhum colaborador encontrado.</td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp.emp_id} className="colaboradores-row">
                    <td className="colaboradores-cell">
                      <div className="colaboradores-avatar-group">
                        <div className="colaboradores-avatar">
                          {emp.emp_full_name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="colaboradores-name">{emp.emp_full_name}</p>
                          <p className="colaboradores-admission">Admitido em {formatDate(emp.emp_admission_date)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="colaboradores-cell">
                      <p className="colaboradores-matricula">{emp.emp_registration}</p>
                      <p className="colaboradores-cpf">{emp.emp_cpf}</p>
                    </td>
                    <td className="colaboradores-cell">
                      <p className="colaboradores-funcao">{emp.role?.rol_description || '—'}</p>
                      <p className="colaboradores-empresa">
                        {emp.company?.com_description || '—'} {emp.section ? `- ${emp.section.sec_description}` : ''}
                      </p>
                    </td>
                    <td className="colaboradores-cell">
                      <StatusBadge status={getStatusLabel(emp)} />
                    </td>
                    <td className="colaboradores-cell--right">
                      <div className="colaboradores-actions">
                        <button 
                          onClick={() => navigate(`/colaboradores/${emp.emp_id}/historico`)}
                          className="colaboradores-history-btn" 
                          title="Histórico Completo"
                        >
                          <History className="colaboradores-btn-icon" />
                        </button>
                        {allowEdit && (
                          <button 
                            onClick={() => handleOpenEdit(emp)}
                            className="colaboradores-edit-btn" 
                            title="Editar"
                          >
                            <UserCog className="colaboradores-btn-icon" />
                          </button>
                        )}
                        {allowDelete && (
                          <button
                            onClick={() => handleDeleteClick(emp)}
                            className="colaboradores-more-btn"
                            title="Excluir"
                          >
                            <Trash2 className="colaboradores-btn-icon" />
                          </button>
                        )}
                        <button 
                          onClick={() => navigate(`/colaboradores/${emp.emp_id}/detalhes`)}
                          className="colaboradores-more-btn"
                          title="Detalhes"
                        >
                          <MoreVertical className="colaboradores-btn-icon" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="colaboradores-pagination">
            <p className="colaboradores-pagination-info">Mostrando {filtered.length} de {employees.length} colaboradores</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Colaboradores;
