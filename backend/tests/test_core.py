import unittest
from backend.core.security import audit_logger, generate_evidence_hash, generate_hmac_signature
from backend.core.ocr_processor import ocr_processor
from backend.core.legal_ner import legal_ner_engine
from backend.core.entity_resolution import entity_resolver, compute_soundex, compute_levenshtein
from backend.core.knowledge_graph import kg_store
from backend.core.graph_rag import graph_rag_engine
from backend.core.graph_analytics import analytics_engine
from backend.core.gnn_predictive import gnn_engine
from backend.core.spatio_temporal import strp_dbscan_clusterer
from backend.core.data_generator import initialize_knowledge_graph

class TestCriminalAnalysisCore(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        initialize_knowledge_graph()

    def test_security_and_audit_log(self):
        entry = audit_logger.log_action(
            officer_badge="TEST-IO-999",
            role="Investigating Officer (IO)",
            action="TEST_ACTION",
            query_or_target="Unit test verification"
        )
        self.assertIsNotNone(entry["entry_hash"])
        self.assertIsNotNone(entry["hmac_sig"])
        
        integrity = audit_logger.verify_integrity()
        self.assertTrue(integrity["valid"])
        self.assertIn("statutory_compliance", integrity)

    def test_ocr_and_legal_ner(self):
        sample_fir_text = (
            "FIR No. WB-2026-991, Barrackpore Thana. "
            "Accused Tariq Al-Hasani alias Kabir Bhai aged 49 yrs was spotted with phone +919830112233 "
            "driving vehicle WB-02-AB-1234 near Ichhapur Defence Estate. "
            "Under Section 111 BNS 2024 and BSA Sec 63."
        )
        ocr_res = ocr_processor.extract_text_from_document(sample_fir_text)
        self.assertIn("WB-2026-991", ocr_res["extracted_metadata"]["fir_number"])

        ner_res = legal_ner_engine.extract_entities(ocr_res["cleaned_text"])
        self.assertGreater(ner_res["total_entities_extracted"], 0)
        self.assertTrue(any(p["value"] == "+919830112233" for p in ner_res["entities"]["communication_identifiers"]))
        self.assertTrue(any(v["plate_number"] == "WB-02-AB-1234" for v in ner_res["entities"]["vehicular_logistics"]))

    def test_entity_resolution_fellegi_sunter(self):
        rec1 = {
            "id": "R1", "full_name": "Tariq Al-Hasani", "age": 49,
            "phones": ["+919830112233"], "vehicles": ["WB-02-AB-1234"], "known_associates": ["Sunil Roy"]
        }
        rec2 = {
            "id": "R2", "full_name": "Tariq Hasan", "age": 48,
            "phones": ["+919830112233"], "vehicles": ["WB-02-AB-1234"], "known_associates": ["Sunil Kumar Roy"]
        }
        comparison = entity_resolver.compare_records(rec1, rec2)
        self.assertEqual(comparison["decision"], "DEFINITIVE_MATCH")
        self.assertGreater(comparison["composite_weight"], 7.0)

    def test_graph_analytics(self):
        centralities = analytics_engine.compute_all_centralities()
        self.assertIn("PERSON_001", centralities)
        self.assertGreater(centralities["PERSON_001"]["energy_disruptive_centrality"], 0.0)

        communities = analytics_engine.compute_louvain_communities()
        self.assertGreater(communities["num_communities"], 0)

        cpp_tri = analytics_engine.compute_cpp_tri_threat_matrix()
        self.assertTrue(any("Tier 1" in row["threat_tier"] for row in cpp_tri))

        kpp = analytics_engine.solve_key_player_problem(k=2)
        self.assertEqual(len(kpp["kpp1_fragmentation_targets"]), 2)

        sim = analytics_engine.simulate_network_disruption(["PERSON_001", "PERSON_002"])
        self.assertGreater(len(sim["decay_trajectory"]), 2)

    def test_gnn_predictive_policing(self):
        preds = gnn_engine.run_prediction_pipeline()
        self.assertIn("missing_intelligence_leads", preds)
        self.assertIn("future_associations_forecast", preds)

    def test_spatio_temporal_clustering(self):
        events = [
            {"id": "E1", "lat": 22.8124, "lng": 88.3752, "timestamp": "2026-08-24T21:00:00Z", "entity_name": "P1", "vehicle_plate": "WB-01"},
            {"id": "E2", "lat": 22.8126, "lng": 88.3755, "timestamp": "2026-08-24T21:05:00Z", "entity_name": "P2", "vehicle_plate": "WB-01"},
            {"id": "E3", "lat": 22.8128, "lng": 88.3758, "timestamp": "2026-08-24T21:10:00Z", "entity_name": "P3", "vehicle_plate": "WB-02"},
            {"id": "E4", "lat": 26.7271, "lng": 88.3953, "timestamp": "2026-08-21T08:30:00Z", "entity_name": "P4", "vehicle_plate": "WB-99"}
        ]
        res = strp_dbscan_clusterer.cluster_points(events)
        self.assertGreater(len(res["clusters"]), 0)
        self.assertGreater(len(res["detected_convoys"]), 0)

    def test_graphrag_query(self):
        res = graph_rag_engine.query("Show me financial transfers connected to hawala")
        self.assertIn("TRANSFERRED_FUNDS_TO", res["synthesized_cypher"])
        self.assertGreater(len(res["evidence_chain"]), 0)
        self.assertIn("Verified Intelligence Brief", res["intelligence_brief"])

if __name__ == "__main__":
    unittest.main()
