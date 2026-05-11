import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Download, Printer, ShieldCheck } from 'lucide-react';
import { EMPLOYEES } from '../services/api';

const EmitirFichaEPI = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const colaborador = EMPLOYEES.find(e => e.id === Number(id)) || EMPLOYEES[0];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(`/colaboradores/${id}/detalhes`)}
          className="p-2 hover:bg-slate-100 rounded-full transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Emitir Ficha de EPI</h2>
          <p className="text-sm text-slate-500">Documento oficial de controle para {colaborador.nome}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <FileText className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-800">Visualização da Ficha</h3>
            </div>
            <div className="flex items-center gap-2">
              <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                <Download className="w-4 h-4" /> Baixar PDF
              </button>
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all">
                <Printer className="w-4 h-4" /> Imprimir
              </button>
            </div>
          </div>
          
          <div className="p-12 bg-slate-200/30 min-h-[600px] flex justify-center">
            {/* Simulação de Documento */}
            <div className="w-full max-w-[595px] bg-white shadow-2xl p-10 space-y-8 text-slate-800 font-serif">
              <div className="text-center border-b-2 border-slate-900 pb-6">
                <h1 className="text-xl font-bold uppercase tracking-widest">Ficha de Controle de EPI</h1>
                <p className="text-xs mt-2 font-sans text-slate-500">Conforme Norma Regulamentadora NR-06</p>
              </div>

              <div className="grid grid-cols-2 gap-6 text-xs font-sans">
                <div className="space-y-1">
                  <p className="font-bold text-slate-400 uppercase">Colaborador</p>
                  <p className="text-sm font-bold">{colaborador.nome}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-400 uppercase">CPF / Matrícula</p>
                  <p className="text-sm font-bold">{colaborador.cpf} / {colaborador.matricula}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-400 uppercase">Função</p>
                  <p className="text-sm font-bold">{colaborador.funcao}</p>
                </div>
                <div className="space-y-1">
                  <p className="font-bold text-slate-400 uppercase">Data de Emissão</p>
                  <p className="text-sm font-bold">14/03/2026</p>
                </div>
              </div>

              <table className="w-full border-collapse border border-slate-300 text-[10px] font-sans">
                <thead>
                  <tr className="bg-slate-100">
                    <th className="border border-slate-300 p-2">Data</th>
                    <th className="border border-slate-300 p-2">Descrição do EPI</th>
                    <th className="border border-slate-300 p-2">CA</th>
                    <th className="border border-slate-300 p-2">Assinatura</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map(i => (
                    <tr key={i}>
                      <td className="border border-slate-300 p-2 h-8"></td>
                      <td className="border border-slate-300 p-2 h-8"></td>
                      <td className="border border-slate-300 p-2 h-8"></td>
                      <td className="border border-slate-300 p-2 h-8"></td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pt-12 space-y-8">
                <p className="text-[10px] font-sans leading-relaxed text-justify">
                  Declaro ter recebido da empresa os Equipamentos de Proteção Individual (EPIs) acima relacionados, os quais me comprometo a utilizar de forma correta e zelar pela sua conservação, conforme orientações recebidas e disposições da NR-06.
                </p>
                <div className="flex justify-between pt-12">
                  <div className="w-48 border-t border-slate-900 text-center pt-2">
                    <p className="text-[10px] uppercase font-bold">Assinatura do Colaborador</p>
                  </div>
                  <div className="w-48 border-t border-slate-900 text-center pt-2">
                    <p className="text-[10px] uppercase font-bold">Responsável Técnico</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4">Configurações do Documento</h4>
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500" />
                <span className="text-sm font-medium text-slate-700">Incluir histórico de 12 meses</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100">
                <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500" />
                <span className="text-sm font-medium text-slate-700">Gerar via do colaborador</span>
              </label>
              <label className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all cursor-pointer border border-transparent hover:border-slate-100">
                <input type="checkbox" className="w-4 h-4 rounded text-primary-600 focus:ring-primary-500" />
                <span className="text-sm font-medium text-slate-700">Assinatura Digital (Biometria)</span>
              </label>
            </div>
          </div>

          <div className="bg-primary-50 p-6 rounded-3xl border border-primary-100">
            <div className="flex items-center gap-3 text-primary-700 mb-2">
              <ShieldCheck className="w-5 h-5" />
              <h4 className="font-bold text-sm">Validade Jurídica</h4>
            </div>
            <p className="text-xs text-primary-600 leading-relaxed">
              Este documento atende aos requisitos da Portaria SEPRT nº 6.730/2020 e NR-01, garantindo a segurança jurídica da empresa em auditorias fiscais.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmitirFichaEPI;
