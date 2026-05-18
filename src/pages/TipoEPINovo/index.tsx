import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { EpiTypeForm } from '../../components/forms/EpiTypeForm';
import '../ColaboradorEditar/styles.css';

const TipoEPINovo = () => {
  const navigate = useNavigate();

  const handleClose = () => navigate('/tipos-epi');
  const handleSaved = () => navigate('/tipos-epi');

  return (
    <div className="editar-container">
      <div className="editar-header">
        <button onClick={handleClose} className="editar-back-btn" type="button">
          <ArrowLeft className="editar-back-icon" />
        </button>
        <div>
          <h2 className="editar-title">Novo Tipo de EPI</h2>
          <p className="editar-subtitle">Cadastre um novo tipo de EPI para vincular em funções e matriz</p>
        </div>
      </div>

      <div className="editar-card">
        <div className="editar-card-body">
          <EpiTypeForm onClose={handleClose} onSaved={handleSaved} />
        </div>
      </div>
    </div>
  );
};

export default TipoEPINovo;
