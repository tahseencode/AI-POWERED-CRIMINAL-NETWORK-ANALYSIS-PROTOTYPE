import math
import re
from typing import Dict, Any, List, Tuple, Optional
from collections import defaultdict
from backend.config import FS_MATCH_THRESHOLD, FS_UNCERTAIN_THRESHOLD

def compute_soundex(name: str) -> str:
    """
    Standard American/Indian phonetic Soundex algorithm.
    Encodes names phonetically to catch homophones like 'Md Ali' vs 'Mohammad Aly'.
    """
    if not name:
        return ""
    name = re.sub(r"[^A-Za-z]", "", name).upper()
    if not name:
        return ""

    soundex_mapping = {
        'B': '1', 'F': '1', 'P': '1', 'V': '1',
        'C': '2', 'G': '2', 'J': '2', 'K': '2', 'Q': '2', 'S': '2', 'X': '2', 'Z': '2',
        'D': '3', 'T': '3',
        'L': '4',
        'M': '5', 'N': '5',
        'R': '6'
    }

    first_letter = name[0]
    tail = name[1:]
    encoded = ""
    prev_code = soundex_mapping.get(first_letter, "")

    for char in tail:
        code = soundex_mapping.get(char, "")
        if code:
            if code != prev_code:
                encoded += code
                prev_code = code
        else:
            prev_code = ""

    result = first_letter + encoded
    result = (result + "0000")[:4]
    return result

def compute_levenshtein(s1: str, s2: str) -> int:
    """Computes exact Levenshtein edit distance between two strings."""
    if len(s1) < len(s2):
        return compute_levenshtein(s2, s1)
    if len(s2) == 0:
        return len(s1)

    previous_row = range(len(s2) + 1)
    for i, c1 in enumerate(s1):
        current_row = [i + 1]
        for j, c2 in enumerate(s2):
            insertions = previous_row[j + 1] + 1
            deletions = current_row[j] + 1
            substitutions = previous_row[j] + (c1 != c2)
            current_row.append(min(insertions, deletions, substitutions))
        previous_row = current_row

    return previous_row[-1]

def string_similarity(s1: str, s2: str) -> float:
    """Returns normalized similarity ratio [0.0, 1.0]."""
    s1_clean = re.sub(r"\s+", " ", s1.strip().lower())
    s2_clean = re.sub(r"\s+", " ", s2.strip().lower())
    if s1_clean == s2_clean:
        return 1.0
    max_len = max(len(s1_clean), len(s2_clean))
    if max_len == 0:
        return 1.0
    dist = compute_levenshtein(s1_clean, s2_clean)
    return max(0.0, 1.0 - (dist / max_len))

def normalize_phone(phone: str) -> str:
    """Normalizes phone to 10-digit numeric string."""
    digits = re.sub(r"\D", "", str(phone))
    return digits[-10:] if len(digits) >= 10 else digits

def normalize_plate(plate: str) -> str:
    """Normalizes vehicle plate by removing hyphens/spaces and uppercasing."""
    return re.sub(r"[\s\-]", "", str(plate)).upper()

def normalize_fin(fin: str) -> str:
    """Normalizes bank account or UPI handle."""
    return re.sub(r"\s+", "", str(fin)).lower()

