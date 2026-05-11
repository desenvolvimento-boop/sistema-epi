import React from 'react';
import { motion } from 'motion/react';
import clsx from 'clsx';
import './StatsCard.css';

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
      className="stats-card"
    >
      <div className="stats-card-inner">
        <div>
          <p className="stats-card-label">{label}</p>
          <h3 className="stats-card-value">{value}</h3>
          <p className={clsx("stats-card-change", change.startsWith('+') ? 'stats-card-change-positive' : 'stats-card-change-negative')}>
            {change} <span className="stats-card-change-context">vs mês anterior</span>
          </p>
        </div>
        <div className={clsx("stats-card-icon-wrapper", color)}>
          <Icon className="stats-card-icon" />
        </div>
      </div>
    </motion.div>
  );
};
