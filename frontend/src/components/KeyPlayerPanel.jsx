import React, { useState, useEffect } from 'react';
import { Target, Zap, ShieldAlert, Activity, CheckCircle, Flame, BarChart2, CornerDownRight } from 'lucide-react';

export default function KeyPlayerPanel({ currentRole }) {
  const [cppTriData, setCppTriData] = useState([]);
  const [kappaEdges, setKappaEdges] = useState([]);
  const [keyPlayers, setKeyPlayers] = useState(null);
  const [qapResult, setQapResult] = useState(null);
  const [selectedTargets, setSelectedTargets] = useState([]);
  const [simulationResult, setSimulationResult] = useState(null);
  const [simulating, setSimulating] = useState(false);

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
      {/* Left Column: CPP TRI Threat Matrix & kappa-path Edge Channels */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* CPP TRI Decision Matrix Card */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Target size={20} color="var(--accent-crimson)" />
              <h2 style={{ fontSize: '15px', fontFamily: 'var(--font-tech)', color: '#fff', textTransform: 'uppercase' }}>
                CPP TRI Multi-Criteria Threat Classification
              </h2>
            </div>
            <span className="badge badge-crimson">Borgatti KPP Engine</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Composition of Probabilistic Preferences synthesizing Degree, Betweenness, Eigenvector, and Energy Disruptive load into ordered threat categories.
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table className="intel-table">
              <thead>
                <tr>
                  <th>Target</th>
                  <th>Suspect Name</th>
                  <th>Betweenness</th>
                  <th>Energy Disruptive</th>
                  <th>CPP Score</th>
                  <th>Threat Tier</th>
                </tr>
              </thead>
              <tbody>
                {cppTriData.map((actor) => {
                  const isSelected = selectedTargets.includes(actor.node_id);
                  return (
                    <tr 
                      key={actor.node_id}
                      onClick={() => toggleTarget(actor.node_id)}
                      style={{ cursor: 'pointer', background: isSelected ? 'rgba(255, 23, 68, 0.12)' : 'transparent' }}
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
                        <div style={{ fontWeight: 600, color: '#fff' }}>{actor.name}</div>
                        <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{actor.role}</div>
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
                          {actor.threat_tier.split(':')[0]}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* kappa-path Edge Centrality Card */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Zap size={18} color="var(--accent-cyan)" />
              <h2 style={{ fontSize: '15px', fontFamily: 'var(--font-tech)', color: '#fff', textTransform: 'uppercase' }}>
                κ-Path Edge Centrality (Critical Channels)
              </h2>
            </div>
            <span className="badge badge-cyan">Random Walk Sim</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Simulates information propagation vectors up to length κ=3 to identify communication channels that paralyze coordination if intercepted.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {kappaEdges.slice(0, 4).map((edge, idx) => (
              <div key={idx} style={{
                background: 'rgba(7, 9, 14, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px 14px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#fff' }}>
                    {edge.source_name} ➔ {edge.target_name}
                  </div>
                  <div style={{ fontSize: '11px', color: 'var(--accent-violet)', fontFamily: 'var(--font-mono)' }}>
                    {edge.edge_type} ({edge.traversal_count} walks traversed)
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                    {(edge.kappa_path_score * 100).toFixed(1)}%
                  </div>
                  <span className="badge badge-amber" style={{ fontSize: '9px' }}>Critical Vector</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Network Disruption Simulator & QAP Statistical Test */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Network Disruption Simulator */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Flame size={20} color="var(--accent-crimson)" />
              <h2 style={{ fontSize: '15px', fontFamily: 'var(--font-tech)', color: '#fff', textTransform: 'uppercase' }}>
                Targeted Disruption Simulator
              </h2>
            </div>
            {simulationResult && (
              <span className="badge badge-crimson">
                {simulationResult.disruption_effectiveness_percent} Toughness Drop
              </span>
            )}
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '14px' }}>
            Measures Principal Connected Component (PCC) collapse and network toughness decay upon neutralizing selected targets.
          </p>

          {simulationResult ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {/* Disruption Progress Bar */}
              <div style={{
                background: 'rgba(7, 9, 14, 0.7)',
                borderRadius: '8px',
                padding: '12px',
                border: '1px solid var(--border-subtle)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', marginBottom: '6px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Principal Connected Component (PCC) Collapse</span>
                  <span style={{ color: 'var(--accent-crimson)', fontWeight: 700, fontFamily: 'var(--font-mono)' }}>
                    {simulationResult.disruption_effectiveness_percent} Fragmented
                  </span>
                </div>
                <div style={{ height: '8px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{
                    width: simulationResult.disruption_effectiveness_percent,
                    height: '100%',
                    background: 'linear-gradient(90deg, #ffb300, #ff1744)',
                    transition: 'width 0.4s ease'
                  }} />
                </div>
              </div>

              {/* Stepwise Decay Timeline */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>
                  Stepwise Neutralization Trajectory:
                </span>
                {simulationResult.decay_trajectory?.map((step, sIdx) => (
                  <div key={sIdx} style={{
                    background: 'rgba(19, 27, 42, 0.5)',
                    border: '1px solid rgba(0, 229, 255, 0.1)',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontSize: '12px'
                  }}>
                    <div>
                      {step.step === 0 ? (
                        <span style={{ color: 'var(--accent-cyan)', fontWeight: 600 }}>Baseline Syndicate Cohesion</span>
                      ) : (
                        <span style={{ color: 'var(--accent-crimson)', fontWeight: 600 }}>
                          Strike #{step.step}: Neutralized {step.removed_node?.name}
                        </span>
                      )}
                      <div style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                        Remaining Nodes: {step.remaining_nodes} • Edges: {step.remaining_edges}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', color: '#fff', fontWeight: 600 }}>
                        PCC Ratio: {(step.pcc_ratio * 100).toFixed(0)}%
                      </div>
                      <div style={{ fontSize: '10px', color: 'var(--accent-amber)' }}>
                        {step.num_isolated_islands} Isolated Cells
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '30px 10px', color: 'var(--text-muted)' }}>
              <p style={{ fontSize: '13px' }}>Select one or more suspects from the CPP TRI table on the left to simulate targeted network disruption.</p>
            </div>
          )}
        </div>

        {/* QAP Permutation Test Card */}
        {qapResult && (
          <div className="glass-panel" style={{ padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <BarChart2 size={18} color="var(--accent-emerald)" />
                <h2 style={{ fontSize: '14px', fontFamily: 'var(--font-tech)', color: '#fff', textTransform: 'uppercase' }}>
                  Quadratic Assignment Procedure (QAP)
                </h2>
              </div>
              <span className={`badge ${qapResult.statistically_significant ? 'badge-emerald' : 'badge-amber'}`}>
                p = {qapResult.empirical_p_value} (Valid)
              </span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '8px' }}>
              Reshuffles node labels {qapResult.permutations_executed} times to establish statistical validity without relying on false independence assumptions.
            </p>
            <div style={{
              background: 'rgba(0, 230, 118, 0.08)',
              border: '1px solid rgba(0, 230, 118, 0.25)',
              borderRadius: '6px',
              padding: '10px',
              fontSize: '12px',
              color: '#f0f4fc'
            }}>
              <strong>Statistical Finding:</strong> {qapResult.interpretation}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
