import React, { useState, useEffect } from 'react';
import { roleService, type RoleAPI } from '../../services/roleService';
import { epiService, type EpiAPI } from '../../services/epiService';
import './MatrizForm.css';

interface MatrizFormProps {
  onClose: () => void;
  onSaved?: () => void;
  initialRole?: RoleAPI;
}

export const MatrizForm = ({ onClose, onSaved, initialRole }: MatrizFormProps) => {
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState<RoleAPI[]>([]);
  const [epis, setEpis] = useState<EpiAPI[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState(initialRole ? String(initialRole.rol_id) : '');
  const [selectedEpiIds, setSelectedEpiIds] = useState<number[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const [rolesData, episData] = await Promise.all([
          roleService.getActive(),
          epiService.getActive(),
        ]);
        setRoles(rolesData);
        setEpis(episData);

        if (initialRole) {
          const linked = await roleService.getEpis(initialRole.rol_id);
          setSelectedEpiIds(linked.map((e) => e.epi_id));
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
        const linked = await roleService.getEpis(Number(selectedRoleId));
        setSelectedEpiIds(linked.map((e) => e.epi_id));
      } catch (err) {
        console.error(err);
      }
    };
    loadLinked();
  }, [selectedRoleId, initialRole]);

  const toggleEpi = (epiId: number) => {
    setSelectedEpiIds((prev) =>
      prev.includes(epiId) ? prev.filter((id) => id !== epiId) : [...prev, epiId]
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
      await roleService.setEpis(
        rolId,
        selectedEpiIds.map((epi_id) => ({ epi_id, rle_mandatory: 1 }))
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
      <div className="matriz-form-fields">
        <div className="matriz-form-field">
          <label className="matriz-form-label">Função Selecionada</label>
          {initialRole ? (
            <div className="matriz-form-static-value">{roleName}
            </div>
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
          <label className="matriz-form-label">Vincular EPIs Obrigatórios</label>
          <div className="matriz-form-checkbox-grid custom-scrollbar">
            {epis.map((epi) => (
              <label key={epi.epi_id} className="matriz-form-checkbox-label">
                <input
                  type="checkbox"
                  className="matriz-form-checkbox"
                  checked={selectedEpiIds.includes(epi.epi_id)}
                  onChange={() => toggleEpi(epi.epi_id)}
                />
                <span className="matriz-form-checkbox-text">
                  <span className="matriz-form-checkbox-name">{epi.epi_description}</span>
                  <span className="matriz-form-checkbox-ca">CA: {epi.epi_ca}</span>
                </span>
              </label>
            ))}
          </div>
        </div>

        <div className="matriz-form-legal-note">
          <p className="matriz-form-legal-note-text">
            <strong>Nota Jurídica:</strong> Ao salvar esta matriz, o sistema passará a exigir a entrega destes EPIs para todos os colaboradores vinculados a esta função.
          </p>
        </div>
      </div>

      <div className="matriz-form-actions">
        <button type="button" onClick={onClose} className="matriz-form-cancel" disabled={saving}>
          Cancelar
        </button>
        <button type="submit" className="matriz-form-submit" disabled={saving}>
          {saving ? 'Salvando...' : initialRole ? 'Atualizar Matriz' : 'Salvar Matriz'}
        </button>
      </div>
    </form>
  );
};
