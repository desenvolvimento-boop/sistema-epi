import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Briefcase, Loader2, Plus } from 'lucide-react';
import { SimpleCrudModal, type SimpleCrudItem } from '../../components/forms/SimpleCrudModal';
import { employeeService, type EmployeeAPI } from '../../services/employeeService';
import { validateEmployeeUniqueness } from '../../utils/uniqueness';
import { roleService, type RoleAPI } from '../../services/roleService';
import { sectionService, type SectionAPI } from '../../services/sectionService';
import { employerService, type EmployerAPI } from '../../services/employerService';
import './styles.css';

function mapEmployersToCrud(employers: EmployerAPI[]): SimpleCrudItem[] {
  return employers.map((e) => ({
    id: e.emr_id,
    name: e.emr_name || e.com_description || '',
    description: e.emr_trade_name || e.emr_tax_id || null,
    active: e.emr_active === 1,
  }));
}

const ColaboradorEditar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [employee, setEmployee] = useState<EmployeeAPI | null>(null);

  const [roles, setRoles] = useState<RoleAPI[]>([]);
  const [sections, setSections] = useState<SectionAPI[]>([]);
  const [empresas, setEmpresas] = useState<SimpleCrudItem[]>([]);
  const [isEmployerModalOpen, setIsEmployerModalOpen] = useState(false);

  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpfValue, setCpfValue] = useState('');
  const [matricula, setMatricula] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState('');
  const [rolId, setRolId] = useState('');
  const [secId, setSecId] = useState('');
  const [comId, setComId] = useState('');

  const reloadEmployers = useCallback(async () => {
    const data = await employerService.getAll();
    const mapped = mapEmployersToCrud(data);
    setEmpresas(mapped);
    setComId((current) => {
      if (current && mapped.some((e) => e.active && String(e.id) === current)) return current;
      const first = mapped.find((e) => e.active);
      return first ? String(first.id) : current;
    });
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [emp, rolesData, sectionsData, employersData] = await Promise.all([
          employeeService.getById(Number(id)),
          roleService.getActive(),
          sectionService.getActive(),
          employerService.getAll(),
        ]);
        setEmployee(emp);
        setRoles(rolesData);
        setSections(sectionsData);
        setEmpresas(mapEmployersToCrud(employersData));

        setNomeCompleto(emp.emp_full_name);
        setCpfValue(emp.emp_cpf);
        setMatricula(emp.emp_registration);
        setDataAdmissao(emp.emp_admission_date);
        setRolId(String(emp.rol_id));
        setSecId(String(emp.sec_id));
        setComId(String(emp.com_id));
      } catch (err: unknown) {
        alert(err instanceof Error ? err.message : 'Erro ao carregar colaborador');
        navigate('/colaboradores');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

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
      setComId(String(created.emr_id));
      await reloadEmployers();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao criar empresa');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;

    try {
      const allEmployees = await employeeService.getAll();
      const duplicateMsg = validateEmployeeUniqueness(
        allEmployees,
        cpfValue,
        matricula,
        employee.emp_id,
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
      await employeeService.update(employee.emp_id, {
        emp_full_name: nomeCompleto.trim(),
        emp_cpf: cpfValue.trim(),
        emp_registration: matricula.trim(),
        emp_admission_date: dataAdmissao,
        rol_id: Number(rolId),
        sec_id: Number(secId),
        com_id: Number(comId),
      });
      navigate('/colaboradores');
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao salvar alterações');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="editar-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
        <Loader2 className="editar-submit-icon" style={{ width: '2rem', height: '2rem', animation: 'spin 1s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="editar-container">
      <div className="editar-header">
        <button onClick={() => navigate('/colaboradores')} className="editar-back-btn">
          <ArrowLeft className="editar-back-icon" />
        </button>
        <div>
          <h2 className="editar-title">Editar Colaborador</h2>
          <p className="editar-subtitle">Atualize as informações de {nomeCompleto}</p>
        </div>
      </div>

      <div className="editar-card">
        <div className="editar-card-body">
          <form className="editar-form" onSubmit={handleSubmit}>
            <div className="editar-form-grid">
              <div className="editar-section">
                <h3 className="editar-section-title">
                  <User className="editar-section-icon" /> Dados Pessoais
                </h3>
                <div className="editar-fields">
                  <div className="editar-field">
                    <label className="editar-label">Nome Completo</label>
                    <input
                      type="text"
                      value={nomeCompleto}
                      onChange={(e) => setNomeCompleto(e.target.value)}
                      className="editar-input"
                      required
                    />
                  </div>
                  <div className="editar-field-row">
                    <div className="editar-field">
                      <label className="editar-label">CPF</label>
                      <input
                        type="text"
                        value={cpfValue}
                        onChange={(e) => setCpfValue(e.target.value)}
                        className="editar-input"
                        required
                      />
                    </div>
                    <div className="editar-field">
                      <label className="editar-label">Matrícula</label>
                      <input
                        type="text"
                        value={matricula}
                        onChange={(e) => setMatricula(e.target.value)}
                        className="editar-input"
                        required
                      />
                    </div>
                  </div>
                  <div className="editar-field">
                    <label className="editar-label">Data de Admissão</label>
                    <input
                      type="date"
                      value={dataAdmissao}
                      onChange={(e) => setDataAdmissao(e.target.value)}
                      className="editar-input"
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="editar-section">
                <h3 className="editar-section-title">
                  <Briefcase className="editar-section-icon" /> Dados Profissionais
                </h3>
                <div className="editar-fields">
                  <div className="editar-field">
                    <label className="editar-label">Função / Cargo</label>
                    <select
                      className="editar-select"
                      value={rolId}
                      onChange={(e) => setRolId(e.target.value)}
                      required
                    >
                      <option value="" disabled>Selecione</option>
                      {roles.map((r) => (
                        <option key={r.rol_id} value={String(r.rol_id)}>{r.rol_description}</option>
                      ))}
                    </select>
                  </div>
                  <div className="editar-field">
                    <label className="editar-label">Setor / Seção</label>
                    <select
                      className="editar-select"
                      value={secId}
                      onChange={(e) => setSecId(e.target.value)}
                      required
                    >
                      <option value="" disabled>Selecione</option>
                      {sections.map((s) => (
                        <option key={s.sec_id} value={String(s.sec_id)}>{s.sec_description}</option>
                      ))}
                    </select>
                  </div>
                  <div className="editar-field">
                    <label className="editar-label">Empresa</label>
                    <div className="editar-select-with-action">
                      <select
                        className="editar-select"
                        value={comId}
                        onChange={(e) => setComId(e.target.value)}
                        required
                        disabled={activeEmpresas.length === 0}
                      >
                        {activeEmpresas.length === 0 ? (
                          <option value="">Cadastre uma empresa</option>
                        ) : (
                          activeEmpresas.map((c) => (
                            <option key={c.id} value={String(c.id)}>
                              {c.description ? `${c.name} (${c.description})` : c.name}
                            </option>
                          ))
                        )}
                      </select>
                      <button
                        type="button"
                        className="editar-add-btn"
                        onClick={() => setIsEmployerModalOpen(true)}
                        title="Cadastrar empresa"
                      >
                        <Plus className="editar-add-icon" />
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
                </div>
              </div>
            </div>

            <div className="editar-footer">
              <div />
              <div className="editar-footer-actions">
                <button type="button" onClick={() => navigate('/colaboradores')} className="editar-cancel-btn" disabled={saving}>Cancelar</button>
                <button type="submit" className="editar-submit-btn" disabled={saving}>
                  {saving ? (
                    <>
                      <Loader2 className="editar-submit-icon" style={{ animation: 'spin 1s linear infinite' }} />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="editar-submit-icon" /> Salvar Alterações
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ColaboradorEditar;
