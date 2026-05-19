import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SectionForm } from '../../components/forms/SectionForm';
import '../ColaboradorEditar/styles.css';

const NovaSecaoEditar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const sectionId = Number(id);

  const handleClose = () => navigate('/nova-secao');
  const handleSaved = () => navigate('/nova-secao');

  return (
    <div className="editar-container">
      <div className="editar-header">
        <button onClick={handleClose} className="editar-back-btn" type="button">
          <ArrowLeft className="editar-back-icon" />
        </button>
        <div>
          <h2 className="editar-title">Editar Seção</h2>
          <p className="editar-subtitle">Atualize os dados da seção e os EPIs vinculados</p>
        </div>
      </div>

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
