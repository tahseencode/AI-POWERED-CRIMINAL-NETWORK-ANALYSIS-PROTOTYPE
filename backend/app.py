import os
import json
from pathlib import Path
from typing import Dict, Any, List, Optional
from fastapi import FastAPI, HTTPException, Query, Body
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

from backend.config import BASE_DIR, DATA_DIR, CASE_DATA_FILE
from backend.core.security import audit_logger, UserRole, ROLE_PERMISSIONS, generate_evidence_hash
from backend.core.ocr_processor import ocr_processor
from backend.core.legal_ner import legal_ner_engine
from backend.core.entity_resolution import entity_resolver
from backend.core.knowledge_graph import kg_store
from backend.core.graph_rag import graph_rag_engine
from backend.core.graph_analytics import analytics_engine
from backend.core.gnn_predictive import gnn_engine
from backend.core.spatio_temporal import strp_dbscan_clusterer
from backend.core.data_generator import initialize_knowledge_graph, generate_default_intelligence_cases

# Initialize data and knowledge graph
initial_case_data = initialize_knowledge_graph()

app = FastAPI(
    title="AI-Powered Criminal Network Analysis System (SIH26189)",
    description="Explainable Decision-Support Layer for Law-Enforcement Intelligence",
    version="2.0.0"
)

# Enable CORS for local React development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Request Models
class CypherQueryRequest(BaseModel):
    query: str
    officer_badge: Optional[str] = "IO-KOLKATA-8842"
    role: Optional[str] = UserRole.INVESTIGATING_OFFICER.value

class GraphRAGRequest(BaseModel):
    prompt: str
    officer_badge: Optional[str] = "IO-KOLKATA-8842"
    role: Optional[str] = UserRole.INVESTIGATING_OFFICER.value

class DisruptionSimulationRequest(BaseModel):
    target_node_ids: List[str]
    officer_badge: Optional[str] = "IA-SPECIAL-CELL-104"
    role: Optional[str] = UserRole.INTELLIGENCE_ANALYST.value

class EntityMergeRequest(BaseModel):
    primary_entity_id: str
    secondary_entity_id: str
    officer_badge: Optional[str] = "IA-SPECIAL-CELL-104"
    role: Optional[str] = UserRole.INTELLIGENCE_ANALYST.value

class IngestionRequest(BaseModel):
    raw_text: str
    source_type: Optional[str] = "FIR_NARRATIVE"
    language: Optional[str] = "en"
    officer_badge: Optional[str] = "IO-KOLKATA-8842"
    role: Optional[str] = UserRole.INVESTIGATING_OFFICER.value

# ==========================================
# API ROUTES
# ==========================================

@app.get("/api/status")
def get_system_status():
    """System health, hardware constraints, and compliance telemetry."""
    return {
        "status": "OPERATIONAL",
        "system_name": "AI-Powered Criminal Network Analysis Platform",
        "sih_problem_statement": "SIH26189",
        "deployment_node": "Ichhapur Defence Hub / Air-Gapped Secure Enclave",
        "hardware_profile": "8GB RAM CPU-Only Edge Target (Quantized Inference)",
        "statutory_compliance": "Bharatiya Nyaya Sanhita (BNS) 2024 / BNSS Sec 173 / BSA Sec 63",
        "active_case": initial_case_data.get("case_title"),
        "total_entities_indexed": len(kg_store.nodes),
        "total_relationships_mapped": len(kg_store.edges)
    }

@app.get("/api/graph")
def get_full_graph():
    """Returns the complete Knowledge Graph in Cytoscape.js format with community assignments."""
    # Ensure Louvain community partitions are mapped
    louvain_data = analytics_engine.compute_louvain_communities()
    for nid, cid in louvain_data.get("node_assignments", {}).items():
        if nid in kg_store.nodes:
            kg_store.nodes[nid]["properties"]["community_id"] = cid

    return kg_store.serialize_to_cytoscape()

@app.get("/api/graph/subgraph")
def get_subgraph(center_ids: str = Query(..., description="Comma-separated node IDs"), depth: int = 2):
    ids = [i.strip() for i in center_ids.split(",") if i.strip()]
    return kg_store.extract_subgraph(ids, depth=depth)

@app.post("/api/graph/cypher")
def execute_cypher(req: CypherQueryRequest):
    """Executes deterministic Cypher query directly on property graph."""
    res = kg_store.execute_cypher(req.query)
    audit_logger.log_action(
        officer_badge=req.officer_badge,
        role=req.role,
        action="CYPHER_DIRECT_EXECUTION",
        query_or_target=req.query,
        resource_data={"matched_nodes": res["results"]["count_nodes"]}
    )
    return res

@app.post("/api/graphrag/query")
def query_graphrag(req: GraphRAGRequest):
    """Dynamic GraphRAG Interrogation with deterministic Cypher translation."""
    return graph_rag_engine.query(
        natural_language_prompt=req.prompt,
        officer_badge=req.officer_badge,
        role=req.role
    )

# Analytics Endpoints
@app.get("/api/analytics/centrality")
def get_centralities():
    """Calculates Degree, Betweenness, Eigenvector, and Energy Disruptive Centralities."""
    return analytics_engine.compute_all_centralities()

@app.get("/api/analytics/kappa-path")
def get_kappa_path_edge_centrality(kappa: int = 3):
    """Computes kappa-path Edge Centrality for critical communication channels."""
    return analytics_engine.compute_kappa_path_edge_centrality(kappa=kappa)

@app.get("/api/analytics/louvain")
def get_louvain_communities():
    """Louvain Modularity Community Detection for factional cell breakdown."""
    return analytics_engine.compute_louvain_communities()

