import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
import { 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Filter, 
  Layers, 
  Info, 
  ShieldAlert, 
  Sparkles, 
  Scale,
  RefreshCw,
  Share2,
  Lock,
  ArrowRight,
  TrendingUp
} from 'lucide-react';

cytoscape.use(coseBilkent);

const COMMUNITY_COLORS = [
  '#dc2626', // Red: Command Cell
  '#0284c7', // Cyan: Logistics
  '#7c3aed', // Violet: Hawala / Fin
  '#d97706', // Amber: Cyber
  '#16a34a', // Emerald: Enforcers
  '#db2777', // Pink
  '#0d9488'  // Teal
];

export default function GraphExplorer({ graphData, onNodeSelect, selectedNodeId }) {
  const containerRef = useRef(null);
  const cyRef = useRef(null);
  
  const [layoutName, setLayoutName] = useState('cose-bilkent');
  const [colorMode, setColorMode] = useState('entity'); // 'entity' | 'community' | 'threat'
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntity, setSelectedEntity] = useState(null);
  const [filterType, setFilterType] = useState('ALL');
  const [minThreat, setMinThreat] = useState(0.0);
  const [egoSubGraphActive, setEgoSubGraphActive] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !graphData || !graphData.elements) return;

    if (cyRef.current) {
      cyRef.current.destroy();
    }

    const cy = cytoscape({
      container: containerRef.current,
      elements: graphData.elements,
      style: [
        {
          selector: 'node',
          style: {
            'label': 'data(label)',
            'color': '#0f172a',
            'font-family': 'Inter, sans-serif',
            'font-size': '11px',
            'font-weight': 700,
            'text-valign': 'bottom',
            'text-margin-y': 6,
            'background-color': (ele) => {
              const type = ele.data('entity_type');
              const threat = ele.data('threat_score') || 0.5;
              const commId = ele.data('community_id') || 0;

              if (colorMode === 'community') {
                return COMMUNITY_COLORS[commId % COMMUNITY_COLORS.length];
              }
              if (colorMode === 'threat') {
                return threat >= 0.8 ? '#dc2626' : threat >= 0.5 ? '#d97706' : '#16a34a';
              }

              // Default by Entity Type
              switch (type) {
                case 'Person': return threat >= 0.85 ? '#dc2626' : '#ea580c';
                case 'Phone': return '#0284c7';
                case 'Vehicle': return '#d97706';
                case 'Location': return '#16a34a';
                case 'BankAccount': return '#7c3aed';
                case 'CryptoWallet': return '#9333ea';
                case 'FIR': return '#e11d48';
                default: return '#2563eb';
              }
            },
            'width': (ele) => {
              const threat = ele.data('threat_score') || 0.5;
              return 32 + threat * 28;
            },
            'height': (ele) => {
              const threat = ele.data('threat_score') || 0.5;
              return 32 + threat * 28;
            },
            'border-width': 2.5,
            'border-color': '#ffffff',
            'border-opacity': 0.95,
            'text-outline-color': '#ffffff',
            'text-outline-width': 3,
            'transition-property': 'background-color, border-color, width, height, opacity',
            'transition-duration': '0.25s'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': (ele) => Math.max(1.8, (ele.data('weight') || 1.0) * 1.5),
            'line-color': (ele) => {
              const rel = ele.data('rel_type');
              if (rel === 'COMMANDS') return '#dc2626';
              if (rel === 'TRANSFERRED_FUNDS_TO') return '#7c3aed';
              if (rel === 'CALLED') return '#0284c7';
              if (rel === 'ARRESTED_WITH') return '#e11d48';
              if (rel === 'OPERATES_IN') return '#d97706';
              return '#64748b';
            },
            'target-arrow-color': (ele) => {
              const rel = ele.data('rel_type');
              if (rel === 'COMMANDS') return '#dc2626';
              if (rel === 'TRANSFERRED_FUNDS_TO') return '#7c3aed';
              if (rel === 'CALLED') return '#0284c7';
              return '#64748b';
            },
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'opacity': 0.85,
            'label': 'data(label)',
            'font-size': '10px',
            'font-family': 'Inter, sans-serif',
            'font-weight': 600,
            'color': '#475569',
            'text-rotation': 'autorotate',
            'text-margin-y': -8,
            'text-outline-color': '#ffffff',
            'text-outline-width': 2
          }
        },
        {
          selector: ':selected',
          style: {
            'border-width': 4,
            'border-color': '#1d4ed8',
            'shadow-blur': 18,
            'shadow-color': 'rgba(29, 78, 216, 0.4)',
            'shadow-opacity': 0.9
          }
        },
        {
          selector: '.highlighted',
          style: {
            'opacity': 1.0,
            'border-color': '#1d4ed8',
            'border-width': 3
          }
        },
        {
          selector: '.dimmed',
          style: {
            'opacity': 0.18
          }
        }
      ],
      layout: {
        name: layoutName,
        animate: true,
        animationDuration: 600,
        randomize: false,
        fit: true,
        padding: 40,
        nodeRepulsion: 4500,
        idealEdgeLength: 80
      }
    });

    cy.on('tap', 'node', (evt) => {
      const node = evt.target;
      const data = node.data();
      setSelectedEntity(data);
      if (onNodeSelect) onNodeSelect(data.id);

      // Highlight neighborhood
      cy.elements().removeClass('highlighted dimmed');
      const neighborhood = node.neighborhood().add(node);
      neighborhood.addClass('highlighted');
      cy.elements().not(neighborhood).addClass('dimmed');
    });

    cy.on('tap', (evt) => {
      if (evt.target === cy) {
        cy.elements().removeClass('highlighted dimmed');
        setSelectedEntity(null);
        setEgoSubGraphActive(false);
      }
    });

    cyRef.current = cy;

    // If initial selected node exists, select it
    if (selectedNodeId) {
      const targetNode = cy.$id(selectedNodeId);
      if (targetNode.length > 0) {
        targetNode.select();
        setSelectedEntity(targetNode.data());
      }
    }

    return () => {
      if (cyRef.current) cyRef.current.destroy();
    };
  }, [graphData, layoutName, colorMode]);

  // Handle Search & Filter
  useEffect(() => {
    if (!cyRef.current) return;
    const cy = cyRef.current;

    cy.nodes().forEach((n) => {
      const label = (n.data('label') || '').toLowerCase();
      const type = n.data('entity_type');
      const threat = n.data('threat_score') || 0.0;

      const matchesSearch = !searchTerm || label.includes(searchTerm.toLowerCase());
      const matchesType = filterType === 'ALL' || type === filterType;
      const matchesThreat = threat >= minThreat;

      if (matchesSearch && matchesType && matchesThreat) {
        n.show();
      } else {
        n.hide();
      }
    });
  }, [searchTerm, filterType, minThreat]);

  // Handle Ego Subgraph extraction
  const handleExtractEgoSubgraph = () => {
    if (!cyRef.current || !selectedEntity) return;
    const cy = cyRef.current;
    const centerNode = cy.$id(selectedEntity.id);
    if (centerNode.length === 0) return;

    // 2-hop neighborhood
    const hop1 = centerNode.neighborhood();
    const hop2 = hop1.nodes().neighborhood();
    const egoElements = centerNode.union(hop1).union(hop2);

    cy.elements().hide();
    egoElements.show();
    cy.fit(egoElements, 40);
    setEgoSubGraphActive(true);
  };

  const handleResetSubgraph = () => {
    if (!cyRef.current) return;
    const cy = cyRef.current;
    cy.elements().show();
    cy.elements().removeClass('highlighted dimmed');
    cy.fit();
    setEgoSubGraphActive(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: '16px', height: 'calc(100vh - 128px)', padding: '16px 24px' }}>
      {/* Graph Canvas Container */}
      <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        {/* Graph Controls Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: '1px solid #e2e8f0',
          background: '#f8fafc',
          flexWrap: 'wrap',
          gap: '10px',
          zIndex: 10
        }}>
          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#ffffff',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            padding: '5px 10px',
            width: '220px'
          }}>
            <Search size={14} color="#0284c7" />
            <input
              type="text"
              placeholder="Search suspects, phones, plates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#0f172a',
                fontSize: '12px',
                outline: 'none',
                width: '100%',
                fontFamily: 'var(--font-main)'
              }}
            />
          </div>

          {/* Entity Type Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Filter size={14} color="#b45309" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 600,
                outline: 'none'
              }}
            >
              <option value="ALL">All Entity Types</option>
              <option value="Person">Suspects / Persons</option>
              <option value="Phone">Phones (CDR / IPDR)</option>
              <option value="Vehicle">Vehicles (Toll / Plates)</option>
              <option value="BankAccount">Bank & UPI Accounts</option>
              <option value="Location">Safehouses & Hotspots</option>
              <option value="FIR">FIR & Crime Incidents</option>
            </select>
          </div>

          {/* Color Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={14} color="#6d28d9" />
            <select
              value={colorMode}
              onChange={(e) => setColorMode(e.target.value)}
              style={{
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                color: '#0f172a',
                borderRadius: '4px',
                padding: '4px 8px',
                fontSize: '11px',
                fontWeight: 600,
                outline: 'none'
              }}
            >
              <option value="entity">Color: Entity Type</option>
              <option value="community">Color: Louvain Cell</option>
              <option value="threat">Color: Threat Tier</option>
            </select>
          </div>

          {/* Layout Switcher */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {['cose-bilkent', 'concentric', 'circle', 'breadthfirst'].map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLayoutName(l)}
                style={{
                  background: layoutName === l ? '#1d4ed8' : '#ffffff',
                  color: layoutName === l ? '#ffffff' : '#334155',
                  border: layoutName === l ? '1px solid #1d4ed8' : '1px solid #cbd5e1',
                  borderRadius: '4px',
                  padding: '4px 8px',
                  fontSize: '10px',
                  fontWeight: 700,
                  cursor: 'pointer',
                  textTransform: 'uppercase'
                }}
              >
                {l.replace('-bilkent', '')}
              </button>
            ))}
          </div>

          {/* Zoom Actions */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {egoSubGraphActive && (
              <button
                type="button"
                onClick={handleResetSubgraph}
                className="btn-secondary"
                style={{ padding: '4px 8px', fontSize: '11px', color: '#dc2626' }}
                title="Reset Subgraph Filter"
              >
                Reset Filter
              </button>
            )}
            <button
              type="button"
              onClick={() => cyRef.current && cyRef.current.zoom(cyRef.current.zoom() * 1.25)}
              className="btn-secondary"
              style={{ padding: '5px 8px' }}
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              type="button"
              onClick={() => cyRef.current && cyRef.current.zoom(cyRef.current.zoom() * 0.8)}
              className="btn-secondary"
              style={{ padding: '5px 8px' }}
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              type="button"
              onClick={() => cyRef.current && cyRef.current.fit()}
              className="btn-secondary"
              style={{ padding: '5px 8px' }}
              title="Reset View"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>

        {/* Cytoscape Canvas */}
        <div ref={containerRef} style={{ flex: 1, width: '100%', height: '100%', background: '#fafbfc' }} />

        {/* Threat Legend Footer */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          background: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #cbd5e1',
          borderRadius: '6px',
          padding: '6px 12px',
          display: 'flex',
          gap: '12px',
          fontSize: '11px',
          fontWeight: 600,
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.06)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#dc2626' }}></span>
            <span style={{ color: '#0f172a' }}>Kingpin (Threat &gt; 0.85)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#0284c7' }}></span>
            <span style={{ color: '#0f172a' }}>Phone / CDR</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#7c3aed' }}></span>
            <span style={{ color: '#0f172a' }}>Hawala / Account</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#d97706' }}></span>
            <span style={{ color: '#0f172a' }}>Vehicle / Convoy</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#16a34a' }}></span>
            <span style={{ color: '#0f172a' }}>Location</span>
          </div>
        </div>
      </div>

      {/* Node Inspector Drawer */}
      <div className="glass-panel" style={{ padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px', background: '#ffffff', border: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid #f1f5f9', paddingBottom: '10px' }}>
          <Info size={18} color="#0284c7" />
          <h2 style={{ fontSize: '14px', fontWeight: 800, color: '#0f172a', textTransform: 'uppercase', letterSpacing: '0.4px', margin: 0 }}>
            Entity Inspector
          </h2>
        </div>

        {selectedEntity ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className={`badge ${selectedEntity.threat_score >= 0.8 ? 'badge-crimson' : 'badge-cyan'}`}>
                  {selectedEntity.entity_type}
                </span>
                <span style={{ fontSize: '11px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                  ID: {selectedEntity.id}
                </span>
              </div>

              <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', marginTop: '6px', margin: '6px 0 2px' }}>
                {selectedEntity.label}
              </h3>
              <p style={{ fontSize: '12px', color: '#b45309', fontWeight: 600, margin: 0 }}>
                {selectedEntity.role || 'Unspecified Role'}
              </p>
            </div>

            {selectedEntity.threat_score !== undefined && (
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '6px',
                padding: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span style={{ color: '#475569', fontWeight: 600 }}>Threat Index</span>
                  <span style={{ color: '#b91c1c', fontWeight: 800 }}>
                    {(selectedEntity.threat_score * 100).toFixed(0)}% Risk
                  </span>
                </div>
                <div style={{ height: '6px', background: '#fee2e2', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${selectedEntity.threat_score * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #d97706, #dc2626)'
                  }} />
                </div>
              </div>
            )}

            {/* Comprehensive Crime Profile Dossier if present */}
            {selectedEntity.properties?.crime_details && (
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: '#dc2626', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px', textTransform: 'uppercase' }}>
                    <Scale size={14} /> Criminal Case Dossier
                  </span>
                  <span className="badge badge-crimson" style={{ fontSize: '10px' }}>
                    {selectedEntity.properties.crime_details.crime_category || 'Crime Record'}
                  </span>
                </div>

                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#0f172a', lineHeight: 1.3, margin: '0 0 2px' }}>
                    {selectedEntity.properties.crime_details.crime_title}
                  </h4>
                  <div style={{ fontSize: '11px', color: '#d97706', fontWeight: 600 }}>
                    ⚖️ {selectedEntity.properties.crime_details.case_status || 'Under Active Investigation'}
                  </div>
                </div>

                {selectedEntity.properties.crime_details.incident_narrative && (
                  <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '6px', padding: '8px 10px', fontSize: '11px', color: '#334155', lineHeight: 1.5 }}>
                    <strong style={{ color: '#0284c7' }}>Case Narrative: </strong>
                    {selectedEntity.properties.crime_details.incident_narrative}
                  </div>
                )}

                {selectedEntity.properties.crime_details.modus_operandi && (
                  <div style={{ background: '#fffbeb', borderLeft: '3px solid #d97706', borderRadius: '4px', padding: '6px 8px', fontSize: '11px', color: '#92400e', lineHeight: 1.4 }}>
                    <strong>🎯 Modus Operandi (M.O.): </strong>
                    {selectedEntity.properties.crime_details.modus_operandi}
                  </div>
                )}

                {selectedEntity.properties.crime_details.seized_contraband && (
                  <div style={{ background: '#f0f9ff', borderRadius: '6px', padding: '6px 8px', fontSize: '11px', color: '#0369a1', borderLeft: '3px solid #0284c7' }}>
                    <strong>📦 Seized Items / Contraband: </strong>
                    {selectedEntity.properties.crime_details.seized_contraband}
                  </div>
                )}

                {/* Statutory Acts Breakdown */}
                {selectedEntity.properties.crime_details.statutory_acts && selectedEntity.properties.crime_details.statutory_acts.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '10px', color: '#0284c7', textTransform: 'uppercase', fontWeight: 700 }}>
                      Statutory Sections ({selectedEntity.properties.crime_details.statutory_acts.length})
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                      {selectedEntity.properties.crime_details.statutory_acts.map((actItem, aIdx) => (
                        <div key={aIdx} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '4px', padding: '6px 8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#0f172a', fontWeight: 700, fontSize: '11px' }}>
                              {actItem.act} • <span style={{ color: '#dc2626' }}>{actItem.section}</span>
                            </span>
                            <span style={{ fontSize: '10px', color: '#64748b' }}>{actItem.title}</span>
                          </div>
                          {actItem.explanation && (
                            <p style={{ fontSize: '10px', color: '#475569', marginTop: '2px', lineHeight: 1.3, margin: '2px 0 0' }}>
                              {actItem.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FIR, Locus & Station */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '10px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                  <div>FIR: <span style={{ color: '#0f172a', fontWeight: 600 }}>{selectedEntity.properties.crime_details.fir_number || 'N/A'}</span></div>
                  <div>Thana: <span style={{ color: '#0f172a', fontWeight: 600 }}>{selectedEntity.properties.crime_details.police_station || 'Special Cell'}</span></div>
                  <div>Date: <span style={{ color: '#0f172a', fontWeight: 600 }}>{selectedEntity.properties.crime_details.incident_date || 'Aug 2026'}</span></div>
                  <div>IO: <span style={{ color: '#0f172a', fontWeight: 600 }}>{selectedEntity.properties.crime_details.investigating_officer || 'IO-8842'}</span></div>
                </div>
              </div>
            )}

            {/* Evidence & Media Attachment Card (if present) */}
            {selectedEntity.properties?.evidence_attachment && (
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '6px',
                padding: '10px 12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#15803d', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Lock size={12} /> Digital Evidence Stamp
                  </span>
                  <span className="badge badge-emerald" style={{ fontSize: '9px' }}>
                    BSA 2024 Sec 63
                  </span>
                </div>
                <div style={{ fontSize: '11px', color: '#0f172a', fontWeight: 700 }}>
                  {selectedEntity.properties.evidence_attachment.file_name}
                </div>
                <div style={{ fontSize: '9px', color: '#64748b', fontFamily: 'var(--font-mono)' }}>
                  SHA-256: {selectedEntity.properties.evidence_attachment.sha256_hash?.slice(0, 24)}...
                </div>
              </div>
            )}

            {/* AI Outcome & Historical Case Forecast Card */}
            {selectedEntity.properties?.predicted_outcome && (
              <div style={{
                background: '#f5f3ff',
                border: '1px solid #ddd6fe',
                borderRadius: '6px',
                padding: '10px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '11px', color: '#6d28d9', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <TrendingUp size={12} /> AI Case Forecast
                  </span>
                  <span className="badge badge-violet" style={{ fontSize: '9px' }}>
                    {selectedEntity.properties.predicted_outcome.overall_escalation_percentage} Escalation Risk
                  </span>
                </div>

                <div style={{ fontSize: '11px', color: '#4c1d95', background: '#ffffff', padding: '6px 8px', borderRadius: '4px', border: '1px solid #ede9fe' }}>
                  <strong style={{ color: '#6d28d9' }}>Precedent: </strong>
                  {selectedEntity.properties.predicted_outcome.matched_historical_precedent?.case_title}
                </div>
              </div>
            )}

            {/* Properties Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <h4 style={{ fontSize: '11px', color: '#0284c7', textTransform: 'uppercase', fontWeight: 700 }}>
                Evidentiary Attributes
              </h4>
              <div style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '6px',
                padding: '8px 10px',
                fontSize: '11px',
                display: 'flex',
                flexDirection: 'column',
                gap: '5px'
              }}>
                {Object.entries(selectedEntity.properties || {})
                  .filter(([k]) => !['crime_details', 'evidence_attachment', 'predicted_outcome', 'community_id'].includes(k))
                  .map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ color: '#64748b', fontFamily: 'var(--font-mono)', fontSize: '10px' }}>
                      {key}:
                    </span>
                    <span style={{ color: '#0f172a', fontWeight: 600, textAlign: 'right', wordBreak: 'break-all' }}>
                      {Array.isArray(val) ? val.join(', ') : typeof val === 'object' ? JSON.stringify(val) : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '6px' }}>
              <button 
                type="button"
                className="btn-primary"
                onClick={handleExtractEgoSubgraph}
                style={{ justifyContent: 'center', fontSize: '11px', padding: '6px' }}
              >
                <Sparkles size={13} />
                <span>Focus 2-Hop Ego-Subgraph</span>
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 10px', color: '#94a3b8' }}>
            <Info size={32} style={{ margin: '0 auto 12px', opacity: 0.5, color: '#0284c7' }} />
            <p style={{ fontSize: '12px', color: '#64748b' }}>
              Click any node or relationship on the knowledge graph to inspect evidentiary attributes, connected entities, and criminal dossiers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
