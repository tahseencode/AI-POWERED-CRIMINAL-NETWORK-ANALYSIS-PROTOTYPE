import React from 'react';
import { Shield, ShieldAlert, Cpu, Database, UserCheck, Lock, RefreshCw, UserPlus } from 'lucide-react';

export default function Header({ 
  currentRole, 
  onRoleChange, 
  systemStatus, 
  onRefresh, 
  onOpenCctnsModal,
  onOpenAddSuspectModal,
  activeTab,
  onTabChange
}) {
  const roles = [
    "Investigating Officer (IO)",
    "Intelligence Analyst (IA)",
    "Station House Officer (SHO)",
    "Forensic Magistrate (FM)",
    "System Administrator (Admin)"
  ];

  const tabs = [
    { id: 'graph', label: 'Knowledge Graph', icon: 'Network' },
    { id: 'graphrag', label: 'GraphRAG Interrogation', icon: 'MessageSquare' },
    { id: 'keyplayer', label: 'Key Players & Disruption', icon: 'Target' },
    { id: 'gnn', label: 'GNN Link Predictor', icon: 'Cpu' },
    { id: 'spatiotemporal', label: 'Spatio-Temporal & GIS', icon: 'MapPin' },
    { id: 'entityres', label: 'Entity Resolution (ER)', icon: 'Layers' },
    { id: 'ingest', label: 'Multimodal Ingestion', icon: 'FileText' },
    { id: 'audit', label: 'BSA Cryptographic Audit', icon: 'Lock' }
  ];

  return (
    <header style={{
      background: 'rgba(13, 18, 29, 0.92)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(0, 229, 255, 0.2)',
      position: 'sticky',
      top: 0,
      zIndex: 100,
      padding: '12px 24px'
    }}>
      {/* Top Banner */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        marginBottom: '12px'
      }}>
        {/* Title and Identification */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #00e5ff 0%, #7c4dff 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 16px rgba(0, 229, 255, 0.4)'
          }}>
            <Shield size={24} color="#07090e" strokeWidth={2.5} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <h1 style={{
                fontFamily: 'var(--font-display)',
                fontSize: '18px',
                fontWeight: 800,
                letterSpacing: '0.5px',
                color: '#ffffff'
              }}>
                AI-POWERED CRIMINAL NETWORK ANALYSIS
              </h1>
              <span className="badge badge-cyan">SIH26189</span>
              <span className="badge badge-violet">TEAM BitWiser</span>
            </div>
            <p style={{
              fontSize: '11px',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-tech)'
            }}>
              Explainable Decision-Support Layer • Bharatiya Sakshya Adhiniyam (BSA) / BNS 2024 Framework
            </p>
          </div>
        </div>

        {/* Security, Enclave & RBAC Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Add Suspect Trigger */}
          <button 
            onClick={onOpenAddSuspectModal}
            className="btn-primary"
            style={{
              fontSize: '12px',
              padding: '7px 14px',
              background: 'linear-gradient(135deg, rgba(0, 229, 255, 0.2) 0%, rgba(124, 77, 255, 0.3) 100%)',
              border: '1px solid var(--accent-cyan)',
              color: '#fff',
              boxShadow: '0 0 12px rgba(0, 229, 255, 0.3)'
            }}
            title="Ingest New Suspect & Detailed Crime Dossier"
          >
            <UserPlus size={15} color="var(--accent-cyan)" />
            <span style={{ fontWeight: 700 }}>+ Add Suspect</span>
          </button>

          {/* CCTNS Status Trigger */}
          <button 
            onClick={onOpenCctnsModal}
            className="btn-primary"
            style={{ fontSize: '11px', padding: '6px 12px' }}
            title="Inspect CCTNS & ICJS 5-Pillars Sync"
          >
            <Database size={14} />
            <span>ICJS 5-Pillars</span>
          </button>

          {/* Enclave Status Badge */}
          <div style={{
            background: 'rgba(0, 230, 118, 0.1)',
            border: '1px solid rgba(0, 230, 118, 0.3)',
            borderRadius: '8px',
            padding: '6px 12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '11px',
            fontFamily: 'var(--font-mono)'
          }}>
            <span style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: '#00e676',
              boxShadow: '0 0 8px #00e676'
            }} className="pulse-live"></span>
            <span style={{ color: '#00e676', fontWeight: 600 }}>Ichhapur Enclave (8GB CPU Target)</span>
          </div>

          {/* RBAC Role Selector */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(19, 27, 42, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '4px 8px'
          }}>
            <UserCheck size={14} color="var(--accent-amber)" />
            <select
              value={currentRole}
              onChange={(e) => onRoleChange(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--text-primary)',
                fontFamily: 'var(--font-tech)',
                fontSize: '12px',
                cursor: 'pointer',
                outline: 'none'
              }}
            >
              {roles.map(r => (
                <option key={r} value={r} style={{ background: '#0d121d', color: '#f0f4fc' }}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          {/* Refresh Action */}
          <button
            onClick={onRefresh}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-subtle)',
              borderRadius: '8px',
              color: 'var(--text-secondary)',
              padding: '6px 10px',
              cursor: 'pointer'
            }}
            title="Refresh Knowledge Graph & Analytics"
          >
            <RefreshCw size={14} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs Bar */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        overflowX: 'auto',
        paddingTop: '6px'
      }}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              style={{
                background: isActive 
                  ? 'linear-gradient(135deg, rgba(0, 229, 255, 0.22) 0%, rgba(124, 77, 255, 0.15) 100%)'
                  : 'rgba(19, 27, 42, 0.4)',
                border: isActive ? '1px solid var(--accent-cyan)' : '1px solid rgba(255, 255, 255, 0.06)',
                color: isActive ? 'var(--accent-cyan)' : 'var(--text-secondary)',
                padding: '7px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: isActive ? 600 : 500,
                fontFamily: 'var(--font-tech)',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                transition: 'all 0.18s ease',
                boxShadow: isActive ? '0 0 12px rgba(0, 229, 255, 0.25)' : 'none'
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </header>
  );
}
