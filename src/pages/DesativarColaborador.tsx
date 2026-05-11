import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, UserMinus, AlertTriangle, Save, FileText, CheckCircle2 } from 'lucide-react';
import { EMPLOYEES } from '../services/api';

const DesativarColaborador = () => {
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
          <h2 className="text-xl font-bold text-slate-800">Desativar Colaborador</h2>
          <p className="text-sm text-slate-500">Processo de desligamento para {colaborador.nome}</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto space-y-6">
        <div className="bg-red-50 p-6 rounded-3xl border border-red-100 flex items-start gap-4">
          <AlertTriangle className="w-8 h-8 text-red-600 shrink-0" />
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-red-800">Ação Irreversível</h4>
            <p className="text-sm text-red-600 leading-relaxed">
              A desativação removerá o colaborador da lista ativa e interromperá todas as notificações de troca de EPI. Certifique-se de que todos os equipamentos foram devolvidos.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-8">
            <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); navigate(`/colaboradores`); }}>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Motivo do Desligamento</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all">
                      <option>Pedido de Demissão</option>
                      <option>Demissão sem Justa Causa</option>
                      <option>Demissão com Justa Causa</option>
                      <option>Término de Contrato</option>
                      <option>Aposentadoria</option>
                    </select>
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Data de Desligamento</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-800">Checklist de Desligamento</h4>
                  <div className="space-y-3">
                    {[
                      'Todos os EPIs foram devolvidos e higienizados',
                      'Ficha de EPI final assinada pelo colaborador',
                      'Exame demissional realizado e anexado',
                      'Acesso ao aplicativo mobile revogado'
                    ].map((item, index) => (
                      <label key={index} className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100 cursor-pointer hover:bg-slate-100 transition-all group">
                        <div className="w-5 h-5 rounded-full border-2 border-slate-300 flex items-center justify-center group-hover:border-red-500 transition-colors">
                          <CheckCircle2 className="w-3 h-3 text-white group-hover:text-red-500" />
                        </div>
                        <span className="text-sm font-medium text-slate-600">{item}</span>
                        <input type="checkbox" className="hidden" />
                      </label>
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700">Observações Finais</label>
                  <textarea 
                    rows={3}
                    placeholder="Informações adicionais sobre o desligamento..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none"
                  ></textarea>
                </div>
              </div>

              <div className="pt-8 border-t border-slate-100 flex items-center justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => navigate(`/colaboradores/${id}/detalhes`)}
                  className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="flex items-center gap-2 px-8 py-2.5 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700 transition-all shadow-lg shadow-red-200"
                >
                  <UserMinus className="w-4 h-4" /> Confirmar Desativação
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesativarColaborador;
