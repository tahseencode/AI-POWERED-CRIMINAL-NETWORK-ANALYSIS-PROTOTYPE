import React, { useState, useEffect } from 'react';
import { Cpu, AlertTriangle, TrendingUp, Sparkles, Shield, Eye, Network, Target, Clock, Zap, FileCheck, Layers } from 'lucide-react';

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
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={() => setActiveSubTab('outcome')}
            className={activeSubTab === 'outcome' ? 'btn-primary' : ''}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid var(--border-glow)',
              background: activeSubTab === 'outcome' ? 'linear-gradient(135deg, rgba(124, 77, 255, 0.3) 0%, rgba(0, 229, 255, 0.3) 100%)' : 'rgba(15, 23, 42, 0.6)',
              color: activeSubTab === 'outcome' ? '#fff' : 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <TrendingUp size={15} color="var(--accent-violet)" />
            <span>🔮 Historical Pattern & Syndicate Outcome Forecaster</span>
            <span className="badge badge-violet" style={{ fontSize: '9px' }}>AI Predictive</span>
          </button>

          <button
            onClick={() => setActiveSubTab('gnn')}
            className={activeSubTab === 'gnn' ? 'btn-primary' : ''}
            style={{
              padding: '8px 16px',
              borderRadius: '6px',
              border: '1px solid var(--border-subtle)',
              background: activeSubTab === 'gnn' ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.3) 0%, rgba(16, 185, 129, 0.3) 100%)' : 'rgba(15, 23, 42, 0.6)',
              color: activeSubTab === 'gnn' ? '#fff' : 'var(--text-muted)',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <Cpu size={15} color="var(--accent-cyan)" />
            <span>🕸️ PyG Graph Attention (GAT) Link Predictor</span>
          </button>
        </div>

        <button
          onClick={fetchData}
          className="btn-primary"
          style={{ padding: '6px 12px', fontSize: '11px' }}
        >
          <Sparkles size={13} />
          <span>Re-Run AI Inference</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* VIEW 1: AI HISTORICAL PATTERN RECOGNITION & OUTCOME FORECASTER            */}
      {/* ========================================================================= */}
      {activeSubTab === 'outcome' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Left Column: Key Suspects Outcome Trajectories */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Target size={18} color="var(--accent-violet)" />
                <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-tech)', color: '#fff', textTransform: 'uppercase', margin: 0 }}>
                  Active Suspect Escalation Forecaster
                </h3>
              </div>
              <span className="badge badge-crimson">
                {syndicateOutcomes?.overall_syndicate_threat || 'CRITICAL_WINDOW'}
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              AI neuro-symbolic engine matching current suspect modus operandi against archived Indian Police cases (2021-2025) to predict upcoming moves.
            </p>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
                <Cpu size={32} className="pulse-live" style={{ margin: '0 auto 12px', color: 'var(--accent-violet)' }} />
                <p>Matching historical syndicate patterns & generating forecasts...</p>
              </div>
            ) : syndicateOutcomes?.all_suspects_predictions?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto' }}>
                {syndicateOutcomes.all_suspects_predictions.map((item, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(7, 9, 14, 0.75)',
                    border: '1px solid rgba(124, 77, 255, 0.3)',
                    borderRadius: '8px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                          {item.suspect_name}
                        </span>
                        <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginLeft: '8px' }}>
                          ({item.role})
                        </span>
                      </div>
                      <span className="badge badge-violet" style={{ fontSize: '10px' }}>
                        {item.prediction?.overall_escalation_percentage} Escalation Risk
                      </span>
                    </div>

                    {/* Matched Precedent Box */}
                    <div style={{
                      background: 'rgba(15, 23, 42, 0.6)',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      borderLeft: '3px solid var(--accent-violet)'
                    }}>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        Matched Historical Precedent ({item.prediction?.matched_historical_precedent?.similarity_percentage} match):
                      </div>
                      <div style={{ fontSize: '11px', fontWeight: 600, color: '#d8b4fe', marginTop: '2px' }}>
                        {item.prediction?.matched_historical_precedent?.case_title}
                      </div>
                      <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px' }}>
                        <strong>Historical Precedent Outcome:</strong> {item.prediction?.matched_historical_precedent?.actual_historical_outcome}
                      </div>
                    </div>

                    {/* Forecasted Progression Timeline */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>
                        Forecasted Escalation Sequence
                      </span>
                      {item.prediction?.forecasted_outcome_timeline?.map((step, sIdx) => (
                        <div key={sIdx} style={{
                          background: 'rgba(7, 9, 14, 0.5)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          borderRadius: '4px',
                          padding: '6px 8px',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          gap: '8px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Clock size={12} color="var(--accent-cyan)" />
                            <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontWeight: 600 }}>{step.timeframe}:</span>
                            <span style={{ fontSize: '10px', color: '#e2e8f0' }}>{step.predicted_action}</span>
                          </div>
                          <span style={{ fontSize: '9px', color: step.threat_level === 'CRITICAL' ? 'var(--accent-crimson)' : 'var(--accent-amber)', fontWeight: 700 }}>
                            {step.probability}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Tactical Intervention */}
                    <div style={{
                      background: 'rgba(0, 229, 255, 0.06)',
                      borderRadius: '6px',
                      padding: '8px 10px',
                      border: '1px solid rgba(0, 229, 255, 0.2)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <div style={{ fontSize: '11px', color: '#e0f2fe' }}>
                        <strong style={{ color: 'var(--accent-cyan)' }}>Tactical Countermeasure: </strong>
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
                <h3 style={{ fontSize: '14px', fontFamily: 'var(--font-tech)', color: '#fff', textTransform: 'uppercase', margin: 0 }}>
                  Historical Precedent Case Dataset (Ground Truth)
                </h3>
              </div>
              <span className="badge badge-cyan">CCTNS / ICJS Archive</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              Validated historical law enforcement case records used by the AI engine to recognize syndicate patterns and outcome trajectories.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
              
              <div style={{ background: 'rgba(7, 9, 14, 0.65)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-cyan)' }}>
                    Operation Ordnance Guard: Barrackpore-Ichhapur (2024)
                  </span>
                  <span className="badge badge-amber" style={{ fontSize: '9px' }}>Arms Syndicate</span>
                </div>
                <p style={{ fontSize: '11px', color: '#cbd5e1', margin: '0 0 8px', lineHeight: 1.4 }}>
                  <strong>Modus Operandi:</strong> Interstate arms shipments via NH highway corridors using modified hydraulic false-bottom trucks. Safehouse distribution within 72h followed by armed intimidation.
                </p>
                <div style={{ fontSize: '11px', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.08)', padding: '6px 8px', borderRadius: '4px' }}>
                  <strong>Historical Result:</strong> Lead courier intercepted on Day 5 at Barrackpore Toll using ANPR roadblock before convoy split.
                </div>
              </div>

              <div style={{ background: 'rgba(7, 9, 14, 0.65)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accent-violet)' }}>
                    Operation Golden Anchor: Kolkata Port Hawala (2024)
                  </span>
                  <span className="badge badge-violet" style={{ fontSize: '9px' }}>Hawala / PMLA</span>
                </div>
                <p style={{ fontSize: '11px', color: '#cbd5e1', margin: '0 0 8px', lineHeight: 1.4 }}>
                  <strong>Modus Operandi:</strong> Burrabazar Angadia cash collection layered across 4 shell accounts and converted to Bitcoin within 96 hours before bank freeze.
                </p>
                <div style={{ fontSize: '11px', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.08)', padding: '6px 8px', borderRadius: '4px' }}>
                  <strong>Historical Result:</strong> PMLA Sec 5 provisional attachment within 24 hours froze ₹1.8 Cr before cold wallet offshore transfer.
                </div>
              </div>

              <div style={{ background: 'rgba(7, 9, 14, 0.65)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '14px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#f43f5e' }}>
                    Operation GhostSwitch: Salt Lake SIM-Box Extortion (2025)
                  </span>
                  <span className="badge badge-crimson" style={{ fontSize: '9px' }}>Cyber Extortion</span>
                </div>
                <p style={{ fontSize: '11px', color: '#cbd5e1', margin: '0 0 8px', lineHeight: 1.4 }}>
                  <strong>Modus Operandi:</strong> 32-port GSM gateway rotating 64 IMSI numbers to execute spoofed video call extortions before RF cell tower triangulation.
                </p>
                <div style={{ fontSize: '11px', color: 'var(--accent-emerald)', background: 'rgba(16, 185, 129, 0.08)', padding: '6px 8px', borderRadius: '4px' }}>
                  <strong>Historical Result:</strong> Real-time CDR cell-ID correlation with telecom service provider raided gateway node within 48h.
                </div>
              </div>

            </div>
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: PYG GAT LINK PREDICTOR & MISSING INTELLIGENCE LEADS              */}
      {/* ========================================================================= */}
      {activeSubTab === 'gnn' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          
          {/* Missing Intelligence Leads */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <AlertTriangle size={20} color="var(--accent-amber)" />
                <h2 style={{ fontSize: '15px', fontFamily: 'var(--font-tech)', color: '#fff', textTransform: 'uppercase', margin: 0 }}>
                  Missing Intelligence Leads (Unobserved Links)
                </h2>
              </div>
              <span className="badge badge-amber">PyG GAT Inference</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              High-probability (&gt;70%) unobserved structural edges computed via Graph Attention message-passing. Indicates intelligence collection gaps requiring targeted surveillance.
            </p>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
                <Cpu size={32} className="pulse-live" style={{ margin: '0 auto 12px', color: 'var(--accent-cyan)' }} />
                <p>Running Graph Neural Network Message-Passing...</p>
              </div>
            ) : gnnData?.missing_intelligence_leads?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
                {gnnData.missing_intelligence_leads.map((lead, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(7, 9, 14, 0.65)',
                    border: '1px solid rgba(255, 179, 0, 0.25)',
                    borderRadius: '8px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                          {lead.source_name}
                        </span>
                        <span style={{ color: 'var(--accent-amber)', fontSize: '11px' }}>⟷</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                          {lead.target_name}
                        </span>
                      </div>
                      <span className="badge badge-amber" style={{ fontSize: '10px' }}>
                        {Math.round(lead.link_probability * 100)}% Probability
                      </span>
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                      Inferred Link: {lead.predicted_relationship}
                    </div>

                    <div style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(255, 179, 0, 0.08)', padding: '6px 8px', borderRadius: '4px' }}>
                      <strong>Investigative Recommendation:</strong> {lead.surveillance_recommendation}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                No critical unobserved links detected in current subgraph.
              </div>
            )}
          </div>

          {/* Future Associations Forecast */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <TrendingUp size={20} color="var(--accent-cyan)" />
                <h2 style={{ fontSize: '15px', fontFamily: 'var(--font-tech)', color: '#fff', textTransform: 'uppercase', margin: 0 }}>
                  Future Illicit Associations Forecast
                </h2>
              </div>
              <span className="badge badge-cyan">Temporal Expansion</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
              Forecasts emergent co-offending links and illicit partnerships before they physically manifest based on NCSM structural embeddings.
            </p>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
                <Cpu size={32} className="pulse-live" style={{ margin: '0 auto 12px', color: 'var(--accent-cyan)' }} />
                <p>Computing node cosine embeddings...</p>
              </div>
            ) : gnnData?.future_associations_forecast?.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', overflowY: 'auto' }}>
                {gnnData.future_associations_forecast.map((forecast, idx) => (
                  <div key={idx} style={{
                    background: 'rgba(7, 9, 14, 0.65)',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '8px',
                    padding: '14px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                          {forecast.entity_a}
                        </span>
                        <span style={{ color: 'var(--accent-cyan)', fontSize: '11px' }}>➔</span>
                        <span style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
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
                No emergent illicit associations forecasted.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
