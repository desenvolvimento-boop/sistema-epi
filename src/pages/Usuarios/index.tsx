import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Eye, Edit2, Trash2, AlertTriangle, Loader2, RefreshCw } from 'lucide-react';
import { User } from '../../types/system.types';
import { userService } from '../../services/userService';
import { StatusBadge } from '../../components/StatusBadge';
import { Modal } from '../../components/ui/Modal';
import { UsuarioForm } from '../../components/forms/UsuarioForm';
import './styles.css';

const Usuarios = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [viewUser, setViewUser] = useState<User | null>(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userService.getAll();
      setUsers(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleOpenCreate = () => {
    setSelectedUser(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (user: User) => {
    setSelectedUser(user);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
  };

  const handleSaved = () => {
    handleCloseModal();
    fetchUsers();
  };

  const handleViewUser = (user: User) => {
    setViewUser(user);
    setIsViewModalOpen(true);
  };

  const handleDeleteClick = (user: User) => {
    setUserToDelete(user);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    setDeleting(true);
    try {
      await userService.delete(userToDelete.usr_id);
      setIsDeleteModalOpen(false);
      setUserToDelete(null);
      fetchUsers();
    } catch (err: any) {
      alert(err.message || 'Erro ao excluir usuário');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="usuarios-container">
      <div className="usuarios-header">
        <h2 className="usuarios-title">Usuários</h2>
        <div className="usuarios-header-actions">
          <button onClick={fetchUsers} className="usuarios-refresh-btn" title="Atualizar lista" disabled={loading}>
            <RefreshCw className={`usuarios-icon-sm ${loading ? 'usuarios-spin' : ''}`} />
          </button>
          <button onClick={handleOpenCreate} className="usuarios-add-btn">
            <Plus className="usuarios-icon-sm" /> Novo Usuário
          </button>
        </div>
      </div>

      {/* Modal Cadastrar / Editar */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedUser ? 'Editar Usuário' : 'Cadastrar Novo Usuário'}
      >
        <UsuarioForm
          onClose={handleCloseModal}
          onSaved={handleSaved}
          initialData={selectedUser ?? undefined}
        />
      </Modal>

      {/* Modal Visualizar */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Detalhes do Usuário"
      >
        {viewUser && (
          <div className="usuarios-view">
            <div className="usuarios-view-grid">
              <ViewField label="Nome" value={viewUser.usr_full_name} />
              <ViewField label="Login" value={viewUser.usr_username} />
              <ViewField label="E-mail" value={viewUser.usr_email} />
              <ViewField label="Tipo de Agente" value={viewUser.usr_agent_type} />
              <ViewField label="Perfil de Acesso" value={viewUser.usr_access_profile} />
              <ViewField label="Status" value={viewUser.usr_active === 1 ? 'Ativo' : 'Inativo'} />
              <ViewField label="Telefone" value={formatPhone(viewUser.usr_phone_country_code, viewUser.usr_phone_area_code, viewUser.usr_phone_number)} />
              <ViewField label="Celular" value={formatPhone(viewUser.usr_mobile_country_code, viewUser.usr_mobile_area_code, viewUser.usr_mobile_number)} />
              <ViewField label="CEP" value={viewUser.usr_zip_code} />
              <ViewField label="País" value={viewUser.usr_country} />
              <ViewField label="Estado" value={viewUser.usr_state} />
              <ViewField label="Cidade" value={viewUser.usr_city} />
              <ViewField label="Bairro" value={viewUser.usr_neighborhood} />
              <ViewField label="Logradouro" value={viewUser.usr_street} />
              <ViewField label="Número" value={viewUser.usr_street_number} />
              <ViewField label="Complemento" value={viewUser.usr_complement} />
            </div>
            {viewUser.usr_notes && (
              <div className="usuarios-view-notes">
                <span className="usuarios-view-label">Observação</span>
                <p className="usuarios-view-value">{viewUser.usr_notes}</p>
              </div>
            )}
            <div className="usuarios-view-actions">
              <button onClick={() => setIsViewModalOpen(false)} className="usuarios-view-close-btn">
                Fechar
              </button>
            </div>
          </div>
        )}
      </Modal>

      {/* Modal Confirmar Exclusão */}
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
              <p className="usuarios-delete-text">
                Você está prestes a excluir o usuário <span className="usuarios-delete-text-bold">{userToDelete?.usr_full_name}</span>. Esta ação não pode ser desfeita.
              </p>
            </div>
          </div>
          <div className="usuarios-delete-actions">
            <button onClick={() => setIsDeleteModalOpen(false)} className="usuarios-cancel-btn" disabled={deleting}>
              Cancelar
            </button>
            <button onClick={confirmDelete} className="usuarios-confirm-delete-btn" disabled={deleting}>
              {deleting ? 'Excluindo...' : 'Confirmar Exclusão'}
            </button>
          </div>
        </div>
      </Modal>

      {/* Conteúdo */}
      {error && (
        <div className="usuarios-error-banner">
          <p>{error}</p>
          <button onClick={fetchUsers} className="usuarios-retry-btn">Tentar novamente</button>
        </div>
      )}

      {loading && users.length === 0 ? (
        <div className="usuarios-loading">
          <Loader2 className="usuarios-loading-icon usuarios-spin" />
          <p>Carregando usuários...</p>
        </div>
      ) : (
        <div className="usuarios-table-card">
          <table className="usuarios-table">
            <thead>
              <tr className="usuarios-thead-row">
                <th className="usuarios-th">Usuário</th>
                <th className="usuarios-th">Perfil / Permissão</th>
                <th className="usuarios-th">Tipo</th>
                <th className="usuarios-th">Status</th>
                <th className="usuarios-th-right">Ações</th>
              </tr>
            </thead>
            <tbody className="usuarios-tbody">
              {users.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="usuarios-empty">Nenhum usuário encontrado.</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.usr_id} className="usuarios-row">
                    <td className="usuarios-cell">
                      <p className="usuarios-name">{user.usr_full_name}</p>
                      <p className="usuarios-email">{user.usr_email}</p>
                    </td>
                    <td className="usuarios-cell">
                      <span className="usuarios-badge">{user.usr_access_profile}</span>
                    </td>
                    <td className="usuarios-cell">
                      <span className="usuarios-type-badge">{user.usr_agent_type}</span>
                    </td>
                    <td className="usuarios-cell">
                      <StatusBadge status={user.usr_active === 1 ? 'Ativo' : 'Inativo'} />
                    </td>
                    <td className="usuarios-cell-right">
                      <div className="usuarios-actions">
                        <button onClick={() => handleViewUser(user)} className="usuarios-action-view" title="Visualizar">
                          <Eye className="usuarios-icon-sm" />
                        </button>
                        <button onClick={() => handleOpenEdit(user)} className="usuarios-action-edit" title="Editar">
                          <Edit2 className="usuarios-icon-sm" />
                        </button>
                        <button onClick={() => handleDeleteClick(user)} className="usuarios-action-delete" title="Excluir">
                          <Trash2 className="usuarios-icon-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

function ViewField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div className="usuarios-view-field">
      <span className="usuarios-view-label">{label}</span>
      <span className="usuarios-view-value">{value || '—'}</span>
    </div>
  );
}

function formatPhone(countryCode: string | null, areaCode: string | null, number: string | null): string | null {
  if (!number) return null;
  const parts: string[] = [];
  if (countryCode) parts.push(`+${countryCode}`);
  if (areaCode) parts.push(`(${areaCode})`);
  parts.push(number);
  return parts.join(' ');
}

export default Usuarios;
