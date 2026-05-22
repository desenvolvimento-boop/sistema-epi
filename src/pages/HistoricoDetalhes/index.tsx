import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  CheckCircle2,
  ShieldCheck,
  RefreshCw,
  Calendar,
  History,
  User,
  Loader2,
  Package,
  MapPin,
  ScanFace,
  ExternalLink,
  Building2,
} from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import clsx from 'clsx';
import {
  deliveryService,
  getDeliveryValidationStatus,
  type DeliveryAPI,
  type HistoryStatus,
} from '../../services/deliveryService';
import { PageHeader, PageHeaderBackButton } from '../../components/layout/PageHeader';
import './styles.css';

const HistoricoDetalhes = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const empId = Number(id);

  const [deliveries, setDeliveries] = useState<DeliveryAPI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!empId) return;
    setLoading(true);
    setError(null);
    try {
      const data = await deliveryService.getByEmployee(empId);
      data.sort((a, b) => b.dlv_date.localeCompare(a.dlv_date));
      setDeliveries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar prontuário');
      setDeliveries([]);
    } finally {
      setLoading(false);
    }
  }, [empId]);

  useEffect(() => {
    load();
  }, [load]);

  const colaborador = deliveries[0]?.employee?.emp_full_name ?? `Colaborador #${empId}`;
  const empresa = deliveries[0]?.employee?.company?.com_description;
  const unidade = deliveries[0]?.employee?.section?.sec_description;

  const stats = useMemo(() => {
    const counts = { Validado: 0, Concluído: 0, Pendente: 0 };
    for (const d of deliveries) {
      const s = getDeliveryValidationStatus(d);
      counts[s] += 1;
    }
    const ultima = deliveries[0]?.dlv_date;
    return { counts, ultima, total: deliveries.length };
  }, [deliveries]);

  const formatDateTime = (iso: string) => {
    try {
      return format(parseISO(iso), 'dd MMM yyyy', { locale: ptBR });
    } catch {
      return iso;
    }
  };

  const getStatusBadgeClass = (status: HistoryStatus) => {
    switch (status) {
      case 'Validado':
        return 'detalhes-validation-validado';
      case 'Pendente':
        return 'detalhes-validation-pendente';
      default:
        return 'detalhes-validation-concluido';
    }
  };

  const getEventMeta = (d: DeliveryAPI) => {
    const typeName = d.variant?.epiType?.ept_description ?? 'EPI';
    const variantName = d.variant
      ? [d.variant.epv_manufacturer, d.variant.epv_model].filter(Boolean).join(' · ')
      : '';
    const title = `${d.dlv_kind} de ${typeName}${variantName ? `: ${variantName}` : ''}`;
    const detail = d.dlv_notes ? d.dlv_notes : `CA ${d.variant?.epv_ca ?? '—'}`;
    const icon = d.dlv_kind === 'Troca' ? RefreshCw : ShieldCheck;
    const color =
      d.dlv_kind === 'Troca' ? 'detalhes-timeline-color-blue' : 'detalhes-timeline-color-primary';
    const validationStatus = getDeliveryValidationStatus(d);
    return { title, detail, icon, color, type: d.dlv_kind, validationStatus };
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
      <PageHeader
        leading={<PageHeaderBackButton onClick={() => navigate('/historico')} />}
        icon={History}
        title="Prontuário de Entregas"
        subtitle="Rastreabilidade de entregas e trocas de EPI"
      />

      {error && (
        <div className="detalhes-error">
          <span>{error}</span>
          <button type="button" className="detalhes-retry-btn" onClick={load}>
            Tentar novamente
          </button>
        </div>
      )}

      <div className="detalhes-stats-grid">
        <div className="detalhes-stat-card">
          <div>
            <p className="detalhes-stat-label">Total de Entregas</p>
            <h3 className="detalhes-stat-value">{stats.total}</h3>
          </div>
          <div className="detalhes-stat-icon detalhes-stat-icon--primary">
            <Package className="detalhes-icon-md" />
          </div>
        </div>
        <div className="detalhes-stat-card">
          <div>
            <p className="detalhes-stat-label">Última Atividade</p>
            <h3 className="detalhes-stat-value">
              {stats.ultima
                ? format(parseISO(stats.ultima), 'dd/MM/yyyy', { locale: ptBR })
                : '—'}
            </h3>
          </div>
          <div className="detalhes-stat-icon detalhes-stat-icon--blue">
            <Calendar className="detalhes-icon-md" />
          </div>
        </div>
        <div className="detalhes-stat-card">
          <div>
            <p className="detalhes-stat-label">Validados / Pendentes</p>
            <h3 className="detalhes-stat-value detalhes-stat-value--sm">
              {stats.counts.Validado} / {stats.counts.Pendente}
            </h3>
          </div>
          <div className="detalhes-stat-icon detalhes-stat-icon--emerald">
            <CheckCircle2 className="detalhes-icon-md" />
          </div>
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
            {colaborador
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)}
          </div>
          <div>
            <h2 className="detalhes-name">{colaborador}</h2>
            <div className="detalhes-info-grid">
              <p className="detalhes-info-item">
                <User className="detalhes-info-icon" /> Matrícula/ID: {empId}
              </p>
              {empresa && (
                <p className="detalhes-info-item">
                  <Building2 className="detalhes-info-icon" /> {empresa}
                </p>
              )}
              {unidade && (
                <p className="detalhes-info-item">
                  <MapPin className="detalhes-info-icon" /> {unidade}
                </p>
              )}
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
              const hasGeo = d.dlv_latitude != null && d.dlv_longitude != null;
              const faceScore =
                d.dlv_face_score != null ? Number(d.dlv_face_score).toFixed(2) : null;

              return (
                <div key={d.dlv_id} className="detalhes-timeline-item">
                  <div className={clsx('detalhes-timeline-icon-base', meta.color)}>
                    <Icon className="detalhes-icon-md" />
                  </div>
                  <div className="detalhes-timeline-content">
                    <div className="detalhes-timeline-header">
                      <span className="detalhes-timeline-type">{meta.type}</span>
                      <div className="detalhes-timeline-header-right">
                        <span
                          className={clsx(
                            'detalhes-validation-badge',
                            getStatusBadgeClass(meta.validationStatus)
                          )}
                        >
                          {meta.validationStatus}
                        </span>
                        <span className="detalhes-timeline-date">
                          <Calendar className="detalhes-icon-xs" /> {formatDateTime(d.dlv_date)}
                        </span>
                      </div>
                    </div>
                    <h4 className="detalhes-timeline-title">{meta.title}</h4>
                    <p className="detalhes-timeline-status">{meta.detail}</p>

                    {(hasGeo || faceScore != null || d.dlv_face_photo_url) && (
                      <div className="detalhes-trace-block">
                        {faceScore != null && (
                          <p className="detalhes-trace-item">
                            <ScanFace className="detalhes-icon-xs" />
                            Score facial: {faceScore}
                            {d.dlv_face_valid === 1 && ' (validado)'}
                            {d.dlv_face_valid === 0 && ' (não validado)'}
                          </p>
                        )}
                        {hasGeo && (
                          <p className="detalhes-trace-item">
                            <MapPin className="detalhes-icon-xs" />
                            Geo: {Number(d.dlv_latitude).toFixed(5)}, {Number(d.dlv_longitude).toFixed(5)}
                            {d.dlv_geo_accuracy != null && ` (±${d.dlv_geo_accuracy}m)`}
                          </p>
                        )}
                        {d.dlv_face_photo_url && (
                          <a
                            href={d.dlv_face_photo_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="detalhes-evidence-btn"
                          >
                            <ExternalLink className="detalhes-icon-xs" />
                            Ver foto de validação
                          </a>
                        )}
                      </div>
                    )}

                    {d.insertedBy?.usr_full_name && (
                      <p className="detalhes-responsible">
                        Responsável: {d.insertedBy.usr_full_name}
                      </p>
                    )}
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
