import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, Plus, Edit3, Loader2 } from 'lucide-react';
import { epiService, type EpiAPI } from '../../services/epiService';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { EPIForm } from '../../components/forms/EPIForm';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

const EPIs = () => {
  const [epis, setEpis] = useState<EpiAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEpi, setSelectedEpi] = useState<EpiAPI | null>(null);
  const { canCreate, canEdit } = useAuth();
  const allowCreate = canCreate('/epis');
  const allowEdit = canEdit('/epis');

  const loadEpis = useCallback(async () => {
    setLoading(true);
    try {
      const data = await epiService.getAll();
      setEpis(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEpis();
  }, [loadEpis]);

  const handleOpenModal = (epi?: EpiAPI) => {
    setSelectedEpi(epi || null);
    setIsModalOpen(true);
  };

  return (
    <div className="epis-page">
      <div className="page-header">
        <h2 className="page-title">Catálogo de EPIs</h2>
        {allowCreate && (
          <button onClick={() => handleOpenModal()} className="btn-add">
            <Plus className="icon-sm" /> Novo EPI
          </button>
        )}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedEpi ? 'Editar EPI' : 'Cadastrar Novo EPI'}
      >
        <EPIForm
          onClose={() => setIsModalOpen(false)}
          onSaved={loadEpis}
          initialData={selectedEpi || undefined}
        />
      </Modal>

      <div className="table-container">
        {loading ? (
          <div className="epis-loading">
            <Loader2 className="icon-sm epis-spin" />
            <span>Carregando...</span>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr className="table-header-row">
                <th className="table-header-cell">EPI</th>
                <th className="table-header-cell">CA / Fabricante</th>
                <th className="table-header-cell">Categoria</th>
                <th className="table-header-cell">Vida Útil</th>
                <th className="table-header-cell">Origem</th>
                <th className="table-header-cell">Status</th>
                <th className="table-header-cell-right">Ações</th>
              </tr>
            </thead>
            <tbody className="table-body">
              {epis.map((epi) => (
                <tr
                  key={epi.epi_id}
                  className="table-row"
                  onClick={() => allowEdit && handleOpenModal(epi)}
                  style={{ cursor: allowEdit ? 'pointer' : 'default' }}
                >
                  <td className="table-cell">
                    <div className="epi-name-wrapper">
                      <div className="epi-icon-wrapper">
                        <ShieldCheck className="icon-sm" />
                      </div>
                      <span className="epi-name">{epi.epi_description}</span>
                    </div>
                  </td>
                  <td className="table-cell">
                    <p className="epi-ca">CA: {epi.epi_ca}</p>
                    <p className="epi-manufacturer">{epi.epi_manufacturer}</p>
                  </td>
                  <td className="table-cell">
                    <span className="epi-category">{epi.epi_category}</span>
                  </td>
                  <td className="table-cell">
                    <span className="epi-vida-util">{epi.epi_lifespan_days} dias</span>
                  </td>
                  <td className="table-cell">
                    <span className={`epi-origin-badge epi-origin-${(epi.epi_integration_source || 'Manual').toLowerCase()}`}>
                      {epi.epi_integration_source || 'Manual'}
                    </span>
                  </td>
                  <td className="table-cell">
                    <StatusBadge status={epi.epi_active === 1 ? 'Ativo' : 'Inativo'} />
                  </td>
                  <td className="table-cell-right">
                    {allowEdit && (
                      <button type="button" className="btn-edit" onClick={(e) => { e.stopPropagation(); handleOpenModal(epi); }}>
                        <Edit3 className="icon-sm" />
                      </button>
                    )}
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

export default EPIs;
