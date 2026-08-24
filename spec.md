# MEMSHIELD — COMPLETE PROJECT SPECIFICATION
# Version: 1.0
# Status: MVP / Development Source of Truth

================================================================================
1. PROJECT IDENTITY
================================================================================

Project Name:
MemShield

Product Type:
AI Privacy Protection Engine / Privacy Middleware / AI Memory Security Layer

Primary Purpose:
MemShield protects sensitive information before that information is processed,
stored, shared, or remembered by an AI system.

Core Product Statement:
"MemShield is a privacy and security engine that detects sensitive information,
classifies its risk, evaluates permissions and policies, and allows, masks, or
blocks the information before it reaches AI processing or AI memory."

Core Security Principle:
RAW SENSITIVE DATA MUST NEVER REACH THE AI/MEMORY LAYER WHEN THE ACTIVE POLICY
REQUIRES IT TO BE MASKED OR BLOCKED.

Important Product Boundary:

MemShield is NOT primarily a meeting application.

MemShield is the privacy/security engine that can be used by:

- Meeting applications
- Browser extensions
- AI assistants
- AI memory systems
- Productivity applications
- Enterprise applications
- Document-processing applications
- Chat applications

Example:

Meeting Application
        |
        v
     MemShield
        |
        v
  Protected Content
        |
        v
       AI
        |
        v
    AI Memory


================================================================================
2. PRODUCT VISION
================================================================================

The goal of MemShield is to create a privacy boundary between users and AI.

Traditional flow:

User
  |
  v
Application
  |
  v
AI
  |
  v
AI Memory

Problem:
Sensitive information can accidentally reach the AI model, logs, database,
or long-term AI memory.

MemShield flow:

User
  |
  v
Application
  |
  v
MemShield
  |
  +--> Detect sensitive information
  |
  +--> Classify sensitivity
  |
  +--> Identify owner/context
  |
  +--> Check permissions
  |
  +--> Check privacy policy
  |
  +--> Calculate risk
  |
  +--> Allow / Mask / Block / Encrypt
  |
  v
Safe Content
  |
  v
AI
  |
  v
Protected AI Memory


================================================================================
3. PRIMARY OBJECTIVES
================================================================================

MemShield must:

1. Detect sensitive information.
2. Identify the type of sensitive information.
3. Classify the sensitivity level.
4. Calculate confidence and risk.
5. Identify data ownership where possible.
6. Check participant/user permissions.
7. Apply configurable privacy policies.
8. Mask sensitive information.
9. Redact sensitive information.
10. Block highly sensitive information.
11. Encrypt sensitive information when storage is required.
12. Prevent raw sensitive information from reaching AI when required.
13. Protect AI-generated outputs.
14. Protect AI memory.
15. Maintain privacy audit events.
16. Avoid storing raw sensitive values unnecessarily.
17. Delete temporary sensitive data after processing.
18. Provide APIs for external applications.
19. Provide a dashboard for configuration and monitoring.
20. Remain independent of a specific AI provider.
21. Remain independent of a specific meeting platform.
22. Support future integrations without changing the core privacy engine.


================================================================================
4. TARGET USERS
================================================================================

4.1 END USERS

Users who want their information protected while using AI.

Examples:

- Employees
- Students
- Teachers
- Researchers
- Developers
- Business users
- Consultants
- Enterprise users

4.2 SECURITY / ADMIN USERS

Users responsible for configuring privacy and security policies.

Examples:

- Security administrators
- IT administrators
- Compliance teams
- Organization administrators

4.3 DEVELOPERS

Developers who want to integrate MemShield into:

- AI applications
- Meeting applications
- AI assistants
- Browser extensions
- Enterprise applications
- AI memory systems
- Productivity tools


================================================================================
5. PRIMARY USE CASE
================================================================================

A user provides content containing sensitive information.

Example:

"My email is john@example.com and my API key is SECRET123."

MemShield processes the content.

Detection:

EMAIL
API_KEY

Policy:

EMAIL  -> MASK
API_KEY -> BLOCK

Protected output:

"My email is [EMAIL REDACTED] and my API key is [API KEY BLOCKED]."

AI receives only:

"My email is [EMAIL REDACTED] and my API key is [API KEY BLOCKED]."

AI MUST NOT receive:

john@example.com
SECRET123


================================================================================
6. SUPPORTED INPUTS
================================================================================

MVP INPUTS:

1. Plain text
2. Meeting transcript
3. AI prompt
4. Chat content
5. Text extracted from documents

OPTIONAL / FUTURE INPUTS:

6. Audio
7. Live audio stream
8. Screen-share OCR
9. Images
10. PDFs
11. Application events
12. API payloads
13. Email content
14. Collaboration messages

All inputs must be normalized into a common internal representation.

Example normalized input:

{
  "session_id": "session_123",
  "source": "meeting_transcript",
  "actor_id": "user_123",
  "content": "My email is john@example.com",
  "timestamp": "2026-08-23T10:00:00Z"
}


================================================================================
7. INPUT PROCESSING MODES
================================================================================

MemShield supports:

MODE 1:
Text Protection

MODE 2:
Transcript Protection

MODE 3:
AI Prompt Protection

MODE 4:
Document Protection

MODE 5:
Audio -> Speech-to-Text -> Protection

MODE 6:
Real-Time Protection (future)


================================================================================
8. COMPLETE MEMSHIELD PROCESSING PIPELINE
================================================================================

The complete pipeline is:

