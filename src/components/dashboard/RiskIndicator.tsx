import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RiskIndicator.css';

interface RiskIndicatorProps {
  score: number;
  label: string;
  description: string;
}

const CIRCUMFERENCE = 502.6;

export const RiskIndicator = ({ score, label, description }: RiskIndicatorProps) => {
  const navigate = useNavigate();
  const clamped = Math.max(0, Math.min(100, score));
  const offset = CIRCUMFERENCE * (1 - clamped / 100);

  return (
    <div className="risk-indicator">
      <h3 className="risk-indicator-title">Indicador de Risco Trabalhista</h3>
      <div className="risk-indicator-content">
        <div className="risk-indicator-gauge">
          <svg className="risk-indicator-svg" viewBox="0 0 192 192">
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="risk-indicator-track"
            />
            <circle
              cx="96"
              cy="96"
              r="80"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              className="risk-indicator-fill"
            />
          </svg>
          <div className="risk-indicator-center">
            <span className="risk-indicator-value">{clamped}%</span>
            <span className="risk-indicator-label">{label}</span>
          </div>
        </div>
        <p className="risk-indicator-description">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => navigate('/relatorios/nao-conformidades')}
        className="risk-indicator-button"
      >
        Ver Relatório de Risco
      </button>
    </div>
  );
};