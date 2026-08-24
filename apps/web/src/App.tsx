import { useState, useEffect } from 'react';
import type { 
  User, 
  DashboardStats, 
  Policy, 
  Session, 
  AuditLog, 
  PolicyAction,
  ThemeMode
} from './types';
import { api } from './services/api';
import { COMPLIANCE_PRESETS } from './data/mockData';

// Components
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { DataFlowBanner } from './components/DataFlowBanner';
import { AuthModal } from './components/AuthModal';

// Feature Tabs
import { OverviewTab } from './components/tabs/OverviewTab';
import { ProtectionPlaygroundTab } from './components/tabs/ProtectionPlaygroundTab';
import { MemoryShieldTab } from './components/tabs/MemoryShieldTab';
import { PoliciesTab } from './components/tabs/PoliciesTab';
import { SessionsTab } from './components/tabs/SessionsTab';
import { AuditLogsTab } from './components/tabs/AuditLogsTab';
import { IntegrationsTab } from './components/tabs/IntegrationsTab';
import { SettingsTab } from './components/tabs/SettingsTab';

export default function App() {
  // Theme State
  const [theme, setTheme] = useState<ThemeMode>(() => {
    return (localStorage.getItem("memshield_theme") as ThemeMode) || "cyber";
  });

  const handleSelectTheme = (newTheme: ThemeMode) => {
    setTheme(newTheme);
    localStorage.setItem("memshield_theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  // Auth state
  const [token, setToken] = useState<string | null>(localStorage.getItem("memshield_token") || "demo-token");
  const [user, setUser] = useState<User | null>({
    id: "usr-admin-1",
    name: "Security Lead",
    email: "security@memshield.ai",
    role: "ADMIN",
    organization: "Enterprise AI Security Corp"
  });

  // Navigation
  const [activeTab, setActiveTab] = useState<string>("overview");

  // Core Data
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);

  // Engine state
  const [protectionEnabled, setProtectionEnabled] = useState(true);
  const [activeSession, setActiveSession] = useState<Session | null>(null);

  const loadAllData = async () => {
    try {
      const [u, s, p, sess, aud] = await Promise.all([
        api.getCurrentUser(token),
        api.getDashboardStats(token),
        api.getPolicies(token),
        api.getSessions(token),
        api.getAuditLogs(token)
      ]);

      if (u) setUser(u);
      if (s) {
        setStats(s);
        setProtectionEnabled(s.protection_status === "ACTIVE");
      }
      if (p) setPolicies(p);
      if (sess) {
        setSessions(sess);
        const live = sess.find(x => x.status === "ACTIVE");
        if (live) setActiveSession(live);
      }
      if (aud) setAuditLogs(aud);
    } catch (e) {
      console.error("Error loading MemShield data:", e);
    }
  };

  // Initial Load on mount and on token change
  useEffect(() => {
    if (token) {
      localStorage.setItem("memshield_token", token);
      loadAllData();
    } else {
      localStorage.removeItem("memshield_token");
      setUser(null);
    }
  }, [token]);

  const handleAuthSuccess = (newToken: string, newUser: User) => {
    setToken(newToken);
    setUser(newUser);
    loadAllData();
  };

  const handleLogout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("memshield_token");
  };

  // Policy actions
  const handleTogglePolicy = async (policyId: string, enabled: boolean) => {
    await api.updatePolicy(token, policyId, { enabled });
    const updated = await api.getPolicies(token);
    setPolicies(updated);
  };

  const handleActionChange = async (policyId: string, action: PolicyAction) => {
    await api.updatePolicy(token, policyId, { action });
    const updated = await api.getPolicies(token);
    setPolicies(updated);
  };

  const handleApplyPreset = async (presetId: string) => {
    const preset = COMPLIANCE_PRESETS.find(p => p.id === presetId);
    if (!preset) return;

    // Apply rule changes across matching policies
    const updatedPolicies = policies.map(p => {
      const targetAction = preset.rules[p.data_type];
      if (targetAction) {
        return { ...p, action: targetAction, enabled: true };
      }
      return p;
    });

    setPolicies(updatedPolicies);
  };

  // Session lifecycle
  const handleCreateSession = async () => {
    const newSess = await api.createSession(token, "ai_gateway_proxy");
    setActiveSession(newSess);
    const updatedSessions = await api.getSessions(token);
    setSessions(updatedSessions);
    const updatedStats = await api.getDashboardStats(token);
    setStats(updatedStats);
  };

  const handleStopSession = async (id: string) => {
    await api.stopSession(token, id);
    if (activeSession?.id === id) {
      setActiveSession(null);
    }
    const updatedSessions = await api.getSessions(token);
    setSessions(updatedSessions);
    const updatedStats = await api.getDashboardStats(token);
    setStats(updatedStats);
  };

  const handleToggleGlobalProtection = () => {
    setProtectionEnabled(!protectionEnabled);
    if (stats) {
      setStats({
        ...stats,
        protection_status: !protectionEnabled ? "ACTIVE" : "INACTIVE"
      });
    }
  };

  // Unauthenticated screen
  if (!token) {
    return <AuthModal onSuccess={handleAuthSuccess} />;
  }

  return (
    <div className="min-h-screen bg-[#070914] text-slate-100 flex overflow-hidden font-sans">
      
      {/* SIDEBAR NAVIGATION */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        onLogout={handleLogout}
        activeSessionsCount={stats?.active_sessions || sessions.filter(s => s.status === "ACTIVE").length}
        totalBlockedCount={stats?.total_blocked}
      />

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden relative z-10">
        
        {/* Top Header */}
        <Header
          activeTab={activeTab}
          protectionEnabled={protectionEnabled}
          onRefresh={loadAllData}
          onLaunchSimulator={() => setActiveTab("playground")}
          user={user}
          latencyMs={9}
          currentTheme={theme}
          onSelectTheme={handleSelectTheme}
        />

        {/* Scrollable Viewport */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 relative">
          
          {/* Main Visual Data Flow & Positioning Banner */}
          <DataFlowBanner
            protectionEnabled={protectionEnabled}
            totalMasked={stats?.total_masked}
            totalBlocked={stats?.total_blocked}
            activeSessions={stats?.active_sessions}
          />

          {/* TAB 1: OVERVIEW */}
          {activeTab === "overview" && (
            <OverviewTab
              stats={stats}
              onNavigateTab={setActiveTab}
              onLaunchPlayground={() => setActiveTab("playground")}
            />
          )}

          {/* TAB 2: PROTECTION PLAYGROUND */}
          {activeTab === "playground" && (
            <ProtectionPlaygroundTab
              token={token}
              activeSession={activeSession}
              onCreateSession={handleCreateSession}
              onStopSession={handleStopSession}
              onRefreshStats={loadAllData}
            />
          )}

          {/* TAB 3: AI MEMORY SHIELD */}
          {activeTab === "memory_shield" && (
            <MemoryShieldTab />
          )}

          {/* TAB 4: POLICIES */}
          {activeTab === "policies" && (
            <PoliciesTab
              policies={policies}
              onTogglePolicy={handleTogglePolicy}
              onActionChange={handleActionChange}
              onApplyPreset={handleApplyPreset}
            />
          )}

          {/* TAB 5: SESSIONS */}
          {activeTab === "sessions" && (
            <SessionsTab
              token={token}
              sessions={sessions}
              onCreateSession={handleCreateSession}
              onRefreshSessions={loadAllData}
            />
          )}

          {/* TAB 6: AUDIT LOGS */}
          {activeTab === "audit" && (
            <AuditLogsTab logs={auditLogs} />
          )}

          {/* TAB 7: INTEGRATIONS & SDK */}
          {activeTab === "integrations" && (
            <IntegrationsTab />
          )}

          {/* TAB 8: SETTINGS & CONTROL CENTER */}
          {activeTab === "settings" && (
            <SettingsTab
              protectionEnabled={protectionEnabled}
              onToggleGlobalProtection={handleToggleGlobalProtection}
              currentTheme={theme}
              onSelectTheme={handleSelectTheme}
            />
          )}

        </div>
      </main>

    </div>
  );
}
