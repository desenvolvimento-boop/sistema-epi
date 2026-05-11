import React from 'react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface StatsCardProps {
  label: string;
  value: string;
  change: string;
  icon: React.ElementType;
  color: string;
  index: number;
  key?: string;
}

export const StatsCard = ({ label, value, change, icon: Icon, color, index }: StatsCardProps) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</p>
          <h3 className="text-2xl font-bold text-slate-900 mt-1">{value}</h3>
          <p className={cn("text-[10px] font-semibold mt-1", change.startsWith('+') ? 'text-primary-600' : 'text-red-600')}>
            {change} <span className="text-slate-400 font-normal">vs mês anterior</span>
          </p>
        </div>
        <div className={cn("p-2.5 rounded-xl bg-slate-50 shrink-0", color)}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </motion.div>
  );
};
