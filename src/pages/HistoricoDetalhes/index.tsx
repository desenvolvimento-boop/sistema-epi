import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  ArrowLeft,
  Calendar,
  User,
  Loader2,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import clsx from 'clsx';
import { deliveryService, type DeliveryAPI } from '../../services/deliveryService';
import './styles.css';

const HistoricoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const empId = Number(id);

  const [deliveries, setDeliveries] = useState<DeliveryAPI[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!empId) return;
    const load = async () => {
      setLoading(true);
      try {
        const data = await deliveryService.getByEmployee(empId);
        data.sort((a, b) => b.dlv_date.localeCompare(a.dlv_date));
        setDeliveries(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [empId]);

  const colaborador = deliveries[0]?.employee?.emp_full_name ?? `Colaborador #${empId}`;

  const formatDateTime = (iso: string) => {
    try {
      return format(parseISO(iso), "dd MMM yyyy", { locale: ptBR });
    } catch {
      return iso;
    }
  };

  const getEventMeta = (d: DeliveryAPI) => {
    const typeName = d.variant?.epiType?.ept_description ?? 'EPI';
    const variantName = d.variant
      ? [d.variant.epv_manufacturer, d.variant.epv_model].filter(Boolean).join(' · ')
      : '';
    const title = `${d.dlv_kind} de ${typeName}${variantName ? `: ${variantName}` : ''}`;
    const status = d.dlv_notes ? d.dlv_notes : `CA ${d.variant?.epv_ca ?? '—'}`;
    const icon = d.dlv_kind === 'Troca' ? RefreshCw : ShieldCheck;
    const color =
      d.dlv_kind === 'Troca' ? 'detalhes-timeline-color-blue' : 'detalhes-timeline-color-primary';
    return { title, status, icon, color, type: d.dlv_kind };
  };

  if (loading) {
    return (
      <div className="detalhes-container">
        <div className="detalhes-loading">
          <Loader2 className="detalhes-icon-md detalhes-spin" />
          <span>Carregando prontuário...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="detalhes-container">
      <div className="detalhes-header">
        <button onClick={() => navigate('/historico')} className="detalhes-back-btn" type="button">
          <ArrowLeft className="detalhes-back-icon" />
        </button>
        <div>
          <h2 className="detalhes-title">Prontuário de Entregas</h2>
          <p className="detalhes-subtitle">Rastreabilidade de entregas e trocas de EPI</p>
        </div>
      </div>

      <div className="detalhes-card">
        <div className="detalhes-badge-wrapper">
          <div className="detalhes-badge">
            <CheckCircle2 className="detalhes-icon-md" />
            <span className="detalhes-badge-text">{deliveries.length} registro(s)</span>
          </div>
        </div>

        <div className="detalhes-profile">
          <div className="detalhes-avatar">
            {colaborador.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div>
            <h2 className="detalhes-name">{colaborador}</h2>
            <div className="detalhes-info-grid">
              <p className="detalhes-info-item">
                <User className="detalhes-info-icon" /> Matrícula/ID: {empId}
              </p>
            </div>
          </div>
        </div>

        <div className="detalhes-timeline">
          {deliveries.length === 0 ? (
            <p className="detalhes-empty">Nenhuma entrega registrada para este colaborador.</p>
          ) : (
            deliveries.map((d) => {
              const meta = getEventMeta(d);
              const Icon = meta.icon;
              return (
                <div key={d.dlv_id} className="detalhes-timeline-item">
                  <div className={clsx('detalhes-timeline-icon-base', meta.color)}>
                    <Icon className="detalhes-icon-md" />
                  </div>
                  <div className="detalhes-timeline-content">
                    <div className="detalhes-timeline-header">
                      <span className="detalhes-timeline-type">{meta.type}</span>
                      <span className="detalhes-timeline-date">
                        <Calendar className="detalhes-icon-xs" /> {formatDateTime(d.dlv_date)}
                      </span>
                    </div>
                    <h4 className="detalhes-timeline-title">{meta.title}</h4>
                    <p className="detalhes-timeline-status">{meta.status}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default HistoricoDetalhes;
