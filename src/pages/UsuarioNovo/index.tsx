import React from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { UsuarioForm } from '../../components/forms/UsuarioForm';
import { PageHeader, PageHeaderBackButton } from '../../components/layout/PageHeader';
import { useNomenclature } from '../../hooks/useNomenclature';
import { NOMENCLATURE_KEYS } from '../../config/nomenclatureKeys';
import '../ColaboradorEditar/styles.css';

const UsuarioNovo = () => {
  const navigate = useNavigate();
  const { t } = useNomenclature();

  const handleClose = () => navigate('/usuarios');
  const handleSaved = () => navigate('/usuarios');

  return (
    <div className="editar-container">
      <PageHeader
        leading={<PageHeaderBackButton onClick={handleClose} />}
        icon={UserPlus}
        title={t(NOMENCLATURE_KEYS.page.usuarios_novo)}
        subtitle={t(NOMENCLATURE_KEYS.page.subtitle_usuarios_novo)}
      />

      <div className="editar-card">
        <div className="editar-card-body">
          <UsuarioForm onClose={handleClose} onSaved={handleSaved} />
        </div>
      </div>
    </div>
  );
};

export default UsuarioNovo;
