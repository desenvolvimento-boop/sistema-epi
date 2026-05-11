import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { StatsCard } from '../../components/dashboard/StatsCard';
import { ConsumptionChart } from '../../components/dashboard/ConsumptionChart';
import { RiskIndicator } from '../../components/dashboard/RiskIndicator';
import { DASHBOARD_STATS, CONSUMPTION_DATA } from '../../services/api';
import './styles.css';

const Dashboard = () => {
  return (
    <div className="dashboard-page">
      <div className="dashboard-stats-grid">
        {DASHBOARD_STATS.map((stat, idx) => (
          <StatsCard 
            key={stat.label}
            index={idx}
            label={stat.label}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
            color={stat.color}
          />
        ))}
      </div>

      <div className="dashboard-charts-grid">
        <ConsumptionChart data={CONSUMPTION_DATA} />
        <RiskIndicator />
      </div>

      <div className="dashboard-alerts">
        <div className="dashboard-alerts-header">
          <AlertTriangle className="dashboard-alerts-icon" />
          <h3 className="dashboard-alerts-title">Alertas Prioritários de Auditoria</h3>
        </div>
        <div className="dashboard-alerts-list">
          {[
            '5 Novas solicitações de EPI pendentes de aprovação.',
            'Unidade "CD São Paulo" possui 12 colaboradores com EPIs vencidos.',
            'CA do EPI "Protetor Auricular Plug" vence em 15 dias.'
          ].map((alert, i) => (
            <div key={i} className="dashboard-alert-item">
              <span className="dashboard-alert-text">{alert}</span>
              <button className="dashboard-alert-action">Resolver Agora</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
