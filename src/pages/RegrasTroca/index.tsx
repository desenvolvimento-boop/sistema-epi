import React, { useState, useEffect, useCallback } from 'react';
import { Edit3, Loader2 } from 'lucide-react';
import { epiTypeService, type EpiTypeAPI } from '../../services/epiTypeService';
import clsx from 'clsx';
import { Modal } from '../../components/ui/Modal';
import { RegraTrocaForm } from '../../components/forms/RegraTrocaForm';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

const RegrasTroca = () => {
  const [types, setTypes] = useState<EpiTypeAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedType, setSelectedType] = useState<EpiTypeAPI | null>(null);
  const { canEdit } = useAuth();
  const allowEdit = canEdit('/regras-troca');

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

  const handleOpenModal = (type: EpiTypeAPI) => {
    setSelectedType(type);
    setIsModalOpen(true);
  };

  const getCriticidade = (days: number) => {
    if (days <= 90) return 'Alta';
    if (days <= 180) return 'Média';
    return 'Baixa';
  };

  return (
    <div className="regras-page">
      <div className="page-header">
        <h2 className="page-title">Regras de Troca e Substituição</h2>
      </div>

      <p className="regras-page-hint">
        A vida útil padrão é definida por <strong>tipo de EPI</strong>. Clique em uma linha para editar os dias de troca.
      </p>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedType ? `Editar Regra: ${selectedType.ept_description}` : 'Editar Regra de Troca'}
      >
        <RegraTrocaForm
          onClose={() => setIsModalOpen(false)}
          onSaved={loadTypes}
          initialData={selectedType || undefined}
        />
      </Modal>

      <div className="table-container">
        {loading ? (
          <div className="regras-loading">
            <Loader2 className="icon-sm regras-spin" />
            <span>Carregando...</span>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr className="table-header-row">
                <th className="table-header-cell">Tipo de EPI</th>
                <th className="table-header-cell">Categoria</th>
                <th className="table-header-cell">Vida Útil (Dias)</th>
                <th className="table-header-cell">Criticidade</th>
                <th className="table-header-cell">Status</th>
                {allowEdit && <th className="table-header-cell-right">Ações</th>}
              </tr>
            </thead>
            <tbody className="table-body">
              {types.map((type) => {
                const criticidade = getCriticidade(type.ept_lifespan_days);
                return (
                  <tr
                    key={type.ept_id}
                    className="table-row"
                    onClick={() => allowEdit && handleOpenModal(type)}
                    style={{ cursor: allowEdit ? 'pointer' : 'default' }}
                  >
                    <td className="table-cell">
                      <span className="rule-epi-name">{type.ept_description}</span>
                    </td>
                    <td className="table-cell">{type.ept_category}</td>
                    <td className="table-cell">
                      <span className="rule-vida-util">{type.ept_lifespan_days}</span>
                    </td>
                    <td className="table-cell">
                      <span
                        className={clsx(
                          'criticidade-badge',
                          criticidade === 'Alta'
                            ? 'criticidade-alta'
                            : criticidade === 'Média'
                              ? 'criticidade-media'
                              : 'criticidade-baixa'
                        )}
                      >
                        {criticidade}
                      </span>
                    </td>
                    <td className="table-cell">{type.ept_active === 1 ? 'Ativo' : 'Inativo'}</td>
                    {allowEdit && (
                      <td className="table-cell-right">
                        <button type="button" className="btn-edit" onClick={() => handleOpenModal(type)}>
                          <Edit3 className="icon-sm" />
                        </button>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RegrasTroca;
