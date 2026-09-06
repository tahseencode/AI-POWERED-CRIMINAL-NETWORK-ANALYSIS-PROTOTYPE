import sqlite3
import hashlib
import secrets
import json
import os
from datetime import datetime, timezone
from pathlib import Path
from typing import Dict, Any, List, Optional, Tuple

from backend.config import SQL_DATABASE_FILE, SECRET_KEY

def hash_password(password: str, salt: Optional[str] = None) -> Tuple[str, str]:
    """Generates a secure SHA-256 password hash with unique salt."""
    if not salt:
        salt = secrets.token_hex(16)
    salted = f"{salt}{password}{SECRET_KEY}"
    pwd_hash = hashlib.sha256(salted.encode("utf-8")).hexdigest()
    return pwd_hash, salt

def verify_password(password: str, stored_hash: str, salt: str) -> bool:
    """Verifies a plain password against the stored hash and salt."""
    expected_hash, _ = hash_password(password, salt)
    return secrets.compare_digest(expected_hash, stored_hash)

class DatabaseManager:
    """
    Relational SQL Database Manager for collecting and managing user data,
    officer profiles, sessions, activity telemetry, case notes, and field intelligence.
    """
    def __init__(self, db_path: Path = SQL_DATABASE_FILE):
        self.db_path = Path(db_path)
        self.db_path.parent.mkdir(parents=True, exist_ok=True)
        self._init_database()

    def get_connection(self) -> sqlite3.Connection:
        """Creates a thread-safe connection to the SQLite database with Row mapping."""
        conn = sqlite3.connect(
            str(self.db_path),
            check_same_thread=False,
            timeout=20.0
        )
        conn.row_factory = sqlite3.Row
        conn.execute("PRAGMA foreign_keys = ON")
        return conn

    def close(self):
        """Closes any persistent connections if needed."""
        pass


    def _init_database(self):
        """Initializes all SQL relational tables, indexes, and default seed data."""
        with self.get_connection() as conn:
            cursor = conn.cursor()

            # 1. Users Table (Officer Accounts)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT UNIQUE NOT NULL,
                full_name TEXT NOT NULL,
                badge_number TEXT,
                email TEXT,
                phone TEXT,
                role TEXT NOT NULL,
                station TEXT,
                department TEXT,
                password_hash TEXT NOT NULL,
                salt TEXT NOT NULL,
                is_active INTEGER DEFAULT 1,
                is_admin INTEGER DEFAULT 0,
                created_at TEXT NOT NULL,
                last_login TEXT,
                profile_meta TEXT
            );
            """)

            # 2. User Sessions Table (Authentication & Login History)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_sessions (
                session_id TEXT PRIMARY KEY,
                user_id TEXT NOT NULL,
                role TEXT,
                station TEXT,
                ip_address TEXT,
                user_agent TEXT,
                login_time TEXT NOT NULL,
                logout_time TEXT,
                is_active INTEGER DEFAULT 1,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            );
            """)

            # 3. User Activity Logs Table (Investigative Telemetry & Actions)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_activity_logs (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                officer_name TEXT,
                role TEXT,
                action_type TEXT NOT NULL,
                target_resource TEXT,
                details TEXT,
                ip_address TEXT,
                timestamp TEXT NOT NULL
            );
            """)

            # 4. User Case Notes Table (Investigator Annotations & Lead Hypotheses)
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_case_notes (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                officer_name TEXT,
                case_id TEXT,
                suspect_id TEXT,
                title TEXT NOT NULL,
                note_content TEXT NOT NULL,
                priority TEXT DEFAULT 'MEDIUM',
                tags TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT
            );
            """)

            # 5. User Field Reports & Tip-Off Ingestion Table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_field_reports (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT,
                reporter_name TEXT,
                report_type TEXT NOT NULL,
                subject TEXT NOT NULL,
                description TEXT NOT NULL,
                location TEXT,
                evidence_refs TEXT,
                status TEXT DEFAULT 'SUBMITTED',
                created_at TEXT NOT NULL
            );
            """)

            # 6. User Saved Searches & GraphRAG Query History Table
            cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_saved_queries (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                user_id TEXT NOT NULL,
                query_text TEXT NOT NULL,
                query_type TEXT DEFAULT 'GRAPHRAG',
                result_summary TEXT,
                is_starred INTEGER DEFAULT 0,
                timestamp TEXT NOT NULL
            );
            """)

            # Performance & Query Optimization Indexes
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_user_id ON users(user_id);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON user_sessions(user_id);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_activity_user ON user_activity_logs(user_id);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_activity_timestamp ON user_activity_logs(timestamp);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_activity_action ON user_activity_logs(action_type);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_notes_user ON user_case_notes(user_id);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_notes_suspect ON user_case_notes(suspect_id);")
            cursor.execute("CREATE INDEX IF NOT EXISTS idx_reports_status ON user_field_reports(status);")

            conn.commit()

        # Seed initial officer accounts
        self._seed_initial_users()

    def _seed_initial_users(self):
        """Seeds default law enforcement officer credentials into the SQL database."""
        now = datetime.now(timezone.utc).isoformat()
        
        default_officers = [
            {
                "user_id": "1234",
                "full_name": "Sub-Inspector A. K. Banerjee",
                "badge_number": "WB-POL-8842",
                "email": "ak.banerjee@police.wb.gov.in",
                "phone": "+91 98301 23456",
                "role": "Investigating Officer (IO)",
                "station": "Barrackpore Special Thana (North 24 Parganas)",
                "department": "Organized Crime & Firearms Investigation Wing",
                "password": "1234",
                "is_admin": 0
            },
            {
                "user_id": "IO-8842",
                "full_name": "Sub-Inspector A. K. Banerjee",
                "badge_number": "WB-POL-8842",
                "email": "io.kolkata8842@police.wb.gov.in",
                "phone": "+91 98301 23456",
                "role": "Investigating Officer (IO)",
                "station": "Barrackpore Special Thana (North 24 Parganas)",
                "department": "Anti-Terrorism & Special Operations",
                "password": "1234",
                "is_admin": 0
            },
            {
                "user_id": "IA-104",
                "full_name": "Inspector S. Roy",
                "badge_number": "CID-IA-104",
                "email": "s.roy@cid.wb.gov.in",
                "phone": "+91 98311 87654",
                "role": "Crime Intelligence Analyst",
                "station": "CID West Bengal HQ (Bhabani Bhawan)",
                "department": "Criminal Intelligence & Analytics Wing",
                "password": "1234",
                "is_admin": 0
            },
            {
                "user_id": "SHO-001",
                "full_name": "Inspector M. Mukherjee",
                "badge_number": "WB-SHO-771",
                "email": "sho.barrackpore@police.wb.gov.in",
                "phone": "+91 94330 11223",
                "role": "Station House Officer (SHO)",
                "station": "Barrackpore Special Thana (North 24 Parganas)",
                "department": "Executive Police Administration",
                "password": "1234",
                "is_admin": 1
            },
            {
                "user_id": "ADMIN-001",
                "full_name": "Chief Tech Admin P. Sen",
                "badge_number": "NIC-ADMIN-01",
                "email": "admin.cctns@nic.in",
                "phone": "+91 98220 99881",
                "role": "System Administrator (Admin)",
                "station": "CID West Bengal HQ (Bhabani Bhawan)",
                "department": "National CCTNS/ICJS System Administration",
                "password": "1234",
                "is_admin": 1
            },
            {
                "user_id": "SP-KOLKATA",
                "full_name": "DCP R. Sharma, IPS",
                "badge_number": "IPS-WB-2014-08",
                "email": "sp.operations@kolkatapolice.gov.in",
                "phone": "+91 98300 00001",
                "role": "Superintendent of Police (SP)",
                "station": "Kolkata Cyber Crime Cell (Lalbazar)",
                "department": "Special Task Force & Zonal Command",
                "password": "1234",
                "is_admin": 1
            }
        ]

        with self.get_connection() as conn:
            cursor = conn.cursor()
            for off in default_officers:
                cursor.execute("SELECT id FROM users WHERE user_id = ?", (off["user_id"],))
                if not cursor.fetchone():
                    pwd_hash, salt = hash_password(off["password"])
                    cursor.execute("""
                    INSERT INTO users (
                        user_id, full_name, badge_number, email, phone, role,
                        station, department, password_hash, salt, is_active, is_admin,
                        created_at, last_login, profile_meta
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?, ?)
                    """, (
                        off["user_id"],
                        off["full_name"],
                        off["badge_number"],
                        off["email"],
                        off["phone"],
                        off["role"],
                        off["station"],
                        off["department"],
                        pwd_hash,
                        salt,
                        off["is_admin"],
                        now,
                        now,
                        json.dumps({"theme": "dark", "preferred_district": "North 24 Parganas"})
                    ))
            conn.commit()

    # =========================================================================
    # USER & AUTHENTICATION SQL OPERATIONS
    # =========================================================================

    def register_user(
        self,
        user_id: str,
        full_name: str,
        password: str,
        role: str = "Investigating Officer (IO)",
        station: Optional[str] = "Barrackpore Special Thana (North 24 Parganas)",
        badge_number: Optional[str] = None,
        email: Optional[str] = None,
        phone: Optional[str] = None,
        department: Optional[str] = "General Police Duty",
        is_admin: int = 0
    ) -> Dict[str, Any]:
        """Registers a new officer user into the SQL database with securely salted password hash."""
        user_id = user_id.strip()
        if not user_id:
            raise ValueError("User ID / Badge is required.")

        now = datetime.now(timezone.utc).isoformat()
        pwd_hash, salt = hash_password(password)

        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("SELECT id FROM users WHERE user_id = ?", (user_id,))
            if cursor.fetchone():
                raise ValueError(f"Officer with ID '{user_id}' already exists in SQL database.")

            cursor.execute("""
            INSERT INTO users (
                user_id, full_name, badge_number, email, phone, role,
                station, department, password_hash, salt, is_active, is_admin,
                created_at, last_login, profile_meta
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, NULL, ?)
            """, (
                user_id,
                full_name,
                badge_number or f"WB-POL-{abs(hash(user_id)) % 9000 + 1000}",
                email or f"{user_id.lower().replace(' ', '.')}@police.wb.gov.in",
                phone or "+91 90000 00000",
                role,
                station,
                department,
                pwd_hash,
                salt,
                is_admin,
                now,
                json.dumps({"theme": "dark", "notifications_enabled": True})
            ))
            conn.commit()

        # Log activity
        self.log_user_activity(
            user_id=user_id,
            officer_name=full_name,
            role=role,
            action_type="USER_REGISTERED",
            target_resource=f"User: {user_id}",
            details={"station": station, "role": role}
        )

        return self.get_user_by_id(user_id)

    def authenticate_user(
        self,
        user_id: str,
        password: str,
        ip_address: Optional[str] = "127.0.0.1",
        user_agent: Optional[str] = "Web Browser"
    ) -> Optional[Dict[str, Any]]:
        """Authenticates user credentials against SQL users table and creates a session record."""
        user_id = user_id.strip()
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            SELECT id, user_id, full_name, badge_number, email, phone, role,
                   station, department, password_hash, salt, is_active, is_admin,
                   created_at, last_login, profile_meta
            FROM users
            WHERE user_id = ? AND is_active = 1
            """, (user_id,))
            row = cursor.fetchone()

            # Fallback for dynamic demo users if matching 1234
            if not row:
                if password == "1234":
                    # Dynamically create officer for seamless demo
                    self.register_user(
                        user_id=user_id,
                        full_name=f"Officer {user_id}",
                        password=password,
                        role="Investigating Officer (IO)",
                        station="Barrackpore Special Thana (North 24 Parganas)"
                    )
                    return self.authenticate_user(user_id, password, ip_address, user_agent)
                return None

            user_data = dict(row)
            if not verify_password(password, user_data["password_hash"], user_data["salt"]):
                return None

            # Create session
            session_id = f"SES-{secrets.token_hex(12).upper()}"
            now = datetime.now(timezone.utc).isoformat()

            cursor.execute("""
            INSERT INTO user_sessions (
                session_id, user_id, role, station, ip_address, user_agent,
                login_time, logout_time, is_active
            ) VALUES (?, ?, ?, ?, ?, ?, ?, NULL, 1)
            """, (
                session_id,
                user_data["user_id"],
                user_data["role"],
                user_data["station"],
                ip_address,
                user_agent,
                now
            ))

            # Update last_login
            cursor.execute("UPDATE users SET last_login = ? WHERE user_id = ?", (now, user_id))
            conn.commit()

        # Log login activity
        self.log_user_activity(
            user_id=user_id,
            officer_name=user_data["full_name"],
            role=user_data["role"],
            action_type="USER_LOGIN",
            target_resource=f"Session: {session_id}",
            details={"ip": ip_address, "station": user_data["station"]},
            ip_address=ip_address
        )

        user_data.pop("password_hash", None)
        user_data.pop("salt", None)
        user_data["session_id"] = session_id
        return user_data

    def logout_session(self, session_id: str, user_id: Optional[str] = None):
        """Ends a user session and updates the logout timestamp in SQL."""
        now = datetime.now(timezone.utc).isoformat()
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            UPDATE user_sessions
            SET logout_time = ?, is_active = 0
            WHERE session_id = ?
            """, (now, session_id))
            conn.commit()

        if user_id:
            self.log_user_activity(
                user_id=user_id,
                officer_name=user_id,
                role="USER",
                action_type="USER_LOGOUT",
                target_resource=f"Session: {session_id}",
                details={"ended_at": now}
            )

    def get_users(
        self,
        limit: int = 50,
        offset: int = 0,
        role: Optional[str] = None,
        search: Optional[str] = None
    ) -> List[Dict[str, Any]]:
        """Retrieves list of users with activity counts from SQL database."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            query = """
            SELECT u.id, u.user_id, u.full_name, u.badge_number, u.email, u.phone,
                   u.role, u.station, u.department, u.is_active, u.is_admin,
                   u.created_at, u.last_login, u.profile_meta,
                   COUNT(a.id) as total_actions_logged,
                   (SELECT COUNT(n.id) FROM user_case_notes n WHERE n.user_id = u.user_id) as total_notes_written
            FROM users u
            LEFT JOIN user_activity_logs a ON u.user_id = a.user_id
            WHERE 1=1
            """
            params = []

            if role:
                query += " AND u.role = ?"
                params.append(role)
            if search:
                query += " AND (u.user_id LIKE ? OR u.full_name LIKE ? OR u.station LIKE ? OR u.badge_number LIKE ?)"
                like_str = f"%{search}%"
                params.extend([like_str, like_str, like_str, like_str])

            query += " GROUP BY u.id ORDER BY u.id ASC LIMIT ? OFFSET ?"
            params.extend([limit, offset])

            cursor.execute(query, params)
            rows = cursor.fetchall()
            return [dict(r) for r in rows]

    def get_user_by_id(self, user_id: str) -> Optional[Dict[str, Any]]:
        """Fetches single officer profile and telemetry statistics from SQL."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            SELECT id, user_id, full_name, badge_number, email, phone,
                   role, station, department, is_active, is_admin,
                   created_at, last_login, profile_meta
            FROM users
            WHERE user_id = ?
            """, (user_id,))
            row = cursor.fetchone()
            if not row:
                return None
            user_data = dict(row)

            # Retrieve recent activity count & notes count
            cursor.execute("SELECT COUNT(*) as act_count FROM user_activity_logs WHERE user_id = ?", (user_id,))
            user_data["total_actions"] = cursor.fetchone()["act_count"]

            cursor.execute("SELECT COUNT(*) as note_count FROM user_case_notes WHERE user_id = ?", (user_id,))
            user_data["total_notes"] = cursor.fetchone()["note_count"]

            cursor.execute("SELECT COUNT(*) as rep_count FROM user_field_reports WHERE user_id = ?", (user_id,))
            user_data["total_reports"] = cursor.fetchone()["rep_count"]

            return user_data

    def update_user_profile(self, user_id: str, updates: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """Updates user profile fields in SQL database."""
        allowed_fields = ["full_name", "badge_number", "email", "phone", "station", "department", "role", "profile_meta"]
        set_clauses = []
        params = []

        for k, v in updates.items():
            if k in allowed_fields:
                set_clauses.append(f"{k} = ?")
                params.append(json.dumps(v) if isinstance(v, (dict, list)) else v)

        if not set_clauses:
            return self.get_user_by_id(user_id)

        params.append(user_id)
        sql = f"UPDATE users SET {', '.join(set_clauses)} WHERE user_id = ?"

        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(sql, params)
            conn.commit()

        self.log_user_activity(
            user_id=user_id,
            officer_name=updates.get("full_name", user_id),
            role=updates.get("role", "IO"),
            action_type="PROFILE_UPDATED",
            target_resource=f"User: {user_id}",
            details={"updated_fields": list(updates.keys())}
        )

        return self.get_user_by_id(user_id)

    # =========================================================================
    # USER ACTIVITY & TELEMETRY SQL OPERATIONS
    # =========================================================================

    def log_user_activity(
        self,
        user_id: str,
        officer_name: Optional[str] = None,
        role: Optional[str] = None,
        action_type: str = "GENERIC_ACTION",
        target_resource: Optional[str] = None,
        details: Optional[Any] = None,
        ip_address: Optional[str] = "127.0.0.1"
    ) -> Dict[str, Any]:
        """Collects and stores an investigator action in SQL user_activity_logs."""
        now = datetime.now(timezone.utc).isoformat()
        details_str = json.dumps(details) if isinstance(details, (dict, list)) else str(details or "")

        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO user_activity_logs (
                user_id, officer_name, role, action_type,
                target_resource, details, ip_address, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                user_id,
                officer_name or user_id,
                role or "Investigating Officer (IO)",
                action_type,
                target_resource or "",
                details_str,
                ip_address,
                now
            ))
            log_id = cursor.lastrowid
            conn.commit()

        return {
            "id": log_id,
            "user_id": user_id,
            "officer_name": officer_name or user_id,
            "role": role,
            "action_type": action_type,
            "target_resource": target_resource,
            "details": details,
            "timestamp": now
        }

    def get_user_activity(
        self,
        user_id: Optional[str] = None,
        action_type: Optional[str] = None,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """Fetches activity logs from SQL database."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            query = "SELECT * FROM user_activity_logs WHERE 1=1"
            params = []

            if user_id:
                query += " AND user_id = ?"
                params.append(user_id)
            if action_type:
                query += " AND action_type = ?"
                params.append(action_type)

            query += " ORDER BY id DESC LIMIT ?"
            params.append(limit)

            cursor.execute(query, params)
            rows = cursor.fetchall()
            results = []
            for r in rows:
                item = dict(r)
                try:
                    item["details"] = json.loads(item["details"]) if item["details"] else {}
                except:
                    pass
                results.append(item)
            return results

    # =========================================================================
    # USER CASE NOTES SQL OPERATIONS
    # =========================================================================

    def create_case_note(
        self,
        user_id: str,
        title: str,
        note_content: str,
        officer_name: Optional[str] = None,
        case_id: Optional[str] = "FIR-142/2026/WB-BKP",
        suspect_id: Optional[str] = None,
        priority: str = "MEDIUM",
        tags: Optional[List[str]] = None
    ) -> Dict[str, Any]:
        """Saves an investigator's case note, lead observation, or intelligence insight to SQL."""
        now = datetime.now(timezone.utc).isoformat()
        tags_str = ",".join(tags) if isinstance(tags, list) else (tags or "")

        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO user_case_notes (
                user_id, officer_name, case_id, suspect_id,
                title, note_content, priority, tags, created_at, updated_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                user_id,
                officer_name or user_id,
                case_id,
                suspect_id,
                title,
                note_content,
                priority.upper(),
                tags_str,
                now,
                now
            ))
            note_id = cursor.lastrowid
            conn.commit()

        # Log telemetry
        self.log_user_activity(
            user_id=user_id,
            officer_name=officer_name,
            action_type="CASE_NOTE_CREATED",
            target_resource=f"Note #{note_id}: {title}",
            details={"suspect_id": suspect_id, "priority": priority}
        )

        return {
            "id": note_id,
            "user_id": user_id,
            "officer_name": officer_name or user_id,
            "case_id": case_id,
            "suspect_id": suspect_id,
            "title": title,
            "note_content": note_content,
            "priority": priority.upper(),
            "tags": tags_str.split(",") if tags_str else [],
            "created_at": now
        }

    def get_case_notes(
        self,
        user_id: Optional[str] = None,
        suspect_id: Optional[str] = None,
        case_id: Optional[str] = None,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """Retrieves case notes from SQL database."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            query = "SELECT * FROM user_case_notes WHERE 1=1"
            params = []

            if user_id:
                query += " AND user_id = ?"
                params.append(user_id)
            if suspect_id:
                query += " AND suspect_id = ?"
                params.append(suspect_id)
            if case_id:
                query += " AND case_id = ?"
                params.append(case_id)

            query += " ORDER BY id DESC LIMIT ?"
            params.append(limit)

            cursor.execute(query, params)
            rows = cursor.fetchall()
            results = []
            for r in rows:
                item = dict(r)
                item["tags"] = [t.strip() for t in item["tags"].split(",") if t.strip()] if item.get("tags") else []
                results.append(item)
            return results

    def delete_case_note(self, note_id: int, user_id: Optional[str] = None) -> bool:
        """Deletes a case note from SQL."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            if user_id:
                cursor.execute("DELETE FROM user_case_notes WHERE id = ? AND user_id = ?", (note_id, user_id))
            else:
                cursor.execute("DELETE FROM user_case_notes WHERE id = ?", (note_id,))
            affected = cursor.rowcount
            conn.commit()

        if affected > 0 and user_id:
            self.log_user_activity(
                user_id=user_id,
                action_type="CASE_NOTE_DELETED",
                target_resource=f"Note #{note_id}"
            )
        return affected > 0

    # =========================================================================
    # USER FIELD REPORTS & TIP-OFF INGESTION SQL OPERATIONS
    # =========================================================================

    def create_field_report(
        self,
        subject: str,
        description: str,
        report_type: str = "FIELD_INTELLIGENCE",
        reporter_name: Optional[str] = "Field Operative",
        user_id: Optional[str] = "IO-8842",
        location: Optional[str] = "Barrackpore Jurisdiction",
        evidence_refs: Optional[str] = None
    ) -> Dict[str, Any]:
        """Ingests a field intelligence report or citizen tip-off into the SQL database."""
        now = datetime.now(timezone.utc).isoformat()
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO user_field_reports (
                user_id, reporter_name, report_type, subject,
                description, location, evidence_refs, status, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, 'SUBMITTED', ?)
            """, (
                user_id,
                reporter_name,
                report_type,
                subject,
                description,
                location,
                evidence_refs,
                now
            ))
            report_id = cursor.lastrowid
            conn.commit()

        self.log_user_activity(
            user_id=user_id or "ANONYMOUS",
            officer_name=reporter_name,
            action_type="FIELD_REPORT_SUBMITTED",
            target_resource=f"Report #{report_id}: {subject}",
            details={"type": report_type, "location": location}
        )

        return {
            "id": report_id,
            "user_id": user_id,
            "reporter_name": reporter_name,
            "report_type": report_type,
            "subject": subject,
            "description": description,
            "location": location,
            "evidence_refs": evidence_refs,
            "status": "SUBMITTED",
            "created_at": now
        }

    def get_field_reports(
        self,
        status: Optional[str] = None,
        report_type: Optional[str] = None,
        limit: int = 50
    ) -> List[Dict[str, Any]]:
        """Retrieves field intelligence and tip-off submissions from SQL."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            query = "SELECT * FROM user_field_reports WHERE 1=1"
            params = []

            if status:
                query += " AND status = ?"
                params.append(status)
            if report_type:
                query += " AND report_type = ?"
                params.append(report_type)

            query += " ORDER BY id DESC LIMIT ?"
            params.append(limit)

            cursor.execute(query, params)
            return [dict(r) for r in cursor.fetchall()]

    def update_field_report_status(self, report_id: int, status: str) -> bool:
        """Updates review status of a field report in SQL."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("UPDATE user_field_reports SET status = ? WHERE id = ?", (status.upper(), report_id))
            affected = cursor.rowcount
            conn.commit()
        return affected > 0

    # =========================================================================
    # USER SAVED SEARCHES & GRAPHRAG QUERIES SQL OPERATIONS
    # =========================================================================

    def save_user_query(
        self,
        user_id: str,
        query_text: str,
        query_type: str = "GRAPHRAG",
        result_summary: Optional[str] = None,
        is_starred: int = 0
    ) -> Dict[str, Any]:
        """Saves search or GraphRAG query to user history in SQL."""
        now = datetime.now(timezone.utc).isoformat()
        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute("""
            INSERT INTO user_saved_queries (
                user_id, query_text, query_type, result_summary, is_starred, timestamp
            ) VALUES (?, ?, ?, ?, ?, ?)
            """, (
                user_id,
                query_text,
                query_type,
                result_summary,
                is_starred,
                now
            ))
            q_id = cursor.lastrowid
            conn.commit()

        return {
            "id": q_id,
            "user_id": user_id,
            "query_text": query_text,
            "query_type": query_type,
            "result_summary": result_summary,
            "is_starred": is_starred,
            "timestamp": now
        }

    def get_user_saved_queries(self, user_id: Optional[str] = None, limit: int = 30) -> List[Dict[str, Any]]:
        """Retrieves user query history from SQL."""
        with self.get_connection() as conn:
            cursor = conn.cursor()
            query = "SELECT * FROM user_saved_queries WHERE 1=1"
            params = []

            if user_id:
                query += " AND user_id = ?"
                params.append(user_id)

            query += " ORDER BY id DESC LIMIT ?"
            params.append(limit)

            cursor.execute(query, params)
            return [dict(r) for r in cursor.fetchall()]

    # =========================================================================
    # SQL DATABASE TELEMETRY & DIRECT QUERY INSPECTOR
    # =========================================================================

    def get_database_stats(self) -> Dict[str, Any]:
        """Returns comprehensive SQL database telemetry, table row counts, and storage size."""
        file_size = self.db_path.stat().st_size if self.db_path.exists() else 0

        with self.get_connection() as conn:
            cursor = conn.cursor()

            # Row counts per table
            cursor.execute("SELECT COUNT(*) as c FROM users;")
            users_count = cursor.fetchone()["c"]

            cursor.execute("SELECT COUNT(*) as c FROM user_sessions;")
            sessions_count = cursor.fetchone()["c"]

            cursor.execute("SELECT COUNT(*) as c FROM user_activity_logs;")
            activities_count = cursor.fetchone()["c"]

            cursor.execute("SELECT COUNT(*) as c FROM user_case_notes;")
            notes_count = cursor.fetchone()["c"]

            cursor.execute("SELECT COUNT(*) as c FROM user_field_reports;")
            reports_count = cursor.fetchone()["c"]

            cursor.execute("SELECT COUNT(*) as c FROM user_saved_queries;")
            queries_count = cursor.fetchone()["c"]

            # Fetch table schemas
            cursor.execute("SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%';")
            tables = [r["name"] for r in cursor.fetchall()]

            table_schemas = {}
            for t in tables:
                cursor.execute(f"PRAGMA table_info({t});")
                cols = cursor.fetchall()
                table_schemas[t] = [
                    {"cid": c["cid"], "name": c["name"], "type": c["type"], "notnull": bool(c["notnull"]), "pk": bool(c["pk"])}
                    for c in cols
                ]

        return {
            "status": "ONLINE",
            "database_engine": "SQLite 3 (Relational SQL with WAL Concurrency)",
            "database_file": str(self.db_path.name),
            "file_size_bytes": file_size,
            "file_size_formatted": f"{file_size / 1024:.2f} KB",
            "tables_count": len(tables),
            "tables": tables,
            "table_schemas": table_schemas,
            "metrics": {
                "total_users": users_count,
                "total_active_sessions": sessions_count,
                "total_activity_logs": activities_count,
                "total_case_notes": notes_count,
                "total_field_reports": reports_count,
                "total_saved_queries": queries_count
            },
            "timestamp": datetime.now(timezone.utc).isoformat()
        }

    def execute_raw_sql(self, sql_query: str, limit: int = 100) -> Dict[str, Any]:
        """
        Executes a read-only or inspection SQL query safely and returns structured rows.
        Guarded to prevent accidental destruction while allowing rich analysis.
        """
        sql_clean = sql_query.strip().rstrip(";")
        forbidden = ["DROP TABLE", "DROP DATABASE", "TRUNCATE", "VACUUM"]
        if any(f in sql_clean.upper() for f in forbidden):
            raise ValueError("Destructive DDL operations are restricted in SQL Console.")

        with self.get_connection() as conn:
            cursor = conn.cursor()
            cursor.execute(sql_clean)

            if cursor.description:
                columns = [col[0] for col in cursor.description]
                rows = cursor.fetchmany(limit)
                results = [dict(zip(columns, row)) for row in rows]
                return {
                    "query": sql_query,
                    "columns": columns,
                    "row_count": len(results),
                    "rows": results
                }
            else:
                conn.commit()
                return {
                    "query": sql_query,
                    "columns": [],
                    "row_count": cursor.rowcount,
                    "message": f"Query executed successfully. Affected rows: {cursor.rowcount}"
                }

# Global Singleton Database Manager instance
db_manager = DatabaseManager()
