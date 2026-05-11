import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  CheckCircle2, 
  ShieldCheck, 
  RefreshCw, 
  AlertTriangle, 
  ScanFace, 
  ArrowLeft,
  Calendar,
  User,
  Building2,
  MapPin
} from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const HistoricoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Mock data for the specific history detail
  const historyItem = {
    id: Number(id),
    colaborador: 'Ricardo Silva',
    cpf: '123.456.789-00',
    matricula: 'MT-001',
    funcao: 'Operador de Empilhadeira',
    unidade: 'CD São Paulo',
    empresa: 'Terceira Log',
    timeline: [
      { type: 'Entrega', title: 'Entrega de EPI: Capacete H-700', date: '05 Mar 2024, 08:30', status: 'Validado via FaceID', icon: ShieldCheck, color: 'bg-primary-500' },
      { type: 'Troca', title: 'Troca de EPI: Luva Nitrílica', date: '20 Fev 2024, 14:20', status: 'Motivo: Desgaste Natural', icon: RefreshCw, color: 'bg-blue-500' },
      { type: 'Alerta', title: 'Não Conformidade Registrada', date: '15 Fev 2024, 10:00', status: 'Uso incorreto do protetor auricular', icon: AlertTriangle, color: 'bg-amber-500' },
      { type: 'Admissão', title: 'Integração e Treinamento de EPI', date: '12 Jan 2023, 09:00', status: 'Certificado Anexado', icon: CheckCircle2, color: 'bg-slate-900' },
    ]
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/historico')}
          className="p-2 hover:bg-slate-100 rounded-full transition-all"
        >
          <ArrowLeft className="w-5 h-5 text-slate-600" />
        </button>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Prontuário Jurídico</h2>
          <p className="text-sm text-slate-500">Rastreabilidade completa de eventos de segurança</p>
        </div>
      </div>

      <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8">
          <div className="bg-primary-50 text-primary-700 px-4 py-2 rounded-2xl border border-primary-100 flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-bold text-sm">Validado</span>
          </div>
        </div>

        <div className="flex items-center gap-6 mb-10">
          <div className="w-20 h-20 rounded-3xl bg-slate-100 flex items-center justify-center text-3xl font-bold text-slate-400">
            {historyItem.colaborador.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{historyItem.colaborador}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-1 mt-2">
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <User className="w-3.5 h-3.5" /> CPF: {historyItem.cpf} | Matrícula: {historyItem.matricula}
              </p>
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <Building2 className="w-3.5 h-3.5" /> {historyItem.empresa}
              </p>
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> {historyItem.unidade}
              </p>
              <p className="text-sm text-slate-500 flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5" /> {historyItem.funcao}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
          {historyItem.timeline.map((item, i) => (
            <div key={i} className="relative pl-12">
              <div className={cn("absolute left-0 top-1 w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-lg", item.color)}>
                <item.icon className="w-5 h-5" />
              </div>
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.type}</span>
                  <span className="text-xs text-slate-500 font-medium">{item.date}</span>
                </div>
                <h4 className="font-bold text-slate-800">{item.title}</h4>
                <p className="text-sm text-slate-600 mt-1">{item.status}</p>
                {item.type === 'Entrega' && (
                  <button className="mt-3 flex items-center gap-2 text-xs font-bold text-primary-600 hover:underline">
                    <ScanFace className="w-3 h-3" /> Ver Evidência Facial
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HistoricoDetalhes;
