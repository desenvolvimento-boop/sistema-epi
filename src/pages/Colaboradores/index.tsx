import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, History, UserCog, MoreVertical, Loader2, Users } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { ListFiltersBar } from '../../components/list/ListFiltersBar';
import { ListPagination } from '../../components/list/ListPagination';
import { SortableTableHeader } from '../../components/list/SortableTableHeader';
import { useListPagination } from '../../hooks/useListPagination';
import { useListSort } from '../../hooks/useListSort';
import { activeStatusMatcher, filterListRows } from '../../utils/listFilters';
import { compareNullable, compareNumbers, compareStrings } from '../../utils/listSort';
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

type EmployeeSortKey = 'id' | 'name' | 'registration' | 'role' | 'company' | 'status';

const Colaboradores = () => {
  const { t } = useNomenclature();
  const [employees, setEmployees] = useState<EmployeeAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

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

  const roleOptions = useMemo(() => {
    const map = new Map<number, string>();
    employees.forEach((e) => {
      if (e.role?.rol_id) map.set(e.role.rol_id, e.role.rol_description);
    });
    return Array.from(map.entries())
      .map(([value, label]) => ({ value: String(value), label }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [employees]);

  const filtered = useMemo(
    () =>
      filterListRows(employees, searchTerm, filterValues, {
        searchText: (emp) =>
          [
            emp.emp_full_name,
            emp.emp_cpf,
            emp.emp_registration,
            emp.role?.rol_description,
            emp.company?.com_description,
            emp.section?.sec_description,
            String(emp.emp_id),
          ]
            .filter(Boolean)
            .join(' '),
        fields: {
          status: activeStatusMatcher((emp) => emp.emp_active),
          rol_id: (emp, value) => String(emp.rol_id) === value,
        },
      }),
    [employees, searchTerm, filterValues],
  );

  const employeeComparators = useMemo(
    (): Record<EmployeeSortKey, (a: EmployeeAPI, b: EmployeeAPI) => number> => ({
      id: (a, b) => compareNumbers(a.emp_id, b.emp_id),
      name: (a, b) => compareStrings(a.emp_full_name, b.emp_full_name),
      registration: (a, b) => compareStrings(a.emp_registration, b.emp_registration),
      role: (a, b) =>
        compareNullable(a.role?.rol_description, b.role?.rol_description, compareStrings),
      company: (a, b) =>
        compareNullable(a.company?.com_description, b.company?.com_description, compareStrings),
      status: (a, b) => compareNumbers(a.emp_active, b.emp_active),
    }),
    [],
  );

  const { sort, toggleSort, sortedItems } = useListSort(filtered, employeeComparators);
  const pagination = useListPagination(sortedItems);

  return (
    <div className="colaboradores-container">
      <PageHeader
        icon={Users}
        title={t(NOMENCLATURE_KEYS.page.colaboradores)}
        subtitle={t(NOMENCLATURE_KEYS.page.subtitle_colaboradores)}
        actions={
          allowCreate ? (
            <button
              onClick={() => navigate('/colaboradores/novo')}
              className="colaboradores-add-btn"
              type="button"
            >
              <Plus className="colaboradores-btn-icon" /> {t(NOMENCLATURE_KEYS.action.new)} {t(NOMENCLATURE_KEYS.entity.colaborador_singular)}
            </button>
          ) : undefined
        }
      />

      <ListFiltersBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar por nome, CPF, matrícula ou função..."
        fields={[
          {
            id: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { value: '1', label: 'Ativo' },
              { value: '0', label: 'Inativo' },
            ],
          },
          {
            id: 'rol_id',
            label: t(NOMENCLATURE_KEYS.entity.funcao_singular),
            type: 'select',
            options: roleOptions,
          },
        ]}
        values={filterValues}
        onFieldChange={(id, value) => setFilterValues((prev) => ({ ...prev, [id]: value }))}
        onClear={() => setFilterValues({})}
      />

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
            existingEmployees={employees}
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
                <SortableTableHeader
                  label="ID"
                  sortKey="id"
                  activeSort={sort}
                  onSort={toggleSort}
                  className="colaboradores-th table-col-id"
                />
                <SortableTableHeader
                  label={t(NOMENCLATURE_KEYS.entity.colaborador_singular)}
                  sortKey="name"
                  activeSort={sort}
                  onSort={toggleSort}
                  className="colaboradores-th"
                />
                <SortableTableHeader
                  label="Matrícula / CPF"
                  sortKey="registration"
                  activeSort={sort}
                  onSort={toggleSort}
                  className="colaboradores-th"
                />
                <SortableTableHeader
                  label={`${t(NOMENCLATURE_KEYS.entity.funcao_singular)} / Empresa`}
                  sortKey="role"
                  activeSort={sort}
                  onSort={toggleSort}
                  className="colaboradores-th"
                />
                <SortableTableHeader
                  label="Status"
                  sortKey="status"
                  activeSort={sort}
                  onSort={toggleSort}
                  className="colaboradores-th"
                />
                <th className="colaboradores-th colaboradores-th--right">Ações</th>
              </tr>
            </thead>
            <tbody className="colaboradores-tbody">
              {sortedItems.length === 0 && !loading ? (
                <tr>
                  <td colSpan={6} className="colaboradores-empty">Nenhum colaborador encontrado.</td>
                </tr>
              ) : (
                pagination.paginatedItems.map((emp) => (
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
          <ListPagination
            page={pagination.page}
            totalPages={pagination.totalPages}
            from={pagination.from}
            to={pagination.to}
            total={pagination.total}
            pageSize={pagination.pageSize}
            onPageChange={pagination.setPage}
            onPageSizeChange={pagination.setPageSize}
            itemLabel="colaboradores"
          />
        </div>
      )}
    </div>
  );
};

export default Colaboradores;
