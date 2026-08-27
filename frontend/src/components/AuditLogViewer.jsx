import React, { useState, useEffect } from 'react';
import { Lock, ShieldCheck, CheckCircle2, AlertTriangle, RefreshCw, Key, Hash } from 'lucide-react';

export default function AuditLogViewer({ currentRole }) {
  const [logs, setLogs] = useState([]);
  const [integrityStatus, setIntegrityStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    fetchLogsAndIntegrity();
  }, []);

  const fetchLogsAndIntegrity = async () => {
    setLoading(true);
    try {
      const [logsRes, integrityRes] = await Promise.all([
        fetch('/api/audit/logs?limit=40').then(r => r.json()),
        fetch('/api/audit/verify').then(r => r.json())
      ]);
      setLogs(logsRes);
      setIntegrityStatus(integrityRes);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReVerify = async () => {
    setVerifying(true);
    try {
      const res = await fetch('/api/audit/verify').then(r => r.json());
      setIntegrityStatus(res);
    } catch (err) {
      console.error(err);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div style={{ padding: '16px 24px', display: 'flex', flexDirection: 'column', gap: '20px', height: 'calc(100vh - 128px)', overflowY: 'auto' }}>
      {/* Top Banner: Statutory Admissibility Card */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '10px',
            background: 'rgba(0, 230, 118, 0.15)',
            border: '1px solid rgba(0, 230, 118, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Lock size={22} color="var(--accent-emerald)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '16px', fontFamily: 'var(--font-tech)', color: '#fff', textTransform: 'uppercase' }}>
                Cryptographic Evidence Custody & Anti-Burking Audit Trail
              </h2>
              <span className="badge badge-emerald">BSA Sec 63 Certified</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
              SHA-256 Hash Chaining • Prevents police burking & unauthorized intelligence surveillance • Court-admissible evidence log.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: 'rgba(7, 9, 14, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)'
          }}>
            <Hash size={14} color="var(--accent-cyan)" />
            <span>Latest Block Hash: <strong style={{ color: 'var(--accent-cyan)' }}>{integrityStatus?.latest_hash?.substring(0, 14)}...</strong></span>
          </div>

          <button
            onClick={handleReVerify}
            disabled={verifying}
            className="btn-primary"
            style={{ padding: '8px 14px', fontSize: '12px' }}
          >
            <ShieldCheck size={14} />
            <span>{verifying ? 'Validating Hash Chain...' : 'Verify Cryptographic Integrity'}</span>
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '13px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>
            Chained Immutable Action Ledger ({logs.length} Blocks Recorded)
          </h3>
          <button onClick={fetchLogsAndIntegrity} className="btn-primary" style={{ padding: '4px 8px' }}>
            <RefreshCw size={12} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
          <table className="intel-table">
            <thead>
              <tr>
                <th>Index</th>
                <th>Timestamp (UTC)</th>
                <th>Officer Badge</th>
                <th>Role</th>
                <th>Action Type</th>
                <th>Query / Target</th>
                <th>Entry Hash (SHA-256)</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log) => (
                <tr key={log.log_index}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, color: 'var(--accent-cyan)' }}>
                    #{log.log_index}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                    {log.timestamp}
                  </td>
                  <td style={{ fontWeight: 600, color: '#fff' }}>
                    {log.officer_badge}
                  </td>
                  <td>
                    <span className="badge badge-cyan" style={{ fontSize: '9px' }}>
                      {log.role}
                    </span>
                  </td>
                  <td style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                    {log.action}
                  </td>
                  <td style={{ color: 'var(--text-primary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.query_or_target}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-emerald)' }}>
                    {log.entry_hash?.substring(0, 16)}...
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
