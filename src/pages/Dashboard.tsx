import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { StatsCard } from '../components/dashboard/StatsCard';
import { ConsumptionChart } from '../components/dashboard/ConsumptionChart';
import { RiskIndicator } from '../components/dashboard/RiskIndicator';
import { DASHBOARD_STATS, CONSUMPTION_DATA } from '../services/api';

const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <ConsumptionChart data={CONSUMPTION_DATA} />
        <RiskIndicator />
      </div>

      <div className="bg-red-50 border border-red-100 rounded-2xl p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertTriangle className="text-red-600 w-5 h-5" />
          <h3 className="font-bold text-red-900">Alertas Prioritários de Auditoria</h3>
        </div>
        <div className="space-y-3">
          {[
            '5 Novas solicitações de EPI pendentes de aprovação.',
            'Unidade "CD São Paulo" possui 12 colaboradores com EPIs vencidos.',
            'CA do EPI "Protetor Auricular Plug" vence em 15 dias.'
          ].map((alert, i) => (
            <div key={i} className="flex items-center justify-between bg-white/60 p-3 rounded-lg border border-red-200/50">
              <span className="text-sm text-red-800">{alert}</span>
              <button className="text-xs font-bold text-red-600 hover:underline">Resolver Agora</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
