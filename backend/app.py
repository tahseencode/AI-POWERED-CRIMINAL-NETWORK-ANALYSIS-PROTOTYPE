import datetime
import json
import os
import sqlite3
from flask import Flask, jsonify, request
from flask_cors import CORS
import jwt

from backend.config import Config
from backend.core.database import Database
from backend.core.entity_resolution import EntityResolutionEngine
from backend.core.gnn_predictive import PredictiveAnalysisEngine
from backend.core.graph_analytics import GraphAnalyticsEngine
from backend.core.graph_rag import GraphRAGEngine
from backend.core.knowledge_graph import KnowledgeGraphEngine
from backend.core.legal_ner import LegalNEREngine
from backend.core.ocr_processor import OCRProcessor
from backend.core.otp_service import OTPService
from backend.core.outcome_forecaster import OutcomeForecastingEngine
from backend.core.security import (
    check_rbac_permission,
    hash_password,
    log_audit_event,
    verify_password,
)
from backend.core.spatio_temporal import SpatioTemporalEngine

app = Flask(__name__)
app.config.from_object(Config)
CORS(app)

db = Database(app.config["DATABASE_PATH"])
otp_service = OTPService()

# Initialize Engine Components
graph_analytics = GraphAnalyticsEngine()
knowledge_graph = KnowledgeGraphEngine()
entity_resolution = EntityResolutionEngine()
gnn_engine = PredictiveAnalysisEngine()
spatio_temporal = SpatioTemporalEngine()
graph_rag = GraphRAGEngine()
legal_ner = LegalNEREngine()
ocr_processor = OCRProcessor()
outcome_forecaster = OutcomeForecastingEngine()


def token_required(f):
    def decorator(*args, **kwargs):
        token = None
        if "Authorization" in request.headers:
            auth_header = request.headers["Authorization"]
            if auth_header.startswith("Bearer "):
                token = auth_header.split(" ")[1]

        if not token:
            return jsonify({"message": "Token is missing"}), 401

        try:
            data = jwt.decode(
                token, app.config["SECRET_KEY"], algorithms=[app.config["JWT_ALGORITHM"]]
            )
            current_user = db.get_user_by_id(data["user_id"])
            if not current_user:
                return jsonify({"message": "Invalid user token"}), 401
        except Exception:
            return jsonify({"message": "Token is invalid or expired"}), 401

        return f(current_user, *args, **kwargs)

    decorator.__name__ = f.__name__
    return decorator


@app.route("/api/auth/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    username = data.get("username")
    password = data.get("password")

    user = db.get_user_by_username(username)
    if not user or not verify_password(password, user["password_hash"]):
        return jsonify({"message": "Invalid credentials"}), 401

    if user.get("mfa_enabled"):
        otp_service.generate_otp(user["id"])
        return jsonify(
            {
                "status": "mfa_required",
                "user_id": user["id"],
                "message": "OTP generated for verification.",
            }
        ), 200

    token = jwt.encode(
        {
            "user_id": user["id"],
            "role": user["role"],
            "exp": datetime.datetime.utcnow()
            + datetime.timedelta(minutes=app.config["JWT_EXPIRATION_MINUTES"]),
        },
        app.config["SECRET_KEY"],
        algorithm=app.config["JWT_ALGORITHM"],
    )

    log_audit_event(
        app.config["AUDIT_LOG_PATH"], user["id"], "LOGIN", "User logged in successfully"
    )
    return jsonify({"token": token, "user": user}), 200


@app.route("/api/auth/verify-otp", methods=["POST"])
def verify_otp():
    data = request.get_json() or {}
    user_id = data.get("user_id")
    code = data.get("code")

    if not otp_service.verify_otp(user_id, code):
        return jsonify({"message": "Invalid OTP code"}), 400

    user = db.get_user_by_id(user_id)
    token = jwt.encode(
        {
            "user_id": user["id"],
            "role": user["role"],
            "exp": datetime.datetime.utcnow()
            + datetime.timedelta(minutes=app.config["JWT_EXPIRATION_MINUTES"]),
        },
        app.config["SECRET_KEY"],
        algorithm=app.config["JWT_ALGORITHM"],
    )

    log_audit_event(
        app.config["AUDIT_LOG_PATH"], user["id"], "LOGIN_MFA", "User completed MFA login"
    )
    return jsonify({"token": token, "user": user}), 200


@app.route("/api/analytics/network-graph", methods=["GET"])
@token_required
def get_network_graph(current_user):
    data = knowledge_graph.get_full_graph()
    return jsonify(data), 200


@app.route("/api/analytics/centrality", methods=["GET"])
@token_required
def get_centrality(current_user):
    metrics = graph_analytics.calculate_centralities()
    return jsonify(metrics), 200


@app.route("/api/analytics/link-prediction", methods=["POST"])
@token_required
def predict_links(current_user):
    predictions = gnn_engine.predict_links()
    return jsonify(predictions), 200


@app.route("/api/analytics/entity-resolution", methods=["POST"])
@token_required
def resolve_entities(current_user):
    data = request.get_json() or {}
    threshold = data.get("threshold", 0.85)
    matches = entity_resolution.resolve_duplicates(threshold=threshold)
    return jsonify(matches), 200


@app.route("/api/analytics/spatio-temporal", methods=["GET"])
@token_required
def get_spatio_temporal(current_user):
    st_data = spatio_temporal.get_hotspots()
    return jsonify(st_data), 200


@app.route("/api/analytics/legal-ner", methods=["POST"])
@token_required
def extract_legal_ner(current_user):
    data = request.get_json() or {}
    text = data.get("text", "")
    entities = legal_ner.extract_entities(text)
    return jsonify(entities), 200


@app.route("/api/analytics/ocr", methods=["POST"])
@token_required
def process_ocr(current_user):
    if "file" not in request.files:
        return jsonify({"message": "No file uploaded"}), 400

    uploaded_file = request.files["file"]
    extracted_text = ocr_processor.process_image(uploaded_file)
    return jsonify({"extracted_text": extracted_text}), 200


@app.route("/api/analytics/query-rag", methods=["POST"])
@token_required
def query_rag(current_user):
    data = request.get_json() or {}
    query = data.get("query", "")
    response = graph_rag.answer_query(query)
    return jsonify(response), 200


@app.route("/api/analytics/forecast-outcome", methods=["POST"])
@token_required
def forecast_outcome(current_user):
    data = request.get_json() or {}
    forecast = outcome_forecaster.forecast(data)
    return jsonify(forecast), 200


@app.route("/api/cases", methods=["GET"])
@token_required
def get_cases(current_user):
    if not check_rbac_permission(current_user["role"], "read_cases"):
        return jsonify({"message": "Unauthorized"}), 403

    cases_path = app.config["CASES_PATH"]
    if os.path.exists(cases_path):
        with open(cases_path, "r") as f:
            cases = json.load(f)
    else:
        cases = []
    return jsonify(cases), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)