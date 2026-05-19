import React, { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { webhookService, type WebhookAPI, type WebhookEvent } from '../../services/webhookService';

const EVENTS: { key: WebhookEvent; label: string }[] = [
  { key: 'delivery.created', label: 'Entrega criada' },
  { key: 'delivery.expiring', label: 'Entrega vencendo' },
  { key: 'exchange.due', label: 'Troca programada' },
];

interface WebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
  editing?: WebhookAPI | null;
}

export const WebhookModal: React.FC<WebhookModalProps> = ({ isOpen, onClose, onSaved, editing }) => {
  const [url, setUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [saving, setSaving] = useState(false);
  const [createdSecret, setCreatedSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setUrl(editing?.whk_url ?? '');
      setSecret('');
      setEvents(editing?.whk_events ?? []);
      setCreatedSecret(null);
      setError(null);
    }
  }, [isOpen, editing]);

  const toggleEvent = (ev: WebhookEvent) => {
    setEvents((prev) => (prev.includes(ev) ? prev.filter((e) => e !== ev) : [...prev, ev]));
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      if (editing) {
        await webhookService.update(editing.whk_id, {
          whk_url: url,
          whk_events: events,
          ...(secret ? { whk_secret: secret } : {}),
        });
        onSaved();
        onClose();
      } else {
        const row = await webhookService.create({
          whk_url: url,
          whk_secret: secret || undefined,
          whk_events: events,
        });
        setCreatedSecret(row.whk_secret_plain ?? null);
        onSaved();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao salvar webhook');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={editing ? 'Editar Webhook' : 'Configurar Webhook'}>
      <div className="config-modal-content">
        {error && <p className="config-warning-title">{error}</p>}
        {createdSecret ? (
          <div className="config-nom-success">
            <p>
              <strong>Secret gerado (copie agora):</strong> {createdSecret}
            </p>
            <button type="button" className="config-card-link" onClick={onClose}>
              Fechar
            </button>
          </div>
        ) : (
          <>
            <div className="config-form-group">
              <label className="config-form-label">URL de destino</label>
              <input
                className="config-form-input"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://..."
              />
            </div>
            {!editing && (
              <div className="config-form-group">
                <label className="config-form-label">Secret (opcional)</label>
                <input
                  className="config-form-input"
                  value={secret}
                  onChange={(e) => setSecret(e.target.value)}
                />
              </div>
            )}
            <div className="config-sync-section">
              <label className="config-form-label">Eventos</label>
              <div className="config-sync-modules">
                {EVENTS.map((ev) => (
                  <label key={ev.key} className="config-sync-module-item">
                    <span className="config-sync-module-name">{ev.label}</span>
                    <input
                      type="checkbox"
                      className="config-checkbox"
                      checked={events.includes(ev.key)}
                      onChange={() => toggleEvent(ev.key)}
                    />
                  </label>
                ))}
              </div>
            </div>
            <div className="config-modal-actions">
              <button type="button" onClick={onClose} className="config-modal-cancel-btn">
                Cancelar
              </button>
              <button type="button" onClick={handleSave} className="config-modal-save-btn" disabled={saving}>
                {saving ? <Loader2 className="config-icon-sm config-spin" /> : null}
                Salvar
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
