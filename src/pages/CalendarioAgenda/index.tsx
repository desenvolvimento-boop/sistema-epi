import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  ArrowLeft,
  Loader2,
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
  addHours,
  parseISO,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { deliveryService, type ExchangeAgendaItem } from '../../services/deliveryService';
import './styles.css';

type ViewMode = 'month' | 'week' | 'day';

const CalendarioAgenda = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [items, setItems] = useState<ExchangeAgendaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const loadAgenda = useCallback(async () => {
    setLoading(true);
    try {
      const data = await deliveryService.getExchangeAgenda();
      setItems(data.items);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAgenda();
  }, [loadAgenda]);

  const getItemDate = (item: ExchangeAgendaItem) => {
    try {
      return parseISO(item.due_date);
    } catch {
      return new Date(item.due_date);
    }
  };

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

  const goToToday = () => setCurrentDate(new Date());

  const renderHeader = () => (
    <div className="calendario-header">
      <div className="calendario-header-left">
        <button onClick={() => navigate('/agenda-trocas')} className="calendario-back-btn" type="button">
          <ArrowLeft className="calendario-icon-sm" />
        </button>
        <div>
          <h2 className="calendario-title">Calendário de Trocas</h2>
          <p className="calendario-subtitle">
            {format(currentDate, "MMMM 'de' yyyy", { locale: ptBR })}
          </p>
        </div>
      </div>

      <div className="calendario-view-switcher">
        {(['month', 'week', 'day'] as ViewMode[]).map((mode) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            type="button"
            className={`calendario-view-btn ${
              viewMode === mode ? 'calendario-view-btn-active' : 'calendario-view-btn-inactive'
            }`}
          >
            {mode === 'month' ? 'Mês' : mode === 'week' ? 'Semana' : 'Dia'}
          </button>
        ))}
      </div>

      <div className="calendario-nav-controls">
        <button onClick={goToToday} className="calendario-today-btn" type="button">
          Hoje
        </button>
        <div className="calendario-nav-arrows">
          <button onClick={prevDate} className="calendario-nav-prev" type="button">
            <ChevronLeft className="calendario-icon-sm" />
          </button>
          <button onClick={nextDate} className="calendario-nav-next" type="button">
            <ChevronRight className="calendario-icon-sm" />
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
      <div className="calendario-month-container">
        <div className="calendario-weekdays-header">
          {weekDays.map((day) => (
            <div key={day} className="calendario-weekday-label">
              {day}
            </div>
          ))}
        </div>
        <div className="calendario-days-grid">
          {calendarDays.map((day, idx) => {
            const dayExchanges = items.filter((ex) => isSameDay(getItemDate(ex), day));
            const isCurrentMonth = isSameMonth(day, monthStart);
            const isToday = isSameDay(day, new Date());

            return (
              <div
                key={idx}
                className={`calendario-day-cell ${
                  !isCurrentMonth ? 'calendario-day-cell-other-month' : ''
                }`}
              >
                <div className="calendario-day-header">
                  <span
                    className={`calendario-day-number ${
                      isToday
                        ? 'calendario-day-number-today'
                        : isCurrentMonth
                          ? 'calendario-day-number-current'
                          : 'calendario-day-number-other'
                    }`}
                  >
                    {format(day, 'd')}
                  </span>
                  {dayExchanges.length > 0 && (
                    <span className="calendario-exchange-badge">{dayExchanges.length} trocas</span>
                  )}
                </div>
                <div className="calendario-exchange-list">
                  {dayExchanges.slice(0, 3).map((ex) => (
                    <div
                      key={`${ex.emp_id}-${ex.ept_id}`}
                      className="calendario-exchange-item"
                      title={`${ex.colaborador} - ${ex.epi}`}
                    >
                      {ex.colaborador.split(' ')[0]}: {ex.epi}
                    </div>
                  ))}
                  {dayExchanges.length > 3 && (
                    <div className="calendario-exchange-more">+ {dayExchanges.length - 3} mais</div>
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
    const weekDays = eachDayOfInterval({ start: startDate, end: addDays(startDate, 6) });

    return (
      <div className="calendario-week-container">
        <div className="calendario-week-grid">
          {weekDays.map((day, idx) => {
            const dayExchanges = items.filter((ex) => isSameDay(getItemDate(ex), day));
            const isToday = isSameDay(day, new Date());

            return (
              <div key={idx} className="calendario-week-column">
                <div
                  className={`calendario-week-day-header ${
                    isToday ? 'calendario-week-day-header-today' : 'calendario-week-day-header-normal'
                  }`}
                >
                  <p className="calendario-week-day-label">{format(day, 'EEE', { locale: ptBR })}</p>
                  <p
                    className={`calendario-week-day-number ${
                      isToday ? 'calendario-week-day-number-today' : 'calendario-week-day-number-normal'
                    }`}
                  >
                    {format(day, 'd')}
                  </p>
                </div>
                <div className="calendario-week-events">
                  {dayExchanges.map((ex) => (
                    <div key={`${ex.emp_id}-${ex.ept_id}`} className="calendario-week-event-card">
                      <div className="calendario-week-event-time">
                        <Clock className="calendario-icon-xs" />
                        <span className="calendario-time-text">{format(getItemDate(ex), 'HH:mm')}</span>
                      </div>
                      <p className="calendario-event-name">{ex.colaborador}</p>
                      <p className="calendario-event-epi">{ex.epi}</p>
                      <div
                        className={`calendario-priority-bar-track ${
                          ex.prioridade === 'Alta' || ex.prioridade === 'Crítica'
                            ? 'calendario-priority-bar-track-high'
                            : 'calendario-priority-bar-track-normal'
                        }`}
                      >
                        <div
                          className={`calendario-priority-bar-fill ${
                            ex.prioridade === 'Alta' || ex.prioridade === 'Crítica'
                              ? 'calendario-priority-bar-fill-high'
                              : 'calendario-priority-bar-fill-normal'
                          }`}
                          style={{ width: '40%' }}
                        />
                      </div>
                    </div>
                  ))}
                  {dayExchanges.length === 0 && (
                    <div className="calendario-no-exchanges">
                      <p className="calendario-no-exchanges-label">Sem trocas</p>
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
    const dayExchanges = items.filter((ex) => isSameDay(getItemDate(ex), currentDate));
    const hours = eachHourOfInterval({
      start: startOfDay(currentDate),
      end: addHours(startOfDay(currentDate), 23),
    });

    return (
      <div className="calendario-day-container">
        <div className="calendario-day-header-bar">
          <div className="calendario-day-header-left">
            <div className="calendario-day-icon-box">
              <CalendarIcon className="calendario-icon-md" />
            </div>
            <div>
              <h3 className="calendario-day-title">
                {format(currentDate, "EEEE, d 'de' MMMM", { locale: ptBR })}
              </h3>
              <p className="calendario-day-subtitle">{dayExchanges.length} trocas agendadas para este dia</p>
            </div>
          </div>
        </div>

        <div className="calendario-day-scroll custom-scrollbar">
          <div className="calendario-day-scroll-inner">
            {hours.map((hour, idx) => {
              const hourExchanges = dayExchanges.filter((ex) =>
                format(getItemDate(ex), 'HH') === format(hour, 'HH')
              );

              return (
                <div key={idx} className="calendario-hour-row">
                  <div className="calendario-hour-label">
                    <span className="calendario-hour-text">{format(hour, 'HH:mm')}</span>
                  </div>
                  <div className="calendario-hour-content">
                    {hourExchanges.map((ex) => (
                      <div key={`${ex.emp_id}-${ex.ept_id}`} className="calendario-day-event-card">
                        <div className="calendario-user-avatar">
                          <User className="calendario-icon-sm" />
                        </div>
                        <div className="calendario-event-info">
                          <p className="calendario-event-user-name">{ex.colaborador}</p>
                          <p className="calendario-event-desc">{ex.epi}</p>
                        </div>
                        <div
                          className={`calendario-priority-badge ${
                            ex.prioridade === 'Alta' || ex.prioridade === 'Crítica'
                              ? 'calendario-priority-badge-high'
                              : 'calendario-priority-badge-normal'
                          }`}
                        >
                          {ex.prioridade}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="calendario-container">
        <div className="calendario-loading">
          <Loader2 className="calendario-icon-sm calendario-spin" />
          <span>Carregando calendário...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="calendario-container">
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
