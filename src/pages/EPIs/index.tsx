import React, { useState } from 'react';
import { ShieldCheck, Plus, Edit3 } from 'lucide-react';
import { EPIS } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { EPIForm } from '../../components/forms/EPIForm';
import { EPI } from '../../types/system.types';
import './styles.css';

const EPIs = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEpi, setSelectedEpi] = useState<EPI | null>(null);

  const handleOpenModal = (epi?: EPI) => {
    setSelectedEpi(epi || null);
    setIsModalOpen(true);
  };

  return (
    <div className="epis-page">
      <div className="page-header">
        <h2 className="page-title">Catálogo de EPIs</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-add"
        >
          <Plus className="icon-sm" /> Novo EPI
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedEpi ? "Editar EPI" : "Cadastrar Novo EPI"}
      >
        <EPIForm 
          onClose={() => setIsModalOpen(false)} 
          initialData={selectedEpi || undefined}
        />
      </Modal>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">EPI</th>
              <th className="table-header-cell">CA / Fabricante</th>
              <th className="table-header-cell">Vida Útil</th>
              <th className="table-header-cell">Status</th>
              <th className="table-header-cell-right">Ações</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {EPIS.map(epi => (
              <tr 
                key={epi.id} 
                className="table-row"
                onClick={() => handleOpenModal(epi)}
              >
                <td className="table-cell">
                  <div className="epi-name-wrapper">
                    <div className="epi-icon-wrapper">
                      <ShieldCheck className="icon-sm" />
                    </div>
                    <span className="epi-name">{epi.nome}</span>
                  </div>
                </td>
                <td className="table-cell">
                  <p className="epi-ca">CA: {epi.ca}</p>
                  <p className="epi-manufacturer">{epi.fabricante}</p>
                </td>
                <td className="table-cell">
                  <span className="epi-vida-util">{epi.vidaUtil} dias</span>
                </td>
                <td className="table-cell">
                  <StatusBadge status={epi.status} />
                </td>
                <td className="table-cell-right">
                  <button className="btn-edit">
                    <Edit3 className="icon-sm" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default EPIs;
