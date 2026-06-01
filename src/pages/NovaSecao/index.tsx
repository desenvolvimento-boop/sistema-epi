import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Loader2, Building2 } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { ListFiltersBar } from '../../components/list/ListFiltersBar';
import { ListPagination } from '../../components/list/ListPagination';
import { SortableTableHeader } from '../../components/list/SortableTableHeader';
import { useListPagination } from '../../hooks/useListPagination';
import { useListSort } from '../../hooks/useListSort';
import { activeStatusMatcher, filterListRows } from '../../utils/listFilters';
import { compareNullable, compareNumbers, compareStrings } from '../../utils/listSort';
import { sectionService, type SectionAPI } from '../../services/sectionService';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import { useNomenclature } from '../../hooks/useNomenclature';
import { NOMENCLATURE_KEYS } from '../../config/nomenclatureKeys';
import './styles.css';

function canAccessNovaSecao(canView: (path: string) => boolean) {
  return canView('/nova-secao') || canView('/colaboradores') || canView('/configuracoes');
}

type SectionSortKey = 'id' | 'description' | 'integration' | 'status';

const NovaSecao = () => {
  const [sections, setSections] = useState<SectionAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const navigate = useNavigate();
  const { canCreate, canEdit, canDelete, canView } = useAuth();
  const { t } = useNomenclature();
  const path = '/nova-secao';
  const allowCreate = canCreate(path) || canCreate('/colaboradores') || canCreate('/configuracoes');
  const allowEdit = canEdit(path) || canEdit('/colaboradores') || canEdit('/configuracoes');
  const allowDelete = canDelete(path) || canDelete('/colaboradores') || canDelete('/configuracoes');

  const fetchSections = useCallback(async () => {
    if (!canAccessNovaSecao(canView)) return;
    setLoading(true);
    setError(null);
    try {
      const data = await sectionService.getAll();
      setSections(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : `Erro ao carregar ${t(NOMENCLATURE_KEYS.entity.section_plural).toLowerCase()}`);
    } finally {
      setLoading(false);
    }
  }, [canView]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleDelete = async (id: number) => {
    if (!allowDelete) return;
    if (!window.confirm(`Deseja excluir este ${t(NOMENCLATURE_KEYS.entity.section_singular).toLowerCase()}?`)) return;

    setDeletingId(id);
    try {
      await sectionService.delete(id);
      await fetchSections();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : `Erro ao excluir ${t(NOMENCLATURE_KEYS.entity.section_singular).toLowerCase()}`);
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = useMemo(
    () =>
      filterListRows(sections, searchTerm, filterValues, {
        searchText: (sec) =>
          [
            sec.sec_description,
            sec.sec_integration_id,
            sec.sec_integration_source,
            String(sec.sec_id),
          ]
            .filter(Boolean)
            .join(' '),
        fields: {
          status: activeStatusMatcher((sec) => sec.sec_active),
        },
      }),
    [sections, searchTerm, filterValues],
  );

  const sectionComparators = useMemo(
    (): Record<SectionSortKey, (a: SectionAPI, b: SectionAPI) => number> => ({
      id: (a, b) => compareNumbers(a.sec_id, b.sec_id),
      description: (a, b) => compareStrings(a.sec_description, b.sec_description),
      integration: (a, b) =>
        compareNullable(a.sec_integration_id, b.sec_integration_id, compareStrings),
      status: (a, b) => compareNumbers(a.sec_active, b.sec_active),
    }),
    [],
  );

  const { sort, toggleSort, sortedItems } = useListSort(filtered, sectionComparators);
  const pagination = useListPagination(sortedItems);
  const sectionLabel = t(NOMENCLATURE_KEYS.entity.section_plural).toLowerCase();

  return (
    <div className="nova-secao-container">
      <PageHeader
        icon={Building2}
        iconTone="amber"
        title={t(NOMENCLATURE_KEYS.page.section_list)}
        subtitle={t(NOMENCLATURE_KEYS.page.subtitle_section_list)}
        actions={
          allowCreate ? (
            <button
              type="button"
              onClick={() => navigate('/nova-secao/novo')}
              className="nova-secao-add-btn"
            >
              <Plus className="nova-secao-btn-icon" /> {t(NOMENCLATURE_KEYS.action.new_section)}
            </button>
          ) : undefined
        }
      />

      <ListFiltersBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder={`Buscar ${t(NOMENCLATURE_KEYS.entity.section_singular).toLowerCase()} ou integração...`}
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

      {error && (
        <div className="nova-secao-error-banner">
          <p>{error}</p>
          <button type="button" onClick={fetchSections} className="nova-secao-retry-btn">
            Tentar novamente
          </button>
        </div>
      )}

      {loading && sections.length === 0 ? (
        <div className="nova-secao-loading">
          <Loader2 className="nova-secao-loading-icon nova-secao-spin" />
          <p>{t(NOMENCLATURE_KEYS.message.section_loading)}</p>
        </div>
      ) : (
        <div className="nova-secao-table-wrapper">
          <table className="nova-secao-table">
            <thead>
              <tr className="nova-secao-thead-row">
                <SortableTableHeader
                  label="ID"
                  sortKey="id"
                  activeSort={sort}
                  onSort={toggleSort}
                  className="nova-secao-th table-col-id"
                />
                <SortableTableHeader
                  label={t(NOMENCLATURE_KEYS.entity.section_compound)}
                  sortKey="description"
                  activeSort={sort}
                  onSort={toggleSort}
                  className="nova-secao-th"
                />
                <SortableTableHeader
                  label="Descrição / Integração"
                  sortKey="integration"
                  activeSort={sort}
                  onSort={toggleSort}
                  className="nova-secao-th"
                />
                <SortableTableHeader
                  label="Status"
                  sortKey="status"
                  activeSort={sort}
                  onSort={toggleSort}
                  className="nova-secao-th"
                />
                <th className="nova-secao-th nova-secao-th--right">Ações</th>
              </tr>
            </thead>
            <tbody className="nova-secao-tbody">
              {sortedItems.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="nova-secao-empty">
                    {t(NOMENCLATURE_KEYS.message.section_empty)}
                  </td>
                </tr>
              ) : (
                pagination.paginatedItems.map((sec) => (
                  <tr key={sec.sec_id} className="nova-secao-row">
                    <td className="nova-secao-cell table-cell-id">{sec.sec_id}</td>
                    <td className="nova-secao-cell">
                      <p className="nova-secao-name">{sec.sec_description}</p>
                    </td>
                    <td className="nova-secao-cell">
                      <p className="nova-secao-desc">{sec.sec_integration_id || '—'}</p>
                    </td>
                    <td className="nova-secao-cell">
                      <StatusBadge status={sec.sec_active === 1 ? 'Ativo' : 'Inativo'} />
                    </td>
                    <td className="nova-secao-cell--right">
                      <div className="nova-secao-actions">
                        {allowEdit && (
                          <button
                            type="button"
                            onClick={() => navigate(`/nova-secao/${sec.sec_id}/editar`)}
                            className="nova-secao-edit-btn"
                            title="Editar"
                          >
                            <Edit2 className="nova-secao-btn-icon" />
                          </button>
                        )}
                        {allowDelete && (
                          <button
                            type="button"
                            onClick={() => handleDelete(sec.sec_id)}
                            className="nova-secao-delete-btn"
                            title="Excluir"
                            disabled={deletingId === sec.sec_id}
                          >
                            {deletingId === sec.sec_id ? (
                              <Loader2 className="nova-secao-btn-icon nova-secao-spin" />
                            ) : (
                              <Trash2 className="nova-secao-btn-icon" />
                            )}
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
            itemLabel={sectionLabel}
          />
        </div>
      )}
    </div>
  );
};

export default NovaSecao;
