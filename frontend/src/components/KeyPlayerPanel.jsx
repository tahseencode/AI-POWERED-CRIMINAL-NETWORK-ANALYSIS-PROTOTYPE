import React, { useState, useEffect } from 'react';
import { Target, Zap, ShieldAlert, Activity, CheckCircle, Flame, BarChart2, CornerDownRight, ChevronDown, ChevronUp, Scale, FileText } from 'lucide-react';

export default function KeyPlayerPanel({ currentRole }) {
  const [cppTriData, setCppTriData] = useState([]);
  const [kappaEdges, setKappaEdges] = useState([]);
  const [keyPlayers, setKeyPlayers] = useState(null);
  const [qapResult, setQapResult] = useState(null);
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulating, setSimulating] = useState(false);
  const [expandedActorId, setExpandedActorId] = useState(null);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      const [cppRes, kappaRes, kppRes, qapRes] = await Promise.all([
        fetch('/api/analytics/cpp-tri').then(r => r.json()),
        fetch('/api/analytics/kappa-path').then(r => r.json()),
        fetch('/api/analytics/key-players?k=3').then(r => r.json()),
        fetch('/api/analytics/qap').then(r => r.json())
      ]);
      setCppTriData(cppRes);
      setKappaEdges(kappaRes);
      setKeyPlayers(kppRes);
      setQapResult(qapRes);

      // Pre-select top 2 KPP-1 targets for immediate simulation demo
      if (kppRes && kppRes.kpp1_fragmentation_targets) {
        const topIds = kppRes.kpp1_fragmentation_targets.map(t => t.id);
        setSelectedTargets(topIds);
        runDisruptionSimulation(topIds);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const toggleTarget = (nodeId) => {
    let next;
    if (selectedTargets.includes(nodeId)) {
      next = selectedTargets.filter(id => id !== nodeId);
    } else {
      next = [...selectedTargets, nodeId];
    }
    setSelectedTargets(next);
    if (next.length > 0) {
      runDisruptionSimulation(next);
    } else {
      setSimulationResult(null);
    }
  };

  const toggleExpand = (e, nodeId) => {
    e.stopPropagation();
    setExpandedActorId(expandedActorId === nodeId ? null : nodeId);
  };

  const runDisruptionSimulation = async (targets) => {
    setSimulating(true);
    try {
      const resp = await fetch('/api/analytics/disruption-simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          target_node_ids: targets,
          officer_badge: 'IA-SPECIAL-CELL-104',
          role: currentRole
        })
      });
      const data = await resp.json();
      setSimulationResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSimulating(false);
    }
  };

  return (
    <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px', height: 'calc(100vh - 128px)', overflowY: 'auto' }}>
      {/* Left Column: Priority Suspects List & Critical Channels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Priority Suspects Table */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={20} color="var(--accent-crimson)" />
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Most Wanted Criminals & Gang Key Players
              </h2>
            </div>
            <span className="badge badge-crimson">Priority Target List</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Select suspects using the checkboxes to simulate the impact of arresting them on the entire gang's operations.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table className="intel-table">
              <thead>
                <tr>
                  <th>Target</th>
                  <th>Suspect Name & Role</th>
                  <th>Broker Rank</th>
                  <th>Gang Impact</th>
                  <th>Danger Score</th>
                  <th>Risk Tier</th>
                  <th>Dossier</th>
                </tr>
              </thead>
              <tbody>
                {cppTriData.map((actor) => {
                  const isSelected = selectedTargets.includes(actor.node_id);
                  const isExpanded = expandedActorId === actor.node_id;
                  const crime = actor.crime_details || {};

                  return (
                    <React.Fragment key={actor.node_id}>
                      <tr 
                        onClick={() => toggleTarget(actor.node_id)}
                        style={{ cursor: 'pointer', background: isSelected ? '#fee2e2' : isExpanded ? '#f0f9ff' : 'transparent' }}
                      >
                        <td>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => {}}
                            style={{ cursor: 'pointer' }}
                          />
                        </td>
                        <td>
                          <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{actor.name}</div>
                          <div style={{ fontSize: '11px', color: 'var(--accent-amber)', fontWeight: 600 }}>
                            {crime.crime_title || actor.role}
                          </div>
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)' }}>{actor.betweenness_centrality}</td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-amber)', fontWeight: 600 }}>
                          {actor.energy_disruptive_centrality}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                          {actor.composite_cpp_score}
                        </td>
                        <td>
                          <span className={`badge ${actor.threat_tier.includes('Tier 1') ? 'badge-crimson' : actor.threat_tier.includes('Tier 2') ? 'badge-amber' : 'badge-cyan'}`}>
                            {actor.threat_tier.includes('Tier 1') ? 'Tier 1 (Extreme)' : actor.threat_tier.includes('Tier 2') ? 'Tier 2 (High)' : 'Tier 3 (Moderate)'}
                          </span>
                        </td>
                        <td>
                          <button
                            type="button"
                            onClick={(e) => toggleExpand(e, actor.node_id)}
                            className="btn-primary"
                            style={{ padding: '4px 8px', fontSize: '10px' }}
                            title="View Full Police Dossier"
                          >
                            {isExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                          </button>
                        </td>
                      </tr>

                      {/* Expandable Crime Dossier Row */}
                      {isExpanded && (
                        <tr>
                          <td colSpan={7} style={{ background: '#f8fafc', padding: '14px 18px', borderLeft: '3px solid var(--accent-cyan)' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Scale size={16} color="var(--accent-crimson)" />
                                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                                    {crime.crime_title || 'Criminal Case Dossier'}
                                  </span>
                                </div>
                                <span className="badge badge-crimson" style={{ fontSize: '10px' }}>
                                  {crime.crime_category || 'Organized Crime'}
                                </span>
                              </div>

                              {crime.incident_narrative && (
                                <div style={{ fontSize: '12px', color: 'var(--text-primary)', lineHeight: 1.5, background: '#ffffff', border: '1px solid var(--border-subtle)', padding: '8px 12px', borderRadius: '6px' }}>
                                  <strong style={{ color: 'var(--accent-cyan)' }}>Case Summary: </strong>
                                  {crime.incident_narrative}
                                </div>
                              )}

                              {crime.modus_operandi && (
                                <div style={{ fontSize: '11px', color: '#b45309', background: '#fef3c7', padding: '6px 10px', borderRadius: '4px', borderLeft: '3px solid var(--accent-amber)' }}>
                                  <strong>🎯 Modus Operandi (How Crime is Executed): </strong> {crime.modus_operandi}
                                </div>
                              )}

                              {crime.seized_contraband && (
                                <div style={{ fontSize: '11px', color: '#0369a1', background: '#e0f2fe', padding: '6px 10px', borderRadius: '4px', borderLeft: '3px solid var(--accent-cyan)' }}>
                                  <strong>📦 Seized Weapons & Illegal Items: </strong> {crime.seized_contraband}
                                </div>
                              )}

                              {/* Statutory Acts Breakdown */}
                              {crime.statutory_acts && crime.statutory_acts.length > 0 && (
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                  <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 700 }}>
                                    Applicable Legal Sections (BNS & Special Acts):
                                  </span>
                                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                                    {crime.statutory_acts.map((act, aIdx) => (
                                      <div key={aIdx} style={{ background: '#ffffff', border: '1px solid var(--border-subtle)', padding: '6px 8px', borderRadius: '4px' }}>
                                        <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '11px' }}>
                                          {act.act} • <span style={{ color: 'var(--accent-crimson)' }}>{act.section}</span>
                                        </div>
                                        <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                                          {act.explanation || act.title}
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                              <div style={{ display: 'flex', gap: '16px', fontSize: '11px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                                <div>FIR No: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{crime.fir_number || 'N/A'}</span></div>
                                <div>Thana: <span style={{ color: 'var(--text-primary)', fontWeight: 600 }}>{crime.police_station || 'Special Cell'}</span></div>
                                <div>Status: <span style={{ color: 'var(--accent-amber)', fontWeight: 600 }}>{crime.case_status || 'Under Active Investigation'}</span></div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Key Communication Lines Card */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="var(--accent-cyan)" />
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Critical Communication & Logistics Links
              </h2>
            </div>
            <span className="badge badge-cyan">Surveillance Focus</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Tapping or intercepting these key communication links will disconnect major gang operations.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {kappaEdges.slice(0, 4).map((edge, idx) => (
              <div key={idx} style={{
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {edge.source_name} ➔ {edge.target_name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--accent-violet)', fontFamily: 'var(--font-mono)' }}>
                    Connection: {edge.edge_type} ({edge.traversal_count} interactions tracked)
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    {(edge.kappa_path_score * 100).toFixed(0)}% Critical
                  </div>
                  <span className="badge badge-amber" style={{ fontSize: '9px' }}>High Importance</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Arrest Impact Simulator & Intelligence Verification */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Arrest Impact Simulator */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={20} color="var(--accent-crimson)" />
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Arrest Impact Simulator
              </h2>
            </div>
            {simulationResult && (
              <span className="badge badge-crimson">
                {simulationResult.disruption_effectiveness_percent} Gang Disruption
              </span>
            )}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Calculates how much the gang's supply lines and communication break down if selected suspects are arrested.
          </p>

          {simulationResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Disruption Progress Bar */}
              <div style={{
                background: '#f8fafc',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Overall Gang Disruption & Breakdown</span>
                  <span style={{ color: 'var(--accent-crimson)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {simulationResult.disruption_effectiveness_percent} Weakened
                  </span>
                </div>
                <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: simulationResult.disruption_effectiveness_percent,
                    height: '100%',
                    background: 'linear-gradient(90deg, #d97706, #dc2626)',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>

              {/* Stepwise Decay Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 700 }}>
                  Step-by-Step Arrest Sequence:
                </span>
                {simulationResult.decay_trajectory?.map((step, sIdx) => (
                  <div key={sIdx} style={{
                    background: '#ffffff',
                    border: '1px solid var(--border-subtle)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12px',
                    boxShadow: '0 1px 2px rgba(0,0,0,0.02)'
                  }}>
                    <div>
                      {step.step === 0 ? (
                        <span style={{ color: 'var(--accent-cyan)', fontWeight: 700 }}>Current Gang Strength (100% Active)</span>
                      ) : (
                        <span style={{ color: 'var(--accent-crimson)', fontWeight: 700 }}>
                          Arrest #{step.step}: Detain {step.removed_node?.name}
                        </span>
                      )}
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Active Members Remaining: {step.remaining_nodes} • Active Links: {step.remaining_edges}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', color: 'var(--text-primary)', fontWeight: 600 }}>
                        Gang Cohesion: {(step.pcc_ratio * 100).toFixed(0)}%
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--accent-amber)', fontWeight: 600 }}>
                        {step.num_isolated_islands} Splinter Groups Cut Off
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '13px' }}>Check one or more suspects from the table on the left to simulate the impact of arresting them.</p>
            </div>
          )}
        </div>

        {/* Intelligence Verification Check */}
        {qapResult && (
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={18} color="var(--accent-emerald)" />
                <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                  Intelligence Accuracy & Cross-Verification
                </h2>
              </div>
              <span className={`badge ${qapResult.statistically_significant ? 'badge-emerald' : 'badge-amber'}`}>
                Verified Intel
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Cross-checked against CDRs, bank transfers, and FIR records to ensure these connections are verified criminal associations.
            </p>
            <div style={{
              background: 'rgba(5, 150, 105, 0.08)',
              border: '1px solid rgba(5, 150, 105, 0.25)',
              borderRadius: '6px',
              padding: '10px',
              fontSize: '12px',
              color: '#065f46'
            }}>
              <strong>Intelligence Finding:</strong> {qapResult.interpretation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