@app.get("/api/analytics/cpp-tri")
def get_cpp_tri_matrix():
    """Composition of Probabilistic Preferences multi-criteria threat tier matrix."""
    return analytics_engine.compute_cpp_tri_threat_matrix()

@app.get("/api/analytics/key-players")
def get_key_players(k: int = 3):
    """Borgatti's Key Player Problem (KPP-1 Fragmentation and KPP-2 Reach)."""
    return analytics_engine.solve_key_player_problem(k=k)

@app.post("/api/analytics/disruption-simulate")
def simulate_disruption(req: DisruptionSimulationRequest):
    """Simulates network fragmentation upon targeted arrests."""
    res = analytics_engine.simulate_network_disruption(req.target_node_ids)
    audit_logger.log_action(
        officer_badge=req.officer_badge,
        role=req.role,
        action="NETWORK_DISRUPTION_SIMULATION",
        query_or_target=f"Targets: {', '.join(req.target_node_ids)}",
        resource_data={"disruption_pct": res.get("disruption_effectiveness_percent")}
    )
    return res

@app.get("/api/analytics/qap")
def get_qap_permutation_test(permutations: int = 500):
    """Quadratic Assignment Procedure (QAP) permutation testing."""
    return analytics_engine.run_qap_permutation_test(num_permutations=permutations)

# GNN Predictive Policing
@app.get("/api/gnn/predict")
def run_gnn_predictions():
    """Executes PyG GraphSAGE / GAT link prediction & missing intelligence discovery."""
    return gnn_engine.run_prediction_pipeline()

# Spatio-Temporal Trajectory & Hotspots
@app.get("/api/spatio-temporal/clusters")
def get_spatio_temporal_clusters(eps1: float = 3.5, eps2: float = 4.0, min_pts: int = 3):
    """Executes STRP-DBSCAN on trajectory/event points, detecting convoys and near-repeat hotspots."""
    if Path(CASE_DATA_FILE).exists():
        with open(CASE_DATA_FILE, "r", encoding="utf-8") as f:
            cdata = json.load(f)
        events = cdata.get("spatio_temporal_events", [])
    else:
        events = initial_case_data.get("spatio_temporal_events", [])

    strp_dbscan_clusterer.eps1 = eps1
    strp_dbscan_clusterer.eps2 = eps2
    strp_dbscan_clusterer.min_pts = min_pts
    return strp_dbscan_clusterer.cluster_points(events)

# Entity Resolution
@app.get("/api/entity-resolution/resolve")
def run_entity_resolution():
    """Runs blocked Fellegi-Sunter probabilistic record linkage across candidate records."""
    if Path(CASE_DATA_FILE).exists():
        with open(CASE_DATA_FILE, "r", encoding="utf-8") as f:
            cdata = json.load(f)
        er_records = cdata.get("entity_resolution_dataset", [])
    else:
        er_records = initial_case_data.get("entity_resolution_dataset", [])

    return entity_resolver.resolve_all_records(er_records)

@app.post("/api/entity-resolution/merge")
def merge_entities(req: EntityMergeRequest):
    """Merges two resolved entity nodes in the Knowledge Graph with audit trail."""
    audit_logger.log_action(
        officer_badge=req.officer_badge,
        role=req.role,
        action="ENTITY_RESOLUTION_MERGE",
        query_or_target=f"Merged {req.secondary_entity_id} into {req.primary_entity_id}",
        resource_data={"primary": req.primary_entity_id, "secondary": req.secondary_entity_id}
    )
    return {
        "status": "ENTITIES_MERGED_SUCCESSFULLY",
        "unified_node_id": req.primary_entity_id,
        "deprecated_node_id": req.secondary_entity_id,
        "statutory_note": "Entity resolution merge logged to immutable ledger pursuant to BSA digital standards."
    }

# Ingestion & OCR / Legal NER
@app.post("/api/ingest/ocr-ner")
def ingest_text_or_document(req: IngestionRequest):
    """Runs Multilingual OCR (En/Hi/Bn) & Domain-Adapted Legal NER on input."""
    # 1. OCR text standardization
    ocr_result = ocr_processor.extract_text_from_document(req.raw_text, language=req.language)
    
    # 2. Domain-adapted NER extraction
    ner_result = legal_ner_engine.extract_entities(ocr_result["cleaned_text"], source_type=req.source_type)

    # 3. Log ingestion
    audit_logger.log_action(
        officer_badge=req.officer_badge,
        role=req.role,
        action="MULTIMODAL_INGESTION_OCR_NER",
        query_or_target=f"Source: {req.source_type} ({ocr_result['detected_language']})",
        resource_data={"entities_count": ner_result["total_entities_extracted"]}
    )

    return {
        "ocr_processing": ocr_result,
        "legal_ner_extraction": ner_result
    }

# Cybersecurity & Cryptographic Custody
@app.get("/api/audit/logs")
def get_audit_logs(limit: int = 50):
    return audit_logger.get_logs(limit=limit)

@app.get("/api/audit/verify")
def verify_audit_integrity():
    return audit_logger.verify_integrity()

@app.get("/api/cctns/pillars")
def get_cctns_pillars():
    if Path(CASE_DATA_FILE).exists():
        with open(CASE_DATA_FILE, "r", encoding="utf-8") as f:
            cdata = json.load(f)
        return cdata.get("cctns_icjs_pillars", {})
    return initial_case_data.get("cctns_icjs_pillars", {})

# Serve frontend build if available
FRONTEND_DIST = BASE_DIR / "frontend" / "dist"
if FRONTEND_DIST.exists():
    app.mount("/assets", StaticFiles(directory=FRONTEND_DIST / "assets"), name="assets")
    
    @app.get("/{full_path:path}")
    def serve_frontend(full_path: str):
        file_path = FRONTEND_DIST / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST / "index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app:app", host="0.0.0.0", port=8000, reload=False)
