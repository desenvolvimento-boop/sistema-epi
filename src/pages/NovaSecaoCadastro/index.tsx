import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { SectionForm } from '../../components/forms/SectionForm';
import '../ColaboradorEditar/styles.css';

const NovaSecaoCadastro = () => {
  const navigate = useNavigate();

  const handleClose = () => navigate('/nova-secao');
  const handleSaved = () => navigate('/nova-secao');

  return (
    <div className="editar-container">
      <div className="editar-header">
        <button onClick={handleClose} className="editar-back-btn" type="button">
          <ArrowLeft className="editar-back-icon" />
        </button>
        <div>
          <h2 className="editar-title">Cadastrar Seção</h2>
          <p className="editar-subtitle">Informe os dados da seção e vincule os EPIs obrigatórios</p>
        </div>
      </div>

      <div className="editar-card">
        <div className="editar-card-body">
          <SectionForm onClose={handleClose} onSaved={handleSaved} />
        </div>
      </div>
    </div>
  );
};

export default NovaSecaoCadastro;