1. Session Start
2. Input Ingestion
3. Input Normalization
4. Speech-to-Text (if audio)
5. NLP / AI Analysis
6. Sensitive Data Detection
7. Entity Classification
8. Sensitivity Classification
9. Confidence Calculation
10. Risk Calculation
11. Data Ownership Detection
12. Permission Evaluation
13. Policy Evaluation
14. Protection Decision
15. Mask / Redact / Block / Encrypt / Allow
16. Protected Content Generation
17. Output Validation
18. AI Processing
19. AI Output Protection
20. Protected Memory Storage
21. Privacy Audit Event
22. Temporary Data Cleanup
23. Session Completion


================================================================================
9. SESSION LIFECYCLE
================================================================================

A protected operation is represented by a session.

Session states:

CREATED
    |
    v
ACTIVE
    |
    v
PROCESSING
    |
    v
COMPLETED

Failure:

ACTIVE
    |
    v
ERROR
    |
    v
CLEANUP
    |
    v
CLOSED

A session must have:

- Session ID
- User ID
- Source
- Status
- Start time
- End time
- Processing statistics
- Protection status


================================================================================
10. SENSITIVE DATA DETECTION
================================================================================

MemShield must detect sensitive information.

MINIMUM MVP DETECTION TYPES:

1. EMAIL
2. PHONE
3. AADHAAR
4. PAN
5. CREDIT_CARD
6. BANK_ACCOUNT
7. PASSWORD
8. API_KEY
9. AUTH_TOKEN
10. PRIVATE_KEY
11. ADDRESS
12. PERSONAL_IDENTIFIER

FUTURE DETECTION TYPES:

13. DATE_OF_BIRTH
14. PASSPORT
15. DRIVING_LICENSE
16. MEDICAL_INFORMATION
17. FINANCIAL_INFORMATION
18. INTERNAL_COMPANY_INFORMATION
19. CONFIDENTIAL_DOCUMENT_CONTENT
20. SECRET_CONFIGURATION
21. DATABASE_CREDENTIAL
22. CLOUD_CREDENTIAL
23. SOURCE_CODE_SECRET


================================================================================
11. DETECTION METHODS
================================================================================

MemShield should use a layered detection architecture.

LEVEL 1:
Regex / Pattern Detection

Used for:

- Email
- Phone
- Aadhaar
- PAN
- Credit card
- API key patterns
- Token patterns

LEVEL 2:
Keyword / Context Detection

Examples:

"password"
"secret"
"API key"
"token"
"PIN"
"account number"

LEVEL 3:
NER / NLP Detection

Used for:

- Person names
- Addresses
- Organizations
- Locations
- Personal information

LEVEL 4:
AI / ML Classification

Used for:

- Contextual sensitivity
- Confidential business information
- Ambiguous cases
- Advanced classification

The detection engine must be modular so individual detectors can be replaced.


================================================================================
12. DETECTION RESULT FORMAT
================================================================================

Every detection should produce:

- Detection ID
- Data type
- Sensitivity
- Confidence
- Risk score
- Start position
- End position
- Detection source
- Session ID
- Actor ID where applicable
- Recommended action

Example:

{
  "id": "det_001",
  "type": "EMAIL",
  "sensitivity": "CONFIDENTIAL",
  "confidence": 0.99,
  "risk_score": 0.75,
  "start": 15,
  "end": 32,
  "source": "regex",
  "recommended_action": "MASK"
}

IMPORTANT:

The raw detected value should NOT be persisted unless explicitly required
by a future secure encrypted feature.


================================================================================
13. SENSITIVITY CLASSIFICATION
================================================================================

MemShield uses four primary sensitivity levels.

PUBLIC
    |
    No meaningful privacy restriction.

INTERNAL
    |
    Organization/internal information.

CONFIDENTIAL
    |
    Personal or business-sensitive information.

HIGHLY_CONFIDENTIAL
    |
    Credentials, secrets, financial/security information.

Examples:

PUBLIC:
- General knowledge
- Public discussion

INTERNAL:
- Internal project information
- Internal meeting topics

CONFIDENTIAL:
- Email
- Phone
- Address
- PAN
- Aadhaar

HIGHLY_CONFIDENTIAL:
- Password
- API key
- Authentication token
- Private key
- Bank credentials


================================================================================
14. CONFIDENCE SCORE
================================================================================

Every detection must have a confidence score.

Range:

0.00 -> 1.00

Example:

EMAIL:
0.99

PHONE:
0.95

PASSWORD:
0.82

Contextual confidential information:
0.70

The confidence score is used by the policy/risk engine.


================================================================================
15. RISK SCORE
================================================================================

Risk is calculated using factors such as:

- Sensitivity
- Detection confidence
- Data type
- User context
- Destination
- Sharing scope
- Ownership
- Policy
- AI destination

Risk levels:

LOW
MEDIUM
HIGH
CRITICAL

Example:

PASSWORD + HIGH CONFIDENCE + AI DESTINATION
=
CRITICAL


================================================================================
16. DATA OWNERSHIP
================================================================================

MemShield should identify who owns or controls sensitive data where possible.

Possible owners:

- Current user
- Meeting participant
- Organization
- External party
- Unknown

Example:

Participant A:
"My phone number is 9876543210."

Participant B should not automatically receive the raw phone number.

The privacy engine evaluates:

OWNER
+
VIEWER
+
ROLE
+
DATA TYPE
+
POLICY


================================================================================
17. PERMISSION ENGINE
================================================================================

The permission engine determines whether a user or participant can access
specific information.

Inputs:

- Owner
- Requesting user
- User role
- Participant
- Organization
- Data sensitivity
- Policy
- Session context

Outputs:

ALLOW
MASK
BLOCK

Example:

Owner:
User A

Viewer:
User B

Data:
PHONE

Result:

User A -> ALLOW
User B -> MASK


