import React, { useState, useEffect, useMemo } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../contexts/AuthContext';
import { useNomenclature } from '../../hooks/useNomenclature';
import { NOMENCLATURE_KEYS } from '../../config/nomenclatureKeys';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
}

const PAGE_TITLE_KEYS: Record<string, string> = {
  '/dashboard': NOMENCLATURE_KEYS.page.dashboard,
  '/colaboradores': NOMENCLATURE_KEYS.page.colaboradores,
  '/colaboradores/novo': NOMENCLATURE_KEYS.page.colaboradores_novo,
  '/funcoes': NOMENCLATURE_KEYS.page.funcoes,
  '/epis': NOMENCLATURE_KEYS.page.epis,
  '/tipos-epi': NOMENCLATURE_KEYS.page.epis,
  '/tipos-epi/novo': NOMENCLATURE_KEYS.page.tipos_epi_novo,
  '/variantes-epi': NOMENCLATURE_KEYS.page.variantes_epi,
  '/variantes-epi/novo': NOMENCLATURE_KEYS.page.variantes_epi_novo,
  '/regras-troca': NOMENCLATURE_KEYS.page.regras_troca,
  '/intercorrencias': NOMENCLATURE_KEYS.page.intercorrencias,
  '/agenda-trocas': NOMENCLATURE_KEYS.page.agenda_trocas,
  '/agenda-trocas/calendario': NOMENCLATURE_KEYS.page.agenda_trocas_calendario,
  '/historico': NOMENCLATURE_KEYS.page.historico,
  '/relatorios': NOMENCLATURE_KEYS.page.relatorios,
  '/usuarios': NOMENCLATURE_KEYS.page.usuarios,
  '/usuarios/novo': NOMENCLATURE_KEYS.page.usuarios_novo,
  '/nova-secao': NOMENCLATURE_KEYS.page.section_list,
  '/nova-secao/novo': NOMENCLATURE_KEYS.page.section_create,
  '/configuracoes': NOMENCLATURE_KEYS.page.configuracoes,
};

export const Layout = ({ children }: LayoutProps) => {
  const location = useLocation();
  const { isAuthenticated, hasProfile } = useAuth();
  const { t } = useNomenclature();
  const reportMatch = location.pathname.match(/^\/relatorios\/([^/]+)$/);
  const secaoEditMatch = location.pathname.match(/^\/nova-secao\/(\d+)\/editar$/);

  const title = useMemo(() => {
    const key = PAGE_TITLE_KEYS[location.pathname];
    if (key) return t(key);
    if (secaoEditMatch) return t(NOMENCLATURE_KEYS.page.section_edit);
    if (reportMatch) return t(NOMENCLATURE_KEYS.page.relatorios_detalhe);
    return t(NOMENCLATURE_KEYS.page.app_default);
  }, [location.pathname, secaoEditMatch, reportMatch, t]);

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
