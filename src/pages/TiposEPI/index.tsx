import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ListFiltersBar } from '../../components/list/ListFiltersBar';
import { activeStatusMatcher, filterListRows } from '../../utils/listFilters';
import { epiTypeCategoryLabel } from '../../services/epiTypeService';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Plus, Edit3, Loader2 } from 'lucide-react';
import { epiTypeService, type EpiTypeAPI } from '../../services/epiTypeService';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { EpiTypeForm } from '../../components/forms/EpiTypeForm';
import { useAuth } from '../../contexts/AuthContext';
import '../EPIs/styles.css';

const TiposEPI = () => {
  const navigate = useNavigate();
  const [types, setTypes] = useState<EpiTypeAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<EpiTypeAPI | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const { canCreate, canEdit } = useAuth();
  const allowCreate = canCreate('/epis');
  const allowEdit = canEdit('/epis');

  const loadTypes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await epiTypeService.getAll();
      setTypes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadTypes();
  }, [loadTypes]);

  const handleOpenEditModal = (type: EpiTypeAPI, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingType(type);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingType(null);
  };

  const categoryOptions = useMemo(() => {
    const set = new Set(types.map((t) => epiTypeCategoryLabel(t)));
    return Array.from(set)
      .filter((c) => c !== '—')
      .map((label) => ({ value: label, label }));
  }, [types]);

  const filteredTypes = useMemo(
    () =>
      filterListRows(types, searchTerm, filterValues, {
        searchText: (type) =>
          [type.ept_description, epiTypeCategoryLabel(type), String(type.ept_id), String(type.ept_lifespan_days)]
            .filter(Boolean)
            .join(' '),
        fields: {
          status: activeStatusMatcher((type) => type.ept_active),
          category: (type, value) => epiTypeCategoryLabel(type) === value,
        },
      }),
    [types, searchTerm, filterValues],
  );

  return (
    <div className="epis-page">
      <div className="page-header">
        <h2 className="page-title">Tipo de EPIs</h2>
        {allowCreate && (
          <button onClick={() => navigate('/tipos-epi/novo')} className="btn-add" type="button">
            <Plus className="icon-sm" /> Novo Tipo
          </button>
        )}
      </div>

      <p className="epis-page-hint">
        Cadastre os <strong>tipos de EPI</strong> (ex: Bota PVC, Capacete). Funções e matriz vinculam apenas o tipo.
        As <strong>variantes homologadas</strong> são cadastradas em Variantes de EPIs.
      </p>

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Editar Tipo de EPI"
      >
        {editingType && (
          <EpiTypeForm
            onClose={handleCloseEditModal}
            onSaved={() => {
              handleCloseEditModal();
              loadTypes();
            }}
            initialData={editingType}
            existingTypes={types}
          />
        )}
      </Modal>

      <ListFiltersBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar tipo de EPI ou categoria..."
        fields={[
          {
            id: 'category',
            label: 'Categoria',
            type: 'select',
            options: categoryOptions,
          },
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

      <div className="table-container epis-catalog-panel">
        {loading ? (
          <div className="epis-loading">
            <Loader2 className="icon-sm epis-spin" />
            <span>Carregando...</span>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr className="table-header-row">
                <th className="table-header-cell table-col-id">ID</th>
                <th className="table-header-cell">Tipo de EPI</th>
                <th className="table-header-cell">Categoria</th>
                <th className="table-header-cell">Vida útil (dias)</th>
                <th className="table-header-cell">Status</th>
                {allowEdit && <th className="table-header-cell-right">Ações</th>}
              </tr>
            </thead>
            <tbody className="table-body">
              {types.length === 0 ? (
                <tr>
                  <td colSpan={allowEdit ? 6 : 5} className="table-cell epis-empty-cell">
                    Nenhum tipo cadastrado.
                  </td>
                </tr>
              ) : filteredTypes.length === 0 ? (
                <tr>
                  <td colSpan={allowEdit ? 6 : 5} className="table-cell epis-empty-cell">
                    Nenhum tipo encontrado com os filtros aplicados.
                  </td>
                </tr>
              ) : (
                filteredTypes.map((type) => (
                  <tr key={type.ept_id} className="table-row epis-catalog-row">
                    <td className="table-cell table-cell-id">{type.ept_id}</td>
                    <td className="table-cell">
                      <div className="epi-name-wrapper">
                        <div className="epi-icon-wrapper">
                          <ShieldCheck className="icon-sm" />
                        </div>
                        <span className="epi-name">{type.ept_description}</span>
                      </div>
                    </td>
                    <td className="table-cell">
                      <span className="epi-category">{type.ept_category}</span>
                    </td>
                    <td className="table-cell">{type.ept_lifespan_days}</td>
                    <td className="table-cell">
                      <StatusBadge status={type.ept_active === 1 ? 'Ativo' : 'Inativo'} />
                    </td>
                    {allowEdit && (
                      <td className="table-cell-right">
                        <button
                          type="button"
                          className="btn-edit"
                          onClick={(e) => handleOpenEditModal(type, e)}
                          title="Editar tipo"
                        >
                          <Edit3 className="icon-sm" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default TiposEPI;
