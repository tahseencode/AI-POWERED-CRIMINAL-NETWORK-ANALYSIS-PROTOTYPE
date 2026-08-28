# 🛡️ AI-POWERED CRIMINAL NETWORK ANALYSIS & INVESTIGATION SYSTEM
**Problem Statement ID:** SIH26189 | **Team:** BitWiser  
*From Fragmented Police Records to Explainable Syndicate Disruption & Judicial Proof*

---

## 🏛️ System Overview & Legal Framework Alignment
The **AI-Powered Criminal Network Analysis System** is an end-to-end, law-enforcement-grade decision support platform built for the **Smart India Hackathon (SIH 2026)**. It unifies fragmented criminal intelligence across siloed police databases, financial transaction streams, telecommunication call detail records (CDR/IPDR), and multi-state jurisdictions into an interactive, cryptographically verified Property Knowledge Graph.

By integrating cognitive **Google Gemini 3.6 Flash Legal LLMs**, **Tesseract OCR**, **PyMuPDF**, **Graph Neural Networks (GNN)**, and **Spatio-Temporal Clustering (STRP-DBSCAN)**, the platform enables investigators to detect hidden syndicates, resolve synthetic aliases, forecast case outcomes, and plan surgical network disruption with court-admissible electronic evidence.

```
+--------------------------------------------------------------------------------------------------+
|                                    LAW ENFORCEMENT USER INTERFACE                                |
|  [Graph Explorer]  [Data Ingestion Studio]  [Entity Resolution]  [Spatio-Temporal]  [GraphRAG]   |
+--------------------------------------------------------------------------------------------------+
                                                 │
                                                 ▼
+--------------------------------------------------------------------------------------------------+
|                                  COGNITIVE MULTIMODAL INGESTION                                  |
|   • Tesseract OCR (OpenCV)   • PyMuPDF Legal Parser   • Google Gemini 3.6 Flash Legal NER       |
|   • CCTNS 6-Ontology Parsing • BSA Sec 63 SHA-256 Cryptographic Custody Ledger                   |
+--------------------------------------------------------------------------------------------------+
                                                 │
                                                 ▼
+--------------------------------------------------------------------------------------------------+
|                                INTELLIGENCE & ANALYTICS PLATFORM                                 |
|   • Property Knowledge Graph (Cytoscape CoSE)   • Fellegi-Sunter Probabilistic Entity Resolver   |
|   • GraphRAG Cypher Query Engine                • Borgatti Key Player Disruption (KPP-1 / KPP-2) |
|   • PyTorch Geometric GNN Link Forecaster       • STRP-DBSCAN Convoy & Hotspot Tracker           |
|   • AI Outcome Forecaster & Historical Precedent Matcher                                         |
+--------------------------------------------------------------------------------------------------+
```

---

## ⚖️ Indian Statutory Compliance Framework

| Statute | Section / Framework | System Implementation & Automation |
|---|---|---|
| **Bharatiya Nyaya Sanhita (BNS) 2024** | **Sec 111, 316, 318** | Automated classification of Organized Crime Syndicates (Sec 111), Hawala/Trust Breach (Sec 316), and Cyber Cheating (Sec 318). |
| **Bharatiya Nagarik Suraksha Sanhita (BNSS) 2024** | **Sec 173** | Standardized FIR & Zero-FIR ingestion, cross-jurisdictional transferring, and structured legal charge sheet generation. |
| **Bharatiya Sakshya Adhiniyam (BSA) 2024** | **Sec 63** | SHA-256 digital certificate generation and immutable HMAC hash-chained audit logging for tamper-proof court admissibility. |
| **Arms Act 1959** | **Sec 25(1AA) & 25/27** | Inter-state illegal firearms transit detection, weapon seizure ledgering, and ordnance cache tracing. |
| **PMLA 2002 & IT Act 2000** | **Sec 3/4 & 66D** | Burrabazar Hawala structuring detection, multi-hop bank mule tracing, and SIM-box VoIP gateway tracking. |
| **CCTNS / ICJS 5 Pillars** | **"One Data Once Entry"** | Interoperable data synchronization across Police, Courts, Prisons, Forensics, and Prosecution. |

---

## 🚀 Key Architectural Layers

