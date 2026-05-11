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
  id: number;
  nome: string;
  email: string;
  perfil: string;
  status: string;
}

export interface ReplacementRule {
  id: number;
  epi: string;
  vidaUtil: number;
  motivo: string;
  criticidade: string;
  contrato?: string;
  jornada?: 'PLANTONISTA' | 'DIARISTA';
}
