import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ListFiltersBar } from '../../components/list/ListFiltersBar';
import { filterListRows } from '../../utils/listFilters';
import {
  Key,
  Link as LinkIcon,
  Loader2,
  RefreshCw,
  Settings as SettingsIcon,
} from 'lucide-react';
import clsx from 'clsx';
import { companyService, type CompanyIntegrationAPI } from '../../services/companyService';
import { integrationService } from '../../services/integrationService';
import { webhookService, type WebhookAPI } from '../../services/webhookService';
import { apiKeyService, type ApiKeyAPI } from '../../services/apiKeyService';
import { IntegracaoModal } from './IntegracaoModal';
import { WebhookModal } from './WebhookModal';
import { ApiKeyModal } from './ApiKeyModal';

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

export const IntegracaoTab: React.FC = () => {
  const [companies, setCompanies] = useState<CompanyIntegrationAPI[]>([]);
  const [webhooks, setWebhooks] = useState<WebhookAPI[]>([]);
  const [apiKeys, setApiKeys] = useState<ApiKeyAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [syncingId, setSyncingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedCompany, setSelectedCompany] = useState<CompanyIntegrationAPI | null>(null);
  const [isIntegracaoModalOpen, setIsIntegracaoModalOpen] = useState(false);
  const [isWebhookModalOpen, setIsWebhookModalOpen] = useState(false);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [c, w, k] = await Promise.all([
        companyService.getAll(),
        webhookService.getAll(),
        apiKeyService.getAll(),
      ]);
      setCompanies(c);
      setWebhooks(w);
      setApiKeys(k);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar integrações');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSync = async (comId: number) => {
    setSyncingId(comId);
    setError(null);
    try {
      await integrationService.sync(comId);
      await load();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro na sincronização');
    } finally {
      setSyncingId(null);
    }
  };

  const activeWebhooks = webhooks.filter((w) => w.whk_active === 1).length;
  const activeApiKeys = apiKeys.filter((k) => k.apk_active === 1).length;

  const filteredCompanies = useMemo(
    () =>
      filterListRows(companies, searchTerm, filterValues, {
        searchText: (c) =>
          [
            c.com_description,
            c.com_integration_source,
            c.statusLabel,
            (c.syncModuleLabels || []).join(' '),
            String(c.com_id),
          ]
            .filter(Boolean)
            .join(' '),
        fields: {
          status: (c, value) =>
            value === '1' ? Boolean(c.com_active) : !c.com_active,
        },
      }),
    [companies, searchTerm, filterValues],
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
          <h3 className="config-section-title">Integração Ativa</h3>
          <p className="config-section-desc">Gerencie a conexão do sistema com a sua empresa.</p>
        </div>
        <button type="button" className="config-primary-btn" onClick={() => load()}>
          <RefreshCw className="config-icon-sm" />
          Atualizar
        </button>
      </div>

      {error && <p className="config-warning-title">{error}</p>}

      <ListFiltersBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar empresa ou módulo de integração..."
        fields={[
          {
            id: 'status',
            label: 'Status',
            type: 'select',
            options: [
              { value: '1', label: 'Ativo' },
              { value: '0', label: 'Inativo' },
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
              <th className="config-th">Empresa</th>
              <th className="config-th">Status</th>
              <th className="config-th">Última Sincronização</th>
              <th className="config-th">Módulos</th>
              <th className="config-th-right">Ações</th>
            </tr>
          </thead>
          <tbody className="config-tbody">
            {companies.length === 0 ? (
              <tr className="config-row">
                <td colSpan={6} className="config-cell">
                  Nenhuma empresa cadastrada.
                </td>
              </tr>
            ) : filteredCompanies.length === 0 ? (
              <tr className="config-row">
                <td colSpan={6} className="config-cell">
                  Nenhuma empresa encontrada com os filtros aplicados.
                </td>
              </tr>
            ) : (
              filteredCompanies.map((company) => (
                <tr key={company.com_id} className="config-row">
                  <td className="config-cell table-cell-id">{company.com_id}</td>
                  <td className="config-cell">
                    <span className="config-company-name">{company.com_description}</span>
                    {company.com_integration_source && company.com_integration_source !== 'Manual' && (
                      <span className="config-module-badge" style={{ marginLeft: '0.5rem' }}>
                        {company.com_integration_source}
                      </span>
                    )}
                  </td>
                  <td className="config-cell">
                    <span
                      className={clsx(
                        'config-company-status',
                        company.com_active ? 'config-company-status-active' : 'config-company-status-inactive',
                      )}
                    >
                      {company.statusLabel ?? (company.com_active ? 'Ativo' : 'Inativo')}
                    </span>
                  </td>
                  <td className="config-cell">
                    <span className="config-company-sync">{formatSyncDate(company.com_last_sync_at)}</span>
                  </td>
                  <td className="config-cell">
                    <div className="config-modules-wrapper">
                      {(company.syncModuleLabels || []).map((mod) => (
                        <span key={mod} className="config-module-badge">
                          {mod}
                        </span>
                      ))}
                      {!company.syncModuleLabels?.length && <span className="config-company-sync">—</span>}
                    </div>
                  </td>
                  <td className="config-cell-right">
                    <button
                      type="button"
                      className="config-action-edit"
                      title="Sincronizar agora"
                      disabled={syncingId === company.com_id || !company.erpConfigured}
                      onClick={() => handleSync(company.com_id)}
                    >
                      {syncingId === company.com_id ? (
                        <Loader2 className="config-icon-sm config-spin" />
                      ) : (
                        <RefreshCw className="config-icon-sm" />
                      )}
                    </button>
                    <button
                      type="button"
                      className="config-action-settings"
                      title="Configurar"
                      onClick={() => {
                        setSelectedCompany(company);
                        setIsIntegracaoModalOpen(true);
                      }}
                    >
                      <SettingsIcon className="config-icon-sm" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

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

      <IntegracaoModal
        company={selectedCompany}
        isOpen={isIntegracaoModalOpen}
        onClose={() => setIsIntegracaoModalOpen(false)}
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
