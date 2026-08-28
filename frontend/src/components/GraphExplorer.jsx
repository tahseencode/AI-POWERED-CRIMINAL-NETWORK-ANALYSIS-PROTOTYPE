import React, { useEffect, useRef, useState } from 'react';
import cytoscape from 'cytoscape';
import coseBilkent from 'cytoscape-cose-bilkent';
import { Search, ZoomIn, ZoomOut, Maximize2, Filter, Layers, Info, ShieldAlert, Sparkles, Scale } from 'lucide-react';

cytoscape.use(coseBilkent);

const COMMUNITY_COLORS = [
  '#ff1744', // Red: Command Cell
  '#00e5ff', // Cyan: Logistics
  '#7c4dff', // Violet: Hawala / Fin
  '#ffb300', // Amber: Cyber
  '#00e676', // Emerald: Enforcers
  '#ec4899', // Pink
  '#14b8a6'  // Teal
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
            'color': '#f0f4fc',
            'font-family': 'Outfit, sans-serif',
            'font-size': '11px',
            'font-weight': 600,
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
                return threat >= 0.8 ? '#ff1744' : threat >= 0.5 ? '#ffb300' : '#00e676';
              }

              // Default by Entity Type
              switch (type) {
                case 'Person': return threat >= 0.85 ? '#ff1744' : '#ff9100';
                case 'Phone': return '#00e5ff';
                case 'Vehicle': return '#ffb300';
                case 'Location': return '#00e676';
                case 'BankAccount': return '#7c4dff';
                case 'CryptoWallet': return '#d500f9';
                case 'FIR': return '#f43f5e';
                default: return '#38bdf8';
              }
            },
            'width': (ele) => {
              const threat = ele.data('threat_score') || 0.5;
              return 28 + threat * 32;
            },
            'height': (ele) => {
              const threat = ele.data('threat_score') || 0.5;
              return 28 + threat * 32;
            },
            'border-width': 2,
            'border-color': '#00e5ff',
            'border-opacity': 0.7,
            'text-outline-color': '#07090e',
            'text-outline-width': 2,
            'transition-property': 'background-color, border-color, width, height',
            'transition-duration': '0.3s'
          }
        },
        {
          selector: 'edge',
          style: {
            'width': (ele) => Math.max(1.5, (ele.data('weight') || 1.0) * 1.5),
            'line-color': (ele) => {
              const rel = ele.data('rel_type');
              if (rel === 'COMMANDS') return '#ff1744';
              if (rel === 'TRANSFERRED_FUNDS_TO') return '#7c4dff';
              if (rel === 'CALLED') return '#00e5ff';
              if (rel === 'ARRESTED_WITH') return '#f43f5e';
              return '#475569';
            },
            'target-arrow-color': (ele) => {
              const rel = ele.data('rel_type');
              if (rel === 'COMMANDS') return '#ff1744';
              if (rel === 'TRANSFERRED_FUNDS_TO') return '#7c4dff';
              if (rel === 'CALLED') return '#00e5ff';
              return '#475569';
            },
            'target-arrow-shape': 'triangle',
            'curve-style': 'bezier',
            'opacity': 0.8,
            'label': 'data(label)',
            'font-size': '9px',
            'font-family': 'Chakra Petch, sans-serif',
            'color': '#94a3b8',
            'text-rotation': 'autorotate',
            'text-margin-y': -8,
            'text-outline-color': '#07090e',
            'text-outline-width': 2
          }
        },
        {
          selector: ':selected',
          style: {
            'border-width': 4,
            'border-color': '#00e5ff',
            'shadow-blur': 25,
            'shadow-color': '#00e5ff',
            'shadow-opacity': 0.9
          }
        }
      ],
      layout: {
        name: layoutName,
        animate: true,
        animationDuration: 800,
        randomize: false,
        fit: true,
        padding: 50,
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
      }
    });

    cyRef.current = cy;

    return () => {
      if (cyRef.current) cyRef.current.destroy();
    };
  }, [graphData, layoutName, colorMode]);

  // Handle Search Filtering
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

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '16px', height: 'calc(100vh - 128px)', padding: '16px 24px' }}>
      {/* Graph Canvas Container */}
      <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Graph Controls Toolbar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 16px',
          borderBottom: '1px solid var(--border-subtle)',
          background: 'rgba(7, 9, 14, 0.65)',
          flexWrap: 'wrap',
          gap: '10px',
          zIndex: 10
        }}>
          {/* Search Box */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(19, 27, 42, 0.8)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '8px',
            padding: '6px 12px',
            width: '240px'
          }}>
            <Search size={14} color="var(--accent-cyan)" />
            <input
              type="text"
              placeholder="Search suspects, phones, plates..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#fff',
                fontSize: '12px',
                outline: 'none',
                width: '100%',
                fontFamily: 'var(--font-sans)'
              }}
            />
          </div>

          {/* Entity Type Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Filter size={14} color="var(--accent-amber)" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{
                background: 'rgba(19, 27, 42, 0.8)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '6px',
                padding: '5px 8px',
                fontSize: '12px',
                fontFamily: 'var(--font-tech)'
              }}
            >
              <option value="ALL">All Entity Types</option>
              <option value="Person">Suspects / Persons</option>
              <option value="Phone">Phones (CDR / IPDR)</option>
              <option value="Vehicle">Vehicles (Toll / Plates)</option>
              <option value="BankAccount">Bank & UPI Accounts</option>
              <option value="CryptoWallet">Crypto Wallets</option>
              <option value="Location">Safehouses & Hotspots</option>
              <option value="FIR">FIR & Legal Cases</option>
            </select>
          </div>

          {/* Color Mode Switcher */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Layers size={14} color="var(--accent-violet)" />
            <select
              value={colorMode}
              onChange={(e) => setColorMode(e.target.value)}
              style={{
                background: 'rgba(19, 27, 42, 0.8)',
                border: '1px solid var(--border-subtle)',
                color: 'var(--text-primary)',
                borderRadius: '6px',
                padding: '5px 8px',
                fontSize: '12px',
                fontFamily: 'var(--font-tech)'
              }}
            >
              <option value="entity">Color by Entity Type</option>
              <option value="community">Color by Louvain Cell</option>
              <option value="threat">Color by Threat Tier</option>
            </select>
          </div>

          {/* Layout Switcher */}
          <div style={{ display: 'flex', gap: '4px' }}>
            {['cose-bilkent', 'concentric', 'circle', 'breadthfirst'].map((l) => (
              <button
                key={l}
                onClick={() => setLayoutName(l)}
                style={{
                  background: layoutName === l ? 'var(--accent-cyan)' : 'rgba(19, 27, 42, 0.8)',
                  color: layoutName === l ? '#07090e' : 'var(--text-secondary)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '6px',
                  padding: '5px 8px',
                  fontSize: '10px',
                  fontWeight: 600,
                  fontFamily: 'var(--font-tech)',
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
            <button
              onClick={() => cyRef.current && cyRef.current.zoom(cyRef.current.zoom() * 1.25)}
              className="btn-primary"
              style={{ padding: '6px 8px' }}
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button
              onClick={() => cyRef.current && cyRef.current.zoom(cyRef.current.zoom() * 0.8)}
              className="btn-primary"
              style={{ padding: '6px 8px' }}
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
            <button
              onClick={() => cyRef.current && cyRef.current.fit()}
              className="btn-primary"
              style={{ padding: '6px 8px' }}
              title="Reset View"
            >
              <Maximize2 size={14} />
            </button>
          </div>
        </div>

        {/* Cytoscape Canvas */}
        <div ref={containerRef} style={{ flex: 1, width: '100%', height: '100%' }} />

        {/* Threat Legend Footer */}
        <div style={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          background: 'rgba(13, 18, 29, 0.88)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '8px 14px',
          display: 'flex',
          gap: '14px',
          fontSize: '11px',
          fontFamily: 'var(--font-tech)',
          backdropFilter: 'blur(8px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff1744' }}></span>
            <span>Kingpin (Threat &gt; 0.8)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#00e5ff' }}></span>
            <span>Phone / CDR</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#7c4dff' }}></span>
            <span>Hawala / Account</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#ffb300' }}></span>
            <span>Vehicle / Convoy</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: '#00e676' }}></span>
            <span>Safehouse</span>
          </div>
        </div>
      </div>

      {/* Node Inspector Drawer */}
      <div className="glass-panel" style={{ padding: '16px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '10px' }}>
          <Info size={18} color="var(--accent-cyan)" />
          <h2 style={{ fontSize: '14px', fontFamily: 'var(--font-tech)', color: '#fff', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
            Entity Inspector
          </h2>
        </div>

        {selectedEntity ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <span className={`badge ${selectedEntity.threat_score >= 0.8 ? 'badge-crimson' : 'badge-cyan'}`}>
                {selectedEntity.entity_type}
              </span>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#fff', marginTop: '6px' }}>
                {selectedEntity.label}
              </h3>
              <p style={{ fontSize: '12px', color: 'var(--accent-amber)', fontFamily: 'var(--font-tech)' }}>
                {selectedEntity.role || 'Unspecified Role'}
              </p>
            </div>

            {selectedEntity.threat_score !== undefined && (
              <div style={{
                background: 'rgba(255, 23, 68, 0.08)',
                border: '1px solid rgba(255, 23, 68, 0.25)',
                borderRadius: '8px',
                padding: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Threat Index</span>
                  <span style={{ color: 'var(--accent-crimson)', fontWeight: 700 }}>
                    {(selectedEntity.threat_score * 100).toFixed(0)}%
                  </span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.1)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${selectedEntity.threat_score * 100}%`,
                    height: '100%',
                    background: 'linear-gradient(90deg, #ffb300, #ff1744)'
                  }} />
                </div>
              </div>
            )}

            {/* Comprehensive Crime Profile Dossier if present */}
            {selectedEntity.properties?.crime_details && (
              <div style={{
                background: 'rgba(255, 23, 68, 0.06)',
                border: '1px solid rgba(255, 23, 68, 0.35)',
                borderRadius: '8px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: '11px', color: 'var(--accent-crimson)', fontWeight: 700, fontFamily: 'var(--font-tech)', display: 'flex', alignItems: 'center', gap: '5px', textTransform: 'uppercase' }}>
                    <Scale size={14} /> Comprehensive Crime Profile
                  </span>
                  <span className="badge badge-crimson" style={{ fontSize: '10px' }}>
                    {selectedEntity.properties.crime_details.crime_category || 'Crime Record'}
                  </span>
                </div>

                <div>
                  <h4 style={{ fontSize: '13px', fontWeight: 700, color: '#fff', lineHeight: 1.3 }}>
                    {selectedEntity.properties.crime_details.crime_title}
                  </h4>
                  <div style={{ fontSize: '11px', color: 'var(--accent-amber)', marginTop: '3px', fontFamily: 'var(--font-tech)' }}>
                    ⚖️ {selectedEntity.properties.crime_details.case_status || 'Under Active Investigation'}
                  </div>
                </div>

                {selectedEntity.properties.crime_details.incident_narrative && (
                  <div style={{ background: 'rgba(7, 9, 14, 0.6)', borderRadius: '6px', padding: '8px 10px', fontSize: '11px', color: '#e2e8f0', lineHeight: 1.5 }}>
                    <strong style={{ color: 'var(--accent-cyan)' }}>Incident Summary: </strong>
                    {selectedEntity.properties.crime_details.incident_narrative}
                  </div>
                )}

                {selectedEntity.properties.crime_details.modus_operandi && (
                  <div style={{ background: 'rgba(255, 179, 0, 0.08)', borderLeft: '3px solid var(--accent-amber)', borderRadius: '4px', padding: '6px 8px', fontSize: '11px', color: '#fef08a', lineHeight: 1.4 }}>
                    <strong>🎯 Modus Operandi (M.O.): </strong>
                    {selectedEntity.properties.crime_details.modus_operandi}
                  </div>
                )}

                {selectedEntity.properties.crime_details.seized_contraband && (
                  <div style={{ background: 'rgba(0, 229, 255, 0.06)', borderRadius: '6px', padding: '6px 8px', fontSize: '11px', color: '#bae6fd' }}>
                    <strong style={{ color: 'var(--accent-cyan)' }}>📦 Seized Contraband & Weapons: </strong>
                    {selectedEntity.properties.crime_details.seized_contraband}
                  </div>
                )}

                {/* Statutory Acts Breakdown */}
                {selectedEntity.properties.crime_details.statutory_acts && selectedEntity.properties.crime_details.statutory_acts.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <span style={{ fontSize: '10px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>
                      Statutory Acts & Explanations ({selectedEntity.properties.crime_details.statutory_acts.length} Sections)
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {selectedEntity.properties.crime_details.statutory_acts.map((actItem, aIdx) => (
                        <div key={aIdx} style={{ background: 'rgba(7, 9, 14, 0.7)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '6px 8px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ color: '#fff', fontWeight: 600, fontSize: '11px' }}>
                              {actItem.act} • <span style={{ color: 'var(--accent-crimson)' }}>{actItem.section}</span>
                            </span>
                            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>{actItem.title}</span>
                          </div>
                          {actItem.explanation && (
                            <p style={{ fontSize: '10px', color: '#94a3b8', marginTop: '3px', lineHeight: 1.3 }}>
                              {actItem.explanation}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* FIR, Locus & Station */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', fontSize: '10px', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                  <div>FIR: <span style={{ color: '#fff' }}>{selectedEntity.properties.crime_details.fir_number || 'N/A'}</span></div>
                  <div>Thana: <span style={{ color: '#fff' }}>{selectedEntity.properties.crime_details.police_station || 'Special Cell'}</span></div>
                  <div>Date: <span style={{ color: '#fff' }}>{selectedEntity.properties.crime_details.incident_date || 'Aug 2026'}</span></div>
                  <div>IO: <span style={{ color: '#fff' }}>{selectedEntity.properties.crime_details.investigating_officer || 'IO-8842'}</span></div>
                </div>
              </div>
            )}

            {/* Properties Breakdown */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <h4 style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>
                Evidentiary Properties
              </h4>
              <div style={{
                background: 'rgba(7, 9, 14, 0.5)',
                borderRadius: '6px',
                padding: '8px 10px',
                fontSize: '12px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px'
              }}>
                {Object.entries(selectedEntity.properties || {})
                  .filter(([k]) => k !== 'crime_details')
                  .map(([key, val]) => (
                  <div key={key} style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                    <span style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', fontSize: '11px' }}>
                      {key}:
                    </span>
                    <span style={{ color: 'var(--text-primary)', textAlign: 'right', wordBreak: 'break-all' }}>
                      {Array.isArray(val) ? val.join(', ') : typeof val === 'object' ? JSON.stringify(val) : String(val)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
              <button 
                className="btn-primary"
                onClick={() => {
                  alert(`Focusing 2-hop sub-graph around ${selectedEntity.label}`);
                }}
                style={{ justifyContent: 'center', fontSize: '11px' }}
              >
                <Sparkles size={14} />
                <span>Extract Ego-Subgraph</span>
              </button>
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 10px', color: 'var(--text-muted)' }}>
            <Info size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p style={{ fontSize: '13px' }}>Click any node or relationship on the knowledge graph to inspect evidentiary attributes and detailed crime dossiers.</p>
          </div>
        )}
      </div>
    </div>
  );
}
