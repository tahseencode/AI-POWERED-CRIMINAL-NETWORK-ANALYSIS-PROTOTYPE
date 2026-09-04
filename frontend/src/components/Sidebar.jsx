import React from 'react';
import { 
  Shield, 
  LayoutDashboard, 
  Target, 
  Search, 
  TrendingUp, 
  MapPin, 
  Layers, 
  FileText, 
  Lock, 
  LogOut, 
  Building2,
  ChevronRight,
  ChevronLeft,
  Menu,
  Share2
} from 'lucide-react';

export default function Sidebar({ 
  activeTab, 
  onTabChange, 
  officerUser, 
  onLogout,
  onOpenCctnsModal,
  isCollapsed,
  onToggleCollapse
}) {
  const menuGroups = [
    {
      groupTitle: 'MAIN',
      items: [
        { id: 'dashboard', label: 'Dashboard Overview', icon: LayoutDashboard, badge: 'Overview' },
        { id: 'graphexplorer', label: 'Interactive Network Graph', icon: Share2, badge: 'Cytoscape' }
      ]
    },
    {
      groupTitle: 'INVESTIGATION & TARGETS',
      items: [
        { id: 'keyplayer', label: 'Top Wanted Suspects', icon: Target, badge: 'Priority' },
        { id: 'graphrag', label: 'Case Records & Search', icon: Search },
        { id: 'gnn', label: 'Crime Forecast & Links', icon: TrendingUp, badge: 'Forecast' }
      ]
    },
    {
      groupTitle: 'SURVEILLANCE & MOVEMENTS',
      items: [
        { id: 'spatiotemporal', label: 'Crime Map & Vehicles', icon: MapPin, badge: 'Live Radar' },
        { id: 'entityres', label: 'Duplicate Suspect Matcher', icon: Layers }
      ]
    },
    {
      groupTitle: 'EVIDENCE & DOCUMENTATION',
      items: [
        { id: 'ingest', label: 'Upload FIR & Documents', icon: FileText, badge: 'OCR' },
        { id: 'audit', label: 'Court Evidence Log', icon: Lock, badge: 'BSA 2024' }
      ]
    }
  ];

  return (
    <aside style={{
      width: isCollapsed ? '68px' : '260px',
      minWidth: isCollapsed ? '68px' : '260px',
      height: '100vh',
      background: '#0f2942',
      color: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      borderRight: '1px solid #1e3a8a',
      position: 'sticky',
      top: 0,
      zIndex: 200,
      boxShadow: '2px 0 8px rgba(0, 0, 0, 0.15)',
      transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1), min-width 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      {/* 1. Sidebar Brand Header & Collapse Toggle */}
      <div style={{
        padding: isCollapsed ? '16px 12px' : '16px 14px',
        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: isCollapsed ? 'center' : 'space-between',
        gap: '8px'
      }}>
        {!isCollapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '6px',
              background: '#1e3a8a',
              border: '1px solid #3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <Shield size={18} color="#ffffff" />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '9px', color: '#93c5fd', fontWeight: 700, letterSpacing: '0.5px', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                GOVT. OF INDIA • POLICE
              </div>
              <div style={{ fontSize: '13px', fontWeight: 800, color: '#ffffff', whiteSpace: 'nowrap' }}>
                CCTNS / ICJS
              </div>
            </div>
          </div>
        ) : (
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '6px',
            background: '#1e3a8a',
            border: '1px solid #3b82f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            <Shield size={20} color="#ffffff" />
          </div>
        )}

        {/* Toggle Button */}
        <button
          type="button"
          onClick={onToggleCollapse}
          style={{
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
            borderRadius: '4px',
            color: '#93c5fd',
            padding: '4px',
            cursor: 'pointer',
            display: isCollapsed ? 'none' : 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
        >
          <ChevronLeft size={16} />
        </button>
      </div>

      {/* Tricolor Accent Line */}
      <div style={{
        height: '3px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr 1fr'
      }}>
        <div style={{ background: '#ff9933' }} />
        <div style={{ background: '#ffffff' }} />
        <div style={{ background: '#138808' }} />
      </div>

      {/* 2. Navigation Menu Groups */}
      <div style={{
        flex: 1,
        padding: isCollapsed ? '10px 6px' : '12px 10px',
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
        gap: isCollapsed ? '8px' : '14px'
      }}>
        {menuGroups.map((group, gIdx) => (
          <div key={gIdx} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            {!isCollapsed && (
              <div style={{
                fontSize: '10px',
                fontWeight: 700,
                color: '#94a3b8',
                letterSpacing: '0.6px',
                padding: '4px 10px',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap'
              }}>
                {group.groupTitle}
              </div>
            )}

            {group.items.map((item) => {
              const isActive = activeTab === item.id;
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onTabChange(item.id)}
                  title={item.label}
                  style={{
                    background: isActive ? '#1d4ed8' : 'transparent',
                    border: 'none',
                    borderRadius: '4px',
                    color: isActive ? '#ffffff' : '#cbd5e1',
                    padding: isCollapsed ? '10px 0' : '8px 12px',
                    fontSize: '12px',
                    fontWeight: isActive ? 700 : 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'space-between',
                    textAlign: isCollapsed ? 'center' : 'left',
                    width: '100%',
                    transition: 'all 0.12s ease'
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.08)';
                      e.currentTarget.style.color = '#ffffff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#cbd5e1';
                    }
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <IconComponent size={18} color={isActive ? '#ffffff' : '#93c5fd'} />
                    {!isCollapsed && <span style={{ whiteSpace: 'nowrap' }}>{item.label}</span>}
                  </div>

                  {!isCollapsed && item.badge && (
                    <span style={{
                      fontSize: '9px',
                      padding: '1px 5px',
                      borderRadius: '3px',
                      background: isActive ? 'rgba(255, 255, 255, 0.2)' : '#1e3a8a',
                      color: isActive ? '#ffffff' : '#93c5fd',
                      fontWeight: 700
                    }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        ))}

        {/* National ICJS 5-Pillars Quick Link */}
        <div style={{ marginTop: 'auto', paddingTop: '8px' }}>
          <button
            type="button"
            onClick={onOpenCctnsModal}
            title="National ICJS 5-Pillars"
            style={{
              width: '100%',
              background: 'rgba(30, 58, 138, 0.4)',
              border: '1px solid #1e3a8a',
              borderRadius: '4px',
              color: '#93c5fd',
              padding: isCollapsed ? '10px 0' : '8px 12px',
              fontSize: '11px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: isCollapsed ? 'center' : 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Building2 size={16} color="#93c5fd" />
              {!isCollapsed && <span>National ICJS</span>}
            </div>
            {!isCollapsed && <ChevronRight size={13} />}
          </button>
        </div>
      </div>

      {/* 3. Logged-In Officer Profile & Logout Button (Bottom) */}
      <div style={{
        padding: isCollapsed ? '10px 8px' : '12px 14px',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        background: '#0b1f33',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px'
      }}>
        {!isCollapsed ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#1e3a8a',
              border: '1px solid #3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 800,
              color: '#ffffff',
              flexShrink: 0
            }}>
              IO
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {officerUser?.name || 'Officer'}
              </div>
              <div style={{ fontSize: '10px', color: '#94a3b8' }}>
                Badge: <span style={{ color: '#93c5fd', fontWeight: 600 }}>{officerUser?.badgeId || '1234'}</span>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center' }} title={`Logged in as ${officerUser?.name} (${officerUser?.badgeId})`}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#1e3a8a',
              border: '1px solid #3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '11px',
              fontWeight: 800,
              color: '#ffffff'
            }}>
              IO
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onLogout}
          title="Sign out / Lock portal"
          style={{
            width: '100%',
            background: '#7f1d1d',
            border: '1px solid #b91c1c',
            color: '#fee2e2',
            borderRadius: '4px',
            padding: '6px',
            fontSize: '11px',
            fontWeight: 700,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px'
          }}
        >
          <LogOut size={13} />
          {!isCollapsed && <span>Exit / Logout</span>}
        </button>
      </div>
    </aside>
  );
}
