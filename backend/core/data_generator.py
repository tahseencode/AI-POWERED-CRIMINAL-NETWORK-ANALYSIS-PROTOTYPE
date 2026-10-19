import json
import random


class DataGenerator:

    def __init__(self):
        self.nodes = [
            {"id": "c1", "label": "John Doe", "type": "SUSPECT", "degree": 5},
            {"id": "c2", "label": "Jane Smith", "type": "SUSPECT", "degree": 3},
            {"id": "c3", "label": "Robert Johnson", "type": "ASSOCIATE", "degree": 2},
            {"id": "c4", "label": "Front Org LLC", "type": "ORGANIZATION", "degree": 4},
        ]
        self.edges = [
            {"source": "c1", "target": "c2", "relation": "MEMBER_OF"},
            {"source": "c1", "target": "c3", "relation": "COMMUNICATED_WITH"},
            {"source": "c2", "target": "c4", "relation": "FINANCED"},
            {"source": "c3", "target": "c4", "relation": "OWNS"},
        ]

    def get_sample_graph(self):
        return {"nodes": self.nodes, "edges": self.edges}