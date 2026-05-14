import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreHorizontal, ShieldCheck, FileText, UserMinus, RefreshCw, Loader2 } from 'lucide-react';
import { employeeService, type EmployeeAPI } from '../../services/employeeService';
import { StatusBadge } from '../../components/StatusBadge';
import './styles.css';

function formatDate(dateStr: string): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR');
}

function getStatusLabel(emp: EmployeeAPI): string {
  return emp.emp_active === 1 ? 'Ativo' : 'Inativo';
}

const ColaboradorDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [employee, setEmployee] = useState<EmployeeAPI | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const emp = await employeeService.getById(Number(id));
        setEmployee(emp);
      } catch (err: any) {
        alert(err.message || 'Erro ao carregar colaborador');
        navigate('/colaboradores');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id, navigate]);

  if (loading || !employee) {
    return (
      <div className="detalhes-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem' }}>
        <Loader2 style={{ width: '2rem', height: '2rem', animation: 'spin 1s linear infinite', color: 'var(--color-primary-600)' }} />
      </div>
    );
  }

  const ACOES_ADICIONAIS = [
    { label: 'Emitir Ficha de EPI', icon: FileText, iconClass: 'detalhes-admin-icon-emitir', path: 'emitir-ficha' },
    { label: 'Transferir Unidade', icon: RefreshCw, iconClass: 'detalhes-admin-icon-transferir', path: 'transferir-unidade' },
    { label: 'Desativar Colaborador', icon: UserMinus, iconClass: 'detalhes-admin-icon-desativar', path: 'desativar' },
  ];

  return (
    <div className="detalhes-container">
      <div className="detalhes-header">
        <div className="detalhes-header-left">
          <button 
            onClick={() => navigate('/colaboradores')}
            className="detalhes-back-btn"
          >
            <ArrowLeft className="detalhes-back-icon" />
          </button>
          <div>
            <h2 className="detalhes-title">Detalhes do Colaborador</h2>
            <p className="detalhes-subtitle">Gestão avançada de perfil</p>
          </div>
        </div>
        <button className="detalhes-more-btn">
          <MoreHorizontal className="detalhes-more-icon" />
        </button>
      </div>

      <div className="detalhes-grid">
        <div className="detalhes-main">
          <div className="detalhes-profile-card">
            <div className="detalhes-avatar">
              {employee.emp_full_name.charAt(0).toUpperCase()}
            </div>
            <div className="detalhes-profile-info">
              <div>
                <div className="detalhes-name-row">
                  <h3 className="detalhes-name">{employee.emp_full_name}</h3>
                  <StatusBadge status={getStatusLabel(employee)} />
                </div>
                <p className="detalhes-role">
                  {employee.role?.rol_description || '—'} • {employee.company?.com_description || '—'}
                </p>
              </div>
              <div className="detalhes-info-grid">
                <div>
                  <p className="detalhes-info-label">Matrícula</p>
                  <p className="detalhes-info-value">{employee.emp_registration}</p>
                </div>
                <div>
                  <p className="detalhes-info-label">CPF</p>
                  <p className="detalhes-info-value">{employee.emp_cpf}</p>
                </div>
                <div>
                  <p className="detalhes-info-label">Admissão</p>
                  <p className="detalhes-info-value">{formatDate(employee.emp_admission_date)}</p>
                </div>
                <div>
                  <p className="detalhes-info-label">Setor</p>
                  <p className="detalhes-info-value">{employee.section?.sec_description || '—'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="detalhes-protection-card">
            <div className="detalhes-protection-icon-wrapper">
              <ShieldCheck className="detalhes-protection-icon" />
            </div>
            <div className="detalhes-protection-content">
              <h4 className="detalhes-protection-title">Status de Proteção</h4>
              <p className="detalhes-protection-text">
                Este colaborador possui todos os EPIs obrigatórios para sua função devidamente entregues e dentro do prazo de validade.
              </p>
              <button className="detalhes-protection-btn">
                Ver Matriz de EPIs
              </button>
            </div>
          </div>
        </div>

        <div className="detalhes-sidebar">
          <div className="detalhes-admin-card">
            <h4 className="detalhes-admin-title">Ações Administrativas</h4>
            <div className="detalhes-admin-actions">
              {ACOES_ADICIONAIS.map((acao, index) => (
                <button 
                  key={index}
                  onClick={() => navigate(`/colaboradores/${id}/${acao.path}`)}
                  className="detalhes-admin-btn"
                >
                  <div className={`detalhes-admin-icon ${acao.iconClass}`}>
                    <acao.icon className="detalhes-admin-icon-inner" />
                  </div>
                  <span className="detalhes-admin-label">{acao.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="detalhes-footer-card">
            <p className="detalhes-footer-text">
              Última atualização cadastral em {employee.emp_datetimeupdate ? new Date(employee.emp_datetimeupdate).toLocaleString('pt-BR') : '—'}.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColaboradorDetalhes;
