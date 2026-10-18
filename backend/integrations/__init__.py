"""
CCTNS & ICJS Integration Layer
--------------------------------
Provides a standards-aligned adapter interface for connecting to the
Crime and Criminal Tracking Network & Systems (CCTNS) and the
Inter-operable Criminal Justice System (ICJS).

Ships in MOCK mode by default (no government credentials required) so the
full request/response contract can be demonstrated end-to-end. Switching
INTEGRATION_MODE to "LIVE" in config.py (once NCRB/state police provision
API credentials) activates the real HTTP clients with zero changes to any
calling code — the adapter interface is identical in both modes.
"""

from backend.integrations.cctns_adapter import cctns_adapter
from backend.integrations.icjs_adapter import icjs_adapter

__all__ = ["cctns_adapter", "icjs_adapter"]