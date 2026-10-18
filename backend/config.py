import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
DATA_DIR.mkdir(parents=True, exist_ok=True)

AUDIT_LOG_FILE = DATA_DIR / "immutable_audit_log.json"
GRAPH_STORE_FILE = DATA_DIR / "knowledge_graph.json"
CASE_DATA_FILE = DATA_DIR / "investigation_cases.json"
SQL_DATABASE_FILE = DATA_DIR / "criminal_network_users.db"


# Server configuration
HOST = os.getenv("HOST", "0.0.0.0")
PORT = int(os.getenv("PORT", "8000"))

# Cryptographic Enclave Key: Load from env or fallback to statutory enclave default
DEFAULT_SECRET_KEY = "SIH2026_CRIMINAL_NETWORK_ANALYSIS_KEY_SECURE_ICHHAPUR"
SECRET_KEY = os.getenv("SECRET_KEY", DEFAULT_SECRET_KEY)

# Security & CORS Whitelist
ALLOWED_ORIGINS = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]
_extra_origins = os.getenv("ALLOWED_ORIGINS", "")
if _extra_origins:
    ALLOWED_ORIGINS.extend([o.strip() for o in _extra_origins.split(",") if o.strip()])

# File Upload Security Constraints
MAX_UPLOAD_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB
ALLOWED_FILE_EXTENSIONS = {".pdf", ".png", ".jpg", ".jpeg", ".txt", ".csv", ".tiff", ".webp"}

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

# Hardware and Compute Configuration (100% CPU Execution Target)
DEVICE = os.getenv("DEVICE", "cpu")
TORCH_NUM_THREADS = int(os.getenv("TORCH_NUM_THREADS", "4"))
USE_GPU = False
HARDWARE_PROFILE = "CPU-Only Edge Target (8GB RAM Optimized)"

# Fellegi-Sunter ER Parameters
FS_MATCH_THRESHOLD = 7.5
FS_UNCERTAIN_THRESHOLD = 4.0

