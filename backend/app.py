import os
import json
import hashlib
from pathlib import Path
from typing import Dict, Any, List, Optional
from datetime import datetime, timezone
from fastapi import FastAPI, HTTPException, Query, Body, UploadFile, File, Form
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
from backend.core.outcome_forecaster import outcome_predictor
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

class StatutoryActDetail(BaseModel):
    act: str = "Bharatiya Nyaya Sanhita (BNS) 2024"
    section: str = "Section 111"
    title: Optional[str] = "Organized Crime Syndicate Offence"
    explanation: Optional[str] = ""

class AddSuspectRequest(BaseModel):
    name: str
    aliases: Optional[List[str]] = []
    role: Optional[str] = "Syndicate Operative"
    threat_score: Optional[float] = 0.75
    attribute_load: Optional[float] = 2.5
    age: Optional[int] = 32
    gender: Optional[str] = "Male"
    cctns_id: Optional[str] = None
    
    # Detailed Crime Profile
    crime_title: str = "Unlawful Syndicate Conspiracy & Contraband Operations"
    crime_category: Optional[str] = "Organized Crime & Firearms Trafficking"
    incident_narrative: str = "Suspect engaged in active conspiracy and logistical coordination of contraband."
    modus_operandi: Optional[str] = "Operates through encrypted telecom channels and rapid physical dropoffs."
    seized_contraband: Optional[str] = "Country-made weapons and unaccounted currency notes."
    statutory_acts: Optional[List[StatutoryActDetail]] = []
    bns_sections: Optional[List[str]] = []
    fir_number: Optional[str] = ""
    police_station: Optional[str] = "Barrackpore Special Thana"
    incident_date: Optional[str] = ""
    incident_locus: Optional[str] = "Ichhapur Safehouse Corridor"
    case_status: Optional[str] = "Under Active Investigation / Warrant Issued"
    
    # Associated Network Entities
    phone_numbers: Optional[List[str]] = []
    vehicle_plates: Optional[List[str]] = []
    bank_accounts: Optional[List[str]] = []
    upi_ids: Optional[List[str]] = []
    crypto_wallets: Optional[List[str]] = []
    locations: Optional[List[str]] = []
    known_associates: Optional[List[str]] = []
    associate_relation: Optional[str] = "COLLABORATES_WITH"

    # Evidence Attachments & AI Predictions
    evidence_attachment: Optional[Dict[str, Any]] = None
    predicted_outcome: Optional[Dict[str, Any]] = None

    # Audit & Security Context
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
    """Merges two resolved entity nodes in the Knowledge Graph with audit trail and disk persistence."""
    merged = kg_store.merge_nodes(req.primary_entity_id, req.secondary_entity_id)

    # Persist updated graph to disk
    try:
        if Path(CASE_DATA_FILE).exists():
            with open(CASE_DATA_FILE, "r", encoding="utf-8") as f:
                cdata = json.load(f)
            cdata["graph_data"]["nodes"] = list(kg_store.nodes.values())
            cdata["graph_data"]["edges"] = kg_store.edges
            
            # Remove or update merged record in ER dataset
            er_dataset = cdata.get("entity_resolution_dataset", [])
            sec_name = ""
            for r in er_dataset:
                if r.get("id") == req.secondary_entity_id or req.secondary_entity_id in r.get("id", ""):
                    sec_name = r.get("full_name", "")
            
            # Re-label or remove secondary from ER dataset
            cdata["entity_resolution_dataset"] = [
                r for r in er_dataset 
                if r.get("id") != req.secondary_entity_id and req.secondary_entity_id not in r.get("id", "")
            ]
            
            with open(CASE_DATA_FILE, "w", encoding="utf-8") as f:
                json.dump(cdata, f, indent=2)
    except Exception as err:
        print(f"Warning: Failed to persist ER merge to {CASE_DATA_FILE}: {err}")

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
        "merged_node": merged,
        "total_nodes_remaining": len(kg_store.nodes),
        "total_edges_remaining": len(kg_store.edges),
        "statutory_note": "Entity resolution merge executed and logged to immutable ledger pursuant to BSA digital standards."
    }

