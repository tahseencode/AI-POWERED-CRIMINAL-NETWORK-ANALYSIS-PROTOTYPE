import urllib.request
import urllib.parse
import json

def test_endpoints():
    base = "http://localhost:8000"
    endpoints = [
        "/api/status",
        "/api/graph",
        "/api/analytics/centrality",
        "/api/analytics/kappa-path",
        "/api/analytics/cpp-tri",
        "/api/analytics/key-players",
        "/api/gnn/predict",
        "/api/spatio-temporal/clusters",
        "/api/entity-resolution/resolve",
        "/api/audit/verify",
        "/api/cctns/pillars",
        "/api/suspects",
        "/api/crimes",
        "/api/predict/syndicate-outcomes"
    ]
    
    print("Testing Endpoints...")
    all_ok = True
    for ep in endpoints:
        try:
            req = urllib.request.Request(base + ep)
            with urllib.request.urlopen(req) as response:
                status = response.getcode()
                data = json.loads(response.read().decode())
                print(f"[SUCCESS] {ep} -> HTTP {status} (Payload size: {len(str(data))} bytes)")
        except Exception as e:
            print(f"[ERROR] {ep} -> {e}")
            all_ok = False
            
    # Test POST GraphRAG
    try:
        rag_data = json.dumps({"prompt": "Show me hawala transfers"}).encode('utf-8')
        req = urllib.request.Request(f"{base}/api/graphrag/query", data=rag_data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print(f"[SUCCESS] /api/graphrag/query -> HTTP {resp.getcode()} (Matches: {data['matched_nodes_count']} nodes)")
    except Exception as e:
        print(f"[ERROR] /api/graphrag/query -> {e}")
        all_ok = False

    # Test POST Disruption
    try:
        dis_data = json.dumps({"target_node_ids": ["PERSON_001", "PERSON_002"]}).encode('utf-8')
        req = urllib.request.Request(f"{base}/api/analytics/disruption-simulate", data=dis_data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print(f"[SUCCESS] /api/analytics/disruption-simulate -> HTTP {resp.getcode()} (Drop: {data['disruption_effectiveness_percent']})")
    except Exception as e:
        print(f"[ERROR] /api/analytics/disruption-simulate -> {e}")
        all_ok = False

    # Test POST Add Suspect with Rich Crime Details
    try:
        suspect_payload = json.dumps({
            "name": "Arjun 'Ghost' Mukherjee",
            "aliases": ["A. Mukherjee", "Ghost Armorer"],
            "role": "Firearms Courier & Safehouse Custodian",
            "threat_score": 0.82,
            "age": 36,
            "crime_title": "Inter-State Contraband Logistics & Cache Transit",
            "crime_category": "Armed Weapon Trafficking & Logistics",
            "incident_narrative": "Transferred illegal ordnance consignments from Asansol border to Ichhapur safehouse.",
            "modus_operandi": "Concealed compartment in cargo van WB-04-T-1122 with fake delivery papers.",
            "seized_contraband": "2x 9mm country pistols, 30 rounds, ₹12,00,000 cash",
            "statutory_acts": [
                {
                    "act": "Bharatiya Nyaya Sanhita (BNS) 2024",
                    "section": "Section 111",
                    "title": "Organized Crime Syndicate Offence",
                    "explanation": "Continuous organized crime trafficking."
                },
                {
                    "act": "Arms Act 1959",
                    "section": "Section 25",
                    "title": "Illegal Firearms",
                    "explanation": "Transporting unlicenced lethal weapons."
                }
            ],
            "phone_numbers": ["+919874990011"],
            "vehicle_plates": ["WB-04-T-1122"],
            "bank_accounts": ["301044882211"],
            "locations": ["Ichhapur Safehouse"],
            "known_associates": ["PERSON_001"]
        }).encode('utf-8')
        req = urllib.request.Request(f"{base}/api/suspects/add", data=suspect_payload, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print(f"[SUCCESS] /api/suspects/add -> HTTP {resp.getcode()} (Suspect ID: {data['suspect_id']}, Nodes added: {data['nodes_added_count']})")
    except Exception as e:
        print(f"[ERROR] /api/suspects/add -> {e}")
        all_ok = False

    # Test POST /api/predict/outcome
    try:
        pred_payload = json.dumps({
            "name": "Arjun 'Ghost' Mukherjee",
            "role": "Firearms Courier",
            "threat_score": 0.82,
            "crime_title": "Arms Cache Logistics",
            "crime_category": "Armed Weapon Trafficking & Logistics",
            "incident_narrative": "Transferred illegal ordnance consignments from Asansol border to Ichhapur safehouse.",
            "modus_operandi": "Concealed compartment in cargo van WB-04-T-1122 with fake delivery papers.",
            "seized_contraband": "2x 9mm country pistols, 30 rounds",
            "bns_sections": ["Section 111", "Arms Act Sec 25"]
        }).encode('utf-8')
        req = urllib.request.Request(f"{base}/api/predict/outcome", data=pred_payload, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            print(f"[SUCCESS] /api/predict/outcome -> HTTP {resp.getcode()} (Matched: {data['matched_historical_precedent']['case_title']}, Prob: {data['overall_escalation_percentage']})")
    except Exception as e:
        print(f"[ERROR] /api/predict/outcome -> {e}")
        all_ok = False

    # Test POST /api/ingest/upload-media with Erick Ekka FIR
    try:
        erick_fir_data = urllib.parse.urlencode({
            "raw_text": "FIRST INFORMATION REPORT (FIR No. 142/2026)\nThana: Barrackpore Special Thana\nAccused: Erick Ekka (Age 31)\nPhone: +919831445566 | Vehicle: WB-24-AX-5512 | UPI: erick.ekka@icici\nIncident: Intercepted vehicle carrying 2 country pistols in concealed cavity.\nStatutory Sections: Section 111 BNS 2024, Arms Act 1959 Sec 25/27, BSA 2024 Sec 63.",
            "source_type": "SCANNED_LEGAL_PDF",
            "officer_badge": "IO-KOLKATA-8842",
            "role": "Investigating Officer (IO)"
        }).encode('utf-8')
        req = urllib.request.Request(f"{base}/api/ingest/upload-media", data=erick_fir_data, headers={'Content-Type': 'application/x-www-form-urlencoded'})
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            suspect_name = data['auto_filled_suspect']['name']
            print(f"[SUCCESS] /api/ingest/upload-media (Erick Ekka) -> HTTP {resp.getcode()} (Identified Suspect: '{suspect_name}')")
            if suspect_name != "Erick Ekka":
                print(f"[WARN] Expected 'Erick Ekka', got '{suspect_name}'")
    except Exception as e:
        print(f"[ERROR] /api/ingest/upload-media (Erick Ekka) -> {e}")
        all_ok = False

    if all_ok:
        print("\n>>> ALL API ENDPOINTS, MEDIA UPLOAD & PREDICTIVE PIPELINES VERIFIED SUCCESSFULLY! <<<")

if __name__ == "__main__":
    test_endpoints()
