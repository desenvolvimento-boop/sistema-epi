import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import './Topbar.css';

interface TopbarProps {
  title: string;
  onMenuToggle?: () => void;
}

export const Topbar = ({ title, onMenuToggle }: TopbarProps) => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" onClick={onMenuToggle} aria-label="Menu">
          <Menu className="topbar-menu-icon" />
        </button>
        <h1 className="topbar-title">{title}</h1>
      </div>
      
      <div className="topbar-actions">
        <div className="topbar-search-wrapper">
          <Search className="topbar-search-icon" />
          <input 
            type="text" 
            placeholder="Busca global..." 
            className="topbar-search-input"
          />
        </div>
        
        <button className="topbar-notification-button">
          <Bell className="topbar-notification-icon" />
          <span className="topbar-notification-dot"></span>
        </button>
        
        <div className="topbar-divider"></div>
        
        <div className="topbar-user-info">
          <div className="topbar-user-info-inner">
            <p className="topbar-company-name">Empresa Master S.A.</p>
            <p className="topbar-session">Sessão: 02:45h</p>
          </div>
        </div>
      </div>
    </header>
  );
};