# Ingestion & OCR / Legal NER
@app.post("/api/ingest/ocr-ner")
def ingest_text_or_document(req: IngestionRequest):
    """Runs Multilingual OCR (En/Hi/Bn) & Domain-Adapted Legal NER on input."""
    # 1. OCR text standardization
    ocr_result = ocr_processor.extract_text_from_document(req.raw_text, language=req.language)
    
    # 2. Domain-adapted NER extraction
    ner_result = legal_ner_engine.extract_entities(ocr_result["cleaned_text"], source_type=req.source_type)

    # 3. Build auto-filled suspect profile
    entities = ner_result.get("entities", {})
    bio_list = entities.get("biographic_data", [])
    bio = bio_list[0] if bio_list else {}
    comms = entities.get("communication_identifiers", [])
    vehs = entities.get("vehicular_logistics", [])
    fins = entities.get("financial_instruments", [])
    spats = entities.get("spatial_and_geographic", [])
    stats = entities.get("statutory_and_legal", {})
    crime_meta = stats.get("crime_details", {})

    extracted_phones = [c["value"] for c in comms if c.get("type") in ("Phone_Number", "Phone")]
    extracted_vehicles = [v["plate_number"] for v in vehs if "plate_number" in v]
    extracted_banks = [f["identifier"] for f in fins if f.get("type") == "Bank_Account"]
    extracted_upis = [f["identifier"] for f in fins if f.get("type") == "UPI_ID"]
    extracted_locs = [s["location_name"] for s in spats if "location_name" in s]

    stat_sections = stats.get("statutory_sections", [])
    structured_acts = []
    for s in stat_sections:
        s_str = str(s)
        act_name = "Arms Act 1959" if "arms" in s_str.lower() else "Information Technology Act 2000" if "it" in s_str.lower() else "Bharatiya Nyaya Sanhita (BNS) 2024"
        structured_acts.append({
            "act": act_name,
            "section": s_str,
            "title": f"Statutory Offence {s_str}",
            "explanation": f"Identified in FIR narrative and parsed under BNSS 173 protocol."
        })

    if not structured_acts:
        structured_acts = [
            {
                "act": "Bharatiya Nyaya Sanhita (BNS) 2024",
                "section": "Section 111",
                "title": "Organized Crime Syndicate Offence",
                "explanation": "Engaging in organized syndicate conspiracy, contraband logistics, or economic offences."
            }
        ]

    fir_num = stats.get("fir_number") or ocr_result.get("extracted_metadata", {}).get("fir_number") or f"FIR-2026/{abs(hash(req.raw_text[:50]))%900 + 100}/WB-BKP"
    thana = stats.get("police_station") or ocr_result.get("extracted_metadata", {}).get("police_station") or "Barrackpore Special Crime Thana"

    auto_filled_suspect = {
        "name": bio.get("full_name") or "Extracted Suspect",
        "aliases": bio.get("aliases", []),
        "role": bio.get("role_inferred") or crime_meta.get("role") or "Syndicate Operative",
        "threat_score": bio.get("threat_score") or (0.84 if any(w in req.raw_text.lower() for w in ["arms", "kingpin", "extortion", "pistol", "trafficking"]) else 0.75),
        "age": bio.get("age") or 32,
        "gender": bio.get("gender") or "Male",
        "father_or_relative": bio.get("father_or_relative"),
        "cctns_id": f"WB-CCTNS-2026-{abs(hash(req.raw_text[:40]))%90000 + 10000}",
        "crime_title": crime_meta.get("crime_title") or f"FIR Case: {fir_num}",
        "crime_category": crime_meta.get("crime_category") or ("Organized Crime & Firearms Trafficking" if any(w in req.raw_text.lower() for w in ["arms", "pistol", "firearm", "cartridge"]) else "Financial Fraud & Hawala"),
        "incident_narrative": crime_meta.get("incident_narrative") or ocr_result["cleaned_text"][:500],
        "modus_operandi": crime_meta.get("modus_operandi") or "Operates using concealed transit channels and telecommunication identifiers extracted from FIR scan.",
        "seized_contraband": crime_meta.get("seized_contraband") or "Seized items and physical evidence documented in legal narrative.",
        "statutory_acts": structured_acts,
        "fir_number": fir_num,
        "police_station": thana,
        "incident_date": stats.get("incident_date") or ocr_result.get("extracted_metadata", {}).get("incident_date") or datetime.utcnow().strftime("%Y-%m-%d %H:%M IST"),
        "incident_locus": stats.get("incident_locus") or (extracted_locs[0] if extracted_locs else "Barrackpore Jurisdiction Corridor"),
        "case_status": "Under Active Investigation / Evidence Admitted",
        "phone_numbers": extracted_phones,
        "vehicle_plates": extracted_vehicles,
        "bank_accounts": extracted_banks,
        "upi_ids": extracted_upis,
        "locations": extracted_locs
    }

    # 4. Log ingestion
    audit_logger.log_action(
        officer_badge=req.officer_badge,
        role=req.role,
        action="MULTIMODAL_INGESTION_OCR_NER",
        query_or_target=f"Source: {req.source_type} ({ocr_result['detected_language']})",
        resource_data={"entities_count": ner_result["total_entities_extracted"], "suspect_identified": auto_filled_suspect["name"]}
    )

    return {
        "ocr_processing": ocr_result,
        "legal_ner_extraction": ner_result,
        "auto_filled_suspect": auto_filled_suspect
    }

