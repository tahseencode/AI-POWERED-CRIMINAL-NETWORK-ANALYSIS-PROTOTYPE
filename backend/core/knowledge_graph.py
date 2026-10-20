from backend.core.data_generator import DataGenerator


class KnowledgeGraphEngine:

    def __init__(self):
        self.generator = DataGenerator()

    def get_full_graph(self):
        return self.generator.get_sample_graph()