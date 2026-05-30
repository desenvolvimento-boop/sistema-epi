import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { resolveRoutePermissionPath } from '../utils/permissionPaths';
import Login from '../pages/Login';
import RecuperarSenha from '../pages/RecuperarSenha';
import SemPerfil from '../pages/SemPerfil';
import Dashboard from '../pages/Dashboard';
import Colaboradores from '../pages/Colaboradores';
import Funcoes from '../pages/Funcoes';
import EPIs from '../pages/EPIs';
import TiposEPI from '../pages/TiposEPI';
import TipoEPINovo from '../pages/TipoEPINovo';
import VariantesEPI from '../pages/VariantesEPI';
import VarianteEPINovo from '../pages/VarianteEPINovo';
import Intercorrencias from '../pages/Intercorrencias';
import Historico from '../pages/Historico';
import HistoricoDetalhes from '../pages/HistoricoDetalhes';
import Usuarios from '../pages/Usuarios';
import UsuarioNovo from '../pages/UsuarioNovo';
import Relatorios from '../pages/Relatorios';
import RelatorioDetalhes from '../pages/RelatorioDetalhes';
import AgendaTrocas from '../pages/AgendaTrocas';
import CalendarioAgenda from '../pages/CalendarioAgenda';
import Configuracoes from '../pages/Configuracoes';
import ColaboradorHistorico from '../pages/ColaboradorHistorico';
import ColaboradorEditar from '../pages/ColaboradorEditar';
import ColaboradorNovo from '../pages/ColaboradorNovo';
import NovaSecao from '../pages/NovaSecao';
import NovaSecaoCadastro from '../pages/NovaSecaoCadastro';
import NovaSecaoEditar from '../pages/NovaSecaoEditar';
import ColaboradorDetalhes from '../pages/ColaboradorDetalhes';
import EmitirFichaEPI from '../pages/EmitirFichaEPI';
import TransferirUnidade from '../pages/TransferirUnidade';
import DesativarColaborador from '../pages/DesativarColaborador';
import FuncaoDetalhes from '../pages/FuncaoDetalhes';
import FuncaoEditar from '../pages/FuncaoEditar';

type PermissionAction = 'prm_view' | 'prm_create' | 'prm_edit' | 'prm_delete';

