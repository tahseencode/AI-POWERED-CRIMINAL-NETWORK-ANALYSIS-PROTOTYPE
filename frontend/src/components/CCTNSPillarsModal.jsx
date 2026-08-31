import React from 'react';
import { X, Database, Shield, FileCheck, Scale, Lock, Activity } from 'lucide-react';

export default function CCTNSPillarsModal({ isOpen, onClose, pillarsData }) {
  if (!isOpen) return null;

  const pillars = [
    {
      id: 'police',
      name: 'Pillar 1: Police (CCTNS)',
      desc: '15,000+ Synchronized Police Stations across India',
      status: 'ONLINE • LIVE SYNC',
      color: 'var(--accent-cyan)',
      detail: 'Real-time FIR, Zero-FIR, GD Entry, and Offender Index records'
    },
    {
      id: 'courts',
      name: 'Pillar 2: Courts (e-Courts)',
      desc: 'Judicial Case Management & Warrant Tracker',
      status: 'CONNECTED',
      color: 'var(--accent-amber)',
      detail: 'Automated charge-sheet filing, bail records, and trial status under BNSS Sec 173'
    },
    {
      id: 'prisons',
      name: 'Pillar 3: Jails (e-Prisons)',
      desc: 'National Inmate Custody & Parole Tracking',
      status: 'SYNCHRONIZED',
      color: 'var(--accent-crimson)',
      detail: 'Biometric prisoner profile linking and co-inmate association index'
    },
    {
      id: 'forensics',
      name: 'Pillar 4: Forensic Labs (e-Forensic)',
      desc: 'Digital & Physical Forensic Evidence Registry',
      status: 'AUTHENTICATED',
      color: 'var(--accent-violet)',
      detail: 'Ballistics matching, mobile dump analysis, and cyber trace verification'
    },
    {
      id: 'prosecution',
      name: 'Pillar 5: Prosecution (e-Prosecution)',
      desc: 'Digital Evidence Chain & Legal Advisory',
      status: 'ACTIVE',
      color: 'var(--accent-emerald)',
      detail: 'BSA 2024 Section 63 electronic certification for courtroom presentation'
    }
  ];

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(15, 23, 42, 0.6)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '780px', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', border: '1px solid var(--accent-cyan)', background: '#ffffff', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Database size={22} color="var(--accent-cyan)" />
            <div>
              <h2 style={{ fontSize: '16px', fontFamily: 'var(--font-tech)', color: 'var(--text-primary)', textTransform: 'uppercase' }}>
                Inter-Operable Criminal Justice System (ICJS) & CCTNS
              </h2>
              <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                "One Data Once Entry" Five-Pillar Interoperability Architecture
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* 5 Pillars Grid */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {pillars.map((p) => (
            <div
              key={p.id}
              style={{
                background: '#f8fafc',
                border: '1px solid var(--border-subtle)',
                borderRadius: '8px',
                padding: '12px 16px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '13px', fontWeight: 700, color: p.color }}>
                    {p.name}
                  </span>
                  <span className="badge badge-emerald" style={{ fontSize: '9px' }}>
                    {p.status}
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {p.desc} • <span style={{ color: 'var(--text-muted)' }}>{p.detail}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button onClick={onClose} className="btn-primary">
            Close Enclave View
          </button>
        </div>
      </div>
    </div>
  );
}
