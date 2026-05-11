import React, { useState } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  Calendar as CalendarIcon, 
  Clock, 
  User,
  Filter,
  ArrowLeft
} from 'lucide-react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  eachDayOfInterval, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  subDays,
  startOfDay,
  eachHourOfInterval,
  addHours
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

const AGENDA_MOCK = [
  { id: 1, colaborador: 'João Silva', epi: 'Luva de Vaqueta', data: '2026-04-10', hora: '09:00', status: 'Pendente', prioridade: 'Alta' },
  { id: 2, colaborador: 'Maria Oliveira', epi: 'Bota de Segurança', data: '2026-04-12', hora: '14:30', status: 'Pendente', prioridade: 'Média' },
  { id: 3, colaborador: 'Carlos Santos', epi: 'Capacete de Segurança', data: '2026-04-15', hora: '10:00', status: 'Pendente', prioridade: 'Baixa' },
  { id: 4, colaborador: 'Ana Costa', epi: 'Protetor Auricular', data: '2026-04-09', hora: '08:15', status: 'Atrasado', prioridade: 'Crítica' },
  { id: 5, colaborador: 'Ricardo Lima', epi: 'Óculos de Proteção', data: '2026-04-15', hora: '11:00', status: 'Pendente', prioridade: 'Alta' },
  { id: 6, colaborador: 'Juliana Souza', epi: 'Máscara PFF2', data: '2026-04-15', hora: '16:00', status: 'Pendente', prioridade: 'Média' },
];

type ViewMode = 'month' | 'week' | 'day';

