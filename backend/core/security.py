import datetime
import hashlib
import json
import os


def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode("utf-8")).hexdigest()


def verify_password(password: str, password_hash: str) -> bool:
    return hash_password(password) == password_hash


def check_rbac_permission(role: str, permission: str) -> bool:
    permissions = {
        "ADMIN": ["read_cases", "write_cases", "manage_users", "view_analytics"],
        "ANALYST": ["read_cases", "write_cases", "view_analytics"],
        "VIEWER": ["read_cases", "view_analytics"],
    }
    allowed = permissions.get(role, [])
    return permission in allowed


def log_audit_event(
    log_file_path: str, user_id: int, event_type: str, details: str
) -> None:
    os.makedirs(os.path.dirname(log_file_path), exist_ok=True)
    log_entry = {
        "timestamp": datetime.datetime.utcnow().isoformat(),
        "user_id": user_id,
        "event_type": event_type,
        "details": details,
    }

    logs = []
    if os.path.exists(log_file_path):
        try:
            with open(log_file_path, "r") as f:
                logs = json.load(f)
        except Exception:
            logs = []

    logs.append(log_entry)
    with open(log_file_path, "w") as f:
        json.dump(logs, f, indent=2)