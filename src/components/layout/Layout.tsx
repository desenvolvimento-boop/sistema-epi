import React from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { BarChart3 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const titles: Record<string, string> = {
  '/dashboard': 'Visão Geral do Sistema',
  '/colaboradores': 'Gestão de Colaboradores',
  '/funcoes': 'Gestão de Funções',
  '/epis': 'Catálogo de EPIs',
  '/regras-troca': 'Regras de Substituição',
  '/matriz-funcao-epi': 'Matriz de Riscos e EPIs',
  '/consumo': 'Registro de Consumo',
  '/intercorrencias': 'Intercorrências (Inconsistências e Fraudes)',
  '/agenda-trocas': 'Agenda de Trocas Programadas',
  '/agenda-trocas/calendario': 'Calendário de Trocas',
  '/historico': 'Histórico e Rastreabilidade Jurídica',
  '/relatorios': 'Relatórios e BI',
  '/usuarios': 'Usuários',
  '/configuracoes': 'Configurações do Sistema',
};

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const title = titles[location.pathname] || 'EPI Control';

  if (!isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="layout-wrapper">
      <Sidebar />
      
      <main className="layout-main">
        <Topbar title={title} />
        
        <div className="layout-content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
