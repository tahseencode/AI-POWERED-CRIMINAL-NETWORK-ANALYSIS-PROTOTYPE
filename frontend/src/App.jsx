import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import GraphExplorer from './components/GraphExplorer.jsx';
import GraphRAGConsole from './components/GraphRAGConsole.jsx';
import KeyPlayerPanel from './components/KeyPlayerPanel.jsx';
import GNNPredictor from './components/GNNPredictor.jsx';
import SpatioTemporalMap from './components/SpatioTemporalMap.jsx';
import EntityResolutionStudio from './components/EntityResolutionStudio.jsx';
import DataIngestionStudio from './components/DataIngestionStudio.jsx';
import AuditLogViewer from './components/AuditLogViewer.jsx';
import CCTNSPillarsModal from './components/CCTNSPillarsModal.jsx';

export default function App() {
  const [activeTab, setActiveTab] = useState('graph');
  const [currentRole, setCurrentRole] = useState('Investigating Officer (IO)');
  const [systemStatus, setSystemStatus] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isCctnsModalOpen, setIsCctnsModalOpen] = useState(false);

  useEffect(() => {
    fetchInitialData();
  }, []);

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

  const handleRefresh = () => {
    fetchInitialData();
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top Law-Enforcement Navigation Bar */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
        systemStatus={systemStatus}
        onRefresh={handleRefresh}
        onOpenCctnsModal={() => setIsCctnsModalOpen(true)}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Main Content Area */}
      <main style={{ flex: 1, position: 'relative' }}>
        {activeTab === 'graph' && (
          <GraphExplorer
            graphData={graphData}
            onNodeSelect={setSelectedNodeId}
            selectedNodeId={selectedNodeId}
          />
        )}

        {activeTab === 'graphrag' && (
          <GraphRAGConsole
            currentRole={currentRole}
          />
        )}

        {activeTab === 'keyplayer' && (
          <KeyPlayerPanel
            currentRole={currentRole}
          />
        )}

        {activeTab === 'gnn' && (
          <GNNPredictor
            currentRole={currentRole}
          />
        )}

        {activeTab === 'spatiotemporal' && (
          <SpatioTemporalMap
            currentRole={currentRole}
          />
        )}

        {activeTab === 'entityres' && (
          <EntityResolutionStudio
            currentRole={currentRole}
            onRefreshGraph={handleRefresh}
          />
        )}

        {activeTab === 'ingest' && (
          <DataIngestionStudio
            currentRole={currentRole}
          />
        )}

        {activeTab === 'audit' && (
          <AuditLogViewer
            currentRole={currentRole}
          />
        )}
      </main>

      {/* CCTNS / ICJS 5-Pillars Modal */}
      <CCTNSPillarsModal
        isOpen={isCctnsModalOpen}
        onClose={() => setIsCctnsModalOpen(false)}
      />
    </div>
  );
}
