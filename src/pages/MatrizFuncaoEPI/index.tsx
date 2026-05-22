import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { ListFiltersBar } from '../../components/list/ListFiltersBar';
import { filterListRows } from '../../utils/listFilters';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Plus, Edit3, Eye, Loader2, Grid3x3 } from 'lucide-react';
import { PageHeader } from '../../components/layout/PageHeader';
import { useNomenclature } from '../../hooks/useNomenclature';
import { NOMENCLATURE_KEYS } from '../../config/nomenclatureKeys';
import { roleService, type RoleAPI, type RoleMatrixResponse } from '../../services/roleService';
import { Modal } from '../../components/ui/Modal';
import { MatrizForm } from '../../components/forms/MatrizForm';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

const MatrizFuncaoEPI = () => {
  const { t } = useNomenclature();
  const [matrixData, setMatrixData] = useState<RoleMatrixResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleAPI | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const navigate = useNavigate();
  const { canCreate, canEdit } = useAuth();
  const allowCreate = canCreate('/matriz-funcao-epi');
  const allowEdit = canEdit('/matriz-funcao-epi');

  const loadMatrix = useCallback(async () => {
    setLoading(true);
    try {
      const data = await roleService.getMatrix();
      setMatrixData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadMatrix();
  }, [loadMatrix]);

  const isLinked = (rolId: number, eptId: number) => {
    return matrixData?.matrix.some((m) => m.rol_id === rolId && m.ept_id === eptId) ?? false;
  };

  const handleEditMatriz = (role: RoleAPI) => {
    setSelectedRole(role);
    setIsModalOpen(true);
  };

  const handleNewMatriz = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const roles = matrixData?.roles ?? [];
  const epiTypes = matrixData?.epiTypes ?? [];

  const filteredRoles = useMemo(
    () =>
      filterListRows(roles, searchTerm, filterValues, {
        searchText: (role) => [role.rol_description, String(role.rol_id)].join(' '),
        fields: {
          ept_id: (role, value) => isLinked(role.rol_id, Number(value)),
        },
      }),
    [roles, searchTerm, filterValues, matrixData],
  );

  const epiColumnOptions = useMemo(
    () =>
      epiTypes.map((epi) => ({
        value: String(epi.ept_id),
        label: epi.ept_description,
      })),
    [epiTypes],
  );

  return (
    <div className="matriz-page">
      <PageHeader
        icon={Grid3x3}
        iconTone="green"
        title="Matriz de Proteção (Função x EPI)"
        subtitle={t(NOMENCLATURE_KEYS.page.subtitle_matriz)}
        actions={
          allowCreate ? (
            <button onClick={handleNewMatriz} className="matriz-new-btn">
              <Plus className="w-4 h-4" /> Nova Matriz
            </button>
          ) : undefined
        }
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={selectedRole ? `Gerenciar Matriz: ${selectedRole.rol_description}` : 'Gerenciar Matriz de Proteção'}
      >
        <MatrizForm
          onClose={() => setIsModalOpen(false)}
          onSaved={loadMatrix}
          initialRole={selectedRole || undefined}
        />
      </Modal>

      <ListFiltersBar
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Buscar função..."
        fields={[
          {
            id: 'ept_id',
            label: 'Vinculado ao EPI',
            type: 'select',
            allOptionLabel: 'Qualquer EPI',
            options: epiColumnOptions,
          },
        ]}
        values={filterValues}
        onFieldChange={(id, value) => setFilterValues((prev) => ({ ...prev, [id]: value }))}
        onClear={() => setFilterValues({})}
      />

      <div className="matriz-card">
        <div className="matriz-card-header">
          <h3 className="matriz-card-title">Visualização da Matriz</h3>
          <p className="matriz-card-subtitle">Cruzamento obrigatório para conformidade jurídica.</p>
        </div>
        <div className="matriz-table-wrapper custom-scrollbar">
          {loading ? (
            <div className="matriz-loading">
              <Loader2 className="w-5 h-5 matriz-spin" />
              <span>Carregando matriz...</span>
            </div>
          ) : (
            <table className="matriz-table">
              <thead>
                <tr className="matriz-thead-row">
                  <th className="matriz-th-sticky-left table-col-id">ID</th>
                  <th className="matriz-th-sticky-left matriz-th-funcao">Função</th>
                  {epiTypes.map((epi) => (
                    <th key={epi.ept_id} className="matriz-th" title={epi.ept_description}>
                      {epi.ept_description.split(' ')[0]}
                    </th>
                  ))}
                  <th className="matriz-th-sticky-right">Ações</th>
                </tr>
              </thead>
              <tbody className="matriz-tbody">
                {filteredRoles.length === 0 ? (
                  <tr>
                    <td colSpan={epiTypes.length + 3} className="matriz-td-funcao" style={{ textAlign: 'center' }}>
                      Nenhuma função encontrada com os filtros aplicados.
                    </td>
                  </tr>
                ) : (
                filteredRoles.map((role) => (
                  <tr key={role.rol_id} className="matriz-row">
                    <td className="matriz-td-id table-cell-id">{role.rol_id}</td>
                    <td className="matriz-td-funcao">{role.rol_description}</td>
                    {epiTypes.map((epi) => {
                      const required = isLinked(role.rol_id, epi.ept_id);
                      return (
                        <td key={epi.ept_id} className="matriz-td-center">
                          {required ? (
                            <div className="matriz-check-wrapper">
                              <div className="matriz-check-icon">
                                <CheckCircle2 className="w-4 h-4" />
                              </div>
                            </div>
                          ) : (
                            <span className="matriz-dash">—</span>
                          )}
                        </td>
                      );
                    })}
                    <td className="matriz-td-actions">
                      <div className="matriz-actions-wrapper">
                        <button
                          onClick={() => navigate(`/funcoes/${role.rol_id}/detalhes`)}
                          className="matriz-btn-view"
                          title="Ver Detalhes da Função"
                          type="button"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        {allowEdit && (
                          <button
                            onClick={() => handleEditMatriz(role)}
                            className="matriz-btn-edit"
                            title="Editar Matriz"
                            type="button"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatrizFuncaoEPI;