# Media Upload & AI Document OCR / Proof Extraction
@app.post("/api/ingest/upload-media")
async def upload_crime_media_and_extract(
    file: Optional[UploadFile] = File(None),
    raw_text: Optional[str] = Form(None),
    source_type: Optional[str] = Form("EVIDENCE_DOCUMENT"),
    officer_badge: Optional[str] = Form("IO-KOLKATA-8842"),
    role: Optional[str] = Form("Investigating Officer (IO)")
):
    """
    Ingests uploaded FIR documents, proof photos, seizure memos (PDF, PNG, JPG, TXT).
    Extracts text using Multilingual OCR & Gemini Multimodal Vision, extracts 6 legal ontologies,
    hashes evidence for BSA digital custody, and predicts historical outcome trajectory.
    """
    filename = "intelligence_document.txt"
    content_type = "text/plain"
    file_size = 0
    raw_content = ""

    if file:
        filename = file.filename
        content_type = file.content_type or "application/octet-stream"
        content_bytes = await file.read()
        file_size = len(content_bytes)
        file_hash = hashlib.sha256(content_bytes).hexdigest()
        ocr_result = ocr_processor.extract_text_from_document(content_bytes, filename=filename)
    elif raw_text:
        file_size = len(raw_text.encode("utf-8"))
        file_hash = hashlib.sha256(raw_text.encode("utf-8")).hexdigest()
        filename = "pasted_report.txt"
        content_type = "text/plain"
        ocr_result = ocr_processor.extract_text_from_document(raw_text, filename=filename)
    else:
        raise HTTPException(status_code=400, detail="No media file or text payload provided.")

    # 2. Legal NER extraction with cognitive Gemini comprehension
    ner_result = legal_ner_engine.extract_entities(ocr_result["cleaned_text"], source_type=source_type)

    # 3. Format Auto-filled Suspect & Crime Profile
    entities = ner_result.get("entities", {})
    bio_list = entities.get("biographic_data", [])
    bio = bio_list[0] if bio_list else {}
    comms = entities.get("communication_identifiers", [])
    vehs = entities.get("vehicular_logistics", [])
    fins = entities.get("financial_instruments", [])
    spats = entities.get("spatial_and_geographic", [])
    stats = entities.get("statutory_and_legal", {})
    crime_meta = stats.get("crime_details", {})

    extracted_phones = [c["value"] for c in comms if c.get("type") in ("Phone_Number", "Phone")]
    extracted_vehicles = [v["plate_number"] for v in vehs if "plate_number" in v]
    extracted_banks = [f["identifier"] for f in fins if f.get("type") == "Bank_Account"]
    extracted_upis = [f["identifier"] for f in fins if f.get("type") == "UPI_ID"]
    extracted_locs = [s["location_name"] for s in spats if "location_name" in s]

    stat_sections = stats.get("statutory_sections", [])
    structured_acts = []
    for s in stat_sections:
        s_str = str(s)
        act_name = "Arms Act 1959" if "arms" in s_str.lower() else "Information Technology Act 2000" if "it" in s_str.lower() else "Bharatiya Nyaya Sanhita (BNS) 2024"
        structured_acts.append({
            "act": act_name,
            "section": s_str,
            "title": f"Statutory Offence {s_str}",
            "explanation": f"Extracted from verified evidence scan ({filename}) and logged under BSA digital custody."
        })

    if not structured_acts:
        structured_acts = [
            {
                "act": "Bharatiya Nyaya Sanhita (BNS) 2024",
                "section": "Section 111",
                "title": "Organized Crime Syndicate Offence",
                "explanation": "Engaging in organized syndicate conspiracy, extortion, and contraband logistics."
            }
        ]

    fir_num = stats.get("fir_number") or ocr_result.get("extracted_metadata", {}).get("fir_number") or f"FIR-2026/{abs(hash(filename))%900 + 100}/WB-BKP"
    thana = stats.get("police_station") or ocr_result.get("extracted_metadata", {}).get("police_station") or "Barrackpore Special Crime Thana"
    
    cleaned_txt = ocr_result.get("cleaned_text", "")
    auto_filled_suspect = {
        "name": bio.get("full_name") or "Suspect Identified from Media",
        "aliases": bio.get("aliases", []),
        "role": bio.get("role_inferred") or crime_meta.get("role") or "Syndicate Operative",
        "threat_score": bio.get("threat_score") or (0.84 if any(w in cleaned_txt.lower() for w in ["arms", "kingpin", "extortion", "pistol", "trafficking"]) else 0.72),
        "age": bio.get("age") or 34,
        "gender": bio.get("gender") or "Male",
        "father_or_relative": bio.get("father_or_relative"),
        "cctns_id": f"WB-CCTNS-2026-{abs(hash(file_hash))%90000 + 10000}",
        "crime_title": crime_meta.get("crime_title") or f"Syndicate Offence: {fir_num}",
        "crime_category": crime_meta.get("crime_category") or ("Organized Crime & Firearms Trafficking" if any(w in cleaned_txt.lower() for w in ["arms", "pistol", "cartridge", "trafficking"]) else "Financial Fraud & Hawala"),
        "incident_narrative": crime_meta.get("incident_narrative") or cleaned_txt[:450],
        "modus_operandi": crime_meta.get("modus_operandi") or "Operates using concealed logistics channels and disposable telecommunication identifiers extracted from proof scan.",
        "seized_contraband": crime_meta.get("seized_contraband") or "Seized contraband items, communication hardware, and forensic materials documented in proof scan.",
        "statutory_acts": structured_acts,
        "fir_number": fir_num,
        "police_station": thana,
        "incident_date": stats.get("incident_date") or ocr_result.get("extracted_metadata", {}).get("incident_date") or datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M IST"),
        "incident_locus": stats.get("incident_locus") or (extracted_locs[0] if extracted_locs else "North 24 Parganas Corridor"),
        "case_status": "Under Active Investigation / Evidence Admitted",
        "phone_numbers": extracted_phones,
        "vehicle_plates": extracted_vehicles,
        "bank_accounts": extracted_banks,
        "upi_ids": extracted_upis,
        "locations": extracted_locs,
        "evidence_attachment": {
            "file_name": filename,
            "content_type": content_type,
            "file_size_bytes": file_size,
            "sha256_hash": file_hash,
            "bsa_digital_certificate": f"BSA-2024-CERT-{file_hash[:12].upper()}",
            "verified_at": datetime.now(timezone.utc).isoformat()
        }
    }

    # 4. Run AI Historical Pattern Recognition & Predictive Forecasting
    predictive_outcome = outcome_predictor.predict_case_outcome(auto_filled_suspect)
    auto_filled_suspect["predicted_outcome"] = predictive_outcome

    # 5. Log in cryptographic audit ledger
    audit_logger.log_action(
        officer_badge=officer_badge or "IO-KOLKATA-8842",
        role=role or "Investigating Officer (IO)",
        action="MEDIA_PROOF_UPLOAD_AND_AI_EXTRACTION",
        query_or_target=f"File: {filename} (SHA-256: {file_hash[:10]}...)",
        resource_data={
            "filename": filename,
            "file_hash": file_hash,
            "suspect_name": auto_filled_suspect["name"],
            "entities_extracted": ner_result.get("total_entities_extracted", 0),
            "matched_precedent": predictive_outcome.get("matched_historical_precedent", {}).get("case_title")
        }
    )

    return {
        "status": "SUCCESS_EXTRACTED",
        "file_info": auto_filled_suspect["evidence_attachment"],
        "ocr_processing": ocr_result,
        "legal_ner_extraction": ner_result,
        "auto_filled_suspect": auto_filled_suspect,
        "predictive_outcome": predictive_outcome
    }

