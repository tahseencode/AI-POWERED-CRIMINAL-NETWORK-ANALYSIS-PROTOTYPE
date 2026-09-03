import React, { useState } from 'react';
import { 
  Target, 
  Search, 
  TrendingUp, 
  MapPin, 
  Layers, 
  FileText, 
  Lock, 
  Shield, 
  Truck, 
  AlertTriangle, 
  ArrowRight,
  ChevronRight,
  Clock,
  Radio,
  Sparkles,
  ExternalLink,
  Filter,
  CheckCircle2,
  Database
} from 'lucide-react';

export default function DashboardHome({ 
  officerUser, 
  systemStatus, 
  onNavigate, 
  onOpenAddSuspect, 
  onOpenCctnsModal 
}) {
  const [alertFilter, setAlertFilter] = useState('ALL');

  const modules = [
    {
      id: 'keyplayer',
      title: 'Wanted Targets & Arrest Plan',
      subtext: 'Gang breakdown & kingpin simulator',
      icon: Target,
      color: '#dc2626',
      badge: 'Priority'
    },
    {
      id: 'graphrag',
      title: 'Case Q&A & Search',
      subtext: 'Plain-text case query & verified facts',
      icon: Search,
      color: '#2563eb',
      badge: 'Natural Q&A'
    },
    {
      id: 'gnn',
      title: 'Crime Forecast & Links',
      subtext: 'Predictive next moves & hidden ties',
      icon: TrendingUp,
      color: '#7c3aed',
      badge: 'GNN AI'
    },
    {
      id: 'spatiotemporal',
      title: 'Crime Map & Radar',
      subtext: 'GIS tracking & vehicle convoy radar',
      icon: MapPin,
      color: '#d97706',
      badge: 'Live Radar'
    },
    {
      id: 'entityres',
      title: 'Duplicate Alias Matcher',
      subtext: 'Cross-station identity resolution',
      icon: Layers,
      color: '#059669',
      badge: 'Identity'
    },
    {
      id: 'ingest',
      title: 'Upload FIR & Documents',
      subtext: 'Multilingual OCR & auto-extraction',
      icon: FileText,
      color: '#0284c7',
      badge: 'OCR Ingest'
    },
    {
      id: 'audit',
      title: 'Court Evidence Log',
      subtext: 'BSA Sec 63 certified tamper-proof trail',
      icon: Lock,
      color: '#16a34a',
      badge: 'BSA 2024'
    }
  ];

  const recentAlerts = [
    {
      id: 'alert-1',
      category: 'VEHICLE',
      severity: 'CRITICAL',
      badgeColor: '#dc2626',
      badgeBg: '#fef2f2',
      badgeBorder: '#fecaca',
      title: 'High-Threat Vehicle Convoy Detected',
      desc: 'Vehicles WB-24-AX-5512 (Bolero) & WB-02-AB-1234 (Scorpio) travelled within 3.5km at Ichhapur Toll within 4 hrs.',
      location: 'Ichhapur Toll Plaza (NH-12)',
      time: 'Today, 21:30 hrs',
      targetModule: 'spatiotemporal'
    },
    {
      id: 'alert-2',
      category: 'IDENTITY',
      severity: 'HIGH',
      badgeColor: '#d97706',
      badgeBg: '#fffbeb',
      badgeBorder: '#fde68a',
      title: 'Duplicate Suspect Record Flagged',
      desc: 'Suspect Sunil "Doctor" Roy matched with Sunil Mondal (Kolkata Port Trust FIR) with 98% confidence.',
      location: 'Barrackpore / Kolkata Port Link',
      time: 'Today, 18:45 hrs',
      targetModule: 'entityres'
    },
    {
      id: 'alert-3',
      category: 'FORECAST',
      severity: 'PREDICTIVE',
      badgeColor: '#7c3aed',
      badgeBg: '#f5f3ff',
      badgeBorder: '#ddd6fe',
      title: 'Escalation Predicted: Cross-Border Handover',
      desc: 'Historical pattern match (Siliguri Transit corridor) indicates 84% probability of firearm movement in 72 hrs.',
      location: 'Siliguri Transit Corridor',
      time: 'Forecast Active (72h Window)',
      targetModule: 'gnn'
    }
  ];

  const filteredAlerts = alertFilter === 'ALL' 
    ? recentAlerts 
    : recentAlerts.filter(a => a.category === alertFilter);

  return (
    <div style={{ 
      padding: '24px 32px', 
      maxWidth: '1440px', 
      margin: '0 auto', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '22px' 
    }}>
      
      {/* 1. Sleek Command Header Bar */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '8px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #1e3a8a, #0f172a)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            boxShadow: '0 2px 6px rgba(30, 58, 138, 0.2)'
          }}>
            <Shield size={22} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '17px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Welcome, {officerUser?.name || 'Investigating Officer'}
              </h2>
              <span className="badge badge-cyan" style={{ fontSize: '10px', fontWeight: 700, padding: '2px 7px' }}>
                {officerUser?.role || 'Investigating Officer (IO)'}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span>Badge <strong style={{ color: '#0f172a' }}>{officerUser?.badgeId || 'IO-8842'}</strong></span>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <span>Thana <strong style={{ color: '#0f172a' }}>{officerUser?.station || 'Barrackpore Special Thana'}</strong></span>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <span>Active Case <strong style={{ color: '#1d4ed8' }}>Operation Ichhapur Matrix</strong></span>
            </p>
          </div>
        </div>

        {/* Status Pill & Live Sync */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#16a34a',
              display: 'inline-block',
              boxShadow: '0 0 0 2px rgba(22, 163, 74, 0.2)'
            }} />
            <span style={{ fontWeight: 600, color: '#334155' }}>CCTNS/ICJS Network:</span>
            <span style={{ fontWeight: 700, color: '#16a34a' }}>Online & Synchronized</span>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Row (Clean, Minimalist & Spacious) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px'
      }}>
        {/* Metric 1 */}
        <div 
          onClick={() => onNavigate('keyplayer')}
          className="gov-card" 
          style={{
            padding: '16px 18px',
            cursor: 'pointer',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            background: '#ffffff',
            transition: 'all 0.15s ease',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#dc2626';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
              Most Wanted Targets
            </span>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Target size={15} color="#dc2626" />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '6px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            4 <span style={{ fontSize: '12px', fontWeight: 600, color: '#dc2626' }}>Targets</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>2 Category-A Kingpins</span>
            <span style={{ color: '#dc2626', fontWeight: 700, fontSize: '10px' }}>Simulate →</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => onNavigate('graphrag')}
          className="gov-card" 
          style={{
            padding: '16px 18px',
            cursor: 'pointer',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            background: '#ffffff',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#2563eb';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
              Synchronized FIRs
            </span>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={15} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '6px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            3 <span style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb' }}>Cases</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>BNS 2024 & Arms Act</span>
            <span style={{ color: '#2563eb', fontWeight: 700, fontSize: '10px' }}>Query →</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => onNavigate('spatiotemporal')}
          className="gov-card" 
          style={{
            padding: '16px 18px',
            cursor: 'pointer',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            background: '#ffffff',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#d97706';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(217, 119, 6, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
              Tracked Vehicles
            </span>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: '#fffbeb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Truck size={15} color="#d97706" />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '6px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            4 <span style={{ fontSize: '12px', fontWeight: 600, color: '#d97706' }}>Plates</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>1 Active Group Convoy</span>
            <span style={{ color: '#d97706', fontWeight: 700, fontSize: '10px' }}>Radar →</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => onNavigate('audit')}
          className="gov-card" 
          style={{
            padding: '16px 18px',
            cursor: 'pointer',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            background: '#ffffff',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#16a34a';
            e.currentTarget.style.transform = 'translateY(-1px)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', letterSpacing: '0.4px', textTransform: 'uppercase' }}>
              Court Evidence Chain
            </span>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '6px',
              background: '#f0fdf4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Lock size={15} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '6px', display: 'flex', alignItems: 'baseline', gap: '6px' }}>
            20+ <span style={{ fontSize: '12px', fontWeight: 600, color: '#16a34a' }}>Records</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span>BSA 2024 Sec 63 Hash-Locked</span>
            <span style={{ color: '#16a34a', fontWeight: 700, fontSize: '10px' }}>Audit →</span>
          </div>
        </div>
      </div>

      {/* 3. Main Command Center (2-Column Balanced Layout) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.45fr 1fr',
        gap: '20px',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Live Priority Intelligence Leads (High Impact, Zero Clutter) */}
        <div className="gov-card" style={{
          padding: '20px',
          borderRadius: '8px',
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          {/* Section Title & Filter Tabs */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={17} color="#dc2626" />
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Live Case Intelligence & Priority Leads
              </h3>
              <span className="badge badge-amber" style={{ fontSize: '10px', fontWeight: 700 }}>
                {recentAlerts.length} Active
              </span>
            </div>

            {/* Filter Chips */}
            <div style={{ display: 'flex', gap: '4px' }}>
              {[
                { id: 'ALL', label: 'All Leads' },
                { id: 'VEHICLE', label: 'Convoys' },
                { id: 'IDENTITY', label: 'Aliases' },
                { id: 'FORECAST', label: 'Forecast' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAlertFilter(tab.id)}
                  style={{
                    background: alertFilter === tab.id ? '#1e3a8a' : '#f8fafc',
                    color: alertFilter === tab.id ? '#ffffff' : '#64748b',
                    border: alertFilter === tab.id ? '1px solid #1e3a8a' : '1px solid #e2e8f0',
                    borderRadius: '4px',
                    padding: '3px 9px',
                    fontSize: '11px',
                    fontWeight: alertFilter === tab.id ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.12s ease'
                  }}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Alert Leads List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                onClick={() => onNavigate(alert.targetModule)}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '14px 16px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#93c5fd';
                  e.currentTarget.style.boxShadow = '0 3px 10px rgba(37, 99, 235, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                      background: alert.badgeBg,
                      color: alert.badgeColor,
                      border: `1px solid ${alert.badgeBorder}`,
                      fontSize: '9px',
                      fontWeight: 800,
                      padding: '1px 6px',
                      borderRadius: '3px',
                      letterSpacing: '0.4px',
                      textTransform: 'uppercase'
                    }}>
                      {alert.severity}
                    </span>
                    <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      {alert.title}
                    </h4>
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} />
                    {alert.time}
                  </span>
                </div>

                <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.45, margin: 0 }}>
                  {alert.desc}
                </p>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  fontSize: '11px',
                  paddingTop: '6px',
                  borderTop: '1px dashed #e2e8f0'
                }}>
                  <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={12} color="#94a3b8" />
                    {alert.location}
                  </span>
                  <span style={{ 
                    color: '#2563eb', 
                    fontWeight: 700, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '4px' 
                  }}>
                    Investigate Lead <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Quick Launch Hub & Active Case Synopsis */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          
          {/* Quick-Launch Tools Hub (Compact, Sleek Tiles) */}
          <div className="gov-card" style={{
            padding: '18px 20px',
            borderRadius: '8px',
            background: '#ffffff',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '12px',
              borderBottom: '1px solid #f1f5f9',
              paddingBottom: '10px'
            }}>
              <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Investigation Quick Launch
              </h3>
              <span style={{ fontSize: '11px', color: '#64748b' }}>Direct Tools</span>
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))',
              gap: '10px'
            }}>
              {modules.map((m) => {
                const IconComponent = m.icon;
                return (
                  <div
                    key={m.id}
                    onClick={() => onNavigate(m.id)}
                    style={{
                      background: '#f8fafc',
                      border: '1px solid #e2e8f0',
                      borderRadius: '6px',
                      padding: '12px 10px',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px',
                      transition: 'all 0.12s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#ffffff';
                      e.currentTarget.style.borderColor = m.color;
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f8fafc';
                      e.currentTarget.style.borderColor = '#e2e8f0';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        borderRadius: '6px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <IconComponent size={15} color={m.color} />
                      </div>
                      <span style={{ fontSize: '9px', fontWeight: 700, color: '#64748b' }}>
                        {m.badge}
                      </span>
                    </div>

                    <div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', lineHeight: 1.3 }}>
                        {m.title}
                      </div>
                      <div style={{ fontSize: '10px', color: '#64748b', marginTop: '2px', lineHeight: 1.3 }}>
                        {m.subtext}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Case Synopsis Card */}
          <div className="gov-card" style={{
            padding: '16px 18px',
            borderRadius: '8px',
            background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Database size={14} color="#1e40af" />
                <span style={{ fontSize: '11px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Active Investigation Dossier
                </span>
              </div>
              <span className="badge badge-cyan" style={{ fontSize: '10px' }}>FIR 142/2026</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Operation:</span>
                <strong style={{ color: '#0f172a' }}>Op Ichhapur Matrix</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Primary Syndicate:</span>
                <strong style={{ color: '#dc2626' }}>Roy Extortion & Arms Gang</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ color: '#64748b' }}>Lead Suspect:</span>
                <strong style={{ color: '#0f172a' }}>Sunil "Doctor" Roy</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0' }}>
                <span style={{ color: '#64748b' }}>Jurisdiction:</span>
                <span style={{ color: '#334155', fontWeight: 600 }}>Barrackpore Police Comm.</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('keyplayer')}
              style={{
                width: '100%',
                marginTop: '12px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#1d4ed8',
                borderRadius: '6px',
                padding: '7px',
                fontSize: '11px',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                transition: 'all 0.12s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1d4ed8';
                e.currentTarget.style.color = '#ffffff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = '#eff6ff';
                e.currentTarget.style.color = '#1d4ed8';
              }}
            >
              Open Gang Target Breakdown <ChevronRight size={13} />
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
