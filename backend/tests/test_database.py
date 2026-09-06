import unittest
import os
import tempfile
from pathlib import Path
from backend.core.database import DatabaseManager, hash_password, verify_password

class TestSQLDatabase(unittest.TestCase):
    def setUp(self):
        self.temp_dir = tempfile.TemporaryDirectory()
        self.db_path = Path(self.temp_dir.name) / "test_users.db"
        self.db = DatabaseManager(db_path=self.db_path)

    def tearDown(self):
        try:
            self.temp_dir.cleanup()
        except Exception:
            pass


    def test_schema_creation_and_seeding(self):
        stats = self.db.get_database_stats()
        self.assertEqual(stats["status"], "ONLINE")
        self.assertIn("users", stats["tables"])
        self.assertIn("user_sessions", stats["tables"])
        self.assertIn("user_activity_logs", stats["tables"])
        self.assertIn("user_case_notes", stats["tables"])
        self.assertIn("user_field_reports", stats["tables"])
        self.assertIn("user_saved_queries", stats["tables"])
        self.assertGreaterEqual(stats["metrics"]["total_users"], 4)

    def test_user_authentication_success(self):
        # Default user 1234 / 1234
        auth = self.db.authenticate_user("1234", "1234")
        self.assertIsNotNone(auth)
        self.assertEqual(auth["user_id"], "1234")
        self.assertEqual(auth["full_name"], "Sub-Inspector A. K. Banerjee")
        self.assertIn("session_id", auth)

    def test_user_authentication_failure(self):
        auth = self.db.authenticate_user("1234", "wrongpassword")
        self.assertIsNone(auth)

    def test_user_registration(self):
        new_user = self.db.register_user(
            user_id="IO-NEW-99",
            full_name="Sub-Inspector Test Officer",
            password="securepassword123",
            role="Investigating Officer (IO)",
            station="Kolkata Cyber Crime Cell (Lalbazar)"
        )
        self.assertEqual(new_user["user_id"], "IO-NEW-99")
        self.assertEqual(new_user["full_name"], "Sub-Inspector Test Officer")

        # Test login with new user
        auth = self.db.authenticate_user("IO-NEW-99", "securepassword123")
        self.assertIsNotNone(auth)
        self.assertEqual(auth["user_id"], "IO-NEW-99")

    def test_user_activity_logging(self):
        log = self.db.log_user_activity(
            user_id="1234",
            officer_name="Sub-Inspector A. K. Banerjee",
            role="Investigating Officer (IO)",
            action_type="SEARCH_CRIMINAL_NETWORK",
            target_resource="Suspect: Vicky Singh",
            details={"threat_score": 0.88, "query": "Arms transit"}
        )
        self.assertEqual(log["action_type"], "SEARCH_CRIMINAL_NETWORK")
        activities = self.db.get_user_activity(user_id="1234")
        self.assertGreater(len(activities), 0)
        self.assertEqual(activities[0]["action_type"], "SEARCH_CRIMINAL_NETWORK")

    def test_case_notes_crud(self):
        note = self.db.create_case_note(
            user_id="1234",
            title="Surveillance at Ichhapur Border",
            note_content="Vehicle WB-24-AX-5512 spotted near arms depot.",
            suspect_id="PERSON_001",
            priority="HIGH",
            tags=["Arms", "Border", "Surveillance"]
        )
        self.assertEqual(note["title"], "Surveillance at Ichhapur Border")
        self.assertEqual(note["priority"], "HIGH")

        notes = self.db.get_case_notes(user_id="1234")
        self.assertGreater(len(notes), 0)
        self.assertEqual(notes[0]["title"], "Surveillance at Ichhapur Border")

        # Delete note
        deleted = self.db.delete_case_note(note["id"], user_id="1234")
        self.assertTrue(deleted)
        remaining = self.db.get_case_notes(user_id="1234")
        self.assertEqual(len(remaining), 0)

    def test_field_reports(self):
        rep = self.db.create_field_report(
            subject="Anonymous tip on Hawala cash handover",
            description="Informant reported exchange scheduled at Barrackpore Station.",
            report_type="COMMUNITY_TIPOFF",
            reporter_name="Field Informant Beta",
            location="Barrackpore Railway Station Platform 3"
        )
        self.assertEqual(rep["status"], "SUBMITTED")
        reports = self.db.get_field_reports()
        self.assertGreater(len(reports), 0)

        # Update status
        updated = self.db.update_field_report_status(rep["id"], "VERIFIED")
        self.assertTrue(updated)
        verified_reports = self.db.get_field_reports(status="VERIFIED")
        self.assertEqual(len(verified_reports), 1)

    def test_raw_sql_execution(self):
        result = self.db.execute_raw_sql("SELECT user_id, full_name, role FROM users ORDER BY id ASC")
        self.assertIn("columns", result)
        self.assertGreater(result["row_count"], 0)
        self.assertEqual(result["columns"], ["user_id", "full_name", "role"])

if __name__ == "__main__":
    unittest.main()
