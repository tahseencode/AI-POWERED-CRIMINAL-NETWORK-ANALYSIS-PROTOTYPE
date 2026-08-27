import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Compass, AlertCircle, Clock, Play, Pause, RotateCcw, Truck } from 'lucide-react';
import L from 'leaflet';

export default function SpatioTemporalMap({ currentRole }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const layerGroupRef = useRef(null);

  const [clustersData, setClustersData] = useState(null);
  const [epsSpatial, setEpsSpatial] = useState(3.5);
  const [epsTemporal, setEpsTemporal] = useState(4.0);
  const [minPts, setMinPts] = useState(3);
  const [loading, setLoading] = useState(false);
  const [selectedCluster, setSelectedCluster] = useState(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Default center around West Bengal / Kolkata / Ichhapur Defence Corridor
      const map = L.map(mapContainerRef.current, {
        center: [22.8124, 88.3752],
        zoom: 9,
        zoomControl: false
      });

      // Dark Matter Map Tiles (OpenStreetMap CartoDB Dark)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
        subdomains: 'abcd',
        maxZoom: 19
      }).addTo(map);

      L.control.zoom({ position: 'topright' }).addTo(map);

      const layerGroup = L.layerGroup().addTo(map);
      layerGroupRef.current = layerGroup;
      mapInstanceRef.current = map;
    }

    fetchClusters(epsSpatial, epsTemporal, minPts);

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const fetchClusters = async (s = epsSpatial, t = epsTemporal, pts = minPts) => {
    setLoading(true);
    try {
      const resp = await fetch(`/api/spatio-temporal/clusters?eps1=${s}&eps2=${t}&min_pts=${pts}`);
      const data = await resp.json();
      setClustersData(data);
      renderMapOverlays(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const renderMapOverlays = (data) => {
    if (!mapInstanceRef.current || !layerGroupRef.current || !data) return;
    const layerGroup = layerGroupRef.current;
    layerGroup.clearLayers();

    // Render STRP-DBSCAN Clusters
    data.clusters?.forEach((cl) => {
      const circle = L.circle([cl.centroid.lat, cl.centroid.lng], {
        color: '#00e5ff',
        fillColor: '#00e5ff',
        fillOpacity: 0.18,
        radius: epsSpatial * 1000
      });

      circle.bindPopup(`
        <div style="font-family: 'Inter', sans-serif;">
          <h4 style="color: #00e5ff; margin-bottom: 4px; font-weight: 700;">STRP Cluster #${cl.cluster_id}</h4>
          <p style="font-size: 11px; margin: 2px 0;"><strong>Points:</strong> ${cl.num_points}</p>
          <p style="font-size: 11px; margin: 2px 0;"><strong>Entities:</strong> ${cl.unique_entities.join(', ')}</p>
          <p style="font-size: 11px; margin: 2px 0;"><strong>Vehicles:</strong> ${cl.unique_vehicles.join(', ')}</p>
          <p style="font-size: 11px; margin: 2px 0;"><strong>Time Window:</strong> ${cl.time_span_hours} hrs</p>
        </div>
      `);
      circle.addTo(layerGroup);
    });

    // Render Detected Convoys & Trajectories
    data.detected_convoys?.forEach((cv) => {
      const marker = L.circleMarker([cv.location_centroid.lat, cv.location_centroid.lng], {
        radius: 12,
        color: '#ff1744',
        fillColor: '#ff1744',
        fillOpacity: 0.85
      });
      marker.bindPopup(`
        <div>
          <h4 style="color: #ff1744; font-weight: 700;">🚨 Illicit Convoy Anomaly</h4>
          <p style="font-size: 11px; margin: 2px 0;"><strong>Vehicles:</strong> ${cv.convoy_vehicles.join(', ')}</p>
          <p style="font-size: 11px; margin: 2px 0;"><strong>Suspects:</strong> ${cv.associated_suspects.join(', ')}</p>
          <p style="font-size: 11px; margin: 2px 0; color: #ffb300;">${cv.threat_assessment}</p>
        </div>
      `);
      marker.addTo(layerGroup);
    });

    // Render Event Points
    data.clusters?.forEach((cl) => {
      cl.points?.forEach((p) => {
        const pMarker = L.circleMarker([p.lat, p.lng], {
          radius: 5,
          color: '#ffb300',
          fillColor: '#ffb300',
          fillOpacity: 0.9
        });
        pMarker.bindPopup(`
          <div>
            <strong>${p.entity_name}</strong><br/>
            <span>${p.location_name || 'Event Point'}</span><br/>
            <small>${p.timestamp}</small>
          </div>
        `);
        pMarker.addTo(layerGroup);
      });
    });
  };

  return (
    <div style={{ padding: '16px 24px', display: 'grid', gridTemplateColumns: '1fr 340px', gap: '20px', height: 'calc(100vh - 128px)' }}>
      {/* Map Container */}
      <div className="glass-panel" style={{ position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
        {/* Map Header Controls */}
        <div style={{
          position: 'absolute',
          top: 12,
          left: 12,
          zIndex: 400,
          background: 'rgba(13, 18, 29, 0.9)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '8px',
          padding: '10px 14px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--accent-cyan)', fontFamily: 'var(--font-tech)' }}>Spatial Radius (ε₁):</span>
            <input
              type="number"
              value={epsSpatial}
              onChange={(e) => setEpsSpatial(parseFloat(e.target.value))}
              style={{ width: '45px', background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '2px 4px', borderRadius: '4px', fontSize: '11px' }}
            />
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>km</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--accent-amber)', fontFamily: 'var(--font-tech)' }}>Time Window (ε₂):</span>
            <input
              type="number"
              value={epsTemporal}
              onChange={(e) => setEpsTemporal(parseFloat(e.target.value))}
              style={{ width: '45px', background: '#07090e', border: '1px solid var(--border-subtle)', color: '#fff', padding: '2px 4px', borderRadius: '4px', fontSize: '11px' }}
            />
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>hrs</span>
          </div>

          <button
            onClick={() => fetchClusters(epsSpatial, epsTemporal, minPts)}
            className="btn-primary"
            style={{ fontSize: '11px', padding: '4px 10px' }}
          >
            Re-Cluster
          </button>
        </div>

        {/* Leaflet Canvas */}
        <div ref={mapContainerRef} style={{ flex: 1, width: '100%', height: '100%' }} />
      </div>

      {/* Right Column: Spatio-Temporal Convoys & Hotspot Feed */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Truck size={18} color="var(--accent-crimson)" />
            <h2 style={{ fontSize: '15px', fontFamily: 'var(--font-tech)', color: '#fff', textTransform: 'uppercase' }}>
              STRP Trajectory Anomaly Feed
            </h2>
          </div>
          <span className="badge badge-crimson">Live Radar</span>
        </div>
        <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>
          Autonomously groups GPS pings, ANPR toll-booth hits, and cell-tower hops to isolate criminal convoys and Near-Repeat crime hotspots.
        </p>

        {/* Convoy Alerts */}
        <div>
          <span style={{ fontSize: '11px', color: 'var(--accent-crimson)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>
            Detected Vehicle Convoys:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
            {clustersData?.detected_convoys?.map((cv, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 23, 68, 0.08)',
                border: '1px solid rgba(255, 23, 68, 0.3)',
                borderRadius: '8px',
                padding: '10px 12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>
                    Convoy #{cv.cluster_id} Detected
                  </span>
                  <span className="badge badge-crimson" style={{ fontSize: '9px' }}>High Threat</span>
                </div>
                <div style={{ fontSize: '11px', color: 'var(--accent-amber)', fontFamily: 'var(--font-mono)' }}>
                  Plates: {cv.convoy_vehicles?.join(' • ')}
                </div>
                <div style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  Suspects: {cv.associated_suspects?.join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Near-Repeat Hotspot Alerts */}
        <div>
          <span style={{ fontSize: '11px', color: 'var(--accent-amber)', fontFamily: 'var(--font-tech)', textTransform: 'uppercase' }}>
            Near-Repeat Spatial Hotspots:
          </span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
            {clustersData?.near_repeat_hotspots?.map((hs, idx) => (
              <div key={idx} style={{
                background: 'rgba(255, 179, 0, 0.08)',
                border: '1px solid rgba(255, 179, 0, 0.3)',
                borderRadius: '8px',
                padding: '10px 12px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <span style={{ fontSize: '12px', fontWeight: 700, color: '#fff' }}>
                    {hs.hotspot_id}
                  </span>
                  <span className="badge badge-amber" style={{ fontSize: '9px' }}>
                    {hs.correlated_crimes_count} Correlated Incidents
                  </span>
                </div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  {hs.recommended_patrol_focus}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
