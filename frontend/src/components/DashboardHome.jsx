import React from 'react';
import { 
  Target, 
  Search, 
  MapPin, 
  FileText, 
  Lock, 
  Shield, 
  Truck, 
  Radio, 
  ArrowRight,
  Clock,
  ExternalLink,
  CheckCircle2,
  TrendingUp,
  AlertTriangle
} from 'lucide-react';

export default function DashboardHome({ 
  officerUser, 
  systemStatus, 
  onNavigate, 
  onOpenAddSuspect, 
  onOpenCctnsModal 
}) {
  const priorityLeads = [
    {
      id: 'lead-1',
      category: 'VEHICLE CONVOY',
      severity: 'CRITICAL',
      badgeColor: '#dc2626',
      badgeBg: '#fef2f2',
      badgeBorder: '#fecaca',
      title: 'High-Threat Convoy Flagged',
      desc: 'Vehicles WB-24-AX-5512 & WB-02-AB-1234 travelled within 3.5km along Ichhapur Corridor within 4 hours.',
      location: 'Ichhapur Toll Plaza (NH-12)',
      time: 'Today, 21:30 hrs',
      targetModule: 'spatiotemporal'
    },
    {
      id: 'lead-2',
      category: 'ALIAS MATCH',
      severity: 'HIGH',
      badgeColor: '#d97706',
      badgeBg: '#fffbeb',
      badgeBorder: '#fde68a',
      title: 'Cross-Thana Duplicate Record',
      desc: 'Sunil "Doctor" Roy matched Sunil Mondal (Kolkata Port Trust FIR-089) with 98% Fellegi-Sunter confidence.',
      location: 'Barrackpore / Kolkata Port Link',
      time: 'Today, 18:45 hrs',
      targetModule: 'entityres'
    },
    {
      id: 'lead-3',
      category: 'GNN FORECAST',
      severity: 'PREDICTIVE',
      badgeColor: '#7c3aed',
      badgeBg: '#f5f3ff',
      badgeBorder: '#ddd6fe',
      title: 'Predicted Arms Handover',
      desc: 'GNN Link Prediction models indicate 84% probability of firearms transit in Siliguri corridor within 72 hrs.',
      location: 'Siliguri Transit Corridor',
      time: 'Next 72h Window',
      targetModule: 'gnn'
    }
  ];

  const topSuspects = [
    {
      id: 'PERSON_002',
      name: 'Tariq Al-Hasani',
      alias: 'Kabir Bhai',
      role: 'Hawala Financier',
      threatScore: 92,
      tier: 'Tier 1 Kingpin',
      tierColor: '#dc2626'
    },
    {
      id: 'PERSON_008',
      name: 'Erick Ekka',
      alias: 'Chhotu',
      role: 'Logistics & Courier',
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
      tier: 'Tier 1 Head',
      tierColor: '#dc2626'
    }
  ];

  return (
    <div style={{ 
      padding: '24px 28px', 
      maxWidth: '1360px', 
      margin: '0 auto', 
      display: 'flex', 
      flexDirection: 'column', 
      gap: '20px' 
    }}>
      
      {/* 1. Streamlined Officer Command Header */}
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
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '6px',
            background: '#1e3a8a',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            flexShrink: 0
          }}>
            <Shield size={20} />
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <h2 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Welcome, {officerUser?.name || 'Investigating Officer'}
              </h2>
              <span style={{
                background: '#eff6ff',
                color: '#1d4ed8',
                border: '1px solid #bfdbfe',
                fontSize: '11px',
                fontWeight: 700,
                padding: '1px 7px',
                borderRadius: '4px'
              }}>
                {officerUser?.role || 'Investigating Officer (IO)'}
              </span>
            </div>
            <p style={{ fontSize: '11px', color: '#64748b', margin: '3px 0 0', display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              <span>Badge: <strong style={{ color: '#0f172a' }}>{officerUser?.badgeId || 'IO-8842'}</strong></span>
              <span style={{ color: '#cbd5e1' }}>•</span>
              <span>Station: <strong style={{ color: '#0f172a' }}>{officerUser?.station || 'Barrackpore Special Thana'}</strong></span>
            </p>
          </div>
        </div>

        {/* Status Indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>
          <div style={{
            background: '#f8fafc',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            padding: '5px 10px',
            fontSize: '11px',
            color: '#475569'
          }}>
            Active Case: <strong style={{ color: '#1d4ed8' }}>Operation Ichhapur Matrix</strong>
          </div>

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
        </div>
      </div>

      {/* 2. Core Metrics Bar (4 Concise, Clean Cards) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: '14px'
      }}>
        {/* Metric 1: Suspects */}
        <div 
          onClick={() => onNavigate('keyplayer')}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px 18px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Wanted Targets
            </span>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              background: '#fef2f2',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Target size={16} color="#dc2626" />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            4 <span style={{ fontSize: '11px', fontWeight: 600, color: '#dc2626' }}>Identified</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            2 Category-A Kingpins
          </div>
        </div>

        {/* Metric 2: Case FIRs */}
        <div 
          onClick={() => onNavigate('graphrag')}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px 18px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Ingested FIRs
            </span>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              background: '#eff6ff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={16} color="#2563eb" />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            3 <span style={{ fontSize: '11px', fontWeight: 600, color: '#2563eb' }}>Records</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            BNS 2024 & Arms Act
          </div>
        </div>

        {/* Metric 3: Surveillance Radar */}
        <div 
          onClick={() => onNavigate('spatiotemporal')}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px 18px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
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
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Vehicle Radar
            </span>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              background: '#fffbeb',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Truck size={16} color="#d97706" />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            4 <span style={{ fontSize: '11px', fontWeight: 600, color: '#d97706' }}>Tracked</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            1 Convoy Anomaly
          </div>
        </div>

        {/* Metric 4: Court Evidence */}
        <div 
          onClick={() => onNavigate('audit')}
          style={{
            background: '#ffffff',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            padding: '16px 18px',
            cursor: 'pointer',
            transition: 'all 0.15s ease',
            boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#16a34a';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
              Evidence Chain
            </span>
            <div style={{
              width: '30px',
              height: '30px',
              borderRadius: '6px',
              background: '#f0fdf4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Lock size={16} color="#16a34a" />
            </div>
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>
            24 <span style={{ fontSize: '11px', fontWeight: 600, color: '#16a34a' }}>Ledger Blocks</span>
          </div>
          <div style={{ fontSize: '11px', color: '#64748b', marginTop: '4px' }}>
            BSA Sec 63 Certified
          </div>
        </div>
      </div>

      {/* 3. Main Two-Column Clean Intelligence Display */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.4fr 1fr',
        gap: '20px',
        alignItems: 'start'
      }}>
        
        {/* Left Column: Priority Actionable Intelligence */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
        }}>
          {/* Section Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: '1px solid #f1f5f9',
            paddingBottom: '12px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Radio size={16} color="#dc2626" />
              <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Priority Action Leads
              </h3>
            </div>
            <span style={{
              background: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              fontSize: '10px',
              fontWeight: 700,
              padding: '2px 6px',
              borderRadius: '4px'
            }}>
              {priorityLeads.length} Urgent
            </span>
          </div>

          {/* Leads List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {priorityLeads.map((lead) => (
              <div
                key={lead.id}
                onClick={() => onNavigate(lead.targetModule)}
                style={{
                  background: '#f8fafc',
                  border: '1px solid #e2e8f0',
                  borderRadius: '6px',
                  padding: '12px 14px',
                  cursor: 'pointer',
                  transition: 'all 0.12s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ffffff';
                  e.currentTarget.style.borderColor = '#93c5fd';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(37, 99, 235, 0.06)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#f8fafc';
                  e.currentTarget.style.borderColor = '#e2e8f0';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                    <span style={{
                      background: lead.badgeBg,
                      color: lead.badgeColor,
                      border: `1px solid ${lead.badgeBorder}`,
                      fontSize: '9px',
                      fontWeight: 800,
                      padding: '1px 5px',
                      borderRadius: '3px',
                      textTransform: 'uppercase'
                    }}>
                      {lead.severity}
                    </span>
                    <h4 style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                      {lead.title}
                    </h4>
                  </div>
                  <span style={{ fontSize: '10px', color: '#64748b', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '3px' }}>
                    <Clock size={11} />
                    {lead.time}
                  </span>
                </div>

                <p style={{ fontSize: '11px', color: '#475569', lineHeight: 1.45, margin: 0 }}>
                  {lead.desc}
                </p>

                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  fontSize: '10px',
                  paddingTop: '4px'
                }}>
                  <span style={{ color: '#64748b', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={11} color="#94a3b8" />
                    {lead.location}
                  </span>
                  <span style={{ 
                    color: '#2563eb', 
                    fontWeight: 700, 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '3px' 
                  }}>
                    Investigate Lead <ArrowRight size={11} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Consolidated Active Syndicate & Targets */}
        <div style={{
          background: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '18px 20px',
          display: 'flex',
          flexDirection: 'column',
          gap: '14px',
          boxShadow: '0 1px 2px rgba(0, 0, 0, 0.02)'
        }}>
          {/* Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between', 
            borderBottom: '1px solid #f1f5f9', 
            paddingBottom: '12px' 
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={16} color="#dc2626" />
              <h3 style={{ fontSize: '13px', fontWeight: 800, color: '#0f172a', margin: 0, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                Roy Syndicate Roster
              </h3>
            </div>
            <span style={{
              background: '#eff6ff',
              color: '#1d4ed8',
              border: '1px solid #bfdbfe',
              fontSize: '10px',
              fontWeight: 700,
              padding: '1px 6px',
              borderRadius: '4px'
            }}>
              FIR 142/2026
            </span>
          </div>

          {/* Suspects Quick List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
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
                  gap: '5px',
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
                    <span style={{ fontSize: '10px', color: '#64748b', marginLeft: '5px' }}>
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

          {/* Unified Primary Navigation Action */}
          <button
            type="button"
            onClick={() => onNavigate('keyplayer')}
            style={{
              width: '100%',
              marginTop: '4px',
              background: '#1d4ed8',
              border: 'none',
              color: '#ffffff',
              borderRadius: '6px',
              padding: '9px 12px',
              fontSize: '11px',
              fontWeight: 700,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'background 0.12s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#1e40af'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#1d4ed8'}
          >
            <span>Open Network Analysis & Disruption Plan</span>
            <ArrowRight size={13} />
          </button>
        </div>

      </div>

    </div>
  );
}
