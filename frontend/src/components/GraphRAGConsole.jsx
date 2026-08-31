import React, { useState } from 'react';
import { Send, Search, ShieldCheck, Database, Link as LinkIcon, AlertCircle, FileCheck, CheckCircle2 } from 'lucide-react';

export default function GraphRAGConsole({ currentRole }) {
  const [prompt, setPrompt] = useState('Show all financial intermediaries and Hawala transfers connected to Tariq Al-Hasani under BNS');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const samplePrompts = [
    "Show all financial intermediaries and Hawala transfers connected to Tariq Al-Hasani under BNS",
    "Identify safehouse locations and vehicle convoys active around Ichhapur Defence Estate",
    "Trace communication links and CDR call frequency between Sunil Roy and Raju Mondal",
    "List all statutory FIR charges and Zero-FIR transfers registered in Kolkata/Siliguri corridor",
    "Who are the top gang leaders and kingpin suspects with threat score exceeding 85%?"
  ];

  const handleExecuteQuery = async (queryText = prompt) => {
    if (!queryText.trim()) return;
    setLoading(true);
    try {
      const resp = await fetch('/api/graphrag/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: queryText,
          officer_badge: 'IO-KOLKATA-8842',
          role: currentRole
        })
      });
      const data = await resp.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: '400px 1fr', gap: '20px', height: 'calc(100vh - 128px)' }}>
      {/* Left Column: Natural Language Input & Suggested Case Questions */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Search size={18} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '15px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              Ask Questions About the Case & Gang
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Ask anything in plain language. The system searches all verified case files, call records, and FIRs to provide accurate, court-ready facts.
          </p>
        </div>

        {/* Input Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your question about any suspect, vehicle, phone number, or crime..."
            style={{
              width: '100%',
              background: '#ffffff',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '12px',
              color: 'var(--text-primary)',
              fontSize: '13px',
              resize: 'none',
              outline: 'none',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.02)'
            }}
          />
          <button
            onClick={() => handleExecuteQuery(prompt)}
            disabled={loading}
            className="btn-primary"
            style={{ justifyContent: 'center', padding: '10px', fontSize: '13px', fontWeight: 600 }}
          >
            <Send size={15} />
            <span>{loading ? 'Searching Verified Case Records...' : 'Search Case Intelligence'}</span>
          </button>
        </div>

        {/* Suggested Investigatory Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
          <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 700 }}>
            Common Investigative Questions:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(p);
                handleExecuteQuery(p);
              }}
              style={{
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                borderRadius: '6px',
                padding: '8px 10px',
                textAlign: 'left',
                color: 'var(--text-primary)',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                e.currentTarget.style.background = '#e0f2fe';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--border-subtle)';
                e.currentTarget.style.background = '#f8fafc';
              }}
            >
              "{p}"
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: Case Findings & Evidence Chain */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        {result ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Header Status */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge badge-emerald">
                  <ShieldCheck size={12} />
                  {result.court_admissibility_status || 'Court Admissible (BSA Sec 63)'}
                </span>
                <span className="badge badge-cyan">
                  <Database size={12} />
                  {result.matched_nodes_count} Suspects/Locations • {result.matched_edges_count} Connections Found
                </span>
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                Evidence Hash: <code style={{ color: 'var(--accent-cyan)' }}>{result.audit_hash?.substring(0, 16)}...</code>
              </div>
            </div>

            {/* Investigator Brief */}
            <div>
              <h3 style={{ fontSize: '13px', color: 'var(--accent-cyan)', textTransform: 'uppercase', marginBottom: '6px', fontWeight: 700 }}>
                Investigator Brief & Findings (Verified Facts)
              </h3>
              <div style={{
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '13px',
                lineHeight: '1.6',
                color: 'var(--text-primary)',
                whiteSpace: 'pre-line'
              }}>
                {result.intelligence_brief}
              </div>
            </div>

            {/* Evidence Chain Table */}
            <div>
              <h3 style={{ fontSize: '13px', color: 'var(--accent-violet)', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 700 }}>
                Chain of Evidence & Records (Admissible in Court under BSA 2024)
              </h3>
              <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                <table className="intel-table">
                  <thead>
                    <tr>
                      <th>Person / Entity</th>
                      <th>Connection / Act</th>
                      <th>Linked Person / Target</th>
                      <th>Date / Transaction Amount</th>
                      <th>Digital Stamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.evidence_chain?.map((ev, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ev.source_entity}</td>
                        <td>
                          <span className="badge badge-violet">{ev.relationship}</span>
                        </td>
                        <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{ev.target_entity}</td>
                        <td style={{ fontSize: '11px', fontFamily: 'var(--font-mono)' }}>
                          {ev.timestamp}
                          {ev.evidence_properties?.amount ? ` • ₹${ev.evidence_properties.amount.toLocaleString()}` : ''}
                        </td>
                        <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-cyan)' }}>
                          {ev.bsa_hash?.substring(0, 16)}...
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--text-muted)' }}>
            <FileCheck size={48} style={{ margin: '0 auto 16px', opacity: 0.4, color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: '16px', color: 'var(--text-primary)', marginBottom: '6px', fontWeight: 700 }}>
              Ready to Search Case Records
            </h3>
            <p style={{ fontSize: '13px', maxWidth: '440px', margin: '0 auto', color: 'var(--text-secondary)' }}>
              Type any question or click one of the suggested questions on the left to pull verified police findings.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
