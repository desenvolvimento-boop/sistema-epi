export type ReportId =
  | 'entrega-por-colaborador'
  | 'troca-epi'
  | 'epis-vencidos'
  | 'epis-proximos-troca'
  | 'colaboradores-sem-epi-obrigatorio'
  | 'epi-por-funcao'
  | 'historico-entregas'
  | 'epis-mais-utilizados'
  | 'epis-por-unidade'
  | 'pendencias-assinatura'
  | 'colaboradores-ativos-vs-entregas'
  | 'nao-conformidades';

export interface ReportColumn {
  key: string;
  label: string;
}

export interface ReportCatalogItem {
  id: ReportId;
  title: string;
  description: string;
  category: 'operacional' | 'gestao' | 'auditoria';
  columns: ReportColumn[];
  statusOptions: { value: string; label: string }[] | null;
}

export interface ReportFilters {
  from?: string;
  to?: string;
  sec_id?: number | '';
  emp_id?: number | '';
  rol_id?: number | '';
  status?: string;
  q?: string;
  page?: number;
  limit?: number;
}

export type ReportRow = Record<string, string | number | null | undefined>;

export interface ReportSummary {
  [key: string]: string | number;
}

export interface ReportResponse {
  items: ReportRow[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  summary: ReportSummary;
  columns: ReportColumn[];
  report: { id: string; title: string; description: string } | null;
}

export interface ReportDashboard {
  period: { from: string; to: string };
  summary: {
    colaboradores_ativos: number;
    total_entregas: number;
    epis_vencidos: number;
    proximos_troca: number;
    pendencias_assinatura: number;
    nao_conformidades_pendentes: number;
  };
  risk: {
    score: number;
    label: string;
    description: string;
  };
  charts: {
    top_epis: { name: string; value: number }[];
    by_section: { name: string; value: number }[];
    monthly_consumption: { name: string; valor: number }[];
    exchange_status: { name: string; value: number }[];
  };
}

export type ExportFormat = 'pdf' | 'xlsx';
