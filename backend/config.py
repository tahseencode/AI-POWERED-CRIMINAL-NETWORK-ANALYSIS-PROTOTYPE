import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

AUDIT_LOG_FILE = DATA_DIR / "immutable_audit_log.json"
GRAPH_STORE_FILE = DATA_DIR / "knowledge_graph.json"
CASE_DATA_FILE = DATA_DIR / "investigation_cases.json"

# Server configuration
HOST = "0.0.0.0"
PORT = 8000
SECRET_KEY = os.getenv("SECRET_KEY", "SIH2026_CRIMINAL_NETWORK_ANALYSIS_KEY_SECURE_ICHHAPUR")

# GNN and Model Hyperparameters
GNN_EMBEDDING_DIM = 64
GNN_HIDDEN_DIM = 128
GNN_NUM_LAYERS = 2
GAT_HEADS = 4
LORA_RANK = 16
LORA_ALPHA = 32
LORA_DROPOUT = 0.05

# Spatio-Temporal Parameters
DEFAULT_EPS_SPATIAL_KM = 3.5    # eps1: spatial distance threshold
DEFAULT_EPS_TEMPORAL_HOURS = 4.0 # eps2: temporal distance threshold
DEFAULT_MIN_PTS = 3             # MinPts for trajectory/hotspot cluster

# Fellegi-Sunter ER Parameters
FS_MATCH_THRESHOLD = 7.5
FS_UNCERTAIN_THRESHOLD = 4.0