================================================================================
18. MEMPRIVACY ENGINE
================================================================================

MemPrivacy is the privacy decision engine inside MemShield.

Responsibilities:

1. Identify ownership.
2. Identify audience.
3. Check permissions.
4. Check policies.
5. Evaluate risk.
6. Decide protection action.
7. Return a deterministic protection decision.

Example:

{
  "data_type": "PASSWORD",
  "sensitivity": "HIGHLY_CONFIDENTIAL",
  "owner": "user_123",
  "destination": "AI",
  "policy_action": "BLOCK",
  "decision": "BLOCK"
}


================================================================================
19. POLICY ENGINE
================================================================================

Policies determine how MemShield handles detected information.

Supported MVP actions:

ALLOW
MASK
BLOCK

Future:

REDACT
ENCRYPT
TOKENIZE
ANONYMIZE
QUARANTINE

Example policy:

EMAIL:
MASK

PHONE:
MASK

PASSWORD:
BLOCK

API_KEY:
BLOCK

AADHAAR:
BLOCK

PAN:
MASK

NAME:
ALLOW


================================================================================
20. POLICY PRIORITY
================================================================================

Policy priority must be deterministic.

Recommended order:

1. Organization Policy
2. User Policy
3. Session Policy

If a higher-priority policy conflicts with a lower-priority policy,
the higher-priority policy wins.

Example:

Organization:
PASSWORD -> BLOCK

User:
PASSWORD -> ALLOW

Final:
PASSWORD -> BLOCK


================================================================================
21. MASKING ENGINE
================================================================================

The masking engine creates safe replacements.

Examples:

john@example.com
->
[EMAIL REDACTED]

9876543210
->
[PHONE REDACTED]

ABCDE1234F
->
[PAN REDACTED]

123456789012
->
[AADHAAR REDACTED]

SecretPassword123
->
[PASSWORD BLOCKED]

sk-example-secret
->
[API KEY BLOCKED]


================================================================================
22. MASKING REQUIREMENTS
================================================================================

The masking engine must:

1. Preserve sentence meaning where possible.
2. Preserve non-sensitive information.
3. Remove the original sensitive value.
4. Avoid partial leakage.
5. Handle multiple detections.
6. Handle overlapping detections.
7. Support deterministic replacements.
8. Return metadata about applied actions.

Example:

INPUT:

"My email is john@example.com and my phone is 9876543210."

OUTPUT:

"My email is [EMAIL REDACTED] and my phone is [PHONE REDACTED]."


================================================================================
23. BLOCKING ENGINE
================================================================================

BLOCK means:

1. Sensitive content is identified.
2. Raw value is removed from the AI payload.
3. AI request is prevented or sanitized.
4. Event is logged.
5. User is informed if required.

Example:

Input:

"My production password is Secret123."

Output:

"My production password is [PASSWORD BLOCKED]."


================================================================================
24. FAIL-CLOSED SECURITY
================================================================================

Security-critical protection must fail closed.

If MemShield cannot guarantee protection:

DO NOT SEND RAW CONTENT TO AI.

Example:

MemShield unavailable
        |
        v
PROTECTION_UNAVAILABLE
        |
        v
AI REQUEST BLOCKED

The system must never silently bypass MemShield.


================================================================================
25. AI PRIVACY BOUNDARY
================================================================================

This is the most important component of the system.

WRONG:

Application
    |
    v
AI
    |
    v
MemShield

CORRECT:

Application
    |
    v
MemShield
    |
    v
Safe Content
    |
    v
AI
    |
    v
Memory


================================================================================
26. AI GATEWAY
================================================================================

MemShield must contain an AI Gateway abstraction.

Interface:

AIProvider

Implementations:

LocalAIProvider
CloudAIProvider

Possible providers:

- Local model
- OpenAI-compatible provider
- Other cloud providers

The MemShield core must not depend directly on one provider.


================================================================================
27. AI REQUEST PROTECTION
================================================================================

Before an AI request is made:

1. Validate session.
2. Run MemShield protection.
3. Validate sanitized content.
4. Verify no blocked raw value remains.
5. Send only safe content to AI.

Example:

RAW:

"My API key is SECRET123."

PROTECTED:

"My API key is [API KEY BLOCKED]."

AI REQUEST:

"My API key is [API KEY BLOCKED]."


================================================================================
28. AI RESPONSE PROTECTION
================================================================================

AI-generated content can accidentally reconstruct or reveal sensitive information.

Therefore:

AI Response
    |
    v
MemShield Output Check
    |
    v
Detection
    |
    v
Policy
    |
    v
Protected AI Response


================================================================================
29. AI MEMORY PROTECTION
================================================================================

AI memory is a critical privacy boundary.

Before information is stored in memory:

1. Run detection.
2. Run classification.
3. Run policy.
4. Remove/block prohibited information.
5. Store only approved protected content.

Example:

AI memory MUST NOT store:

"Customer password is Secret123."

If policy is BLOCK:

"Customer password is [PASSWORD BLOCKED]."


================================================================================
30. PROTECTED TRANSCRIPT
================================================================================

MemShield may generate protected transcripts.

RAW:

"John said my email is john@example.com and the API key is SECRET123."

PROTECTED:

"John said my email is [EMAIL REDACTED] and the API key is [API KEY BLOCKED]."

The protected transcript may be stored or passed to AI.


================================================================================
31. PROTECTED SUMMARY
================================================================================

AI summaries must also be checked.

Pipeline:

Protected Transcript
        |
        v
AI Summary
        |
        v
MemShield Output Protection
        |
        v
Protected Summary
        |
        v
Storage / Display


================================================================================
32. PDF OUTPUT
================================================================================

