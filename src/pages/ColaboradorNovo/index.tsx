import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { ColaboradorForm } from '../../components/forms/ColaboradorForm';
import '../ColaboradorEditar/styles.css';

const ColaboradorNovo = () => {
  const navigate = useNavigate();

  const handleClose = () => navigate('/colaboradores');
  const handleSaved = () => navigate('/colaboradores');

  return (
    <div className="editar-container">
      <div className="editar-header">
        <button onClick={handleClose} className="editar-back-btn" type="button">
          <ArrowLeft className="editar-back-icon" />
        </button>
        <div>
          <h2 className="editar-title">Novo Colaborador</h2>
          <p className="editar-subtitle">Preencha os dados para cadastrar um novo colaborador</p>
        </div>
      </div>

      <div className="editar-card">
        <div className="editar-card-body">
          <ColaboradorForm onClose={handleClose} onSaved={handleSaved} />
        </div>
      </div>
    </div>
  );
};

export default ColaboradorNovo;
