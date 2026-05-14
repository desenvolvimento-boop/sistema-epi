import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, RefreshCw, Check, X, Loader2, AlertTriangle } from 'lucide-react';
import { Modal } from '../ui/Modal';
import './SimpleCrudModal.css';

export interface SimpleCrudItem {
  id: number;
  name: string;
  description: string | null;
  active: boolean;
}

interface SimpleCrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  entityLabel: string;
  items: SimpleCrudItem[];
  onItemsChange: (items: SimpleCrudItem[]) => void;
  onItemCreated?: (item: SimpleCrudItem) => void;
}

export const SimpleCrudModal = ({
  isOpen,
  onClose,
  title,
  entityLabel,
  items,
  onItemsChange,
  onItemCreated,
}: SimpleCrudModalProps) => {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<SimpleCrudItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formActive, setFormActive] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  useEffect(() => {
    if (isOpen) {
      setShowForm(false);
      setEditingItem(null);
      setSearch('');
      setCurrentPage(1);
    }
  }, [isOpen]);

  const filtered = items.filter(item => {
    if (!search.trim()) return true;
    const term = search.toLowerCase();
    return (
      item.name.toLowerCase().includes(term) ||
      (item.description || '').toLowerCase().includes(term)
    );
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const paginated = filtered.slice((currentPage - 1) * perPage, currentPage * perPage);

  const resetForm = () => {
    setFormName('');
    setFormDesc('');
    setFormActive(true);
    setEditingItem(null);
    setShowForm(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleOpenEdit = (item: SimpleCrudItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDesc(item.description || '');
    setFormActive(item.active);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!formName.trim()) return;

    if (editingItem) {
      const updated = items.map(i =>
        i.id === editingItem.id
          ? { ...i, name: formName.trim(), description: formDesc.trim() || null, active: formActive }
          : i
      );
      onItemsChange(updated);
    } else {
      const newId = items.length > 0 ? Math.max(...items.map(i => i.id)) + 1 : 1;
      const newItem: SimpleCrudItem = {
        id: newId,
        name: formName.trim(),
        description: formDesc.trim() || null,
        active: formActive,
      };
      onItemsChange([...items, newItem]);
      onItemCreated?.(newItem);
    }
    resetForm();
  };

  const handleDelete = (id: number) => {
    onItemsChange(items.filter(i => i.id !== id));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div className="scrud">
        <div className="scrud-toolbar">
          <div className="scrud-search-wrapper">
            <Search className="scrud-search-icon" />
            <input
              type="text"
              placeholder="Pesquisar"
              className="scrud-search-input"
              value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="scrud-toolbar-actions">
            <button
              type="button"
              className="scrud-toolbar-btn scrud-toolbar-btn--primary"
              onClick={handleOpenAdd}
              title={`Adicionar ${entityLabel}`}
            >
              <Plus className="scrud-icon-sm" />
            </button>
          </div>
        </div>

        {showForm && (
          <div className="scrud-form-card">
            <div className="scrud-form-title">
              {editingItem ? `Editar ${entityLabel}` : `Nov${entityLabel.endsWith('a') ? 'a' : 'o'} ${entityLabel}`}
            </div>
            <div className="scrud-form-grid">
              <div className="scrud-form-field">
                <label className="scrud-form-label">Nome <span className="scrud-form-required">*</span></label>
                <input
                  type="text"
                  className="scrud-form-input"
                  placeholder={`Nome d${entityLabel.endsWith('a') ? 'a' : 'o'} ${entityLabel.toLowerCase()}`}
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  autoFocus
                />
              </div>
              <div className="scrud-form-field">
                <label className="scrud-form-label">Descrição</label>
                <input
                  type="text"
                  className="scrud-form-input"
                  placeholder="Descrição"
                  value={formDesc}
                  onChange={e => setFormDesc(e.target.value)}
                />
              </div>
            </div>
            <div className="scrud-form-footer">
              <div className="scrud-form-toggle-row">
                <span className="scrud-form-toggle-label">Ativo</span>
                <button
                  type="button"
                  className={`scrud-toggle ${formActive ? 'scrud-toggle--active' : ''}`}
                  onClick={() => setFormActive(!formActive)}
                >
                  <span className="scrud-toggle-thumb" />
                </button>
              </div>
              <div className="scrud-form-actions">
                <button
                  type="button"
                  className="scrud-form-save"
                  onClick={handleSave}
                  disabled={!formName.trim()}
                >
                  <Check className="scrud-icon-sm" />
                  Salvar
                </button>
                <button
                  type="button"
                  className="scrud-form-cancel"
                  onClick={resetForm}
                >
                  <X className="scrud-icon-sm" />
                  Cancelar
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="scrud-table-card">
          <table className="scrud-table">
            <thead>
              <tr className="scrud-thead-row">
                <th className="scrud-th">Ativo</th>
                <th className="scrud-th">Nome</th>
                <th className="scrud-th">Descrição</th>
                <th className="scrud-th-right">Ações</th>
              </tr>
            </thead>
            <tbody className="scrud-tbody">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={4} className="scrud-empty">
                    {search ? 'Nenhum resultado encontrado.' : `Nenhum${entityLabel.endsWith('a') ? 'a' : ''} ${entityLabel.toLowerCase()} cadastrad${entityLabel.endsWith('a') ? 'a' : 'o'}.`}
                  </td>
                </tr>
              ) : (
                paginated.map(item => (
                  <tr key={item.id} className="scrud-row">
                    <td className="scrud-cell">
                      <span className={`scrud-status ${item.active ? 'scrud-status--active' : 'scrud-status--inactive'}`}>
                        {item.active ? 'Ativo' : 'Inativo'}
                      </span>
                    </td>
                    <td className="scrud-cell">{item.name}</td>
                    <td className="scrud-cell">{item.description || '—'}</td>
                    <td className="scrud-cell-right">
                      <div className="scrud-actions">
                        <button
                          type="button"
                          className="scrud-action-edit"
                          onClick={() => handleOpenEdit(item)}
                          title="Editar"
                        >
                          <Edit2 className="scrud-icon-sm" />
                        </button>
                        <button
                          type="button"
                          className="scrud-action-delete"
                          onClick={() => handleDelete(item.id)}
                          title="Excluir"
                        >
                          <Trash2 className="scrud-icon-sm" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > perPage && (
          <div className="scrud-pagination">
            <span className="scrud-pagination-info">
              Página {currentPage} de {totalPages}
            </span>
            <div className="scrud-pagination-buttons">
              <button
                type="button"
                className="scrud-pagination-btn"
                disabled={currentPage <= 1}
                onClick={() => setCurrentPage(p => p - 1)}
              >
                Anterior
              </button>
              <button
                type="button"
                className="scrud-pagination-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage(p => p + 1)}
              >
                Próxima
              </button>
            </div>
            <span className="scrud-pagination-total">
              Total: {filtered.length}
            </span>
          </div>
        )}
      </div>
    </Modal>
  );
};
