import hashlib
import hmac
import json
import time
from datetime import datetime, timezone
from enum import Enum
from typing import Dict, Any, List, Optional
from pathlib import Path
from backend.config import AUDIT_LOG_FILE, SECRET_KEY

class UserRole(str, Enum):
    INVESTIGATING_OFFICER = "Investigating Officer (IO)"
    INTELLIGENCE_ANALYST = "Intelligence Analyst (IA)"
    STATION_HOUSE_OFFICER = "Station House Officer (SHO)"
    FORENSIC_MAGISTRATE = "Forensic Magistrate (FM)"
    SYSTEM_ADMIN = "System Administrator (Admin)"

# RBAC Permissions Matrix aligned with Indian Criminal Justice & Police Directives
ROLE_PERMISSIONS = {
    UserRole.INVESTIGATING_OFFICER: [
        "view_cases", "view_graph", "run_graphrag_query", "view_hotspots",
        "ingest_fir", "ingest_cdr_ipdr", "view_trajectories"
    ],
    UserRole.INTELLIGENCE_ANALYST: [
        "view_cases", "view_graph", "run_graphrag_query", "view_hotspots",
        "ingest_fir", "ingest_cdr_ipdr", "view_trajectories",
        "run_gnn_prediction", "run_centrality_analytics", "simulate_disruption",
        "review_entity_resolution", "merge_entities"
    ],
    UserRole.STATION_HOUSE_OFFICER: [
        "view_cases", "view_graph", "run_graphrag_query", "view_hotspots",
        "ingest_fir", "ingest_cdr_ipdr", "view_trajectories",
        "run_gnn_prediction", "run_centrality_analytics", "simulate_disruption",
        "review_entity_resolution", "merge_entities",
        "approve_zero_fir_transfer", "issue_warrant_alert", "view_audit_trail"
    ],
    UserRole.FORENSIC_MAGISTRATE: [
        "view_cases", "view_graph", "run_graphrag_query", "view_audit_trail",
        "verify_cryptographic_custody", "export_bsa_certificate", "inspect_qap"
    ],
    UserRole.SYSTEM_ADMIN: [
        "view_cases", "view_graph", "run_graphrag_query", "view_hotspots",
        "ingest_fir", "ingest_cdr_ipdr", "view_trajectories",
        "run_gnn_prediction", "run_centrality_analytics", "simulate_disruption",
        "review_entity_resolution", "merge_entities", "approve_zero_fir_transfer",
        "view_audit_trail", "verify_cryptographic_custody", "export_bsa_certificate",
        "system_config", "inspect_qap"
    ]
}

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
    """
    def __init__(self, log_path: Path = AUDIT_LOG_FILE):
        self.log_path = log_path
        self._ensure_log_file()

    def _ensure_log_file(self):
        if not self.log_path.exists():
            genesis_entry = {
                "log_index": 0,
                "timestamp": datetime.now(timezone.utc).isoformat() + "Z",
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
        with open(self.log_path, "r", encoding="utf-8") as f:
            logs = json.load(f)

        last_entry = logs[-1] if logs else None
        prev_hash = last_entry["entry_hash"] if last_entry else "0" * 64
        next_index = len(logs)

        resource_hash = generate_evidence_hash(resource_data) if resource_data else generate_evidence_hash(query_or_target)

        new_entry = {
            "log_index": next_index,
            "timestamp": datetime.now(timezone.utc).isoformat() + "Z",
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
        if not self.log_path.exists():
            return []
        with open(self.log_path, "r", encoding="utf-8") as f:
            logs = json.load(f)
        return logs[-limit:]

    def verify_integrity(self) -> Dict[str, Any]:
        """Validates hash chain unbroken integrity for courtroom admissibility."""
        if not self.log_path.exists():
            return {"valid": False, "error": "Audit log file does not exist"}

        with open(self.log_path, "r", encoding="utf-8") as f:
            logs = json.load(f)

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
            "verification_timestamp": datetime.now(timezone.utc).isoformat() + "Z",
            "statutory_compliance": "Bharatiya Sakshya Adhiniyam (BSA) 2024 Section 63 Digital Evidence Standard"
        }

audit_logger = ImmutableAuditLogger()