MemShield may generate:

1. Protected Transcript PDF
2. Protected Summary PDF
3. Action Items PDF

PDFs must not contain protected values that should have been masked or blocked.


================================================================================
33. ENCRYPTION
================================================================================

Encryption is required for sensitive data that must be persisted.

Network:

TLS / HTTPS

Storage:

AES-256 or equivalent authenticated encryption

Requirements:

- Encryption keys must not be hard-coded.
- Keys must be stored in environment variables or secret management.
- Highly sensitive fields should support application-level encryption.
- Plaintext secrets must not appear in logs.


================================================================================
34. DATA MINIMIZATION
================================================================================

MemShield must store the minimum necessary information.

DEFAULT:

Raw sensitive content:
DO NOT STORE

Protected content:
STORE ONLY WHEN REQUIRED

Detection metadata:
STORE

Audit metadata:
STORE

Temporary processing data:
DELETE AFTER PROCESSING


================================================================================
35. SECURE CLEANUP
================================================================================

At session completion:

Session End
    |
    v
Stop Processing
    |
    v
Delete Temporary Files
    |
    v
Clear Temporary Sensitive Data
    |
    v
Close Session
    |
    v
Write Cleanup Event


================================================================================
36. LOGGING RULES
================================================================================

Application logs MUST NOT contain:

- Passwords
- API keys
- Tokens
- Aadhaar numbers
- PAN numbers
- Credit card numbers
- Bank credentials
- Raw private information

Instead:

GOOD:

"PASSWORD detected and blocked."

BAD:

"PASSWORD detected: Secret123."


================================================================================
37. AUDIT LOGGING
================================================================================

Audit logs should record:

- Event ID
- User ID
- Session ID
- Event type
- Data type
- Sensitivity
- Action
- Confidence
- Timestamp
- Source

Example:

{
  "event_type": "SENSITIVE_DATA_BLOCKED",
  "data_type": "PASSWORD",
  "sensitivity": "HIGHLY_CONFIDENTIAL",
  "action": "BLOCK",
  "confidence": 0.98
}

Audit logs must not contain raw values.


================================================================================
38. MONITORING
================================================================================

Monitor:

- Protection status
- Detection count
- Mask count
- Block count
- Policy violations
- Processing failures
- AI failures
- Session count
- Cleanup failures

Dashboard statistics:

Total Detected
Total Masked
Total Blocked
Active Sessions
Protection Status


================================================================================
39. DASHBOARD
================================================================================

The dashboard is the control center for MemShield.

Required screens:

1. Login
2. Register
3. Dashboard
4. Live Protection
5. Detection History
6. Detection Details
7. Policies
8. Sessions
9. Session Details
10. Audit Logs
11. Settings

Dashboard must show:

Protection Status
Active Sessions
Detected Data
Masked Data
Blocked Data
Recent Events


================================================================================
40. LOGIN SCREEN
================================================================================

Fields:

- Email
- Password

Actions:

- Login
- Register
- Forgot Password (future)

Requirements:

- Secure authentication.
- Invalid login must fail.
- Protected pages require authentication.


================================================================================
41. REGISTER SCREEN
================================================================================

Fields:

- Name
- Email
- Password
- Confirm Password

Requirements:

- Validate email.
- Validate password.
- Prevent duplicate email.
- Hash password before storage.


================================================================================
42. LIVE PROTECTION SCREEN
================================================================================

Shows:

- Current protection status
- Current session
- Processing status
- Detection count
- Mask count
- Block count
- Recent events
- Protected content preview

Example:

RAW:

"My email is john@example.com."

PROTECTED:

"My email is [EMAIL REDACTED]."


================================================================================
43. DETECTION HISTORY
================================================================================

Shows:

- Detection type
- Sensitivity
- Confidence
- Action
- Timestamp
- Session

Must not display raw sensitive values by default.


================================================================================
44. POLICY SCREEN
================================================================================

User/Admin can configure:

Data Type
Sensitivity
Action
Enabled/Disabled

Example:

EMAIL -> MASK
PASSWORD -> BLOCK
PHONE -> MASK
NAME -> ALLOW


================================================================================
45. AUDIT SCREEN
================================================================================

Shows:

- Event type
- Data type
- Action
- Session
- Timestamp
- User

Raw sensitive values must never be shown.


================================================================================
46. SETTINGS SCREEN
================================================================================

Settings:

- Protection enabled/disabled
- Detection mode
- AI protection
- Notifications
- Session settings
- Security settings

Important:

If protection is disabled, UI must clearly indicate:

"MemShield Protection is OFF"

The application must never claim protection is active when it is not.


================================================================================
47. AUTHENTICATION
================================================================================

MVP:

Email + Password

Authentication mechanism:

JWT or secure session-based authentication.

Requirements:

- Password hashing
- Token/session validation
- Protected API routes
- Logout
- Authorization
- Role checking
- Rate limiting


================================================================================
48. USER ROLES
================================================================================

USER:

Can:

- Login
- View own dashboard
- View own sessions
- View own detections
- View own audit events
- Manage allowed policies
- Start/stop protection

ADMIN:

Can additionally:

- Manage organization policies
- Manage users
- View organization-level events
- Configure system settings


================================================================================
49. DATABASE
================================================================================

MVP:

SQLite

Production:

PostgreSQL

Core tables:

1. users
2. settings
3. policies
4. sessions
5. detection_events
6. sanitized_content
7. audit_logs


================================================================================
50. USERS TABLE
================================================================================

users:

id
name
email
password_hash
role
created_at
updated_at
last_login


================================================================================
51. SETTINGS TABLE
================================================================================

settings:

