import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from '../pages/Login';
import RecuperarSenha from '../pages/RecuperarSenha';
import Dashboard from '../pages/Dashboard';
import Colaboradores from '../pages/Colaboradores';
import Funcoes from '../pages/Funcoes';
import EPIs from '../pages/EPIs';
import TiposEPI from '../pages/TiposEPI';
import VariantesEPI from '../pages/VariantesEPI';
import RegrasTroca from '../pages/RegrasTroca';
import MatrizFuncaoEPI from '../pages/MatrizFuncaoEPI';
import Intercorrencias from '../pages/Intercorrencias';
import Historico from '../pages/Historico';
import HistoricoDetalhes from '../pages/HistoricoDetalhes';
import Usuarios from '../pages/Usuarios';
import Relatorios from '../pages/Relatorios';
import RelatorioDetalhes from '../pages/RelatorioDetalhes';
import Consumo from '../pages/Consumo';
import AgendaTrocas from '../pages/AgendaTrocas';
import CalendarioAgenda from '../pages/CalendarioAgenda';
import Configuracoes from '../pages/Configuracoes';
import ColaboradorHistorico from '../pages/ColaboradorHistorico';
import ColaboradorEditar from '../pages/ColaboradorEditar';
import ColaboradorDetalhes from '../pages/ColaboradorDetalhes';
import EmitirFichaEPI from '../pages/EmitirFichaEPI';
import TransferirUnidade from '../pages/TransferirUnidade';
import DesativarColaborador from '../pages/DesativarColaborador';
import FuncaoDetalhes from '../pages/FuncaoDetalhes';
import FuncaoEditar from '../pages/FuncaoEditar';
import PlaceholderPage from '../components/PlaceholderPage';

const ProtectedRoute = ({ path, children }: { path: string; children: React.ReactNode }) => {
  const { canView } = useAuth();
  if (!canView(path)) {
    return <Navigate to="/dashboard" replace />;
  }
  return <>{children}</>;
};

export const AppRouter = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-slate-950, #020617)',
        color: 'var(--color-slate-400, #94a3b8)',
        fontSize: '0.875rem',
      }}>
        Carregando...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/recuperar-senha" element={<RecuperarSenha />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/colaboradores" element={<ProtectedRoute path="/colaboradores"><Colaboradores /></ProtectedRoute>} />
      <Route path="/colaboradores/:id/historico" element={<ProtectedRoute path="/colaboradores"><ColaboradorHistorico /></ProtectedRoute>} />
      <Route path="/colaboradores/:id/editar" element={<ProtectedRoute path="/colaboradores"><ColaboradorEditar /></ProtectedRoute>} />
      <Route path="/colaboradores/:id/detalhes" element={<ProtectedRoute path="/colaboradores"><ColaboradorDetalhes /></ProtectedRoute>} />
      <Route path="/colaboradores/:id/emitir-ficha" element={<ProtectedRoute path="/colaboradores"><EmitirFichaEPI /></ProtectedRoute>} />
      <Route path="/colaboradores/:id/transferir-unidade" element={<ProtectedRoute path="/colaboradores"><TransferirUnidade /></ProtectedRoute>} />
      <Route path="/colaboradores/:id/desativar" element={<ProtectedRoute path="/colaboradores"><DesativarColaborador /></ProtectedRoute>} />
      <Route path="/funcoes" element={<ProtectedRoute path="/funcoes"><Funcoes /></ProtectedRoute>} />
      <Route path="/funcoes/:id/detalhes" element={<ProtectedRoute path="/funcoes"><FuncaoDetalhes /></ProtectedRoute>} />
      <Route path="/funcoes/:id/editar" element={<ProtectedRoute path="/funcoes"><FuncaoEditar /></ProtectedRoute>} />
      <Route path="/epis" element={<ProtectedRoute path="/epis"><EPIs /></ProtectedRoute>} />
      <Route path="/tipos-epi" element={<ProtectedRoute path="/epis"><TiposEPI /></ProtectedRoute>} />
      <Route path="/variantes-epi" element={<ProtectedRoute path="/epis"><VariantesEPI /></ProtectedRoute>} />
      <Route path="/regras-troca" element={<ProtectedRoute path="/regras-troca"><RegrasTroca /></ProtectedRoute>} />
      <Route path="/matriz-funcao-epi" element={<ProtectedRoute path="/matriz-funcao-epi"><MatrizFuncaoEPI /></ProtectedRoute>} />
      <Route path="/intercorrencias" element={<ProtectedRoute path="/intercorrencias"><Intercorrencias /></ProtectedRoute>} />
      <Route path="/consumo" element={<ProtectedRoute path="/consumo"><Consumo /></ProtectedRoute>} />
      <Route path="/agenda-trocas" element={<ProtectedRoute path="/agenda-trocas"><AgendaTrocas /></ProtectedRoute>} />
      <Route path="/agenda-trocas/calendario" element={<ProtectedRoute path="/agenda-trocas"><CalendarioAgenda /></ProtectedRoute>} />
      <Route path="/historico" element={<ProtectedRoute path="/historico"><Historico /></ProtectedRoute>} />
      <Route path="/historico/:id" element={<ProtectedRoute path="/historico"><HistoricoDetalhes /></ProtectedRoute>} />
      <Route path="/usuarios" element={<ProtectedRoute path="/usuarios"><Usuarios /></ProtectedRoute>} />
      <Route path="/relatorios" element={<ProtectedRoute path="/relatorios"><Relatorios /></ProtectedRoute>} />
      <Route path="/relatorios/:id" element={<ProtectedRoute path="/relatorios"><RelatorioDetalhes /></ProtectedRoute>} />
      <Route path="/configuracoes" element={<ProtectedRoute path="/configuracoes"><Configuracoes /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
