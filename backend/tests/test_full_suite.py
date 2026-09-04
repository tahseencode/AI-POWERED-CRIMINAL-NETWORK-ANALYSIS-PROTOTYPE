import unittest
from fastapi.testclient import TestClient
from backend.app import app

class TestFullSuite(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.client = TestClient(app)

    def test_status(self):
        resp = self.client.get("/api/status")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "OPERATIONAL")
        self.assertIn("statutory_compliance", data)

    def test_graph_retrieval(self):
        resp = self.client.get("/api/graph")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("elements", data)
        self.assertGreater(len(data["elements"]), 0)

    def test_centrality(self):
        resp = self.client.get("/api/analytics/centrality")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("PERSON_001", data)
        self.assertIn("degree_centrality", data["PERSON_001"])

    def test_key_players(self):
        resp = self.client.get("/api/analytics/key-players")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("kpp1_fragmentation_targets", data)
        self.assertIn("kpp2_reach_targets", data)

    def test_gnn_predict(self):
        resp = self.client.get("/api/gnn/predict")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("missing_intelligence_leads", data)

    def test_spatio_temporal_clusters(self):
        resp = self.client.get("/api/spatio-temporal/clusters")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("clusters", data)

    def test_entity_resolution_resolve(self):
        resp = self.client.get("/api/entity-resolution/resolve")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("all_evaluations", data)

    def test_audit_verify(self):
        resp = self.client.get("/api/audit/verify")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertTrue(data.get("valid"))

    def test_cctns_pillars(self):
        resp = self.client.get("/api/cctns/pillars")
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("police_cctns", data)
        self.assertIn("ecourts", data)
        self.assertIn("eprisons", data)

    def test_graphrag_query(self):
        resp = self.client.post("/api/graphrag/query", json={"prompt": "Show me hawala transfers", "role": "Investigating Officer (IO)"})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("intelligence_brief", data)
        self.assertIn("evidence_chain", data)

    def test_disruption_simulate(self):
        resp = self.client.post("/api/analytics/disruption-simulate", json={"target_node_ids": ["PERSON_001"]})
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("disruption_effectiveness_percent", data)

    def test_entity_resolution_merge(self):
        resp = self.client.post("/api/entity-resolution/merge", json={
            "primary_entity_id": "PERSON_001",
            "secondary_entity_id": "PERSON_002",
            "officer_badge": "IO-TEST-9999",
            "role": "Investigating Officer (IO)"
        })
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertEqual(data["status"], "ENTITIES_MERGED_SUCCESSFULLY")

    def test_ingest_legal_ner(self):
        resp = self.client.post("/api/ingest/upload-media", data={
            "raw_text": "FIRST INFORMATION REPORT\nAccused: Sunil Roy\nVehicle: WB-02-AB-1234\nOffences: Section 111 BNS 2024, Arms Act 1959 Sec 25/27, BSA 2024 Sec 63",
            "source_type": "SCANNED_LEGAL_PDF",
            "officer_badge": "IO-KOLKATA-8842",
            "role": "Investigating Officer (IO)"
        })
        self.assertEqual(resp.status_code, 200)
        data = resp.json()
        self.assertIn("auto_filled_suspect", data)
        self.assertEqual(data["auto_filled_suspect"]["name"], "Sunil Roy")

if __name__ == "__main__":
    unittest.main()
