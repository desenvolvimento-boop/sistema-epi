import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Building2 } from 'lucide-react';
import { SectionForm } from '../../components/forms/SectionForm';
import { PageHeader, PageHeaderBackButton } from '../../components/layout/PageHeader';
import { useNomenclature } from '../../hooks/useNomenclature';
import { NOMENCLATURE_KEYS } from '../../config/nomenclatureKeys';
import '../ColaboradorEditar/styles.css';

const NovaSecaoEditar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useNomenclature();
  const sectionId = Number(id);

  const handleClose = () => navigate('/nova-secao');
  const handleSaved = () => navigate('/nova-secao');

  return (
    <div className="editar-container">
      <PageHeader
        leading={<PageHeaderBackButton onClick={handleClose} />}
        icon={Building2}
        iconTone="amber"
        title={t(NOMENCLATURE_KEYS.page.section_edit)}
        subtitle={t(NOMENCLATURE_KEYS.page.subtitle_section_edit)}
      />

      <div className="editar-card">
        <div className="editar-card-body">
          <SectionForm
            key={sectionId}
            sectionId={sectionId}
            onClose={handleClose}
            onSaved={handleSaved}
          />
        </div>
      </div>
    </div>
  );
};

export default NovaSecaoEditar;
