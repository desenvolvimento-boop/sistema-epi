import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { epiTypeService, type EpiTypeAPI } from '../../services/epiTypeService';
import { EpiVariantForm } from '../../components/forms/EpiVariantForm';
import '../ColaboradorEditar/styles.css';
import '../EPIs/styles.css';

const VarianteEPINovo = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [types, setTypes] = useState<EpiTypeAPI[]>([]);
  const [loading, setLoading] = useState(true);

  const tipoParam = searchParams.get('tipo');
  const eptId = tipoParam ? Number(tipoParam) : undefined;

  const handleClose = () => navigate('/variantes-epi');
  const handleSaved = () => navigate('/variantes-epi');

  useEffect(() => {
    const loadTypes = async () => {
      setLoading(true);
      try {
        const data = await epiTypeService.getAll();
        setTypes(data);
      } catch (err) {
        console.error(err);
        setTypes([]);
      } finally {
        setLoading(false);
      }
    };
    loadTypes();
  }, []);

  const activeTypes = types.filter((t) => t.ept_active === 1);

  return (
    <div className="editar-container">
      <div className="editar-header">
        <button onClick={handleClose} className="editar-back-btn" type="button">
          <ArrowLeft className="editar-back-icon" />
        </button>
        <div>
          <h2 className="editar-title">Nova Variante</h2>
          <p className="editar-subtitle">
            Cadastre uma variante homologada (fabricante, modelo e CA) vinculada a um tipo de EPI
          </p>
        </div>
      </div>


      <div className="editar-card">
        <div className="editar-card-body">
          {loading ? (
            <div className="epis-loading" style={{ justifyContent: 'center', padding: '2rem' }}>
              <Loader2 className="icon-sm epis-spin" />
              <span>Carregando tipos de EPI...</span>
            </div>
          ) : activeTypes.length === 0 ? (
            <p style={{ color: 'var(--color-slate-500)', fontSize: '0.875rem' }}>
              Nenhum tipo de EPI ativo cadastrado. Cadastre um tipo em <strong>Tipo de EPIs</strong> antes de
              adicionar variantes.
            </p>
          ) : (
            <EpiVariantForm
              types={types}
              eptId={eptId}
              onClose={handleClose}
              onSaved={handleSaved}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default VarianteEPINovo;
