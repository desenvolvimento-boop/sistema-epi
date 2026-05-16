import React from 'react';

export type View = 
  | 'dashboard' 
  | 'employees' 
  | 'roles' 
  | 'epis' 
  | 'replacement-rules' 
  | 'matrix' 
  | 'contracts' 
  | 'consumption' 
  | 'delivery' 
  | 'facial-validation' 
  | 'schedule' 
  | 'history' 
  | 'non-conformities' 
  | 'reports' 
  | 'users'
  | 'intercorrencias-bi'
  | 'architecture';

export interface NavItem {
  id: View;
  label: string;
  icon: React.ElementType;
  path: string;
}

export interface Employee {
  id: number;
  nome: string;
  cpf: string;
  matricula: string;
  empresa: string;
  unidade: string;
  funcao: string;
  status: string;
  admissao: string;
}

export interface EPI {
  id: number;
  nome: string;
  ca: string;
  fabricante: string;
  categoria: string;
  vidaUtil: number;
  status: string;
}

export interface Delivery {
  id: number;
  data: string;
  colaborador: string;
  epi: string;
  validacao: string;
  foto: string;
  geo: string;
}

export interface Role {
  id: number;
  nome: string;
  descricao: string;
  epis: string[];
}

export interface User {
  usr_id: number;
  usr_active: number | null;
  usr_full_name: string | null;
  usr_username: string | null;
  usr_email: string | null;
  usr_password?: string;
  usr_agent_type: string | null;
  usr_access_profile: string | null;
  usr_phone_country_code: string | null;
  usr_phone_area_code: string | null;
  usr_phone_number: string | null;
  usr_mobile_country_code: string | null;
  usr_mobile_area_code: string | null;
  usr_mobile_number: string | null;
  usr_zip_code: string | null;
  usr_country: string | null;
  usr_state: string | null;
  usr_city: string | null;
  usr_neighborhood: string | null;
  usr_street: string | null;
  usr_street_number: string | null;
  usr_complement: string | null;
  usr_notes: string | null;
  usr_id_insert: number | null;
  usr_datetimeinsert?: string;
  usr_id_lastupdate: number | null;
  usr_datetimeupdate?: string;
  acp_id: number | null;
  agg_id: number | null;
}

export interface UserPermission {
  prm_id: number;
  acp_id: number;
  fea_id: number;
  prm_create: number;
  prm_view: number;
  prm_edit: number;
  prm_delete: number;
}

