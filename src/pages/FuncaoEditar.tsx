import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Shield, Plus, X, AlertCircle, Check, Search } from 'lucide-react';
import { ROLES, EPIS } from '../services/api';
import { Modal } from '../components/ui/Modal';

const FuncaoEditar = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const funcao = ROLES.find(r => r.id === Number(id)) || ROLES[0];

  const [selectedEpis, setSelectedEpis] = useState<string[]>(funcao.epis);
  const [isEpiModalOpen, setIsEpiModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleEpi = (epiName: string) => {
    setSelectedEpis(prev => 
      prev.includes(epiName) 
        ? prev.filter(item => item !== epiName)
        : [...prev, epiName]
    );
  };

  const filteredEpis = EPIS.filter(epi => 
    epi.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    epi.categoria.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate(`/funcoes/${id}/detalhes`)}
          className="p-2 hover:bg-slate-100 rounded-full transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Editar Função</h2>
          <p className="text-sm text-slate-500">Atualize os requisitos e EPIs para {funcao.nome}</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-8">
          <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); navigate(`/funcoes/${id}/detalhes`); }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Dados da Função */}
              <div className="space-y-6">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Informações Básicas</h3>
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Nome da Função</label>
                    <input 
                      type="text" 
                      defaultValue={funcao.nome}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-700">Descrição das Atividades</label>
                    <textarea 
                      rows={4}
                      defaultValue={funcao.descricao}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all resize-none"
                    ></textarea>
                  </div>
                </div>
              </div>

              {/* Vínculo de EPIs */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">EPIs Obrigatórios</h3>
                  <button 
                    type="button" 
                    onClick={() => setIsEpiModalOpen(true)}
                    className="text-xs font-bold text-primary-600 flex items-center gap-1 hover:underline"
                  >
                    <Plus className="w-3 h-3" /> Adicionar EPI
                  </button>
                </div>
                
                <div className="space-y-3">
                  {selectedEpis.map((epi, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100 group">
                      <div className="flex items-center gap-3">
                        <Shield className="w-4 h-4 text-primary-500" />
                        <span className="text-sm font-medium text-slate-700">{epi}</span>
                      </div>
                      <button 
                        type="button" 
                        onClick={() => toggleEpi(epi)}
                        className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {selectedEpis.length === 0 && (
                    <div className="p-8 border-2 border-dashed border-slate-100 rounded-2xl text-center">
                      <p className="text-sm text-slate-400">Nenhum EPI vinculado a esta função.</p>
                    </div>
                  )}
                </div>

                <div className="p-4 bg-blue-50 rounded-2xl border border-blue-100 flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <p className="text-xs text-blue-600 leading-relaxed">
                    Alterar os EPIs vinculados a uma função gerará notificações automáticas para todos os colaboradores ativos nesta função para atualização de seus kits.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                type="button"
                onClick={() => navigate(`/funcoes/${id}/detalhes`)}
                className="px-6 py-2.5 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex items-center gap-2 px-8 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200"
              >
                <Save className="w-4 h-4" /> Salvar Alterações
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Modal de Seleção de EPIs */}
      <Modal
        isOpen={isEpiModalOpen}
        onClose={() => setIsEpiModalOpen(false)}
        title="Vincular EPIs à Função"
      >
        <div className="space-y-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar EPI por nome ou categoria..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {filteredEpis.map((epi) => {
              const isSelected = selectedEpis.includes(epi.nome);
              return (
                <button
                  key={epi.id}
                  onClick={() => toggleEpi(epi.nome)}
                  className={`flex items-center justify-between p-4 rounded-2xl border transition-all text-left ${
                    isSelected 
                      ? 'bg-primary-50 border-primary-200 ring-1 ring-primary-200' 
                      : 'bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      isSelected ? 'bg-primary-500 text-white' : 'bg-slate-100 text-slate-400'
                    }`}>
                      <Shield className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{epi.nome}</p>
                      <p className="text-[10px] text-slate-500 uppercase font-bold">CA: {epi.ca} • {epi.categoria}</p>
                    </div>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 bg-primary-500 rounded-full flex items-center justify-center text-white">
                      <Check className="w-4 h-4" />
                    </div>
                  )}
                </button>
              );
            })}
            {filteredEpis.length === 0 && (
              <div className="py-12 text-center">
                <p className="text-sm text-slate-400">Nenhum EPI encontrado para "{searchTerm}"</p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              onClick={() => setIsEpiModalOpen(false)}
              className="px-8 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-all"
            >
              Concluir Seleção
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default FuncaoEditar;
