import React, { useState, useEffect, useCallback } from 'react';
import {
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  User,
  Package,
  RefreshCw,
  ShieldCheck,
  Loader2,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Modal } from '../../components/ui/Modal';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  deliveryService,
  type ExchangeAgendaItem,
  type ExchangeAgendaResponse,
} from '../../services/deliveryService';
import { sectionService, type SectionAPI } from '../../services/sectionService';
import './styles.css';

const AgendaTrocas = () => {
  const navigate = useNavigate();
  const [agenda, setAgenda] = useState<ExchangeAgendaResponse | null>(null);
  const [sections, setSections] = useState<SectionAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedExchange, setSelectedExchange] = useState<ExchangeAgendaItem | null>(null);
  const [selectedEpvId, setSelectedEpvId] = useState<string>('');
  const [notes, setNotes] = useState('');
  const [saving, setSaving] = useState(false);
  const [priorityFilter, setPriorityFilter] = useState('');
  const [secFilter, setSecFilter] = useState('');
  const [fromFilter, setFromFilter] = useState('');
  const [toFilter, setToFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { canCreate } = useAuth();

  useEffect(() => {
    sectionService.getActive().then(setSections).catch(() => setSections([]));
  }, []);

  const loadAgenda = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await deliveryService.getExchangeAgenda({
        prioridade: priorityFilter || undefined,
        sec_id: secFilter ? Number(secFilter) : undefined,
        from: fromFilter || undefined,
        to: toFilter || undefined,
      });
      setAgenda(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar agenda de trocas');
      setAgenda(null);
    } finally {
      setLoading(false);
    }
  }, [priorityFilter, secFilter, fromFilter, toFilter]);

  useEffect(() => {
    loadAgenda();
  }, [loadAgenda]);

  const handleOpenRegister = (item: ExchangeAgendaItem) => {
    if (item.variants.length === 0) return;
    setSelectedExchange(item);
    const defaultVariant = item.variants.find((v) => v.epv_id === item.last_epv_id) ?? item.variants[0];
    setSelectedEpvId(defaultVariant ? String(defaultVariant.epv_id) : '');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleConfirmExchange = async () => {
    if (!selectedExchange || !selectedEpvId) {
      alert('Selecione a variante homologada para registrar a troca.');
      return;
    }
    setSaving(true);
    try {
      await deliveryService.create({
        emp_id: selectedExchange.emp_id,
        epv_id: Number(selectedEpvId),
        dlv_date: new Date().toISOString().slice(0, 10),
        dlv_kind: 'Troca',
        dlv_notes: notes.trim() || null,
      });
      setIsModalOpen(false);
      setSelectedExchange(null);
      setSuccessMessage('Troca registrada com sucesso. O cronograma foi atualizado.');
      await loadAgenda();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao registrar troca');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (iso: string) => {
    try {
      return format(parseISO(iso), 'dd/MM/yyyy');
    } catch {
      return iso;
    }
  };

  const getPriorityClass = (prioridade: string) => {
    switch (prioridade) {
      case 'Crítica':
        return 'agenda-priority-critica';
      case 'Alta':
        return 'agenda-priority-alta';
      case 'Média':
        return 'agenda-priority-media';
      default:
        return 'agenda-priority-default';
    }
  };

  const items = agenda?.items ?? [];
  const stats = agenda?.stats;

  return (
    <div className="agenda-container">
      <div className="agenda-header">
        <div>
          <h2 className="agenda-title">Agenda de Trocas</h2>
          <p className="agenda-subtitle">Planejamento preventivo de substituição de EPIs por vencimento.</p>
        </div>
        <div className="agenda-header-actions">
          <button
            onClick={loadAgenda}
            className="agenda-btn-refresh"
            type="button"
            disabled={loading}
            title="Atualizar agenda"
          >
            <RefreshCw className={`agenda-icon-md ${loading ? 'agenda-spin' : ''}`} />
            Atualizar
          </button>
          <button
            onClick={() => navigate('/agenda-trocas/calendario')}
            className="agenda-btn-calendar"
            type="button"
          >
            Visualizar Calendário
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="agenda-success-banner" role="status">
          <CheckCircle2 className="agenda-icon-md" />
          <span>{successMessage}</span>
          <button type="button" className="agenda-banner-dismiss" onClick={() => setSuccessMessage(null)}>
            Fechar
          </button>
        </div>
      )}

      {error && (
        <div className="agenda-error-banner" role="alert">
          <AlertCircle className="agenda-icon-md" />
          <span>{error}</span>
          <button type="button" className="agenda-banner-retry" onClick={loadAgenda}>
            Tentar novamente
          </button>
        </div>
      )}

      <div className="agenda-stats-grid">
        <div className="agenda-stat-card">
          <p className="agenda-stat-label">Trocas para Hoje</p>
          <div className="agenda-stat-row">
            <h3 className="agenda-stat-value">{stats?.hoje ?? '—'}</h3>
            <span className="agenda-stat-badge">{stats?.concluidasHoje ?? 0} concluídas</span>
          </div>
        </div>
        <div className="agenda-stat-card">
          <p className="agenda-stat-label">Atrasadas</p>
          <div className="agenda-stat-row">
            <h3 className="agenda-stat-value--danger">{stats?.atrasadas ?? '—'}</h3>
            <AlertCircle className="agenda-icon-danger" />
          </div>
        </div>
        <div className="agenda-stat-card">
          <p className="agenda-stat-label">Próximos 7 Dias</p>
          <div className="agenda-stat-row">
            <h3 className="agenda-stat-value">{stats?.proximos7 ?? '—'}</h3>
            <Calendar className="agenda-icon-muted" />
          </div>
        </div>
        <div className="agenda-stat-card">
          <p className="agenda-stat-label">Itens na agenda</p>
          <div className="agenda-stat-row">
            <h3 className="agenda-stat-value--primary">{agenda?.items.length ?? 0}</h3>
            <RefreshCw className="agenda-icon-primary" />
          </div>
        </div>
      </div>

      <div className="agenda-table-container">
        <div className="agenda-table-header">
          <h3 className="agenda-table-title">Cronograma de Substituição</h3>
          <div className="agenda-filter-row">
            <span className="agenda-filter-label">Filtrar:</span>
            <select
              className="agenda-filter-select"
              value={secFilter}
              onChange={(e) => setSecFilter(e.target.value)}
              aria-label="Setor"
            >
              <option value="">Todos os setores</option>
              {sections.map((s) => (
                <option key={s.sec_id} value={s.sec_id}>
                  {s.sec_description}
                </option>
              ))}
            </select>
            <select
              className="agenda-filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              aria-label="Prioridade"
            >
              <option value="">Todas as prioridades</option>
              <option value="Crítica">Crítica</option>
              <option value="Alta">Alta</option>
              <option value="Média">Média</option>
              <option value="Baixa">Baixa</option>
            </select>
            <input
              type="date"
              className="agenda-filter-date"
              value={fromFilter}
              onChange={(e) => setFromFilter(e.target.value)}
              aria-label="Data inicial"
              title="Vencimento a partir de"
            />
            <input
              type="date"
              className="agenda-filter-date"
              value={toFilter}
              onChange={(e) => setToFilter(e.target.value)}
              aria-label="Data final"
              title="Vencimento até"
            />
          </div>
        </div>
        <div className="agenda-table-scroll">
          {loading ? (
            <div className="agenda-loading">
              <Loader2 className="agenda-icon-md agenda-spin" />
              <span>Carregando agenda...</span>
            </div>
          ) : (
            <table className="agenda-table">
              <thead>
                <tr className="agenda-table-head-row">
                  <th className="agenda-th">Colaborador</th>
                  <th className="agenda-th">Tipo de EPI</th>
                  <th className="agenda-th">Data Prevista</th>
                  <th className="agenda-th">Prazo efetivo</th>
                  <th className="agenda-th">Status</th>
                  <th className="agenda-th">Prioridade</th>
                  <th className="agenda-th--right">Ações</th>
                </tr>
              </thead>
              <tbody className="agenda-tbody">
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="agenda-td agenda-empty">
                      {error ? 'Não foi possível carregar a agenda.' : 'Nenhuma troca pendente na agenda.'}
                    </td>
                  </tr>
                ) : (
                  items.map((item) => (
                    <tr key={`${item.emp_id}-${item.ept_id}`} className="agenda-row">
                      <td className="agenda-td">
                        <div className="agenda-collaborator">
                          <div className="agenda-avatar">
                            <User className="agenda-avatar-icon" />
                          </div>
                          <span className="agenda-collaborator-name">{item.colaborador}</span>
                        </div>
                      </td>
                      <td className="agenda-td">
                        <div className="agenda-epi-cell">
                          <Package className="agenda-epi-icon" />
                          <span className="agenda-epi-text">{item.epi}</span>
                        </div>
                      </td>
                      <td className="agenda-td">
                        <div className="agenda-date-cell">
                          <Clock
                            className={`agenda-clock-icon ${
                              item.status === 'Atrasado' ? 'agenda-clock-icon-late' : 'agenda-clock-icon-normal'
                            }`}
                          />
                          <span
                            className={`agenda-date-text ${
                              item.status === 'Atrasado' ? 'agenda-date-late' : 'agenda-date-normal'
                            }`}
                          >
                            {formatDate(item.due_date)}
                          </span>
                        </div>
                      </td>
                      <td className="agenda-td">
                        <span className="agenda-effective-days">
                          {item.effective_days != null ? `${item.effective_days} dias` : '—'}
                        </span>
                        {item.rule_hint && (
                          <p className="agenda-rule-hint" title={item.rule_hint}>
                            {item.rule_hint}
                          </p>
                        )}
                      </td>
                      <td className="agenda-td">
                        <span
                          className={`agenda-status-badge ${
                            item.status === 'Atrasado' ? 'agenda-status-atrasado' : 'agenda-status-pendente'
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="agenda-td">
                        <span className={`agenda-priority-badge ${getPriorityClass(item.prioridade)}`}>
                          {item.prioridade}
                        </span>
                      </td>
                      <td className="agenda-td--right">
                        {canCreate('/agenda-trocas') && (
                          <button
                            onClick={() => handleOpenRegister(item)}
                            className="agenda-btn-register"
                            type="button"
                            disabled={item.variants.length === 0}
                            title={
                              item.variants.length === 0
                                ? 'Cadastre uma variante homologada para este tipo de EPI'
                                : 'Registrar troca'
                            }
                          >
                            Registrar Troca
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Registrar Troca de EPI"
      >
        {selectedExchange && (
          <div className="agenda-modal-content">
            <div className="agenda-modal-info">
              <div className="agenda-modal-info-icon">
                <ShieldCheck className="agenda-icon-shield" />
              </div>
              <div>
                <p className="agenda-modal-info-title">Confirmação de Substituição</p>
                <p className="agenda-modal-info-desc">
                  Selecione a variante homologada e confirme a entrega do novo EPI.
                </p>
              </div>
            </div>

            <div className="agenda-modal-grid">
              <div className="agenda-modal-field">
                <p className="agenda-modal-label">Colaborador</p>
                <p className="agenda-modal-value">{selectedExchange.colaborador}</p>
              </div>
              <div className="agenda-modal-field">
                <p className="agenda-modal-label">Tipo de EPI</p>
                <p className="agenda-modal-value">{selectedExchange.epi}</p>
              </div>
              <div className="agenda-modal-field">
                <p className="agenda-modal-label">Data Prevista</p>
                <p className="agenda-modal-value--light">{formatDate(selectedExchange.due_date)}</p>
              </div>
              <div className="agenda-modal-field">
                <p className="agenda-modal-label">Status</p>
                <p className="agenda-modal-value--light">{selectedExchange.status}</p>
              </div>
              <div className="agenda-modal-field agenda-modal-field-full">
                <label className="agenda-modal-label" htmlFor="agenda-variant-select">
                  Variante homologada <span className="agenda-required">*</span>
                </label>
                <select
                  id="agenda-variant-select"
                  className="agenda-modal-select"
                  value={selectedEpvId}
                  onChange={(e) => setSelectedEpvId(e.target.value)}
                  required
                >
                  <option value="">Selecione a variante</option>
                  {selectedExchange.variants.map((v) => (
                    <option key={v.epv_id} value={v.epv_id}>
                      {[v.epv_manufacturer, v.epv_model].filter(Boolean).join(' · ')} — CA {v.epv_ca}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="agenda-modal-textarea-group">
              <label className="agenda-modal-textarea-label" htmlFor="agenda-notes">
                Observações (Opcional)
              </label>
              <textarea
                id="agenda-notes"
                className="agenda-modal-textarea"
                placeholder="Ex: Troca antecipada por desgaste excessivo..."
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>

            <div className="agenda-modal-footer">
              <button onClick={() => setIsModalOpen(false)} className="agenda-btn-cancel" type="button" disabled={saving}>
                Cancelar
              </button>
              <button onClick={handleConfirmExchange} className="agenda-btn-confirm" type="button" disabled={saving}>
                <CheckCircle2 className="agenda-icon-check" />
                {saving ? 'Salvando...' : 'Confirmar Entrega'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AgendaTrocas;