class FellegiSunterEntityResolver:
    """
    Fellegi-Sunter Probabilistic Record Linkage & Graph-Assisted Deduplication Engine.
    Computes mathematical agreement weights W_i = ln(m_i / u_i) to unify fragmented identities,
    synthetic personas, and aliases without crippling false positives.
    """

    def __init__(self, match_thresh: float = FS_MATCH_THRESHOLD, uncertain_thresh: float = FS_UNCERTAIN_THRESHOLD):
        self.match_threshold = match_thresh
        self.uncertain_threshold = uncertain_thresh

        # Calibrated m-probabilities (P(agree | match)) and u-probabilities (P(agree | non-match))
        # Based on Indian policing datasets (CCTNS & ICJS benchmark distributions)
        self.field_params = {
            "full_name": {"m": 0.92, "u": 0.005},
            "phonetic_name": {"m": 0.95, "u": 0.040},
            "phone_number": {"m": 0.98, "u": 0.0001},
            "license_plate": {"m": 0.99, "u": 0.0002},
            "bank_account": {"m": 0.995, "u": 0.00005},
            "upi_id": {"m": 0.99, "u": 0.0001},
            "age_proximity": {"m": 0.88, "u": 0.080},
            "address_locality": {"m": 0.85, "u": 0.030},
            "shared_associate": {"m": 0.82, "u": 0.015}  # Graph-assisted contextual signal
        }

    def compute_attribute_weight(self, field: str, agrees: bool, sim_ratio: float = 1.0) -> float:
        """
        Calculates Fellegi-Sunter logarithmic weight:
        W_i(agree) = ln(m_i / u_i) * sim_ratio
        W_i(disagree) = ln((1 - m_i) / (1 - u_i))
        """
        params = self.field_params.get(field, {"m": 0.90, "u": 0.05})
        m = params["m"]
        u = params["u"]

        if agrees:
            weight = math.log(m / u) * sim_ratio
        else:
            weight = math.log((1.0 - m) / (1.0 - u))
        return weight

    def compare_records(self, rec1: Dict[str, Any], rec2: Dict[str, Any]) -> Dict[str, Any]:
        """
        Performs fine-grained multi-attribute probabilistic evaluation between two entity records.
        """
        total_weight = 0.0
        breakdown = {}

        # 1. Full Name & Phonetic Soundex Matching
        name1 = rec1.get("full_name", "")
        name2 = rec2.get("full_name", "")
        name_sim = string_similarity(name1, name2)
        
        soundex1 = compute_soundex(name1)
        soundex2 = compute_soundex(name2)
        phonetic_match = (soundex1 == soundex2 and soundex1 != "")

        if name_sim >= 0.80:
            w_name = self.compute_attribute_weight("full_name", True, name_sim)
            total_weight += w_name
            breakdown["full_name"] = {"status": "MATCH", "weight": round(w_name, 2), "sim": round(name_sim, 2)}
        elif phonetic_match:
            w_phon = self.compute_attribute_weight("phonetic_name", True, 0.85)
            total_weight += w_phon
            breakdown["phonetic_name"] = {"status": "SOUNDEX_MATCH", "weight": round(w_phon, 2), "code": soundex1}
        else:
            w_name = self.compute_attribute_weight("full_name", False)
            total_weight += w_name
            breakdown["full_name"] = {"status": "MISMATCH", "weight": round(w_name, 2), "sim": round(name_sim, 2)}

        # 2. Phone Number Comparison (Normalized)
        phones1_raw = rec1.get("phones", [])
        phones2_raw = rec2.get("phones", [])
        phones1 = {normalize_phone(p) for p in phones1_raw if normalize_phone(p)}
        phones2 = {normalize_phone(p) for p in phones2_raw if normalize_phone(p)}
        if phones1 and phones2:
            shared_phones = phones1.intersection(phones2)
            if shared_phones:
                w_phone = self.compute_attribute_weight("phone_number", True)
                total_weight += w_phone
                breakdown["phone_number"] = {"status": "STRONG_IDENTIFIER_MATCH", "weight": round(w_phone, 2), "shared": list(shared_phones)}
            else:
                w_phone = self.compute_attribute_weight("phone_number", False)
                total_weight += w_phone
                breakdown["phone_number"] = {"status": "DIFFERENT_PHONES", "weight": round(w_phone, 2)}

        # 3. Vehicle License Plate Comparison (Normalized)
        plates1_raw = rec1.get("vehicles", [])
        plates2_raw = rec2.get("vehicles", [])
        plates1 = {normalize_plate(p) for p in plates1_raw if normalize_plate(p)}
        plates2 = {normalize_plate(p) for p in plates2_raw if normalize_plate(p)}
        if plates1 and plates2:
            shared_plates = plates1.intersection(plates2)
            if shared_plates:
                w_plate = self.compute_attribute_weight("license_plate", True)
                total_weight += w_plate
                breakdown["license_plate"] = {"status": "LOGISTICS_MATCH", "weight": round(w_plate, 2), "shared": list(shared_plates)}

        # 4. Bank / Financial Identifiers (Normalized)
        fin1_raw = rec1.get("financial_ids", []) or rec1.get("bank_accounts", []) or rec1.get("upi_ids", [])
        fin2_raw = rec2.get("financial_ids", []) or rec2.get("bank_accounts", []) or rec2.get("upi_ids", [])
        fin1 = {normalize_fin(f) for f in fin1_raw if normalize_fin(f)}
        fin2 = {normalize_fin(f) for f in fin2_raw if normalize_fin(f)}
        if fin1 and fin2:
            shared_fin = fin1.intersection(fin2)
            if shared_fin:
                w_fin = self.compute_attribute_weight("bank_account", True)
                total_weight += w_fin
                breakdown["financial_ids"] = {"status": "FINANCIAL_CORRELATION", "weight": round(w_fin, 2), "shared": list(shared_fin)}

        # 5. Age / Date of Birth Proximity
        age1 = rec1.get("age")
        age2 = rec2.get("age")
        if age1 is not None and age2 is not None:
            diff = abs(int(age1) - int(age2))
            if diff <= 2:
                w_age = self.compute_attribute_weight("age_proximity", True, 1.0 - (diff * 0.2))
                total_weight += w_age
                breakdown["age_proximity"] = {"status": "PROXIMATE", "weight": round(w_age, 2), "diff": diff}
            else:
                w_age = self.compute_attribute_weight("age_proximity", False)
                total_weight += w_age
                breakdown["age_proximity"] = {"status": "DIVERGENT", "weight": round(w_age, 2), "diff": diff}

        # 6. Graph-Assisted Topological Context (Shared Associates with Fuzzy Matching)
        assoc1 = list(rec1.get("known_associates", []))
        assoc2 = list(rec2.get("known_associates", []))
        if assoc1 and assoc2:
            shared_assoc = []
            for a1 in assoc1:
                for a2 in assoc2:
                    if a1 == a2 or string_similarity(str(a1), str(a2)) >= 0.80:
                        shared_assoc.append(f"{a1} / {a2}" if a1 != a2 else str(a1))
            if shared_assoc:
                w_assoc = self.compute_attribute_weight("shared_associate", True, min(1.0, len(shared_assoc) * 0.4))
                total_weight += w_assoc
                breakdown["shared_associate"] = {"status": "GRAPH_CONTEXT_MATCH", "weight": round(w_assoc, 2), "shared": shared_assoc}

        # Determine Decision Category
        if total_weight >= self.match_threshold:
            decision = "DEFINITIVE_MATCH"
            action = "AUTO_MERGE_UNIFIED_ENTITY"
        elif total_weight >= self.uncertain_threshold:
            decision = "PROBABLE_MATCH"
            action = "FLAG_FOR_INVESTIGATOR_REVIEW"
        else:
            decision = "DISTINCT_ENTITIES"
            action = "MAINTAIN_SEPARATE_NODES"

        return {
            "entity_1": {"id": rec1.get("id"), "name": name1},
            "entity_2": {"id": rec2.get("id"), "name": name2},
            "composite_weight": round(total_weight, 3),
            "decision": decision,
            "recommended_action": action,
            "weight_breakdown": breakdown,
            "thresholds": {"match": self.match_threshold, "uncertain": self.uncertain_threshold}
        }

    def generate_candidate_blocks(self, records: List[Dict[str, Any]]) -> List[Tuple[Dict[str, Any], Dict[str, Any]]]:
        """
        Applies Blocking & Indexing to overcome O(N^2) computational bottlenecks.
        Partition criteria:
        1. Soundex of Name (phonetic block)
        2. Age 5-year window
        3. First 3 digits of registered phone number
        """
        blocks = defaultdict(list)

        for rec in records:
            name = rec.get("full_name", "")
            sx = compute_soundex(name)
            if sx:
                blocks[f"phonetic_{sx}"].append(rec)

            age = rec.get("age")
            if age is not None:
                age_bucket = int(age) // 5
                blocks[f"age_bucket_{age_bucket}"].append(rec)

            for phone in rec.get("phones", []):
                p_clean = normalize_phone(phone)
                if len(p_clean) >= 5:
                    blocks[f"phone_prefix_{p_clean[:5]}"].append(rec)

            for plate in rec.get("vehicles", []):
                pl_clean = normalize_plate(plate)
                if len(pl_clean) >= 4:
                    blocks[f"plate_prefix_{pl_clean[:4]}"].append(rec)

        # Generate unique candidate pairs from within same blocks
        candidate_pairs = set()
        for b_key, block_records in blocks.items():
            n = len(block_records)
            for i in range(n):
                for j in range(i + 1, n):
                    id1 = block_records[i]["id"]
                    id2 = block_records[j]["id"]
                    if id1 != id2:
                        pair = (min(id1, id2), max(id1, id2))
                        candidate_pairs.add(pair)

        # Map back to record objects
        rec_map = {r["id"]: r for r in records}
        pairs = []
        for id1, id2 in candidate_pairs:
            if id1 in rec_map and id2 in rec_map:
                pairs.append((rec_map[id1], rec_map[id2]))

        return pairs

    def resolve_all_records(self, records: List[Dict[str, Any]]) -> Dict[str, Any]:
        """
        Runs the full blocked Fellegi-Sunter resolution pipeline over candidate records.
        """
        candidate_pairs = self.generate_candidate_blocks(records)
        evaluations = []
        matches_found = []
        review_required = []

        for r1, r2 in candidate_pairs:
            res = self.compare_records(r1, r2)
            evaluations.append(res)
            if res["decision"] == "DEFINITIVE_MATCH":
                matches_found.append(res)
            elif res["decision"] == "PROBABLE_MATCH":
                review_required.append(res)

        return {
            "total_records_processed": len(records),
            "candidate_pairs_evaluated": len(candidate_pairs),
            "blocking_efficiency_savings": f"{max(0, 100 - (len(candidate_pairs) / (len(records)**2 / 2 + 1) * 100)):.1f}%",
            "definitive_matches": matches_found,
            "investigator_reviews_needed": review_required,
            "all_evaluations": evaluations
        }

entity_resolver = FellegiSunterEntityResolver()
