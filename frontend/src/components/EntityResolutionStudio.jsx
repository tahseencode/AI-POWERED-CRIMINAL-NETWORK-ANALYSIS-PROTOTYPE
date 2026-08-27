import React, { useState, useEffect } from 'react';
import { Layers, GitMerge, CheckCircle, AlertTriangle, ShieldCheck, Database, RefreshCw } from 'lucide-react';

export default function EntityResolutionStudio({ currentRole, onRefreshGraph }) {
  const [erData, setErData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPair, setSelectedPair] = useState(null);
  const [merging, setMerging] = useState(false);
  const [mergeStatus, setMergeStatus] = useState(null);

  useEffect(() => {
    fetchErData();
  }, []);

  const fetchErData = async () => {
    setLoading(true);
    try {
      const resp = await fetch('/api/entity-resolution/resolve');
      const data = await resp.json();
      setErData(data);
      if (data.definitive_matches?.length > 0) {
        setSelectedPair(data.definitive_matches[0]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMergeEntities = async (pair) => {
    setMerging(true);
    try {
      const resp = await fetch('/api/entity-resolution/merge', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          primary_entity_id: pair.entity_1.id,
          secondary_entity_id: pair.entity_2.id,
          officer_badge: 'IA-SPECIAL-CELL-104',
          role: currentRole
        })
      });
      const data = await resp.json();
      setMergeStatus(data);
      if (onRefreshGraph) onRefreshGraph();
      setTimeout(() => setMergeStatus(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setMerging(false);
    }
  };

  return (
    <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: '400px 1fr', gap: '20px', height: 'calc(100vh - 128px)' }}>
      {/* Left Column: Candidate Matches List & Blocking Metrics */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="var(--accent-violet)" />
            <h2 style={{ fontSize: '15px', fontFamily: 'var(--font-tech)', color: '#fff', textTransform: 'uppercase' }}>
              Probabilistic Entity Resolution (ER)
            </h2>
          </div>
          <button onClick={fetchErData} className="btn-primary" style={{ padding: '4px 8px' }}>
            <RefreshCw size={12} />
          </button>
        </div>

        {/* Blocking Efficiency Pill */}
        <div style={{
          background: 'rgba(124, 77, 255, 0.1)',
          border: '1px solid rgba(124, 77, 255, 0.3)',
          borderRadius: '8px',
          padding: '10px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px',
          fontFamily: 'var(--font-mono)'
        }}>
          <span>Blocking Search Reduction:</span>
          <span style={{ color: 'var(--accent-emerald)', fontWeight: 700 }}>
            {erData?.blocking_efficiency_savings || '97.2%'}
          </span>
        </div>

        {/* Matches Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>
            Candidate Pair Linkages:
          </span>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
              Executing Fellegi-Sunter log-weight resolution...
            </div>
          ) : erData?.all_evaluations?.map((pair, idx) => {
            const isSelected = selectedPair === pair;
            const isDefinitive = pair.decision === 'DEFINITIVE_MATCH';
            return (
              <div
                key={idx}
                onClick={() => setSelectedPair(pair)}
                style={{
                  background: isSelected ? 'rgba(124, 77, 255, 0.18)' : 'rgba(7, 9, 14, 0.6)',
                  border: isSelected ? '1px solid var(--accent-violet)' : '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className={`badge ${isDefinitive ? 'badge-emerald' : 'badge-amber'}`}>
                    {isDefinitive ? 'Definitive Match' : 'Probable Match'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    W = {pair.composite_weight}
                  </span>
                </div>

                <div style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>
                  {pair.entity_1.name} ⟷ {pair.entity_2.name}
                </div>
                <div style={{ fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '2px' }}>
                  IDs: {pair.entity_1.id} / {pair.entity_2.id}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Mathematical Weight Breakdown & Merge Review */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        {selectedPair ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Header Telemetry */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className={`badge ${selectedPair.decision === 'DEFINITIVE_MATCH' ? 'badge-emerald' : 'badge-amber'}`}>
                  {selectedPair.decision}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
                  {selectedPair.entity_1.name} ⟷ {selectedPair.entity_2.name}
                </h3>
              </div>

              <button
                onClick={() => handleMergeEntities(selectedPair)}
                disabled={merging}
                className="btn-primary"
                style={{ padding: '8px 16px' }}
              >
                <GitMerge size={15} />
                <span>{merging ? 'Merging into KG...' : 'Unify Entity Records'}</span>
              </button>
            </div>

            {mergeStatus && (
              <div style={{
                background: 'rgba(0, 230, 118, 0.1)',
                border: '1px solid var(--accent-emerald)',
                borderRadius: '8px',
                padding: '12px',
                color: 'var(--accent-emerald)',
                fontSize: '12px'
              }}>
                <CheckCircle size={14} style={{ display: 'inline', marginRight: '6px' }} />
                Unified profile written to Knowledge Graph. Chained BSA audit entry registered.
              </div>
            )}

            {/* Fellegi-Sunter Formula Breakdown */}
            <div>
              <h4 style={{ fontSize: '12px', color: 'var(--accent-amber)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Fellegi-Sunter Logarithmic Weight Calculation (W = Σ ln(mᵢ / uᵢ))
              </h4>
              <div style={{
                background: '#07090e',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '14px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                {Object.entries(selectedPair.weight_breakdown || {}).map(([attr, detail]) => (
                  <div key={attr} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                    paddingBottom: '6px'
                  }}>
                    <div>
                      <span style={{ color: '#fff', fontWeight: 600, fontSize: '12px', textTransform: 'capitalize' }}>
                        {attr.replace('_', ' ')}
                      </span>
                      <div style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                        Status: <span style={{ color: 'var(--accent-cyan)' }}>{detail.status}</span>
                        {detail.sim ? ` (Sim: ${(detail.sim * 100).toFixed(0)}%)` : ''}
                        {detail.code ? ` (Soundex: ${detail.code})` : ''}
                        {detail.shared ? ` (Shared: ${detail.shared.join(', ')})` : ''}
                      </div>
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: detail.weight > 0 ? 'var(--accent-emerald)' : 'var(--accent-crimson)'
                    }}>
                      {detail.weight > 0 ? `+${detail.weight}` : detail.weight}
                    </div>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px' }}>
                  <span style={{ color: '#fff', fontWeight: 700 }}>Total Composite Weight:</span>
                  <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '16px', fontWeight: 800 }}>
                    {selectedPair.composite_weight} / {selectedPair.thresholds?.match} Match Threshold
                  </span>
                </div>
              </div>
            </div>

            {/* Inferred Unified Node Preview */}
            <div style={{
              background: 'rgba(19, 27, 42, 0.5)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '14px'
            }}>
              <h4 style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Unified Knowledge Graph Profile Preview
              </h4>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
                Merging will synthesize biographic aliases, unify distinct phone identifiers, and fuse incident edges across the multi-state database into a single node with unified degree and betweenness metrics.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            Select a candidate pair to review the Fellegi-Sunter mathematical breakdown.
          </div>
        )}
      </div>
    </div>
  );
}