### 1. Multimodal OCR & Document Ingestion Pipeline
- **Multi-Tier Optical Character Recognition**:
  - **Tier 1 (PyMuPDF)**: Extracts native digital text layers from PDF FIRs and seizure memos with 100% fidelity.
  - **Tier 2 (Tesseract OCR + OpenCV)**: Automated computer vision preprocessing (Grayscale conversion, Gaussian blurring, and Otsu's adaptive binarization) for scanned legacy files in **English, Hindi (हिन्दी), and Bengali (বাংলা)**.
  - **Tier 3 (Google Gemini 3.6 Flash)**: Multimodal document vision transcribing distorted, handwritten, or low-resolution crime proof photos.
  - **Tier 4 (EasyOCR)**: Deep neural character reader for multilingual text sequences.

### 2. Cognitive Legal NER & Semantic Understanding
- **Domain-Adapted Legal NLP Engine** with Google Gemini 3.6 Flash and CCTNS rule-based fallback:
  - **Biographic Data**: Full names (e.g. *Erick Ekka*, *Vikram 'Vicky' Singh*, *Tariq Al-Hasani*), aliases (*Chhotu*, *Kaalia*), age, gender, parentage ($S/o, D/o, W/o$), role, and threat score.
  - **Role Disambiguation**: Intelligently isolates Accused Persons from Complainants, Investigating Officers, Witnesses, and Victims.
  - **Communication Identifiers**: Mobile numbers (+91), IMEIs, MAC addresses, IP addresses, and email handles.
  - **Vehicular Logistics**: Indian vehicle license plates (e.g., `WB-24-AX-5512`), models, and concealed compartment details.
  - **Financial Instruments**: Bank account numbers, UPI handles (`@okhdfcbank`, `@okaxis`, `@icici`), and Crypto wallets (BTC/ETH).
  - **Spatial & Geographic**: Crime scene loci, defense estate perimeters, cell tower triangulations, and safehouses.
  - **Modus Operandi & Contraband**: Extraction of concealment methods, weapon types, cartridge counts, and seized cash.

### 3. Probabilistic Entity Resolution (ER)
- **Fellegi-Sunter Agreement Weighting**: Computes log-likelihood ratio weights $W_i = \ln(m_i / u_i)$ with Soundex phonetic encoding and Levenshtein string distances.
- **Multi-Pass Blocking**: Eliminates $O(N^2)$ bottlenecks using surname phonetic blocks, age ranges, and phone/UPI hashes.
- **Graph-Assisted Deduplication**: Merges multi-identity syndicate actors across aliases with a full BSA-compliant audit log.

### 4. Interactive Property Knowledge Graph & GraphRAG
- **Graph Topology**: Nodes (`Person`, `Phone`, `Vehicle`, `Location`, `BankAccount`, `CryptoWallet`, `CrimeIncident`, `FIR`) and Typed Relationships (`OPERATES_UNDER`, `CALLED`, `TRANSFERRED_FUNDS_TO`, `PRESENT_AT`, `OWNS_VEHICLE`, `ASSOCIATED_WITH`).
- **GraphRAG Dynamic Interrogation**: Converts natural language investigative questions (e.g., *"Show me all Hawala transfers connected to Ichhapur safehouse"*) into deterministic Cypher traversals without generative hallucinations.

### 5. Advanced Graph Analytics & Surgical Network Disruption
- **Energy Disruptive Centrality**: Physics-inspired gravity model combining node threat attributes and relational weights.
- **Borgatti Key Player Problem (KPP-1 & KPP-2)**: Solves minimal node set isolation for maximal syndicate fragmentation.
- **$\kappa$-Path Edge Centrality**: Random walk simulations identifying critical courier corridors.
- **CPP-TRI Threat Matrix**: Multi-criteria decision sorting allocating suspects into Tier 1 (High Threat) through Tier 4.
- **Network Disruption Simulator**: Real-time simulation showing fragmentation drop percentage and Principal Connected Component (PCC) decay upon suspect apprehension.

### 6. GNN Predictive Policing
- **PyTorch Geometric (PyG)** architecture with GraphSAGE neighborhood sampling, Graph Attention Networks (GAT), and NCSM.
- **Missing Intelligence Lead Predictor**: Surfaces hidden, unrecorded co-offending links with confidence scores.
- **Future Association Forecaster**: Projects future syndicate expansion and recruitment paths.

### 7. Spatio-Temporal Trajectory & Convoy Analysis
- **STRP-DBSCAN Clustering**: Spatio-Temporal Random Partitioning DBSCAN reducing cluster latency by 96.2%.
- **Convoy Anomaly Detection**: Uncovers multiple suspect vehicles traveling in tight spatial-temporal coordination.
- **Interactive Tactical Map**: Leaflet-powered GIS dashboard displaying crime hotspots and movement corridors.

### 8. AI Outcome Forecaster & Historical Precedent Matcher
- Evaluates suspect attributes and statutory charges against historical case repositories.
- Forecasts bail risk, escalation probability, conviction likelihood, and recommended investigative countermeasures.

---

## 💻 Tech Stack

- **Backend**: Python 3.10+, FastAPI, Uvicorn, PyTorch Geometric, NetworkX, Scikit-Learn, Pandas, NumPy, Pydantic
- **AI & OCR Engines**: Google Gemini 3.6 Flash (`google-genai`), Tesseract OCR (`pytesseract`), PyMuPDF (`pymupdf`), EasyOCR, OpenCV (`cv2`), Pillow
- **Security & Integrity**: Cryptography (SHA-256, HMAC-SHA256), Immutable Audit Ledger
- **Frontend**: React 18, Vite, Cytoscape.js (`cytoscape-cose-bilkent`), Leaflet, Lucide React, Vanilla CSS (Dark Glassmorphism)

---

## 🛠️ Installation & Setup

### 1. Prerequisites
- **Python 3.10+** (Python 3.11 / 3.12 / 3.14 supported)
- **Node.js 18+** and **npm**

### 2. Environment Configuration
Create a `.env` file or export your Gemini API key:
```bash
# Windows PowerShell
$env:GEMINI_API_KEY="your-gemini-api-key-here"

# Linux / macOS
export GEMINI_API_KEY="your-gemini-api-key-here"
```
*(Note: If no API key is provided, the system seamlessly operates in offline mode using the CCTNS deterministic NER and Tesseract/EasyOCR fallback engines.)*

### 3. Install Python Dependencies
```bash
pip install fastapi uvicorn google-genai pytesseract pymupdf pypdf easyocr torch networkx scikit-learn pandas numpy opencv-python pillow cryptography python-multipart
```

### 4. Install Frontend Dependencies
```bash
cd frontend
npm install
cd ..
```

---

## 🚀 Running the Application

### Option A: Development Mode (Recommended)

1. **Start Backend API Server (Port 8000):**
   ```bash
   python -m uvicorn backend.app:app --host 127.0.0.1 --port 8000
   ```

2. **Start Frontend Dev Server (Port 5173):**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access Application:**
   - **Frontend UI**: [http://localhost:5173](http://localhost:5173)
   - **Interactive API Docs (Swagger)**: [http://localhost:8000/docs](http://localhost:8000/docs)

### Option B: Production Mode (Unified Server)

```bash
cd frontend
npm run build
cd ..
python -m uvicorn backend.app:app --host 0.0.0.0 --port 8000
```
Navigate to [http://localhost:8000](http://localhost:8000).

---

## 🧪 Testing & Verification

Run the automated test suite covering all legal NER extraction patterns, OCR boundaries, entity resolution, graph analytics, GNN forecasts, and API routes:

```bash
# Run Core Unit Tests
python -m unittest backend.tests.test_core

# Run End-to-End API Verification Script
python backend/tests/verify_endpoints.py
```

---

## 📁 Repository Structure

```
├── backend/
│   ├── app.py                      # FastAPI application routes & unified API
│   ├── config.py                   # System hyper-parameters & file paths
│   ├── core/
│   │   ├── ocr_processor.py        # Tesseract, PyMuPDF, EasyOCR & Gemini Multimodal Vision
│   │   ├── legal_ner.py            # Gemini 3.6 Flash & CCTNS Rule-Based Legal NER
│   │   ├── entity_resolution.py    # Fellegi-Sunter probabilistic deduplication
│   │   ├── knowledge_graph.py      # Property graph store & Cypher traversal engine
│   │   ├── graph_rag.py            # GraphRAG deterministic inquiry layer
│   │   ├── graph_analytics.py      # Multi-metric centralities, KPP disruption & Louvain
│   │   ├── gnn_predictive.py       # PyTorch Geometric GNN missing link predictor
│   │   ├── spatio_temporal.py      # STRP-DBSCAN clustering & convoy detection
│   │   ├── outcome_forecaster.py   # AI case trajectory & precedent matcher
│   │   ├── security.py             # BSA Sec 63 SHA-256 audit ledger & RBAC
│   │   └── data_generator.py       # Realistic synthetic CCTNS syndicate dataset
│   └── tests/
│       ├── test_core.py            # Unit tests for OCR, NER, ER, GNN & Graph analytics
│       └── verify_endpoints.py     # Live integration test suite for all HTTP endpoints
├── frontend/
│   ├── src/
│   │   ├── App.jsx                 # Main application layout & role navigation
│   │   ├── index.css               # Glassmorphic dark theme design system
│   │   └── components/
│   │       ├── Header.jsx                  # Tactical header & RBAC switcher
│   │       ├── GraphExplorer.jsx           # Cytoscape interactive Knowledge Graph
│   │       ├── DataIngestionStudio.jsx     # Multilingual OCR & Legal NER Studio
│   │       ├── AddSuspectModal.jsx         # Suspect creation, proof upload & outcome forecast
│   │       ├── EntityResolutionStudio.jsx  # Fellegi-Sunter deduplication & node merging
│   │       ├── KeyPlayerPanel.jsx          # KPP fragmentation & disruption simulation
│   │       ├── GNNPredictor.jsx            # GNN missing lead & future link prediction
│   │       ├── SpatioTemporalMap.jsx       # Leaflet map with STRP-DBSCAN convoy tracks
│   │       ├── GraphRAGConsole.jsx         # Cypher query interrogation console
│   │       ├── AuditLogViewer.jsx          # BSA Sec 63 immutable cryptographic ledger
│   │       └── CCTNSPillarsModal.jsx       # 5-Pillars ICJS synchronization modal
│   └── package.json
└── README.md
```

---

## 👥 Team BitWiser | Smart India Hackathon (SIH 2026)
*Empowering Law Enforcement with Explainable Graph Intelligence and Tamper-Proof Digital Custody.*
