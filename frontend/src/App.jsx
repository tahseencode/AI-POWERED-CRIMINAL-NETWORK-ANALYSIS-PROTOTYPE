import React, { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
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
  const [activeTab, setActiveTab] = useState('keyplayer');
  const [currentRole, setCurrentRole] = useState('Investigating Officer (IO)');
  const [systemStatus, setSystemStatus] = useState(null);
  const [graphData, setGraphData] = useState(null);
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isCctnsModalOpen, setIsCctnsModalOpen] = useState(false);
  const [isAddSuspectOpen, setIsAddSuspectOpen] = useState(false);
  const [prefilledSuspectData, setPrefilledSuspectData] = useState(null);

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

  const handleSuspectAdded = (resData) => {
    fetchInitialData();
    if (resData && resData.suspect_id) {
      setSelectedNodeId(resData.suspect_id);
      setActiveTab('keyplayer');
    }
  };

  // Extract existing suspects for linking
  const existingSuspects = (graphData?.elements || [])
    .filter(el => !el.data.source && el.data.entity_type === 'Person')
    .map(el => ({
      id: el.data.id,
      name: el.data.label || el.data.id,
      role: el.data.role || 'Suspect'
    }));

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top Law-Enforcement Navigation Bar */}
      <Header
        currentRole={currentRole}
        onRoleChange={setCurrentRole}
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

      {/* Main Content Area */}
      <main style={{ flex: 1, position: 'relative' }}>
        {activeTab === 'keyplayer' && (
          <KeyPlayerPanel
            currentRole={currentRole}
          />
        )}

        {activeTab === 'graphrag' && (
          <GraphRAGConsole
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
            onOpenAddSuspectWithData={(data) => {
              setPrefilledSuspectData(data);
              setIsAddSuspectOpen(true);
            }}
          />
        )}

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
    </div>
  );
}
