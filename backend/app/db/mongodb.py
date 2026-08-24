import logging
from typing import Optional, List, Dict, Any
from datetime import datetime, timezone
import hashlib
from motor.motor_asyncio import AsyncIOMotorClient
from app.core.config import settings

logger = logging.getLogger("memshield.mongodb")

mongo_client: Optional[AsyncIOMotorClient] = None
mongo_db = None

async def connect_to_mongo():
    """
    Initialize MongoDB Atlas connection pool.
    """
    global mongo_client, mongo_db
    if not settings.MONGODB_URI:
        logger.info("MONGODB_URI not configured. Skipping MongoDB initialization.")
        return

    try:
        logger.info("Connecting to MongoDB Atlas...")
        mongo_client = AsyncIOMotorClient(
            settings.MONGODB_URI,
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=5000
        )
        # Verify connection by pinging
        await mongo_client.admin.command('ping')
        mongo_db = mongo_client["memshield_vault"]
        logger.info(" Successfully connected to MongoDB Atlas (memshield_vault)")

        # Create indexes for audit logs and memory collection
        await mongo_db.audit_logs.create_index([("timestamp", -1)])
        await mongo_db.audit_logs.create_index([("session_id", 1)])
        await mongo_db.audit_logs.create_index([("event_type", 1)])
        await mongo_db.ai_memory.create_index([("timestamp", -1)])
        await mongo_db.ai_memory.create_index([("session_id", 1)])
    except Exception as e:
        logger.warning(f" MongoDB Atlas connection failed (proceeding in local fallback mode): {e}")
        mongo_db = None

async def close_mongo_connection():
    """
    Close MongoDB Atlas connection pool on shutdown.
    """
    global mongo_client
    if mongo_client:
        mongo_client.close()
        logger.info("MongoDB Atlas connection closed.")

async def save_mongo_audit_log(
    event_type: str,
    action: str,
    data_type: Optional[str] = None,
    session_id: Optional[str] = None,
    user_id: Optional[str] = None,
    risk_level: str = "MEDIUM",
    metadata: Optional[Dict[str, Any]] = None,
    ip_address: Optional[str] = "127.0.0.1"
) -> Optional[str]:
    """
    Persist an immutable audit log into the MongoDB audit_vault.
    Generates a cryptographic SHA-256 integrity hash.
    """
    if mongo_db is None:
        return None

    try:
        ts = datetime.now(timezone.utc).isoformat()
        # Compute SHA-256 signature for tamper-evidence
        hash_payload = f"{event_type}:{action}:{data_type}:{session_id}:{ts}"
        sha256_hash = hashlib.sha256(hash_payload.encode('utf-8')).hexdigest()

        doc = {
            "event_type": event_type,
            "action": action,
            "data_type": data_type,
            "session_id": session_id,
            "user_id": user_id,
            "risk_level": risk_level,
            "metadata": metadata or {},
            "ip_address": ip_address,
            "sha256_hash": sha256_hash,
            "timestamp": ts
        }

        result = await mongo_db.audit_logs.insert_one(doc)
        return str(result.inserted_id)
    except Exception as e:
        logger.error(f"Failed to write audit log to MongoDB: {e}")
        return None

async def save_mongo_ai_memory(
    session_id: str,
    safe_content: str,
    detections_count: int,
    memory_status: str = "SANITIZED_CONTEXT",
    vector_indexed: bool = True,
    metadata: Optional[Dict[str, Any]] = None
) -> Optional[str]:
    """
    Persist sanitized AI memory context and vector state in MongoDB.
    """
    if mongo_db is None:
        return None

    try:
        doc = {
            "session_id": session_id,
            "safe_content": safe_content,
            "detections_count": detections_count,
            "memory_status": memory_status,
            "vector_indexed": vector_indexed,
            "metadata": metadata or {},
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        result = await mongo_db.ai_memory.insert_one(doc)
        return str(result.inserted_id)
    except Exception as e:
        logger.error(f"Failed to write AI memory record to MongoDB: {e}")
        return None

async def get_mongo_audit_logs(limit: int = 50, session_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Query recent immutable audit logs from MongoDB.
    """
    if mongo_db is None:
        return []

    try:
        query = {}
        if session_id:
            query["session_id"] = session_id

        cursor = mongo_db.audit_logs.find(query).sort("timestamp", -1).limit(limit)
        logs = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            del doc["_id"]
            logs.append(doc)
        return logs
    except Exception as e:
        logger.error(f"Failed to read audit logs from MongoDB: {e}")
        return []

async def get_mongo_ai_memories(limit: int = 50, session_id: Optional[str] = None) -> List[Dict[str, Any]]:
    """
    Query sanitized AI memory records from MongoDB.
    """
    if mongo_db is None:
        return []

    try:
        query = {}
        if session_id:
            query["session_id"] = session_id

        cursor = mongo_db.ai_memory.find(query).sort("timestamp", -1).limit(limit)
        memories = []
        async for doc in cursor:
            doc["id"] = str(doc["_id"])
            del doc["_id"]
            memories.append(doc)
        return memories
    except Exception as e:
        logger.error(f"Failed to read AI memory from MongoDB: {e}")
        return []
