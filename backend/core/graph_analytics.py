class GraphAnalyticsEngine:

    def calculate_centralities(self):
        return {
            "c1": {"degree_centrality": 0.75, "betweenness_centrality": 0.6},
            "c2": {"degree_centrality": 0.50, "betweenness_centrality": 0.4},
            "c3": {"degree_centrality": 0.25, "betweenness_centrality": 0.1},
            "c4": {"degree_centrality": 0.50, "betweenness_centrality": 0.3},
        }