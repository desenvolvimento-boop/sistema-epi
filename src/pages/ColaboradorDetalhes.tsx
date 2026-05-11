import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreHorizontal, ShieldCheck, FileText, AlertTriangle, UserMinus, RefreshCw } from 'lucide-react';
import { EMPLOYEES } from '../services/api';
import { StatusBadge } from '../components/StatusBadge';

const ColaboradorDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const colaborador = EMPLOYEES.find(e => e.id === Number(id)) || EMPLOYEES[0];

  const ACÕES_ADICIONAIS = [
    { label: 'Emitir Ficha de EPI', icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50', path: 'emitir-ficha' },
    { label: 'Transferir Unidade', icon: RefreshCw, color: 'text-primary-600', bg: 'bg-primary-50', path: 'transferir-unidade' },
    { label: 'Desativar Colaborador', icon: UserMinus, color: 'text-red-600', bg: 'bg-red-50', path: 'desativar' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/colaboradores')}
            className="p-2 hover:bg-slate-100 rounded-full transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Detalhes do Colaborador</h2>
            <p className="text-sm text-slate-500">Gestão avançada de perfil</p>
          </div>
        </div>
        <button className="p-2 hover:bg-slate-100 rounded-lg transition-all">
          <MoreHorizontal className="w-5 h-5 text-slate-600" />
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Card Principal */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="w-32 h-32 rounded-3xl bg-slate-100 flex items-center justify-center text-4xl font-bold text-slate-400 border-4 border-white shadow-xl">
              {colaborador.nome.charAt(0)}
            </div>
            <div className="flex-1 text-center md:text-left space-y-4">
              <div>
                <div className="flex items-center justify-center md:justify-start gap-3 mb-1">
                  <h3 className="text-2xl font-bold text-slate-900">{colaborador.nome}</h3>
                  <StatusBadge status={colaborador.status} />
                </div>
                <p className="text-slate-500 font-medium">{colaborador.funcao} • {colaborador.empresa}</p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-4 border-t border-slate-100">
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Matrícula</p>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">{colaborador.matricula}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">CPF</p>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">{colaborador.cpf}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Admissão</p>
                  <p className="text-sm font-bold text-slate-700 mt-0.5">{colaborador.admissao}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-primary-900 p-8 rounded-3xl text-white relative overflow-hidden shadow-2xl shadow-primary-900/20">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="w-32 h-32" />
            </div>
            <div className="relative z-10">
              <h4 className="text-lg font-bold mb-2">Status de Proteção</h4>
              <p className="text-primary-100 text-sm max-w-md">
                Este colaborador possui todos os EPIs obrigatórios para sua função devidamente entregues e dentro do prazo de validade.
              </p>
              <button className="mt-6 px-6 py-2 bg-white text-primary-900 rounded-xl text-sm font-bold hover:bg-primary-50 transition-all">
                Ver Matriz de EPIs
              </button>
            </div>
          </div>
        </div>

        {/* Ações Rápidas */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4">Ações Administrativas</h4>
            <div className="space-y-3">
              {ACÕES_ADICIONAIS.map((acao, index) => (
                <button 
                  key={index}
                  onClick={() => navigate(`/colaboradores/${id}/${acao.path}`)}
                  className="w-full flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-all group border border-transparent hover:border-slate-100"
                >
                  <div className={`w-10 h-10 ${acao.bg} ${acao.color} rounded-xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                    <acao.icon className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-bold text-slate-700">{acao.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-slate-50 p-6 rounded-3xl border border-dashed border-slate-300">
            <p className="text-xs text-slate-500 text-center leading-relaxed">
              Última atualização cadastral realizada por <span className="font-bold">Admin Master</span> em 09/03/2026 às 14:30.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColaboradorDetalhes;
