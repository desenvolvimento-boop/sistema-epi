import React from 'react';
import { ArrowLeft, type LucideIcon } from 'lucide-react';
import clsx from 'clsx';
import './PageHeader.css';

export const PageHeaderBackButton = ({ onClick, label = 'Voltar' }: { onClick: () => void; label?: string }) => (
  <button type="button" onClick={onClick} className="page-header-back-btn" aria-label={label}>
    <ArrowLeft className="page-header-back-icon" />
  </button>
);

export type PageHeaderIconTone = 'primary' | 'red' | 'amber' | 'blue' | 'green' | 'slate';

export interface PageHeaderProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  iconTone?: PageHeaderIconTone;
  actions?: React.ReactNode;
  leading?: React.ReactNode;
  className?: string;
}

export const PageHeader = ({
  icon: Icon,
  title,
  subtitle,
  iconTone = 'primary',
  actions,
  leading,
  className,
}: PageHeaderProps) => {
  return (
    <div className={clsx('page-header', className)}>
      <div className="page-header-left">
        {leading}
        <div className={clsx('page-header-icon-box', `page-header-icon-box--${iconTone}`)}>
          <Icon className="page-header-icon" aria-hidden />
        </div>
        <div className="page-header-text">
          <h2 className="page-header-title">{title}</h2>
          <p className="page-header-subtitle">{subtitle}</p>
        </div>
      </div>
      {actions ? <div className="page-header-actions">{actions}</div> : null}
    </div>
  );
};
