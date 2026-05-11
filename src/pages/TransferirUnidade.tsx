import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Building2, MapPin, Save, AlertCircle } from 'lucide-react';
import { EMPLOYEES } from '../services/api';

const TransferirUnidade = () => {
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
          <h2 className="text-xl font-bold text-slate-800">Transferir Unidade</h2>
          <p className="text-sm text-slate-500">Alteração de local de trabalho para {colaborador.nome}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8">
          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); navigate(`/colaboradores/${id}/detalhes`); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Unidade Atual */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Building2 className="w-4 h-4" /> Localização Atual
                </h3>
                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm">
                      <MapPin className="w-6 h-6 text-slate-400" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-400 uppercase">Empresa / Unidade</p>
                      <p className="text-sm font-bold text-slate-800">{colaborador.empresa} - {colaborador.unidade}</p>
                    </div>
                  </div>
                  <div className="pt-4 border-t border-slate-200">
                    <p className="text-xs text-slate-500">Este colaborador está alocado nesta unidade desde a sua admissão em {colaborador.admissao}.</p>
                  </div>
                </div>
              </div>

              {/* Nova Unidade */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-primary-600 uppercase tracking-wider flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" /> Nova Localização
                </h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Selecione a Nova Unidade</label>
                    <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all">
                      <option value="">Selecione uma unidade...</option>
                      <option>Matriz - São Paulo</option>
                      <option>Filial - Rio de Janeiro</option>
                      <option>Centro de Distribuição - MG</option>
                      <option>Unidade Industrial - PR</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Data da Transferência</label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Motivo da Movimentação</label>
                    <textarea 
                      rows={3}
                      placeholder="Justifique a necessidade de transferência..."
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-blue-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-blue-800">Atenção sobre o Inventário de EPIs</h4>
                <p className="text-xs text-blue-600 leading-relaxed">
                  Ao transferir o colaborador, o sistema verificará se a nova unidade possui os mesmos riscos ambientais. Caso existam novos riscos, o colaborador será notificado para retirar os EPIs complementares na nova unidade.
                </p>
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
                className="flex items-center gap-2 px-8 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
              >
                <Save className="w-4 h-4" /> Confirmar Transferência
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TransferirUnidade;
