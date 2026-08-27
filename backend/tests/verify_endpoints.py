import urllib.request
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
        "/api/cctns/pillars"
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

    if all_ok:
        print("\n>>> ALL API ENDPOINTS AND ANALYTIC PIPELINES VERIFIED SUCCESSFULLY! <<<")

if __name__ == "__main__":
    test_endpoints()
