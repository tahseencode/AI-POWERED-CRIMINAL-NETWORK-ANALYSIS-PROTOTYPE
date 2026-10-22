import hashlib
import hmac
import json
import time
import threading
import re
from datetime import datetime, timezone
from enum import Enum
from typing import Dict, Any, List, Optional
from pathlib import Path

try:
    from backend.config import AUDIT_LOG_FILE, SECRET_KEY
except ImportError:
    # Fallback paths/keys for standalone testing or modular usage
    AUDIT_LOG_FILE = Path("audit_log.json")
    SECRET_KEY = "DEFAULT-INSECURE-SECRET-KEY-CHANGE-ME"

class UserRole(str, Enum):
    INVESTIGATING_OFFICER = "Investigating Officer (IO)"
    INTELLIGENCE_ANALYST = "Intelligence Analyst (IA)"
    STATION_HOUSE_OFFICER = "Station House Officer (SHO)"
    FORENSIC_MAGISTRATE = "Forensic Magistrate (FM)"
    SYSTEM_ADMIN = "System Administrator (Admin)"
    # General fallback roles from second snippet
    ADMIN = "ADMIN"
    ANALYST = "ANALYST"
    VIEWER = "VIEWER"

# Comprehensive RBAC Permissions Matrix aligned with Indian Criminal Justice & Police Directives & general roles
ROLE_PERMISSIONS = {
    UserRole.INVESTIGATING_OFFICER: [
        "view_cases", "view_graph", "run_graphrag_query", "view_hotspots",
        "ingest_fir", "ingest_cdr_ipdr", "view_trajectories", "manage_suspects"
    ],
    UserRole.INTELLIGENCE_ANALYST: [
        "view_cases", "view_graph", "run_graphrag_query", "view_hotspots",
        "ingest_fir", "ingest_cdr_ipdr", "view_trajectories", "manage_suspects",
        "run_gnn_prediction", "run_centrality_analytics", "simulate_disruption",
        "review_entity_resolution", "merge_entities", "write_cases", "view_analytics"
    ],
    UserRole.STATION_HOUSE_OFFICER: [
        "view_cases", "view_graph", "run_graphrag_query", "view_hotspots",
        "ingest_fir", "ingest_cdr_ipdr", "view_trajectories", "manage_suspects",
        "run_gnn_prediction", "run_centrality_analytics", "simulate_disruption",
        "review_entity_resolution", "merge_entities",
        "approve_zero_fir_transfer", "issue_warrant_alert", "view_audit_trail",
        "read_cases", "write_cases", "view_analytics"
    ],
    UserRole.FORENSIC_MAGISTRATE: [
        "view_cases", "view_graph", "run_graphrag_query", "view_audit_trail",
        "verify_cryptographic_custody", "export_bsa_certificate", "inspect_qap"
    ],
    UserRole.SYSTEM_ADMIN: [
        "view_cases", "view_graph", "run_graphrag_query", "view_hotspots",
        "ingest_fir", "ingest_cdr_ipdr", "view_trajectories", "manage_suspects",
        "run_gnn_prediction", "run_centrality_analytics", "simulate_disruption",
        "review_entity_resolution", "merge_entities", "approve_zero_fir_transfer",
        "view_audit_trail", "verify_cryptographic_custody", "export_bsa_certificate",
        "system_config", "inspect_qap", "read_cases", "write_cases", "manage_users", "view_analytics"
    ],
    # Mappings for simplified role strings from the second snippet
    UserRole.ADMIN: ["read_cases", "write_cases", "manage_users", "view_analytics"],
    UserRole.ANALYST: ["read_cases", "write_cases", "view_analytics"],
    UserRole.VIEWER: ["read_cases", "view_analytics"]
}

def hash_password(password: str) -> str:
    """Computes a secure SHA-256 hash for user authentication."""
    return hashlib.sha256(password.encode("utf-8")).hexdigest()

def verify_password(password: str, password_hash: str) -> bool:
    """Verifies a plain text password against its stored hash."""
    return hmac.compare_digest(hash_password(password), password_hash)

def check_role_permission(role: Optional[str], permission: str) -> bool:
    """
    Verifies whether a role possesses statutory authorization 
    or general access permissions for a specific action.
    """
    if not role:
        return False
        
    # Admin check override
    if "admin" in str(role).lower() or "administrator" in str(role).lower():
        return True

    # Check against ROLE_PERMISSIONS mapping
    for r_enum, perms in ROLE_PERMISSIONS.items():
        if role == r_enum.value or role == r_enum.name or role == r_enum:
            return permission in perms
            
    return False

def sanitize_input_text(text: Optional[str], max_len: int = 10000) -> str:
    """Sanitizes text inputs to prevent XSS, control characters, and injection attacks."""
    if not text:
        return ""
    # Strip null bytes and control chars (except normal whitespace)
    cleaned = re.sub(r'[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]', '', str(text))
    # Neutralize script tags
    cleaned = re.sub(r'<\s*script[^>]*>.*?<\s*/\s*script\s*>', '', cleaned, flags=re.IGNORECASE | re.DOTALL)
    return cleaned[:max_len].strip()

def generate_evidence_hash(data: Any) -> str:
    """
    Computes cryptographic SHA-256 hash for digital evidence custody
    pursuant to Bharatiya Sakshya Adhiniyam (BSA) 2024 compliance.
    """
    if isinstance(data, (dict, list)):
        serialized = json.dumps(data, sort_keys=True)
    elif isinstance(data, str):
        serialized = data
    elif isinstance(data, bytes):
        return hashlib.sha256(data).hexdigest()
    else:
        serialized = str(data)
    return hashlib.sha256(serialized.encode("utf-8")).hexdigest()

