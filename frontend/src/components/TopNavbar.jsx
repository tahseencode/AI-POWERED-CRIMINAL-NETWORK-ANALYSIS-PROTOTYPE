import React from 'react';
import { 
  Building2, 
  UserPlus, 
  RefreshCw, 
  UserCheck, 
  CheckCircle2, 
  Menu,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

export default function TopNavbar({ 
  activeTab, 
  currentRole, 
  onRoleChange, 
  onRefresh, 
  onOpenAddSuspectModal, 
  onOpenCctnsModal,
  isSidebarCollapsed,
  onToggleSidebar
}) {
  const roles = [
    "Investigating Officer (IO)",
    "Station House Officer (SHO)",
    "Superintendent of Police (SP)",
    "Crime Intelligence Analyst",
    "Public Prosecutor"
  ];

  const getPageTitle = () => {
    switch (activeTab) {
      case 'dashboard':
        return { title: 'Case Intelligence Dashboard & Overview', section: 'Overview' };
      case 'keyplayer':
        return { title: 'Most Wanted Criminals & Arrest Impact Simulator', section: 'Targets & Disruption' };
      case 'graphrag':
        return { title: 'Case Records Search & Plain-Text Q&A', section: 'Investigation & Evidence' };
      case 'gnn':
        return { title: 'Crime Move Forecast & Hidden Gang Links', section: 'Predictive Intelligence' };
      case 'spatiotemporal':
        return { title: 'Live GIS Crime Map & Vehicle Convoy Radar', section: 'Surveillance & Logistics' };
      case 'entityres':
        return { title: 'Duplicate Suspect Record & Alias Matcher', section: 'Identity Verification' };
      case 'ingest':
        return { title: 'Upload FIR & Multilingual Document Scanner', section: 'Document Ingestion' };
      case 'audit':
        return { title: 'Official Court Evidence Log (BSA Sec 63)', section: 'Tamper-Proof Audit Trail' };
      case 'graphexplorer':
        return { title: 'Interactive Criminal Knowledge Graph Explorer', section: 'Network Intelligence' };
      default:
        return { title: 'Criminal Network Analysis Portal', section: 'Portal' };
    }
  };

  const currentInfo = getPageTitle();

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #cbd5e1',
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
    }}>
      {/* Left: Sidebar Toggle Button & Current Active Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          className="btn-secondary"
          style={{
            padding: '6px 8px',
            color: '#1e40af',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={isSidebarCollapsed ? 'Expand Navigation Sidebar' : 'Collapse Navigation Sidebar'}
        >
          <Menu size={16} />
        </button>

        <div>
          <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
            Portal Navigation / {currentInfo.section}
          </div>
          <h1 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '2px 0 0' }}>
            {currentInfo.title}
          </h1>
        </div>
      </div>

      {/* Center/Right: Active Case Details & Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {/* Active Case Badge */}
        <div style={{
          background: '#eff6ff',
          border: '1px solid #bfdbfe',
          borderRadius: '4px',
          padding: '4px 10px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          fontSize: '11px'
        }}>
          <span style={{ color: '#1e40af', fontWeight: 700 }}>Active Case:</span>
          <span style={{ color: '#0f172a', fontWeight: 600 }}>Op Ichhapur Matrix (FIR 142/2026)</span>
        </div>

        {/* Live Status Pill */}
        <div style={{
          background: '#f0fdf4',
          border: '1px solid #bbf7d0',
          color: '#15803d',
          borderRadius: '4px',
          padding: '4px 8px',
          fontSize: '11px',
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}>
          <CheckCircle2 size={12} color="#15803d" />
          <span>ICJS LIVE</span>
        </div>

        {/* Officer Role Selector */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #cbd5e1',
          borderRadius: '4px',
          padding: '3px 8px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}>
          <UserCheck size={13} color="#1e40af" />
          <select
            value={currentRole}
            onChange={(e) => onRoleChange(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#0f172a',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              outline: 'none'
            }}
          >
            {roles.map(r => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </div>

        {/* Action Buttons */}
        <button 
          type="button"
          onClick={onOpenAddSuspectModal}
          className="btn-primary"
          style={{
            fontSize: '11px',
            padding: '5px 12px',
            fontWeight: 700
          }}
        >
          <UserPlus size={13} />
          <span>+ Register Suspect / FIR</span>
        </button>

        <button 
          type="button"
          onClick={onOpenCctnsModal}
          className="btn-secondary"
          style={{
            fontSize: '11px',
            padding: '5px 10px'
          }}
        >
          <Building2 size={13} color="#1e40af" />
          <span>National ICJS</span>
        </button>

        <button
          type="button"
          onClick={onRefresh}
          className="btn-secondary"
          style={{ padding: '5px 8px' }}
          title="Refresh All Records"
        >
          <RefreshCw size={13} />
        </button>
      </div>
    </header>
  );
}