id
user_id
protection_enabled
detection_mode
processing_mode
notification_enabled
created_at
updated_at


================================================================================
52. POLICIES TABLE
================================================================================

policies:

id
owner_id
scope
data_type
sensitivity
action
enabled
created_at
updated_at


================================================================================
53. SESSIONS TABLE
================================================================================

sessions:

id
user_id
source
status
started_at
ended_at
total_detected
total_masked
total_blocked


================================================================================
54. DETECTION EVENTS TABLE
================================================================================

detection_events:

id
session_id
data_type
sensitivity
confidence
risk_score
action
source
created_at

DO NOT STORE RAW DETECTED VALUE.


================================================================================
55. SANITIZED CONTENT TABLE
================================================================================

sanitized_content:

id
session_id
content
content_type
created_at

Only sanitized/protected content should be stored.


================================================================================
56. AUDIT LOGS TABLE
================================================================================

audit_logs:

id
user_id
session_id
event_type
action
data_type
timestamp
metadata

Never store raw secrets.


================================================================================
57. BACKEND TECHNOLOGY
================================================================================

Recommended:

Python
FastAPI
SQLAlchemy
Pydantic
Alembic
JWT Authentication
PostgreSQL for production
SQLite for MVP

Backend responsibilities:

- API
- Authentication
- Session management
- MemShield engine
- Detection
- Policy
- Permissions
- AI gateway
- Audit
- Storage


================================================================================
58. FRONTEND TECHNOLOGY
================================================================================

Recommended:

React
TypeScript
Vite
Tailwind CSS

Frontend responsibilities:

- Authentication UI
- Dashboard
- Protection monitor
- Policy management
- Audit logs
- Session management
- Settings

Frontend must not implement the core security decision logic.


================================================================================
59. BROWSER EXTENSION
================================================================================

The browser extension is an optional client.

Responsibilities:

- Detect protected context
- Authenticate
- Start MemShield session
- Send content to MemShield
- Receive protected content
- Show protection status

The extension must NOT duplicate the main detection/policy engine.

Core protection remains inside MemShield.


================================================================================
60. SPEECH-TO-TEXT
================================================================================

Audio mode:

Audio
    |
    v
Speech-to-Text
    |
    v
Transcript
    |
    v
MemShield
    |
    v
Protected Transcript


Recommended MVP technology:

Faster-Whisper / Whisper


================================================================================
61. MEETING INTEGRATION
================================================================================

Future integrations:

- Microsoft Teams
- Zoom
- Google Meet

Meeting integration is an adapter.

Architecture:

Teams / Zoom / Meet
        |
        v
Meeting Adapter
        |
        v
MemShield API
        |
        v
MemShield Core


================================================================================
62. MEETING ADAPTER INTERFACE
================================================================================

Each meeting provider should support:

detect_session()
start_session()
receive_transcript()
stop_session()

Meeting providers must NOT contain:

- Policy engine
- Detection engine
- Masking engine
- Permission engine

Those remain in MemShield.


================================================================================
63. API BASE URL
================================================================================

All backend APIs use:

/api/v1


================================================================================
64. HEALTH API
================================================================================

GET /api/v1/health

Returns:

- API status
- Database status
- Protection engine status
- AI gateway status


================================================================================
65. AUTH APIs
================================================================================

POST /api/v1/auth/register
POST /api/v1/auth/login
GET  /api/v1/auth/me
POST /api/v1/auth/logout


================================================================================
66. PROTECTION APIs
================================================================================

POST /api/v1/protection/analyze

POST /api/v1/protection/sanitize

Example:

POST /api/v1/protection/sanitize

Request:

{
  "session_id": "session_123",
  "content": "My email is john@example.com",
  "source": "transcript"
}

Response:

{
  "safe_content": "My email is [EMAIL REDACTED]",
  "detections": [
    {
      "type": "EMAIL",
      "sensitivity": "CONFIDENTIAL",
      "confidence": 0.99,
      "action": "MASK"
    }
  ]
}


================================================================================
67. DETECTION APIs
================================================================================

POST /api/v1/detection/analyze

GET /api/v1/detection/types

GET /api/v1/detection/history


================================================================================
68. POLICY APIs
================================================================================

GET    /api/v1/policies

POST   /api/v1/policies

GET    /api/v1/policies/{id}

PUT    /api/v1/policies/{id}

DELETE /api/v1/policies/{id}


================================================================================
69. SESSION APIs
================================================================================

POST /api/v1/sessions

GET /api/v1/sessions

GET /api/v1/sessions/{id}

POST /api/v1/sessions/{id}/start

POST /api/v1/sessions/{id}/stop


================================================================================
70. AUDIT APIs
================================================================================

GET /api/v1/audit

GET /api/v1/audit/{id}


================================================================================
71. AI APIs
================================================================================

POST /api/v1/ai/process

Only sanitized/protected content can be passed to the AI service.


================================================================================
72. SPEECH APIs
================================================================================

POST /api/v1/speech/transcribe

Audio must be converted to text before entering the MemShield protection
pipeline.


================================================================================
73. OUTPUT APIs
================================================================================

GET /api/v1/outputs/{session_id}/transcript

GET /api/v1/outputs/{session_id}/summary

POST /api/v1/outputs/{session_id}/pdf


================================================================================
74. DASHBOARD API
================================================================================

GET /api/v1/dashboard

Example:

{
  "protection_status": "ACTIVE",
  "total_detected": 12,
  "total_masked": 8,
  "total_blocked": 4,
  "active_sessions": 1
}


================================================================================
75. ERROR CODES
================================================================================

