import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, X, Loader2, Plus } from 'lucide-react';
import { SimpleCrudModal, type SimpleCrudItem } from './SimpleCrudModal';
import { roleService, type RoleAPI } from '../../services/roleService';
import { sectionService, type SectionAPI } from '../../services/sectionService';
import { employerService, type EmployerAPI } from '../../services/employerService';
import { employeeService, type EmployeeAPI } from '../../services/employeeService';
import { useNomenclature } from '../../hooks/useNomenclature';
import { NOMENCLATURE_KEYS } from '../../config/nomenclatureKeys';
import './ColaboradorForm.css';

interface ColaboradorFormProps {
  onClose: () => void;
  onSaved?: () => void;
  initialData?: EmployeeAPI;
}

function mapRolesToCrud(roles: RoleAPI[]): SimpleCrudItem[] {
  return roles.map(r => ({
    id: r.rol_id,
    name: r.rol_description,
    description: r.rol_activities || r.rol_integration_id,
    active: r.rol_active === 1,
  }));
}

function mapSectionsToCrud(sections: SectionAPI[]): SimpleCrudItem[] {
  return sections.map(s => ({
    id: s.sec_id,
    name: s.sec_description,
    description: s.sec_integration_id,
    active: s.sec_active === 1,
  }));
}

function mapEmployersToCrud(employers: EmployerAPI[]): SimpleCrudItem[] {
  return employers.map((e) => ({
    id: e.emr_id,
    name: e.emr_name || e.com_description || '',
    description: e.emr_trade_name || e.emr_tax_id || null,
    active: e.emr_active === 1,
  }));
}

function getDefaultEmployerId(items: SimpleCrudItem[]): string {
  const first = items.find((e) => e.active);
  return first ? String(first.id) : '';
}

