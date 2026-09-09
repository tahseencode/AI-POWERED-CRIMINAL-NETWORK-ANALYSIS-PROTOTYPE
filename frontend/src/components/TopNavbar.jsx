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
      case 'userdb':
        return { title: 'Officer Directory, Case Notes & SQL Database Studio', section: 'User & System Data' };
      default:
        return { title: 'Criminal Network Analysis Portal', section: 'Portal' };
    }
  };


  const currentInfo = getPageTitle();

  return (
    <header style={{
      background: '#ffffff',
      borderBottom: '1px solid #e2e8f0',
      padding: '10px 24px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: '12px',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
    }}>
      {/* Left: Sidebar Toggle Button & Current Active Page Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          type="button"
          onClick={onToggleSidebar}
          style={{
            padding: '6px 8px',
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            color: '#1e40af',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'background 0.12s ease'
          }}
          title={isSidebarCollapsed ? 'Expand Navigation Sidebar' : 'Collapse Navigation Sidebar'}
        >
          <Menu size={16} />
        </button>

        <div>
          <div style={{ fontSize: '10px', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            {currentInfo.section}
          </div>
          <h1 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: '1px 0 0' }}>
            {currentInfo.title}
          </h1>
        </div>
      </div>

      {/* Right: Active Case, Role & Quick Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        {/* Officer Role Selector */}
        <div style={{
          background: '#f8fafc',
          border: '1px solid #e2e8f0',
          borderRadius: '6px',
          padding: '4px 8px',
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
          style={{
            background: '#1d4ed8',
            color: '#ffffff',
            border: 'none',
            borderRadius: '6px',
            padding: '6px 12px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            transition: 'background 0.15s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#1e40af'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#1d4ed8'}
        >
          <UserPlus size={13} />
          <span>+ Register Suspect</span>
        </button>

        <button 
          type="button"
          onClick={onOpenCctnsModal}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#334155',
            borderRadius: '6px',
            padding: '6px 10px',
            fontSize: '11px',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
        >
          <Building2 size={13} color="#1e40af" />
          <span>National ICJS</span>
        </button>

        <button
          type="button"
          onClick={onRefresh}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            color: '#64748b',
            borderRadius: '6px',
            padding: '6px 8px',
            cursor: 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Refresh All Records"
          onMouseEnter={(e) => e.currentTarget.style.background = '#f8fafc'}
          onMouseLeave={(e) => e.currentTarget.style.background = '#ffffff'}
        >
          <RefreshCw size={13} />
        </button>
      </div>
    </header>
  );
}
