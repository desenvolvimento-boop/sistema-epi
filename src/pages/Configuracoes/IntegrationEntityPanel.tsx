import React, { useEffect, useMemo, useState } from 'react';
import { AlertCircle, CheckCircle2, ChevronDown, ChevronUp, Loader2, RefreshCw, Save } from 'lucide-react';
import clsx from 'clsx';
import type { EntityDashboardCard, IntegrationSyncLogAPI } from '../../services/integrationEntityService';
import {
  formatSyncSummary,
  IntegrationSyncError,
  integrationEntityService,
  type EntitySyncResult,
} from '../../services/integrationEntityService';
import type {
  DataSourceAPI,
  EntityType,
  IntegrationCatalog,
  SyncInterval,
} from '../../services/dataSourceService';

function formatSyncDate(iso: string | null | undefined) {
  if (!iso) return '—';
  const d = new Date(iso);
  return d.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function statusClass(status: string | undefined) {
  if (status === 'SUCCESS') return 'config-badge-active';
  if (status === 'PARTIAL') return 'config-sync-feedback-partial';
  if (status === 'SYNCING') return 'config-module-badge';
  if (status === 'ERROR') return 'config-badge-inactive';
  return 'config-module-badge';
}

type SyncFeedback = {
  variant: 'success' | 'partial' | 'error';
  title: string;
  summary?: string;
  detail?: string | null;
  statusCode?: number;
  rmDebug?: EntitySyncResult['debug'];
};

type EntityDraft = {
  dsoId: number | '';
  interval: SyncInterval;
};

function compatibleSourcesForEntity(
  entityType: EntityType,
  dataSources: DataSourceAPI[],
  catalog: IntegrationCatalog | null,
): DataSourceAPI[] {
  return dataSources.filter((ds) => {
    if (ds.dso_active !== 1) return false;
    const disabled = catalog?.disabledEntitiesBySource?.[ds.dso_type] || [];
    return !disabled.includes(entityType);
  });
}

function formatSyncErrorDetail(error: IntegrationSyncError): string {
  const parts: string[] = [];
  if (error.statusCode) parts.push(`HTTP ${error.statusCode}`);
  parts.push(error.message);
  if (error.code === 'INTEGRATION_MODE_MANUAL') {
    parts.push('Ative Integração Automática em Configurações → Origem para sync agendado.');
  }
  return parts.join(' · ');
}

function feedbackFromResult(result: EntitySyncResult): SyncFeedback {
  const status = result.config.des_last_sync_status;
  const variant = status === 'ERROR' ? 'error' : status === 'PARTIAL' ? 'partial' : 'success';
  const detail = result.promotion.message || result.config.des_last_sync_message;
  return {
    variant,
    title: status === 'SUCCESS' ? 'Sincronização concluída' : status === 'PARTIAL' ? 'Sincronização parcial' : 'Erro na sincronização',
    summary: formatSyncSummary(result),
    detail: detail ? `Detalhe: ${detail}` : null,
    rmDebug: result.debug,
  };
}

function isSyncInProgressError(error: unknown): boolean {
  return (
    error instanceof IntegrationSyncError
    && (error.code === 'SYNC_ALREADY_RUNNING'
      || (error.statusCode === 409 && error.message.includes('Sincronização já em andamento')))
  );
}

function confirmForceSync(entityLabel: string): boolean {
  return window.confirm(
    `Já existe uma sincronização em andamento para "${entityLabel}". `
    + 'Isso pode indicar que a sync anterior travou ou foi interrompida.\n\n'
    + 'Deseja forçar uma nova sincronização?',
  );
}

function formatRmDebugJson(debug: EntitySyncResult['debug']): string {
  if (!debug?.rmRest) return '';
  try {
    return JSON.stringify(debug.rmRest, null, 2);
  } catch {
    return String(debug.rmRest);
  }
}

function buildDraftsFromCards(cards: EntityDashboardCard[]): Partial<Record<EntityType, EntityDraft>> {
  const drafts: Partial<Record<EntityType, EntityDraft>> = {};
  for (const card of cards) {
    drafts[card.entityType] = {
      dsoId: card.primary?.dso_id ?? '',
      interval: (card.primary?.des_sync_interval as SyncInterval) || '1D',
    };
  }
  return drafts;
}

interface IntegrationEntityPanelProps {
  cards: EntityDashboardCard[];
  dataSources: DataSourceAPI[];
  catalog: IntegrationCatalog | null;
  onRefresh: () => void;
}

export const IntegrationEntityPanel: React.FC<IntegrationEntityPanelProps> = ({
  cards,
  dataSources,
  catalog,
  onRefresh,
}) => {
  const [syncing, setSyncing] = useState<EntityType | null>(null);
  const [savingConfig, setSavingConfig] = useState<EntityType | null>(null);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [syncFeedback, setSyncFeedback] = useState<Partial<Record<EntityType, SyncFeedback>>>({});
  const [logsOpen, setLogsOpen] = useState<Partial<Record<EntityType, boolean>>>({});
  const [entityLogs, setEntityLogs] = useState<Partial<Record<EntityType, IntegrationSyncLogAPI[]>>>({});
  const [loadingLogs, setLoadingLogs] = useState<EntityType | null>(null);
  const [drafts, setDrafts] = useState<Partial<Record<EntityType, EntityDraft>>>(() => buildDraftsFromCards(cards));

  const syncIntervalOptions = useMemo(
    () => catalog?.syncIntervals || [
      { key: '1H' as SyncInterval, label: '1 hora' },
      { key: '6H' as SyncInterval, label: '6 horas' },
      { key: '1D' as SyncInterval, label: '1 dia' },
    ],
    [catalog],
  );

  useEffect(() => {
    setDrafts(buildDraftsFromCards(cards));
  }, [cards]);

  const handleToggleLogs = async (entityType: EntityType) => {
    const isOpen = logsOpen[entityType];
    if (isOpen) {
      setLogsOpen((prev) => ({ ...prev, [entityType]: false }));
      return;
    }
    setLoadingLogs(entityType);
    try {
      const logs = await integrationEntityService.getLogs(entityType);
      setEntityLogs((prev) => ({ ...prev, [entityType]: logs.slice(0, 5) }));
      setLogsOpen((prev) => ({ ...prev, [entityType]: true }));
    } catch (e) {
      setGlobalError(e instanceof Error ? e.message : 'Erro ao carregar logs');
    } finally {
      setLoadingLogs(null);
    }
  };

  const handleSaveConfig = async (entityType: EntityType) => {
    const draft = drafts[entityType];
    if (!draft?.dsoId) {
      setGlobalError('Selecione uma fonte de dados antes de salvar.');
      return;
    }

    setSavingConfig(entityType);
    setGlobalError(null);
    try {
      await integrationEntityService.configureEntity(entityType, {
        dsoId: draft.dsoId,
        des_sync_interval: draft.interval,
      });
      await onRefresh();
    } catch (e) {
      setGlobalError(e instanceof Error ? e.message : 'Erro ao salvar configuração');
    } finally {
      setSavingConfig(null);
    }
  };

  const handleSync = async (entityType: EntityType) => {
    const card = cards.find((c) => c.entityType === entityType);
    const entityLabel = card?.entityTypeLabel || entityType;
    const forceInitially = card?.primary?.des_last_sync_status === 'SYNCING';

    if (forceInitially && !confirmForceSync(entityLabel)) {
      return;
    }

    setSyncing(entityType);
    setGlobalError(null);
    setSyncFeedback((prev) => {
      const next = { ...prev };
      delete next[entityType];
      return next;
    });

    const finishSuccess = async (result: EntitySyncResult) => {
      setSyncFeedback((prev) => ({
        ...prev,
        [entityType]: feedbackFromResult(result),
      }));
      await onRefresh();
      if (logsOpen[entityType]) {
        const logs = await integrationEntityService.getLogs(entityType);
        setEntityLogs((prev) => ({ ...prev, [entityType]: logs.slice(0, 5) }));
      }
    };

    const handleSyncError = async (e: unknown, retried = false) => {
      if (!retried && isSyncInProgressError(e)) {
        if (confirmForceSync(entityLabel)) {
          try {
            const result = await integrationEntityService.sync(entityType, { force: true });
            await finishSuccess(result);
            return;
          } catch (retryErr) {
            await handleSyncError(retryErr, true);
            return;
          }
        }
        return;
      }

      if (e instanceof IntegrationSyncError && e.result) {
        setSyncFeedback((prev) => ({
          ...prev,
          [entityType]: {
            variant: 'error',
            title: 'Erro na sincronização',
            summary: formatSyncSummary(e.result),
            detail: formatSyncErrorDetail(e),
            statusCode: e.statusCode,
            rmDebug: e.result?.debug,
          },
        }));
        await onRefresh();
      } else if (e instanceof IntegrationSyncError) {
        setSyncFeedback((prev) => ({
          ...prev,
          [entityType]: {
            variant: 'error',
            title: 'Erro na sincronização',
            detail: formatSyncErrorDetail(e),
            statusCode: e.statusCode,
            rmDebug: e.result?.debug,
          },
        }));
      } else {
        const message = e instanceof Error ? e.message : 'Erro na sincronização';
        setGlobalError(message);
        setSyncFeedback((prev) => ({
          ...prev,
          [entityType]: {
            variant: 'error',
            title: 'Erro na sincronização',
            detail: message,
          },
        }));
      }
    };

    try {
      const result = await integrationEntityService.sync(entityType, { force: forceInitially });
      await finishSuccess(result);
    } catch (e) {
      await handleSyncError(e);
    } finally {
      setSyncing(null);
    }
  };

  const visibleCards = cards.filter((card) => {
    if (card.entityType === 'EPI') {
      return compatibleSourcesForEntity('EPI', dataSources, catalog).length > 0;
    }
    return true;
  });

  return (
    <div>
      <div className="config-section-header">
        <div>
          <h3 className="config-section-title">Integração por entidade</h3>
          <p className="config-section-desc">
            Escolha a fonte e o intervalo de sincronização para cada entidade.
          </p>
        </div>
      </div>

      {globalError && <p className="config-warning-title">{globalError}</p>}

      <div className="config-cards-grid">
        {visibleCards.map((card) => {
          const primary = card.primary;
          const feedback = syncFeedback[card.entityType];
          const isSyncing = syncing === card.entityType;
          const draft = drafts[card.entityType] || { dsoId: '', interval: '1D' as SyncInterval };
          const compatibleSources = compatibleSourcesForEntity(card.entityType, dataSources, catalog);
          const savedDsoId = primary?.dso_id ?? '';
          const savedInterval = (primary?.des_sync_interval as SyncInterval) || '1D';
          const configDirty = draft.dsoId !== savedDsoId || draft.interval !== savedInterval;
          const isSaving = savingConfig === card.entityType;

          return (
            <div key={card.entityType} className="config-integration-card">
              <div className="config-card-header">
                <span className="config-card-title">{card.entityTypeLabel}</span>
                <span className={statusClass(isSyncing ? 'SYNCING' : primary?.des_last_sync_status)}>
                  {isSyncing ? 'SYNCING' : primary?.des_last_sync_status || 'IDLE'}
                </span>
              </div>

              <div
                className="config-card-desc"
                style={{ display: 'grid', gap: '0.5rem', marginTop: '0.5rem' }}
              >
                <label className="config-form-label">
                  Fonte de dados
                  <select
                    className="config-form-input"
                    value={draft.dsoId}
                    onChange={(e) => {
                      const value = e.target.value ? Number(e.target.value) : '';
                      setDrafts((prev) => ({
                        ...prev,
                        [card.entityType]: { ...draft, dsoId: value },
                      }));
                    }}
                  >
                    <option value="">Selecione uma fonte...</option>
                    {compatibleSources.map((src) => (
                      <option key={src.dso_id} value={src.dso_id}>
                        {src.dso_name} ({src.dso_type_label || src.dso_type})
                      </option>
                    ))}
                  </select>
                </label>

                <label className="config-form-label">
                  Intervalo de atualização
                  <select
                    className="config-form-input"
                    value={draft.interval}
                    disabled={!draft.dsoId}
                    onChange={(e) => {
                      setDrafts((prev) => ({
                        ...prev,
                        [card.entityType]: {
                          ...draft,
                          interval: e.target.value as SyncInterval,
                        },
                      }));
                    }}
                  >
                    {syncIntervalOptions.map((opt) => (
                      <option key={opt.key} value={opt.key}>{opt.label}</option>
                    ))}
                  </select>
                </label>

                <button
                  type="button"
                  className="config-secondary-btn"
                  style={{ justifySelf: 'start' }}
                  disabled={!draft.dsoId || !configDirty || isSaving}
                  onClick={() => handleSaveConfig(card.entityType)}
                >
                  {isSaving ? (
                    <Loader2 className="config-icon-sm config-spin" />
                  ) : (
                    <Save className="config-icon-sm" />
                  )}
                  Salvar configuração
                </button>
              </div>

              <div className="config-card-desc" style={{ display: 'grid', gap: '0.35rem', marginTop: '0.75rem' }}>
                <span><strong>Última atualização:</strong> {formatSyncDate(primary?.des_last_sync_at)}</span>
                <span><strong>Próxima atualização:</strong> {formatSyncDate(primary?.des_next_sync_at)}</span>
                <span><strong>Registros na staging:</strong> {primary?.des_record_count ?? 0}</span>
                <span><strong>Atualizados na última sync:</strong> {primary?.des_last_updated_count ?? 0}</span>
                {primary?.des_last_sync_message && primary.des_last_sync_status === 'ERROR' && !feedback && (
                  <span className="config-sync-feedback-error-inline">
                    <strong>Último erro:</strong> {primary.des_last_sync_message}
                  </span>
                )}
              </div>

              {feedback && (
                <div
                  className={clsx(
                    'config-sync-feedback',
                    feedback.variant === 'success' && 'config-sync-feedback-success',
                    feedback.variant === 'partial' && 'config-sync-feedback-partial-box',
                    feedback.variant === 'error' && 'config-sync-feedback-error',
                  )}
                >
                  <div className="config-sync-feedback-header">
                    {feedback.variant === 'success' ? (
                      <CheckCircle2 className="config-icon-sm" />
                    ) : (
                      <AlertCircle className="config-icon-sm" />
                    )}
                    <strong>{feedback.title}</strong>
                  </div>
                  {feedback.summary && <p className="config-sync-feedback-summary">{feedback.summary}</p>}
                  {feedback.detail && <p className="config-sync-feedback-detail">{feedback.detail}</p>}
                  {feedback.statusCode && feedback.variant === 'error' && (
                    <p className="config-sync-feedback-detail">Código HTTP: {feedback.statusCode}</p>
                  )}
                  {feedback.rmDebug?.rmRest && (
                    <details className="config-sync-debug-details" style={{ marginTop: '0.5rem' }}>
                      <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
                        Retorno bruto RM REST (amostra)
                      </summary>
                      <pre
                        className="config-sync-debug-pre"
                        style={{
                          marginTop: '0.5rem',
                          maxHeight: '280px',
                          overflow: 'auto',
                          fontSize: '0.75rem',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-word',
                        }}
                      >
                        {formatRmDebugJson(feedback.rmDebug)}
                      </pre>
                    </details>
                  )}
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
                <button
                  type="button"
                  className="config-primary-btn"
                  disabled={!primary || isSyncing || configDirty}
                  onClick={() => handleSync(card.entityType)}
                >
                  {isSyncing ? (
                    <Loader2 className="config-icon-sm config-spin" />
                  ) : (
                    <RefreshCw className="config-icon-sm" />
                  )}
                  {isSyncing ? 'Sincronizando...' : 'Atualizar agora'}
                </button>
                <button
                  type="button"
                  className="config-secondary-btn"
                  disabled={loadingLogs === card.entityType}
                  onClick={() => handleToggleLogs(card.entityType)}
                >
                  {loadingLogs === card.entityType ? (
                    <Loader2 className="config-icon-sm config-spin" />
                  ) : logsOpen[card.entityType] ? (
                    <ChevronUp className="config-icon-sm" />
                  ) : (
                    <ChevronDown className="config-icon-sm" />
                  )}
                  Ver logs
                </button>
              </div>

              {logsOpen[card.entityType] && (
                <div className="config-sync-logs" style={{ marginTop: '0.75rem' }}>
                  {(entityLogs[card.entityType] || []).length === 0 ? (
                    <p className="config-section-desc">Nenhum log de sincronização registrado.</p>
                  ) : (
                    <ul className="config-sync-logs-list" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
                      {(entityLogs[card.entityType] || []).map((log) => (
                        <li key={log.isl_id} className="config-sync-log-item" style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                          <span className={statusClass(log.isl_status)} style={{ marginRight: '0.35rem' }}>
                            {log.isl_status}
                          </span>
                          <span>{formatSyncDate(log.isl_started_at)}</span>
                          {' · '}
                          <span>OK: {log.isl_records_ok} / Falha: {log.isl_records_fail}</span>
                          {log.isl_message && (
                            <p className="config-sync-feedback-detail" style={{ margin: '0.25rem 0 0' }}>
                              {log.isl_message}
                            </p>
                          )}
                          {log.rmDebug && (
                            <details style={{ marginTop: '0.35rem' }}>
                              <summary style={{ cursor: 'pointer', fontSize: '0.8rem' }}>
                                Retorno bruto RM REST
                              </summary>
                              <pre
                                style={{
                                  marginTop: '0.35rem',
                                  maxHeight: '200px',
                                  overflow: 'auto',
                                  fontSize: '0.7rem',
                                  whiteSpace: 'pre-wrap',
                                }}
                              >
                                {JSON.stringify(log.rmDebug, null, 2)}
                              </pre>
                            </details>
                          )}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
