import React, { useEffect, useMemo, useState } from 'react';
import { Database, Loader2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import {
  dataSourceService,
  type DataSourceAPI,
  type DataSourceCreatePayload,
  type RmApiMode,
  type RmSystemCode,
} from '../../services/dataSourceService';

const DEFAULT_RM_SYSTEM_CODES: Array<{ key: RmSystemCode; label: string }> = [
  { key: 'A', label: 'A — RM Chronus (Automação de Ponto)' },
  { key: 'B', label: 'B — RM Testis (Avaliação e Pesquisa)' },
  { key: 'C', label: 'C — RM Saldus (Gestão Contábil)' },
  { key: 'D', label: 'D — RM Liber (Gestão Fiscal)' },
  { key: 'E', label: 'E — RM Classis (Educacional)' },
  { key: 'F', label: 'F — RM Fluxus (Gestão Financeira)' },
  { key: 'G', label: 'G — RM Bis (Inteligência de Negócios)' },
  { key: 'H', label: 'H — RM Agilis (Atendimento/Gestão de Serviços)' },
  { key: 'P', label: 'P — RM Labore (Folha de Pagamento)' },
  { key: 'T', label: 'T — RM Nucleus (Estoque, Compras e Faturamento)' },
  { key: 'V', label: 'V — RM Vitae (Recursos Humanos)' },
  { key: 'W', label: 'W — RM Portal (Acesso Web)' },
  { key: 'X', label: 'X — RM SGI (Gestão Imobiliária)' },
];

const CONNECTION_STATUS_LABELS: Record<string, string> = {
  CONNECTED: 'Conectado',
  DISCONNECTED: 'Desconectado',
  ERROR: 'Erro na conexão',
  SYNCING: 'Sincronizando…',
};

interface DataSourceModalProps {
  dataSource: DataSourceAPI | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const DataSourceModal: React.FC<DataSourceModalProps> = ({
  dataSource,
  isOpen,
  onClose,
  onSaved,
}) => {
  const [catalog, setCatalog] = useState<Awaited<ReturnType<typeof dataSourceService.getCatalog>> | null>(null);
  const [name, setName] = useState('');
  const [type, setType] = useState<DataSourceCreatePayload['dso_type']>('TOTVS_RM');
  const [rmHost, setRmHost] = useState('');
  const [rmPort, setRmPort] = useState(8051);
  const [rmColigada, setRmColigada] = useState(1);
  const [rmCodSistema, setRmCodSistema] = useState<RmSystemCode>('P');
  const [rmApiMode, setRmApiMode] = useState<RmApiMode>('REST');
  const [rmRestPath, setRmRestPath] = useState('/RMSRestDataServer');
  const [rmWsPath, setRmWsPath] = useState('/wsDataServer/IwsDataServer');
  const [baseUrl, setBaseUrl] = useState('');
  const [clientId, setClientId] = useState('');
  const [clientSecret, setClientSecret] = useState('');
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [testMessage, setTestMessage] = useState<string | null>(null);

  const rmSystemCodeOptions = useMemo(() => {
    const fromCatalog = catalog?.rmSystemCodes;
    if (fromCatalog?.length) return fromCatalog;
    return DEFAULT_RM_SYSTEM_CODES;
  }, [catalog]);

  const connectionStatus = dataSource?.dso_connection_status;
  const connectionDotColor =
    connectionStatus === 'CONNECTED'
      ? '#28a745'
      : connectionStatus === 'ERROR'
        ? '#dc3545'
        : '#adb5bd';

  useEffect(() => {
    if (!isOpen) return;
    dataSourceService.getCatalog().then(setCatalog).catch(() => {});
    if (dataSource) {
      setName(dataSource.dso_name);
      setType(dataSource.dso_type);
      setRmHost(dataSource.dso_rm_host || '');
      setRmPort(dataSource.dso_rm_port || 8051);
      setRmColigada(dataSource.dso_rm_coligada || 1);
      setRmCodSistema((dataSource.dso_rm_cod_sistema as RmSystemCode) || 'P');
      setRmApiMode(dataSource.dso_rm_api_mode || 'REST');
      setRmRestPath(dataSource.dso_rm_rest_path || '/RMSRestDataServer');
      setRmWsPath(dataSource.dso_rm_ws_path || '/wsDataServer/IwsDataServer');
      setBaseUrl(dataSource.dso_base_url || '');
      setClientId(dataSource.dso_client_id || '');
      setClientSecret('');
    } else {
      setName('');
      setType('TOTVS_RM');
      setRmHost('');
      setRmPort(8051);
      setRmColigada(1);
      setRmCodSistema('P');
      setRmApiMode('REST');
      setRmRestPath('/RMSRestDataServer');
      setRmWsPath('/wsDataServer/IwsDataServer');
      setBaseUrl('');
      setClientId('');
      setClientSecret('');
    }
    setError(null);
    setTestMessage(null);
  }, [isOpen, dataSource]);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload: DataSourceCreatePayload = {
        dso_name: name,
        dso_type: type,
        dso_client_id: clientId || null,
      };
      if (clientSecret) payload.dso_client_secret = clientSecret;

      if (type === 'TOTVS_RM') {
        payload.dso_rm_host = rmHost || null;
        payload.dso_rm_port = rmPort;
        payload.dso_rm_coligada = rmColigada;
        payload.dso_rm_cod_sistema = rmCodSistema;
        payload.dso_rm_api_mode = rmApiMode;
        payload.dso_rm_rest_path = rmRestPath;
        payload.dso_rm_ws_path = rmWsPath;
        payload.dso_base_url = null;
      } else {
        payload.dso_base_url = baseUrl || null;
      }

      if (dataSource) {
        await dataSourceService.update(dataSource.dso_id, payload);
      } else {
        await dataSourceService.create(payload);
      }
      onSaved();
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    if (!dataSource) return;
    setTesting(true);
    setTestMessage(null);
    setError(null);
    try {
      const result = await dataSourceService.testConnection(dataSource.dso_id);
      setTestMessage(result.message);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao testar conexão');
    } finally {
      setTesting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="wide"
      title={dataSource ? 'Editar fonte de dados' : 'Nova fonte de dados'}
    >
      <div className="config-modal-content">
        {error && <p className="config-warning-title">{error}</p>}

        {dataSource && (
          <div className="config-status-card">
            <p className="config-status-label">Status da conexão</p>
            <div className="config-status-indicator">
              <div className="config-status-dot" style={{ background: connectionDotColor }} />
              <span className="config-status-text">
                {CONNECTION_STATUS_LABELS[connectionStatus || ''] || connectionStatus}
              </span>
            </div>
          </div>
        )}

        <section className="config-form-section" aria-labelledby="dso-section-ident">
          <h4 id="dso-section-ident" className="config-form-section-title">
            Identificação
          </h4>
          <div className="config-modal-form-row">
            <div className="config-form-group">
              <label className="config-form-label" htmlFor="dso-name">
                Nome
              </label>
              <input
                id="dso-name"
                className="config-form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex.: RM Produção"
              />
            </div>
            <div className="config-form-group">
              <label className="config-form-label" htmlFor="dso-type">
                Tipo ERP
              </label>
              <select
                id="dso-type"
                className="config-form-input"
                value={type}
                onChange={(e) => setType(e.target.value as DataSourceCreatePayload['dso_type'])}
              >
                {(catalog?.dataSourceTypes || [
                  { key: 'TOTVS_RM', label: 'TOTVS RM' },
                  { key: 'PROTHEUS', label: 'PROTHEUS' },
                ]).map((t) => (
                  <option key={t.key} value={t.key}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {type === 'TOTVS_RM' ? (
          <section className="config-form-section" aria-labelledby="dso-section-rm">
            <h4 id="dso-section-rm" className="config-form-section-title">
              Conexão TOTVS RM
            </h4>
            <p className="config-form-section-desc">
              Host, coligada e caminhos da API conforme o ambiente do RM.
            </p>
            <div className="config-form-group">
              <label className="config-form-label" htmlFor="dso-rm-api-mode">
                Modo de API
              </label>
              <select
                id="dso-rm-api-mode"
                className="config-form-input"
                value={rmApiMode}
                onChange={(e) => setRmApiMode(e.target.value as RmApiMode)}
              >
                {(catalog?.rmApiModes || [
                  { key: 'REST', label: 'REST (RMSRestDataServer)' },
                  { key: 'SOAP', label: 'SOAP (wsDataServer)' },
                ]).map((m) => (
                  <option key={m.key} value={m.key}>
                    {m.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="config-modal-form-row">
              <div className="config-form-group">
                <label className="config-form-label" htmlFor="dso-rm-host">
                  RM Host (IP ou hostname)
                </label>
                <input
                  id="dso-rm-host"
                  className="config-form-input"
                  value={rmHost}
                  onChange={(e) => setRmHost(e.target.value)}
                  placeholder="192.168.128.3"
                />
              </div>
              <div className="config-form-group">
                <label className="config-form-label" htmlFor="dso-rm-port">
                  Porta RM Host
                </label>
                <input
                  id="dso-rm-port"
                  className="config-form-input"
                  type="number"
                  value={rmPort}
                  onChange={(e) => setRmPort(Number(e.target.value) || 8051)}
                />
              </div>
            </div>
            <div className="config-modal-form-row">
              <div className="config-form-group">
                <label className="config-form-label" htmlFor="dso-rm-coligada">
                  Coligada
                </label>
                <input
                  id="dso-rm-coligada"
                  className="config-form-input"
                  type="number"
                  value={rmColigada}
                  onChange={(e) => setRmColigada(Number(e.target.value) || 1)}
                />
              </div>
              <div className="config-form-group">
                <label className="config-form-label" htmlFor="dso-rm-cod-sistema">
                  Código do sistema
                </label>
                <select
                  id="dso-rm-cod-sistema"
                  className="config-form-input"
                  value={rmCodSistema}
                  onChange={(e) => setRmCodSistema(e.target.value as RmSystemCode)}
                >
                  {rmSystemCodeOptions.map((opt) => (
                    <option key={opt.key} value={opt.key}>
                      {opt.label}
                    </option>
                  ))}
                  {!rmSystemCodeOptions.some((opt) => opt.key === rmCodSistema) && (
                    <option value={rmCodSistema}>{rmCodSistema} (valor salvo)</option>
                  )}
                </select>
              </div>
            </div>
            {rmApiMode === 'REST' ? (
              <div className="config-form-group">
                <label className="config-form-label" htmlFor="dso-rm-rest-path">
                  Caminho REST (RMSRestDataServer)
                </label>
                <input
                  id="dso-rm-rest-path"
                  className="config-form-input"
                  value={rmRestPath}
                  onChange={(e) => setRmRestPath(e.target.value)}
                  placeholder="/RMSRestDataServer"
                />
              </div>
            ) : (
              <div className="config-form-group">
                <label className="config-form-label" htmlFor="dso-rm-ws-path">
                  Caminho Web Service SOAP
                </label>
                <input
                  id="dso-rm-ws-path"
                  className="config-form-input"
                  value={rmWsPath}
                  onChange={(e) => setRmWsPath(e.target.value)}
                  placeholder="/wsDataServer/IwsDataServer"
                />
              </div>
            )}
          </section>
        ) : (
          <section className="config-form-section" aria-labelledby="dso-section-protheus">
            <h4 id="dso-section-protheus" className="config-form-section-title">
              Conexão PROTHEUS
            </h4>
            <div className="config-form-group">
              <label className="config-form-label" htmlFor="dso-base-url">
                URL base da API
              </label>
              <input
                id="dso-base-url"
                className="config-form-input"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
          </section>
        )}

        <section className="config-form-section" aria-labelledby="dso-section-auth">
          <h4 id="dso-section-auth" className="config-form-section-title">
            Autenticação
          </h4>
          <div className="config-modal-form-row">
            <div className="config-form-group">
              <label className="config-form-label" htmlFor="dso-client-id">
                Usuário RM / Client ID
              </label>
              <input
                id="dso-client-id"
                className="config-form-input"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                autoComplete="username"
              />
            </div>
            <div className="config-form-group">
              <label className="config-form-label" htmlFor="dso-client-secret">
                Senha / Client Secret
              </label>
              <input
                id="dso-client-secret"
                className="config-form-input"
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder={dataSource ? 'Deixe em branco para manter' : ''}
                autoComplete="new-password"
              />
            </div>
          </div>
        </section>

        <div className="config-datasource-footer">
          {dataSource && (
            <div className="config-datasource-test-row">
              <button
                type="button"
                className="config-datasource-test-btn"
                onClick={handleTest}
                disabled={testing}
              >
                {testing ? (
                  <Loader2 className="config-icon-sm config-spin" />
                ) : (
                  <Database className="config-icon-sm" />
                )}
                Testar conexão
              </button>
              {testMessage && <p className="config-datasource-test-msg">{testMessage}</p>}
            </div>
          )}
          <div className="config-modal-actions">
            <button type="button" onClick={onClose} className="config-modal-cancel-btn" disabled={saving}>
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="config-modal-save-btn"
              disabled={saving || !name.trim()}
            >
              {saving ? <Loader2 className="config-icon-sm config-spin" /> : null}
              {saving ? 'Salvando…' : 'Salvar'}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};
