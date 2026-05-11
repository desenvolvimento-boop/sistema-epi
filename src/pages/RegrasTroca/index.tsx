import React, { useState } from 'react';
import { Plus, Edit3 } from 'lucide-react';
import { REPLACEMENT_RULES } from '../../services/api';
import clsx from 'clsx';
import { Modal } from '../../components/ui/Modal';
import { RegraTrocaForm } from '../../components/forms/RegraTrocaForm';
import { ReplacementRule } from '../../types/system.types';
import './styles.css';

const RegrasTroca = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRule, setSelectedRule] = useState<ReplacementRule | null>(null);

  const handleOpenModal = (rule?: ReplacementRule) => {
    setSelectedRule(rule || null);
    setIsModalOpen(true);
  };

  return (
    <div className="regras-page">
      <div className="page-header">
        <h2 className="page-title">Regras de Troca e Substituição</h2>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-add"
        >
          <Plus className="icon-sm" /> Nova Regra
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title={selectedRule ? "Editar Regra de Troca" : "Cadastrar Nova Regra de Troca"}
      >
        <RegraTrocaForm 
          onClose={() => setIsModalOpen(false)} 
          initialData={selectedRule || undefined}
        />
      </Modal>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr className="table-header-row">
              <th className="table-header-cell">EPI Alvo</th>
              <th className="table-header-cell">Vida Útil (Dias)</th>
              <th className="table-header-cell">Gatilho de Troca</th>
              <th className="table-header-cell">Criticidade</th>
              <th className="table-header-cell-right">Ações</th>
            </tr>
          </thead>
          <tbody className="table-body">
            {REPLACEMENT_RULES.map(rule => (
              <tr 
                key={rule.id} 
                className="table-row"
                onClick={() => handleOpenModal(rule)}
              >
                <td className="table-cell">
                  <span className="rule-epi-name">{rule.epi}</span>
                </td>
                <td className="table-cell">
                  <span className="rule-vida-util">{rule.vidaUtil}</span>
                </td>
                <td className="table-cell">
                  <p className="rule-motivo">{rule.motivo}</p>
                  {rule.contrato && <p className="rule-contrato">Contrato: {rule.contrato}</p>}
                </td>
                <td className="table-cell">
                  <span className={clsx("criticidade-badge", 
                    rule.criticidade === 'Alta' ? 'criticidade-alta' : 
                    rule.criticidade === 'Média' ? 'criticidade-media' : 'criticidade-baixa'
                  )}>
                    {rule.criticidade}
                  </span>
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

export default RegrasTroca;
