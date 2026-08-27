# AI-POWERED CRIMINAL NETWORK ANALYSIS SYSTEM
**Problem Statement ID:** SIH26189 | **Team:** BitWiser  
*From fragmented intelligence to explainable network disruption*

---

## 🏛️ System Overview & Legal Framework Alignment
The **AI-Powered Criminal Network Analysis System** is an end-to-end, law-enforcement-grade decision support platform designed specifically for the **Smart India Hackathon (SIH 2026)**. It connects fragmented intelligence across siloed police databases, financial streams, telecom logs, and multi-state jurisdictions into an interactive Knowledge Graph, applying advanced graph analytics, Graph Neural Networks (GNN), and Spatio-Temporal clustering to discover non-obvious links and execute surgical network disruption.

### Statutory Alignment:
- **Bharatiya Nyaya Sanhita (BNS) 2024**: Categorical mapping of organized crime (Sec 111), financial fraud (Sec 318), and breach of trust (Sec 316).
- **Bharatiya Nagarik Suraksha Sanhita (BNSS) 2024**: Automated tracking and jurisdictional linking of Zero FIRs (Sec 173).
- **Bharatiya Sakshya Adhiniyam (BSA) 2024**: Cryptographic chain of custody (Sec 63) with SHA-256 hash chaining to ensure court-admissibility and prevent police *burking*.
- **CCTNS & ICJS Interoperability**: 5-Pillar synchronization ("One Data Once Entry" across Police, Courts, Prisons, Forensics, and Prosecution).

---

## 🚀 Key Architectural Layers

### 1. Ingestion & Preprocessing
- Multimodal data ingest: FIRs, Zero-FIRs, CDRs, IPDRs, Bank/UPI Hawala logs, ANPR toll hits, OSINT.
- Multilingual OCR preprocessor for legacy scans in **English, Hindi (हिन्दी), and Bengali (বাংলা)**.

### 2. Legal NER & Semantic Understanding
- Domain-adapted LLM ontology (**Maitreyi-Y1** emulation) extracting 6 discrete ontologies:
  1. Biographic Data (Names, aliases, age, physical traits)
  2. Communication Identifiers (Phone numbers, IPs, MACs, IMEIs)
  3. Spatial & Geographic (Addresses, cell towers, GPS coordinates)
  4. Financial Instruments (Bank accounts, UPI handles, Bitcoin/Ethereum wallets)
  5. Vehicular Logistics (License plates, VINs, makes)
  6. Statutory & Legal (BNS sections, FIR IDs, court warrants)

### 3. Probabilistic Entity Resolution (ER)
- **Fellegi-Sunter Framework**: $W_i = \ln(m_i / u_i)$ agreement weights with Soundex phonetic matching and Levenshtein string distance.
- **Blocking & Indexing**: Surname 3-letter prefix, age buckets, and phone hashes to eliminate $O(N^2)$ bottlenecks.
- **Graph-Assisted Deduplication**: Unifying synthetic aliases via shared phone numbers, vehicle plates, and emergency contacts.

### 4. Property Knowledge Graph & GraphRAG
- Property Graph model: `Person`, `Phone`, `Vehicle`, `Location`, `BankAccount`, `CryptoWallet`, `CrimeIncident`, `FIR`, `Organization`.
- **Dynamic GraphRAG Interrogation**: Translates natural language inquiries into deterministic Cypher traversals without generative hallucinations.

### 5. Advanced Graph Analytics & Key Player Disruption
- **Multi-Metric Centralities**: Degree ($C_D$), Betweenness ($C_B$), Eigenvector ($C_E$).
- **Energy Disruptive Centrality**: Physics-inspired gravity model combining attribute load and relationship strength.
- **$\kappa$-path Edge Centrality**: Random walk simulations up to length $\kappa=3$ detecting critical communication channels.
- **Borgatti Key Player Problem (KPP-1 & KPP-2)**: Identifying minimal node sets for maximal network fragmentation.
- **Composition of Probabilistic Preferences (CPP TRI)**: Multi-criteria decision support allocating suspects into 4 threat tiers.
- **Quadratic Assignment Procedure (QAP)**: Adjacency permutation testing for structural statistical significance.
- **Louvain Modularity**: Factional partition (Command, Smuggling, Hawala, Cyber).
- **Network Disruption Simulator**: Stepwise strike simulation tracking Principal Connected Component (PCC) collapse and toughness decay.

### 6. GNN Predictive Policing
- **PyTorch Geometric (PyG)** architecture with GraphSAGE neighborhood sampling, Graph Attention Networks (GAT), and NCSM (Node Centrality and Similarity Measure-Based Parameterised Model).
- **Missing Intelligence Predictor**: Surfacing unobserved high-confidence links (>70%).
- **Future Criminal Association Forecaster**: Projecting co-offending risks across distinct cells.

### 7. Spatio-Temporal Trajectory & Hotspot Analysis
- **STRP-DBSCAN**: Spatial-Temporal Random Partitioning DBSCAN with 96.2% latency reduction.
- **Convoy Anomaly Detection**: Identifying multiple suspect vehicles travelling in tight spatial-temporal proximity.
- **Near-Repeat Hotspot Analysis**: Mapping localized crime risk propagation.

### 8. Cybersecurity & Cryptographic Custody
- **Role-Based Access Control (RBAC)**: Investigating Officer, Intelligence Analyst, SHO, Forensic Magistrate.
- **SHA-256 Hash Chain**: Immutable audit ledger logging all investigator queries and actions.

---

## 🛠️ Installation & Running Locally

### Prerequisites
- Python 3.10+
- Node.js 18+

### Setup & Launch
1. **Install Python Dependencies:**
   ```bash
   pip install fastapi uvicorn torch networkx scikit-learn pandas numpy cryptography python-multipart
   ```
2. **Install Frontend Dependencies & Build:**
   ```bash
   cd frontend
   npm install
   npm run build
   cd ..
   ```
3. **Run the Unified Full-Stack Server:**
   ```bash
   python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000
   ```
4. **Open in Browser:**
   Navigate to `http://localhost:8000`

---

## 🧪 Running Automated Tests
```bash
python -m unittest discover -s backend/tests -p "test_*.py"
python backend/tests/verify_endpoints.py
```
