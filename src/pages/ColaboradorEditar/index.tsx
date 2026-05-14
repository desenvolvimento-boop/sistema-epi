import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, User, Briefcase, Loader2 } from 'lucide-react';
import { employeeService, type EmployeeAPI } from '../../services/employeeService';
import { roleService, type RoleAPI } from '../../services/roleService';
import { sectionService, type SectionAPI } from '../../services/sectionService';
import { companyService, type CompanyAPI } from '../../services/companyService';
import './styles.css';

const ColaboradorEditar = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [employee, setEmployee] = useState<EmployeeAPI | null>(null);

  const [roles, setRoles] = useState<RoleAPI[]>([]);
  const [sections, setSections] = useState<SectionAPI[]>([]);
  const [companies, setCompanies] = useState<CompanyAPI[]>([]);

  const [nomeCompleto, setNomeCompleto] = useState('');
  const [cpfValue, setCpfValue] = useState('');
  const [matricula, setMatricula] = useState('');
  const [dataAdmissao, setDataAdmissao] = useState('');
  const [rolId, setRolId] = useState('');
  const [secId, setSecId] = useState('');
  const [comId, setComId] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const [emp, rolesData, sectionsData, companiesData] = await Promise.all([
          employeeService.getById(Number(id)),
          roleService.getActive(),
          sectionService.getActive(),
          companyService.getActive(),
        ]);
        setEmployee(emp);
        setRoles(rolesData);
        setSections(sectionsData);
        setCompanies(companiesData);

        setNomeCompleto(emp.emp_full_name);
        setCpfValue(emp.emp_cpf);
        setMatricula(emp.emp_registration);
        setDataAdmissao(emp.emp_admission_date);
        setRolId(String(emp.rol_id));
        setSecId(String(emp.sec_id));
        setComId(String(emp.com_id));
      } catch (err: any) {
        alert(err.message || 'Erro ao carregar colaborador');
        navigate('/colaboradores');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [id, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employee) return;
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
    } catch (err: any) {
      alert(err.message || 'Erro ao salvar alterações');
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
                      {roles.map(r => (
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
                      {sections.map(s => (
                        <option key={s.sec_id} value={String(s.sec_id)}>{s.sec_description}</option>
                      ))}
                    </select>
                  </div>
                  <div className="editar-field">
                    <label className="editar-label">Empresa</label>
                    <select
                      className="editar-select"
                      value={comId}
                      onChange={(e) => setComId(e.target.value)}
                      required
                    >
                      <option value="" disabled>Selecione</option>
                      {companies.map(c => (
                        <option key={c.com_id} value={String(c.com_id)}>{c.com_description}</option>
                      ))}
                    </select>
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
