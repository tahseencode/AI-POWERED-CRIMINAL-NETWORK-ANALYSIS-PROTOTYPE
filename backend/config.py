import os


class Config:
    SECRET_KEY = os.getenv("SECRET_KEY", "super-secret-key-change-me-in-production")
    DATABASE_PATH = os.getenv("DATABASE_PATH", "data/criminal_network_users.db")
    AUDIT_LOG_PATH = os.getenv("AUDIT_LOG_PATH", "data/immutable_audit_log.json")
    CASES_PATH = os.getenv("CASES_PATH", "data/investigation_cases.json")
    JWT_ALGORITHM = "HS256"
    JWT_EXPIRATION_MINUTES = 60