"""
Data contracts matching NCRB CCTNS field standards and the ICJS
5-Pillar interoperability model (Police, Courts, Prisons, Forensics,
Prosecution). Keeping these as explicit schemas — rather than ad-hoc
dicts — is what makes the adapter layer "integration-ready": a live
CCTNS/ICJS feed only needs to satisfy this shape.
"""

from typing import Dict, Any, List, Optional
from pydantic import BaseModel, Field


class CCTNSFIRRecord(BaseModel):
    fir_number: str
    police_station: str
    district: str
    state: str = "West Bengal"
    date_of_fir: str
    sections_applied: List[str] = Field(default_factory=list)
    complainant_name: Optional[str] = None
    accused_names: List[str] = Field(default_factory=list)
    investigation_status: str = "UNDER_INVESTIGATION"
    is_zero_fir: bool = False
    cctns_unique_id: Optional[str] = None


class CCTNSCriminalRecord(BaseModel):
    cctns_id: str
    name: str
    aliases: List[str] = Field(default_factory=list)
    father_name: Optional[str] = None
    age: Optional[int] = None
    address: Optional[str] = None
    prior_convictions: List[str] = Field(default_factory=list)
    linked_firs: List[str] = Field(default_factory=list)
    fingerprint_nafis_id: Optional[str] = None


class ICJSCourtCase(BaseModel):
    case_id: str
    fir_number: Optional[str] = None
    court_name: str
    case_stage: str = "CHARGESHEET_PENDING"
    next_hearing_date: Optional[str] = None
    presiding_judge: Optional[str] = None


class ICJSPillarRecord(BaseModel):
    pillar: str  # POLICE | COURTS | PRISONS | FORENSICS | PROSECUTION
    record_id: str
    linked_fir: Optional[str] = None
    status: str
    last_synced: str
    source_system: str


class IntegrationHealthStatus(BaseModel):
    system: str
    mode: str  # "MOCK" or "LIVE"
    reachable: bool
    last_checked: str
    notes: str