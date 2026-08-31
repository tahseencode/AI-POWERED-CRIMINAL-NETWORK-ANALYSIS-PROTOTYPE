import React, { useState, useEffect } from 'react';
import { AlertTriangle, TrendingUp, Sparkles, Target, Clock, FileCheck, Users, Link as LinkIcon } from 'lucide-react';

export default function GNNPredictor({ currentRole }) {
  const [activeSubTab, setActiveSubTab] = useState('outcome'); // 'outcome' or 'gnn'
  const [gnnData, setGnnData] = useState(null);
  const [syndicateOutcomes, setSyndicateOutcomes] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [gnnRes, outRes] = await Promise.all([
        fetch('/api/gnn/predict').then(r => r.json()),
        fetch('/api/predict/syndicate-outcomes').then(r => r.json())
      ]);
      setGnnData(gnnRes);
      setSyndicateOutcomes(outRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '16px', height: 'calc(100vh - 128px)', overflowY: 'auto' }}>
      
      {/* Top Toggle Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            type="button"
            onClick={() => setActiveSubTab('outcome')}
            style={{
              padding: '6px 14px',
              borderRadius: '4px',
              border: activeSubTab === 'outcome' ? '1px solid #1e40af' : '1px solid #cbd5e1',
              background: activeSubTab === 'outcome' ? '#1e40af' : '#ffffff',
              color: activeSubTab === 'outcome' ? '#ffffff' : '#1e293b',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <TrendingUp size={14} color={activeSubTab === 'outcome' ? '#ffffff' : '#1e40af'} />
            <span>Upcoming Crime Move Forecast</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveSubTab('gnn')}
            style={{
              padding: '6px 14px',
              borderRadius: '4px',
              border: activeSubTab === 'gnn' ? '1px solid #1e40af' : '1px solid #cbd5e1',
              background: activeSubTab === 'gnn' ? '#1e40af' : '#ffffff',
              color: activeSubTab === 'gnn' ? '#ffffff' : '#1e293b',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Users size={14} color={activeSubTab === 'gnn' ? '#ffffff' : '#1e40af'} />
            <span>Suspected Hidden Gang Links</span>
          </button>
        </div>

        <button
          type="button"
          onClick={fetchData}
          className="btn-secondary"
          style={{ padding: '6px 12px', fontSize: '12px', fontWeight: 600 }}
        >
          <Sparkles size={13} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: UPCOMING ACTIONS & PRECEDENT FORECAST                              */}
      {/* ========================================================================= */}
      {activeSubTab === 'outcome' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: '20px' }}>
          
          {/* Left Column: Suspect Escalation Trajectories */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18} color="var(--accent-violet)" />
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Suspect Next Moves & Escalation Forecast
                </h3>
              </div>
              <span className="badge badge-crimson">
                High Risk Window
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              Matches active suspect behavior against historical police case patterns (2021–2025) to anticipate what the gang will do next.
            </p>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
                <p>Analyzing historical patterns & generating forecast...</p>
              </div>
            ) : syndicateOutcomes?.all_suspects_predictions?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
                {syndicateOutcomes.all_suspects_predictions.map((item, idx) => (
                  <div key={idx} style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {item.suspect_name}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-secondary)', marginLeft: '8px', fontWeight: 500 }}>
                          ({item.role})
                        </span>
                      </div>
                      <span className="badge badge-violet" style={{ fontSize: '10px' }}>
                        {item.prediction?.overall_escalation_percentage} Escalation Risk
                      </span>
                    </div>

                    {/* Matched Precedent Box */}
                    <div style={{
                      background: '#ede9fe',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      borderLeft: '3px solid var(--accent-violet)'
                    }}>
                      <div style={{ fontSize: '10px', color: '#6d28d9', fontWeight: 700 }}>
                        Similar Past Case Pattern ({item.prediction?.matched_historical_precedent?.similarity_percentage} Match):
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 700, color: '#4c1d95', marginTop: '2px' }}>
                        {item.prediction?.matched_historical_precedent?.case_title}
                      </div>
                      <div style={{ fontSize: '11px', color: '#5b21b6', marginTop: '3px' }}>
                        <strong>Past Case Outcome:</strong> {item.prediction?.matched_historical_precedent?.actual_historical_outcome}
                      </div>
                    </div>

                    {/* Forecasted Progression Timeline */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 700 }}>
                        Predicted Next Steps:
                      </span>
                      {item.prediction?.forecasted_outcome_timeline?.map((step, sIdx) => (
                        <div key={sIdx} style={{
                          background: '#ffffff',
                          border: '1px solid var(--border-subtle)',
                          borderRadius: '4px',
                          padding: '6px 8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={12} color="var(--accent-cyan)" />
                            <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 700 }}>{step.timeframe}:</span>
                            <span style={{ fontSize: '11px', color: 'var(--text-primary)' }}>{step.predicted_action}</span>
                          </div>
                          <span style={{ fontSize: '9px', color: step.threat_level === 'CRITICAL' ? 'var(--accent-crimson)' : 'var(--accent-amber)', fontWeight: 700 }}>
                            {step.probability}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Tactical Intervention */}
                    <div style={{
                      background: '#f0f9ff',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      border: '1px solid #bae6fd',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ fontSize: '11px', color: '#0369a1' }}>
                        <strong style={{ color: 'var(--accent-cyan)' }}>Recommended Police Action: </strong>
                        {item.prediction?.tactical_intervention_strategy?.primary_action}
                      </div>
                      <span className="badge badge-cyan" style={{ fontSize: '9px', whiteSpace: 'nowrap' }}>
                        Window: {item.prediction?.tactical_intervention_strategy?.critical_window_hours}h
                      </span>
                    </div>

                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                No active suspects found to forecast.
              </div>
            )}
          </div>

          {/* Right Column: Historical Precedent Case Benchmark Library */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <FileCheck size={18} color="var(--accent-cyan)" />
                <h3 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Police Archives Case Library (Reference Cases)
                </h3>
              </div>
              <span className="badge badge-cyan">CCTNS Verified</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              Past cases and known modus operandi used by the system to recognize gang patterns.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
              
              <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    Operation Ordnance Guard: Barrackpore-Ichhapur (2024)
                  </span>
                  <span className="badge badge-amber" style={{ fontSize: '9px' }}>Illegal Arms</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 8px', lineHeight: 1.4 }}>
                  <strong>How Crime was Executed:</strong> Inter-state arms transport via highway using false-bottom trucks. Safehouse distribution within 72h followed by extortion.
                </p>
                <div style={{ fontSize: '11px', color: '#047857', background: '#dcfce7', padding: '6px 8px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                  <strong>Police Action Result:</strong> Main courier intercepted at Barrackpore Toll using ANPR camera alert before vehicles could split up.
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-violet)' }}>
                    Operation Golden Anchor: Kolkata Port Hawala (2024)
                  </span>
                  <span className="badge badge-violet" style={{ fontSize: '9px' }}>Hawala Cash</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 8px', lineHeight: 1.4 }}>
                  <strong>How Crime was Executed:</strong> Cash collected via Angadia couriers, layered across 4 bank accounts, and converted to cryptocurrency within 96 hours.
                </p>
                <div style={{ fontSize: '11px', color: '#047857', background: '#dcfce7', padding: '6px 8px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                  <strong>Police Action Result:</strong> Bank accounts frozen within 24 hours under PMLA Sec 5, recovering ₹1.8 Crore before transfer.
                </div>
              </div>

              <div style={{ background: '#f8fafc', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--accent-crimson)' }}>
                    Operation GhostSwitch: Salt Lake SIM-Box Extortion (2025)
                  </span>
                  <span className="badge badge-crimson" style={{ fontSize: '9px' }}>Cyber Extortion</span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: '0 0 8px', lineHeight: 1.4 }}>
                  <strong>How Crime was Executed:</strong> Rotating 64 fake SIM cards to make spoofed extortion calls before telecom tower triangulation.
                </p>
                <div style={{ fontSize: '11px', color: '#047857', background: '#dcfce7', padding: '6px 8px', borderRadius: '4px', border: '1px solid #bbf7d0' }}>
                  <strong>Police Action Result:</strong> Tower CDR triangulation matched location and special team raided gateway setup within 48h.
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: HIDDEN CONNECTIONS & UNMONITORED LEADS                            */}
      {/* ========================================================================= */}
      {activeSubTab === 'gnn' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Missing Intelligence Leads */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} color="var(--accent-amber)" />
                <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Suspected Hidden Gang Links (Surveillance Leads)
                </h2>
              </div>
              <span className="badge badge-amber">High Probability</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              Suspects who have strong indirect connections (shared contacts, burner phone calls, co-travel) but no direct FIR recorded yet.
            </p>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
                <p>Analyzing hidden gang connections...</p>
              </div>
            ) : gnnData?.missing_intelligence_leads?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
                {gnnData.missing_intelligence_leads.map((lead, idx) => (
                  <div key={idx} style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {lead.source_name}
                        </span>
                        <span style={{ color: 'var(--accent-amber)', fontSize: '11px' }}>⟷</span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {lead.target_name}
                        </span>
                      </div>
                      <span className="badge badge-amber" style={{ fontSize: '10px' }}>
                        {Math.round(lead.link_probability * 100)}% Match
                      </span>
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 600 }}>
                      Suspected Connection: {lead.predicted_relationship}
                    </div>

                    <div style={{ fontSize: '11px', color: '#78350f', background: '#fef3c7', padding: '6px 8px', borderRadius: '4px', border: '1px solid #fde68a' }}>
                      <strong>Surveillance Tip:</strong> {lead.surveillance_recommendation}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                No critical unobserved links detected in current data.
              </div>
            )}
          </div>

          {/* Future Associations Forecast */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={20} color="var(--accent-cyan)" />
                <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Likely Future Criminal Partnerships
                </h2>
              </div>
              <span className="badge badge-cyan">Future Risk</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              Forecasts which suspects are likely to team up or form new operations based on their roles and geographic overlap.
            </p>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
                <p>Calculating partnership risks...</p>
              </div>
            ) : gnnData?.future_associations_forecast?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
                {gnnData.future_associations_forecast.map((forecast, idx) => (
                  <div key={idx} style={{
                    background: '#f8fafc',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {forecast.entity_a}
                        </span>
                        <span style={{ color: 'var(--accent-cyan)', fontSize: '11px' }}>➔</span>
                        <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                          {forecast.entity_b}
                        </span>
                      </div>
                      <span className="badge badge-violet" style={{ fontSize: '10px' }}>
                        Risk: {Math.round(forecast.projected_collaboration_risk * 100)}%
                      </span>
                    </div>

                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', margin: 0 }}>
                      {forecast.potential_modus_operandi}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                No new criminal partnerships forecasted.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