# AI Predictive Outcome Endpoints
@app.post("/api/predict/outcome")
def predict_outcome_for_suspect(req: Dict[str, Any] = Body(...)):
    """Predicts upcoming syndicate outcome & escalation trajectory for given suspect/crime profile."""
    return outcome_predictor.predict_case_outcome(req)

@app.get("/api/predict/syndicate-outcomes")
def get_all_syndicate_predicted_outcomes():
    """Evaluates entire active Knowledge Graph against historical case archives."""
    suspects_predictions = []
    for nid, node in kg_store.nodes.items():
        if node.get("label") == "Person":
            props = node.get("properties", {})
            suspect_dossier = {
                "id": nid,
                "name": props.get("name", nid),
                "role": props.get("role", "Operative"),
                "threat_score": props.get("threat_score", 0.7),
                "crime_title": props.get("crime_details", {}).get("crime_title", "Syndicate Offence"),
                "crime_category": props.get("crime_details", {}).get("crime_category", "Organized Crime"),
                "incident_narrative": props.get("crime_details", {}).get("incident_narrative", ""),
                "modus_operandi": props.get("crime_details", {}).get("modus_operandi", ""),
                "seized_contraband": props.get("crime_details", {}).get("seized_contraband", ""),
                "bns_sections": props.get("bns_sections", [])
            }
            pred = outcome_predictor.predict_case_outcome(suspect_dossier)
            suspects_predictions.append({
                "suspect_id": nid,
                "suspect_name": props.get("name", nid),
                "role": props.get("role", "Operative"),
                "threat_score": props.get("threat_score", 0.7),
                "prediction": pred
            })
    
    suspects_predictions.sort(key=lambda x: x["prediction"]["overall_escalation_probability"], reverse=True)
    
    return {
        "status": "SYNDICATE_TRAJECTORY_EVALUATED",
        "total_suspects_evaluated": len(suspects_predictions),
        "overall_syndicate_threat": "CRITICAL_ESCALATION_WINDOW",
        "critical_syndicate_chokepoint": "Barrackpore-Ichhapur Logistics Transit & Hawala Dissipation",
        "top_imminent_threats": suspects_predictions[:4],
        "all_suspects_predictions": suspects_predictions
    }

