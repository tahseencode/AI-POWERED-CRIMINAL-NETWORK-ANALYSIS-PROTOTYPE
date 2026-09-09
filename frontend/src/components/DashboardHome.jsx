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
  Database,
  UserPlus,
  Building2,
  Activity,
  Zap
} from 'lucide-react';

export default function DashboardHome({ 
  officerUser, 
  systemStatus, 
  onNavigate, 
  onOpenAddSuspect, 
  onOpenCctnsModal 
}) {
  const [alertFilter, setAlertFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const recentAlerts = [
    {
      id: 'alert-1',
      category: 'VEHICLE',
      severity: 'CRITICAL',
      badgeColor: '#dc2626',
      badgeBg: '#fef2f2',
      badgeBorder: '#fecaca',
      title: 'High-Threat Vehicle Convoy Detected',
      desc: 'Vehicles WB-24-AX-5512 (Bolero) & WB-02-AB-1234 (Scorpio) travelled within 3.5km along Ichhapur Corridor in a 4-hour window.',
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
      title: 'Cross-Jurisdiction Alias Match Flagged',
      desc: 'Suspect Sunil "Doctor" Roy matched with Sunil Mondal (Kolkata Port Trust FIR-089) with 98% Fellegi-Sunter confidence.',
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
      title: 'Escalation Predicted: Firearms Handover',
      desc: 'GNN Link Prediction and historical precedent model indicate 84% probability of firearm transit in the Siliguri corridor within 72 hrs.',
      location: 'Siliguri Transit Corridor',
      time: 'Forecast Active (72h Window)',
      targetModule: 'gnn'
    }
  ];

  const topSuspects = [
    {
      id: 'PERSON_002',
      name: 'Tariq Al-Hasani',
      alias: 'Kabir Bhai',
      role: 'Hawala & Crypto Financier',
      threatScore: 92,
      tier: 'Tier 1 Kingpin',
      tierColor: '#dc2626'
    },
    {
      id: 'PERSON_008',
      name: 'Erick Ekka',
      alias: 'Chhotu',
      role: 'Enforcer & Logistics Courier',
      threatScore: 88,
      tier: 'Tier 1 Enforcer',
      tierColor: '#ea580c'
    },
    {
      id: 'PERSON_001',
      name: 'Sunil "Doctor" Roy',
      alias: 'Doctor Babu',
      role: 'Syndicate Operational Head',
      threatScore: 85,
      tier: 'Tier 1 Syndicate Head',
      tierColor: '#dc2626'
    }
  ];

  const filteredAlerts = recentAlerts.filter(a => {
    const matchesFilter = alertFilter === 'ALL' || a.category === alertFilter;
    const matchesSearch = searchQuery.trim() === '' || 
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div style={{ 
      padding: '24px 32px', 
      maxWidth: '1440px', 
      margin: '0 auto', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '20px' 
    }}>
      
      {/* 1. Clean Command Header */}
      <div style={{
        background: '#ffffff',
        border: '1px solid #e2e8f0',
        borderRadius: '10px',
        padding: '16px 22px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '14px',
        boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '8px',
            background: '#1e3a8a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            flexShrink: 0
          }}>
            <Shield size={22} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Welcome, {officerUser?.name || 'Investigating Officer'}
              </h2>
              <span style={{
                background: '#eff6ff',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
                fontSize: '11px',
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: '4px'
              }}>
                {officerUser?.role || 'Investigating Officer (IO)'}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#64748b', margin: '4px 0 0', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span>Badge: <strong style={{ color: '#0f172a' }}>{officerUser?.badgeId || 'IO-8842'}</strong></span>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <span>Station: <strong style={{ color: '#0f172a' }}>{officerUser?.station || 'Barrackpore Special Thana'}</strong></span>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <span>Active Case: <strong style={{ color: '#2563eb' }}>Operation Ichhapur Matrix</strong></span>
            </p>
          </div>
        </div>

        {/* Action Controls & Live Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{
            background: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '6px',
            padding: '5px 10px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '11px'
          }}>
            <span style={{
              width: '7px',
              height: '7px',
              borderRadius: '50%',
              background: '#16a34a',
              display: 'inline-block'
            }} />
            <span style={{ fontWeight: 600, color: '#166534' }}>CCTNS/ICJS Synced</span>
          </div>

          <button
            type="button"
            onClick={onOpenAddSuspect}
            style={{
              background: '#1d4ed8',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              padding: '7px 14px',
              fontSize: '12px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'background 0.15s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#1e40af'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#1d4ed8'}
          >
            <UserPlus size={14} />
            <span>+ Register Suspect / FIR</span>
          </button>
        </div>
      </div>

      {/* 2. Key Metrics Bar (4 Balanced Cards) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px'
      }}>
        {/* Metric 1 */}
        <div 
          onClick={() => onNavigate('keyplayer')}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px 20px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#dc2626';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(220, 38, 38, 0.08)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.03)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              High-Threat Targets
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Target size={16} color="#dc2626" />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
            4 <span style={{ fontSize: '12px', fontWeight: 600, color: '#dc2626' }}>Identified</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span>2 Category-A Kingpins</span>
            <span style={{ color: '#dc2626', fontWeight: 700 }}>Disrupt Plan →</span>
          </div>
        </div>

        {/* Metric 2 */}
        <div 
          onClick={() => onNavigate('graphrag')}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px 20px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#2563eb';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(37, 99, 235, 0.08)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.03)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Active Case FIRs
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={16} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
            3 <span style={{ fontSize: '12px', fontWeight: 600, color: '#2563eb' }}>FIRs Ingested</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span>BNS 2024 & Arms Act</span>
            <span style={{ color: '#2563eb', fontWeight: 700 }}>Search Dossier →</span>
          </div>
        </div>

        {/* Metric 3 */}
        <div 
          onClick={() => onNavigate('spatiotemporal')}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px 20px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#d97706';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(217, 119, 6, 0.08)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.03)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Surveillance Radar
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#fffbeb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Truck size={16} color="#d97706" />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
            4 <span style={{ fontSize: '12px', fontWeight: 600, color: '#d97706' }}>Vehicles Tracked</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span>1 Active Convoy Alert</span>
            <span style={{ color: '#d97706', fontWeight: 700 }}>Open Radar →</span>
          </div>
        </div>

        {/* Metric 4 */}
        <div 
          onClick={() => onNavigate('audit')}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px 20px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#16a34a';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(22, 163, 74, 0.08)';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.boxShadow = '0 1px 2px rgba(0, 0, 0, 0.03)';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Court Evidence Chain
            </span>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#f0fdf4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Lock size={16} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: '26px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>
            24 <span style={{ fontSize: '12px', fontWeight: 600, color: '#16a34a' }}>Ledger Blocks</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
            <span>BSA 2024 Sec 63 Valid</span>
            <span style={{ color: '#16a34a', fontWeight: 700 }}>Verify Ledger →</span>
          </div>
        </div>
      </div>

      {/* 3. Main Two-Column Intelligence Workspace */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.45fr 1fr',
        gap: '20px',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Live Priority Intelligence & Threat Radar */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '10px',
          padding: '20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
        }}>
          {/* Header & Filter Controls */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '10px',
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={16} color="#dc2626" />
              <h3 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Live Case Intelligence & Threat Radar
              </h3>
              <span style={{
                background: '#fef2f2',
                color: '#dc2626',
                border: '1px solid #fecaca',
                fontSize: '10px',
                fontWeight: 700,
                padding: '1px 6px',
                borderRadius: '4px'
              }}>
                {recentAlerts.length} Active
              </span>
            </div>

            {/* Filter Buttons */}
            <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
              {[
                { id: 'ALL', label: 'All Leads' },
                { id: 'VEHICLE', label: 'Convoys' },
                { id: 'IDENTITY', label: 'Aliases' },
                { id: 'FORECAST', label: 'GNN Forecast' }
              ].map(tab => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setAlertFilter(tab.id)}
                  style={{
                    background: alertFilter === tab.id ? '#1e3a8a' : '#f8fafc',
                    color: alertFilter === tab.id ? '#ffffff' : '#64748b',
                    border: alertFilter === tab.id ? '1px solid #1e3a8a' : '1px solid #e2e8f0',
                    borderRadius: '5px',
                    padding: '4px 10px',
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

          {/* Intel Alert Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredAlerts.length === 0 ? (
              <div style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '12px' }}>
                No active intelligence items found under this filter.
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <div
                  key={alert.id}
                  onClick={() => onNavigate(alert.targetModule)}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
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
                        fontSize: '10px',
                        fontWeight: 800,
                        padding: '2px 7px',
                        borderRadius: '4px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.3px'
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

                  <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                    {alert.desc}
                  </p>

                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    fontSize: '11px',
                    paddingTop: '6px',
                    borderTop: '1px solid #f1f5f9'
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
              ))
            )}
          </div>
        </div>

        {/* Right Column: Active Operation Dossier & Priority Roster */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          
          {/* Card 1: Active Operation Briefing */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px 18px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Database size={15} color="#1d4ed8" />
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Active Investigation Dossier
                </span>
              </div>
              <span style={{
                background: '#eff6ff',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
                fontSize: '10px',
                fontWeight: 700,
                padding: '2px 6px',
                borderRadius: '4px'
              }}>
                FIR 142/2026
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Operation:</span>
                <strong style={{ color: '#0f172a' }}>Op Ichhapur Matrix</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Target Syndicate:</span>
                <strong style={{ color: '#dc2626' }}>Roy Extortion & Firearms Wing</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Primary Accused:</span>
                <strong style={{ color: '#0f172a' }}>Sunil "Doctor" Roy</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Statutory Basis:</span>
                <span style={{ color: '#1e40af', fontWeight: 600 }}>BNS Sec 111 / Arms Act</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => onNavigate('keyplayer')}
              style={{
                width: '100%',
                marginTop: '14px',
                background: '#eff6ff',
                border: '1px solid #bfdbfe',
                color: '#1d4ed8',
                borderRadius: '6px',
                padding: '8px',
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
              <Target size={13} />
              <span>Simulate Syndicate Disruption</span>
              <ChevronRight size={13} />
            </button>
          </div>

          {/* Card 2: Priority Targets Roster */}
          <div style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '10px',
            padding: '16px 18px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.04)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #f1f5f9' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Target size={15} color="#dc2626" />
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                  Top Wanted Targets
                </span>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('keyplayer')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#2563eb',
                  fontSize: '11px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  padding: 0
                }}
              >
                View All →
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {topSuspects.map((suspect) => (
                <div
                  key={suspect.id}
                  onClick={() => onNavigate('keyplayer')}
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '6px',
                    padding: '10px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px',
                    transition: 'all 0.12s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#ffffff';
                    e.currentTarget.style.borderColor = '#cbd5e1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#f8fafc';
                    e.currentTarget.style.borderColor = '#e2e8f0';
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <span style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a' }}>
                        {suspect.name}
                      </span>
                      <span style={{ fontSize: '10px', color: '#64748b', marginLeft: '6px' }}>
                        ({suspect.alias})
                      </span>
                    </div>
                    <span style={{
                      fontSize: '10px',
                      fontWeight: 700,
                      color: suspect.tierColor
                    }}>
                      {suspect.threatScore}% Threat
                    </span>
                  </div>

                  {/* Threat Progress Bar */}
                  <div style={{
                    width: '100%',
                    height: '4px',
                    background: '#e2e8f0',
                    borderRadius: '2px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${suspect.threatScore}%`,
                      height: '100%',
                      background: suspect.threatScore > 90 ? '#dc2626' : '#ea580c',
                      borderRadius: '2px'
                    }} />
                  </div>

                  <div style={{ fontSize: '10px', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                    <span>{suspect.role}</span>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{suspect.tier}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Card 3: Direct Tactical Shortcuts */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '8px'
          }}>
            <button
              type="button"
              onClick={() => onNavigate('graphrag')}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.12s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#2563eb';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Search size={16} color="#2563eb" />
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#0f172a', textAlign: 'center' }}>Case Q&A</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('keyplayer')}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.12s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#dc2626';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <Zap size={16} color="#dc2626" />
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#0f172a', textAlign: 'center' }}>Disruption</span>
            </button>

            <button
              type="button"
              onClick={() => onNavigate('spatiotemporal')}
              style={{
                background: '#ffffff',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '10px 6px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
                transition: 'all 0.12s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#d97706';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <MapPin size={16} color="#d97706" />
              <span style={{ fontSize: '10px', fontWeight: 700, color: '#0f172a', textAlign: 'center' }}>Convoy Map</span>
            </button>
          </div>

        </div>

      </div>

    </div>
  );
}