const ProtectedRoute = ({
  path,
  action = 'prm_view',
  children,
}: {
  path: string;
  action?: PermissionAction;
  children: React.ReactNode;
}) => {
  const { canView, canCreate, canEdit, canDelete, hasProfile } = useAuth();

  if (!hasProfile) {
    return <Navigate to="/sem-perfil" replace />;
  }

  const resolved = resolveRoutePermissionPath(path);
  const allowed =
    action === 'prm_view' ? canView(resolved) :
    action === 'prm_create' ? canCreate(resolved) :
    action === 'prm_edit' ? canEdit(resolved) :
    canDelete(resolved);

  if (!allowed) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export const AppRouter = () => {
  const { isAuthenticated, hasProfile, loading } = useAuth();

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--color-slate-950, #0a1128)',
        color: 'var(--color-slate-400, #adb5bd)',
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

  if (!hasProfile) {
    return (
      <Routes>
        <Route path="/sem-perfil" element={<SemPerfil />} />
        <Route path="*" element={<Navigate to="/sem-perfil" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/dashboard" replace />} />
      <Route path="/sem-perfil" element={<Navigate to="/dashboard" replace />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/colaboradores" element={<ProtectedRoute path="/colaboradores"><Colaboradores /></ProtectedRoute>} />
      <Route path="/colaboradores/novo" element={<ProtectedRoute path="/colaboradores" action="prm_create"><ColaboradorNovo /></ProtectedRoute>} />
      <Route path="/colaboradores/:id/historico" element={<ProtectedRoute path="/colaboradores"><ColaboradorHistorico /></ProtectedRoute>} />
      <Route path="/colaboradores/:id/editar" element={<ProtectedRoute path="/colaboradores" action="prm_edit"><ColaboradorEditar /></ProtectedRoute>} />
      <Route path="/colaboradores/:id/detalhes" element={<ProtectedRoute path="/colaboradores"><ColaboradorDetalhes /></ProtectedRoute>} />
      <Route path="/colaboradores/:id/emitir-ficha" element={<ProtectedRoute path="/colaboradores" action="prm_edit"><EmitirFichaEPI /></ProtectedRoute>} />
      <Route path="/colaboradores/:id/transferir-unidade" element={<ProtectedRoute path="/colaboradores" action="prm_edit"><TransferirUnidade /></ProtectedRoute>} />
      <Route path="/colaboradores/:id/desativar" element={<ProtectedRoute path="/colaboradores" action="prm_delete"><DesativarColaborador /></ProtectedRoute>} />
      <Route path="/funcoes" element={<ProtectedRoute path="/funcoes"><Funcoes /></ProtectedRoute>} />
      <Route path="/funcoes/:id/detalhes" element={<ProtectedRoute path="/funcoes"><FuncaoDetalhes /></ProtectedRoute>} />
      <Route path="/funcoes/:id/editar" element={<ProtectedRoute path="/funcoes" action="prm_edit"><FuncaoEditar /></ProtectedRoute>} />
      <Route path="/epis" element={<ProtectedRoute path="/epis"><EPIs /></ProtectedRoute>} />
      <Route path="/tipos-epi" element={<ProtectedRoute path="/tipos-epi"><TiposEPI /></ProtectedRoute>} />
      <Route path="/tipos-epi/novo" element={<ProtectedRoute path="/tipos-epi" action="prm_create"><TipoEPINovo /></ProtectedRoute>} />
      <Route path="/variantes-epi" element={<ProtectedRoute path="/variantes-epi"><VariantesEPI /></ProtectedRoute>} />
      <Route path="/variantes-epi/novo" element={<ProtectedRoute path="/variantes-epi" action="prm_create"><VarianteEPINovo /></ProtectedRoute>} />
      <Route path="/intercorrencias" element={<ProtectedRoute path="/intercorrencias"><Intercorrencias /></ProtectedRoute>} />
      <Route path="/agenda-trocas" element={<ProtectedRoute path="/agenda-trocas"><AgendaTrocas /></ProtectedRoute>} />
      <Route path="/agenda-trocas/calendario" element={<ProtectedRoute path="/agenda-trocas"><CalendarioAgenda /></ProtectedRoute>} />
      <Route path="/historico" element={<ProtectedRoute path="/historico"><Historico /></ProtectedRoute>} />
      <Route path="/historico/:id" element={<ProtectedRoute path="/historico"><HistoricoDetalhes /></ProtectedRoute>} />
      <Route path="/usuarios" element={<ProtectedRoute path="/usuarios"><Usuarios /></ProtectedRoute>} />
      <Route path="/usuarios/novo" element={<ProtectedRoute path="/usuarios" action="prm_create"><UsuarioNovo /></ProtectedRoute>} />
      <Route path="/nova-secao" element={<ProtectedRoute path="/nova-secao"><NovaSecao /></ProtectedRoute>} />
      <Route path="/nova-secao/novo" element={<ProtectedRoute path="/nova-secao" action="prm_create"><NovaSecaoCadastro /></ProtectedRoute>} />
      <Route path="/nova-secao/:id/editar" element={<ProtectedRoute path="/nova-secao" action="prm_edit"><NovaSecaoEditar /></ProtectedRoute>} />
      <Route path="/relatorios" element={<ProtectedRoute path="/relatorios"><Relatorios /></ProtectedRoute>} />
      <Route path="/relatorios/:id" element={<ProtectedRoute path="/relatorios"><RelatorioDetalhes /></ProtectedRoute>} />
      <Route path="/configuracoes" element={<ProtectedRoute path="/configuracoes"><Configuracoes /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};
