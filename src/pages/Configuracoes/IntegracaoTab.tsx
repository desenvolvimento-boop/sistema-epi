import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ListFiltersBar } from '../../components/list/ListFiltersBar';
import { filterListRows } from '../../utils/listFilters';
import {
  Database,
  Key,
  Link as LinkIcon,
  Loader2,
  Plus,
  RefreshCw,
  Settings as SettingsIcon,
  Trash2,
} from 'lucide-react';
import clsx from 'clsx';
import { dataSourceService, type DataSourceAPI, type IntegrationCatalog } from '../../services/dataSourceService';
import { integrationEntityService, type EntityDashboardCard } from '../../services/integrationEntityService';
import { settingsService, type DataSource as DataSourceMode } from '../../services/settingsService';
import { webhookService, type WebhookAPI } from '../../services/webhookService';
import { apiKeyService, type ApiKeyAPI } from '../../services/apiKeyService';
import { DataSourceModal } from './DataSourceModal';
import { IntegrationEntityPanel } from './IntegrationEntityPanel';
import { WebhookModal } from './WebhookModal';
import { ApiKeyModal } from './ApiKeyModal';

export const IntegracaoTab: React.FC = () => {
  const [dataSources, setDataSources] = useState<DataSourceAPI[]>([]);
  const [entityCards, setEntityCards] = useState<EntityDashboardCard[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookAPI[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [testingId, setTestingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedSource, setSelectedSource] = useState<DataSourceAPI | null>(null);
  const [isDataSourceModalOpen, setIsDataSourceModalOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [dataSourceMode, setDataSourceMode] = useState<DataSourceMode>('MANUAL');
  const [catalog, setCatalog] = useState<IntegrationCatalog | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [sources, dashboard, w, k, settings, catalogData] = await Promise.all([
        dataSourceService.getAll(),
        integrationEntityService.getDashboard(),
        webhookService.getAll(),
        apiKeyService.getAll(),
        settingsService.get(),
        dataSourceService.getCatalog(),
      ]);
      setDataSources(sources);
      setEntityCards(dashboard);
      setWebhooks(w);
      setApiKeys(k);
      setDataSourceMode(settings.dataSource);
      setCatalog(catalogData);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar integrações');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleTest = async (dsoId: number) => {
    setTestingId(dsoId);
    setError(null);
    try {
      await dataSourceService.testConnection(dsoId);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao testar conexão');
    } finally {
      setTestingId(null);
    }
  };

  const handleDelete = async (dsoId: number) => {
    if (!window.confirm('Desativar esta fonte de dados?')) return;
    setError(null);
    try {
      await dataSourceService.remove(dsoId);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao desativar fonte');
    }
  };

  const activeWebhooks = webhooks.filter((w) => w.whk_active === 1).length;
  const activeApiKeys = apiKeys.filter((k) => k.apk_active === 1).length;

  const filteredSources = useMemo(
    () =>
      filterListRows(dataSources, searchTerm, filterValues, {
        searchText: (s) =>
          [s.dso_name, s.dso_type, s.dso_type_label, s.dso_connection_status, String(s.dso_id)]
            .filter(Boolean)
            .join(' '),
        fields: {
          type: (s, value) => s.dso_type === value,
        },
      }),
    [dataSources, searchTerm, filterValues],
  );

  if (loading) {
    return (
      <div className="config-tab-integracao config-nom-loading">
        <Loader2 className="config-icon-lg config-spin" />
        <p>Carregando integrações...</p>
      </div>
    );
  }

  return (
    <div className="config-tab-integracao">
      <div className="config-section-header">
        <div>
          <h3 className="config-section-title">Fontes de Dados</h3>
          <p className="config-section-desc">
            Cadastre conexões com TOTVS RM ou PROTHEUS.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button type="button" className="config-secondary-btn" onClick={() => load()}>
            <RefreshCw className="config-icon-sm" />
            Atualizar
          </button>
          <button
            type="button"
            className="config-primary-btn"
            onClick={() => {
              setSelectedSource(null);
              setIsDataSourceModalOpen(true);
            }}
          >
            <Plus className="config-icon-sm" />
            Nova fonte
          </button>
        </div>
      </div>

      {error && <p className="config-warning-title">{error}</p>}

      {dataSourceMode === 'MANUAL' && (
        <div className="config-warning-card" style={{ marginBottom: '1rem' }}>
          <p className="config-warning-text">
            A origem dos dados está em <strong>Entrada Manual</strong>. O botão{' '}
            <strong>Atualizar agora</strong> funciona manualmente, mas o sync automático por intervalo
            só roda com <strong>Integração Automática</strong> em Configurações → Origem.
          </p>
        </div>
      )}

      <ListFiltersBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar fonte de dados..."
        fields={[
          {
            id: 'type',
            label: 'Tipo',
            type: 'select',
            options: [
              { value: 'TOTVS_RM', label: 'TOTVS RM' },
              { value: 'PROTHEUS', label: 'PROTHEUS' },
            ],
          },
        ]}
        values={filterValues}
        onFieldChange={(id, value) => setFilterValues((prev) => ({ ...prev, [id]: value }))}
        onClear={() => setFilterValues({})}
      />

      <div className="config-table-scroll">
        <table className="config-table">
          <thead>
            <tr className="config-thead-row">
              <th className="config-th table-col-id">ID</th>
              <th className="config-th">Nome</th>
              <th className="config-th">Tipo</th>
              <th className="config-th">Status</th>
              <th className="config-th">Entidades</th>
              <th className="config-th-right">Ações</th>
            </tr>
          </thead>
          <tbody className="config-tbody">
            {dataSources.length === 0 ? (
              <tr className="config-row">
                <td colSpan={6} className="config-cell">
                  Nenhuma fonte de dados cadastrada.
                </td>
              </tr>
            ) : filteredSources.length === 0 ? (
              <tr className="config-row">
                <td colSpan={6} className="config-cell">
                  Nenhuma fonte encontrada com os filtros aplicados.
                </td>
              </tr>
            ) : (
              filteredSources.map((source) => (
                <tr key={source.dso_id} className="config-row">
                  <td className="config-cell table-cell-id">{source.dso_id}</td>
                  <td className="config-cell">
                    <span className="config-company-name">{source.dso_name}</span>
                  </td>
                  <td className="config-cell">
                    <span className="config-module-badge">{source.dso_type_label || source.dso_type}</span>
                    {source.dso_type === 'TOTVS_RM' && source.dso_rm_api_mode && (
                      <span className="config-module-badge" style={{ marginLeft: '0.35rem' }}>
                        {source.dso_rm_api_mode_label || source.dso_rm_api_mode}
                      </span>
                    )}
                  </td>
                  <td className="config-cell">
                    <span
                      className={clsx(
                        'config-company-status',
                        source.dso_connection_status === 'CONNECTED'
                          ? 'config-company-status-active'
                          : source.dso_connection_status === 'ERROR'
                            ? 'config-company-status-inactive'
                            : 'config-company-status-inactive',
                      )}
                    >
                      {source.dso_connection_status}
                    </span>
                  </td>
                  <td className="config-cell">
                    <div className="config-modules-wrapper">
                      {(source.entitySyncs || [])
                        .filter((e) => e.des_enabled)
                        .map((e) => (
                          <span key={e.des_id} className="config-module-badge">
                            {e.des_entity_type_label || e.des_entity_type}
                            {e.des_is_primary ? ' *' : ''}
                          </span>
                        ))}
                      {!source.entitySyncs?.some((e) => e.des_enabled) && (
                        <span className="config-company-sync">—</span>
                      )}
                    </div>
                  </td>
                  <td className="config-cell-right">
                    <button
                      type="button"
                      className="config-action-edit"
                      title="Testar conexão"
                      disabled={testingId === source.dso_id}
                      onClick={() => handleTest(source.dso_id)}
                    >
                      {testingId === source.dso_id ? (
                        <Loader2 className="config-icon-sm config-spin" />
                      ) : (
                        <Database className="config-icon-sm" />
                      )}
                    </button>
                    <button
                      type="button"
                      className="config-action-settings"
                      title="Configurar"
                      onClick={() => {
                        setSelectedSource(source);
                        setIsDataSourceModalOpen(true);
                      }}
                    >
                      <SettingsIcon className="config-icon-sm" />
                    </button>
                    <button
                      type="button"
                      className="config-action-edit"
                      title="Desativar"
                      onClick={() => handleDelete(source.dso_id)}
                    >
                      <Trash2 className="config-icon-sm" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <IntegrationEntityPanel
        cards={entityCards}
        dataSources={dataSources}
        catalog={catalog}
        onRefresh={load}
      />

      <div className="config-cards-grid">
        <div className="config-integration-card">
          <div className="config-card-header">
            <div className="config-card-title-wrapper">
              <div className="config-card-icon">
                <LinkIcon className="config-card-icon-inner" />
              </div>
              <span className="config-card-title">Webhooks Globais</span>
            </div>
            <span className={activeWebhooks > 0 ? 'config-badge-active' : 'config-badge-inactive'}>
              {activeWebhooks > 0 ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          <p className="config-card-desc">Receba notificações em tempo real sobre entregas e vencimentos.</p>
          <button type="button" className="config-card-link" onClick={() => setIsWebhookModalOpen(true)}>
            Configurar Webhook
          </button>
        </div>

        <div className="config-integration-card">
          <div className="config-card-header">
            <div className="config-card-title-wrapper">
              <div className="config-card-icon">
                <Key className="config-card-icon-inner" />
              </div>
              <span className="config-card-title">Chaves de API</span>
            </div>
            <span className={activeApiKeys > 0 ? 'config-badge-active' : 'config-badge-inactive'}>
              {activeApiKeys > 0 ? 'Ativo' : 'Inativo'}
            </span>
          </div>
          <p className="config-card-desc">Gere chaves de acesso para integração direta via REST API.</p>
          <button type="button" className="config-card-link" onClick={() => setIsApiKeyModalOpen(true)}>
            Gerar Nova Chave
          </button>
        </div>
      </div>

      <DataSourceModal
        dataSource={selectedSource}
        isOpen={isDataSourceModalOpen}
        onClose={() => setIsDataSourceModalOpen(false)}
        onSaved={load}
      />
      <WebhookModal
        isOpen={isWebhookModalOpen}
        onClose={() => setIsWebhookModalOpen(false)}
        onSaved={load}
      />
      <ApiKeyModal isOpen={isApiKeyModalOpen} onClose={() => setIsApiKeyModalOpen(false)} onSaved={load} />
    </div>
  );
};
