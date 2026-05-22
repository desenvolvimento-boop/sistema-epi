import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { ColaboradorForm } from '../../components/forms/ColaboradorForm';
import { PageHeader, PageHeaderBackButton } from '../../components/layout/PageHeader';
import { useNomenclature } from '../../hooks/useNomenclature';
import { NOMENCLATURE_KEYS } from '../../config/nomenclatureKeys';
import '../ColaboradorEditar/styles.css';

const ColaboradorNovo = () => {
  const navigate = useNavigate();
  const { t } = useNomenclature();

  const handleClose = () => navigate('/colaboradores');
  const handleSaved = () => navigate('/colaboradores');

  return (
    <div className="editar-container">
      <PageHeader
        leading={<PageHeaderBackButton onClick={handleClose} />}
        icon={UserPlus}
        title={t(NOMENCLATURE_KEYS.page.colaboradores_novo)}
        subtitle={t(NOMENCLATURE_KEYS.page.subtitle_colaboradores_novo)}
      />

      <div className="editar-card">
        <div className="editar-card-body">
          <ColaboradorForm onClose={handleClose} onSaved={handleSaved} />
        </div>
      </div>
    </div>
  );
};

export default ColaboradorNovo;
