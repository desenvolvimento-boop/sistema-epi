import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { SectionForm } from '../../components/forms/SectionForm';
import { PageHeader, PageHeaderBackButton } from '../../components/layout/PageHeader';
import { useNomenclature } from '../../hooks/useNomenclature';
import { NOMENCLATURE_KEYS } from '../../config/nomenclatureKeys';
import '../ColaboradorEditar/styles.css';

const NovaSecaoCadastro = () => {
  const navigate = useNavigate();
  const { t } = useNomenclature();

  const handleClose = () => navigate('/nova-secao');
  const handleSaved = () => navigate('/nova-secao');

  return (
    <div className="editar-container">
      <PageHeader
        leading={<PageHeaderBackButton onClick={handleClose} />}
        icon={Building2}
        iconTone="amber"
        title={t(NOMENCLATURE_KEYS.page.section_create)}
        subtitle={t(NOMENCLATURE_KEYS.page.subtitle_section_create)}
      />

      <div className="editar-card">
        <div className="editar-card-body">
          <SectionForm onClose={handleClose} onSaved={handleSaved} />
        </div>
      </div>
    </div>
  );
};

export default NovaSecaoCadastro;
