import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ListFiltersBar } from '../../components/list/ListFiltersBar';
import { activeStatusMatcher, filterListRows } from '../../utils/listFilters';
import { Plus, Edit2, Loader2, Building2 } from 'lucide-react';
import { employerService, type EmployerAPI } from '../../services/employerService';
import { EmpresaForm } from '../../components/forms/EmpresaForm';
import { useAuth } from '../../contexts/AuthContext';
import './styles.css';

type TabId = 'lista' | 'cadastro';

const Empresas = () => {
  const [empresas, setEmpresas] = useState<EmployerAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<TabId>('lista');
  const [editEmpresa, setEditEmpresa] = useState<EmployerAPI | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const { canCreate, canEdit } = useAuth();
  const allowCreate = canCreate('/empresas');
  const allowEdit = canEdit('/empresas');

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await employerService.getAll();
      setEmpresas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleOpenCreate = () => {
    setEditEmpresa(null);
    setActiveTab('cadastro');
  };

  const handleOpenEdit = (empresa: EmployerAPI) => {
    setEditEmpresa(empresa);
    setActiveTab('cadastro');
  };

  const handleCloseForm = () => {
    setActiveTab('lista');
    setEditEmpresa(null);
  };

  const canShowFormTab = allowCreate || (editEmpresa && allowEdit);

  const filteredEmpresas = useMemo(
    () =>
      filterListRows(empresas, searchTerm, filterValues, {
        searchText: (e) =>
          [e.emr_name, e.emr_trade_name, e.emr_tax_id, String(e.emr_id)].filter(Boolean).join(' '),
        fields: {
          status: activeStatusMatcher((e) => e.emr_active),
        },
      }),
    [empresas, searchTerm, filterValues],
  );

  return (
    <div className="empresas-container">
      <div className="empresas-header">
        <div>
          <h2 className="empresas-title">Empresas</h2>
          <p className="empresas-subtitle">
            Cadastro operacional para vínculo de colaboradores. Integração ERP fica em Configurações.
          </p>
        </div>
        {activeTab === 'lista' && allowCreate && (
          <button type="button" onClick={handleOpenCreate} className="empresas-add-btn">
            <Plus className="empresas-btn-icon" /> Nova empresa
          </button>
        )}
      </div>

      {activeTab === 'cadastro' && canShowFormTab && (
        <div className="empresas-form-panel">
          <div className="empresas-form-panel-header">
            <h3 className="empresas-form-panel-title">
              {editEmpresa ? 'Editar empresa' : 'Nova empresa'}
            </h3>
            <button type="button" className="empresas-form-panel-back" onClick={handleCloseForm}>
              Voltar à lista
            </button>
          </div>
          <EmpresaForm
            initialData={editEmpresa ?? undefined}
            onClose={handleCloseForm}
            onSaved={load}
            existingEmployers={empresas}
          />
        </div>
      )}

      {activeTab === 'lista' && (
        <>
        <ListFiltersBar
          searchValue={searchTerm}
          onSearchChange={setSearchTerm}
          searchPlaceholder="Buscar por nome, razão social ou CNPJ..."
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
        <div className="empresas-card">
          {loading ? (
            <div className="empresas-loading">
              <Loader2 className="empresas-spin" /> Carregando...
            </div>
          ) : empresas.length === 0 ? (
            <p className="empresas-empty">
              Nenhuma empresa cadastrada. Crie a primeira para usar em colaboradores.
            </p>
          ) : filteredEmpresas.length === 0 ? (
            <p className="empresas-empty">Nenhuma empresa encontrada com os filtros aplicados.</p>
          ) : (
            <table className="empresas-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nome</th>
                  <th>CNPJ</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {filteredEmpresas.map((e) => (
                  <tr key={e.emr_id}>
                    <td>{e.emr_id}</td>
                    <td>
                      <span className="empresas-name">
                        <Building2 className="empresas-name-icon" />
                        {e.emr_trade_name || e.emr_name}
                      </span>
                      {e.emr_trade_name && (
                        <span className="empresas-name-secondary">{e.emr_name}</span>
                      )}
                    </td>
                    <td>{e.emr_tax_id || '—'}</td>
                    <td>
                      <span
                        className={`empresas-status ${e.emr_active === 1 ? 'empresas-status--active' : ''}`}
                      >
                        {e.emr_active === 1 ? 'Ativa' : 'Inativa'}
                      </span>
                    </td>
                    <td>
                      {allowEdit && (
                        <button
                          type="button"
                          className="empresas-edit-btn"
                          onClick={() => handleOpenEdit(e)}
                          title="Editar"
                        >
                          <Edit2 className="empresas-btn-icon" />
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        </>
      )}
    </div>
  );
};

export default Empresas;
