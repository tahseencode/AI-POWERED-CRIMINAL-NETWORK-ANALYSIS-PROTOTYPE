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
            background: '#dcfce7',
            border: '1px solid #86efac',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Lock size={22} color="var(--accent-emerald)" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                Official Case Audit Trail & Tamper-Proof Evidence Log
              </h2>
              <span className="badge badge-emerald">BSA Sec 63 Certified</span>
            </div>
            <p style={{ fontSize: '12px', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
              Records every search, suspect addition, and report generation to ensure tamper-proof electronic evidence in court under Bharatiya Sakshya Adhiniyam (BSA 2024).
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{
            background: '#f8fafc',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '8px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px'
          }}>
            <Hash size={14} color="var(--accent-cyan)" />
            <span style={{ color: 'var(--text-secondary)' }}>Latest Digital Stamp: <strong style={{ color: 'var(--accent-cyan)', fontFamily: 'var(--font-mono)' }}>{integrityStatus?.latest_hash?.substring(0, 14)}...</strong></span>
          </div>

          <button
            type="button"
            onClick={handleReVerify}
            disabled={verifying}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '12px', fontWeight: 600 }}
          >
            <ShieldCheck size={14} />
            <span>{verifying ? 'Validating Evidence Stamps...' : 'Verify Evidence Integrity'}</span>
          </button>
        </div>
      </div>

      {/* Audit Log Table */}
      <div className="glass-panel" style={{ padding: '20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '13px', color: 'var(--accent-cyan)', textTransform: 'uppercase', fontWeight: 700, margin: 0 }}>
            Official Action & Search Ledger ({logs.length} Actions Logged)
          </h3>
          <button type="button" onClick={fetchLogsAndIntegrity} className="btn-primary" style={{ padding: '4px 8px' }}>
            <RefreshCw size={12} />
          </button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', border: '1px solid var(--border-subtle)', borderRadius: '8px' }}>
          <table className="intel-table">
            <thead>
              <tr>
                <th>Entry #</th>
                <th>Date & Time</th>
                <th>Officer Badge</th>
                <th>Officer Role</th>
                <th>Action Taken</th>
                <th>Query / Target Suspect</th>
                <th>Tamper-Proof Stamp</th>
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
                  <td style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                    {log.officer_badge}
                  </td>
                  <td>
                    <span className="badge badge-cyan" style={{ fontSize: '9px' }}>
                      {log.role}
                    </span>
                  </td>
                  <td style={{ color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 600 }}>
                    {log.action}
                  </td>
                  <td style={{ color: 'var(--text-primary)', maxWidth: '280px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.query_or_target}
                  </td>
                  <td style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--accent-emerald)', fontWeight: 600 }}>
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