# Suspect & Crime Intelligence Endpoints
@app.get("/api/suspects")
def get_all_suspects():
    """Returns all suspects indexed in the Knowledge Graph with detailed crime dossiers, evidence, and outcome forecasts."""
    suspects = []
    for nid, node in kg_store.nodes.items():
        if node.get("label") == "Person":
            props = node.get("properties", {})
            pred = props.get("predicted_outcome")
            if not pred:
                pred = outcome_predictor.predict_case_outcome({
                    "name": props.get("name", nid),
                    "role": props.get("role", "Unknown"),
                    "threat_score": props.get("threat_score", 0.5),
                    "crime_title": props.get("crime_details", {}).get("crime_title", ""),
                    "crime_category": props.get("crime_details", {}).get("crime_category", ""),
                    "incident_narrative": props.get("crime_details", {}).get("incident_narrative", ""),
                    "modus_operandi": props.get("crime_details", {}).get("modus_operandi", ""),
                    "bns_sections": props.get("bns_sections", [])
                })
            
            suspects.append({
                "id": nid,
                "name": props.get("name", nid),
                "aliases": props.get("aliases", []),
                "role": props.get("role", "Unknown"),
                "threat_score": props.get("threat_score", 0.5),
                "age": props.get("age"),
                "gender": props.get("gender", "Male"),
                "cctns_id": props.get("cctns_id", ""),
                "bns_sections": props.get("bns_sections", []),
                "crime_details": props.get("crime_details", {}),
                "evidence_attachment": props.get("evidence_attachment"),
                "predicted_outcome": pred,
                "neighbors_count": len(kg_store.get_neighbors(nid))
            })
    suspects.sort(key=lambda s: s.get("threat_score", 0.5), reverse=True)
    return suspects

