import React, { useState, useEffect } from 'react';
import { Cpu, AlertTriangle, TrendingUp, Sparkles, Shield, Eye, Network } from 'lucide-react';

export default function GNNPredictor({ currentRole }) {
  const [gnnData, setGnnData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGnnData();
  }, []);

  const fetchGnnData = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/gnn/predict');
      const data = await resp.json();
      setGnnData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', height: 'calc(100vh - 128px)', overflowY: 'auto' }}>
      {/* Left Column: Missing Intelligence Leads */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <AlertTriangle size={20} color="var(--accent-amber)" />
            <h2 style={{ fontSize: '15px', fontFamily: 'var(--font-tech)', color: '#fff', textTransform: 'uppercase' }}>
              Missing Intelligence Leads (Unobserved Links)
            </h2>
          </div>
          <span className="badge badge-amber">PyG GAT Inference</span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
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
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{lead.source_name}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>➔</span>
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#fff' }}>{lead.target_name}</span>
                  </div>
                  <span className="badge badge-amber" style={{ fontFamily: 'var(--font-mono)' }}>
                    {(lead.link_probability * 100).toFixed(1)}% Prob
                  </span>
                </div>

                <div style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>
                  Inferred Relationship: {lead.predicted_relationship}
                </div>

                <div style={{
                  background: 'rgba(19, 27, 42, 0.6)',
                  borderRadius: '6px',
                  padding: '8px 10px',
                  fontSize: '11px',
                  color: 'var(--text-secondary)',
                  borderLeft: '3px solid var(--accent-amber)'
                }}>
                  <strong>Operational Recommendation:</strong> {lead.surveillance_recommendation}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
            No unobserved critical leads detected in the current subgraph.
          </div>
        )}
      </div>

      {/* Right Column: Future Association Forecast & Model Telemetry */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {/* Model Specs Card */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Cpu size={18} color="var(--accent-cyan)" />
              <h2 style={{ fontSize: '15px', fontFamily: 'var(--font-tech)', color: '#fff', textTransform: 'uppercase' }}>
                GNN Architecture & Quantization Telemetry
              </h2>
            </div>
            <span className="badge badge-cyan">8GB RAM Target</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <div style={{ background: 'rgba(7, 9, 14, 0.5)', padding: '10px', borderRadius: '6px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Framework</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-cyan)' }}>PyTorch Geometric (PyG)</div>
            </div>
            <div style={{ background: 'rgba(7, 9, 14, 0.5)', padding: '10px', borderRadius: '6px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Embedding Dimension</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-amber)' }}>{gnnData?.embedding_dimension || 64}-Dim Latent Space</div>
            </div>
            <div style={{ background: 'rgba(7, 9, 14, 0.5)', padding: '10px', borderRadius: '6px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Message Passing</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-emerald)' }}>GraphSAGE + Multi-Head GAT</div>
            </div>
            <div style={{ background: 'rgba(7, 9, 14, 0.5)', padding: '10px', borderRadius: '6px' }}>
              <div style={{ fontSize: '10px', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Link Prediction Layer</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accent-violet)' }}>NCSM Parameterised</div>
            </div>
          </div>
        </div>

        {/* Future Associations Forecast Card */}
        <div className="glass-panel" style={{ padding: '20px', flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <TrendingUp size={18} color="var(--accent-emerald)" />
              <h2 style={{ fontSize: '15px', fontFamily: 'var(--font-tech)', color: '#fff', textTransform: 'uppercase' }}>
                Future Criminal Association Forecast
              </h2>
            </div>
            <span className="badge badge-emerald">Anticipatory Analysis</span>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginBottom: '12px' }}>
            Topological evolution prediction forecasting which distinct subgroups or suspects are statistically most likely to collaborate in future illicit schemes.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {gnnData?.future_associations_forecast?.map((fc, idx) => (
              <div key={idx} style={{
                background: 'rgba(7, 9, 14, 0.5)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, color: '#fff', fontSize: '13px' }}>
                    {fc.entity_a} ⟷ {fc.entity_b}
                  </span>
                  <span style={{ color: 'var(--accent-emerald)', fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '12px' }}>
                    {(fc.projected_collaboration_risk * 100).toFixed(0)}% Risk
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>
                  {fc.potential_modus_operandi}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
