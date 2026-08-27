import React, { useState } from 'react';
import { Send, Terminal, ShieldCheck, Database, Link as LinkIcon, Cpu, AlertCircle, FileCheck } from 'lucide-react';

export default function GraphRAGConsole({ currentRole }) {
  const [prompt, setPrompt] = useState('Show me all financial intermediaries and Hawala transfers connected to Tariq Al-Hasani under BNS');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const samplePrompts = [
    "Show me all financial intermediaries and Hawala transfers connected to Tariq Al-Hasani under BNS",
    "Identify safehouse locations and vehicle convoys active around Ichhapur Defence Estate",
    "Trace communication links and CDR frequency between Sunil Roy and Raju Mondal",
    "List all statutory FIR charges and Zero-FIR transfers registered in Kolkata/Siliguri corridor",
    "Detect command structure and kingpin nodes with threat score exceeding 85%"
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
    <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: '420px 1fr', gap: '20px', height: 'calc(100vh - 128px)' }}>
      {/* Left Column: Natural Language Input & Preset Templates */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
            <Terminal size={18} color="var(--accent-cyan)" />
            <h2 style={{ fontSize: '15px', fontFamily: 'var(--font-tech)', color: '#fff', textTransform: 'uppercase' }}>
              GraphRAG Natural Language Interrogation
            </h2>
          </div>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
            Translates investigative queries into deterministic Cypher traversals without LLM hallucinations.
          </p>
        </div>

        {/* Input Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <textarea
            rows={4}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your natural language investigative question..."
            style={{
              width: '100%',
              background: 'rgba(7, 9, 14, 0.75)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              padding: '12px',
              color: '#fff',
              fontSize: '13px',
              fontFamily: 'var(--font-sans)',
              resize: 'none',
              outline: 'none'
            }}
          />
          <button
            onClick={() => handleExecuteQuery(prompt)}
            disabled={loading}
            className="btn-primary"
            style={{ justifyContent: 'center', padding: '10px' }}
          >
            <Send size={15} />
            <span>{loading ? 'Traversing Knowledge Graph...' : 'Execute Deterministic Query'}</span>
          </button>
        </div>

        {/* Preset Investigatory Questions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
          <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>
            Suggested Investigative Queries:
          </span>
          {samplePrompts.map((p, idx) => (
            <button
              key={idx}
              onClick={() => {
                setPrompt(p);
                handleExecuteQuery(p);
              }}
              style={{
                background: 'rgba(19, 27, 42, 0.5)',
                border: '1px solid rgba(0, 229, 255, 0.1)',
                borderRadius: '6px',
                padding: '8px 10px',
                textAlign: 'left',
                color: 'var(--text-secondary)',
                fontSize: '12px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.borderColor = 'var(--accent-cyan)';
                e.target.style.color = '#fff';
              }}
              onMouseLeave={(e) => {
                e.target.style.borderColor = 'rgba(0, 229, 255, 0.1)';
                e.target.style.color = 'var(--text-secondary)';
              }}
            >
              "{p}"
            </button>
          ))}
        </div>
      </div>

      {/* Right Column: Deterministic Traversal Results & Evidence Chain */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        {result ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Header Telemetry */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge badge-emerald">
                  <ShieldCheck size={12} />
                  {result.court_admissibility_status}
                </span>
                <span className="badge badge-cyan">
                  <Database size={12} />
                  {result.matched_nodes_count} Entities • {result.matched_edges_count} Edges
                </span>
              </div>
              <div style={{ fontSize: '11px', fontFamily: 'var(--font-mono)', color: 'var(--text-muted)' }}>
                Audit Hash: <code style={{ color: 'var(--accent-cyan)' }}>{result.audit_hash?.substring(0, 16)}...</code>
              </div>
            </div>

            {/* Synthesized Cypher Query */}
            <div>
              <h3 style={{ fontSize: '12px', color: 'var(--accent-amber)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Generated Deterministic Cypher Traversal
              </h3>
              <div style={{
                background: '#07090e',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '10px 14px',
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: '#38bdf8'
              }}>
                {result.synthesized_cypher}
              </div>
            </div>

            {/* Intelligence Brief */}
            <div>
              <h3 style={{ fontSize: '12px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Verified Evidence Narrative (Zero-Hallucination)
              </h3>
              <div style={{
                background: 'rgba(19, 27, 42, 0.7)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '16px',
                fontSize: '13px',
                lineHeight: '1.6',
                color: '#f0f4fc',
                whiteSpace: 'pre-line'
              }}>
                {result.intelligence_brief}
              </div>
            </div>

            {/* Evidence Chain Table */}
            <div>
              <h3 style={{ fontSize: '12px', color: 'var(--accent-violet)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Cryptographic Evidence Chain (BSA Sec 63 Hash Admissibility)
              </h3>
              <div style={{ overflowX: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
                <table className="intel-table">
                  <thead>
                    <tr>
                      <th>Source Entity</th>
                      <th>Relationship</th>
                      <th>Target Entity</th>
                      <th>Timestamp / Details</th>
                      <th>BSA Digital Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.evidence_chain?.map((ev, idx) => (
                      <tr key={idx}>
                        <td style={{ fontWeight: 600, color: '#fff' }}>{ev.source_entity}</td>
                        <td>
                          <span className="badge badge-violet">{ev.relationship}</span>
                        </td>
                        <td style={{ fontWeight: 600, color: '#fff' }}>{ev.target_entity}</td>
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
            <FileCheck size={48} style={{ margin: '0 auto 16px', opacity: 0.4 }} />
            <h3 style={{ fontSize: '16px', color: '#fff', marginBottom: '6px' }}>
              Law-Enforcement Dynamic Interrogation Ready
            </h3>
            <p style={{ fontSize: '13px', maxWidth: '440px', margin: '0 auto' }}>
              Enter an investigative inquiry or click any suggested template to execute deterministic Cypher traversal across the verified knowledge graph.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
