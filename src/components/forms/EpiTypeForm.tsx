import React, { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import { epiTypeService, type EpiTypeAPI } from '../../services/epiTypeService';
import { epiCategoryService, type EpiCategoryAPI } from '../../services/epiCategoryService';
import { validateEpiTypeUniqueness, validateEpiCategoryUniqueness } from '../../utils/uniqueness';
import { SimpleCrudModal, type SimpleCrudItem } from './SimpleCrudModal';
import './EPIForm.css';

interface EpiTypeFormProps {
  onClose: () => void;
  onSaved?: () => void;
  initialData?: EpiTypeAPI;
  existingTypes?: EpiTypeAPI[];
}

function mapCategoriesToCrud(types: EpiCategoryAPI[]): SimpleCrudItem[] {
  return types.map((c) => ({
    id: c.eca_id,
    name: c.eca_description,
    description: c.eca_code,
    active: c.eca_active === 1,
  }));
}

function getDefaultCategoryId(items: SimpleCrudItem[]): number | '' {
  const first = items.find((t) => t.active);
  return first?.id ?? '';
}

export const EpiTypeForm = ({ onClose, onSaved, initialData, existingTypes }: EpiTypeFormProps) => {
  const [saving, setSaving] = useState(false);
  const [categories, setCategories] = useState<SimpleCrudItem[]>([]);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [description, setDescription] = useState(initialData?.ept_description || '');
  const [ecaId, setEcaId] = useState<number | ''>(initialData?.eca_id ?? '');
  const [lifespanDays, setLifespanDays] = useState(initialData?.ept_lifespan_days ?? 180);
  const [active, setActive] = useState(initialData ? initialData.ept_active === 1 : true);

  const reloadCategories = useCallback(async () => {
    try {
      const data = await epiCategoryService.getAll();
      const mapped = mapCategoriesToCrud(data);
      setCategories(mapped);
      setEcaId((current) => {
        if (initialData?.eca_id && mapped.some((c) => c.id === initialData.eca_id)) {
          return initialData.eca_id;
        }
        if (current && mapped.some((c) => c.active && c.id === current)) return current;
        return getDefaultCategoryId(mapped);
      });
    } catch (err) {
      console.error(err);
    }
  }, [initialData?.eca_id]);

  useEffect(() => {
    reloadCategories();
  }, [reloadCategories]);

  const activeCategories = categories.filter((c) => c.active);

  const handleCategoriesChange = async (items: SimpleCrudItem[]) => {
    const prevMap = new Map(categories.map((c) => [c.id, c]));

    for (const prev of categories) {
      if (!items.find((i) => i.id === prev.id)) {
        await epiCategoryService.delete(prev.id);
      }
    }

    for (const item of items) {
      const prev = prevMap.get(item.id);
      if (!prev) continue;
      if (
        prev.name !== item.name ||
        prev.description !== item.description ||
        prev.active !== item.active
      ) {
        await epiCategoryService.update(item.id, {
          eca_active: item.active ? 1 : 0,
          eca_description: item.name,
          eca_code: item.description,
          usr_id_lastupdate: null,
        });
      }
    }

    await reloadCategories();
  };

  const handleCategoryCreated = async (item: SimpleCrudItem) => {
    const duplicateMsg = validateEpiCategoryUniqueness(
      categories,
      item.name,
      item.description || '',
    );
    if (duplicateMsg) {
      alert(duplicateMsg);
      return;
    }
    try {
      const created = await epiCategoryService.create({
        eca_active: item.active ? 1 : 0,
        eca_description: item.name,
        eca_code: item.description,
        usr_id_insert: null,
        usr_id_lastupdate: null,
      });
      setEcaId(created.eca_id);
      await reloadCategories();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao criar categoria');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) {
      alert('Preencha o nome do tipo de EPI.');
      return;
    }
    if (!ecaId) {
      alert('Selecione uma categoria.');
      return;
    }
    const days = Number(lifespanDays);
    if (!Number.isFinite(days) || days < 1) {
      alert('Informe a vida útil em dias (mínimo 1).');
      return;
    }

    try {
      const typesForCheck = existingTypes ?? await epiTypeService.getAll();
      const duplicateMsg = validateEpiTypeUniqueness(
        typesForCheck,
        description,
        initialData?.ept_id,
      );
      if (duplicateMsg) {
        alert(duplicateMsg);
        return;
      }
    } catch {
      /* segue para API */
    }

    setSaving(true);
    try {
      const payload = {
        ept_active: active ? 1 : 0,
        ept_description: description.trim(),
        eca_id: Number(ecaId),
        ept_lifespan_days: days,
        usr_id_insert: null,
        usr_id_lastupdate: null,
      };

      if (initialData) {
        await epiTypeService.update(initialData.ept_id, payload);
      } else {
        await epiTypeService.create(payload);
      }
      onSaved?.();
      onClose();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar tipo de EPI');
    } finally {
      setSaving(false);
    }
  };

  return (
    <form className="epi-form" onSubmit={handleSubmit}>
      <div className="epi-form-grid">
        <div className="epi-form-field">
          <label className="epi-form-label">Tipo de EPI <span className="epi-form-required">*</span></label>
          <input
            type="text"
            placeholder="Ex: Bota PVC"
            className="epi-form-input"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div className="epi-form-field">
          <label className="epi-form-label">Categoria <span className="epi-form-required">*</span></label>
          <div className="epi-form-select-with-action">
            <select
              className="epi-form-input"
              value={ecaId}
              onChange={(e) => setEcaId(e.target.value ? Number(e.target.value) : '')}
              required
              disabled={activeCategories.length === 0}
            >
              {activeCategories.length === 0 ? (
                <option value="">Cadastre uma categoria</option>
              ) : (
                activeCategories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))
              )}
            </select>
            <button
              type="button"
              className="epi-form-add-btn"
              onClick={() => setIsCategoryModalOpen(true)}
              title="Cadastrar categoria"
            >
              <Plus className="epi-form-add-icon" />
            </button>
          </div>
          <SimpleCrudModal
            isOpen={isCategoryModalOpen}
            onClose={() => {
              setIsCategoryModalOpen(false);
              reloadCategories();
            }}
            title="Cadastrar Categoria"
            entityLabel="Categoria"
            items={categories}
            onItemsChange={handleCategoriesChange}
            onItemCreated={handleCategoryCreated}
          />
        </div>
        <div className="epi-form-field">
          <label className="epi-form-label">
            Vida Útil (dias) <span className="epi-form-required">*</span>
          </label>
          <input
            type="number"
            min={1}
            placeholder="Ex: 180"
            className="epi-form-input"
            value={lifespanDays}
            onChange={(e) => setLifespanDays(Number(e.target.value))}
            required
          />
        </div>
        <div className="epi-form-field">
          <label className="epi-form-label">Status</label>
          <select className="epi-form-input" value={active ? '1' : '0'} onChange={(e) => setActive(e.target.value === '1')}>
            <option value="1">Ativo</option>
            <option value="0">Inativo</option>
          </select>
        </div>
      </div>
      <div className="epi-form-actions">
        <button type="button" onClick={onClose} className="epi-form-cancel" disabled={saving}>
          Cancelar
        </button>
        <button type="submit" className="epi-form-submit" disabled={saving}>
          {saving ? 'Salvando...' : initialData ? 'Salvar Alterações' : 'Salvar Tipo'}
        </button>
      </div>
    </form>
  );
};
