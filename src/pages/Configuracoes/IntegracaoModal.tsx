import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import type { CompanyIntegrationAPI } from '../../services/companyService';
import {
  integrationService,
  type SyncModule,
  type SyncModuleCatalogItem,
} from '../../services/integrationService';
import { INTEGRATION_SOURCES } from '../../services/epiVariantService';

interface IntegracaoModalProps {
  company: CompanyIntegrationAPI | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const IntegracaoModal: React.FC<IntegracaoModalProps> = ({
  company,
  isOpen,
  onClose,
  onSaved,
}) => {
  const [catalog, setCatalog] = useState<SyncModuleCatalogItem[]>([]);
  const [source, setSource] = useState('Manual');
  const [baseUrl, setBaseUrl] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [modules, setModules] = useState<SyncModule[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !company) return;
    integrationService.getSyncModulesCatalog().then(setCatalog).catch(() => {});
    setSource(company.com_integration_source || 'Manual');
    setBaseUrl(company.com_erp_base_url || '');
    setClientId(company.com_erp_client_id || '');
    setClientSecret('');
    setModules((company.com_sync_modules as SyncModule[]) || []);
    setError(null);
  }, [isOpen, company]);

  const toggleModule = (key: SyncModule) => {
    setModules((prev) =>
      prev.includes(key) ? prev.filter((m) => m !== key) : [...prev, key],
    );
  };

  const handleSave = async () => {
    if (!company) return;
    setSaving(true);
    setError(null);
    try {
      await integrationService.updateIntegration(company.com_id, {
        com_integration_source: source,
        com_erp_base_url: baseUrl || null,
        com_erp_client_id: clientId || null,
        ...(clientSecret ? { com_erp_client_secret: clientSecret } : {}),
        com_sync_modules: modules,
      });
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const connectionLabel =
    company?.com_connection_status === 'CONNECTED'
      ? 'Conectado'
      : company?.com_connection_status === 'SYNCING'
        ? 'Sincronizando...'
        : company?.com_connection_status === 'ERROR'
          ? 'Erro na conexão'
          : 'Desconectado';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Configurar Integração: ${company?.com_description ?? ''}`}
    >
      <div className="config-modal-content">
        {error && <p className="config-warning-title">{error}</p>}

        <div className="config-status-card">
          <p className="config-status-label">Status da Conexão</p>
          <div className="config-status-indicator">
            <div
              className="config-status-dot"
              style={{
                background:
                  company?.com_connection_status === 'CONNECTED' ? '#10b981' : '#94a3b8',
              }}
            />
            <span className="config-status-text">{connectionLabel}</span>
          </div>
        </div>

        <div className="config-form-group">
          <label className="config-form-label">ERP</label>
          <select
            className="config-form-input"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          >
            {INTEGRATION_SOURCES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        {source !== 'Manual' && (
          <>
            <div className="config-form-group">
              <label className="config-form-label">URL base da API</label>
              <input
                className="config-form-input"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://api.erp.exemplo.com"
              />
            </div>
            <div className="config-form-group">
              <label className="config-form-label">Client ID</label>
              <input
                className="config-form-input"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
              />
            </div>
            <div className="config-form-group">
              <label className="config-form-label">Client Secret</label>
              <input
                type="password"
                className="config-form-input"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder={company?.hasErpCredentials ? 'Deixe em branco para manter' : ''}
              />
            </div>
          </>
        )}

        <div className="config-sync-section">
          <label className="config-form-label">Módulos para Sincronização</label>
          <div className="config-sync-modules">
            {catalog.map((mod) => (
              <label key={mod.key} className="config-sync-module-item">
                <span className="config-sync-module-name">{mod.label}</span>
                <input
                  type="checkbox"
                  className="config-checkbox"
                  checked={modules.includes(mod.key)}
                  onChange={() => toggleModule(mod.key)}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="config-modal-actions">
          <button type="button" onClick={onClose} className="config-modal-cancel-btn" disabled={saving}>
            Cancelar
          </button>
          <button type="button" onClick={handleSave} className="config-modal-save-btn" disabled={saving}>
            {saving ? <Loader2 className="config-icon-sm config-spin" /> : null}
            Salvar Configurações
          </button>
        </div>
      </div>
    </Modal>
  );
};
