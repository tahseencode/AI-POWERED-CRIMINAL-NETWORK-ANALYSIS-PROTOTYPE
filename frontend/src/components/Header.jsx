import React from 'react';
import { 
  Shield, 
  Target, 
  Search, 
  TrendingUp, 
  MapPin, 
  Layers, 
  FileText, 
  Lock, 
  UserPlus, 
  Building2,
  RefreshCw,
  UserCheck,
  CheckCircle2
} from 'lucide-react';

export default function Header({ 
  currentRole, 
  onRoleChange, 
  systemStatus, 
  onRefresh, 
  onOpenCctnsModal,
  onOpenAddSuspectModal,
  activeTab,
  onTabChange
}) {
  const roles = [
    "Investigating Officer (IO)",
    "Station House Officer (SHO)",
    "Superintendent of Police (SP)",
    "Crime Intelligence Analyst",
    "Public Prosecutor"
  ];

  const tabs = [
    { id: 'keyplayer', label: '🎯 Top Suspects & Arrest Plan', icon: Target },
    { id: 'graphrag', label: '🔍 Case Q&A & Search', icon: Search },
    { id: 'gnn', label: '🔮 Hidden Links & Next Moves', icon: TrendingUp },
    { id: 'spatiotemporal', label: '🗺️ Crime Map & Vehicle Tracking', icon: MapPin },
    { id: 'entityres', label: '👥 Duplicate Suspect Matcher', icon: Layers },
    { id: 'ingest', label: '📄 Upload FIR & Documents', icon: FileText },
    { id: 'audit', label: '🛡️ Court Evidence Log', icon: Lock }
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)'
    }}>
      {/* 1. Official Government Top Header Bar (Deep Navy Blue) */}
      <div style={{
        background: '#0f2942',
        color: '#ffffff',
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Left: Emblem and Government Organization Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '4px',
            background: '#1e3a8a',
            border: '1px solid #3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Shield size={20} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '11px', color: '#93c5fd', fontWeight: 700, letterSpacing: '0.6px', textTransform: 'uppercase' }}>
              Government of India • Ministry of Home Affairs / State Police
            </div>
            <h1 style={{ fontSize: '15px', fontWeight: 800, color: '#ffffff', letterSpacing: '0.3px', margin: 0 }}>
              CRIME & CRIMINAL NETWORK ANALYSIS PORTAL (CCTNS / ICJS)
            </h1>
          </div>
        </div>

        {/* Right: Officer Login Profile & Role Switcher */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.1)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
            padding: '4px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px'
          }}>
            <UserCheck size={14} color="#93c5fd" />
            <span style={{ color: '#cbd5e1' }}>Designation:</span>
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value)}
              style={{
                background: '#1e293b',
                border: '1px solid #475569',
                color: '#ffffff',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
                borderRadius: '3px',
                padding: '2px 6px',
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

          <div style={{
            background: '#14532d',
            border: '1px solid #22c55e',
            color: '#86efac',
            borderRadius: '4px',
            padding: '3px 8px',
            fontSize: '11px',
            fontWeight: 700,
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <CheckCircle2 size={12} color="#86efac" />
            <span>ICJS SYNC: ONLINE</span>
          </div>
        </div>
      </div>

      {/* 2. Tricolor National Accent Bar */}
      <div style={{
        height: '4px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr'
      }}>
        <div style={{ background: '#ff9933' }} />
        <div style={{ background: '#ffffff' }} />
        <div style={{ background: '#138808' }} />
      </div>

      {/* 3. Sub-Header: Active Case Brief & Primary Actions */}
      <div style={{
        background: '#ffffff',
        borderBottom: '1px solid #cbd5e1',
        padding: '8px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        {/* Case Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px' }}>
          <div>
            <strong style={{ color: '#0f172a' }}>Active Case:</strong>{' '}
            <span style={{ color: '#1e40af', fontWeight: 600 }}>Operation Ichhapur Matrix (FIR No. 142/2026)</span>
          </div>
          <div style={{ color: '#64748b' }}>|</div>
          <div>
            <strong style={{ color: '#0f172a' }}>Station:</strong>{' '}
            <span style={{ color: '#475569' }}>Barrackpore Special Thana, West Bengal</span>
          </div>
          <div style={{ color: '#64748b' }}>|</div>
          <div>
            <strong style={{ color: '#0f172a' }}>Legal Framework:</strong>{' '}
            <span style={{ color: '#15803d', fontWeight: 600 }}>BNS 2024 / BSA Sec 63</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <button 
            type="button"
            onClick={onOpenAddSuspectModal}
            className="btn-primary"
            style={{
              fontSize: '12px',
              padding: '5px 12px',
              fontWeight: 700
            }}
          >
            <UserPlus size={14} />
            <span>+ Register New Suspect / FIR</span>
          </button>

          <button 
            type="button"
            onClick={onOpenCctnsModal}
            className="btn-secondary"
            style={{
              fontSize: '12px',
              padding: '5px 12px'
            }}
          >
            <Building2 size={14} color="#1e40af" />
            <span>National ICJS Database</span>
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
      </div>

      {/* 4. Official Navigation Tab Bar */}
      <nav style={{
        background: '#f8fafc',
        borderBottom: '1px solid #cbd5e1',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        overflowX: 'auto'
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              style={{
                background: isActive ? '#ffffff' : 'transparent',
                border: '1px solid',
                borderColor: isActive ? '#cbd5e1' : 'transparent',
                borderBottom: isActive ? '2px solid #1d4ed8' : '1px solid transparent',
                color: isActive ? '#1e40af' : '#475569',
                padding: '8px 14px',
                fontSize: '12px',
                fontWeight: isActive ? 700 : 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                borderTopLeftRadius: '4px',
                borderTopRightRadius: '4px',
                marginTop: '3px'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
}