const CalendarioAgenda = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date(2026, 3, 15)); // Start at April 2026 for mock data
  const [viewMode, setViewMode] = useState<ViewMode>('month');

  const nextDate = () => {
    if (viewMode === 'month') setCurrentDate(addMonths(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(addDays(currentDate, 7));
    else setCurrentDate(addDays(currentDate, 1));
  };

  const prevDate = () => {
    if (viewMode === 'month') setCurrentDate(subMonths(currentDate, 1));
    else if (viewMode === 'week') setCurrentDate(subDays(currentDate, 7));
    else setCurrentDate(subDays(currentDate, 1));
  };

  const goToToday = () => setCurrentDate(new Date(2026, 3, 15));

  const renderHeader = () => (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div className="flex items-center gap-4">
        <button 
          onClick={() => navigate('/agenda-trocas')}
          className="p-2 hover:bg-slate-100 rounded-xl transition-all text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Calendário de Trocas</h2>
          <p className="text-slate-500 text-sm capitalize">
            {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3 bg-white p-1.5 rounded-2xl border border-slate-200 shadow-sm">
        {(['month', 'week', 'day'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${
              viewMode === mode 
                ? 'bg-primary-600 text-white shadow-md shadow-primary-100' 
                : 'text-slate-500 hover:bg-slate-50'
            }`}
          >
            {mode === 'month' ? 'Mês' : mode === 'week' ? 'Semana' : 'Dia'}
          </button>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <button 
          onClick={goToToday}
          className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all"
        >
          Hoje
        </button>
        <div className="flex items-center bg-white border border-slate-200 rounded-xl overflow-hidden">
          <button onClick={prevDate} className="p-2 hover:bg-slate-50 border-r border-slate-200 text-slate-600">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button onClick={nextDate} className="p-2 hover:bg-slate-50 text-slate-600">
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );

  const renderMonthView = () => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 0 });
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 0 });

    const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });
    const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50/50">
          {weekDays.map(day => (
            <div key={day} className="py-4 text-center text-[10px] font-bold text-slate-400 uppercase tracking-widest">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {calendarDays.map((day, idx) => {
            const dayExchanges = AGENDA_MOCK.filter(ex => isSameDay(new Date(ex.data), day));
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date(2026, 3, 15));

            return (
              <div 
                key={idx} 
                className={`min-h-[120px] p-2 border-r border-b border-slate-50 transition-colors hover:bg-slate-50/50 ${
                  !isCurrentMonth ? 'bg-slate-50/30' : ''
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-xs font-bold w-7 h-7 flex items-center justify-center rounded-full ${
                    isToday ? 'bg-primary-600 text-white shadow-md shadow-primary-100' : 
                    isCurrentMonth ? 'text-slate-700' : 'text-slate-300'
                  }`}>
                    {format(day, 'd')}
                  </span>
                  {dayExchanges.length > 0 && (
                    <span className="text-[10px] font-bold text-primary-600 bg-primary-50 px-1.5 py-0.5 rounded">
                      {dayExchanges.length} trocas
                    </span>
                  )}
                </div>
                <div className="space-y-1">
                  {dayExchanges.slice(0, 3).map(ex => (
                    <div 
                      key={ex.id}
                      className="px-2 py-1 rounded-md bg-slate-100 border-l-2 border-primary-500 text-[10px] font-medium text-slate-600 truncate"
                      title={`${ex.colaborador} - ${ex.epi}`}
                    >
                      {ex.colaborador.split(' ')[0]}: {ex.epi}
                    </div>
                  ))}
                  {dayExchanges.length > 3 && (
                    <div className="text-[9px] text-slate-400 font-bold pl-2">
                      + {dayExchanges.length - 3} mais
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderWeekView = () => {
    const startDate = startOfWeek(currentDate, { weekStartsOn: 0 });
    const weekDays = eachDayOfInterval({ 
      start: startDate, 
      end: addDays(startDate, 6) 
    });

    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="grid grid-cols-7 divide-x divide-slate-100">
          {weekDays.map((day, idx) => {
            const dayExchanges = AGENDA_MOCK.filter(ex => isSameDay(new Date(ex.data), day));
            const isToday = isSameDay(day, new Date(2026, 3, 15));

            return (
              <div key={idx} className="min-h-[500px]">
                <div className={`p-4 text-center border-b border-slate-100 ${isToday ? 'bg-primary-50/30' : 'bg-slate-50/50'}`}>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                    {format(day, 'EEE', { locale: ptBR })}
                  </p>
                  <p className={`text-xl font-bold ${isToday ? 'text-primary-600' : 'text-slate-700'}`}>
                    {format(day, 'd')}
                  </p>
                </div>
                <div className="p-3 space-y-3">
                  {dayExchanges.map(ex => (
                    <div 
                      key={ex.id}
                      className="p-3 rounded-2xl bg-white border border-slate-100 shadow-sm hover:border-primary-200 transition-all group"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="w-3 h-3 text-primary-500" />
                        <span className="text-[10px] font-bold text-slate-500">{ex.hora}</span>
                      </div>
                      <p className="text-xs font-bold text-slate-800 truncate">{ex.colaborador}</p>
                      <p className="text-[10px] text-slate-500 mt-1 truncate">{ex.epi}</p>
                      <div className={`mt-2 h-1 w-full rounded-full ${
                        ex.prioridade === 'Alta' || ex.prioridade === 'Crítica' ? 'bg-red-100' : 'bg-blue-100'
                      }`}>
                        <div className={`h-full rounded-full ${
                          ex.prioridade === 'Alta' || ex.prioridade === 'Crítica' ? 'bg-red-500' : 'bg-blue-500'
                        }`} style={{ width: '40%' }}></div>
                      </div>
                    </div>
                  ))}
                  {dayExchanges.length === 0 && (
                    <div className="py-8 text-center">
                      <p className="text-[10px] text-slate-300 font-bold uppercase tracking-widest">Sem trocas</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderDayView = () => {
    const dayExchanges = AGENDA_MOCK.filter(ex => isSameDay(new Date(ex.data), currentDate));
    const hours = eachHourOfInterval({
      start: startOfDay(currentDate),
      end: addHours(startOfDay(currentDate), 23)
    });

    return (
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center">
              <CalendarIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800">{format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR })}</h3>
              <p className="text-xs text-slate-500">{dayExchanges.length} trocas agendadas para hoje</p>
            </div>
          </div>
        </div>
        
        <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
          <div className="relative">
            {hours.map((hour, idx) => {
              const hourExchanges = dayExchanges.filter(ex => ex.hora.startsWith(format(hour, 'HH')));
              
              return (
                <div key={idx} className="flex border-b border-slate-50 group">
                  <div className="w-20 py-6 px-4 text-right border-r border-slate-50 bg-slate-50/30">
                    <span className="text-xs font-bold text-slate-400">{format(hour, 'HH:mm')}</span>
                  </div>
                  <div className="flex-1 p-2 flex flex-wrap gap-2">
                    {hourExchanges.map(ex => (
                      <div 
                        key={ex.id}
                        className="flex items-center gap-4 p-3 bg-white border border-slate-100 rounded-2xl shadow-sm hover:border-primary-200 transition-all min-w-[250px]"
                      >
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                          <User className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm font-bold text-slate-800">{ex.colaborador}</p>
                          <p className="text-xs text-slate-500">{ex.epi}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                          ex.prioridade === 'Alta' || ex.prioridade === 'Crítica' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'
                        }`}>
                          {ex.prioridade}
                        </div>
                      </div>
                    ))}
                    {hourExchanges.length === 0 && (
                      <div className="flex-1 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="text-[10px] font-bold text-slate-300 hover:text-primary-500 uppercase tracking-widest flex items-center gap-1">
                          + Agendar Troca
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto">
      {renderHeader()}
      
      <AnimatePresence mode="wait">
        <motion.div
          key={viewMode + currentDate.getTime()}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {viewMode === 'month' && renderMonthView()}
          {viewMode === 'week' && renderWeekView()}
          {viewMode === 'day' && renderDayView()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default CalendarioAgenda;
