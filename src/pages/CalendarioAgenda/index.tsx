import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  User,
  ArrowLeft,
  Loader2,
  Package,
  ShieldCheck,
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
  parseISO,
} from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Modal } from '../../components/ui/Modal';
import { deliveryService, type ExchangeAgendaItem } from '../../services/deliveryService';
import './styles.css';

type ViewMode = 'month' | 'week' | 'day';

const CalendarioAgenda = () => {
  const navigate = useNavigate();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [items, setItems] = useState<ExchangeAgendaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<ExchangeAgendaItem | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

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

  const formatDate = (iso: string) => {
    try {
      return format(parseISO(iso), 'dd/MM/yyyy');
    } catch {
      return iso;
    }
  };

  const openDetail = (item: ExchangeAgendaItem) => {
    setSelectedItem(item);
    setIsDetailModalOpen(true);
  };

  const closeDetail = () => {
    setIsDetailModalOpen(false);
    setSelectedItem(null);
  };

  const getPriorityClass = (prioridade: string) => {
    switch (prioridade) {
      case 'Crítica':
        return 'calendario-detail-priority-critica';
      case 'Alta':
        return 'calendario-detail-priority-alta';
      case 'Média':
        return 'calendario-detail-priority-media';
      default:
        return 'calendario-detail-priority-default';
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
                    <button
                      key={`${ex.emp_id}-${ex.ept_id}`}
                      type="button"
                      className="calendario-exchange-item calendario-event-clickable"
                      title={`${ex.colaborador} - ${ex.epi}`}
                      onClick={() => openDetail(ex)}
                    >
                      {ex.colaborador.split(' ')[0]}: {ex.epi}
                    </button>
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
                    <button
                      key={`${ex.emp_id}-${ex.ept_id}`}
                      type="button"
                      className="calendario-week-event-card calendario-event-clickable"
                      onClick={() => openDetail(ex)}
                    >
                      <div className="calendario-week-event-time">
                        <Clock className="calendario-icon-xs" />
                        <span className="calendario-time-text">Dia inteiro</span>
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
                    </button>
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
          <div className="calendario-day-list">
            {dayExchanges.length === 0 ? (
              <p className="calendario-no-exchanges-label">Sem trocas neste dia</p>
            ) : (
              dayExchanges.map((ex) => (
                <button
                  key={`${ex.emp_id}-${ex.ept_id}`}
                  type="button"
                  className="calendario-day-event-card calendario-event-clickable"
                  onClick={() => openDetail(ex)}
                >
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
                </button>
              ))
            )}
          </div>
        </div>
      </div>
    );
  };

  const renderDetailModal = () => {
    if (!selectedItem) return null;

    const lastVariant = selectedItem.variants.find((v) => v.epv_id === selectedItem.last_epv_id);

    return (
      <Modal isOpen={isDetailModalOpen} onClose={closeDetail} title="Detalhes da Troca">
        <div className="calendario-detail-content">
          <div className="calendario-detail-info">
            <div className="calendario-detail-info-icon">
              <ShieldCheck className="calendario-icon-md" />
            </div>
            <div>
              <p className="calendario-detail-info-title">Substituição programada</p>
              <p className="calendario-detail-info-desc">
                Informações do colaborador e do EPI conforme a agenda de trocas.
              </p>
            </div>
          </div>

          <div className="calendario-detail-grid">
            <div className="calendario-detail-field">
              <p className="calendario-detail-label">Colaborador</p>
              <p className="calendario-detail-value">{selectedItem.colaborador}</p>
            </div>
            <div className="calendario-detail-field">
              <p className="calendario-detail-label">Tipo de EPI</p>
              <p className="calendario-detail-value">{selectedItem.epi}</p>
            </div>
            <div className="calendario-detail-field">
              <p className="calendario-detail-label">Data prevista</p>
              <p className="calendario-detail-value">{formatDate(selectedItem.due_date)}</p>
            </div>
            <div className="calendario-detail-field">
              <p className="calendario-detail-label">Prazo efetivo</p>
              <p className="calendario-detail-value">
                {selectedItem.effective_days != null ? `${selectedItem.effective_days} dias` : '—'}
              </p>
            </div>
            <div className="calendario-detail-field">
              <p className="calendario-detail-label">Status</p>
              <span
                className={`calendario-detail-status ${
                  selectedItem.status === 'Atrasado'
                    ? 'calendario-detail-status-atrasado'
                    : 'calendario-detail-status-pendente'
                }`}
              >
                {selectedItem.status}
              </span>
            </div>
            <div className="calendario-detail-field">
              <p className="calendario-detail-label">Prioridade</p>
              <span className={`calendario-detail-priority ${getPriorityClass(selectedItem.prioridade)}`}>
                {selectedItem.prioridade}
              </span>
            </div>
            {selectedItem.ca && (
              <div className="calendario-detail-field">
                <p className="calendario-detail-label">CA (última entrega)</p>
                <p className="calendario-detail-value--mono">{selectedItem.ca}</p>
              </div>
            )}
            {lastVariant && (
              <div className="calendario-detail-field calendario-detail-field-full">
                <p className="calendario-detail-label">Última variante entregue</p>
                <p className="calendario-detail-value">
                  {[lastVariant.epv_manufacturer, lastVariant.epv_model].filter(Boolean).join(' · ')} — CA{' '}
                  {lastVariant.epv_ca}
                </p>
              </div>
            )}
            {selectedItem.rule_hint && (
              <div className="calendario-detail-field calendario-detail-field-full">
                <p className="calendario-detail-label">Regra aplicada</p>
                <p className="calendario-detail-hint">{selectedItem.rule_hint}</p>
              </div>
            )}
          </div>

          {selectedItem.variants.length > 0 && (
            <div className="calendario-detail-variants">
              <p className="calendario-detail-label calendario-detail-label-with-icon">
                <Package className="calendario-icon-xs" />
                Variantes homologadas ({selectedItem.variants.length})
              </p>
              <ul className="calendario-detail-variant-list">
                {selectedItem.variants.map((v) => (
                  <li key={v.epv_id} className="calendario-detail-variant-item">
                    {[v.epv_manufacturer, v.epv_model].filter(Boolean).join(' · ')} — CA {v.epv_ca}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="calendario-detail-footer">
            <button type="button" className="calendario-detail-btn-close" onClick={closeDetail}>
              Fechar
            </button>
            <button
              type="button"
              className="calendario-detail-btn-agenda"
              onClick={() => {
                closeDetail();
                navigate('/agenda-trocas');
              }}
            >
              Ir para Agenda de Trocas
            </button>
          </div>
        </div>
      </Modal>
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
      {renderDetailModal()}
    </div>
  );
};

export default CalendarioAgenda;
