import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Info, Edit2, Loader2, Briefcase } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { roleService, type RoleAPI } from '../../services/roleService';
import { FuncaoForm } from '../../components/forms/FuncaoForm';
import { useAuth } from '../../contexts/AuthContext';
import { useNomenclature } from '../../hooks/useNomenclature';
import { NOMENCLATURE_KEYS } from '../../config/nomenclatureKeys';
import { ListFiltersBar } from '../../components/list/ListFiltersBar';
import { ListPagination } from '../../components/list/ListPagination';
import { SortableTableHeader } from '../../components/list/SortableTableHeader';
import { useListPagination } from '../../hooks/useListPagination';
import { useListSort } from '../../hooks/useListSort';
import { activeStatusMatcher, filterListRows } from '../../utils/listFilters';
import { compareNullable, compareNumbers, compareStrings } from '../../utils/listSort';
import './styles.css';

type TabId = 'lista' | 'cadastro';
type RoleSortKey = 'id' | 'name' | 'status' | 'description' | 'epiCount' | 'origin';

const Funcoes = () => {
  const { t } = useNomenclature();
  const [roles, setRoles] = useState<RoleAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('lista');
  const [editRole, setEditRole] = useState<RoleAPI | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { canCreate, canEdit } = useAuth();
  const allowCreate = canCreate('/funcoes');
  const allowEdit = canEdit('/funcoes');

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
    setActiveTab('cadastro');
  };

  const handleOpenEdit = (role: RoleAPI) => {
    setEditRole(role);
    setActiveTab('cadastro');
  };

  const handleCloseForm = () => {
    setActiveTab('lista');
    setEditRole(null);
  };

  const handleSaved = () => {
    loadRoles();
    handleCloseForm();
  };

  const truncate = (text: string | null | undefined, max = 80) => {
    if (!text) return '—';
    return text.length > max ? `${text.slice(0, max)}...` : text;
  };

  const canShowFormTab = allowCreate || (editRole && allowEdit);

  const filteredRoles = useMemo(
    () =>
      filterListRows(roles, searchTerm, filterValues, {
        searchText: (role) =>
          [
            role.rol_description,
            role.rol_activities,
            role.rol_integration_source,
            String(role.rol_id),
            String(role.epi_count ?? ''),
          ]
            .filter(Boolean)
            .join(' '),
        fields: {
          status: activeStatusMatcher((role) => role.rol_active),
        },
      }),
    [roles, searchTerm, filterValues],
  );

  const roleComparators = useMemo(
    (): Record<RoleSortKey, (a: RoleAPI, b: RoleAPI) => number> => ({
      id: (a, b) => compareNumbers(a.rol_id, b.rol_id),
      name: (a, b) => compareStrings(a.rol_description, b.rol_description),
      status: (a, b) => compareNumbers(a.rol_active, b.rol_active),
      description: (a, b) =>
        compareNullable(a.rol_activities, b.rol_activities, compareStrings),
      epiCount: (a, b) => compareNumbers(a.epi_count ?? 0, b.epi_count ?? 0),
      origin: (a, b) =>
        compareNullable(
          a.rol_integration_source || 'Manual',
          b.rol_integration_source || 'Manual',
          compareStrings,
        ),
    }),
    [],
  );

  const { sort, toggleSort, sortedItems } = useListSort(filteredRoles, roleComparators);
  const pagination = useListPagination(sortedItems);

  return (
    <div className="funcoes-container">
      <PageHeader
        icon={Briefcase}
        iconTone="amber"
        title={t(NOMENCLATURE_KEYS.page.funcoes)}
        subtitle={t(NOMENCLATURE_KEYS.page.subtitle_funcoes)}
        actions={
          activeTab === 'lista' && allowCreate ? (
            <button onClick={handleOpenCreate} className="funcoes-add-btn" type="button">
              <Plus className="funcoes-btn-icon" /> {t(NOMENCLATURE_KEYS.action.new)} {t(NOMENCLATURE_KEYS.entity.funcao_singular)}
            </button>
          ) : undefined
        }
      />

      {activeTab === 'cadastro' && canShowFormTab && (
        <div className="funcoes-form-panel">
          <div className="funcoes-form-panel-header">
            <h3 className="funcoes-form-panel-title">
              {editRole ? `${t(NOMENCLATURE_KEYS.action.edit)} ${t(NOMENCLATURE_KEYS.entity.funcao_singular)}` : `${t(NOMENCLATURE_KEYS.action.new)} ${t(NOMENCLATURE_KEYS.entity.funcao_singular)}`}
            </h3>
            <button type="button" className="funcoes-form-panel-back" onClick={handleCloseForm}>
              Voltar à lista
            </button>
          </div>
          <FuncaoForm
            key={editRole?.rol_id ?? 'new'}
            onClose={handleCloseForm}
            onSaved={handleSaved}
            initialData={editRole ?? undefined}
            existingRoles={roles}
          />
        </div>
      )}

      {activeTab === 'lista' && (
        <>
        <ListFiltersBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Buscar função, descrição ou origem..."
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
          ]}
          values={filterValues}
          onFieldChange={(id, value) => setFilterValues((prev) => ({ ...prev, [id]: value }))}
          onClear={() => setFilterValues({})}
        />
        <div className="funcoes-table-container">
          {loading ? (
            <div className="funcoes-loading">
              <Loader2 className="funcoes-icon-sm funcoes-spin" />
              <span>Carregando...</span>
            </div>
          ) : (
            <>
            <table className="funcoes-table">
              <thead>
                <tr className="funcoes-table-header">
                  <SortableTableHeader
                    label="ID"
                    sortKey="id"
                    activeSort={sort}
                    onSort={toggleSort}
                    className="funcoes-table-th table-col-id"
                  />
                  <SortableTableHeader
                    label={t(NOMENCLATURE_KEYS.entity.funcao_singular)}
                    sortKey="name"
                    activeSort={sort}
                    onSort={toggleSort}
                    className="funcoes-table-th"
                  />
                  <SortableTableHeader
                    label="Status"
                    sortKey="status"
                    activeSort={sort}
                    onSort={toggleSort}
                    className="funcoes-table-th"
                  />
                  <SortableTableHeader
                    label="Descrição"
                    sortKey="description"
                    activeSort={sort}
                    onSort={toggleSort}
                    className="funcoes-table-th"
                  />
                  <SortableTableHeader
                    label="EPIs"
                    sortKey="epiCount"
                    activeSort={sort}
                    onSort={toggleSort}
                    className="funcoes-table-th"
                  />
                  <SortableTableHeader
                    label="Origem"
                    sortKey="origin"
                    activeSort={sort}
                    onSort={toggleSort}
                    className="funcoes-table-th"
                  />
                  <th className="funcoes-table-th funcoes-table-th-right">Ações</th>
                </tr>
              </thead>
              <tbody className="funcoes-table-body">
                {sortedItems.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="funcoes-table-cell" style={{ textAlign: 'center' }}>
                      Nenhuma função encontrada.
                    </td>
                  </tr>
                ) : (
                pagination.paginatedItems.map((role) => (
                  <tr key={role.rol_id} className="funcoes-table-row">
                    <td className="funcoes-table-cell table-cell-id">{role.rol_id}</td>
                    <td className="funcoes-table-cell">
                      <span className="funcoes-name">{role.rol_description}</span>
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
                        {allowEdit && (
                          <button
                            onClick={() => handleOpenEdit(role)}
                            className="funcoes-edit-btn"
                            title="Editar"
                            type="button"
                          >
                            <Edit2 className="funcoes-icon-sm" />
                          </button>
                        )}
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
              itemLabel="funções"
            />
            </>
          )}
        </div>
        </>
      )}
    </div>
  );
};

export default Funcoes;
