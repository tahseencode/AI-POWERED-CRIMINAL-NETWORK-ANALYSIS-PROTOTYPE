import React from 'react';
import { 
  Target, 
  Search, 
  TrendingUp, 
  MapPin, 
  Layers, 
  FileText, 
  Lock, 
  UserPlus, 
  Building2, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight,
  Shield,
  Truck,
  Users,
  Scale
} from 'lucide-react';

export default function DashboardHome({ 
  officerUser, 
  systemStatus, 
  onNavigate, 
  onOpenAddSuspect, 
  onOpenCctnsModal 
}) {
  const modules = [
    {
      id: 'keyplayer',
      path: '/suspects',
      title: 'Top Suspects & Arrest Plan',
      desc: 'Priority target list of key gang players with an arrest simulator to calculate how the gang breaks down upon arrest.',
      icon: Target,
      color: '#dc2626',
      badge: 'High Priority',
      badgeClass: 'badge-crimson',
      stat: '4 Key Players'
    },
    {
      id: 'graphrag',
      path: '/search',
      title: 'Case Q&A & Record Search',
      desc: 'Ask questions in plain English or Hindi. Searches all verified case files, call logs, bank accounts, and FIR records.',
      icon: Search,
      color: '#1d4ed8',
      badge: 'Court-Ready',
      badgeClass: 'badge-cyan',
      stat: 'Verified Facts'
    },
    {
      id: 'gnn',
      path: '/forecast',
      title: 'Hidden Links & Next Moves',
      desc: 'Forecasts upcoming criminal moves based on historical cases and uncovers hidden partnerships between suspects.',
      icon: TrendingUp,
      color: '#6d28d9',
      badge: 'Crime Forecast',
      badgeClass: 'badge-violet',
      stat: 'Next Probable Moves'
    },
    {
      id: 'spatiotemporal',
      path: '/map',
      title: 'Crime Map & Vehicle Tracking',
      desc: 'Live GIS mapping of crime spots, highway toll scans, and automated detection of suspicious vehicle convoys.',
      icon: MapPin,
      color: '#b45309',
      badge: 'Live Radar',
      badgeClass: 'badge-amber',
      stat: 'Vehicle Convoys'
    },
    {
      id: 'entityres',
      path: '/matcher',
      title: 'Duplicate Suspect Matcher',
      desc: 'Flags when criminals use fake names, aliases, or different phone numbers across police stations and merges records.',
      icon: Layers,
      color: '#059669',
      badge: 'Alias Matcher',
      badgeClass: 'badge-emerald',
      stat: '97.2% Faster Search'
    },
    {
      id: 'ingest',
      path: '/upload-fir',
      title: 'Upload FIR & Documents',
      desc: 'Multilingual scanner for FIRs and diaries in English, Hindi, or Bengali to extract suspect names, phones, and BNS sections.',
      icon: FileText,
      color: '#0284c7',
      badge: 'OCR & Auto-Fill',
      badgeClass: 'badge-cyan',
      stat: 'En / Hi / Bn OCR'
    },
    {
      id: 'audit',
      path: '/evidence-log',
      title: 'Court Evidence Log',
      desc: 'Tamper-proof digital log of all officer queries and evidence records, certified for court under Section 63 BSA 2024.',
      icon: Lock,
      color: '#15803d',
      badge: 'BSA 2024 Sec 63',
      badgeClass: 'badge-emerald',
      stat: 'Tamper-Proof'
    }
  ];

  const recentAlerts = [
    {
      type: 'CONVOY_ALERT',
      title: '🚨 High-Threat Vehicle Convoy Detected',
      desc: 'Vehicles WB-24-AX-5512 (Bolero) & WB-02-AB-1234 (Scorpio) travelled within 3.5km at Ichhapur Toll within 4 hrs.',
      time: 'Today, 21:30 hrs',
      action: () => onNavigate('spatiotemporal')
    },
    {
      type: 'ALIAS_MATCH',
      title: '👥 Duplicate Suspect Record Flagged',
      desc: 'Suspect Sunil "Doctor" Roy matched with Sunil Mondal (Kolkata Port Trust FIR) with 98% confidence.',
      time: 'Today, 18:45 hrs',
      action: () => onNavigate('entityres')
    },
    {
      type: 'UPCOMING_MOVE',
      title: '🔮 Predicted Escalation: Cross-Border Contraband Handover',
      desc: 'Historical case pattern match (Siliguri Transit corridor) indicates high likelihood of firearm movement within 72 hrs.',
      time: 'Forecast Active',
      action: () => onNavigate('gnn')
    }
  ];

  return (
    <div style={{ padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
      
      {/* 1. Welcome & Officer Status Banner */}
      <div className="gov-card" style={{ padding: '18px 24px', background: '#ffffff', border: '1px solid #cbd5e1' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
                Welcome, {officerUser?.name || 'Investigating Officer'}
              </h2>
              <span className="badge badge-cyan" style={{ fontSize: '11px', fontWeight: 700 }}>
                {officerUser?.role || 'Investigating Officer (IO)'}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: '#475569', margin: '4px 0 0' }}>
              Badge: <strong style={{ color: '#0f172a' }}>{officerUser?.badgeId || 'IO-8842'}</strong> • Station: <strong style={{ color: '#0f172a' }}>{officerUser?.station || 'Barrackpore Special Thana'}</strong> • Active Case: <strong style={{ color: '#1e40af' }}>Operation Ichhapur Matrix</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              type="button"
              onClick={onOpenAddSuspect}
              className="btn-primary"
              style={{ padding: '7px 14px', fontSize: '12px', fontWeight: 700 }}
            >
              <UserPlus size={14} />
              <span>+ Register New Suspect / FIR</span>
            </button>
            <button
              type="button"
              onClick={onOpenCctnsModal}
              className="btn-secondary"
              style={{ padding: '7px 14px', fontSize: '12px', fontWeight: 600 }}
            >
              <Building2 size={14} color="#1e40af" />
              <span>National ICJS 5-Pillars</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Statistical Metrics Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px' }}>
        <div className="gov-card" style={{ padding: '16px', borderLeft: '4px solid #dc2626' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Most Wanted Criminals</span>
            <Target size={16} color="#dc2626" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>4 Targets</div>
          <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: 600, marginTop: '2px' }}>High Threat Syndicate Players</div>
        </div>

        <div className="gov-card" style={{ padding: '16px', borderLeft: '4px solid #1d4ed8' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Synchronized FIRs</span>
            <FileText size={16} color="#1d4ed8" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>3 Active Cases</div>
          <div style={{ fontSize: '11px', color: '#1e40af', fontWeight: 600, marginTop: '2px' }}>BNS 2024 & Arms Act Sections</div>
        </div>

        <div className="gov-card" style={{ padding: '16px', borderLeft: '4px solid #b45309' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Tracked Vehicles</span>
            <Truck size={16} color="#b45309" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>4 Plates Flagged</div>
          <div style={{ fontSize: '11px', color: '#b45309', fontWeight: 600, marginTop: '2px' }}>1 Active Group Convoy</div>
        </div>

        <div className="gov-card" style={{ padding: '16px', borderLeft: '4px solid #15803d' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>Evidence Chain Logs</span>
            <Lock size={16} color="#15803d" />
          </div>
          <div style={{ fontSize: '24px', fontWeight: 800, color: '#0f172a', marginTop: '6px' }}>20+ Records</div>
          <div style={{ fontSize: '11px', color: '#15803d', fontWeight: 600, marginTop: '2px' }}>Certified under BSA Sec 63</div>
        </div>
      </div>

      {/* 3. Main Operational Modules Grid (All 7 Pages) */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: 800, color: '#0f172a', margin: 0 }}>
            Operational Investigation & Intelligence Modules
          </h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>Select any module below to begin investigation</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '14px' }}>
          {modules.map((m) => {
            const IconComponent = m.icon;
            return (
              <div
                key={m.id}
                onClick={() => onNavigate(m.id)}
                className="gov-card"
                style={{
                  padding: '18px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#1d4ed8';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(29, 78, 216, 0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#cbd5e1';
                  e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.05)';
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '4px',
                        background: '#f1f5f9',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <IconComponent size={18} color={m.color} />
                      </div>
                      <h4 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                        {m.title}
                      </h4>
                    </div>
                    <span className={`badge ${m.badgeClass}`} style={{ fontSize: '10px' }}>
                      {m.badge}
                    </span>
                  </div>

                  <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.5, margin: 0 }}>
                    {m.desc}
                  </p>
                </div>

                <div style={{
                  borderTop: '1px solid #f1f5f9',
                  paddingTop: '10px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontSize: '11px'
                }}>
                  <span style={{ color: '#64748b', fontWeight: 600 }}>{m.stat}</span>
                  <span style={{ color: '#1d4ed8', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    Open Module <ArrowRight size={13} />
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Live Case Intelligence Bulletin */}
      <div className="gov-card" style={{ padding: '18px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={18} color="#b45309" />
            <h3 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', margin: 0 }}>
              Live Case Intelligence Bulletin & Priority Action Items
            </h3>
          </div>
          <span className="badge badge-amber">3 Active Leads</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {recentAlerts.map((alert, aIdx) => (
            <div
              key={aIdx}
              onClick={alert.action}
              style={{
                background: '#f8fafc',
                border: '1px solid #cbd5e1',
                borderRadius: '4px',
                padding: '12px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#eff6ff'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#f8fafc'}
            >
              <div>
                <div style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a' }}>
                  {alert.title}
                </div>
                <div style={{ fontSize: '12px', color: '#475569', marginTop: '2px' }}>
                  {alert.desc}
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span className="badge badge-blue" style={{ fontSize: '10px' }}>{alert.time}</span>
                <div style={{ fontSize: '11px', color: '#1d4ed8', fontWeight: 600, marginTop: '4px' }}>
                  View Lead ➔
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
