class PredictiveAnalysisEngine:

    def predict_links(self):
        return [
            {"source": "c2", "target": "c3", "confidence": 0.88, "relation": "LIKELY_CO_OPERATIVE"},
            {"source": "c1", "target": "c4", "confidence": 0.92, "relation": "INDIRECT_CONTROL"},
        ]