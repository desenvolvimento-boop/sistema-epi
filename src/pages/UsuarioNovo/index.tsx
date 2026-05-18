import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { UsuarioForm } from '../../components/forms/UsuarioForm';
import '../ColaboradorEditar/styles.css';

const UsuarioNovo = () => {
  const navigate = useNavigate();

  const handleClose = () => navigate('/usuarios');
  const handleSaved = () => navigate('/usuarios');

  return (
    <div className="editar-container">
      <div className="editar-header">
        <button onClick={handleClose} className="editar-back-btn" type="button">
          <ArrowLeft className="editar-back-icon" />
        </button>
        <div>
          <h2 className="editar-title">Novo Usuário</h2>
          <p className="editar-subtitle">Preencha os dados para cadastrar um novo usuário</p>
        </div>
      </div>

      <div className="editar-card">
        <div className="editar-card-body">
          <UsuarioForm onClose={handleClose} onSaved={handleSaved} />
        </div>
      </div>
    </div>
  );
};

export default UsuarioNovo;