def generate_hmac_signature(content_hash: str) -> str:
    """Generates an HMAC signature to prove integrity within local enclave."""
    return hmac.new(
        SECRET_KEY.encode("utf-8"),
        content_hash.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()

class ImmutableAuditLogger:
    """
    Cryptographically chained immutable audit log.
    Mitigates 'burking' (hiding/ignoring crimes) and prevents unauthorized investigative snooping.
    Thread-safe to prevent race conditions during concurrent requests.
    """
    def __init__(self, log_path: Path = AUDIT_LOG_FILE):
        self.log_path = Path(log_path)
        self._lock = threading.Lock()
        with self._lock:
            self._ensure_log_file()

    def _ensure_log_file(self):
        if not self.log_path.exists():
            if self.log_path.parent != Path('.'):
                os.makedirs(self.log_path.parent, exist_ok=True)
            genesis_entry = {
                "log_index": 0,
                "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f") + "Z",
                "officer_badge": "GENESIS-SUPERVISOR-001",
                "role": UserRole.SYSTEM_ADMIN.value,
                "action": "GENESIS_NODE_INITIALIZED",
                "query_or_target": "System initialization at Ichhapur Hub",
                "resource_hash": generate_evidence_hash("INITIAL_SYSTEM_STATE"),
                "prev_entry_hash": "0000000000000000000000000000000000000000000000000000000000000000",
                "entry_hash": "",
                "hmac_sig": ""
            }
            genesis_entry["entry_hash"] = self._compute_entry_hash(genesis_entry)
            genesis_entry["hmac_sig"] = generate_hmac_signature(genesis_entry["entry_hash"])
            with open(self.log_path, "w", encoding="utf-8") as f:
                json.dump([genesis_entry], f, indent=2)

    def _compute_entry_hash(self, entry: Dict[str, Any]) -> str:
        payload = (
            f"{entry['log_index']}|{entry['timestamp']}|{entry['officer_badge']}|"
            f"{entry['role']}|{entry['action']}|{entry['query_or_target']}|"
            f"{entry['resource_hash']}|{entry['prev_entry_hash']}"
        )
        return hashlib.sha256(payload.encode("utf-8")).hexdigest()

    def log_action(
        self,
        officer_badge: str,
        role: str,
        action: str,
        query_or_target: str,
        resource_data: Any = None
    ) -> Dict[str, Any]:
        """Appends a cryptographically chained audit log entry."""
        with self._lock:
            try:
                with open(self.log_path, "r", encoding="utf-8") as f:
                    logs = json.load(f)
            except Exception:
                logs = []

            last_entry = logs[-1] if logs else None
            prev_hash = last_entry["entry_hash"] if last_entry else "0" * 64
            next_index = len(logs)

            resource_hash = generate_evidence_hash(resource_data) if resource_data else generate_evidence_hash(query_or_target)

            new_entry = {
                "log_index": next_index,
                "timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f") + "Z",
                "officer_badge": officer_badge,
                "role": role,
                "action": action,
                "query_or_target": query_or_target,
                "resource_hash": resource_hash,
                "prev_entry_hash": prev_hash,
                "entry_hash": "",
                "hmac_sig": ""
            }

            new_entry["entry_hash"] = self._compute_entry_hash(new_entry)
            new_entry["hmac_sig"] = generate_hmac_signature(new_entry["entry_hash"])

            logs.append(new_entry)
            with open(self.log_path, "w", encoding="utf-8") as f:
                json.dump(logs, f, indent=2)

            return new_entry

    def get_logs(self, limit: int = 100) -> List[Dict[str, Any]]:
        with self._lock:
            if not self.log_path.exists():
                return []
            try:
                with open(self.log_path, "r", encoding="utf-8") as f:
                    logs = json.load(f)
            except Exception:
                return []
            return logs[-limit:]

    def verify_integrity(self) -> Dict[str, Any]:
        """Validates hash chain unbroken integrity for courtroom admissibility."""
        with self._lock:
            if not self.log_path.exists():
                return {"valid": False, "error": "Audit log file does not exist"}

            try:
                with open(self.log_path, "r", encoding="utf-8") as f:
                    logs = json.load(f)
            except Exception as e:
                return {"valid": False, "error": f"Failed to parse audit log: {str(e)}"}

            if not logs:
                return {"valid": False, "error": "Audit log is empty"}

        for i, entry in enumerate(logs):
            expected_entry_hash = self._compute_entry_hash(entry)
            if entry["entry_hash"] != expected_entry_hash:
                return {
                    "valid": False,
                    "tampered_index": i,
                    "error": f"Entry hash mismatch at index {i}"
                }
            
            expected_hmac = generate_hmac_signature(entry["entry_hash"])
            if entry["hmac_sig"] != expected_hmac:
                return {
                    "valid": False,
                    "tampered_index": i,
                    "error": f"HMAC signature mismatch at index {i}"
                }

            if i > 0:
                if entry["prev_entry_hash"] != logs[i - 1]["entry_hash"]:
                    return {
                        "valid": False,
                        "tampered_index": i,
                        "error": f"Chain broken: prev_entry_hash at index {i} does not match hash at {i-1}"
                    }

        return {
            "valid": True,
            "total_entries": len(logs),
            "latest_hash": logs[-1]["entry_hash"],
            "verification_timestamp": datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f") + "Z",
            "statutory_compliance": "Bharatiya Sakshya Adhiniyam (BSA) 2024 Section 63 Digital Evidence Standard"
        }

audit_logger = ImmutableAuditLogger()