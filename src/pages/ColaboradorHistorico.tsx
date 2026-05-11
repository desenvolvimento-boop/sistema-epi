import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, History, Package, Calendar, CheckCircle2, AlertTriangle } from 'lucide-react';
import { EMPLOYEES } from '../services/api';

const ColaboradorHistorico = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const colaborador = EMPLOYEES.find(e => e.id === Number(id)) || EMPLOYEES[0];

  const HISTORICO_MOCK = [
    { id: 1, data: '10/03/2026', acao: 'Entrega de EPI', item: 'Luva de Vaqueta', status: 'Concluído', responsavel: 'Admin Master' },
    { id: 2, data: '05/03/2026', acao: 'Troca Programada', item: 'Bota de Segurança', status: 'Concluído', responsavel: 'Sistema (Auto)' },
    { id: 3, data: '20/02/2026', acao: 'Treinamento NR-06', item: 'Uso Correto de EPIs', status: 'Certificado', responsavel: 'Segurança do Trabalho' },
    { id: 4, data: '15/01/2026', acao: 'Admissão', item: 'Kit Inicial de EPIs', status: 'Concluído', responsavel: 'RH' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/colaboradores')}
          className="p-2 hover:bg-slate-100 rounded-full transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Histórico do Colaborador</h2>
          <p className="text-sm text-slate-500">Rastreabilidade completa de {colaborador.nome}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Total de Entregas</p>
            <h3 className="text-2xl font-bold text-slate-800">24</h3>
          </div>
          <div className="p-2.5 bg-primary-50 text-primary-500 rounded-xl">
            <Package className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Última Atividade</p>
            <h3 className="text-2xl font-bold text-slate-800">10/03/2026</h3>
          </div>
          <div className="p-2.5 bg-blue-50 text-blue-500 rounded-xl">
            <Calendar className="w-5 h-5" />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status de Conformidade</p>
            <h3 className="text-2xl font-bold text-primary-600">100%</h3>
          </div>
          <div className="p-2.5 bg-emerald-50 text-emerald-500 rounded-xl">
            <CheckCircle2 className="w-5 h-5" />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <History className="w-5 h-5 text-slate-400" /> Linha do Tempo de Atividades
          </h3>
        </div>
        <div className="p-6">
          <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
            {HISTORICO_MOCK.map((item) => (
              <div key={item.id} className="relative flex items-start gap-6">
                <div className="absolute left-0 w-10 h-10 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center z-10">
                  <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                </div>
                <div className="ml-12 flex-1 bg-slate-50 p-4 rounded-xl border border-slate-100 hover:border-primary-200 transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-400">{item.data}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-primary-100 text-primary-700 rounded uppercase">
                      {item.status}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800">{item.acao}</h4>
                  <p className="text-sm text-slate-600 mt-1">{item.item}</p>
                  <div className="mt-3 pt-3 border-t border-slate-200 flex items-center justify-between">
                    <span className="text-xs text-slate-400">Responsável: <span className="text-slate-600 font-medium">{item.responsavel}</span></span>
                    <button className="text-xs font-bold text-primary-600 hover:underline">Ver Comprovante</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ColaboradorHistorico;
