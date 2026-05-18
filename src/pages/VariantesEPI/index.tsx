import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit3, Loader2, Package } from 'lucide-react';
import { epiTypeService, type EpiTypeAPI } from '../../services/epiTypeService';
import { epiVariantService, type EpiVariantAPI } from '../../services/epiVariantService';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { EpiVariantForm } from '../../components/forms/EpiVariantForm';
import { useAuth } from '../../contexts/AuthContext';
import '../EPIs/styles.css';
import './styles.css';

const ALL_TYPES_FILTER = '';

const VariantesEPI = () => {
  const navigate = useNavigate();
  const [types, setTypes] = useState<EpiTypeAPI[]>([]);
  const [variants, setVariants] = useState<EpiVariantAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState(ALL_TYPES_FILTER);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingVariant, setEditingVariant] = useState<EpiVariantAPI | null>(null);
  const { canCreate, canEdit } = useAuth();
  const allowCreate = canCreate('/epis');
  const allowEdit = canEdit('/epis');

  const typesById = useMemo(() => new Map(types.map((t) => [t.ept_id, t])), [types]);

  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const [typesData, variantsData] = await Promise.all([
        epiTypeService.getAll(),
        epiVariantService.getAll(),
      ]);
      setTypes(typesData);
      setVariants(variantsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredVariants = useMemo(() => {
    if (!typeFilter) return variants;
    const eptId = Number(typeFilter);
    return variants.filter((v) => v.ept_id === eptId);
  }, [variants, typeFilter]);

  const handleOpenEditModal = (variant: EpiVariantAPI) => {
    setEditingVariant(variant);
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingVariant(null);
  };

  const handleNavigateCreate = () => {
    const path = typeFilter ? `/variantes-epi/novo?tipo=${typeFilter}` : '/variantes-epi/novo';
    navigate(path);
  };

  const variantLabel = (v: EpiVariantAPI) => {
    const parts = [v.epv_manufacturer, v.epv_model].filter(Boolean);
    return parts.join(' · ');
  };

  const getTypeForVariant = (v: EpiVariantAPI) =>
    v.epiType ?? typesById.get(v.ept_id);

  const activeTypes = types.filter((t) => t.ept_active === 1);

  return (
    <div className="epis-page variantes-epi-page">
      <div className="page-header">
        <h2 className="page-title">Variantes de EPIs</h2>
        {allowCreate && (
          <button
            type="button"
            onClick={handleNavigateCreate}
            className="btn-add"
            disabled={activeTypes.length === 0}
            title={activeTypes.length === 0 ? 'Cadastre um tipo de EPI primeiro' : undefined}
          >
            <Plus className="icon-sm" /> Nova Variante
          </button>
        )}
      </div>

      <p className="epis-page-hint">
        Gerencie as <strong>variantes homologadas</strong> (fabricante, modelo e CA) vinculadas aos tipos cadastrados em{' '}
        <strong>Tipo de EPIs</strong>.
      </p>

      <div className="variantes-epi-toolbar">
        <label className="variantes-epi-filter-label" htmlFor="variantes-type-filter">
          Filtrar por tipo
        </label>
        <select
          id="variantes-type-filter"
          className="epi-form-input variantes-epi-filter-select"
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <option value={ALL_TYPES_FILTER}>Todos os tipos</option>
          {types.map((t) => (
            <option key={t.ept_id} value={String(t.ept_id)}>
              {t.ept_description}
            </option>
          ))}
        </select>
      </div>

      <Modal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        title="Editar Variante"
      >
        {editingVariant && (
          <EpiVariantForm
            types={types}
            eptId={editingVariant.ept_id}
            onClose={handleCloseEditModal}
            onSaved={() => {
              handleCloseEditModal();
              loadData();
            }}
            initialData={editingVariant}
          />
        )}
      </Modal>

      <div className="table-container epis-catalog-panel">
        {loading ? (
          <div className="epis-loading">
            <Loader2 className="icon-sm epis-spin" />
            <span>Carregando...</span>
          </div>
        ) : types.length === 0 ? (
          <div className="epis-variants-placeholder epis-types-empty">
            <Package className="epis-variants-placeholder-icon" />
            <p>
              Nenhum tipo de EPI cadastrado. Cadastre tipos em <strong>Tipo de EPIs</strong> antes de adicionar
              variantes.
            </p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr className="table-header-row">
                <th className="table-header-cell table-col-id">ID</th>
                <th className="table-header-cell">Tipo de EPI</th>
                <th className="table-header-cell">Fabricante / Modelo</th>
                <th className="table-header-cell">CA</th>
                <th className="table-header-cell">Vida útil</th>
                <th className="table-header-cell">Origem</th>
                <th className="table-header-cell">Status</th>
                {allowEdit && <th className="table-header-cell-right">Ações</th>}
              </tr>
            </thead>
            <tbody className="table-body">
              {filteredVariants.length === 0 ? (
                <tr>
                  <td colSpan={allowEdit ? 8 : 7} className="table-cell epis-empty-cell">
                    {typeFilter
                      ? 'Nenhuma variante para este tipo.'
                      : 'Nenhuma variante cadastrada.'}
                  </td>
                </tr>
              ) : (
                filteredVariants.map((variant) => {
                  const source = variant.epv_integration_source || 'Manual';
                  const tipo = getTypeForVariant(variant);
                  return (
                    <tr key={variant.epv_id} className="table-row epis-catalog-row">
                      <td className="table-cell table-cell-id">{variant.epv_id}</td>
                      <td className="table-cell">
                        <span className="epi-name">{tipo?.ept_description ?? '—'}</span>
                        {tipo?.ept_category && (
                          <p className="epi-technical">{tipo.ept_category}</p>
                        )}
                      </td>
                      <td className="table-cell">
                        <span className="epi-name">{variantLabel(variant)}</span>
                        {variant.epv_technical_description && (
                          <p className="epi-technical">{variant.epv_technical_description}</p>
                        )}
                      </td>
                      <td className="table-cell">
                        <span className="epi-origin-badge">{variant.epv_ca}</span>
                      </td>
                      <td className="table-cell">
                        {variant.epv_lifespan_days ?? (
                          <span className="epi-category">
                            {tipo ? `Padrão (${tipo.ept_lifespan_days}d)` : '—'}
                          </span>
                        )}
                      </td>
                      <td className="table-cell">
                        <span className={`epi-origin-badge epi-origin-${source.toLowerCase()}`}>
                          {source}
                        </span>
                      </td>
                      <td className="table-cell">
                        <StatusBadge status={variant.epv_active === 1 ? 'Ativo' : 'Inativo'} />
                      </td>
                      {allowEdit && (
                        <td className="table-cell-right">
                          <button
                            type="button"
                            className="btn-edit"
                            onClick={() => handleOpenEditModal(variant)}
                            title="Editar variante"
                          >
                            <Edit3 className="icon-sm" />
                          </button>
                        </td>
                      )}
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default VariantesEPI;