export const ColaboradorForm = ({ onClose, onSaved, initialData }: ColaboradorFormProps) => {
  const { t } = useNomenclature();
  const isEditing = !!initialData;
  const [saving, setSaving] = useState(false);

  const [ativo, setAtivo] = useState(initialData ? initialData.emp_active === 1 : true);
  const [nomeCompleto, setNomeCompleto] = useState(initialData?.emp_full_name || '');
  const [cpf, setCpf] = useState(initialData?.emp_cpf || '');
  const [matricula, setMatricula] = useState(initialData?.emp_registration || '');
  const [dataAdmissao, setDataAdmissao] = useState(initialData?.emp_admission_date || '');
  const [status, setStatus] = useState(initialData ? String(initialData.emp_status) : '1');

  const [funcoes, setFuncoes] = useState<SimpleCrudItem[]>([]);
  const [selectedFuncao, setSelectedFuncao] = useState(initialData ? String(initialData.rol_id) : '');

  const [setores, setSetores] = useState<SimpleCrudItem[]>([]);
  const [selectedSetor, setSelectedSetor] = useState(initialData ? String(initialData.sec_id) : '');

  const [empresas, setEmpresas] = useState<SimpleCrudItem[]>([]);
  const [isEmployerModalOpen, setIsEmployerModalOpen] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState(initialData ? String(initialData.com_id) : '');

  const [fotoPreview, setFotoPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const reloadEmployers = useCallback(async () => {
    try {
      const data = await employerService.getAll();
      const mapped = mapEmployersToCrud(data);
      setEmpresas(mapped);
      setSelectedEmpresa((current) => {
        if (initialData?.com_id && mapped.some((e) => e.id === initialData.com_id)) {
          return String(initialData.com_id);
        }
        if (current && mapped.some((e) => e.active && String(e.id) === current)) return current;
        return getDefaultEmployerId(mapped);
      });
    } catch (err) {
      console.error('Erro ao carregar empresas:', err);
    }
  }, [initialData?.com_id]);

  const loadLookups = useCallback(async () => {
    try {
      const [roles, sections] = await Promise.all([
        roleService.getAll(),
        sectionService.getAll(),
      ]);
      setFuncoes(mapRolesToCrud(roles));
      setSetores(mapSectionsToCrud(sections));
      await reloadEmployers();
    } catch (err) {
      console.error('Erro ao carregar dados auxiliares:', err);
    }
  }, [reloadEmployers]);

  useEffect(() => {
    loadLookups();
  }, [loadLookups]);

  const activeEmpresas = empresas.filter((e) => e.active);

  const handleEmployersChange = async (items: SimpleCrudItem[]) => {
    const prevMap = new Map(empresas.map((e) => [e.id, e]));

    for (const prev of empresas) {
      if (!items.find((i) => i.id === prev.id)) {
        await employerService.delete(prev.id);
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
        await employerService.update(item.id, {
          emr_active: item.active ? 1 : 0,
          emr_name: item.name,
          emr_trade_name: item.description,
        });
      }
    }

    await reloadEmployers();
  };

  const handleEmployerCreated = async (item: SimpleCrudItem) => {
    try {
      const created = await employerService.create({
        emr_active: item.active ? 1 : 0,
        emr_name: item.name,
        emr_trade_name: item.description,
      });
      setSelectedEmpresa(String(created.emr_id));
      await reloadEmployers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao criar empresa');
    }
  };

  const handleFotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setFotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const removeFoto = () => {
    setFotoPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nomeCompleto.trim() || !cpf.trim() || !matricula.trim() || !dataAdmissao || !selectedFuncao || !selectedSetor || !selectedEmpresa) {
      alert('Preencha todos os campos obrigatórios.');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        emp_active: ativo ? 1 : 0,
        emp_full_name: nomeCompleto.trim(),
        emp_cpf: cpf.trim(),
        emp_registration: matricula.trim(),
        emp_admission_date: dataAdmissao,
        rol_id: Number(selectedFuncao),
        sec_id: Number(selectedSetor),
        com_id: Number(selectedEmpresa),
        emp_status: Number(status),
        emp_photo: null as string | null,
        usr_id_insert: null as number | null,
        usr_id_lastupdate: null as number | null,
      };

      if (isEditing && initialData) {
        await employeeService.update(initialData.emp_id, payload);
      } else {
        await employeeService.create(payload);
      }

      onSaved?.();
      onClose();
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar colaborador');
    } finally {
      setSaving(false);
    }
  };

  const activeFuncoes = funcoes.filter(f => f.active);
  const activeSetores = setores.filter(s => s.active);
  return (
    <form className="colaborador-form" onSubmit={handleSubmit}>
      <div className="colaborador-form-toggle-row">
        <span className="colaborador-form-toggle-label">Ativo</span>
        <button
          type="button"
          className={`colaborador-form-toggle ${ativo ? 'colaborador-form-toggle--active' : ''}`}
          onClick={() => setAtivo(!ativo)}
          aria-label="Toggle ativo"
        >
          <span className="colaborador-form-toggle-thumb" />
        </button>
      </div>

      <div className="colaborador-form-grid">
        <div className="colaborador-form-field">
          <label className="colaborador-form-label">Nome Completo <span className="colaborador-form-required">*</span></label>
          <input
            type="text"
            placeholder="Ex: João Silva"
            className="colaborador-form-input"
            value={nomeCompleto}
            onChange={(e) => setNomeCompleto(e.target.value)}
            required
          />
        </div>
        <div className="colaborador-form-field">
          <label className="colaborador-form-label">CPF <span className="colaborador-form-required">*</span></label>
          <input
            type="text"
            placeholder="000.000.000-00"
            className="colaborador-form-input"
            value={cpf}
            onChange={(e) => setCpf(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="colaborador-form-grid">
        <div className="colaborador-form-field">
          <label className="colaborador-form-label">Matrícula <span className="colaborador-form-required">*</span></label>
          <input
            type="text"
            placeholder="Ex: 12345"
            className="colaborador-form-input"
            value={matricula}
            onChange={(e) => setMatricula(e.target.value)}
            required
          />
        </div>
        <div className="colaborador-form-field">
          <label className="colaborador-form-label">Data de Admissão <span className="colaborador-form-required">*</span></label>
          <input
            type="date"
            className="colaborador-form-input"
            value={dataAdmissao}
            onChange={(e) => setDataAdmissao(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="colaborador-form-grid">
        <div className="colaborador-form-field">
          <label className="colaborador-form-label">Função <span className="colaborador-form-required">*</span></label>
          <select
            className="colaborador-form-input"
            value={selectedFuncao}
            onChange={(e) => setSelectedFuncao(e.target.value)}
            required
          >
            <option value="" disabled>Selecione uma função</option>
            {activeFuncoes.map(f => (
              <option key={f.id} value={String(f.id)}>{f.name}</option>
            ))}
          </select>
        </div>

        <div className="colaborador-form-field">
          <label className="colaborador-form-label">{t(NOMENCLATURE_KEYS.entity.section_compound)} <span className="colaborador-form-required">*</span></label>
          <select
            className="colaborador-form-input"
            value={selectedSetor}
            onChange={(e) => setSelectedSetor(e.target.value)}
            required
          >
            <option value="" disabled>Selecione o {t(NOMENCLATURE_KEYS.entity.section_singular).toLowerCase()}</option>
            {activeSetores.map(s => (
              <option key={s.id} value={String(s.id)}>{s.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="colaborador-form-grid">
        <div className="colaborador-form-field">
          <label className="colaborador-form-label">Empresa <span className="colaborador-form-required">*</span></label>
          <div className="colaborador-form-select-with-action">
            <select
              className="colaborador-form-input"
              value={selectedEmpresa}
              onChange={(e) => setSelectedEmpresa(e.target.value)}
              required
              disabled={activeEmpresas.length === 0}
            >
              {activeEmpresas.length === 0 ? (
                <option value="">Cadastre uma empresa</option>
              ) : (
                activeEmpresas.map((emp) => (
                  <option key={emp.id} value={String(emp.id)}>
                    {emp.description ? `${emp.name} (${emp.description})` : emp.name}
                  </option>
                ))
              )}
            </select>
            <button
              type="button"
              className="colaborador-form-add-btn"
              onClick={() => setIsEmployerModalOpen(true)}
              title="Cadastrar empresa"
            >
              <Plus className="colaborador-form-add-icon" />
            </button>
          </div>
          <SimpleCrudModal
            isOpen={isEmployerModalOpen}
            onClose={() => {
              setIsEmployerModalOpen(false);
              reloadEmployers();
            }}
            title="Cadastrar Empresa"
            entityLabel="Empresa"
            items={empresas}
            onItemsChange={handleEmployersChange}
            onItemCreated={handleEmployerCreated}
          />
        </div>

        <div className="colaborador-form-field">
          <label className="colaborador-form-label">Status</label>
          <select
            className="colaborador-form-input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="1">Ativo</option>
            <option value="0">Inativo</option>
          </select>
        </div>
      </div>

      <div className="colaborador-form-field">
        <label className="colaborador-form-label">Foto do Colaborador</label>
        <div className="colaborador-form-foto-area">
          {fotoPreview ? (
            <div className="colaborador-form-foto-preview">
              <img src={fotoPreview} alt="Preview" className="colaborador-form-foto-img" />
              <button
                type="button"
                className="colaborador-form-foto-remove"
                onClick={removeFoto}
                title="Remover foto"
              >
                <X className="colaborador-form-foto-remove-icon" />
              </button>
            </div>
          ) : (
            <button
              type="button"
              className="colaborador-form-foto-upload"
              onClick={() => fileInputRef.current?.click()}
            >
              <Camera className="colaborador-form-foto-upload-icon" />
              <span className="colaborador-form-foto-upload-text">Selecionar foto</span>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="colaborador-form-foto-input"
            onChange={handleFotoChange}
          />
        </div>
      </div>

      <div className="colaborador-form-actions">
        <button
          type="button"
          onClick={onClose}
          className="colaborador-form-cancel"
          disabled={saving}
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="colaborador-form-submit"
          disabled={saving}
        >
          {saving ? (
            <>
              <Loader2 className="colaborador-form-submit-icon colaborador-form-spin" />
              Salvando...
            </>
          ) : (
            isEditing ? 'Salvar Alterações' : 'Salvar Colaborador'
          )}
        </button>
      </div>
    </form>
  );
};
