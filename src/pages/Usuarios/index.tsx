import React, { useState } from 'react';
import { Plus, MoreVertical, Eye, Edit2, Trash2, AlertTriangle } from 'lucide-react';
import { USERS } from '../../services/api';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { UsuarioForm } from '../../components/forms/UsuarioForm';
import './styles.css';

const Usuarios = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<any>(null);
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const handleDeleteClick = (user: any) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
    setActiveMenu(null);
  };

  const confirmDelete = () => {
    console.log('Deletando usuário:', userToDelete?.id);
    setIsDeleteModalOpen(false);
    setUserToDelete(null);
  };

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <h2 className="usuarios-title">Usuários</h2>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="usuarios-add-btn"
        >
          <Plus className="usuarios-icon-sm" /> Novo Usuário
        </button>
      </div>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        title="Cadastrar Novo Usuário"
      >
        <UsuarioForm onClose={() => setIsModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirmar Exclusão"
      >
        <div className="usuarios-delete-content">
          <div className="usuarios-delete-warning">
            <div className="usuarios-delete-icon-wrapper">
              <AlertTriangle className="usuarios-icon-lg" />
            </div>
            <div>
              <p className="usuarios-delete-title">Atenção!</p>
              <p className="usuarios-delete-text">Você está prestes a excluir o usuário <span className="usuarios-delete-text-bold">{userToDelete?.nome}</span>. Esta ação não pode ser desfeita.</p>
            </div>
          </div>

          <div className="usuarios-delete-actions">
            <button 
              onClick={() => setIsDeleteModalOpen(false)}
              className="usuarios-cancel-btn"
            >
              Cancelar
            </button>
            <button 
              onClick={confirmDelete}
              className="usuarios-confirm-delete-btn"
            >
              Confirmar Exclusão
            </button>
          </div>
        </div>
      </Modal>

      <div className="usuarios-table-card">
        <table className="usuarios-table">
          <thead>
            <tr className="usuarios-thead-row">
              <th className="usuarios-th">Usuário</th>
              <th className="usuarios-th">Perfil / Permissão</th>
              <th className="usuarios-th">Status</th>
              <th className="usuarios-th-right">Ações</th>
            </tr>
          </thead>
          <tbody className="usuarios-tbody">
            {USERS.map(user => (
              <tr key={user.id} className="usuarios-row">
                <td className="usuarios-cell">
                  <p className="usuarios-name">{user.nome}</p>
                  <p className="usuarios-email">{user.email}</p>
                </td>
                <td className="usuarios-cell">
                  <span className="usuarios-badge">
                    {user.perfil}
                  </span>
                </td>
                <td className="usuarios-cell">
                  <StatusBadge status={user.status} />
                </td>
                <td className="usuarios-cell-right">
                  <div className="usuarios-actions">
                    <button 
                      className="usuarios-action-view"
                      title="Visualizar"
                    >
                      <Eye className="usuarios-icon-sm" />
                    </button>
                    <button 
                      className="usuarios-action-edit"
                      title="Editar"
                    >
                      <Edit2 className="usuarios-icon-sm" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(user)}
                      className="usuarios-action-delete"
                      title="Excluir"
                    >
                      <Trash2 className="usuarios-icon-sm" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Usuarios;
