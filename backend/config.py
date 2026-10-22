import os
from pathlib import Path


class Config:
    # Base paths
    BASE_DIR = Path(__file__).resolve().parent.parent
    DATA_DIR = BASE_DIR / "data"
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    # Core File and Storage Paths
    AUDIT_LOG_PATH = str(
        DATA_DIR / os.getenv("AUDIT_LOG_FILENAME", "immutable_audit_log.json")
    )
    GRAPH_STORE_PATH = str(
        DATA_DIR / os.getenv("GRAPH_STORE_FILENAME", "knowledge_graph.json")
    )
    CASES_PATH = str(
        DATA_DIR / os.getenv("CASES_FILENAME", "investigation_cases.json")
    )
    DATABASE_PATH = str(
        DATA_DIR / os.getenv("DATABASE_FILENAME", "criminal_network_users.db")
    )

    # Server Configuration
    HOST = os.getenv("HOST", "0.0.0.0")
    PORT = int(os.getenv("PORT", "5000"))

    # Cryptographic & Security Settings
    DEFAULT_SECRET_KEY = (
        "SIH2026_CRIMINAL_NETWORK_ANALYSIS_KEY_SECURE_ICHHAPUR"
    )
    SECRET_KEY = os.getenv("SECRET_KEY", DEFAULT_SECRET_KEY)
    JWT_ALGORITHM = "HS256"
    JWT_EXPIRATION_MINUTES = int(os.getenv("JWT_EXPIRATION_MINUTES", "60"))

    # CORS Whitelist Settings
    ALLOWED_ORIGINS = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:5000",
        "http://127.0.0.1:5000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
    ]
    _extra_origins = os.getenv("ALLOWED_ORIGINS", "")
    if _extra_origins:
        ALLOWED_ORIGINS.extend(
            [o.strip() for o in _extra_origins.split(",") if o.strip()]
        )

    # File Upload Security Constraints
    MAX_UPLOAD_SIZE_BYTES = 15 * 1024 * 1024  # 15 MB
    ALLOWED_FILE_EXTENSIONS = {
        ".pdf",
        ".png",
        ".jpg",
        ".jpeg",
        ".txt",
        ".csv",
        ".tiff",
        ".webp",
    }

    # GNN and Deep Learning Hyperparameters
    GNN_EMBEDDING_DIM = int(os.getenv("GNN_EMBEDDING_DIM", "64"))
    GNN_HIDDEN_DIM = int(os.getenv("GNN_HIDDEN_DIM", "128"))
    GNN_NUM_LAYERS = int(os.getenv("GNN_NUM_LAYERS", "2"))
    GAT_HEADS = int(os.getenv("GAT_HEADS", "4"))
    LORA_RANK = int(os.getenv("LORA_RANK", "16"))
    LORA_ALPHA = int(os.getenv("LORA_ALPHA", "32"))
    LORA_DROPOUT = float(os.getenv("LORA_DROPOUT", "0.05"))

    # Spatio-Temporal Cluster Parameters
    DEFAULT_EPS_SPATIAL_KM = float(os.getenv("DEFAULT_EPS_SPATIAL_KM", "3.5"))
    DEFAULT_EPS_TEMPORAL_HOURS = float(
        os.getenv("DEFAULT_EPS_TEMPORAL_HOURS", "4.0")
    )
    DEFAULT_MIN_PTS = int(os.getenv("DEFAULT_MIN_PTS", "3"))

    # Compute & Hardware Profile Execution Targets
    DEVICE = os.getenv("DEVICE", "cpu")
    TORCH_NUM_THREADS = int(os.getenv("TORCH_NUM_THREADS", "4"))
    USE_GPU = False
    HARDWARE_PROFILE = "CPU-Only Edge Target (8GB RAM Optimized)"

    # Fellegi-Sunter ER Parameters
    FS_MATCH_THRESHOLD = float(os.getenv("FS_MATCH_THRESHOLD", "7.5"))
    FS_UNCERTAIN_THRESHOLD = float(os.getenv("FS_UNCERTAIN_THRESHOLD", "4.0"))


# Module-level variable exposures for backward compatibility
BASE_DIR = Config.BASE_DIR
DATA_DIR = Config.DATA_DIR
AUDIT_LOG_FILE = Config.AUDIT_LOG_PATH
GRAPH_STORE_FILE = Config.GRAPH_STORE_PATH
CASE_DATA_FILE = Config.CASES_PATH
SQL_DATABASE_FILE = Config.DATABASE_PATH
HOST = Config.HOST
PORT = Config.PORT
SECRET_KEY = Config.SECRET_KEY
ALLOWED_ORIGINS = Config.ALLOWED_ORIGINS
MAX_UPLOAD_SIZE_BYTES = Config.MAX_UPLOAD_SIZE_BYTES
ALLOWED_FILE_EXTENSIONS = Config.ALLOWED_FILE_EXTENSIONS
GNN_EMBEDDING_DIM = Config.GNN_EMBEDDING_DIM
GNN_HIDDEN_DIM = Config.GNN_HIDDEN_DIM
GNN_NUM_LAYERS = Config.GNN_NUM_LAYERS
GAT_HEADS = Config.GAT_HEADS
LORA_RANK = Config.LORA_RANK
LORA_ALPHA = Config.LORA_ALPHA
LORA_DROPOUT = Config.LORA_DROPOUT
DEFAULT_EPS_SPATIAL_KM = Config.DEFAULT_EPS_SPATIAL_KM
DEFAULT_EPS_TEMPORAL_HOURS = Config.DEFAULT_EPS_TEMPORAL_HOURS
DEFAULT_MIN_PTS = Config.DEFAULT_MIN_PTS
DEVICE = Config.DEVICE
TORCH_NUM_THREADS = Config.TORCH_NUM_THREADS
USE_GPU = Config.USE_GPU
HARDWARE_PROFILE = Config.HARDWARE_PROFILE
FS_MATCH_THRESHOLD = Config.FS_MATCH_THRESHOLD
FS_UNCERTAIN_THRESHOLD = Config.FS_UNCERTAIN_THRESHOLD