import pytest
from fastapi.testclient import TestClient
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.main import app
from app.db.session import Base, get_db

# Use in-memory SQLite database for testing
SQLALCHEMY_DATABASE_URL = "sqlite:///./test.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create tables
Base.metadata.create_all(bind=engine)

def override_get_db():
    try:
        db = TestingSessionLocal()
        yield db
    finally:
        db.close()

# Override dependency
app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

@pytest.fixture(autouse=True)
def clean_db():
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    yield

def test_health():
    response = client.get("/api/v1/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

def test_auth_and_session_flow():
    # 1. Register a new user
    register_payload = {
        "name": "Alice",
        "email": "alice@example.com",
        "password": "strongpassword123"
    }
    res_reg = client.post("/api/v1/auth/register", json=register_payload)
    assert res_reg.status_code == 201
    data = res_reg.json()
    assert "access_token" in data
    token = data["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Query read current user (/me)
    res_me = client.get("/api/v1/auth/me", headers=headers)
    assert res_me.status_code == 200
    assert res_me.json()["email"] == "alice@example.com"

    # 3. Create a protected session
    res_sess = client.post(
        "/api/v1/sessions",
        json={"source": "meeting_transcript"},
        headers=headers
    )
    assert res_sess.status_code == 201
    session_data = res_sess.json()
    session_id = session_data["id"]
    assert session_data["status"] == "CREATED"

    # 4. Start the session
    res_start = client.post(f"/api/v1/sessions/{session_id}/start", headers=headers)
    assert res_start.status_code == 200
    assert res_start.json()["status"] == "ACTIVE"

    # 5. Sanitize sensitive email
    sanitize_payload = {
        "session_id": session_id,
        "content": "My private email is alice.smith@example.com",
        "source": "transcript"
    }
    res_protect = client.post("/api/v1/protection/sanitize", json=sanitize_payload, headers=headers)
    assert res_protect.status_code == 200
    protect_data = res_protect.json()
    assert protect_data["safe_content"] == "My private email is [EMAIL REDACTED]"
    
    # 6. Retrieve dashboard stats
    res_dash = client.get("/api/v1/dashboard", headers=headers)
    assert res_dash.status_code == 200
    dash_data = res_dash.json()
    assert dash_data["total_detected"] == 1
    assert dash_data["total_masked"] == 1
    assert dash_data["active_sessions"] == 1
