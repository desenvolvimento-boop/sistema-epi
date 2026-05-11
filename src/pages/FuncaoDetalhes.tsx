import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, AlertTriangle, Users, Edit3, Trash2, CheckCircle2 } from 'lucide-react';
import { ROLES } from '../services/api';

const FuncaoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const funcao = ROLES.find(r => r.id === Number(id)) || ROLES[0];

  const RISCOS_MOCK = [
    { tipo: 'Físico', descricao: 'Ruído contínuo acima de 85dB', severidade: 'Alta' },
    { tipo: 'Químico', descricao: 'Exposição a vapores orgânicos', severidade: 'Média' },
    { tipo: 'Ergonômico', descricao: 'Postura inadequada prolongada', severidade: 'Baixa' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/funcoes')}
            className="p-2 hover:bg-slate-100 rounded-full transition-all"
          >
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </button>
          <div>
            <h2 className="text-xl font-bold text-slate-800">Detalhes da Função</h2>
            <p className="text-sm text-slate-500">Configurações e requisitos de segurança</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate(`/funcoes/${id}/editar`)}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
          >
            <Edit3 className="w-4 h-4" /> Editar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-600 border border-red-100 rounded-xl text-sm font-bold hover:bg-red-100 transition-all">
            <Trash2 className="w-4 h-4" /> Excluir
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Informações Básicas */}
          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div>
              <h3 className="text-2xl font-bold text-slate-900">{funcao.nome}</h3>
              <p className="text-slate-500 mt-2 leading-relaxed">{funcao.descricao}</p>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">EPIs Obrigatórios (NR-06)</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {funcao.epis.map((epi, index) => (
                  <div key={index} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <Shield className="w-5 h-5 text-primary-500" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{epi}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">Troca a cada 180 dias</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Matriz de Riscos */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-8 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
              <h4 className="font-bold text-slate-800 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" /> Riscos Ocupacionais Identificados
              </h4>
              <button className="text-xs font-bold text-primary-600 hover:underline">Ver PGR Completo</button>
            </div>
            <div className="p-0">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <th className="px-8 py-4">Tipo de Risco</th>
                    <th className="px-8 py-4">Descrição do Agente</th>
                    <th className="px-8 py-4 text-right">Severidade</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {RISCOS_MOCK.map((risco, index) => (
                    <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-8 py-4">
                        <span className="px-2 py-1 bg-slate-100 text-slate-600 rounded text-[10px] font-bold uppercase">
                          {risco.tipo}
                        </span>
                      </td>
                      <td className="px-8 py-4 text-sm text-slate-700">{risco.descricao}</td>
                      <td className="px-8 py-4 text-right">
                        <span className={`text-xs font-bold ${
                          risco.severidade === 'Alta' ? 'text-red-500' : 
                          risco.severidade === 'Média' ? 'text-amber-500' : 'text-primary-500'
                        }`}>
                          {risco.severidade}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {/* Estatísticas Rápidas */}
          <div className="bg-slate-900 p-8 rounded-3xl text-white shadow-xl shadow-slate-900/20">
            <div className="flex items-center justify-between mb-6">
              <div className="p-3 bg-white/10 rounded-2xl">
                <Users className="w-6 h-6 text-primary-400" />
              </div>
              <span className="text-[10px] font-bold bg-primary-500/20 text-primary-400 px-2 py-1 rounded uppercase tracking-wider">Ativos</span>
            </div>
            <h3 className="text-3xl font-bold mb-1">128</h3>
            <p className="text-slate-400 text-sm">Colaboradores vinculados a esta função atualmente.</p>
            <button 
              onClick={() => navigate('/colaboradores')}
              className="w-full mt-6 py-3 bg-primary-500 text-white rounded-xl text-sm font-bold hover:bg-primary-600 transition-all"
            >
              Ver Listagem Completa
            </button>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
            <h4 className="font-bold text-slate-800 mb-4">Conformidade Técnica</h4>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-slate-600">PGR Atualizado (2026)</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-slate-600">LTCAT Vinculado</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-primary-500" />
                <span className="text-sm text-slate-600">PCMSO em Dia</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuncaoDetalhes;
