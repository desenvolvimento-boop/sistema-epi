import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Modal } from '../../components/ui/Modal';
import { apiKeyService } from '../../services/apiKeyService';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onSaved }) => {
  const [name, setName] = useState('');
  const [generatedKey, setGeneratedKey] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setSaving(true);
    setError(null);
    try {
      const row = await apiKeyService.create(name);
      setGeneratedKey(row.apiKey);
      onSaved();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erro ao gerar chave');
    } finally {
      setSaving(false);
    }
  };

  const handleClose = () => {
    setName('');
    setGeneratedKey(null);
    setError(null);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Gerar Nova Chave de API">
      <div className="config-modal-content">
        {error && <p className="config-warning-title">{error}</p>}
        {generatedKey ? (
          <div className="config-nom-success">
            <p>
              <strong>Chave (copie agora — não será exibida novamente):</strong>
            </p>
            <code style={{ wordBreak: 'break-all', display: 'block', marginTop: '0.5rem' }}>{generatedKey}</code>
            <button type="button" className="config-card-link" onClick={handleClose} style={{ marginTop: '1rem' }}>
              Fechar
            </button>
          </div>
        ) : (
          <>
            <div className="config-form-group">
              <label className="config-form-label">Nome da chave</label>
              <input
                className="config-form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="config-modal-actions">
              <button type="button" onClick={handleClose} className="config-modal-cancel-btn">
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleGenerate}
                className="config-modal-save-btn"
                disabled={saving || !name.trim()}
              >
                {saving ? <Loader2 className="config-icon-sm config-spin" /> : null}
                Gerar
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
