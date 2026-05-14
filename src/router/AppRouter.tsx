import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Login from '../pages/Login';
import RecuperarSenha from '../pages/RecuperarSenha';
import Dashboard from '../pages/Dashboard';
import Colaboradores from '../pages/Colaboradores';
import Funcoes from '../pages/Funcoes';
import EPIs from '../pages/EPIs';
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
      <Route path="/colaboradores" element={<Colaboradores />} />
      <Route path="/colaboradores/:id/historico" element={<ColaboradorHistorico />} />
      <Route path="/colaboradores/:id/editar" element={<ColaboradorEditar />} />
      <Route path="/colaboradores/:id/detalhes" element={<ColaboradorDetalhes />} />
      <Route path="/colaboradores/:id/emitir-ficha" element={<EmitirFichaEPI />} />
      <Route path="/colaboradores/:id/transferir-unidade" element={<TransferirUnidade />} />
      <Route path="/colaboradores/:id/desativar" element={<DesativarColaborador />} />
      <Route path="/funcoes" element={<Funcoes />} />
      <Route path="/funcoes/:id/detalhes" element={<FuncaoDetalhes />} />
      <Route path="/funcoes/:id/editar" element={<FuncaoEditar />} />
      <Route path="/epis" element={<EPIs />} />
      <Route path="/regras-troca" element={<RegrasTroca />} />
      <Route path="/matriz-funcao-epi" element={<MatrizFuncaoEPI />} />
      <Route path="/intercorrencias" element={<Intercorrencias />} />
      <Route path="/consumo" element={<Consumo />} />
      <Route path="/agenda-trocas" element={<AgendaTrocas />} />
      <Route path="/agenda-trocas/calendario" element={<CalendarioAgenda />} />
      <Route path="/historico" element={<Historico />} />
      <Route path="/historico/:id" element={<HistoricoDetalhes />} />
      <Route path="/usuarios" element={<Usuarios />} />
      <Route path="/relatorios" element={<Relatorios />} />
      <Route path="/relatorios/:id" element={<RelatorioDetalhes />} />
      <Route path="/configuracoes" element={<Configuracoes />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