AUTH_REQUIRED
AUTH_INVALID
FORBIDDEN
VALIDATION_ERROR
SESSION_NOT_FOUND
POLICY_NOT_FOUND
DETECTION_FAILED
CLASSIFICATION_FAILED
PROTECTION_FAILED
PROTECTION_UNAVAILABLE
AI_PROVIDER_UNAVAILABLE
SPEECH_PROVIDER_UNAVAILABLE
STORAGE_ERROR
CLEANUP_FAILED


================================================================================
76. CRITICAL ERROR BEHAVIOR
================================================================================

If protection fails:

DO NOT SEND RAW CONTENT TO AI.

Example:

Protection Engine Error
        |
        v
PROTECTION_UNAVAILABLE
        |
        v
AI REQUEST BLOCKED
        |
        v
User receives error


================================================================================
77. SECURITY REQUIREMENTS
================================================================================

MemShield MUST:

1. Hash passwords securely.
2. Protect authentication endpoints.
3. Validate authorization.
4. Encrypt network communication.
5. Encrypt sensitive stored information.
6. Never log raw secrets.
7. Never send blocked secrets to AI.
8. Never store raw secrets unnecessarily.
9. Prevent cross-user data access.
10. Protect session IDs.
11. Validate API input.
12. Rate-limit authentication.
13. Use secure headers.
14. Restrict CORS.
15. Keep secrets in environment variables.
16. Never hard-code API keys.
17. Fail closed on protection failure.
18. Clean temporary sensitive data.


================================================================================
78. USER DATA ISOLATION
================================================================================

User A must never access:

- User B's sessions
- User B's policies
- User B's detections
- User B's audit logs
- User B's protected content

Every protected resource must be scoped to the authenticated user/organization.


================================================================================
79. DATA RETENTION
================================================================================

Default policy:

RAW SENSITIVE CONTENT:
Do not store.

PROTECTED CONTENT:
Store only when required.

DETECTION METADATA:
Store.

AUDIT EVENTS:
Store.

TEMPORARY PROCESSING DATA:
Delete after processing.

Future enterprise versions may provide configurable retention policies.


================================================================================
80. REPOSITORY STRUCTURE
================================================================================

memshield/
|
+-- apps/
|   |
|   +-- web/
|   |   +-- src/
|   |       +-- pages/
|   |       +-- components/
|   |       +-- layouts/
|   |       +-- hooks/
|   |       +-- services/
|   |       +-- store/
|   |       +-- types/
|   |
|   +-- extension/
|       +-- src/
|           +-- popup/
|           +-- background/
|           +-- content/
|           +-- services/
|
+-- backend/
|   |
|   +-- app/
|       |
|       +-- main.py
|       |
|       +-- api/
|       |   +-- routes/
|       |
|       +-- core/
|       |
|       +-- models/
|       |
|       +-- schemas/
|       |
|       +-- services/
|       |
|       +-- engine/
|       |   +-- pipeline.py
|       |   +-- detector/
|       |   +-- classifier/
|       |   +-- privacy/
|       |   +-- policy/
|       |   +-- masking/
|       |   +-- scoring/
|       |
|       +-- integrations/
|           +-- ai/
|           +-- speech/
|           +-- meetings/
|       |
|       +-- db/
|       |
|       +-- tests/
|
+-- docs/
|
+-- .env.example
+-- docker-compose.yml
+-- README.md
+-- spec.md


================================================================================
81. CORE MODULES
================================================================================

MODULE 1:
Authentication

MODULE 2:
Ingestion

MODULE 3:
Detection

MODULE 4:
Classification

MODULE 5:
Risk Scoring

MODULE 6:
MemPrivacy

MODULE 7:
Permission

MODULE 8:
Policy

MODULE 9:
Masking

MODULE 10:
Encryption

MODULE 11:
Protection Pipeline

MODULE 12:
AI Gateway

MODULE 13:
Session Management

MODULE 14:
Audit

MODULE 15:
Output Protection

MODULE 16:
Monitoring

MODULE 17:
Speech

MODULE 18:
External Integrations


================================================================================
82. CORE SERVICE INTERFACE
================================================================================

The central engine must expose a reusable protection interface.

Concept:

protect(content, context, policy)

Input:

- Content
- User
- Session
- Source
- Destination
- Policy

Output:

- Protected content
- Detections
- Actions
- Risk
- Audit metadata


================================================================================
83. PROTECTION RESULT
================================================================================

Example:

{
  "safe_content": "My email is [EMAIL REDACTED].",
  "risk": "MEDIUM",
  "detections": [
    {
      "type": "EMAIL",
      "sensitivity": "CONFIDENTIAL",
      "confidence": 0.99,
      "action": "MASK"
    }
  ],
  "blocked": false,
  "safe_for_ai": true
}


================================================================================
84. SAFE-FOR-AI CHECK
================================================================================

Before sending content to AI:

1. Confirm MemShield processed it.
2. Confirm protection completed.
3. Confirm blocked data is removed.
4. Confirm no raw sensitive value remains.
5. Confirm policy allows AI processing.
6. Mark request as safe_for_ai=true.

Only then can the AI gateway execute the request.


================================================================================
85. TESTING STRATEGY
================================================================================

Testing must have five levels:

1. Unit Testing
2. Integration Testing
3. API Testing
4. Security Testing
5. End-to-End Testing


================================================================================
86. UNIT TESTING
================================================================================

Test:

- Email detector
- Phone detector
- Aadhaar detector
- PAN detector
- Credit card detector
- Password detector
- API key detector
- Classification
- Confidence scoring
- Risk scoring
- Policy evaluation
- Permission evaluation
- Masking
- Blocking
- Encryption


================================================================================
87. INTEGRATION TESTING
================================================================================

