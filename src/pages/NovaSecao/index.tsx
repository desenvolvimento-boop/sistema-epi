import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Edit2, Trash2, Loader2, RefreshCw } from 'lucide-react';
import { sectionService, type SectionAPI } from '../../services/sectionService';
import { StatusBadge } from '../../components/StatusBadge';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

function canAccessNovaSecao(canView: (path: string) => boolean) {
  return canView('/nova-secao') || canView('/colaboradores') || canView('/configuracoes');
}

const NovaSecao = () => {
  const [sections, setSections] = useState<SectionAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const navigate = useNavigate();
  const { canCreate, canEdit, canDelete, canView } = useAuth();
  const path = '/nova-secao';
  const allowCreate = canCreate(path) || canCreate('/colaboradores') || canCreate('/configuracoes');
  const allowEdit = canEdit(path) || canEdit('/colaboradores') || canEdit('/configuracoes');
  const allowDelete = canDelete(path) || canDelete('/colaboradores') || canDelete('/configuracoes');

  const fetchSections = useCallback(async () => {
    if (!canAccessNovaSecao(canView)) return;
    setLoading(true);
    setError(null);
    try {
      const data = await sectionService.getAll();
      setSections(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar setores');
    } finally {
      setLoading(false);
    }
  }, [canView]);

  useEffect(() => {
    fetchSections();
  }, [fetchSections]);

  const handleDelete = async (id: number) => {
    if (!allowDelete) return;
    if (!window.confirm('Deseja excluir este setor / seção?')) return;

    setDeletingId(id);
    try {
      await sectionService.delete(id);
      await fetchSections();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erro ao excluir setor');
    } finally {
      setDeletingId(null);
    }
  };

  const filtered = sections.filter((sec) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      sec.sec_description.toLowerCase().includes(term) ||
      (sec.sec_integration_id || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="nova-secao-container">
      <div className="nova-secao-header">
        <div className="nova-secao-search-group">
          <div className="nova-secao-search-wrapper">
            <Search className="nova-secao-search-icon" />
            <input
              type="text"
              placeholder="Filtrar por nome ou descrição..."
              className="nova-secao-search-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button
            type="button"
            onClick={fetchSections}
            className="nova-secao-filter-btn"
            disabled={loading}
          >
            <RefreshCw className={`nova-secao-btn-icon ${loading ? 'nova-secao-spin' : ''}`} />
            Atualizar
          </button>
        </div>
        {allowCreate && (
          <button
            type="button"
            onClick={() => navigate('/nova-secao/novo')}
            className="nova-secao-add-btn"
          >
            <Plus className="nova-secao-btn-icon" /> Nova Seção
          </button>
        )}
      </div>

      {error && (
        <div className="nova-secao-error-banner">
          <p>{error}</p>
          <button type="button" onClick={fetchSections} className="nova-secao-retry-btn">
            Tentar novamente
          </button>
        </div>
      )}

      {loading && sections.length === 0 ? (
        <div className="nova-secao-loading">
          <Loader2 className="nova-secao-loading-icon nova-secao-spin" />
          <p>Carregando setores...</p>
        </div>
      ) : (
        <div className="nova-secao-table-wrapper">
          <table className="nova-secao-table">
            <thead>
              <tr className="nova-secao-thead-row">
                <th className="nova-secao-th table-col-id">ID</th>
                <th className="nova-secao-th">Setor / Seção</th>
                <th className="nova-secao-th">Descrição / Integração</th>
                <th className="nova-secao-th">Status</th>
                <th className="nova-secao-th--right">Ações</th>
              </tr>
            </thead>
            <tbody className="nova-secao-tbody">
              {filtered.length === 0 && !loading ? (
                <tr>
                  <td colSpan={5} className="nova-secao-empty">
                    Nenhum setor encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((sec) => (
                  <tr key={sec.sec_id} className="nova-secao-row">
                    <td className="nova-secao-cell table-cell-id">{sec.sec_id}</td>
                    <td className="nova-secao-cell">
                      <p className="nova-secao-name">{sec.sec_description}</p>
                    </td>
                    <td className="nova-secao-cell">
                      <p className="nova-secao-desc">{sec.sec_integration_id || '—'}</p>
                    </td>
                    <td className="nova-secao-cell">
                      <StatusBadge status={sec.sec_active === 1 ? 'Ativo' : 'Inativo'} />
                    </td>
                    <td className="nova-secao-cell--right">
                      <div className="nova-secao-actions">
                        {allowEdit && (
                          <button
                            type="button"
                            onClick={() => navigate(`/nova-secao/${sec.sec_id}/editar`)}
                            className="nova-secao-edit-btn"
                            title="Editar"
                          >
                            <Edit2 className="nova-secao-btn-icon" />
                          </button>
                        )}
                        {allowDelete && (
                          <button
                            type="button"
                            onClick={() => handleDelete(sec.sec_id)}
                            className="nova-secao-delete-btn"
                            title="Excluir"
                            disabled={deletingId === sec.sec_id}
                          >
                            {deletingId === sec.sec_id ? (
                              <Loader2 className="nova-secao-btn-icon nova-secao-spin" />
                            ) : (
                              <Trash2 className="nova-secao-btn-icon" />
                            )}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          <div className="nova-secao-pagination">
            <p className="nova-secao-pagination-info">
              Mostrando {filtered.length} de {sections.length} setores
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default NovaSecao;
