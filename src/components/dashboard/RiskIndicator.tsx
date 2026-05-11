import React from 'react';
import { useNavigate } from 'react-router-dom';
import './RiskIndicator.css';

export const RiskIndicator = () => {
  const navigate = useNavigate();

  return (
    <div className="risk-indicator">
      <h3 className="risk-indicator-title">Indicador de Risco Trabalhista</h3>
      <div className="risk-indicator-content">
        <div className="risk-indicator-gauge">
          <svg className="risk-indicator-svg">
            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" className="risk-indicator-track" />
            <circle cx="96" cy="96" r="80" stroke="currentColor" strokeWidth="12" fill="transparent" strokeDasharray={502.6} strokeDashoffset={502.6 * 0.15} className="risk-indicator-fill" />
          </svg>
          <div className="risk-indicator-center">
            <span className="risk-indicator-value">85%</span>
            <span className="risk-indicator-label">Seguro</span>
          </div>
        </div>
        <p className="risk-indicator-description">
          Sua empresa possui um baixo risco de passivo trabalhista relacionado a EPIs.
        </p>
      </div>
      <button 
        onClick={() => navigate('/relatorios/conformidade')}
        className="risk-indicator-button"
      >
        Ver Relatório de Risco
      </button>
    </div>
  );
};
