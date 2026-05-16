import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Plus, Edit3, Loader2 } from 'lucide-react';
import { epiTypeService, type EpiTypeAPI } from '../../services/epiTypeService';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { EpiTypeForm } from '../../components/forms/EpiTypeForm';
import { useAuth } from '../../contexts/AuthContext';
import '../EPIs/styles.css';

const TiposEPI = () => {
  const [types, setTypes] = useState<EpiTypeAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [isTypeModalOpen, setIsTypeModalOpen] = useState(false);
  const [editingType, setEditingType] = useState<EpiTypeAPI | null>(null);
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

  const handleOpenTypeModal = (type?: EpiTypeAPI, e?: React.MouseEvent) => {
    e?.stopPropagation();
    setEditingType(type || null);
    setIsTypeModalOpen(true);
  };

  return (
    <div className="epis-page">
      <div className="page-header">
        <h2 className="page-title">Tipo de EPIs</h2>
        {allowCreate && (
          <button onClick={() => handleOpenTypeModal()} className="btn-add" type="button">
            <Plus className="icon-sm" /> Novo Tipo
          </button>
        )}
      </div>

      <p className="epis-page-hint">
        Cadastre os <strong>tipos de EPI</strong> (ex: Bota PVC, Capacete). Funções e matriz vinculam apenas o tipo.
        As <strong>variantes homologadas</strong> são cadastradas em Variantes de EPIs.
      </p>

      <Modal
        isOpen={isTypeModalOpen}
        onClose={() => setIsTypeModalOpen(false)}
        title={editingType ? 'Editar Tipo de EPI' : 'Cadastrar Tipo de EPI'}
      >
        <EpiTypeForm
          onClose={() => setIsTypeModalOpen(false)}
          onSaved={loadTypes}
          initialData={editingType || undefined}
        />
      </Modal>

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
                  <td colSpan={allowEdit ? 5 : 4} className="table-cell epis-empty-cell">
                    Nenhum tipo cadastrado.
                  </td>
                </tr>
              ) : (
                types.map((type) => (
                  <tr key={type.ept_id} className="table-row epis-catalog-row">
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
                          onClick={(e) => handleOpenTypeModal(type, e)}
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
