import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { AlertTriangle, BookOpen, CheckCircle2, Loader2, RotateCcw, Save, Search } from 'lucide-react';
import { ListFiltersBar } from '../../components/list/ListFiltersBar';
import clsx from 'clsx';
import {
  nomenclatureService,
  type NomenclatureCatalogEntry,
} from '../../services/nomenclatureService';
import { useNomenclature } from '../../hooks/useNomenclature';
import { compareNomenclatureGroups } from '../../config/nomenclatureKeys';

interface NomenclaturaTabProps {
  allowEdit: boolean;
}

function fieldId(nomKey: string) {
  return `nom-${nomKey.replace(/[^a-zA-Z0-9_-]/g, '-')}`;
}

function isEntryModified(entry: NomenclatureCatalogEntry, draft: Record<string, string>) {
  const current = (draft[entry.nom_key] ?? '').trim();
  return current !== entry.defaultLabel.trim();
}

export const NomenclaturaTab: React.FC<NomenclaturaTabProps> = ({ allowEdit }) => {
  const { setLabels, refreshNomenclature } = useNomenclature();
  const [catalog, setCatalog] = useState<NomenclatureCatalogEntry[]>([]);
  const [draft, setDraft] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const loadCatalog = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await nomenclatureService.getCatalog();
      if (!Array.isArray(data)) {
        throw new Error('Resposta inválida do servidor.');
      }
      setCatalog(data);
      const initial: Record<string, string> = {};
      data.forEach((e) => {
        initial[e.nom_key] = e.currentLabel;
      });
      setDraft(initial);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar dicionário');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCatalog();
  }, [loadCatalog]);

  const modifiedCount = useMemo(
    () => catalog.filter((e) => isEntryModified(e, draft)).length,
    [catalog, draft]
  );

  const groupOptions = useMemo(() => {
    const groups = new Set(catalog.map((e) => e.group || 'Outros'));
    return Array.from(groups)
      .sort(compareNomenclatureGroups)
      .map((g) => ({ value: g, label: g }));
  }, [catalog]);

  const filteredCatalog = useMemo(() => {
    const q = search.trim().toLowerCase();
    const groupFilter = filterValues.group ?? '';
    return catalog.filter((e) => {
      if (groupFilter && (e.group || 'Outros') !== groupFilter) return false;
      if (!q) return true;
      return (
        e.nom_key.toLowerCase().includes(q) ||
        e.defaultLabel.toLowerCase().includes(q) ||
        (draft[e.nom_key] ?? '').toLowerCase().includes(q) ||
        (e.group || '').toLowerCase().includes(q)
      );
    });
  }, [catalog, draft, search, filterValues]);

  const grouped = useMemo(() => {
    const map = new Map<string, NomenclatureCatalogEntry[]>();
    filteredCatalog.forEach((entry) => {
      const g = entry.group || 'Outros';
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(entry);
    });
    return [...map.entries()].sort(([a], [b]) => compareNomenclatureGroups(a, b));
  }, [filteredCatalog]);

  const handleSave = async () => {
    if (!allowEdit) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const entries = catalog.map((e) => ({
        nom_key: e.nom_key,
        nom_label: draft[e.nom_key]?.trim() || e.defaultLabel,
      }));
      const nomenclature = await nomenclatureService.bulkSave(entries);
      setLabels(nomenclature);
      await refreshNomenclature();
      await loadCatalog();
      setSuccess('Termos salvos com sucesso.');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar termos');
    } finally {
      setSaving(false);
    }
  };

  const handleRestore = async (nom_key: string) => {
    if (!allowEdit) return;
    const entry = catalog.find((e) => e.nom_key === nom_key);
    if (!entry) return;
    setSaving(true);
    setError(null);
    setSuccess(null);
    try {
      const nomenclature = await nomenclatureService.restoreKey(nom_key);
      setLabels(nomenclature);
      setDraft((prev) => ({ ...prev, [nom_key]: entry.defaultLabel }));
      await refreshNomenclature();
      await loadCatalog();
      setSuccess(`Restaurado para: "${entry.defaultLabel}"`);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao restaurar termo');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="config-tab-perfil config-nom-loading">
        <Loader2 className="config-icon-lg config-spin" />
        <p>Carregando dicionário...</p>
      </div>
    );
  }

  return (
    <div className="config-tab-perfil config-nom">
      <div className="config-nom-top">
      <div className="config-section-header">
        <div>
          <h3 className="config-section-title">Dicionário de Termos</h3>
          <p className="config-section-desc">
            Personalize os nomes do menu, títulos das páginas e textos exibidos no sistema.
          </p>
        </div>
        {allowEdit && (
          <button type="button" onClick={handleSave} className="config-primary-btn" disabled={saving}>
            {saving ? <Loader2 className="config-icon-sm config-spin" /> : <Save className="config-icon-sm" />}
            Salvar alterações
          </button>
        )}
      </div>

      <ListFiltersBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Buscar termo, chave ou grupo..."
        fields={[
          {
            id: 'group',
            label: 'Grupo',
            type: 'select',
            options: groupOptions,
          },
        ]}
        values={filterValues}
        onFieldChange={(id, value) => setFilterValues((prev) => ({ ...prev, [id]: value }))}
        onClear={() => setFilterValues({})}
      />
      <div className="config-nom-toolbar">
        <span className="config-permissions-badge">{catalog.length} termos</span>
        {modifiedCount > 0 && (
          <span className="config-nom-modified-badge">{modifiedCount} alterados</span>
        )}
      </div>

      {error && (
        <div className="config-warning-card">
          <div className="config-warning-header">
            <AlertTriangle className="config-icon-md" />
            <p className="config-warning-title">{error}</p>
          </div>
        </div>
      )}

      {success && (
        <div className="config-nom-success">
          <CheckCircle2 className="config-icon-md" />
          <span>{success}</span>
        </div>
      )}

      {!allowEdit && (
        <p className="config-nom-readonly">Modo somente leitura — sem permissão para editar termos.</p>
      )}
      </div>

      <div className="config-nom-scroll custom-scrollbar">
      {catalog.length === 0 ? (
        <div className="config-nom-empty">
          <BookOpen className="config-icon-lg" />
          <p>Nenhum termo disponível. Verifique se a API está atualizada.</p>
        </div>
      ) : grouped.length === 0 ? (
        <div className="config-nom-empty">
          <Search className="config-icon-lg" />
          <p>Nenhum resultado para &quot;{search}&quot;.</p>
        </div>
      ) : (
        <div className="config-table-scroll">
          <table className="config-table config-nom-table">
            <colgroup>
              <col className="config-nom-col-default" />
              <col className="config-nom-col-custom" />
              {allowEdit && <col className="config-nom-col-actions" />}
            </colgroup>
            <thead>
              <tr className="config-thead-row">
                <th className="config-th">Termo padrão</th>
                <th className="config-th">Exibição personalizada</th>
                {allowEdit && <th className="config-th-right">Ações</th>}
              </tr>
            </thead>
            <tbody className="config-tbody">
              {grouped.map(([group, entries]) => (
                <React.Fragment key={group}>
                  <tr className="config-nom-group-row">
                    <td colSpan={allowEdit ? 3 : 2}>
                      <span className="config-nom-group-label">
                        <span className="config-nom-group-label-text">{group}</span>
                      </span>
                    </td>
                  </tr>
                  {entries.map((entry) => {
                      const modified = isEntryModified(entry, draft);
                      const inputId = fieldId(entry.nom_key);
                      return (
                        <tr
                          key={entry.nom_key}
                          className={clsx('config-row', modified && 'config-nom-row--modified')}
                        >
                        <td className="config-cell config-nom-cell-default">
                          <span className="config-nom-default-text">{entry.defaultLabel}</span>
                        </td>
                        <td className="config-cell config-nom-cell-custom">
                          <div className="config-nom-cell-inner">
                            <input
                              id={inputId}
                              type="text"
                              className="config-form-input config-nom-input"
                              value={draft[entry.nom_key] ?? ''}
                              onChange={(e) =>
                                setDraft((prev) => ({ ...prev, [entry.nom_key]: e.target.value }))
                              }
                              disabled={!allowEdit || saving}
                              maxLength={120}
                              aria-label={`Personalizar ${entry.defaultLabel}`}
                            />
                            {modified && <span className="config-nom-modified-tag">Alterado</span>}
                          </div>
                        </td>
                        {allowEdit && (
                          <td className="config-cell-right config-nom-cell-actions">
                              <button
                                type="button"
                                className="config-action-edit"
                                title="Restaurar padrão"
                                disabled={saving || (!modified && !entry.isCustomized)}
                                onClick={() => handleRestore(entry.nom_key)}
                              >
                                <RotateCcw className="config-icon-sm" />
                              </button>
                            </td>
                          )}
                        </tr>
                      );
                  })}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
      </div>
    </div>
  );
};
