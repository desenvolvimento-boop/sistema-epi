import React from 'react';
import { Bell, Menu } from 'lucide-react';
import './Topbar.css';

interface TopbarProps {
  onMenuToggle?: () => void;
}

export const Topbar = ({ onMenuToggle }: TopbarProps) => {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="topbar-menu-btn" onClick={onMenuToggle} aria-label="Menu">
          <Menu className="topbar-menu-icon" />
        </button>
      </div>
      
      <div className="topbar-actions">
        <button className="topbar-notification-button">
          <Bell className="topbar-notification-icon" />
          <span className="topbar-notification-dot"></span>
        </button>
        
        <div className="topbar-divider"></div>
        
        <div className="topbar-user-info">
          <p className="topbar-company-name">Empresa Master S.A.</p>
        </div>
      </div>
    </header>
  );
};