@app.get("/api/crimes")
def get_all_crimes():
    """Returns all crime incidents, dossiers and statutory charges across the network."""
    crimes = []
    for nid, node in kg_store.nodes.items():
        if node.get("label") == "CrimeIncident":
            crimes.append({
                "id": nid,
                "type": "INCIDENT_NODE",
                "title": node["properties"].get("name", nid),
                "category": node["properties"].get("category", "General Crime"),
                "summary": node["properties"].get("summary", ""),
                "seized_items": node["properties"].get("seized_items", ""),
                "date": node["properties"].get("date", ""),
                "locus": node["properties"].get("locus", ""),
                "threat_level": node["properties"].get("threat_level", "HIGH")
            })
        elif node.get("label") == "FIR":
            crimes.append({
                "id": nid,
                "type": "FIR_RECORD",
                "fir_number": node["properties"].get("fir_number", nid),
                "title": node["properties"].get("crime_title", node["properties"].get("fir_number", nid)),
                "statute": node["properties"].get("statute", "BNS 2024"),
                "sections": node["properties"].get("sections", ""),
                "police_station": node["properties"].get("police_station", ""),
                "is_zero_fir": node["properties"].get("is_zero_fir", False),
                "case_status": node["properties"].get("case_status", "Under Investigation")
            })
            
    for nid, node in kg_store.nodes.items():
        if node.get("label") == "Person" and "crime_details" in node.get("properties", {}):
            cd = node["properties"]["crime_details"]
            crimes.append({
                "id": f"CRIME_PROFILE_{nid}",
                "type": "SUSPECT_CRIME_DOSSIER",
                "suspect_id": nid,
                "suspect_name": node["properties"].get("name", nid),
                "title": cd.get("crime_title", "Syndicate Offence"),
                "category": cd.get("crime_category", "Organized Crime"),
                "summary": cd.get("incident_narrative", ""),
                "modus_operandi": cd.get("modus_operandi", ""),
                "seized_items": cd.get("seized_contraband", ""),
                "statutory_acts": cd.get("statutory_acts", []),
                "fir_number": cd.get("fir_number", ""),
                "police_station": cd.get("police_station", ""),
                "date": cd.get("incident_date", ""),
                "locus": cd.get("incident_locus", ""),
                "case_status": cd.get("case_status", "Active Trial")
            })
    return crimes

