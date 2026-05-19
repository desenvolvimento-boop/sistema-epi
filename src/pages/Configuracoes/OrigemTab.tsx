import React, { useCallback, useEffect, useState } from 'react';
import { AlertTriangle, Edit2, Link as LinkIcon, Loader2 } from 'lucide-react';
import clsx from 'clsx';
import { settingsService, type DataSource } from '../../services/settingsService';

export const OrigemTab: React.FC = () => {
  const [dataSource, setDataSource] = useState<DataSource>('MANUAL');
  const [hasErpCompany, setHasErpCompany] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const settings = await settingsService.get();
      setDataSource(settings.dataSource);
      setHasErpCompany(settings.hasErpCompany);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao carregar origem dos dados');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSelect = async (value: DataSource) => {
    if (value === dataSource) return;
    setSaving(true);
    setError(null);
    try {
      const settings = await settingsService.updateDataSource(value);
      setDataSource(settings.dataSource);
      setHasErpCompany(settings.hasErpCompany);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="config-tab-origem config-nom-loading">
        <Loader2 className="config-icon-lg config-spin" />
        <p>Carregando origem dos dados...</p>
      </div>
    );
  }

  return (
    <div className="config-tab-origem">
      <div>
        <h3 className="config-section-title">Origem dos Dados</h3>
        <p className="config-section-desc">Defina como o sistema deve receber as informações principais.</p>
      </div>

      {error && (
        <div className="config-warning-card">
          <div className="config-warning-header">
            <AlertTriangle className="config-icon-md" />
            <p className="config-warning-title">{error}</p>
          </div>
        </div>
      )}

      <div className="config-source-grid">
        <button
          type="button"
          disabled={saving}
          onClick={() => handleSelect('MANUAL')}
          className={clsx(
            'config-source-btn',
            dataSource === 'MANUAL' ? 'config-source-btn-active' : 'config-source-btn-inactive',
          )}
        >
          <div
            className={clsx(
              'config-source-icon',
              dataSource === 'MANUAL' ? 'config-source-icon-active' : 'config-source-icon-inactive',
            )}
          >
            <Edit2 className="config-icon-md" />
          </div>
          <div>
            <p className="config-source-title">Entrada Manual</p>
            <p className="config-source-desc">Dados inseridos pelos usuários.</p>
          </div>
        </button>

        <button
          type="button"
          disabled={saving}
          onClick={() => handleSelect('INTEGRACAO')}
          className={clsx(
            'config-source-btn',
            dataSource === 'INTEGRACAO' ? 'config-source-btn-active' : 'config-source-btn-inactive',
          )}
        >
          <div
            className={clsx(
              'config-source-icon',
              dataSource === 'INTEGRACAO' ? 'config-source-icon-active' : 'config-source-icon-inactive',
            )}
          >
            <LinkIcon className="config-icon-md" />
          </div>
          <div>
            <p className="config-source-title">Integração Automática</p>
            <p className="config-source-desc">Sincronização via API.</p>
          </div>
        </button>
      </div>

      {dataSource === 'INTEGRACAO' && !hasErpCompany && (
        <div className="config-warning-card">
          <div className="config-warning-header">
            <AlertTriangle className="config-icon-md" />
            <p className="config-warning-title">ERP ainda não configurado</p>
          </div>
          <p className="config-warning-text">
            A origem foi salva como integração. Configure TOTVS ou Senior na aba{' '}
            <strong>Integração</strong> para habilitar a sincronização.
          </p>
        </div>
      )}

      {dataSource === 'INTEGRACAO' && hasErpCompany && (
        <div className="config-warning-card">
          <div className="config-warning-header">
            <AlertTriangle className="config-icon-md" />
            <p className="config-warning-title">Configuração de Sincronização</p>
          </div>
          <p className="config-warning-text">
            Certifique-se de configurar quais módulos serão sincronizados na aba{' '}
            <strong>Integração</strong>. Dados manuais podem ser sobrescritos durante a sincronização.
          </p>
        </div>
      )}
    </div>
  );
};
