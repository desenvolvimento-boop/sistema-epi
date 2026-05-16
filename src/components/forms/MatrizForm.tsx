import React, { useState, useEffect } from 'react';
import { roleService, type RoleAPI } from '../../services/roleService';
import { epiTypeService, type EpiTypeAPI } from '../../services/epiTypeService';
import './MatrizForm.css';

interface MatrizFormProps {
  onClose: () => void;
  onSaved?: () => void;
  initialRole?: RoleAPI;
}

export const MatrizForm = ({ onClose, onSaved, initialRole }: MatrizFormProps) => {
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState<RoleAPI[]>([]);
  const [epiTypes, setEpiTypes] = useState<EpiTypeAPI[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState(initialRole ? String(initialRole.rol_id) : '');
  const [selectedEptIds, setSelectedEptIds] = useState<number[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [rolesData, typesData] = await Promise.all([
          roleService.getActive(),
          epiTypeService.getActive(),
        ]);
        setRoles(rolesData);
        setEpiTypes(typesData);

        if (initialRole) {
          const linked = await roleService.getEpiTypes(initialRole.rol_id);
          setSelectedEptIds(linked.map((e) => e.ept_id));
        }
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, [initialRole]);

  useEffect(() => {
    if (!selectedRoleId || initialRole) return;
    const loadLinked = async () => {
      try {
        const linked = await roleService.getEpiTypes(Number(selectedRoleId));
        setSelectedEptIds(linked.map((e) => e.ept_id));
      } catch (err) {
        console.error(err);
      }
    };
    loadLinked();
  }, [selectedRoleId, initialRole]);

  const toggleEpt = (eptId: number) => {
    setSelectedEptIds((prev) =>
      prev.includes(eptId) ? prev.filter((id) => id !== eptId) : [...prev, eptId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const rolId = initialRole?.rol_id ?? Number(selectedRoleId);
    if (!rolId) {
      alert('Selecione uma função.');
      return;
    }

    setSaving(true);
    try {
      await roleService.setEpiTypes(
        rolId,
        selectedEptIds.map((ept_id) => ({ ept_id, rle_mandatory: 1 }))
      );
      onSaved?.();
      onClose();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar matriz');
    } finally {
      setSaving(false);
    }
  };

  const roleName = initialRole?.rol_description
    ?? roles.find((r) => r.rol_id === Number(selectedRoleId))?.rol_description;

  return (
    <form className="matriz-form" onSubmit={handleSubmit}>
      <section className="matriz-form-fields">
        <div className="matriz-form-field">
          <label className="matriz-form-label">Função Selecionada</label>
          {initialRole ? (
            <div className="matriz-form-static-value">{roleName}</div>
          ) : (
            <select
              className="matriz-form-input"
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              required
            >
              <option value="">Selecione uma função</option>
              {roles.map((r) => (
                <option key={r.rol_id} value={r.rol_id}>{r.rol_description}</option>
              ))}
            </select>
          )}
        </div>

        <div className="matriz-form-field">
          <label className="matriz-form-label">Vincular Tipos de EPI Obrigatórios</label>
          <div className="matriz-form-checkbox-grid custom-scrollbar">
            {epiTypes.map((epi) => (
              <label key={epi.ept_id} className="matriz-form-checkbox-label">
                <input
                  type="checkbox"
                  className="matriz-form-checkbox"
                  checked={selectedEptIds.includes(epi.ept_id)}
                  onChange={() => toggleEpt(epi.ept_id)}
                />
                <span className="matriz-form-checkbox-text">
                  <span className="matriz-form-checkbox-name">{epi.ept_description}</span>
                  <span className="matriz-form-checkbox-ca">{epi.ept_category}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="matriz-form-legal-note">
          <p className="matriz-form-legal-note-text">
            <strong>Nota Jurídica:</strong> Ao salvar esta matriz, o sistema passará a exigir a entrega destes tipos de EPI para todos os colaboradores vinculados a esta função.
          </p>
        </div>
      </section>

      <footer className="matriz-form-actions">
        <button type="button" onClick={onClose} className="matriz-form-cancel" disabled={saving}>
          Cancelar
        </button>
        <button type="submit" className="matriz-form-submit" disabled={saving}>
          {saving ? 'Salvando...' : initialRole ? 'Atualizar Matriz' : 'Salvar Matriz'}
        </button>
      </footer>
    </form>
  );
};
