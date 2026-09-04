import React, { useState, useEffect } from 'react';
import LoginPortal from './components/LoginPortal.jsx';
import Sidebar from './components/Sidebar.jsx';
import TopNavbar from './components/TopNavbar.jsx';
import DashboardHome from './components/DashboardHome.jsx';
import GraphRAGConsole from './components/GraphRAGConsole.jsx';
import KeyPlayerPanel from './components/KeyPlayerPanel.jsx';
import GNNPredictor from './components/GNNPredictor.jsx';
import SpatioTemporalMap from './components/SpatioTemporalMap.jsx';
import EntityResolutionStudio from './components/EntityResolutionStudio.jsx';
import DataIngestionStudio from './components/DataIngestionStudio.jsx';
import AuditLogViewer from './components/AuditLogViewer.jsx';
import GraphExplorer from './components/GraphExplorer.jsx';
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
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
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
    <div style={{ minHeight: '100vh', display: 'flex', background: 'var(--bg-page)' }}>
      {/* 1. Left Sidebar Navigation Bar (Collapsible) */}
      <Sidebar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        officerUser={officerUser}
        onLogout={handleLogout}
        onOpenCctnsModal={() => setIsCctnsModalOpen(true)}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(prev => !prev)}
      />

      {/* 2. Right Main Layout Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, height: '100vh', overflow: 'hidden' }}>
        {/* Top Breadcrumb, Sidebar Toggle & Actions Bar */}
        <TopNavbar
          activeTab={activeTab}
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          onRefresh={handleRefresh}
          onOpenAddSuspectModal={() => {
            setPrefilledSuspectData(null);
            setIsAddSuspectOpen(true);
          }}
          onOpenCctnsModal={() => setIsCctnsModalOpen(true)}
          isSidebarCollapsed={isSidebarCollapsed}
          onToggleSidebar={() => setIsSidebarCollapsed(prev => !prev)}
        />

        {/* Main Operational Module Display (Only active page shown) */}
        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-page)' }}>
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

          {/* Page 9: Interactive Knowledge Graph Explorer */}
          {activeTab === 'graphexplorer' && (
            <GraphExplorer
              graphData={graphData}
              onNodeSelect={(nodeId) => setSelectedNodeId(nodeId)}
              selectedNodeId={selectedNodeId}
            />
          )}
        </main>

        {/* Official Government Footer */}
        <footer style={{
          background: '#0f2942',
          color: '#cbd5e1',
          borderTop: '2px solid #ff9933',
          padding: '6px 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '10px',
          fontSize: '11px',
          flexShrink: 0
        }}>
          <div>
            <strong style={{ color: '#ffffff' }}>Government of India • Ministry of Home Affairs</strong>
            <span style={{ margin: '0 8px', color: '#64748b' }}>|</span>
            <span>CCTNS & ICJS Synchronized Grid</span>
          </div>
          <div style={{ color: '#94a3b8' }}>
            <span>Restricted Police Portal • Certified under BSA 2024 Sec 63</span>
          </div>
        </footer>
      </div>

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
    </div>
  );
}
