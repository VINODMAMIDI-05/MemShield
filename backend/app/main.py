from contextlib import asynccontextmanager
from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text

from app.db.session import engine, Base, get_db
from app.db.mongodb import connect_to_mongo, close_mongo_connection, mongo_db
from app.core.config import settings

# Route imports
from app.api.routes import (
    auth,
    policies,
    sessions,
    protection,
    detection,
    dashboard,
    audit,
    ai,
    speech,
    outputs
)

# Auto create SQLite/Postgres tables on startup
Base.metadata.create_all(bind=engine)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Connect to MongoDB Atlas
    await connect_to_mongo()
    yield
    # Shutdown: Close MongoDB connection
    await close_mongo_connection()

app = FastAPI(
    title="MemShield API",
    description="Privacy protection engine and security middleware for AI systems.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    lifespan=lifespan
)

# Configure CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Health endpoint
@app.get("/api/v1/health")
def health_check(db: Session = Depends(get_db)):
    db_status = "unhealthy"
    try:
        db.execute(text("SELECT 1"))
        db_status = "healthy"
    except Exception:
        pass

    mongo_status = "connected" if mongo_db is not None else ("configured_connecting" if settings.MONGODB_URI else "disabled")

    return {
        "status": "healthy",
        "database": db_status,
        "mongodb_vault": mongo_status,
        "protection_engine": "active",
        "ai_gateway": "active"
    }

# Include routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Auth"])
app.include_router(protection.router, prefix="/api/v1/protection", tags=["Protection"])
app.include_router(policies.router, prefix="/api/v1/policies", tags=["Policies"])
app.include_router(sessions.router, prefix="/api/v1/sessions", tags=["Sessions"])
app.include_router(detection.router, prefix="/api/v1/detection", tags=["Detection"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard"])
app.include_router(audit.router, prefix="/api/v1/audit", tags=["Audit"])
app.include_router(ai.router, prefix="/api/v1/ai", tags=["AI"])
app.include_router(speech.router, prefix="/api/v1/speech", tags=["Speech"])
app.include_router(outputs.router, prefix="/api/v1/outputs", tags=["Outputs"])
