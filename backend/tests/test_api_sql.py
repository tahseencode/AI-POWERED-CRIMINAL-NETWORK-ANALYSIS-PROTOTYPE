import unittest
from fastapi.testclient import TestClient
from backend.app import app
from backend.core.database import db_manager

class TestApiSqlEndpoints(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_database_stats_endpoint(self):
        res = self.client.get("/api/database/stats")
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertEqual(data["status"], "ONLINE")
        self.assertIn("users", data["tables"])
        self.assertIn("user_activity_logs", data["tables"])
        self.assertIn("user_case_notes", data["tables"])

    def test_auth_login_success(self):
        res = self.client.post("/api/auth/login", json={"user_id": "1234", "password": "1234"})
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertEqual(data["user"]["user_id"], "1234")
        self.assertIn("session_id", data["user"])

    def test_auth_login_invalid(self):
        res = self.client.post("/api/auth/login", json={"user_id": "1234", "password": "invalid_pass_xyz"})
        self.assertEqual(res.status_code, 401)

    def test_auth_register_and_get_users(self):
        new_id = "IO-REG-TEST-101"
        res = self.client.post("/api/auth/register", json={
            "user_id": new_id,
            "full_name": "Inspector Automated Test",
            "password": "testpassword123",
            "role": "Investigating Officer (IO)",
            "station": "Barrackpore Special Thana"
        })
        # If user already exists in persistent DB from previous run, status can be 200 or 400
        if res.status_code == 200:
            data = res.json()
            self.assertTrue(data["success"])
            self.assertEqual(data["user"]["user_id"], new_id)

        # Get all users list
        users_res = self.client.get("/api/users")
        self.assertEqual(users_res.status_code, 200)
        users_data = users_res.json()
        self.assertGreater(users_data["total_returned"], 0)

    def test_case_notes_flow(self):
        # Create case note
        create_res = self.client.post("/api/users/notes", json={
            "user_id": "1234",
            "title": "API Test Note - Border Infiltration Lead",
            "note_content": "Intercepted communication between suspect and transport handler.",
            "priority": "CRITICAL",
            "tags": ["Border", "Arms", "Hawala"]
        })
        self.assertEqual(create_res.status_code, 200)
        note = create_res.json()["note"]
        note_id = note["id"]

        # Fetch case notes
        list_res = self.client.get("/api/users/notes")
        self.assertEqual(list_res.status_code, 200)
        notes = list_res.json()["notes"]
        self.assertTrue(any(n["id"] == note_id for n in notes))

        # Delete case note
        del_res = self.client.delete(f"/api/users/notes/{note_id}")
        self.assertEqual(del_res.status_code, 200)

    def test_field_reports_flow(self):
        res = self.client.post("/api/users/reports", json={
            "subject": "API Field Intelligence Test",
            "description": "Suspicious container parked near ordnance perimeter.",
            "report_type": "FIELD_INTELLIGENCE",
            "reporter_name": "Operative Delta",
            "location": "Ichhapur Ordnance Perimeter"
        })
        self.assertEqual(res.status_code, 200)
        report = res.json()["report"]
        report_id = report["id"]

        # Update status
        status_res = self.client.put(f"/api/users/reports/{report_id}/status", json={"status": "VERIFIED"})
        self.assertEqual(status_res.status_code, 200)

    def test_raw_sql_query_execution(self):
        res = self.client.post("/api/database/query", json={
            "sql_query": "SELECT role, count(*) as count FROM users GROUP BY role;"
        })
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertTrue(data["success"])
        self.assertIn("columns", data["result"])
        self.assertIn("rows", data["result"])

if __name__ == "__main__":
    unittest.main()
