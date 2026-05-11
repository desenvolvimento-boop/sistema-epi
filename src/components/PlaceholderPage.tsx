import React from 'react';
import { LayoutDashboard } from 'lucide-react';

interface PlaceholderPageProps {
  title: string;
}

const PlaceholderPage = ({ title }: PlaceholderPageProps) => {
  return (
    <div className="flex flex-col items-center justify-center h-[60vh] text-slate-400">
      <LayoutDashboard className="w-16 h-16 mb-4 opacity-20" />
      <h2 className="text-xl font-bold text-slate-600">{title}</h2>
      <p className="text-sm mt-2">Módulo em desenvolvimento para o protótipo.</p>
    </div>
  );
};

export default PlaceholderPage;
