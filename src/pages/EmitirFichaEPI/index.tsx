import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FileText, Download, Printer, ShieldCheck } from 'lucide-react';
import { PageHeader, PageHeaderBackButton } from '../../components/layout/PageHeader';
import { EMPLOYEES } from '../../services/api';
import './styles.css';

const EmitirFichaEPI = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const colaborador = EMPLOYEES.find(e => e.id === Number(id)) || EMPLOYEES[0];

  return (
    <div className="ficha-container">
      <PageHeader
        leading={<PageHeaderBackButton onClick={() => navigate(`/colaboradores/${id}/detalhes`)} />}
        icon={FileText}
        title="Emitir Ficha de EPI"
        subtitle={`Documento oficial de controle para ${colaborador.nome}`}
      />

      <div className="ficha-grid">
        <div className="ficha-main">
          <div className="ficha-main-header">
            <div className="ficha-main-header-left">
              <div className="ficha-main-header-icon">
                <FileText className="ficha-main-header-icon-inner" />
              </div>
              <h3 className="ficha-main-header-title">Visualização da Ficha</h3>
            </div>
            <div className="ficha-main-header-actions">
              <button className="ficha-download-btn">
                <Download className="ficha-btn-icon" /> Baixar PDF
              </button>
              <button className="ficha-print-btn">
                <Printer className="ficha-btn-icon" /> Imprimir
              </button>
            </div>
          </div>
          
          <div className="ficha-preview-area">
            <div className="ficha-document">
              <div className="ficha-doc-header">
                <h1 className="ficha-doc-title">Ficha de Controle de EPI</h1>
                <p className="ficha-doc-subtitle">Conforme Norma Regulamentadora NR-06</p>
              </div>

              <div className="ficha-doc-info-grid">
                <div className="ficha-doc-info-item">
                  <p className="ficha-doc-info-label">Colaborador</p>
                  <p className="ficha-doc-info-value">{colaborador.nome}</p>
                </div>
                <div className="ficha-doc-info-item">
                  <p className="ficha-doc-info-label">CPF / Matrícula</p>
                  <p className="ficha-doc-info-value">{colaborador.cpf} / {colaborador.matricula}</p>
                </div>
                <div className="ficha-doc-info-item">
                  <p className="ficha-doc-info-label">Função</p>
                  <p className="ficha-doc-info-value">{colaborador.funcao}</p>
                </div>
                <div className="ficha-doc-info-item">
                  <p className="ficha-doc-info-label">Data de Emissão</p>
                  <p className="ficha-doc-info-value">14/03/2026</p>
                </div>
              </div>

              <table className="ficha-doc-table">
                <thead>
                  <tr className="ficha-doc-table-head-row">
                    <th className="ficha-doc-table-th">Data</th>
                    <th className="ficha-doc-table-th">Descrição do EPI</th>
                    <th className="ficha-doc-table-th">CA</th>
                    <th className="ficha-doc-table-th">Assinatura</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map(i => (
                    <tr key={i}>
                      <td className="ficha-doc-table-td"></td>
                      <td className="ficha-doc-table-td"></td>
                      <td className="ficha-doc-table-td"></td>
                      <td className="ficha-doc-table-td"></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="ficha-doc-footer">
                <p className="ficha-doc-disclaimer">
                  Declaro ter recebido da empresa os Equipamentos de Proteção Individual (EPIs) acima relacionados, os quais me comprometo a utilizar de forma correta e zelar pela sua conservação, conforme orientações recebidas e disposições da NR-06.
                </p>
                <div className="ficha-doc-signatures">
                  <div className="ficha-doc-signature">
                    <p className="ficha-doc-signature-label">Assinatura do Colaborador</p>
                  </div>
                  <div className="ficha-doc-signature">
                    <p className="ficha-doc-signature-label">Responsável Técnico</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="ficha-sidebar">
          <div className="ficha-config-card">
            <h4 className="ficha-config-title">Configurações do Documento</h4>
            <div className="ficha-config-options">
              <label className="ficha-config-option">
                <input type="checkbox" defaultChecked className="ficha-config-checkbox" />
                <span className="ficha-config-label">Incluir histórico de 12 meses</span>
              </label>
              <label className="ficha-config-option">
                <input type="checkbox" defaultChecked className="ficha-config-checkbox" />
                <span className="ficha-config-label">Gerar via do colaborador</span>
              </label>
              <label className="ficha-config-option">
                <input type="checkbox" className="ficha-config-checkbox" />
                <span className="ficha-config-label">Assinatura Digital (Biometria)</span>
              </label>
            </div>
          </div>

          <div className="ficha-legal-card">
            <div className="ficha-legal-header">
              <ShieldCheck className="ficha-legal-icon" />
              <h4 className="ficha-legal-title">Validade Jurídica</h4>
            </div>
            <p className="ficha-legal-text">
              Este documento atende aos requisitos da Portaria SEPRT nº 6.730/2020 e NR-01, garantindo a segurança jurídica da empresa em auditorias fiscais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmitirFichaEPI;
