import React from 'react';
import { LayoutDashboard } from 'lucide-react';
import './PlaceholderPage.css';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
  return (
    <div className="placeholder-page">
      <LayoutDashboard className="placeholder-page-icon" />
      <h2 className="placeholder-page-title">{title}</h2>
      <p className="placeholder-page-description">Módulo em desenvolvimento para o protótipo.</p>
    </div>
  );
};

export default PlaceholderPage;
