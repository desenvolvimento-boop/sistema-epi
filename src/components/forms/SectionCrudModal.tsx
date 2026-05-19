import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit2, Trash2, Search, Check, X, Loader2 } from 'lucide-react';
import { Modal } from '../ui/Modal';
import { epiTypeService, type EpiTypeAPI } from '../../services/epiTypeService';
import { sectionService } from '../../services/sectionService';
import type { SimpleCrudItem } from './SimpleCrudModal';
import { useNomenclature } from '../../hooks/useNomenclature';
import { NOMENCLATURE_KEYS } from '../../config/nomenclatureKeys';
import './SimpleCrudModal.css';

interface SectionCrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  items: SimpleCrudItem[];
  onItemsChange: (items: SimpleCrudItem[]) => void;
  onItemCreated?: (item: SimpleCrudItem, eptIds: number[]) => void | Promise<void>;
  onItemUpdated?: (item: SimpleCrudItem, eptIds: number[]) => void | Promise<void>;
}

export const SectionCrudModal = ({
  isOpen,
  onClose,
  title,
  items,
  onItemsChange,
  onItemCreated,
  onItemUpdated,
}: SectionCrudModalProps) => {
  const { t } = useNomenclature();
  const sectionLabel = t(NOMENCLATURE_KEYS.entity.section_singular);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<SimpleCrudItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formActive, setFormActive] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadingEpis, setLoadingEpis] = useState(false);

  const [episCatalog, setEpisCatalog] = useState<EpiTypeAPI[]>([]);
  const [selectedEptIds, setSelectedEptIds] = useState<number[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const perPage = 10;

  const loadCatalog = useCallback(async () => {
    try {
      const catalog = await epiTypeService.getActive();
      setEpisCatalog(catalog);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setShowForm(false);
      setEditingItem(null);
      setSearch('');
      setCurrentPage(1);
      setSelectedEptIds([]);
      loadCatalog();
    }
  }, [isOpen, loadCatalog]);

  const filtered = items.filter((item) => {
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
    setSelectedEptIds([]);
    setEditingItem(null);
    setShowForm(false);
  };

  const handleOpenAdd = () => {
    resetForm();
    setShowForm(true);
  };

  const handleOpenEdit = async (item: SimpleCrudItem) => {
    setEditingItem(item);
    setFormName(item.name);
    setFormDesc(item.description || '');
    setFormActive(item.active);
    setSelectedEptIds([]);
    setShowForm(true);

    setLoadingEpis(true);
    try {
      const linked = await sectionService.getEpiTypes(item.id);
      setSelectedEptIds(linked.map((e) => e.ept_id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingEpis(false);
    }
  };

  const toggleEpt = (eptId: number) => {
    setSelectedEptIds((prev) =>
      prev.includes(eptId) ? prev.filter((id) => id !== eptId) : [...prev, eptId]
    );
  };

  const handleSave = async () => {
    if (!formName.trim() || saving) return;

    const payload: SimpleCrudItem = {
      id: editingItem?.id ?? (items.length > 0 ? Math.max(...items.map((i) => i.id)) + 1 : 1),
      name: formName.trim(),
      description: formDesc.trim() || null,
      active: formActive,
    };

    setSaving(true);
    try {
      if (editingItem) {
        const updated = items.map((i) => (i.id === editingItem.id ? payload : i));
        onItemsChange(updated);
        await onItemUpdated?.(payload, selectedEptIds);
      } else {
        onItemsChange([...items, payload]);
        await onItemCreated?.(payload, selectedEptIds);
      }
      resetForm();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar setor');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id: number) => {
    onItemsChange(items.filter((i) => i.id !== id));
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
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            />
          </div>
          <div className="scrud-toolbar-actions">
            <button
              type="button"
              className="scrud-toolbar-btn scrud-toolbar-btn--primary"
              onClick={handleOpenAdd}
              title="Adicionar setor"
            >
              <Plus className="scrud-icon-sm" />
            </button>
          </div>
        </div>

        {showForm && (
          <div className="scrud-form-card">
            <div className="scrud-form-title">
              {editingItem ? `${t(NOMENCLATURE_KEYS.action.edit)} ${sectionLabel}` : `${t(NOMENCLATURE_KEYS.action.new)} ${sectionLabel}`}
            </div>
            <div className="scrud-form-grid">
              <div className="scrud-form-field">
                <label className="scrud-form-label">Nome <span className="scrud-form-required">*</span></label>
                <input
                  type="text"
                  className="scrud-form-input"
                  placeholder="Nome do setor"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
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
                  onChange={(e) => setFormDesc(e.target.value)}
                />
              </div>
              <div className="scrud-form-field scrud-form-field--full">
                <label className="scrud-form-label">EPIs do {t(NOMENCLATURE_KEYS.entity.section_compound)}</label>
                {loadingEpis ? (
                  <p className="scrud-epis-loading">
                    <Loader2 className="scrud-icon-sm scrud-spin" />
                    Carregando EPIs...
                  </p>
                ) : (
                  <div className="scrud-epi-grid custom-scrollbar">
                    {episCatalog.length === 0 ? (
                      <p className="scrud-epis-empty">Cadastre EPIs no catálogo primeiro.</p>
                    ) : (
                      episCatalog.map((epi) => (
                        <label key={epi.ept_id} className="scrud-epi-label">
                          <input
                            type="checkbox"
                            className="scrud-epi-checkbox"
                            checked={selectedEptIds.includes(epi.ept_id)}
                            onChange={() => toggleEpt(epi.ept_id)}
                          />
                          <span>
                            {epi.ept_description}
                            <small> · {epi.ept_category}</small>
                          </span>
                        </label>
                      ))
                    )}
                  </div>
                )}
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
                  disabled={!formName.trim() || saving}
                >
                  {saving ? (
                    <Loader2 className="scrud-icon-sm scrud-spin" />
                  ) : (
                    <Check className="scrud-icon-sm" />
                  )}
                  Salvar
                </button>
                <button
                  type="button"
                  className="scrud-form-cancel"
                  onClick={resetForm}
                  disabled={saving}
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
                <th className="scrud-th table-col-id">ID</th>
                <th className="scrud-th">Ativo</th>
                <th className="scrud-th">Nome</th>
                <th className="scrud-th">Descrição</th>
                <th className="scrud-th-right">Ações</th>
              </tr>
            </thead>
            <tbody className="scrud-tbody">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="scrud-empty">
                    {search ? 'Nenhum resultado encontrado.' : 'Nenhum setor cadastrado.'}
                  </td>
                </tr>
              ) : (
                paginated.map((item) => (
                  <tr key={item.id} className="scrud-row">
                    <td className="scrud-cell table-cell-id">{item.id}</td>
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
                onClick={() => setCurrentPage((p) => p - 1)}
              >
                Anterior
              </button>
              <button
                type="button"
                className="scrud-pagination-btn"
                disabled={currentPage >= totalPages}
                onClick={() => setCurrentPage((p) => p + 1)}
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