Test:

Input
  |
Detection
  |
Classification
  |
Risk
  |
Permission
  |
Policy
  |
Mask/Block
  |
Safe Output

Every stage must produce valid output for the next stage.


================================================================================
88. API TESTING
================================================================================

Test:

- Registration
- Login
- Logout
- Invalid authentication
- Token validation
- Protection API
- Detection API
- Policy CRUD
- Session CRUD
- Audit API
- AI API
- Speech API
- Dashboard API


================================================================================
89. SECURITY TESTING
================================================================================

Mandatory tests:

TEST 1:
Raw password must not be stored.

TEST 2:
Raw API key must not be stored.

TEST 3:
Raw secret must not be logged.

TEST 4:
Raw secret must not be sent to AI.

TEST 5:
User A cannot access User B data.

TEST 6:
Normal user cannot access admin APIs.

TEST 7:
Expired token is rejected.

TEST 8:
Protection failure blocks AI transmission.

TEST 9:
Protected transcript contains no prohibited raw values.

TEST 10:
Protected PDF contains no prohibited raw values.


================================================================================
90. END-TO-END TEST
================================================================================

Complete test:

Login
  |
Start Session
  |
Submit Content
  |
Detect Sensitive Information
  |
Classify
  |
Risk
  |
Permission
  |
Policy
  |
Mask / Block
  |
Protected Content
  |
AI
  |
AI Output Protection
  |
Audit
  |
Cleanup
  |
Session Complete


================================================================================
91. PERFORMANCE REQUIREMENTS
================================================================================

MVP TARGETS:

Normal text protection:
< 2 seconds excluding external AI latency.

Normal non-AI API request:
Target < 500 ms under development/test load.

Detection:
Must support normal transcript chunks without freezing the UI.

Exact production throughput must be determined by benchmarking.


================================================================================
92. RELIABILITY REQUIREMENTS
================================================================================

MemShield must:

- Handle malformed input.
- Handle empty input.
- Handle large input.
- Handle AI provider failure.
- Handle speech provider failure.
- Handle database failure.
- Handle detection failure.
- Handle policy failure.
- Handle timeout.
- Never silently bypass protection.


================================================================================
93. ACCEPTANCE CRITERIA
================================================================================

AC-01 AUTHENTICATION

Registered users can log in and access protected MemShield functionality.


AC-02 DETECTION

Supported sensitive information is detected with a confidence score.


AC-03 CLASSIFICATION

Every detection receives a sensitivity classification.


AC-04 RISK

Every relevant detection receives a risk level/score.


AC-05 POLICY

Configured policies determine the protection action.


AC-06 MASKING

Masked information is replaced with safe representations.


AC-07 BLOCKING

Blocked information cannot reach the AI provider.


AC-08 AI PRIVACY BOUNDARY

Given:

"My API key is SECRET123."

AI must receive:

"My API key is [API KEY BLOCKED]."

AI must NOT receive:

"SECRET123"


AC-09 AI MEMORY

Prohibited sensitive information must not be stored in AI memory.


AC-10 OUTPUT PROTECTION

AI-generated summaries and outputs are checked before storage/display.


AC-11 AUDIT

Protection events generate audit records.


AC-12 AUDIT PRIVACY

Audit records do not contain raw sensitive values.


AC-13 USER ISOLATION

Users cannot access another user's data.


AC-14 PERMISSION

Unauthorized users cannot access protected information.


AC-15 FAIL CLOSED

If MemShield protection fails, raw content is not sent to AI.


AC-16 CLEANUP

Temporary sensitive data is removed after processing.


AC-17 DASHBOARD

Dashboard statistics accurately represent protection events.


AC-18 POLICY MANAGEMENT

Authorized users can create, update, enable, disable, and delete policies.


AC-19 SESSION MANAGEMENT

Users can start, monitor, and stop protected sessions.


AC-20 API SECURITY

Protected APIs reject unauthenticated and unauthorized requests.


================================================================================
94. PRIMARY DEMONSTRATION
================================================================================

The most important product demonstration is:

INPUT:

"My password is BlueTiger123 and my email is john@example.com."

MemShield:

PASSWORD -> HIGHLY_CONFIDENTIAL -> BLOCK
EMAIL    -> CONFIDENTIAL       -> MASK

PROTECTED OUTPUT:

"My password is [PASSWORD BLOCKED] and my email is [EMAIL REDACTED]."

AI RECEIVES:

"My password is [PASSWORD BLOCKED] and my email is [EMAIL REDACTED]."

AI DOES NOT RECEIVE:

BlueTiger123
john@example.com

DATABASE DOES NOT STORE:

BlueTiger123
john@example.com

AUDIT LOG CONTAINS:

PASSWORD -> BLOCKED
EMAIL -> MASKED


================================================================================
95. MVP SCOPE
================================================================================

MVP MUST INCLUDE:

1. User authentication
2. Text input
3. Sensitive data detection
4. Classification
5. Confidence
6. Risk
7. Policy engine
8. Masking
9. Blocking
10. MemPrivacy permission logic
11. Protected AI gateway
12. AI response protection
13. Session management
14. Audit logging
15. Dashboard
16. Database
17. Security controls
18. Tests
19. Fail-closed behavior


================================================================================
96. MVP DOES NOT REQUIRE
================================================================================

The first working MVP does NOT require:

- Full Teams application
- Full Zoom application
- Full Google Meet application
- Full video conferencing
- Real-time audio streaming
- Enterprise billing
- Multi-region architecture
- Microservices
- Advanced compliance certification
- Complex organization management
- Production-scale distributed infrastructure


================================================================================
97. DEVELOPMENT PHASES
================================================================================

