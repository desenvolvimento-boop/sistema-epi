import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, RefreshCw, Check, X, Loader2, AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { userGroupService, type UserGroupAPI } from '../../services/userGroupService';
import { validateUserGroupUniqueness } from '../../utils/uniqueness';
import './UserGroupCrudModal.css';

interface UserGroupCrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  onGroupCreated?: (group: UserGroupAPI) => void;
}

export const UserGroupCrudModal = ({ isOpen, onClose, onGroupCreated }: UserGroupCrudModalProps) => {
  const [groups, setGroups] = useState<UserGroupAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');

  const [showForm, setShowForm] = useState(false);
  const [editingGroup, setEditingGroup] = useState<UserGroupAPI | null>(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const fetchGroups = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await userGroupService.getAll();
      setGroups(data);
    } catch (err: any) {
      setError(err.message || 'Erro ao carregar tipos de usuário');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchGroups();
      setShowForm(false);
      setEditingGroup(null);
      setSearch('');
      setCurrentPage(1);
    }
  }, [isOpen, fetchGroups]);

  const filtered = groups.filter(g => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      (g.usg_description || '').toLowerCase().includes(term) ||
      (g.usg_integrationid || '').toLowerCase().includes(term) ||
      String(g.usg_id).includes(term)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const resetForm = () => {
    setFormName('');
    setFormDesc('');
    setFormActive(true);
    setEditingGroup(null);
    setShowForm(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleOpenEdit = (group: UserGroupAPI) => {
    setEditingGroup(group);
    setFormName(group.usg_integrationid || '');
    setFormDesc(group.usg_description || '');
    setFormActive(group.usg_active === 1);
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formName.trim()) return;
    const duplicateMsg = validateUserGroupUniqueness(
      groups,
      formName,
      formDesc,
      editingGroup?.usg_id,
    );
    if (duplicateMsg) {
      setError(duplicateMsg);
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (editingGroup) {
        await userGroupService.update(editingGroup.usg_id, {
          usg_integrationid: formName.trim(),
          usg_description: formDesc.trim() || null,
          usg_active: formActive ? 1 : 0,
        });
      } else {
        const created = await userGroupService.create({
          usg_integrationid: formName.trim(),
          usg_description: formDesc.trim() || null,
          usg_active: formActive ? 1 : 0,
        });
        onGroupCreated?.(created);
      }
      resetForm();
      await fetchGroups();
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar tipo de usuário');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    setDeletingId(id);
    setError(null);
    try {
      await userGroupService.delete(id);
      await fetchGroups();
    } catch (err: any) {
      setError(err.message || 'Erro ao excluir tipo de usuário');
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Cadastrar Tipo de Usuário">
      <div className="usg-crud">
        {/* Toolbar */}
        <div className="usg-crud-toolbar">
          <div className="usg-crud-search-wrapper">
            <Search className="usg-crud-search-icon" />
            <input
              type="text"
              placeholder="Pesquisar"
              className="usg-crud-search-input"
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="usg-crud-toolbar-actions">
            <button
              type="button"
              className="usg-crud-toolbar-btn"
              onClick={fetchGroups}
              disabled={loading}
              title="Atualizar"
            >
              <RefreshCw className={`usg-crud-icon-sm ${loading ? 'usg-crud-spin' : ''}`} />
            </button>
            <button
              type="button"
              className="usg-crud-toolbar-btn usg-crud-toolbar-btn--primary"
              onClick={handleOpenAdd}
              title="Adicionar"
            >
              <Plus className="usg-crud-icon-sm" />
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="usg-crud-error">
            <AlertTriangle className="usg-crud-icon-sm" />
            <span>{error}</span>
          </div>
        )}

        {/* Inline Form */}
        {showForm && (
          <div className="usg-crud-form-card">
            <div className="usg-crud-form-title">
              {editingGroup ? 'Editar Tipo de Usuário' : 'Novo Tipo de Usuário'}
            </div>
            <div className="usg-crud-form-grid">
              <div className="usg-crud-form-field">
                <label className="usg-crud-form-label">Nome <span className="usg-crud-form-required">*</span></label>
                <input
                  type="text"
                  className="usg-crud-form-input"
                  placeholder="Nome do tipo"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="usg-crud-form-field">
                <label className="usg-crud-form-label">Descrição</label>
                <input
                  type="text"
                  className="usg-crud-form-input"
                  placeholder="Descrição do tipo"
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                />
              </div>
            </div>
            <div className="usg-crud-form-footer">
              <div className="usg-crud-form-toggle-row">
                <span className="usg-crud-form-toggle-label">Ativo</span>
                <button
                  type="button"
                  className={`usg-crud-toggle ${formActive ? 'usg-crud-toggle--active' : ''}`}
                  onClick={() => setFormActive(!formActive)}
                >
                  <span className="usg-crud-toggle-thumb" />
                </button>
              </div>
              <div className="usg-crud-form-actions">
                <button
                  type="button"
                  className="usg-crud-form-save"
                  onClick={handleSave}
                  disabled={!formName.trim() || saving}
                >
                  {saving ? <Loader2 className="usg-crud-icon-sm usg-crud-spin" /> : <Check className="usg-crud-icon-sm" />}
                  {saving ? 'Salvando...' : 'Salvar'}
                </button>
                <button
                  type="button"
                  className="usg-crud-form-cancel"
                  onClick={resetForm}
                  disabled={saving}
                >
                  <X className="usg-crud-icon-sm" />
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Table */}
        {loading && groups.length === 0 ? (
          <div className="usg-crud-loading">
            <Loader2 className="usg-crud-loading-icon usg-crud-spin" />
            <p>Carregando...</p>
          </div>
        ) : (
          <div className="usg-crud-table-card">
            <table className="usg-crud-table">
              <thead>
                <tr className="usg-crud-thead-row">
                  <th className="usg-crud-th table-col-id">ID</th>
                  <th className="usg-crud-th">Ativo</th>
                  <th className="usg-crud-th">Descrição</th>
                  <th className="usg-crud-th">Identificador Alternativo</th>
                  <th className="usg-crud-th-right">Ações</th>
                </tr>
              </thead>
              <tbody className="usg-crud-tbody">
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="usg-crud-empty">
                      {search ? 'Nenhum resultado encontrado.' : 'Nenhum tipo de usuário cadastrado.'}
                    </td>
                  </tr>
                ) : (
                  paginated.map(g => (
                    <tr key={g.usg_id} className="usg-crud-row">
                      <td className="usg-crud-cell table-cell-id">{g.usg_id}</td>
                      <td className="usg-crud-cell">
                        <span className={`usg-crud-status ${g.usg_active === 1 ? 'usg-crud-status--active' : 'usg-crud-status--inactive'}`}>
                          {g.usg_active === 1 ? 'Ativo' : 'Inativo'}
                        </span>
                      </td>
                      <td className="usg-crud-cell">{g.usg_description || '—'}</td>
                      <td className="usg-crud-cell">{g.usg_integrationid || '—'}</td>
                      <td className="usg-crud-cell-right">
                        <div className="usg-crud-actions">
                          <button
                            type="button"
                            className="usg-crud-action-edit"
                            onClick={() => handleOpenEdit(g)}
                            title="Editar"
                          >
                            <Edit2 className="usg-crud-icon-sm" />
                          </button>
                          <button
                            type="button"
                            className="usg-crud-action-delete"
                            onClick={() => handleDelete(g.usg_id)}
                            disabled={deletingId === g.usg_id}
                            title="Excluir"
                          >
                            {deletingId === g.usg_id
                              ? <Loader2 className="usg-crud-icon-sm usg-crud-spin" />
                              : <Trash2 className="usg-crud-icon-sm" />
                            }
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

        {/* Pagination */}
        {filtered.length > 0 && (
          <div className="usg-crud-pagination">
            <span className="usg-crud-pagination-info">
              Página {currentPage} de {totalPages}
            </span>
            <div className="usg-crud-pagination-buttons">
              <button
                type="button"
                className="usg-crud-pagination-btn"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Anterior
              </button>
              <button
                type="button"
                className="usg-crud-pagination-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Próxima
              </button>
            </div>
            <span className="usg-crud-pagination-total">
              Total de registros: {filtered.length}
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};
