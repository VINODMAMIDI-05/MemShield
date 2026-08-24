export type DataType = 
  | "EMAIL"
  | "PHONE"
  | "AADHAAR"
  | "PAN"
  | "CREDIT_CARD"
  | "PASSWORD"
  | "API_KEY"
  | "AUTH_TOKEN"
  | "PRIVATE_KEY"
  | "ADDRESS"
  | "HEALTH_RECORD"
  | "BANK_ACCOUNT"
  | "PERSONAL_IDENTIFIER";

export type SensitivityLevel = "PUBLIC" | "INTERNAL" | "CONFIDENTIAL" | "STRICTLY_CONFIDENTIAL";

export type PolicyAction = "ALLOW" | "MASK" | "BLOCK" | "SYNTHETIC";

export type ThemeMode = "cyber" | "indigo" | "emerald" | "light";

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  organization?: string;
  created_at?: string;
  last_login?: string;
}

export interface Policy {
  id: string;
  scope: string;
  data_type: DataType;
  sensitivity: SensitivityLevel;
  action: PolicyAction;
  enabled: boolean;
  owner_id?: string;
  description?: string;
  custom_pattern?: string;
  created_at?: string;
}

export interface Session {
  id: string;
  user_id: string;
  source: string;
  status: "CREATED" | "ACTIVE" | "COMPLETED" | "BLOCKED";
  started_at: string;
  ended_at?: string | null;
  total_detected: number;
  total_masked: number;
  total_blocked: number;
  ai_model?: string;
  memory_guard_triggered?: boolean;
}

export interface DetectionResult {
  id?: string;
  type: DataType;
  sensitivity: SensitivityLevel;
  confidence: number;
  risk_score: number;
  start: number;
  end: number;
  value: string;
  detector_name: string;
  action: PolicyAction;
}

export interface SanitizationResponse {
  session_id: string;
  safe_content: string;
  blocked: boolean;
  safe_for_ai: boolean;
  detections: DetectionResult[];
  latency_ms?: number;
}

export interface AuditLog {
  id: string;
  user_id: string;
  session_id?: string | null;
  event_type: string;
  action: PolicyAction | "INITIALIZE" | "STOP" | "UPDATE_POLICY";
  data_type?: string | null;
  timestamp: string;
  metadata?: Record<string, any>;
  risk_level?: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  ip_address?: string;
}

export interface DashboardStats {
  protection_status: "ACTIVE" | "INACTIVE" | "DEGRADED";
  total_detected: number;
  total_masked: number;
  total_blocked: number;
  active_sessions: number;
  total_shielded_tokens?: number;
  memory_leak_preventions?: number;
  recent_events: AuditLog[];
}

export interface AIProcessResponse {
  session_id: string;
  ai_response: string;
  shield_status: "PASSED" | "MASKED_FORWARD" | "BLOCKED";
  detections_count: number;
  memory_written: boolean;
  latency_ms: number;
}

export interface CompliancePreset {
  id: string;
  name: string;
  badge: string;
  description: string;
  rules: Partial<Record<DataType, PolicyAction>>;
  standards: string[];
}

export interface MemoryGuardItem {
  id: string;
  timestamp: string;
  entity_type: DataType;
  source_context: string;
  target_ai_memory: string;
  status: "POISON_PREVENTED" | "PII_STRIPPED" | "EMBEDDING_BLOCKED";
  risk: "CRITICAL" | "HIGH" | "MEDIUM";
}