PHASE 1:
MemShield Core

Implement:

Text
  |
Detection
  |
Classification
  |
Risk
  |
Policy
  |
Mask/Block
  |
Safe Text


PHASE 2:
Backend

Implement:

FastAPI
Authentication
Database
Sessions
Policies
Audit


PHASE 3:
AI Gateway

Implement:

Protected AI requests
AI provider abstraction
AI response protection
AI memory protection


PHASE 4:
Dashboard

Implement:

Login
Dashboard
Protection monitor
Detection history
Policies
Audit
Settings


PHASE 5:
Speech

Implement:

Audio
  |
Whisper
  |
Transcript
  |
MemShield


PHASE 6:
Browser Extension

Implement:

Authentication
Session
Protection status
Content communication


PHASE 7:
Meeting Integrations

Implement:

Teams
Zoom
Google Meet

as adapters.


================================================================================
98. ARCHITECTURE PRINCIPLE
================================================================================

MemShield must use a modular architecture.

The privacy engine must be independent from:

- UI
- Browser extension
- Meeting application
- AI provider
- Speech provider

This means:

UI can change.
Meeting provider can change.
AI provider can change.
Speech provider can change.

MemShield Core remains unchanged.


================================================================================
99. HIGH-LEVEL ARCHITECTURE
================================================================================

                         INPUT SOURCES
                              |
          +-------------------+-------------------+
          |                   |                   |
        Text              Transcript            Audio
          |                   |                   |
          |                   |                   v
          |                   |              Speech-to-Text
          |                   |                   |
          +-------------------+-------------------+
                              |
                              v
                       INGESTION LAYER
                              |
                              v
                       DETECTION ENGINE
                              |
                              v
                     CLASSIFICATION ENGINE
                              |
                              v
                         RISK ENGINE
                              |
                              v
                     MEMPRIVACY ENGINE
                       /            \
                      /              \
             PERMISSION             POLICY
                  \                    /
                   \                  /
                    +-------+--------+
                            |
                            v
                     PROTECTION ENGINE
                     /      |       \
                  ALLOW    MASK     BLOCK
                     \      |       /
                      \     |      /
                       +----+-----+
                            |
                            v
                      SAFE CONTENT
                            |
                 +----------+----------+
                 |                     |
                 v                     v
                AI                  STORAGE
                 |                     |
                 v                     v
           AI RESPONSE           PROTECTED DATA
                 |
                 v
        OUTPUT PROTECTION
                 |
                 v
        TRANSCRIPT / SUMMARY
                 |
                 v
            AI MEMORY
                 |
                 v
            AUDIT LOG
                 |
                 v
          SECURE CLEANUP


================================================================================
100. FINAL PRODUCT DEFINITION
================================================================================

MemShield is a privacy middleware and security engine positioned between users
and AI systems.

Its job is not simply to detect sensitive information.

Its complete responsibility is:

DETECT
  ->
CLASSIFY
  ->
SCORE
  ->
IDENTIFY OWNER
  ->
CHECK PERMISSION
  ->
CHECK POLICY
  ->
PROTECT
  ->
VALIDATE
  ->
SEND SAFE CONTENT TO AI
  ->
PROTECT AI OUTPUT
  ->
PROTECT AI MEMORY
  ->
AUDIT
  ->
CLEAN UP


================================================================================
101. GOLDEN RULE
================================================================================

THE MOST IMPORTANT RULE IN THE ENTIRE PROJECT:

NO RAW SENSITIVE INFORMATION MAY CROSS THE MEMSHIELD PRIVACY BOUNDARY WHEN
THE ACTIVE POLICY REQUIRES MASKING OR BLOCKING.

Therefore:

RAW DATA
   |
   X
   |
   X----> AI
   |
   v
MEMSHIELD
   |
   v
SAFE DATA
   |
   v
AI


================================================================================
102. FINAL SUCCESS CONDITION
================================================================================

MemShield is considered successfully implemented when a user can provide
content containing sensitive information and the system can:

1. Detect the sensitive information.
2. Identify its type.
3. Classify its sensitivity.
4. Calculate confidence/risk.
5. Determine ownership/context where applicable.
6. Check permissions.
7. Apply the correct privacy policy.
8. Mask or block the information.
9. Verify that the raw value is no longer present.
10. Send only safe content to the AI.
11. Protect the AI response.
12. Prevent prohibited information from entering AI memory.
13. Record a privacy audit event.
14. Avoid storing the raw sensitive value.
15. Clean temporary sensitive information.
16. Fail closed if protection cannot be guaranteed.

FINAL PRODUCT FLOW:

USER / APPLICATION
        |
        v
      INPUT
        |
        v
    MEMSHIELD
        |
        +--> DETECT
        |
        +--> CLASSIFY
        |
        +--> RISK
        |
        +--> OWNERSHIP
        |
        +--> PERMISSION
        |
        +--> POLICY
        |
        +--> MASK / BLOCK / ALLOW
        |
        +--> VALIDATE
        |
        v
   SAFE CONTENT
        |
        v
       AI
        |
        v
  AI RESPONSE
        |
        v
   MEMSHIELD
        |
        +--> OUTPUT CHECK
        |
        +--> MEMORY CHECK
        |
        v
 PROTECTED OUTPUT
        |
        v
   AUDIT + CLEANUP

MEMSHIELD CORE IS THE SOURCE OF TRUTH.
ALL CLIENTS, MEETING APPLICATIONS, EXTENSIONS, AI PROVIDERS, AND FUTURE
INTEGRATIONS MUST USE THE MEMSHIELD PROTECTION ENGINE RATHER THAN BYPASSING IT.