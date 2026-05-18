import type { AuthPermission } from '../services/authService';

/** Catálogo canônico — alinhado com APIMOBEPI/src/config/features.config.js */
export const FEATURE_PATHS = {
  DASHBOARD: '/dashboard',
  COLABORADORES: '/colaboradores',
  FUNCOES: '/funcoes',
  EPIS: '/epis',
  REGRAS_TROCA: '/regras-troca',
  INTERCORRENCIAS: '/intercorrencias',
  AGENDA_TROCAS: '/agenda-trocas',
  HISTORICO: '/historico',
  RELATORIOS: '/relatorios',
  USUARIOS: '/usuarios',
  NOVA_SECAO: '/nova-secao',
  CONFIGURACOES: '/configuracoes',
} as const;

/**
 * Rotas do menu/UI que compartilham a mesma feature de permissão no banco.
 */
export const PERMISSION_PATH_GROUPS: Record<string, string[]> = {
  'tipos-epi': ['epis', 'tipos-epi'],
  'variantes-epi': ['epis', 'variantes-epi'],
  'colaboradores': ['colaboradores'],
  'funcoes': ['funcoes'],
  'agenda-trocas': ['agenda-trocas'],
  'historico': ['historico'],
  'relatorios': ['relatorios'],
  'configuracoes': ['configuracoes'],
  'usuarios': ['usuarios'],
  'nova-secao': ['nova-secao', 'colaboradores', 'configuracoes'],
  'intercorrencias': ['intercorrencias'],
  'regras-troca': ['regras-troca'],
};

export function resolvePermissionPaths(perm: AuthPermission): string[] {
  const paths = new Set<string>();

  if (perm.fea_path) {
    paths.add(perm.fea_path.replace(/^\//, '').toLowerCase());
  }

  if (perm.fea_alternativeidentifier) {
    paths.add(perm.fea_alternativeidentifier.replace(/_/g, '-').toLowerCase());
  }

  return [...paths];
}

export function pathMatchesPermission(requestedPath: string, perm: AuthPermission): boolean {
  const normalizedPath = requestedPath.replace(/^\//, '').toLowerCase();
  const candidates = PERMISSION_PATH_GROUPS[normalizedPath] ?? [normalizedPath];
  const permPaths = resolvePermissionPaths(perm);

  if (!permPaths.length) return false;

  return candidates.some((candidate) =>
    permPaths.some(
      (feaPath) =>
        feaPath === candidate ||
        candidate.startsWith(`${feaPath}/`) ||
        feaPath.startsWith(`${candidate}/`)
    )
  );
}

export function isPermissionGranted(
  perm: AuthPermission,
  action: 'prm_create' | 'prm_view' | 'prm_edit' | 'prm_delete'
): boolean {
  return Boolean(perm[action]);
}

/** Resolve path de permissão para rota da UI (ex: /tipos-epi → checagem em /epis) */
export function resolveRoutePermissionPath(routePath: string): string {
  const normalized = routePath.replace(/^\//, '').toLowerCase();
  if (normalized === 'tipos-epi' || normalized === 'variantes-epi') {
    return FEATURE_PATHS.EPIS;
  }
  return routePath.startsWith('/') ? routePath : `/${routePath}`;
}
