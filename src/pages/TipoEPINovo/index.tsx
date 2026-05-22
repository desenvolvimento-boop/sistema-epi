import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { EpiTypeForm } from '../../components/forms/EpiTypeForm';
import { PageHeader, PageHeaderBackButton } from '../../components/layout/PageHeader';
import { useNomenclature } from '../../hooks/useNomenclature';
import { NOMENCLATURE_KEYS } from '../../config/nomenclatureKeys';
import '../ColaboradorEditar/styles.css';

const TipoEPINovo = () => {
  const navigate = useNavigate();
  const { t } = useNomenclature();

  const handleClose = () => navigate('/tipos-epi');
  const handleSaved = () => navigate('/tipos-epi');

  return (
    <div className="editar-container">
      <PageHeader
        leading={<PageHeaderBackButton onClick={handleClose} />}
        icon={ShieldCheck}
        title={t(NOMENCLATURE_KEYS.page.tipos_epi_novo)}
        subtitle={t(NOMENCLATURE_KEYS.page.subtitle_tipos_epi_novo)}
      />

      <div className="editar-card">
        <div className="editar-card-body">
          <EpiTypeForm onClose={handleClose} onSaved={handleSaved} />
        </div>
      </div>
    </div>
  );
};

export default TipoEPINovo;
