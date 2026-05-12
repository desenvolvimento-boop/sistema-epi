import React from 'react';
import clsx from 'clsx';
import './StatusBadge.css';

const statusClassMap: Record<string, string> = {
  'Regular': 'status-badge-regular',
  'Atenção': 'status-badge-atencao',
  'Irregular': 'status-badge-irregular',
  'Vencido': 'status-badge-vencido',
  'Ativo': 'status-badge-ativo',
  'Sucesso': 'status-badge-sucesso',
  'Falha Facial': 'status-badge-falha-facial',
  'Pendente': 'status-badge-pendente',
  'Aguardando validação': 'status-badge-aguardando',
  'Erro na validação': 'status-badge-erro-validacao',
  'Inativo': 'status-badge-inativo',
};

export const StatusBadge = ({ status }: { status: string }) => {
  return (
    <span className={clsx("status-badge", statusClassMap[status] || "status-badge-default")}>
      {status}
    </span>
  );
};