@app.post("/api/suspects/add")
@app.post("/api/graph/add-suspect")
def add_new_suspect(req: AddSuspectRequest):
    """
    Ingests a new suspect with complete biometrics, network entities, and rich crime details
    directly into the Knowledge Graph and persists the intelligence.
    """
    import random
    existing_person_ids = [nid for nid, n in kg_store.nodes.items() if n.get("label") == "Person"]
    suspect_id = f"PERSON_{len(existing_person_ids) + 1:03d}"
    
    statutory_acts_data = []
    if req.statutory_acts:
        for sa in req.statutory_acts:
            statutory_acts_data.append({
                "act": sa.act,
                "section": sa.section,
                "title": sa.title or f"{sa.act} {sa.section}",
                "explanation": sa.explanation or "Statutory offence committed as part of criminal syndicate."
            })
    else:
        statutory_acts_data = [
            {
                "act": "Bharatiya Nyaya Sanhita (BNS) 2024",
                "section": "Section 111",
                "title": "Organized Crime Syndicate Offence",
                "explanation": "Active participation in organized syndicate conspiracy, extortion, and unlawful supply."
            },
            {
                "act": "Arms Act 1959",
                "section": "Section 25",
                "title": "Unlawful Possession of Arms",
                "explanation": "Procurement and transport of prohibited arms and ammunition."
            }
        ]

    bns_sections_list = req.bns_sections or [f"{sa['act']} {sa['section']}" for sa in statutory_acts_data]

    crime_details = {
        "crime_title": req.crime_title,
        "crime_category": req.crime_category or "Organized Crime Syndicate",
        "incident_narrative": req.incident_narrative,
        "modus_operandi": req.modus_operandi or "Operates in clandestine syndicates using burner communication devices.",
        "seized_contraband": req.seized_contraband or "Unlicenced weaponry, forged credentials, and illicit funds.",
        "statutory_acts": statutory_acts_data,
        "fir_number": req.fir_number or f"FIR-2026/{random.randint(100, 999)}/WB-BKP",
        "police_station": req.police_station or "Barrackpore Special Crime Thana",
        "incident_date": req.incident_date or "2026-08-28 19:30 IST",
        "incident_locus": req.incident_locus or "Kolkata-Ichhapur Tactical Hub",
        "case_status": req.case_status or "Under Active Investigation / Warrant Issued",
        "investigating_officer": req.officer_badge or "IO-KOLKATA-8842"
    }

    # Compute or attach predicted outcome
    predicted_outcome = req.predicted_outcome
    if not predicted_outcome:
        predicted_outcome = outcome_predictor.predict_case_outcome({
            "name": req.name,
            "role": req.role or "Syndicate Operative",
            "threat_score": float(req.threat_score or 0.75),
            "crime_title": req.crime_title,
            "crime_category": req.crime_category,
            "incident_narrative": req.incident_narrative,
            "modus_operandi": req.modus_operandi,
            "seized_contraband": req.seized_contraband,
            "bns_sections": bns_sections_list,
            "phone_numbers": req.phone_numbers or [],
            "vehicle_plates": req.vehicle_plates or []
        })

    cctns_id = req.cctns_id or f"WB-CCTNS-2026-{random.randint(10000, 99999)}"
    person_node = kg_store.add_node(
        node_id=suspect_id,
        label="Person",
        properties={
            "name": req.name,
            "aliases": req.aliases or [],
            "role": req.role or "Syndicate Operative",
            "threat_score": float(req.threat_score or 0.75),
            "attribute_load": float(req.attribute_load or 2.5),
            "age": req.age or 32,
            "gender": req.gender or "Male",
            "cctns_id": cctns_id,
            "bns_sections": bns_sections_list,
            "crime_details": crime_details,
            "evidence_attachment": req.evidence_attachment,
            "predicted_outcome": predicted_outcome
        }
    )

    nodes_added = [person_node]
    edges_added = []

    # Add Incident node
    incident_id = f"INCIDENT_{len(kg_store.nodes) + 1:03d}"
    incident_node = kg_store.add_node(
        node_id=incident_id,
        label="CrimeIncident",
        properties={
            "name": req.crime_title,
            "category": req.crime_category,
            "summary": req.incident_narrative,
            "seized_items": req.seized_contraband,
            "date": req.incident_date or "2026-08-28T19:30:00Z",
            "locus": req.incident_locus,
            "threat_level": "CRITICAL" if (req.threat_score or 0.75) >= 0.8 else "HIGH"
        }
    )
    nodes_added.append(incident_node)
    
    edge_inc = kg_store.add_edge(
        edge_id=f"EDGE_{len(kg_store.edges) + 1:03d}",
        source=suspect_id,
        target=incident_id,
        rel_type="INVOLVED_IN",
        properties={"confidence": 0.99, "weight": 2.2, "role": req.role}
    )
    edges_added.append(edge_inc)

    # Phones
    for idx, phone in enumerate(req.phone_numbers or []):
        clean_num = phone.strip()
        if clean_num:
            phone_id = f"PHONE_{clean_num.replace('+', '').replace('-', '').replace(' ', '')[-10:]}"
            p_node = kg_store.add_node(
                node_id=phone_id,
                label="Phone",
                properties={"number": clean_num, "subscriber": req.name, "service_provider": "Airtel / Jio"}
            )
            nodes_added.append(p_node)
            e = kg_store.add_edge(
                edge_id=f"EDGE_{len(kg_store.edges) + 1:03d}",
                source=suspect_id,
                target=phone_id,
                rel_type="OWNS",
                properties={"confidence": 0.99}
            )
            edges_added.append(e)

    # Vehicles
    for idx, plate in enumerate(req.vehicle_plates or []):
        clean_plate = plate.strip()
        if clean_plate:
            veh_id = f"VEHICLE_{clean_plate.replace('-', '').replace(' ', '').upper()}"
            v_node = kg_store.add_node(
                node_id=veh_id,
                label="Vehicle",
                properties={"plate_number": clean_plate, "make_model": "Transport Vehicle", "registered_owner": req.name}
            )
            nodes_added.append(v_node)
            e = kg_store.add_edge(
                edge_id=f"EDGE_{len(kg_store.edges) + 1:03d}",
                source=suspect_id,
                target=veh_id,
                rel_type="OPERATES_IN",
                properties={"confidence": 0.95, "weight": 1.8}
            )
            edges_added.append(e)

    # Bank Accounts & UPI
    for idx, acc in enumerate(req.bank_accounts or []):
        clean_acc = acc.strip()
        if clean_acc:
            acc_id = f"BANK_{clean_acc.replace(' ', '')[-6:]}"
            b_node = kg_store.add_node(
                node_id=acc_id,
                label="BankAccount",
                properties={"account_number": clean_acc, "bank_name": "Commercial Bank", "holder": req.name, "balance_flagged": 2500000}
            )
            nodes_added.append(b_node)
            e = kg_store.add_edge(
                edge_id=f"EDGE_{len(kg_store.edges) + 1:03d}",
                source=suspect_id,
                target=acc_id,
                rel_type="CONTROLS",
                properties={"confidence": 0.98, "weight": 2.5}
            )
            edges_added.append(e)

    for idx, upi in enumerate(req.upi_ids or []):
        clean_upi = upi.strip()
        if clean_upi:
            upi_id = f"UPI_{clean_upi.replace('@', '_').replace('.', '_')}"
            u_node = kg_store.add_node(
                node_id=upi_id,
                label="BankAccount",
                properties={"upi_id": clean_upi, "linked_name": req.name, "daily_flow_avg": 500000}
            )
            nodes_added.append(u_node)
            e = kg_store.add_edge(
                edge_id=f"EDGE_{len(kg_store.edges) + 1:03d}",
                source=suspect_id,
                target=upi_id,
                rel_type="CONTROLS",
                properties={"confidence": 0.98, "weight": 2.0}
            )
            edges_added.append(e)

    # Locations
    for idx, loc in enumerate(req.locations or []):
        clean_loc = loc.strip()
        if clean_loc:
            loc_id = f"LOC_{clean_loc.replace(' ', '_').upper()[:15]}"
            l_node = kg_store.add_node(
                node_id=loc_id,
                label="Location",
                properties={"name": clean_loc, "district": "West Bengal", "facility_type": "Suspect Locus"}
            )
            nodes_added.append(l_node)
            e = kg_store.add_edge(
                edge_id=f"EDGE_{len(kg_store.edges) + 1:03d}",
                source=suspect_id,
                target=loc_id,
                rel_type="PRESENT_AT",
                properties={"confidence": 0.94, "weight": 1.7, "timestamp": "2026-08-28T18:00:00Z"}
            )
            edges_added.append(e)

    # Known Associates
    for assoc_id in (req.known_associates or []):
        if assoc_id in kg_store.nodes:
            e = kg_store.add_edge(
                edge_id=f"EDGE_{len(kg_store.edges) + 1:03d}",
                source=suspect_id,
                target=assoc_id,
                rel_type=req.associate_relation or "COLLABORATES_WITH",
                properties={"confidence": 0.96, "weight": 2.0, "intercept_count": 15}
            )
            edges_added.append(e)

    # Persist to disk
    try:
        if Path(CASE_DATA_FILE).exists():
            with open(CASE_DATA_FILE, "r", encoding="utf-8") as f:
                cdata = json.load(f)
            cdata["graph_data"]["nodes"] = list(kg_store.nodes.values())
            cdata["graph_data"]["edges"] = kg_store.edges
            cdata.setdefault("entity_resolution_dataset", []).append({
                "id": f"REC_NEW_{suspect_id}",
                "full_name": req.name,
                "age": req.age or 32,
                "phones": req.phone_numbers or [],
                "vehicles": req.vehicle_plates or [],
                "financial_ids": req.bank_accounts or req.upi_ids or [],
                "known_associates": req.known_associates or [],
                "source_db": f"{crime_details['police_station']} Digital Record (2026)"
            })
            with open(CASE_DATA_FILE, "w", encoding="utf-8") as f:
                json.dump(cdata, f, indent=2)
    except Exception as err:
        print(f"Warning: Failed to persist to {CASE_DATA_FILE}: {err}")

    # Audit log
    audit_logger.log_action(
        officer_badge=req.officer_badge or "IO-KOLKATA-8842",
        role=req.role or "Investigating Officer (IO)",
        action="SUSPECT_INGESTION_WITH_CRIME_DETAILS",
        query_or_target=f"Added Suspect: {req.name} ({suspect_id}) | Crime: {req.crime_title}",
        resource_data={
            "suspect_id": suspect_id,
            "crime_title": req.crime_title,
            "statutory_acts_count": len(statutory_acts_data),
            "threat_score": req.threat_score,
            "nodes_added_count": len(nodes_added),
            "edges_added_count": len(edges_added)
        }
    )

    return {
        "success": True,
        "message": f"Suspect '{req.name}' with detailed crime dossier successfully added to Knowledge Graph.",
        "suspect_id": suspect_id,
        "incident_id": incident_id,
        "suspect_node": person_node,
        "nodes_added_count": len(nodes_added),
        "edges_added_count": len(edges_added),
        "total_graph_nodes": len(kg_store.nodes),
        "total_graph_edges": len(kg_store.edges)
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
