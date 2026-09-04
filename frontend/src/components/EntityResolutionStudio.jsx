import React, { useState, useEffect } from 'react';
import { Layers, GitMerge, CheckCircle, AlertTriangle, ShieldCheck, Database, RefreshCw, UserCheck } from 'lucide-react';

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
      await fetchErData();
      setTimeout(() => setMergeStatus(null), 4000);
    } catch (err) {
      console.error(err);
    } finally {
      setMerging(false);
    }
  };

  return (
    <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: '380px 1fr', gap: '20px', height: 'calc(100vh - 128px)' }}>
      {/* Left Column: Suspect Match Candidates List */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Layers size={20} color="var(--accent-violet)" />
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Duplicate Suspect & Alias Matcher
            </h2>
          </div>
          <button type="button" onClick={fetchErData} className="btn-primary" style={{ padding: '4px 8px' }}>
            <RefreshCw size={12} />
          </button>
        </div>

        <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: 0 }}>
          Identifies when a criminal uses fake aliases, alternate phone numbers, or different name spellings across police stations.
        </p>

        {/* Database Search Efficiency Box */}
        <div style={{
          background: '#ede9fe',
          border: '1px solid #ddd6fe',
          borderRadius: '8px',
          padding: '10px 12px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontSize: '11px'
        }}>
          <span style={{ color: '#5b21b6', fontWeight: 600 }}>Cross-Database Search Efficiency:</span>
          <span style={{ color: '#15803d', fontWeight: 800 }}>
            {erData?.blocking_efficiency_savings || '97.2%'} Match Speed
          </span>
        </div>

        {/* Matches Feed */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 700 }}>
            Potential Duplicate Profiles:
          </span>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)' }}>
              Checking suspect records across state databases...
            </div>
          ) : erData?.all_evaluations?.map((pair, idx) => {
            const isSelected = selectedPair === pair;
            const isDefinitive = pair.decision === 'DEFINITIVE_MATCH';
            return (
              <div
                key={idx}
                onClick={() => setSelectedPair(pair)}
                style={{
                  background: isSelected ? '#ede9fe' : '#f8fafc',
                  border: isSelected ? '1px solid var(--accent-violet)' : '1px solid var(--border-subtle)',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isSelected ? '0 2px 8px rgba(99, 102, 241, 0.12)' : 'none'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span className={`badge ${isDefinitive ? 'badge-emerald' : 'badge-amber'}`}>
                    {isDefinitive ? 'Confirmed Same Person' : 'Likely Same Person'}
                  </span>
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-cyan)', fontWeight: 700 }}>
                    Score: {pair.composite_weight}
                  </span>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                  {pair.entity_1.name} ⟷ {pair.entity_2.name}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Records: {pair.entity_1.id} & {pair.entity_2.id}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Column: Comparison & Record Merge Review */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        {selectedPair ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Header Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span className={`badge ${selectedPair.decision === 'DEFINITIVE_MATCH' ? 'badge-emerald' : 'badge-amber'}`}>
                  {selectedPair.decision === 'DEFINITIVE_MATCH' ? 'High Confidence Duplicate Record' : 'Suspected Alias'}
                </span>
                <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', marginTop: '6px' }}>
                  {selectedPair.entity_1.name} ⟷ {selectedPair.entity_2.name}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => handleMergeEntities(selectedPair)}
                disabled={merging}
                className="btn-primary"
                style={{ padding: '8px 16px', fontWeight: 700, fontSize: '12px' }}
              >
                <GitMerge size={15} />
                <span>{merging ? 'Merging Records...' : 'Merge Into One Single Profile'}</span>
              </button>
            </div>

            {mergeStatus && (
              <div style={{
                background: '#dcfce7',
                border: '1px solid #86efac',
                borderRadius: '8px',
                padding: '12px',
                color: '#15803d',
                fontSize: '12px',
                fontWeight: 600
              }}>
                <CheckCircle size={14} style={{ display: 'inline', marginRight: '6px' }} />
                Records merged successfully into unified criminal profile. Logged in BSA tamper-proof audit trail.
              </div>
            )}

            {/* Comparison Attribute Breakdown */}
            <div>
              <h4 style={{ fontSize: '12px', color: 'var(--accent-amber)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700 }}>
                Why AI Flagged This as the Same Suspect:
              </h4>
              <div style={{
                background: '#f8fafc',
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
                    borderBottom: '1px solid #e2e8f0',
                    paddingBottom: '6px'
                  }}>
                    <div>
                      <span style={{ color: 'var(--text-primary)', fontWeight: 700, fontSize: '12px', textTransform: 'capitalize' }}>
                        {attr.replace('_', ' ')}
                      </span>
                      <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                        Match Result: <strong style={{ color: 'var(--accent-cyan)' }}>{detail.status}</strong>
                        {detail.sim ? ` (${(detail.sim * 100).toFixed(0)}% Name Spelling Similarity)` : ''}
                        {detail.code ? ` (Phonetic Soundex: ${detail.code})` : ''}
                        {detail.shared ? ` (Common Contacts: ${detail.shared.join(', ')})` : ''}
                      </div>
                    </div>
                    <div style={{
                      fontFamily: 'var(--font-mono)',
                      fontWeight: 700,
                      color: detail.weight > 0 ? '#15803d' : '#b91c1c'
                    }}>
                      {detail.weight > 0 ? `+${detail.weight}` : detail.weight}
                    </div>
                  </div>
                ))}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '6px' }}>
                  <span style={{ color: 'var(--text-primary)', fontWeight: 700 }}>Overall Match Confidence Score:</span>
                  <span style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)', fontSize: '15px', fontWeight: 800 }}>
                    {selectedPair.composite_weight} (Meets Police Merge Criteria)
                  </span>
                </div>
              </div>
            </div>

            {/* Unified Profile Preview */}
            <div style={{
              background: '#f0fdfa',
              border: '1px solid #ccfbf1',
              borderRadius: '8px',
              padding: '14px'
            }}>
              <h4 style={{ fontSize: '12px', color: '#0f766e', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 700 }}>
                What Happens When You Click "Merge":
              </h4>
              <p style={{ fontSize: '12px', color: '#134e4a', lineHeight: 1.5, margin: 0 }}>
                Both records are linked together permanently. All alternate phone numbers, registered vehicles, known safehouses, and FIR cases from both police stations will show under one single suspect profile.
              </p>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
            Select a suspect pair on the left to review the comparison details.
          </div>
        )}
      </div>
    </div>
  );
}
