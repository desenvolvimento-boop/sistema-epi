import { 
  Users, 
  AlertTriangle, 
  Clock, 
  AlertCircle 
} from 'lucide-react';
import { Employee, EPI, Delivery, Role, User, ReplacementRule } from '../types/system.types';

export const DASHBOARD_STATS = [
  { label: 'Colaboradores Ativos', value: '1,284', change: '+12%', icon: Users, color: 'text-blue-600' },
  { label: 'EPIs Vencidos', value: '24', change: '-5%', icon: AlertTriangle, color: 'text-red-600' },
  { label: 'Trocas Próximas (7d)', value: '86', change: '+2%', icon: Clock, color: 'text-amber-600' },
  { label: 'Entregas Realizadas', value: '452', change: '+8%', icon: AlertCircle, color: 'text-primary-600' },
];

export const CONSUMPTION_DATA = [
  { name: 'Jan', valor: 400 },
  { name: 'Fev', valor: 300 },
  { name: 'Mar', valor: 600 },
  { name: 'Abr', valor: 800 },
  { name: 'Mai', valor: 500 },
  { name: 'Jun', valor: 900 },
];

export const EMPLOYEES: Employee[] = [
  { id: 1, nome: 'Ricardo Silva', cpf: '123.456.789-00', matricula: 'MT-001', empresa: 'Terceira Log', unidade: 'CD São Paulo', funcao: 'Operador de Empilhadeira', status: 'Regular', admissao: '12/01/2023' },
  { id: 2, nome: 'Ana Paula Souza', cpf: '234.567.890-11', matricula: 'MT-002', empresa: 'Terceira Log', unidade: 'CD Rio', funcao: 'Auxiliar de Limpeza', status: 'Atenção', admissao: '05/03/2023' },
  { id: 3, nome: 'Marcos Oliveira', cpf: '345.678.901-22', matricula: 'MT-003', empresa: 'Serviços Gerais S/A', unidade: 'Matriz', funcao: 'Técnico de Manutenção', status: 'Irregular', admissao: '20/11/2022' },
  { id: 4, nome: 'Juliana Lima', cpf: '456.789.012-33', matricula: 'MT-004', empresa: 'Terceira Log', unidade: 'CD São Paulo', funcao: 'Auxiliar Operacional', status: 'Aguardando validação', admissao: '22/04/2026' },
  { id: 5, nome: 'Carlos Eduardo', cpf: '567.890.123-44', matricula: 'MT-005', empresa: 'Terceira Log', unidade: 'CD São Paulo', funcao: 'Ajudante Geral', status: 'Erro na validação', admissao: '21/04/2026' },
];

export const EPIS: EPI[] = [
  { id: 1, nome: 'Capacete de Segurança H-700', ca: '29792', fabricante: '3M', categoria: 'Proteção de Cabeça', vidaUtil: 365, status: 'Ativo' },
  { id: 2, nome: 'Luva de Proteção Nitrílica', ca: '12345', fabricante: 'Danny', categoria: 'Proteção de Mãos', vidaUtil: 30, status: 'Ativo' },
  { id: 3, nome: 'Bota de Segurança com Bico de Aço', ca: '45678', fabricante: 'Marluvas', categoria: 'Proteção de Pés', vidaUtil: 180, status: 'Ativo' },
];

export const DELIVERIES: Delivery[] = [
  { id: 1, data: '2024-03-05 08:30', colaborador: 'Ricardo Silva', epi: 'Capacete H-700', validacao: 'Sucesso', foto: 'https://picsum.photos/seed/face1/100/100', geo: '-23.5505, -46.6333' },
  { id: 2, data: '2024-03-05 09:15', colaborador: 'Ana Paula Souza', epi: 'Luva Nitrílica', validacao: 'Falha Facial', foto: 'https://picsum.photos/seed/face2/100/100', geo: '-23.5505, -46.6333' },
  { id: 3, data: '2024-03-05 10:00', colaborador: 'Marcos Oliveira', epi: 'Bota de Segurança', validacao: 'Pendente', foto: 'https://picsum.photos/seed/face3/100/100', geo: '-23.5505, -46.6333' },
];

export const ROLES: Role[] = [
  { id: 1, nome: 'Operador de Empilhadeira', descricao: 'Operação de veículos industriais de movimentação de carga.', epis: ['Capacete', 'Bota de Segurança', 'Colete Refletivo'] },
  { id: 2, nome: 'Auxiliar de Limpeza', descricao: 'Serviços de higienização e conservação de ambientes.', epis: ['Luva Nitrílica', 'Bota de PVC', 'Avental Impermeável'] },
  { id: 3, nome: 'Técnico de Manutenção', descricao: 'Manutenção preventiva e corretiva de máquinas.', epis: ['Capacete', 'Óculos de Proteção', 'Luva de Vaqueta', 'Bota de Segurança'] },
];

export const USERS: User[] = [
  { id: 1, nome: 'Carlos Alberto', email: 'carlos@empresa.com.br', perfil: 'Administrador', status: 'Ativo' },
  { id: 2, nome: 'Juliana Mendes', email: 'juliana.sesmt@empresa.com.br', perfil: 'Segurança do Trabalho', status: 'Ativo' },
  { id: 3, nome: 'Roberto Santos', email: 'roberto.sup@empresa.com.br', perfil: 'Supervisor', status: 'Ativo' },
];

export const REPLACEMENT_RULES: ReplacementRule[] = [
  { id: 1, epi: 'Luva Nitrílica', vidaUtil: 30, motivo: 'Desgaste / Vencimento', criticidade: 'Alta' },
  { id: 2, epi: 'Capacete H-700', vidaUtil: 365, motivo: 'Vencimento / Impacto', criticidade: 'Média' },
  { id: 3, epi: 'Bota de Segurança', vidaUtil: 180, motivo: 'Desgaste / Rasgo', criticidade: 'Média' },
];
