import React, { useState, useEffect } from 'react';
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
  '/colaboradores/novo': 'Novo Colaborador',
  '/funcoes': 'Gestão de Funções',
  '/epis': 'Tipo de EPIs',
  '/tipos-epi': 'Tipo de EPIs',
  '/tipos-epi/novo': 'Novo Tipo de EPI',
  '/variantes-epi': 'Variantes de EPIs',
  '/variantes-epi/novo': 'Nova Variante de EPI',
  '/regras-troca': 'Regras de Substituição',
  '/intercorrencias': 'Intercorrências (Inconsistências e Fraudes)',
  '/agenda-trocas': 'Agenda de Trocas Programadas',
  '/agenda-trocas/calendario': 'Calendário de Trocas',
  '/historico': 'Histórico e Rastreabilidade Jurídica',
  '/relatorios': 'Relatórios e BI',
  '/usuarios': 'Usuários',
  '/usuarios/novo': 'Novo Usuário',
  '/nova-secao': 'Nova Seção',
  '/nova-secao/novo': 'Cadastrar Setor',
  '/configuracoes': 'Configurações do Sistema',
};

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, hasProfile } = useAuth();
  const reportMatch = location.pathname.match(/^\/relatorios\/([^/]+)$/);
  const secaoEditMatch = location.pathname.match(/^\/nova-secao\/(\d+)\/editar$/);
  const title =
    titles[location.pathname] ||
    (secaoEditMatch ? 'Editar Setor' : null) ||
    (reportMatch ? 'Relatório' : 'EPI Control');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (sidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [sidebarOpen]);

  if (!isAuthenticated || !hasProfile) {
    return <>{children}</>;
  }

  return (
    <div className="layout-wrapper">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <main className="layout-main">
        <Topbar title={title} onMenuToggle={() => setSidebarOpen(prev => !prev)} />
        
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
