import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, History, UserCog, MoreVertical, Loader2, RefreshCw } from 'lucide-react';
import { employeeService, type EmployeeAPI } from '../../services/employeeService';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { ColaboradorForm } from '../../components/forms/ColaboradorForm';
import { useAuth } from '../../contexts/AuthContext';
import { useNomenclature } from '../../hooks/useNomenclature';
import { NOMENCLATURE_KEYS } from '../../config/nomenclatureKeys';
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
  const { t } = useNomenclature();
  const [employees, setEmployees] = useState<EmployeeAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeAPI | null>(null);

  const navigate = useNavigate();
  const { canCreate, canEdit } = useAuth();
  const allowCreate = canCreate('/colaboradores');
  const allowEdit = canEdit('/colaboradores');

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

  const handleOpenEdit = (emp: EmployeeAPI) => {
    setSelectedEmployee(emp);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedEmployee(null);
  };

  const handleEditSaved = () => {
    handleCloseEditModal();
    fetchEmployees();
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
            onClick={() => navigate('/colaboradores/novo')}
            className="colaboradores-add-btn"
            type="button"
          >
            <Plus className="colaboradores-btn-icon" /> {t(NOMENCLATURE_KEYS.action.new)} {t(NOMENCLATURE_KEYS.entity.colaborador_singular)}
          </button>
        )}
      </div>

      {selectedEmployee && (
        <Modal 
          isOpen={isEditModalOpen} 
          onClose={handleCloseEditModal} 
          title={`${t(NOMENCLATURE_KEYS.action.edit)} ${t(NOMENCLATURE_KEYS.entity.colaborador_singular)}`}
        >
          <ColaboradorForm
            onClose={handleCloseEditModal}
            onSaved={handleEditSaved}
            initialData={selectedEmployee}
          />
        </Modal>
      )}

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
                <th className="colaboradores-th table-col-id">ID</th>
                <th className="colaboradores-th">{t(NOMENCLATURE_KEYS.entity.colaborador_singular)}</th>
                <th className="colaboradores-th">Matrícula / CPF</th>
                <th className="colaboradores-th">{t(NOMENCLATURE_KEYS.entity.funcao_singular)} / Empresa</th>
                <th className="colaboradores-th">Status</th>
                <th className="colaboradores-th--right">Ações</th>
              </tr>
            </thead>
            <tbody className="colaboradores-tbody">
              {filtered.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="colaboradores-empty">Nenhum colaborador encontrado.</td>
                </tr>
              ) : (
                filtered.map((emp) => (
                  <tr key={emp.emp_id} className="colaboradores-row">
                    <td className="colaboradores-cell table-cell-id">{emp.emp_id}</td>
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
                          onClick={() => navigate(`/historico/${emp.emp_id}`)}
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
