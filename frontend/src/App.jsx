import React, { useState, useEffect } from 'react';
import LoginPortal from './components/LoginPortal.jsx';
import Header from './components/Header.jsx';
import DashboardHome from './components/DashboardHome.jsx';
import GraphRAGConsole from './components/GraphRAGConsole.jsx';
import KeyPlayerPanel from './components/KeyPlayerPanel.jsx';
import GNNPredictor from './components/GNNPredictor.jsx';
import SpatioTemporalMap from './components/SpatioTemporalMap.jsx';
import EntityResolutionStudio from './components/EntityResolutionStudio.jsx';
import DataIngestionStudio from './components/DataIngestionStudio.jsx';
import AuditLogViewer from './components/AuditLogViewer.jsx';
import CCTNSPillarsModal from './components/CCTNSPillarsModal.jsx';
import AddSuspectModal from './components/AddSuspectModal.jsx';

export default function App() {
  // Authentication State (Null = Show Login Portal)
  const [officerUser, setOfficerUser] = useState(() => {
    try {
      const saved = localStorage.getItem('portal_officer_session');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState('Investigating Officer (IO)');
  const [systemStatus, setSystemStatus] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isCctnsModalOpen, setIsCctnsModalOpen] = useState(false);
  const [isAddSuspectOpen, setIsAddSuspectOpen] = useState(false);
  const [prefilledSuspectData, setPrefilledSuspectData] = useState(null);

  useEffect(() => {
    if (officerUser) {
      fetchInitialData();
    }
  }, [officerUser]);

  const fetchInitialData = async () => {
    try {
      const [statusRes, graphRes] = await Promise.all([
        fetch('/api/status').then(r => r.json()),
        fetch('/api/graph').then(r => r.json())
      ]);
      setSystemStatus(statusRes);
      setGraphData(graphRes);
    } catch (err) {
      console.error("Error fetching system initial state:", err);
    }
  };

  const handleLoginSuccess = (userData) => {
    setOfficerUser(userData);
    setCurrentRole(userData.role || 'Investigating Officer (IO)');
    setActiveTab('dashboard');
    try {
      localStorage.setItem('portal_officer_session', JSON.stringify(userData));
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = () => {
    setOfficerUser(null);
    try {
      localStorage.removeItem('portal_officer_session');
    } catch (e) {
      console.error(e);
    }
  };

  const handleRefresh = () => {
    fetchInitialData();
  };

  const handleSuspectAdded = (resData) => {
    fetchInitialData();
    if (resData && resData.suspect_id) {
      setSelectedNodeId(resData.suspect_id);
      setActiveTab('keyplayer');
    }
  };

  // If officer is not logged in, display the official Government Authentication Portal
  if (!officerUser) {
    return <LoginPortal onLoginSuccess={handleLoginSuccess} />;
  }

  // Extract existing suspects for linking
  const existingSuspects = (graphData?.elements || [])
    .filter(el => !el.data.source && el.data.entity_type === 'Person')
    .map(el => ({
      id: el.data.id,
      name: el.data.label || el.data.id,
      role: el.data.role || 'Suspect'
    }));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-page)' }}>
      {/* Top Law-Enforcement Navigation Bar */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        officerUser={officerUser}
        onLogout={handleLogout}
        systemStatus={systemStatus}
        onRefresh={handleRefresh}
        onOpenCctnsModal={() => setIsCctnsModalOpen(true)}
        onOpenAddSuspectModal={() => {
          setPrefilledSuspectData(null);
          setIsAddSuspectOpen(true);
        }}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area: Multi-Page Views */}
      <main style={{ flex: 1, position: 'relative' }}>
        {/* Page 1: Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <DashboardHome
            officerUser={officerUser}
            systemStatus={systemStatus}
            onNavigate={(pageId) => setActiveTab(pageId)}
            onOpenAddSuspect={() => {
              setPrefilledSuspectData(null);
              setIsAddSuspectOpen(true);
            }}
            onOpenCctnsModal={() => setIsCctnsModalOpen(true)}
          />
        )}

        {/* Page 2: Top Suspects & Arrest Disruption */}
        {activeTab === 'keyplayer' && (
          <KeyPlayerPanel
            currentRole={currentRole}
          />
        )}

        {/* Page 3: Case Q&A & Search */}
        {activeTab === 'graphrag' && (
          <GraphRAGConsole
            currentRole={currentRole}
          />
        )}

        {/* Page 4: Crime Forecast & Hidden Links */}
        {activeTab === 'gnn' && (
          <GNNPredictor
            currentRole={currentRole}
          />
        )}

        {/* Page 5: Crime Map & Vehicle Tracking */}
        {activeTab === 'spatiotemporal' && (
          <SpatioTemporalMap
            currentRole={currentRole}
          />
        )}

        {/* Page 6: Duplicate Suspect Matcher */}
        {activeTab === 'entityres' && (
          <EntityResolutionStudio
            currentRole={currentRole}
            onRefreshGraph={handleRefresh}
          />
        )}

        {/* Page 7: Upload FIR & Documents */}
        {activeTab === 'ingest' && (
          <DataIngestionStudio
            currentRole={currentRole}
            onOpenAddSuspectWithData={(data) => {
              setPrefilledSuspectData(data);
              setIsAddSuspectOpen(true);
            }}
          />
        )}

        {/* Page 8: Court Evidence Log */}
        {activeTab === 'audit' && (
          <AuditLogViewer
            currentRole={currentRole}
          />
        )}
      </main>

      {/* Add Suspect & Detailed Crime Dossier Modal */}
      <AddSuspectModal
        isOpen={isAddSuspectOpen}
        onClose={() => {
          setIsAddSuspectOpen(false);
          setPrefilledSuspectData(null);
        }}
        onSuspectAdded={handleSuspectAdded}
        existingSuspects={existingSuspects}
        prefilledData={prefilledSuspectData}
      />

      {/* CCTNS / ICJS 5-Pillars Modal */}
      <CCTNSPillarsModal
        isOpen={isCctnsModalOpen}
        onClose={() => setIsCctnsModalOpen(false)}
      />

      {/* Official Government Footer */}
      <footer style={{
        background: '#0f2942',
        color: '#cbd5e1',
        borderTop: '3px solid #ff9933',
        padding: '10px 24px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '10px',
        fontSize: '11px'
      }}>
        <div>
          <strong style={{ color: '#ffffff' }}>Government of India • Ministry of Home Affairs (MHA)</strong>
          <span style={{ margin: '0 8px', color: '#64748b' }}>|</span>
          <span>Inter-Operable Criminal Justice System (ICJS) & CCTNS Integrated</span>
        </div>
        <div style={{ color: '#94a3b8' }}>
          <span>Restricted Law Enforcement Portal • Admissible under Section 63 BSA 2024</span>
        </div>
      </footer>
    </div>
  );
}
