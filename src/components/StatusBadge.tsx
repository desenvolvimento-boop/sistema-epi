import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const StatusBadge = ({ status }: { status: string }) => {
  const styles = {
    'Regular': 'bg-primary-100 text-primary-700 border-primary-200',
    'Atenção': 'bg-amber-100 text-amber-700 border-amber-200',
    'Irregular': 'bg-red-100 text-red-700 border-red-200',
    'Vencido': 'bg-red-100 text-red-700 border-red-200',
    'Ativo': 'bg-blue-100 text-blue-700 border-blue-200',
    'Sucesso': 'bg-primary-100 text-primary-700 border-primary-200',
    'Falha Facial': 'bg-red-100 text-red-700 border-red-200',
    'Pendente': 'bg-slate-100 text-slate-700 border-slate-200',
    'Aguardando validação': 'bg-blue-100 text-blue-700 border-blue-200',
    'Erro na validação': 'bg-orange-100 text-orange-700 border-orange-200',
  };
  
  return (
    <span className={cn(
      "px-2.5 py-0.5 rounded-full text-xs font-semibold border",
      styles[status as keyof typeof styles] || 'bg-slate-100 text-slate-700 border-slate-200'
    )}>
      {status}
    </span>
  );
};
